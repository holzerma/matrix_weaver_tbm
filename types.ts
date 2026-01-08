
export interface EmployeeSkill {
    skillId: string;
    proficiency: number; // 1-5 scale
}

export interface Skill {
    id: string;
    name: string;
    category: string;
}

export interface FunctionalTeam {
    id: string;
    name: string;
    description: string;
    type: 'Product' | 'Service';
    operatingModel: 'Scrum' | 'Kanban' | 'Project' | 'IT-Demand' | 'Other';
}

export interface Employee {
    id: string;
    name: string;
    role: string;
    salary: number;
    competenceId: string;
    valueStreamIds: string[];
    functionalTeamIds: string[]; // New field
    employeeType: 'internal' | 'external';
    isManager: boolean;
    skills: EmployeeSkill[];
}

export interface CostAllocation {
    costPoolId: string;
    annualCost: number;
}

export interface ResourceTower {
    id: string;
    name: string;
    tower: string;
    domain: string;
}

export interface CostPool {
    id:string;
    name: string;
    category: string;
    defaultResourceTowerId: string;
}

// Relaxed from union type to string to support dynamic user creation
export type SolutionType = string;
export type SolutionClassification = 'Product' | 'Service';

export interface SolutionTypeDefinition {
    id: string;
    name: string;
    description: string;
    colorTheme: 'sky' | 'lime' | 'amber' | 'rose' | 'slate' | 'violet' | 'indigo' | 'emerald';
}

export interface Service {
    id: string;
    name: string;
    description: string;
}

export interface SolutionCategory {
    id: string;
    name: string;
    description: string;
    type: SolutionType;
}

export interface ValueStream {
    id: string;
    name: string;
    description: string;
    costPoolConsumption: CostAllocation[];
    solutionType: SolutionType;
    solutionCategory: string;
    solutionClassification: SolutionClassification;
    serviceIds: string[];
}

// Updated types
export type CompetenceTeamType = 'Enabling' | 'Crew' | 'Standard' | 'Unassigned';

export interface Competence {
    id: string;
    name: string;
    skill: string;
    teamType: CompetenceTeamType;
    lineTeamName: string;
}

export interface AppData {
    employees: Employee[];
    valueStreams: ValueStream[];
    competences: Competence[];
    costPools: CostPool[];
    resourceTowers: ResourceTower[];
    skills: Skill[];
    services: Service[];
    functionalTeams: FunctionalTeam[]; // New root collection
    solutionCategories: SolutionCategory[];
    solutionTypes?: SolutionTypeDefinition[]; 
}
