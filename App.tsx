
import React, { useState } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { initialEmployees, initialValueStreams, initialCompetences, initialCostPools, initialResourceTowers, initialSkills, initialServices, initialSolutionCategories, initialSolutionTypes, initialFunctionalTeams, CATEGORY_TYPE_MAP } from './constants';
import { Employee, ValueStream, Competence, CostPool, ResourceTower, AppData, Skill, Service, SolutionCategory, SolutionTypeDefinition, FunctionalTeam, CompetenceTeamType } from './types';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import EmployeeManagement from './components/EmployeeManagement';
import ValueStreamManagement from './components/ValueStreamManagement';
import CompetenceManagement from './components/ChapterManagement';
import CostPoolManagement from './components/CostPoolManagement';
import ResourceTowerManagement from './components/ResourceTowerManagement';
import OrganizationView from './components/OrganizationView';
import DataManager from './components/DataManager';
import FinancialAnalytics from './components/FinancialAnalytics';
import SkillsManagement from './components/SkillsManagement';
import CompetencyMap from './components/CompetencyMap';
import ServiceManagement from './components/ServiceManagement';
import SolutionTaxonomyView from './components/SolutionTaxonomyView';
import SolutionCategoryManagement from './components/SolutionCategoryManagement';
import SolutionTypeManagement from './components/SolutionTypeManagement';
import FunctionalTeamManagement from './components/FunctionalTeamManagement';
import FunctionalView from './components/FunctionalView';
import HealthChecks from './components/HealthChecks';
import ServiceCatalogue from './components/ServiceCatalogue';

type View = 'dashboard' | 'employees' | 'valueStreams' | 'competences' | 'costPools' | 'resourceTowers' | 'orgView' | 'functionalView' | 'financialAnalytics' | 'skills' | 'competencyMap' | 'services' | 'solutionTaxonomy' | 'solutionCategories' | 'solutionTypes' | 'functionalTeams' | 'healthChecks' | 'serviceCatalogue';

