import React, { useState, useMemo } from 'react';
import { ResourceTower, CostPool, ValueStream } from '../types';
import Modal from './common/Modal';
import Card from './common/Card';
import PlusIcon from './icons/PlusIcon';
import EditIcon from './icons/EditIcon';
import DeleteIcon from './icons/DeleteIcon';
import ResourceTowerForm from './ResourceTowerForm';

interface ResourceTowerManagementProps {
    resourceTowers: ResourceTower[];
    costPools: CostPool[];
    valueStreams: ValueStream[];
    onAddResourceTower: (rt: ResourceTower) => void;
    onUpdateResourceTower: (rt: ResourceTower) => void;
    onDeleteResourceTower: (rtId: string) => void;
}

const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

const ResourceTowerManagement: React.FC<ResourceTowerManagementProps> = ({ resourceTowers, costPools, valueStreams, onAddResourceTower, onUpdateResourceTower, onDeleteResourceTower }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRt, setEditingRt] = useState<ResourceTower | null>(null);

    const costPoolToTowerMap = useMemo(() => new Map(costPools.map(cp => [cp.id, cp.defaultResourceTowerId])), [costPools]);

    const rtAllocationAndUsageMap = useMemo(() => {
        const usage = new Map<string, { consumingSolutions: Set<string>, allocatedCost: number }>();
        resourceTowers.forEach(rt => {
            usage.set(rt.id, { consumingSolutions: new Set(), allocatedCost: 0 });
        });

        valueStreams.forEach(vs => {
            vs.costPoolConsumption.forEach(cpc => {
                const towerId = costPoolToTowerMap.get(cpc.costPoolId);
                if (towerId) {
                    const current = usage.get(towerId);
                    if (current) {
                        current.consumingSolutions.add(vs.name);
                        current.allocatedCost += cpc.annualCost;
                    }
                }
            });
        });
        return usage;
    }, [valueStreams, costPools, resourceTowers]);

    const handleAddNew = () => {
        setEditingRt(null);
        setIsModalOpen(true);
    };

    const handleEdit = (rt: ResourceTower) => {
        setEditingRt(rt);
        setIsModalOpen(true);
    };

    const handleDelete = (rtId: string) => {
        const usage = rtAllocationAndUsageMap.get(rtId);
        if (usage && usage.allocatedCost > 0) {
            alert('This resource tower cannot be deleted because its associated cost pools are being consumed by one or more solutions.');
            return;
        }
        if (window.confirm('Are you sure you want to delete this resource tower?')) {
            onDeleteResourceTower(rtId);
        }
    };

    const handleSave = (rt: ResourceTower) => {
        if (editingRt) {
            onUpdateResourceTower(rt);
        } else {
            onAddResourceTower(rt);
        }
        setIsModalOpen(false);
        setEditingRt(null);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingRt(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Resource Tower Management</h2>
                <button onClick={handleAddNew} className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors">
                    <PlusIcon className="w-5 h-5" />
                    <span>Add Resource Tower</span>
                </button>
            </div>

            <Card className="!p-0">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-800">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Sub-Tower (Name)</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Tower</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Domain</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Total Allocated Cost</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Consuming Solutions</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                            {resourceTowers.map(rt => {
                                const usage = rtAllocationAndUsageMap.get(rt.id) || { consumingSolutions: new Set(), allocatedCost: 0 };
                                return (
                                <tr key={rt.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">{rt.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{rt.tower}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{rt.domain}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600 dark:text-green-400">{formatCurrency(usage.allocatedCost)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                         {usage.consumingSolutions.size}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-3">
                                            <button onClick={() => handleEdit(rt)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200">
                                                <EditIcon />
                                            </button>
                                            <button onClick={() => handleDelete(rt.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 disabled:opacity-50 disabled:cursor-not-allowed" disabled={usage.allocatedCost > 0}>
                                                <DeleteIcon />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal isOpen={isModalOpen} onClose={handleCancel} title={editingRt ? 'Edit Resource Tower' : 'Add New Resource Tower'}>
                <ResourceTowerForm resourceTower={editingRt} onSave={handleSave} onCancel={handleCancel} />
            </Modal>
        </div>
    );
};

export default ResourceTowerManagement;