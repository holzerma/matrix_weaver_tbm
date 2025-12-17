
export interface EmployeeSkill {
    skillId: string;
    proficiency: number; // 1-5 scale
}

export interface Skill {
    id: string;
    name: string;
    category: string;
}

export interface Employee {
    id: string;
    name: string;
    role: string;
    salary: number;
    competenceId: string;
    valueStreamIds: string[];
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

export type SolutionType = 'Business' | 'Workplace' | 'Infrastructure' | 'Delivery' | 'Shared & Corporate' | 'Artificial Intelligence';
export type SolutionClassification = 'Product' | 'Service';

export interface Service {
    id: string;
    name: string;
    description: string;
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

export type CompetenceTeamType = 'Product Team' | 'Crew' | 'Enabling Team' | 'Unassigned';

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
}
