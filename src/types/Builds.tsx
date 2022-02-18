export interface TargetBuild {
    targetLevel: number;
    targetStats: Record<Stats, number>;
    damageStatTarget: number;
    damageStats: Record<Stats, boolean>;
}

export interface Build {
    startingClass: StartingClass;
    targetBuild: TargetBuild;
    stats: Record<Stats, number>;
    buildType: Archtype;
}

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
    name: string;
    startingLevel: number;
    startingStats: Record<Stats, number>;
}

export interface Archtype {
    primaryStat: Stats;
    secondaryStat?: Stats;
    text: string;
}