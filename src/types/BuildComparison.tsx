import { Archtype, Build } from './Builds';

export interface BuildComparison {
    keyOrder: string[];
    buildOrder: string[];
    buildTypes: Archtype[];
    builds: Map<string, Map<string, Build>>;
}