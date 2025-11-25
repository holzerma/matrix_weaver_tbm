
import React, { useState, useMemo } from 'react';
import { Skill, Employee } from '../types';
import Modal from './common/Modal';
import Card from './common/Card';
import PlusIcon from './icons/PlusIcon';
import EditIcon from './icons/EditIcon';
import DeleteIcon from './icons/DeleteIcon';
import SkillForm from './SkillForm';

interface SkillsManagementProps {
    skills: Skill[];
    employees: Employee[];
    onAddSkill: (skill: Skill) => void;
    onUpdateSkill: (skill: Skill) => void;
    onDeleteSkill: (skillId: string) => void;
}

const SkillsManagement: React.FC<SkillsManagementProps> = ({ skills, employees, onAddSkill, onUpdateSkill, onDeleteSkill }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

    const skillUsageMap = useMemo(() => {
        const usage = new Map<string, number>();
        employees.forEach(emp => {
            emp.skills.forEach(skill => {
                usage.set(skill.skillId, (usage.get(skill.skillId) || 0) + 1);
            });
        });
        return usage;
    }, [employees]);

    const handleAddNew = () => {
        setEditingSkill(null);
        setIsModalOpen(true);
    };

    const handleEdit = (skill: Skill) => {
        setEditingSkill(skill);
        setIsModalOpen(true);
    };

    const handleDelete = (skillId: string) => {
        if (skillUsageMap.has(skillId)) {
            alert('This skill cannot be deleted because it is assigned to one or more employees.');
            return;
        }
        if (window.confirm('Are you sure you want to delete this skill?')) {
            onDeleteSkill(skillId);
        }
    };

    const handleSave = (skill: Skill) => {
        if (editingSkill) {
            onUpdateSkill(skill);
        } else {
            onAddSkill(skill);
        }
        setIsModalOpen(false);
        setEditingSkill(null);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingSkill(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Skills Management</h2>
                <button onClick={handleAddNew} className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors">
                    <PlusIcon className="w-5 h-5" />
                    <span>Add Skill</span>
                </button>
            </div>

            <Card className="!p-0">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-800">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Category</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Assigned Employees</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                            {skills.map(s => (
                                <tr key={s.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">{s.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{s.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{skillUsageMap.get(s.id) || 0}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-3">
                                            <button onClick={() => handleEdit(s)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200">
                                                <EditIcon />
                                            </button>
                                            <button onClick={() => handleDelete(s.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 disabled:opacity-50 disabled:cursor-not-allowed" disabled={skillUsageMap.has(s.id)}>
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

            <Modal isOpen={isModalOpen} onClose={handleCancel} title={editingSkill ? 'Edit Skill' : 'Add New Skill'}>
                <SkillForm skill={editingSkill} onSave={handleSave} onCancel={handleCancel} />
            </Modal>
        </div>
    );
};

export default SkillsManagement;
