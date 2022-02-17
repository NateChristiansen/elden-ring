import { TargetBuild, CharacterBuild, StartingClass, Stats, BuildType, BuildData, BuildTypeRow } from '../types/character';

export function getBuildTypeString(buildType: BuildType): string {
    if (buildType.secondaryStat) {
        return `${buildType.primaryStat}/${buildType.secondaryStat}`;
    }

    return buildType.primaryStat;
}

function getOrDefaultBuildData(buildRows: Map<string, BuildData>, key: string): BuildData {
    const row = buildRows.get(key);
    if (row && row != undefined) {
        return row;
    }
    return {
        minLevel: {},
        flexStats: {},
        wastedStats: {},
    } as BuildData;
}

export function getBuildTable(builds: CharacterBuild[], classes: string[]): BuildTypeRow[] {
    builds.sort((a, b) => {
        if (a.buildType.secondaryStat && b.buildType.secondaryStat) {
            if (a.buildType.primaryStat.localeCompare(b.buildType.primaryStat)) {
                return a.buildType.secondaryStat.localeCompare(b.buildType.secondaryStat);
            }
        }

        return a.buildType.secondaryStat ? 1 : -1;
    });

    const buildRows = new Map<string, BuildData>();

    builds.forEach(build => {
        const key = getBuildTypeString(build.buildType);
        const classBuildData = getOrDefaultBuildData(buildRows, key);

        classBuildData['minLevel'][build.startingClass.name.toLowerCase()] = build.level;
        classBuildData['flexStats'][build.startingClass.name.toLowerCase()] = build.freeStats;
        classBuildData['wastedStats'][build.startingClass.name.toLowerCase()] = build.wastedStats;

        buildRows.set(key, classBuildData);
    });

    const buildTypeRows = [] as BuildTypeRow[];

    buildRows.forEach((value, key) => buildTypeRows.push({
        buildType: key,
        classBuildData: value
    }));
    return buildTypeRows;
}

export function generateAllBuilds(startingClass: StartingClass, targetBuild: TargetBuild): CharacterBuild[] {
    return getBuildTypes(targetBuild).map(buildType => generateBuild(startingClass, targetBuild, buildType));
}

export function generateBuild(startingClass: StartingClass, targetBuild: TargetBuild, buildType: BuildType): CharacterBuild {
    const build = {} as CharacterBuild;
    build.startingClass = startingClass;
    build.targetBuild = targetBuild;
    build.level = startingClass.startingLevel;
    build.buildType = buildType;
    build.stats = {
        ...startingClass.startingStats
    };
    build.wastedStats = 0;
    calculateLevel(build, Stats.Vigor, buildType, targetBuild.damageStats.vigor);
    calculateLevel(build, Stats.Mind, buildType, targetBuild.damageStats.mind);
    calculateLevel(build, Stats.Endurance, buildType, targetBuild.damageStats.endurance);
    calculateLevel(build, Stats.Strength, buildType, targetBuild.damageStats.strength);
    calculateLevel(build, Stats.Dexterity, buildType, targetBuild.damageStats.dexterity);
    calculateLevel(build, Stats.Intelligence, buildType, targetBuild.damageStats.intelligence);
    calculateLevel(build, Stats.Faith, buildType, targetBuild.damageStats.faith);
    calculateLevel(build, Stats.Arcane, buildType, targetBuild.damageStats.arcane);

    build.freeStats = build.targetBuild.targetLevel - build.level;
    return build;
}

function calculateLevel(build: CharacterBuild, stat: Stats, buildType: BuildType, isDamageStat: boolean): void {
    const targetStat = build.targetBuild.targetStats[stat];
    const defaultStat = build.startingClass.startingStats[stat];
    const damageStatValue = build.targetBuild.damageStatTarget;

    const statLevel = getBuildStatLevel(targetStat, defaultStat, damageStatValue, isBuildType(stat, buildType));
    const difference = statLevel - defaultStat;
    build.stats[stat] = statLevel;
    build.level += Math.max(difference, 0);
    if (isDamageStat && !isBuildType(stat, buildType)) {
        build.wastedStats += Math.abs(Math.min(targetStat - statLevel, 0));
    }
}

function getBuildStatLevel(targetStat: number, defaultStat: number, damageStatValue: number, isBuildType: boolean) {
    if (isBuildType) {
        return Math.max(damageStatValue, defaultStat);
    }
    return Math.max(targetStat, defaultStat);
}

function isBuildType(stat: Stats, buildType: BuildType) {
    return buildType.primaryStat === stat || buildType.secondaryStat === stat;
}

function getBuildTypes(targetBuild: TargetBuild): BuildType[] {
    const buildTypes = [] as BuildType[];

    getBuildType(targetBuild, Stats.Strength, null, buildTypes);
    getBuildType(targetBuild, Stats.Dexterity, null, buildTypes);
    getBuildType(targetBuild, Stats.Intelligence, null, buildTypes);
    getBuildType(targetBuild, Stats.Faith, null, buildTypes);
    getBuildType(targetBuild, Stats.Arcane, null, buildTypes);

    //hybrids
    getBuildType(targetBuild, Stats.Strength, Stats.Dexterity, buildTypes);
    getBuildType(targetBuild, Stats.Strength, Stats.Intelligence, buildTypes);
    getBuildType(targetBuild, Stats.Strength, Stats.Faith, buildTypes);
    getBuildType(targetBuild, Stats.Strength, Stats.Arcane, buildTypes);
    getBuildType(targetBuild, Stats.Dexterity, Stats.Intelligence, buildTypes);
    getBuildType(targetBuild, Stats.Dexterity, Stats.Faith, buildTypes);
    getBuildType(targetBuild, Stats.Dexterity, Stats.Arcane, buildTypes);
    getBuildType(targetBuild, Stats.Intelligence, Stats.Faith, buildTypes);
    getBuildType(targetBuild, Stats.Intelligence, Stats.Arcane, buildTypes);
    getBuildType(targetBuild, Stats.Faith, Stats.Arcane, buildTypes);

    return buildTypes;
}

function getBuildType(targetBuild: TargetBuild, stat1: Stats, stat2: Stats | null, buildTypes: BuildType[]) {
    if (!targetBuild.damageStats[stat1]) return;
    if (stat2 === null) {
        buildTypes.push({
            primaryStat: stat1,
            isHybrid: false
        } as BuildType);
        return;
    }
    if (!targetBuild.damageStats[stat2]) {
        return;
    }
    buildTypes.push({
        primaryStat: stat1,
        secondaryStat: stat2,
        isHybrid: true
    } as BuildType);
}