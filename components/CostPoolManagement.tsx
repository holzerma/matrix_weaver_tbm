

import React, { useState, useMemo } from 'react';
import { CostPool, ResourceTower, ValueStream } from '../types';
import Modal from './common/Modal';
import Card from './common/Card';
import PlusIcon from './icons/PlusIcon';
import EditIcon from './icons/EditIcon';
import DeleteIcon from './icons/DeleteIcon';
import CostPoolForm from './CostPoolForm';

interface CostPoolManagementProps {
    costPools: CostPool[];
    resourceTowers: ResourceTower[];
    valueStreams: ValueStream[];
    onAddCostPool: (cp: CostPool) => void;
    onUpdateCostPool: (cp: CostPool) => void;
    onDeleteCostPool: (cpId: string) => void;
}

const CostPoolManagement: React.FC<CostPoolManagementProps> = ({ costPools, resourceTowers, valueStreams, onAddCostPool, onUpdateCostPool, onDeleteCostPool }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCp, setEditingCp] = useState<CostPool | null>(null);

    const resourceTowerMap = useMemo(() => new Map(resourceTowers.map(rt => [rt.id, rt.name])), [resourceTowers]);

    const cpUsageMap = useMemo(() => {
        const usage = new Map<string, number>();
        // FIX: Correctly calculate usage by iterating through value streams, as they contain the cost pool consumption data.
        valueStreams.forEach(vs => {
            vs.costPoolConsumption.forEach(alloc => {
                usage.set(alloc.costPoolId, (usage.get(alloc.costPoolId) || 0) + 1);
            });
        });
        return usage;
    }, [valueStreams]);

    const handleAddNew = () => {
        setEditingCp(null);
        setIsModalOpen(true);
    };

    const handleEdit = (ct: CostPool) => {
        setEditingCp(ct);
        setIsModalOpen(true);
    };

    const handleDelete = (cpId: string) => {
        if (cpUsageMap.has(cpId)) {
            alert('This cost pool cannot be deleted because it is allocated to one or more resource towers.');
            return;
        }
        if (window.confirm('Are you sure you want to delete this cost pool?')) {
            onDeleteCostPool(cpId);
        }
    };

    const handleSave = (cp: CostPool) => {
        if (editingCp) {
            onUpdateCostPool(cp);
        } else {
            onAddCostPool(cp);
        }
        setIsModalOpen(false);
        setEditingCp(null);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingCp(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Cost Pool Management</h2>
                <button onClick={handleAddNew} className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors">
                    <PlusIcon className="w-5 h-5" />
                    <span>Add Cost Pool</span>
                </button>
            </div>

            <Card className="!p-0">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-800">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Category</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Default Resource Tower</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                            {costPools.map(cp => (
                                <tr key={cp.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">{cp.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{cp.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{resourceTowerMap.get(cp.defaultResourceTowerId) || <span className="text-red-500">Not Set</span>}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-3">
                                            <button onClick={() => handleEdit(cp)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200">
                                                <EditIcon />
                                            </button>
                                            <button onClick={() => handleDelete(cp.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 disabled:opacity-50 disabled:cursor-not-allowed" disabled={cpUsageMap.has(cp.id)}>
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

            <Modal isOpen={isModalOpen} onClose={handleCancel} title={editingCp ? 'Edit Cost Pool' : 'Add New Cost Pool'}>
                <CostPoolForm costPool={editingCp} resourceTowers={resourceTowers} onSave={handleSave} onCancel={handleCancel} />
            </Modal>
        </div>
    );
};

export default CostPoolManagement;