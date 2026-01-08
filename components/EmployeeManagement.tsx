
import React, { useState, useMemo } from 'react';
import { Employee, Competence, ValueStream, Skill, FunctionalTeam } from '../types';
import Modal from './common/Modal';
import Card from './common/Card';
import PlusIcon from './icons/PlusIcon';
import EditIcon from './icons/EditIcon';
import DeleteIcon from './icons/DeleteIcon';
import EmployeeForm from './EmployeeForm';
import UserStarIcon from './icons/UserStarIcon';
import SearchIcon from './icons/SearchIcon';

interface EmployeeManagementProps {
    employees: Employee[];
    competences: Competence[];
    valueStreams: ValueStream[];
    functionalTeams?: FunctionalTeam[];
    skills: Skill[];
    onAddEmployee: (employee: Employee) => void;
    onUpdateEmployee: (employee: Employee) => void;
    onDeleteEmployee: (employeeId: string) => void;
}

const proficiencyColors: { [key: number]: string } = {
    1: 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300',
    2: 'bg-sky-200 text-sky-800 dark:bg-sky-800 dark:text-sky-200',
    3: 'bg-sky-300 text-sky-900 dark:bg-sky-700 dark:text-sky-100',
    4: 'bg-sky-500 text-white dark:bg-sky-600 dark:text-white',
    5: 'bg-sky-700 text-white dark:bg-sky-500 dark:text-white',
};

const typeBadges: { [key: string]: string } = {
    internal: 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200',
    external: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
};