const App: React.FC = () => {
    const [view, setView] = useState<View>('dashboard');
    const [employees, setEmployees] = useLocalStorage<Employee[]>('employees', initialEmployees);
    const [valueStreams, setValueStreams] = useLocalStorage<ValueStream[]>('valueStreams', initialValueStreams);
    const [competences, setCompetences] = useLocalStorage<Competence[]>('competences', initialCompetences);
    const [costPools, setCostPools] = useLocalStorage<CostPool[]>('costPools', initialCostPools);
    const [resourceTowers, setResourceTowers] = useLocalStorage<ResourceTower[]>('resourceTowers', initialResourceTowers);
    const [skills, setSkills] = useLocalStorage<Skill[]>('skills', initialSkills);
    const [services, setServices] = useLocalStorage<Service[]>('services', initialServices);
    const [solutionCategories, setSolutionCategories] = useLocalStorage<SolutionCategory[]>('solutionCategories', initialSolutionCategories);
    const [solutionTypes, setSolutionTypes] = useLocalStorage<SolutionTypeDefinition[]>('solutionTypes', initialSolutionTypes);
    const [functionalTeams, setFunctionalTeams] = useLocalStorage<FunctionalTeam[]>('functionalTeams', initialFunctionalTeams);

    const appData: AppData = { employees, valueStreams, competences, costPools, resourceTowers, skills, services, solutionCategories, solutionTypes, functionalTeams };

    const handleAddEmployee = (employee: Employee) => setEmployees(prev => [...prev, employee]);
    const handleUpdateEmployee = (updatedEmployee: Employee) => setEmployees(prev => prev.map(e => e.id === updatedEmployee.id ? updatedEmployee : e));
    const handleDeleteEmployee = (employeeId: string) => setEmployees(prev => prev.filter(e => e.id !== employeeId));
    
    const handleAddValueStream = (vs: ValueStream) => setValueStreams(prev => [...prev, vs]);
    const handleUpdateValueStream = (updatedVs: ValueStream) => setValueStreams(prev => prev.map(vs => vs.id === updatedVs.id ? updatedVs : vs));
    const handleDeleteValueStream = (vsId: string) => setValueStreams(prev => prev.filter(vs => vs.id !== vsId));

    const handleAddCompetence = (comp: Competence) => setCompetences(prev => [...prev, comp]);
    const handleUpdateCompetence = (updatedComp: Competence) => setCompetences(prev => prev.map(c => c.id === updatedComp.id ? updatedComp : c));
    const handleDeleteCompetence = (compId: string) => setCompetences(prev => prev.filter(c => c.id !== compId));

    const handleAddCostPool = (cp: CostPool) => setCostPools(prev => [...prev, cp]);
    const handleUpdateCostPool = (updatedCp: CostPool) => setCostPools(prev => prev.map(cp => cp.id === updatedCp.id ? updatedCp : cp));
    const handleDeleteCostPool = (cpId: string) => setCostPools(prev => prev.filter(cp => cp.id !== cpId));

    const handleAddResourceTower = (rt: ResourceTower) => setResourceTowers(prev => [...prev, rt]);
    const handleUpdateResourceTower = (updatedRt: ResourceTower) => setResourceTowers(prev => prev.map(rt => rt.id === updatedRt.id ? updatedRt : rt));
    const handleDeleteResourceTower = (rtId: string) => setResourceTowers(prev => prev.filter(rt => rt.id !== rtId));

    const handleAddSkill = (skill: Skill) => setSkills(prev => [...prev, skill]);
    const handleUpdateSkill = (updatedSkill: Skill) => setSkills(prev => prev.map(s => s.id === updatedSkill.id ? updatedSkill : s));
    const handleDeleteSkill = (skillId: string) => setSkills(prev => prev.filter(s => s.id !== skillId));
    
    const handleAddService = (service: Service) => setServices(prev => [...prev, service]);
    const handleUpdateService = (updatedService: Service) => setServices(prev => prev.map(s => s.id === updatedService.id ? updatedService : s));
    const handleDeleteService = (serviceId: string) => setServices(prev => prev.filter(s => s.id !== serviceId));

    const handleAddSolutionCategory = (category: SolutionCategory) => setSolutionCategories(prev => [...prev, category]);
    const handleUpdateSolutionCategory = (updatedCategory: SolutionCategory) => {
        const oldCategory = solutionCategories.find(c => c.id === updatedCategory.id);
        setSolutionCategories(prev => prev.map(c => c.id === updatedCategory.id ? updatedCategory : c));
        // Cascade update if name changed
        if (oldCategory && oldCategory.name !== updatedCategory.name) {
            setValueStreams(prev => prev.map(vs => vs.solutionCategory === oldCategory.name ? { ...vs, solutionCategory: updatedCategory.name } : vs));
        }
    };
    const handleDeleteSolutionCategory = (categoryId: string) => setSolutionCategories(prev => prev.filter(c => c.id !== categoryId));

    const handleAddSolutionType = (type: SolutionTypeDefinition) => setSolutionTypes(prev => [...prev, type]);
    const handleUpdateSolutionType = (updatedType: SolutionTypeDefinition) => {
        const oldType = solutionTypes.find(t => t.id === updatedType.id);
        setSolutionTypes(prev => prev.map(t => t.id === updatedType.id ? updatedType : t));
        
        // Cascade update if name changed
        if (oldType && oldType.name !== updatedType.name) {
            // Update Solution Categories that use this type
            setSolutionCategories(prev => prev.map(c => c.type === oldType.name ? { ...c, type: updatedType.name } : c));
            // Update Solutions (ValueStreams) that use this type
            setValueStreams(prev => prev.map(vs => vs.solutionType === oldType.name ? { ...vs, solutionType: updatedType.name } : vs));
        }
    };
    const handleDeleteSolutionType = (typeId: string) => setSolutionTypes(prev => prev.filter(t => t.id !== typeId));

    const handleAddFunctionalTeam = (team: FunctionalTeam) => setFunctionalTeams(prev => [...prev, team]);
    const handleUpdateFunctionalTeam = (updatedTeam: FunctionalTeam) => setFunctionalTeams(prev => prev.map(t => t.id === updatedTeam.id ? updatedTeam : t));
    const handleDeleteFunctionalTeam = (teamId: string) => setFunctionalTeams(prev => prev.filter(t => t.id !== teamId));

    const handleImport = (data: AppData) => {
        // Migration: Ensure employees have functionalTeamIds array if missing
        const migratedEmployees = (data.employees || []).map(emp => ({
            ...emp,
            functionalTeamIds: emp.functionalTeamIds || []
        }));
        setEmployees(migratedEmployees);

        const importedVS = data.valueStreams || [];
        setValueStreams(importedVS);

        // Migration: Map old Competence types to new ones
        const typeMapping: Record<string, CompetenceTeamType> = {
            'Product Team': 'Standard',
            'Enabling Team': 'Enabling',
            'Crew': 'Crew',
            'Unassigned': 'Standard' // or 'Unassigned' depending on preference
        };

        const migratedCompetences = (data.competences || []).map(comp => {
            // Cast to string to check for old values that might not match current Type definition
            const currentType = comp.teamType as string;
            if (typeMapping[currentType]) {
                return { ...comp, teamType: typeMapping[currentType] };
            }
            return comp;
        });
        setCompetences(migratedCompetences);

        setCostPools(data.costPools || []);
        setResourceTowers(data.resourceTowers || []);
        setSkills(data.skills || []);
        setServices(data.services || []);
        
        // Migration for FunctionalTeams:
        // 1. Ensure valueStreamIds exists.
        // 2. BACKWARDS COMPATIBILITY: If valueStreamIds is empty (old data), assume connections based on the employees in that team.
        const migratedFunctionalTeams = (data.functionalTeams || []).map(ft => {
            let vsIds = ft.valueStreamIds || [];
            
            // If team has no connections, infer them from members
            if (vsIds.length === 0) {
                const teamMembers = migratedEmployees.filter(e => e.functionalTeamIds && e.functionalTeamIds.includes(ft.id));
                const uniqueVsIds = new Set<string>();
                teamMembers.forEach(e => {
                    (e.valueStreamIds || []).forEach(vsId => uniqueVsIds.add(vsId));
                });
                vsIds = Array.from(uniqueVsIds);
            }

            return {
                ...ft,
                valueStreamIds: vsIds
            };
        });
        setFunctionalTeams(migratedFunctionalTeams);
        
        // Migration logic for Categories (old format missing type)
        let importedCategories = data.solutionCategories || initialSolutionCategories;
        importedCategories = importedCategories.map(cat => {
            if (!cat.type) {
                // Attempt to find type from map or default to Business
                return {
                    ...cat,
                    type: CATEGORY_TYPE_MAP[cat.name] || 'Business'
                };
            }
            return cat;
        });
        setSolutionCategories(importedCategories);

        // Backward Compatibility for Solution Types
        if (!data.solutionTypes || data.solutionTypes.length === 0) {
            const distinctTypes = new Set<string>();
            importedVS.forEach(vs => { if(vs.solutionType) distinctTypes.add(vs.solutionType); });
            importedCategories.forEach(c => { if(c.type) distinctTypes.add(c.type); });

            const generatedTypes: SolutionTypeDefinition[] = Array.from(distinctTypes).map((name, index) => {
                const defaultType = initialSolutionTypes.find(t => t.name === name);
                return {
                    id: defaultType?.id || `st_gen_${index}`,
                    name: name,
                    description: defaultType?.description || 'Imported Solution Type',
                    colorTheme: defaultType?.colorTheme || 'slate'
                };
            });
            setSolutionTypes(generatedTypes);
        } else {
            setSolutionTypes(data.solutionTypes);
        }
        
        alert('Data imported successfully! Functional Teams have been auto-linked based on member activity.');
    };

    const handleExport = (): AppData => {
        return appData;
    };
    
    const handleSearchSelect = (selectedView: View) => {
        setView(selectedView);
    };

    const renderView = () => {
        switch (view) {
            case 'dashboard':
                return <Dashboard data={appData} />;
            case 'healthChecks':
                return <HealthChecks data={appData} />;
            case 'employees':
                return <EmployeeManagement employees={employees} competences={competences} valueStreams={valueStreams} functionalTeams={functionalTeams} skills={skills} onAddEmployee={handleAddEmployee} onUpdateEmployee={handleUpdateEmployee} onDeleteEmployee={handleDeleteEmployee} />;
            case 'functionalTeams':
                return <FunctionalTeamManagement teams={functionalTeams} employees={employees} valueStreams={valueStreams} onAddTeam={handleAddFunctionalTeam} onUpdateTeam={handleUpdateFunctionalTeam} onDeleteTeam={handleDeleteFunctionalTeam} />;
            case 'valueStreams':
                return <ValueStreamManagement 
                    employees={employees} 
                    valueStreams={valueStreams} 
                    resourceTowers={resourceTowers} 
                    costPools={costPools} 
                    services={services} 
                    functionalTeams={functionalTeams} 
                    solutionCategories={solutionCategories} 
                    solutionTypes={solutionTypes} 
                    onAddValueStream={handleAddValueStream} 
                    onUpdateValueStream={handleUpdateValueStream} 
                    onDeleteValueStream={handleDeleteValueStream} 
                />;
            case 'serviceCatalogue':
                return <ServiceCatalogue data={appData} />;
            case 'competences':
                return <CompetenceManagement employees={employees} competences={competences} onAddCompetence={handleAddCompetence} onUpdateCompetence={handleUpdateCompetence} onDeleteCompetence={handleDeleteCompetence} />;
            case 'costPools':
                return <CostPoolManagement costPools={costPools} resourceTowers={resourceTowers} valueStreams={valueStreams} onAddCostPool={handleAddCostPool} onUpdateCostPool={handleUpdateCostPool} onDeleteCostPool={handleDeleteCostPool} />;
            case 'resourceTowers':
                return <ResourceTowerManagement resourceTowers={resourceTowers} costPools={costPools} valueStreams={valueStreams} onAddResourceTower={handleAddResourceTower} onUpdateResourceTower={handleUpdateResourceTower} onDeleteResourceTower={handleDeleteResourceTower} />;
            case 'orgView':
                return <OrganizationView data={appData} />;
            case 'functionalView':
                return <FunctionalView data={appData} />;
            case 'financialAnalytics':
                return <FinancialAnalytics data={appData} />;
            case 'solutionTaxonomy':
                return <SolutionTaxonomyView data={appData} />;
            case 'skills':
                return <SkillsManagement skills={skills} employees={employees} onAddSkill={handleAddSkill} onUpdateSkill={handleUpdateSkill} onDeleteSkill={handleDeleteSkill} />;
            case 'competencyMap':
                return <CompetencyMap data={appData} />;
            case 'services':
                return <ServiceManagement services={services} valueStreams={valueStreams} onAddService={handleAddService} onUpdateService={handleUpdateService} onDeleteService={handleDeleteService} />;
            case 'solutionCategories':
                return <SolutionCategoryManagement 
                    categories={solutionCategories} 
                    valueStreams={valueStreams} 
                    solutionTypes={solutionTypes}
                    onAddCategory={handleAddSolutionCategory} 
                    onUpdateCategory={handleUpdateSolutionCategory} 
                    onDeleteCategory={handleDeleteSolutionCategory} 
                />;
            case 'solutionTypes':
                return <SolutionTypeManagement 
                    solutionTypes={solutionTypes} 
                    valueStreams={valueStreams} 
                    onAddType={handleAddSolutionType}
                    onUpdateType={handleUpdateSolutionType}
                    onDeleteType={handleDeleteSolutionType}
                />;
            default:
                return <Dashboard data={appData} />;
        }
    };
    
    return (
        <div className="bg-slate-100 dark:bg-slate-900 min-h-screen font-sans text-slate-800 dark:text-slate-200">
            <Header currentView={view} setView={setView} appData={appData} onSearchSelect={handleSearchSelect} />
            <main className="p-4 sm:p-6 lg:p-8 max-w-screen-2xl mx-auto">
                {renderView()}
                <DataManager onImport={handleImport} onExport={handleExport} className="print:hidden" />
            </main>
        </div>
    );
};

export default App;
