
import React, { useState, useMemo } from 'react';
import { Employee, Competence, CompetenceTeamType } from '../types';
import Modal from './common/Modal';
import Card from './common/Card';
import PlusIcon from './icons/PlusIcon';
import EditIcon from './icons/EditIcon';
import DeleteIcon from './icons/DeleteIcon';
import CompetenceForm from './ChapterForm';
import SearchIcon from './icons/SearchIcon';

interface CompetenceManagementProps {
    employees: Employee[];
    competences: Competence[];
    onAddCompetence: (competence: Competence) => void;
    onUpdateCompetence: (competence: Competence) => void;
    onDeleteCompetence: (competenceId: string) => void;
}

const typeBadges: Record<CompetenceTeamType, string> = {
    'Product Team': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    'Crew': 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200',
    'Enabling Team': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    'Unassigned': 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300',
};

const CompetenceManagement: React.FC<CompetenceManagementProps> = ({ employees, competences, onAddCompetence, onUpdateCompetence, onDeleteCompetence }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCompetence, setEditingCompetence] = useState<Competence | null>(null);

    // Filtering & Sorting State
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTeamType, setFilterTeamType] = useState('all');
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

    const competenceUsageMap = useMemo(() => {
        const usage = new Map<string, number>();
        employees.forEach(emp => {
            usage.set(emp.competenceId, (usage.get(emp.competenceId) || 0) + 1);
        });
        return usage;
    }, [employees]);

    const handleAddNew = () => {
        setEditingCompetence(null);
        setIsModalOpen(true);
    };

    const handleEdit = (competence: Competence) => {
        setEditingCompetence(competence);
        setIsModalOpen(true);
    };

    const handleDelete = (competenceId: string) => {
        if (competenceUsageMap.has(competenceId)) {
            alert('This competence cannot be deleted because it has members.');
            return;
        }
        if (window.confirm('Are you sure you want to delete this competence?')) {
            onDeleteCompetence(competenceId);
        }
    }

    const handleSave = (competence: Competence) => {
        if (editingCompetence) {
            onUpdateCompetence(competence);
        } else {
            onAddCompetence(competence);
        }
        setIsModalOpen(false);
        setEditingCompetence(null);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingCompetence(null);
    };

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const processedCompetences = useMemo(() => {
        let result = [...competences];

        // Filtering
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(c => 
                c.name.toLowerCase().includes(lowerTerm) || 
                (c.lineTeamName && c.lineTeamName.toLowerCase().includes(lowerTerm)) ||
                c.skill.toLowerCase().includes(lowerTerm)
            );
        }
        if (filterTeamType !== 'all') {
            result = result.filter(c => c.teamType === filterTeamType);
        }

        // Sorting
        if (sortConfig) {
            result.sort((a, b) => {
                let aVal = '';
                let bVal = '';

                if (sortConfig.key === 'name') {
                    aVal = a.name.toLowerCase();
                    bVal = b.name.toLowerCase();
                } else if (sortConfig.key === 'lineTeamName') {
                    aVal = (a.lineTeamName || '').toLowerCase();
                    bVal = (b.lineTeamName || '').toLowerCase();
                } else if (sortConfig.key === 'teamType') {
                    aVal = (a.teamType || '').toLowerCase();
                    bVal = (b.teamType || '').toLowerCase();
                } else if (sortConfig.key === 'skill') {
                    aVal = a.skill.toLowerCase();
                    bVal = b.skill.toLowerCase();
                }

                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [competences, searchTerm, filterTeamType, sortConfig]);

    const SortIcon = ({ active, direction }: { active: boolean; direction: 'asc' | 'desc' }) => (
        <span className={`ml-1 inline-block transition-opacity ${active ? 'opacity-100' : 'opacity-20 hover:opacity-50'}`}>
            {active && direction === 'desc' ? '↓' : '↑'}
        </span>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Competence Teams - Line Teams</h2>
                <button onClick={handleAddNew} className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors">
                    <PlusIcon className="w-5 h-5" />
                    <span>Add Competence</span>
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
                            placeholder="Search by name, line team, or skill..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 sm:text-sm py-2"
                        />
                    </div>
                    <div className="relative min-w-[200px]">
                        <select
                            value={filterTeamType}
                            onChange={(e) => setFilterTeamType(e.target.value)}
                            className="block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 sm:text-sm py-2 pl-3 pr-10"
                        >
                            <option value="all">All Team Types</option>
                            {Object.keys(typeBadges).map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
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
                                    onClick={() => handleSort('lineTeamName')}
                                >
                                    <div className="flex items-center">
                                        Line Team
                                        <SortIcon active={sortConfig?.key === 'lineTeamName'} direction={sortConfig?.direction || 'asc'} />
                                    </div>
                                </th>
                                <th 
                                    scope="col" 
                                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider cursor-pointer select-none hover:bg-slate-100 dark:hover:bg-slate-700"
                                    onClick={() => handleSort('teamType')}
                                >
                                     <div className="flex items-center">
                                        Team Type
                                        <SortIcon active={sortConfig?.key === 'teamType'} direction={sortConfig?.direction || 'asc'} />
                                    </div>
                                </th>
                                <th 
                                    scope="col" 
                                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider cursor-pointer select-none hover:bg-slate-100 dark:hover:bg-slate-700"
                                    onClick={() => handleSort('skill')}
                                >
                                     <div className="flex items-center">
                                        Core Skill
                                        <SortIcon active={sortConfig?.key === 'skill'} direction={sortConfig?.direction || 'asc'} />
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Members</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                            {processedCompetences.length > 0 ? (
                                processedCompetences.map(comp => (
                                <tr key={comp.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">{comp.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400 font-medium italic">{comp.lineTeamName || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${typeBadges[comp.teamType || 'Unassigned']}`}>
                                            {comp.teamType || 'Unassigned'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{comp.skill}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{competenceUsageMap.get(comp.id) || 0}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-3">
                                            <button onClick={() => handleEdit(comp)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200">
                                                <EditIcon />
                                            </button>
                                            <button onClick={() => handleDelete(comp.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 disabled:opacity-50 disabled:cursor-not-allowed" disabled={competenceUsageMap.has(comp.id)}>
                                                <DeleteIcon />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                                        No competence teams found matching your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal isOpen={isModalOpen} onClose={handleCancel} title={editingCompetence ? 'Edit Competence' : 'Add New Competence'}>
                <CompetenceForm competence={editingCompetence} onSave={handleSave} onCancel={handleCancel} />
            </Modal>
        </div>
    );
};

export default CompetenceManagement;