const EmployeeManagement: React.FC<EmployeeManagementProps> = ({ employees, competences, valueStreams, functionalTeams = [], skills, onAddEmployee, onUpdateEmployee, onDeleteEmployee }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
    
    // Filtering & Sorting State
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterCompetence, setFilterCompetence] = useState('all');
    const [filterValueStream, setFilterValueStream] = useState('all');
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

    const competenceMap = useMemo(() => new Map(competences.map(ch => [ch.id, ch.name])), [competences]);
    const valueStreamMap = useMemo(() => new Map(valueStreams.map(vs => [vs.id, vs.name])), [valueStreams]);
    const functionalTeamMap = useMemo(() => new Map(functionalTeams.map(ft => [ft.id, ft.name])), [functionalTeams]);
    const skillMap = useMemo(() => new Map(skills.map(s => [s.id, s.name])), [skills]);

    // Sorted lists for dropdowns
    const sortedCompetences = useMemo(() => {
        return [...competences].sort((a, b) => a.name.localeCompare(b.name));
    }, [competences]);

    const sortedValueStreams = useMemo(() => {
        return [...valueStreams].sort((a, b) => a.name.localeCompare(b.name));
    }, [valueStreams]);

    const handleAddNew = () => {
        setEditingEmployee(null);
        setIsModalOpen(true);
    };

    const handleEdit = (employee: Employee) => {
        setEditingEmployee(employee);
        setIsModalOpen(true);
    };

    const handleDelete = (employeeId: string) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            onDeleteEmployee(employeeId);
        }
    };

    const handleSave = (employee: Employee) => {
        if (editingEmployee) {
            onUpdateEmployee(employee);
        } else {
            onAddEmployee(employee);
        }
        setIsModalOpen(false);
        setEditingEmployee(null);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingEmployee(null);
    };

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const processedEmployees = useMemo(() => {
        let result = [...employees];

        // Filtering
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(e => 
                e.name.toLowerCase().includes(lowerTerm) || 
                e.role.toLowerCase().includes(lowerTerm)
            );
        }
        if (filterType !== 'all') {
            result = result.filter(e => e.employeeType === filterType);
        }
        if (filterCompetence !== 'all') {
            result = result.filter(e => e.competenceId === filterCompetence);
        }
        if (filterValueStream !== 'all') {
            result = result.filter(e => e.valueStreamIds.includes(filterValueStream));
        }

        // Sorting
        if (sortConfig) {
            result.sort((a, b) => {
                let aVal: string | number = '';
                let bVal: string | number = '';

                if (sortConfig.key === 'competence') {
                    aVal = competenceMap.get(a.competenceId) || '';
                    bVal = competenceMap.get(b.competenceId) || '';
                } else if (sortConfig.key === 'name') {
                    aVal = a.name.toLowerCase();
                    bVal = b.name.toLowerCase();
                } else if (sortConfig.key === 'role') {
                    aVal = a.role.toLowerCase();
                    bVal = b.role.toLowerCase();
                } else if (sortConfig.key === 'type') {
                    aVal = a.employeeType;
                    bVal = b.employeeType;
                }

                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [employees, searchTerm, filterType, filterCompetence, filterValueStream, sortConfig, competenceMap]);

    const SortIcon = ({ active, direction }: { active: boolean; direction: 'asc' | 'desc' }) => (
        <span className={`ml-1 inline-block transition-opacity ${active ? 'opacity-100' : 'opacity-20 hover:opacity-50'}`}>
            {active && direction === 'desc' ? '↓' : '↑'}
        </span>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Employee Management</h2>
                <button onClick={handleAddNew} className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors">
                    <PlusIcon className="w-5 h-5" />
                    <span>Add Employee</span>
                </button>
            </div>

            <Card className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-grow">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon className="w-5 h-5 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by name or role..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 sm:text-sm py-2"
                        />
                    </div>
                    <div className="flex flex-wrap gap-4">
                         <div className="relative min-w-[150px]">
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 sm:text-sm py-2 pl-3 pr-10"
                            >
                                <option value="all">All Types</option>
                                <option value="internal">Internal</option>
                                <option value="external">External</option>
                            </select>
                         </div>
                         <div className="relative min-w-[200px]">
                            <select
                                value={filterCompetence}
                                onChange={(e) => setFilterCompetence(e.target.value)}
                                className="block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 sm:text-sm py-2 pl-3 pr-10"
                            >
                                <option value="all">All Competences</option>
                                {sortedCompetences.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="relative min-w-[200px]">
                            <select
                                value={filterValueStream}
                                onChange={(e) => setFilterValueStream(e.target.value)}
                                className="block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 sm:text-sm py-2 pl-3 pr-10"
                            >
                                <option value="all">All Solutions</option>
                                {sortedValueStreams.map(vs => <option key={vs.id} value={vs.id}>{vs.name}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            </Card>

            <Card className="!p-0">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-800">
                            <tr>
                                <th 
                                    scope="col" 
                                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider cursor-pointer select-none hover:bg-slate-100 dark:hover:bg-slate-700"
                                    onClick={() => handleSort('name')}
                                >
                                    <div className="flex items-center">
                                        Name
                                        <SortIcon active={sortConfig?.key === 'name'} direction={sortConfig?.direction || 'asc'} />
                                    </div>
                                </th>
                                 <th 
                                    scope="col" 
                                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider cursor-pointer select-none hover:bg-slate-100 dark:hover:bg-slate-700"
                                    onClick={() => handleSort('type')}
                                >
                                     <div className="flex items-center">
                                        Type
                                        <SortIcon active={sortConfig?.key === 'type'} direction={sortConfig?.direction || 'asc'} />
                                    </div>
                                </th>
                                <th 
                                    scope="col" 
                                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider cursor-pointer select-none hover:bg-slate-100 dark:hover:bg-slate-700"
                                    onClick={() => handleSort('role')}
                                >
                                     <div className="flex items-center">
                                        Role
                                        <SortIcon active={sortConfig?.key === 'role'} direction={sortConfig?.direction || 'asc'} />
                                    </div>
                                </th>
                                 <th 
                                    scope="col" 
                                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider cursor-pointer select-none hover:bg-slate-100 dark:hover:bg-slate-700"
                                    onClick={() => handleSort('competence')}
                                >
                                     <div className="flex items-center">
                                        Competence
                                        <SortIcon active={sortConfig?.key === 'competence'} direction={sortConfig?.direction || 'asc'} />
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Assignments</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                            {processedEmployees.length > 0 ? (
                                processedEmployees.map(emp => (
                                <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100 align-top">
                                        <div className="flex items-center gap-2">
                                            {emp.name}
                                            {emp.isManager && <span title="Manager" className="text-amber-500 flex-shrink-0"><UserStarIcon /></span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm align-top">
                                        <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full capitalize ${typeBadges[emp.employeeType]}`}>
                                            {emp.employeeType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400 align-top font-medium">
                                        {emp.role}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 align-top">
                                        {competenceMap.get(emp.competenceId) || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 align-top max-w-sm">
                                        <div className="flex flex-col gap-1">
                                            {emp.valueStreamIds.length > 0 && (
                                                <div className="flex flex-wrap gap-1">
                                                    <span className="text-xs font-semibold text-gray-500 uppercase">Solutions:</span>
                                                    {emp.valueStreamIds.map(vsId => (
                                                        <span key={vsId} className="px-2 py-0.5 text-[10px] font-semibold text-indigo-800 bg-indigo-100 dark:text-indigo-100 dark:bg-indigo-900 rounded-full">
                                                            {valueStreamMap.get(vsId) || 'Unknown'}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                            {(emp.functionalTeamIds && emp.functionalTeamIds.length > 0) && (
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    <span className="text-xs font-semibold text-gray-500 uppercase">Teams:</span>
                                                    {emp.functionalTeamIds.map(ftId => (
                                                        <span key={ftId} className="px-2 py-0.5 text-[10px] font-semibold text-pink-800 bg-pink-100 dark:text-pink-100 dark:bg-pink-900 rounded-full">
                                                            {functionalTeamMap.get(ftId) || 'Unknown'}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium align-top">
                                        <div className="flex items-center justify-end space-x-3">
                                            <button onClick={() => handleEdit(emp)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200"><EditIcon /></button>
                                            <button onClick={() => handleDelete(emp.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"><DeleteIcon /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                                        No employees found matching your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal isOpen={isModalOpen} onClose={handleCancel} title={editingEmployee ? 'Edit Employee' : 'Add New Employee'} maxWidth="max-w-4xl">
                <EmployeeForm
                    employee={editingEmployee}
                    competences={competences}
                    valueStreams={valueStreams}
                    functionalTeams={functionalTeams}
                    skills={skills}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            </Modal>
        </div>
    );
};

export default EmployeeManagement;