import { Archtype, Build, Stats } from '../types/Builds';

export function getMinLevel(build: Build) {
    let level = build.startingClass.startingLevel;
    const stats = build.stats;
    const startingStats = build.startingClass.startingStats;

    level += stats.vigor - startingStats.vigor;
    level += stats.mind - startingStats.mind;
    level += stats.endurance - startingStats.endurance;
    level += stats.strength - startingStats.strength;
    level += stats.dexterity - startingStats.dexterity;
    level += stats.intelligence - startingStats.intelligence;
    level += stats.faith - startingStats.faith;
    level += stats.arcane - startingStats.arcane;

    return level;
}

export function getFlexStats(build: Build) {
    return build.targetBuild.targetLevel - getMinLevel(build);
}

export function getWastedStats(build: Build) {
    let wasted = 0;
    const startingStats = build.startingClass.startingStats;
    const targetStats = build.targetBuild.targetStats;

    wasted += getUtilityWastedStats(startingStats.vigor, targetStats.vigor);
    wasted += getUtilityWastedStats(startingStats.mind, targetStats.mind);
    wasted += getUtilityWastedStats(startingStats.endurance, targetStats.endurance);

    wasted += getDamageWastedStats(build, Stats.Strength, startingStats.strength, targetStats.strength);
    wasted += getDamageWastedStats(build, Stats.Dexterity, startingStats.dexterity, targetStats.dexterity);
    wasted += getDamageWastedStats(build, Stats.Intelligence, startingStats.intelligence, targetStats.intelligence);
    wasted += getDamageWastedStats(build, Stats.Faith, startingStats.faith, targetStats.faith);
    wasted += getDamageWastedStats(build, Stats.Arcane, startingStats.arcane, targetStats.arcane);

    return wasted;
}

export function getUtilityWastedStats(startingStat: number, targetStat: number): number {
    return Math.max(startingStat - targetStat, 0);
}

function getDamageWastedStats(build: Build, stat: Stats, startingStat: number, targetStat: number): number {
    if (!isDamageStat(stat, build.buildType)) {
        return Math.max(startingStat - targetStat, 0);
    }

    return Math.max(startingStat - build.targetBuild.damageStatTarget, 0);
}

function isDamageStat(stat: Stats, buildType: Archtype): boolean {
    return buildType.primaryStat === stat || buildType.secondaryStat === stat;
}