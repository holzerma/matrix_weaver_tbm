
import React, { useState, useMemo } from 'react';
import { FunctionalTeam, Employee } from '../types';
import Modal from './common/Modal';
import Card from './common/Card';
import PlusIcon from './icons/PlusIcon';
import EditIcon from './icons/EditIcon';
import DeleteIcon from './icons/DeleteIcon';
import FunctionalTeamForm from './FunctionalTeamForm';
import SearchIcon from './icons/SearchIcon';

interface FunctionalTeamManagementProps {
    teams: FunctionalTeam[];
    employees: Employee[];
    onAddTeam: (team: FunctionalTeam) => void;
    onUpdateTeam: (team: FunctionalTeam) => void;
    onDeleteTeam: (teamId: string) => void;
}

const FunctionalTeamManagement: React.FC<FunctionalTeamManagementProps> = ({ teams, employees, onAddTeam, onUpdateTeam, onDeleteTeam }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTeam, setEditingTeam] = useState<FunctionalTeam | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

    const teamUsageMap = useMemo(() => {
        const usage = new Map<string, number>();
        employees.forEach(emp => {
            (emp.functionalTeamIds || []).forEach(teamId => {
                usage.set(teamId, (usage.get(teamId) || 0) + 1);
            });
        });
        return usage;
    }, [employees]);

    const handleAddNew = () => {
        setEditingTeam(null);
        setIsModalOpen(true);
    };

    const handleEdit = (team: FunctionalTeam) => {
        setEditingTeam(team);
        setIsModalOpen(true);
    };

    const handleDelete = (team: FunctionalTeam) => {
        const usageCount = teamUsageMap.get(team.id) || 0;
        if (usageCount > 0) {
            alert(`This team cannot be deleted because it has ${usageCount} assigned members.`);
            return;
        }
        if (window.confirm('Are you sure you want to delete this functional team?')) {
            onDeleteTeam(team.id);
        }
    };

    const handleSave = (team: FunctionalTeam) => {
        if (editingTeam) {
            onUpdateTeam(team);
        } else {
            onAddTeam(team);
        }
        setIsModalOpen(false);
        setEditingTeam(null);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingTeam(null);
    };

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const processedTeams = useMemo(() => {
        let result = [...teams];

        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(t => 
                t.name.toLowerCase().includes(lowerTerm) ||
                t.description.toLowerCase().includes(lowerTerm) ||
                t.operatingModel.toLowerCase().includes(lowerTerm)
            );
        }

        if (sortConfig) {
            result.sort((a, b) => {
                let aVal: string | number = '';
                let bVal: string | number = '';

                if (sortConfig.key === 'name') {
                    aVal = a.name.toLowerCase();
                    bVal = b.name.toLowerCase();
                } else if (sortConfig.key === 'model') {
                    aVal = a.operatingModel.toLowerCase();
                    bVal = b.operatingModel.toLowerCase();
                } else if (sortConfig.key === 'members') {
                    aVal = teamUsageMap.get(a.id) || 0;
                    bVal = teamUsageMap.get(b.id) || 0;
                }

                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return result;
    }, [teams, searchTerm, sortConfig, teamUsageMap]);

    const SortIcon = ({ active, direction }: { active: boolean; direction: 'asc' | 'desc' }) => (
        <span className={`ml-1 inline-block transition-opacity ${active ? 'opacity-100' : 'opacity-20 hover:opacity-50'}`}>
            {active && direction === 'desc' ? '↓' : '↑'}
        </span>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Functional Teams</h2>
                <button onClick={handleAddNew} className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors">
                    <PlusIcon className="w-5 h-5" />
                    <span>Add Team</span>
                </button>
            </div>

            <Card className="space-y-4">
                 <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="w-5 h-5 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search teams by name, model, or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 sm:text-sm py-2"
                    />
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
                                    onClick={() => handleSort('model')}
                                >
                                    <div className="flex items-center">
                                        Operating Model
                                        <SortIcon active={sortConfig?.key === 'model'} direction={sortConfig?.direction || 'asc'} />
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Type</th>
                                <th 
                                    scope="col" 
                                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider cursor-pointer select-none hover:bg-slate-100 dark:hover:bg-slate-700"
                                    onClick={() => handleSort('members')}
                                >
                                    <div className="flex items-center">
                                        Members
                                        <SortIcon active={sortConfig?.key === 'members'} direction={sortConfig?.direction || 'asc'} />
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                            {processedTeams.map(team => (
                                <tr key={team.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">
                                        {team.name}
                                        <p className="text-xs text-slate-500 font-normal truncate max-w-xs">{team.description}</p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                        <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 py-0.5 px-2.5 rounded-full text-xs font-semibold">{team.operatingModel}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{team.type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{teamUsageMap.get(team.id) || 0}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-3">
                                            <button onClick={() => handleEdit(team)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200">
                                                <EditIcon />
                                            </button>
                                            <button onClick={() => handleDelete(team)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 disabled:opacity-50 disabled:cursor-not-allowed" disabled={(teamUsageMap.get(team.id) || 0) > 0}>
                                                <DeleteIcon />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal isOpen={isModalOpen} onClose={handleCancel} title={editingTeam ? 'Edit Team' : 'Add New Team'}>
                <FunctionalTeamForm team={editingTeam} onSave={handleSave} onCancel={handleCancel} />
            </Modal>
        </div>
    );
};

export default FunctionalTeamManagement;
