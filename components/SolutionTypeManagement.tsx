
import React, { useState } from 'react';
import { SolutionTypeDefinition, ValueStream } from '../types';
import Modal from './common/Modal';
import Card from './common/Card';
import PlusIcon from './icons/PlusIcon';
import EditIcon from './icons/EditIcon';
import DeleteIcon from './icons/DeleteIcon';
import SolutionTypeForm from './SolutionTypeForm';

interface SolutionTypeManagementProps {
    solutionTypes: SolutionTypeDefinition[];
    valueStreams: ValueStream[];
    onAddType: (type: SolutionTypeDefinition) => void;
    onUpdateType: (type: SolutionTypeDefinition) => void;
    onDeleteType: (id: string) => void;
}

const colorBadges: Record<string, string> = {
    sky: 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200',
    lime: 'bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200',
    amber: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    rose: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
    slate: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300',
    violet: 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200',
    indigo: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    emerald: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
};

const SolutionTypeManagement: React.FC<SolutionTypeManagementProps> = ({ solutionTypes, valueStreams, onAddType, onUpdateType, onDeleteType }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingType, setEditingType] = useState<SolutionTypeDefinition | null>(null);

    const handleAddNew = () => {
        setEditingType(null);
        setIsModalOpen(true);
    };

    const handleEdit = (type: SolutionTypeDefinition) => {
        setEditingType(type);
        setIsModalOpen(true);
    };

    const handleDelete = (type: SolutionTypeDefinition) => {
        // Check usage
        const isUsed = valueStreams.some(vs => vs.solutionType === type.name);
        if (isUsed) {
            alert(`Cannot delete '${type.name}' because it is currently assigned to one or more solutions.`);
            return;
        }

        if (window.confirm('Are you sure you want to delete this solution type?')) {
            onDeleteType(type.id);
        }
    };

    const handleSave = (type: SolutionTypeDefinition) => {
        if (editingType) {
            onUpdateType(type);
        } else {
            onAddType(type);
        }
        setIsModalOpen(false);
        setEditingType(null);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingType(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Solution Types</h2>
                <button onClick={handleAddNew} className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors">
                    <PlusIcon className="w-5 h-5" />
                    <span>Add Type</span>
                </button>
            </div>

            <Card className="!p-0">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-800">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Description</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Color Theme</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                            {solutionTypes.map(type => (
                                <tr key={type.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">{type.name}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 max-w-lg truncate">{type.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${colorBadges[type.colorTheme] || 'bg-slate-100 text-slate-800'}`}>
                                            {type.colorTheme}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-3">
                                            <button onClick={() => handleEdit(type)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200">
                                                <EditIcon />
                                            </button>
                                            <button onClick={() => handleDelete(type)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">
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

            <Modal isOpen={isModalOpen} onClose={handleCancel} title={editingType ? 'Edit Solution Type' : 'Add Solution Type'}>
                <SolutionTypeForm solutionType={editingType} onSave={handleSave} onCancel={handleCancel} />
            </Modal>
        </div>
    );
};

export default SolutionTypeManagement;
