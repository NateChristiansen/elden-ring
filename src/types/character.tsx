export enum Stats {
    Vigor = 'vigor',
    Mind = 'mind',
    Endurance = 'endurance',
    Strength = 'strength',
    Dexterity = 'dexterity',
    Intelligence = 'intelligence',
    Faith = 'faith',
    Arcane = 'arcane'
}

export interface StartingClass {
    name: string,
    startingLevel: number,
    startingStats: Record<Stats, number>
}

export interface TargetBuild {
    targetLevel: number,
    targetStats: Record<Stats, number>
    damageStatTarget: number;
    damageStats: Record<Stats, boolean>
}

export interface CharacterBuild {
    startingClass: StartingClass;
    targetBuild: TargetBuild;
    level: number;
    stats: Record<Stats, number>;
    freeStats: number;
    wastedStats: number;
    buildType: BuildType;
}

export interface BuildType {
    primaryStat: Stats;
    secondaryStat?: Stats;
}

export interface BuildData {
    minLevel: Record<string, number>;
    flexStats: Record<string, number>;
    wastedStats: Record<string, number>;
}

export interface BuildTypeRow {
    buildType: string,
    classBuildData: BuildData
}