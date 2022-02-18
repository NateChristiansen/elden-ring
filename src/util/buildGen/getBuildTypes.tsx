import { TargetBuild, Stats, Archtype } from '../../types/Builds';

export function getAllBuildTypes(): Archtype[] {
    return [
        getBuildType(Stats.Strength, undefined),
        getBuildType(Stats.Dexterity, undefined),
        getBuildType(Stats.Intelligence, undefined),
        getBuildType(Stats.Faith, undefined),
        getBuildType(Stats.Arcane, undefined),

        //hybrids
        getBuildType(Stats.Strength, Stats.Dexterity),
        getBuildType(Stats.Strength, Stats.Intelligence),
        getBuildType(Stats.Strength, Stats.Faith),
        getBuildType(Stats.Strength, Stats.Arcane),
        getBuildType(Stats.Dexterity, Stats.Intelligence),
        getBuildType(Stats.Dexterity, Stats.Faith),
        getBuildType(Stats.Dexterity, Stats.Arcane),
        getBuildType(Stats.Intelligence, Stats.Faith),
        getBuildType(Stats.Intelligence, Stats.Arcane),
        getBuildType(Stats.Faith, Stats.Arcane),
    ];
}

export function getBuildTypes(targetBuild: TargetBuild): Archtype[] {
    const buildTypes = getAllBuildTypes();
    return buildTypes.filter(build => isBuildTypeWanted(build.primaryStat, build.secondaryStat, targetBuild));
}

export function getBuildType(primaryStat: Stats, secondaryStat: Stats | undefined): Archtype {
    if (!secondaryStat) {
        return {
            primaryStat: primaryStat,
            text: getBuildTypeString(primaryStat)
        } as Archtype;
    }
    return {
        primaryStat: primaryStat,
        secondaryStat: secondaryStat,
        text: getHybridBuildTypeString(primaryStat, secondaryStat)
    } as Archtype;
}

export function getHybridBuildTypeString(primaryStat: Stats, secondaryStat: Stats): string {
    return `${primaryStat.substring(0, 3)}/${secondaryStat.substring(0, 3)}`;
}

export function getBuildTypeString(stat: Stats): string {
    return stat.substring(0, 3);
}

function isBuildTypeWanted(primaryStat: Stats, secondaryStat: Stats | undefined, targetBuild: TargetBuild): boolean {
    if (!secondaryStat) {
        return isStatWanted(primaryStat, targetBuild);
    }
    return isStatWanted(primaryStat, targetBuild) && isStatWanted(secondaryStat, targetBuild);
}

export function isStatWanted(stat: Stats, targetBuild: TargetBuild): boolean {
    return targetBuild.damageStats[stat];
}