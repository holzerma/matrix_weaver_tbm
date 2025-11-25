
import React, { useState } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { initialEmployees, initialValueStreams, initialCompetences, initialCostPools, initialResourceTowers, initialSkills, initialServices } from './constants';
import { Employee, ValueStream, Competence, CostPool, ResourceTower, AppData, Skill, Service } from './types';
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

type View = 'dashboard' | 'employees' | 'valueStreams' | 'competences' | 'costPools' | 'resourceTowers' | 'orgView' | 'financialAnalytics' | 'skills' | 'competencyMap' | 'services' | 'solutionTaxonomy';

const App: React.FC = () => {
    const [view, setView] = useState<View>('dashboard');
    const [employees, setEmployees] = useLocalStorage<Employee[]>('employees', initialEmployees);
    const [valueStreams, setValueStreams] = useLocalStorage<ValueStream[]>('valueStreams', initialValueStreams);
    const [competences, setCompetences] = useLocalStorage<Competence[]>('competences', initialCompetences);
    const [costPools, setCostPools] = useLocalStorage<CostPool[]>('costPools', initialCostPools);
    const [resourceTowers, setResourceTowers] = useLocalStorage<ResourceTower[]>('resourceTowers', initialResourceTowers);
    const [skills, setSkills] = useLocalStorage<Skill[]>('skills', initialSkills);
    const [services, setServices] = useLocalStorage<Service[]>('services', initialServices);

    const appData: AppData = { employees, valueStreams, competences, costPools, resourceTowers, skills, services };

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

    const handleImport = (data: AppData) => {
        setEmployees(data.employees || []);
        setValueStreams(data.valueStreams || []);
        setCompetences(data.competences || []);
        setCostPools(data.costPools || []);
        setResourceTowers(data.resourceTowers || []);
        setSkills(data.skills || []);
        setServices(data.services || []);
        alert('Data imported successfully!');
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
            case 'employees':
                return <EmployeeManagement employees={employees} competences={competences} valueStreams={valueStreams} skills={skills} onAddEmployee={handleAddEmployee} onUpdateEmployee={handleUpdateEmployee} onDeleteEmployee={handleDeleteEmployee} />;
            case 'valueStreams':
                return <ValueStreamManagement employees={employees} valueStreams={valueStreams} resourceTowers={resourceTowers} costPools={costPools} services={services} onAddValueStream={handleAddValueStream} onUpdateValueStream={handleUpdateValueStream} onDeleteValueStream={handleDeleteValueStream} />;
            case 'competences':
                return <CompetenceManagement employees={employees} competences={competences} onAddCompetence={handleAddCompetence} onUpdateCompetence={handleUpdateCompetence} onDeleteCompetence={handleDeleteCompetence} />;
            case 'costPools':
                return <CostPoolManagement costPools={costPools} resourceTowers={resourceTowers} valueStreams={valueStreams} onAddCostPool={handleAddCostPool} onUpdateCostPool={handleUpdateCostPool} onDeleteCostPool={handleDeleteCostPool} />;
            case 'resourceTowers':
                return <ResourceTowerManagement resourceTowers={resourceTowers} costPools={costPools} valueStreams={valueStreams} onAddResourceTower={handleAddResourceTower} onUpdateResourceTower={handleUpdateResourceTower} onDeleteResourceTower={handleDeleteResourceTower} />;
            case 'orgView':
                return <OrganizationView data={appData} />;
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
