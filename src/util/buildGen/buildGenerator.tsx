import { BuildComparison } from '../../types/BuildComparison';
import { TargetBuild, StartingClass, Stats, Archtype, Build } from '../../types/Builds';
import { getBuildTypes } from './getBuildTypes';

import startingClasses from '../../resources/startingClasses.json';

const classNames = Object.keys(startingClasses);

export function getBuildComparisonForTargetBuild(targetBuild: TargetBuild): BuildComparison {
    const buildComparison = {} as BuildComparison;
    buildComparison.keyOrder = classNames;
    buildComparison.buildTypes = getBuildTypes(targetBuild);
    buildComparison.builds = generateBuilds(targetBuild, buildComparison.buildTypes);

    buildComparison.buildOrder = buildComparison.buildTypes.sort((a, b) => sortBuildTypes(a, b)).map(buildType => buildType.text);

    return buildComparison;
}

function sortBuildTypes(a: Archtype, b: Archtype): number {
    const aPrimary = a.primaryStat, bPrimary = b.primaryStat, aSecondary = a.secondaryStat, bSecondary = b.secondaryStat;

    if (!aSecondary && !bSecondary) {
        return compareStat(a.primaryStat, b.primaryStat);
    }

    if (!aSecondary) {
        return -1;
    }

    if (!bSecondary) {
        return 1;
    }

    if (aPrimary === bPrimary) {
        return compareStat(aSecondary, bSecondary);
    }

    return compareStat(aPrimary, bPrimary);
}

function compareStat(a: Stats, b: Stats): number {
    return a.toString().localeCompare(b.toString());
}

export function generateBuilds(targetBuild: TargetBuild, buildTypes: Archtype[]): Map<string, Map<string, Build>> {
    const builds = new Map<string, Map<string, Build>>();
    buildTypes.forEach(buildType => {
        addToBuildMap(generateBuild(startingClasses.astrologer, targetBuild, buildType), builds);
        addToBuildMap(generateBuild(startingClasses.bandit, targetBuild, buildType), builds);
        addToBuildMap(generateBuild(startingClasses.confessor, targetBuild, buildType), builds);
        addToBuildMap(generateBuild(startingClasses.hero, targetBuild, buildType), builds);
        addToBuildMap(generateBuild(startingClasses.prisoner, targetBuild, buildType), builds);
        addToBuildMap(generateBuild(startingClasses.prophet, targetBuild, buildType), builds);
        addToBuildMap(generateBuild(startingClasses.samurai, targetBuild, buildType), builds);
        addToBuildMap(generateBuild(startingClasses.vagabond, targetBuild, buildType), builds);
        addToBuildMap(generateBuild(startingClasses.warrior, targetBuild, buildType), builds);
        addToBuildMap(generateBuild(startingClasses.wretch, targetBuild, buildType), builds);
    });

    return builds;
}

function addToBuildMap(build: Build, builds: Map<string, Map<string, Build>>): void {
    if (!builds.has(build.buildType.text)) {
        builds.set(build.buildType.text, new Map<string, Build>());
    }
    builds.get(build.buildType.text)?.set(build.startingClass.name, build);
}

export function generateBuild(startingClass: StartingClass, targetBuild: TargetBuild, buildType: Archtype,): Build {
    const build = {} as Build;
    build.startingClass = startingClass;
    build.targetBuild = targetBuild;
    build.buildType = buildType;
    build.stats = {
        ...startingClass.startingStats
    };
    build.stats.vigor = getStatLevel(build, Stats.Vigor, buildType);
    build.stats.mind = getStatLevel(build, Stats.Mind, buildType);
    build.stats.endurance = getStatLevel(build, Stats.Endurance, buildType);
    build.stats.strength = getStatLevel(build, Stats.Strength, buildType);
    build.stats.dexterity = getStatLevel(build, Stats.Dexterity, buildType);
    build.stats.intelligence = getStatLevel(build, Stats.Intelligence, buildType);
    build.stats.faith = getStatLevel(build, Stats.Faith, buildType);
    build.stats.arcane = getStatLevel(build, Stats.Arcane, buildType);

    return build;
}

function getStatLevel(build: Build, stat: Stats, buildType: Archtype): number {
    const targetStat = build.targetBuild.targetStats[stat];
    const defaultStat = build.startingClass.startingStats[stat];
    const damageStatValue = build.targetBuild.damageStatTarget;

    return getBuildStatLevel(targetStat, defaultStat, damageStatValue, isStatInBuildType(stat, buildType));
}

function getBuildStatLevel(targetStat: number, defaultStat: number, damageStatTarget: number, isArchtype: boolean) {
    if (isArchtype) {
        return Math.max(damageStatTarget, defaultStat);
    }
    return Math.max(targetStat, defaultStat);
}

function isStatInBuildType(stat: Stats, buildType: Archtype) {
    return buildType.primaryStat === stat || buildType.secondaryStat === stat;
}
