
import React, { useState, useMemo } from 'react';
import { Employee, Competence, CompetenceTeamType } from '../types';
import Modal from './common/Modal';
import Card from './common/Card';
import PlusIcon from './icons/PlusIcon';
import EditIcon from './icons/EditIcon';
import DeleteIcon from './icons/DeleteIcon';
import CompetenceForm from './ChapterForm';

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

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Competence Management</h2>
                <button onClick={handleAddNew} className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors">
                    <PlusIcon className="w-5 h-5" />
                    <span>Add Competence</span>
                </button>
            </div>

            <Card className="!p-0">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-800">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Line Team</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Team Type</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Core Skill</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Members</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                            {competences.map(comp => (
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
                            ))}
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
