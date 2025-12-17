
import React, { useState, useEffect, useMemo } from 'react';
import { ValueStream, CostPool, ResourceTower, SolutionType, SolutionClassification, CostAllocation, Service } from '../types';
import { SOLUTION_TYPES, SOLUTION_CATEGORIES } from '../constants';
import DeleteIcon from './icons/DeleteIcon';
import PlusIcon from './icons/PlusIcon';
import Modal from './common/Modal';

interface ValueStreamFormProps {
    valueStream: ValueStream | null;
    resourceTowers: ResourceTower[];
    costPools: CostPool[];
    services: Service[];
    onSave: (valueStream: ValueStream) => void;
    onCancel: () => void;
}

const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

const SOLUTION_CLASSIFICATIONS: SolutionClassification[] = ['Product', 'Service'];

const ValueStreamForm: React.FC<ValueStreamFormProps> = ({ valueStream, resourceTowers, costPools, services, onSave, onCancel }) => {
    const [formData, setFormData] = useState({ 
        name: '', 
        description: '', 
        costPoolConsumption: [] as CostAllocation[],
        solutionType: 'Business' as SolutionType,
        solutionCategory: '',
        solutionClassification: 'Product' as SolutionClassification,
        serviceIds: [] as string[],
    });
    const [isCostModalOpen, setIsCostModalOpen] = useState(false);
    const [newCost, setNewCost] = useState({ poolId: '', amount: '' });

    // Explicitly typing the Maps ensures that methods like `.get()` return a correctly typed value (e.g., `ResourceTower | undefined` instead of `any`).
    const resourceTowerMap = new Map<string, ResourceTower>(resourceTowers.map(rt => [rt.id, rt]));
    const costPoolMap = new Map<string, CostPool>(costPools.map(cp => [cp.id, cp]));

    useEffect(() => {
        if (valueStream) {
            setFormData({ 
                name: valueStream.name, 
                description: valueStream.description, 
                costPoolConsumption: valueStream.costPoolConsumption || [],
                solutionType: valueStream.solutionType || 'Business',
                solutionCategory: valueStream.solutionCategory || '',
                solutionClassification: valueStream.solutionClassification || 'Product',
                serviceIds: valueStream.serviceIds || [],
            });
        } else {
            setFormData({ 
                name: '', 
                description: '', 
                costPoolConsumption: [],
                solutionType: 'Business',
                solutionCategory: '',
                solutionClassification: 'Product',
                serviceIds: [],
            });
        }
    }, [valueStream]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRemoveCost = (costPoolId: string) => {
        setFormData(prev => ({
            ...prev,
            costPoolConsumption: prev.costPoolConsumption.filter(c => c.costPoolId !== costPoolId)
        }));
    };

    const handleAddCost = () => {
        if (!newCost.poolId || !newCost.amount || Number(newCost.amount) <= 0) {
            alert("Please select a cost pool and enter a valid positive cost amount.");
            return;
        }
        setFormData(prev => ({
            ...prev,
            costPoolConsumption: [...prev.costPoolConsumption, { costPoolId: newCost.poolId, annualCost: Number(newCost.amount) }]
        }));
        setNewCost({ poolId: '', amount: '' });
        setIsCostModalOpen(false);
    };

    const handleServiceChange = (serviceId: string) => {
        setFormData(prev => {
            const newServiceIds = prev.serviceIds.includes(serviceId)
                ? prev.serviceIds.filter(id => id !== serviceId)
                : [...prev.serviceIds, serviceId];
            return { ...prev, serviceIds: newServiceIds };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalValueStream: ValueStream = {
            id: valueStream?.id || `vs${Date.now()}`,
            name: formData.name,
            description: formData.description,
            costPoolConsumption: formData.costPoolConsumption,
            solutionType: formData.solutionType,
            solutionCategory: formData.solutionCategory,
            solutionClassification: formData.solutionClassification,
            serviceIds: formData.serviceIds,
        };
        onSave(finalValueStream);
    };

    const availableCostPools = costPools.filter(cp => 
        !formData.costPoolConsumption.some(c => c.costPoolId === cp.id)
    );

    // FIX: Explicitly type the initial value for the reduce function and use generic for better inference to avoid type errors.
    const costsByTower = useMemo(() => {
        type CostsByTowerAcc = Record<string, { towerName: string, costs: CostAllocation[] }>;
        return formData.costPoolConsumption.reduce<CostsByTowerAcc>((acc, cost) => {
            const pool = costPoolMap.get(cost.costPoolId);
            if (pool) {
                const towerId = pool.defaultResourceTowerId;
                if (!acc[towerId]) {
                    const tower = resourceTowerMap.get(towerId);
                    acc[towerId] = { towerName: tower?.name || 'Unassigned', costs: [] };
                }
                acc[towerId].costs.push(cost);
            }
            return acc;
        }, {});
    }, [formData.costPoolConsumption, costPoolMap, resourceTowerMap]);

    const inputClasses = "mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400 dark:text-slate-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500";
    const labelClasses = "block text-sm font-medium text-slate-700 dark:text-slate-300";

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="name" className={labelClasses}>Solution Name</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={inputClasses} required />
                    </div>
                    <div>
                        <label htmlFor="solutionClassification" className={labelClasses}>Classification</label>
                        <select name="solutionClassification" id="solutionClassification" value={formData.solutionClassification} onChange={handleChange} className={inputClasses} required>
                            {SOLUTION_CLASSIFICATIONS.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="solutionType" className={labelClasses}>Solution Type</label>
                        <select name="solutionType" id="solutionType" value={formData.solutionType} onChange={handleChange} className={inputClasses} required>
                            {SOLUTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="solutionCategory" className={labelClasses}>Solution Category</label>
                         <select name="solutionCategory" id="solutionCategory" value={formData.solutionCategory} onChange={handleChange} className={inputClasses} required>
                            <option value="" disabled>Select a category</option>
                            {SOLUTION_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>
                <div>
                    <label htmlFor="description" className={labelClasses}>Description</label>
                    <textarea name="description" id="description" value={formData.description} onChange={handleChange} className={inputClasses} rows={2} required />
                </div>

                <div>
                    <label className={labelClasses}>Provided Services</label>
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border border-slate-300 dark:border-slate-600 rounded-md">
                        {services.map(service => (
                            <label key={service.id} className="flex items-center space-x-2 text-sm text-slate-800 dark:text-slate-200">
                                <input
                                    type="checkbox"
                                    checked={formData.serviceIds.includes(service.id)}
                                    onChange={() => handleServiceChange(service.id)}
                                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span>{service.name}</span>
                            </label>
                        ))}
                    </div>
                </div>
                
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <h3 className={labelClasses}>Consumed Costs</h3>
                        <button type="button" onClick={() => setIsCostModalOpen(true)} className="flex items-center space-x-2 px-3 py-1.5 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors text-sm">
                            <PlusIcon className="w-4 h-4" />
                            <span>Add Cost</span>
                        </button>
                    </div>
                    <div className="space-y-3 p-3 border border-slate-300 dark:border-slate-600 rounded-md max-h-60 overflow-y-auto">
                        {Object.keys(costsByTower).length === 0 && <p className="text-sm text-slate-500 dark:text-slate-400">No consumed costs. Click 'Add Cost' to begin.</p>}
                        {/* FIX: Explicitly cast entry in Object.entries to any to avoid "property does not exist on type {}" error. */}
                        {Object.entries(costsByTower).map(([towerId, {towerName, costs}]: [string, any]) => (
                            <div key={towerId}>
                                <h4 className="text-sm font-semibold text-indigo-800 dark:text-indigo-300">{towerName}</h4>
                                <div className="pl-2 mt-1 space-y-1">
                                    {(costs as CostAllocation[]).map(c => (
                                        <div key={c.costPoolId} className="flex justify-between items-center bg-slate-100 dark:bg-slate-700 p-2 rounded">
                                            <div>
                                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{costPoolMap.get(c.costPoolId)?.name || 'Unknown Pool'}</p>
                                                <p className="text-xs text-slate-600 dark:text-slate-300">{formatCurrency(c.annualCost)}</p>
                                            </div>
                                            <button type="button" onClick={() => handleRemoveCost(c.costPoolId)} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                                                <DeleteIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                    <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 text-slate-800 dark:bg-slate-600 dark:text-slate-100 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">
                        Cancel
                    </button>
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                        Save Solution
                    </button>
                </div>
            </form>

             <Modal isOpen={isCostModalOpen} onClose={() => setIsCostModalOpen(false)} title="Add Cost to Solution">
                <div className="space-y-4">
                     <div>
                         <label htmlFor="newCostPoolId" className={labelClasses}>Cost Type (Cost Pool)</label>
                         <select
                            id="newCostPoolId"
                            value={newCost.poolId}
                            onChange={(e) => setNewCost(p => ({ ...p, poolId: e.target.value }))}
                            className={inputClasses}
                        >
                            <option value="" disabled>Select a cost pool</option>
                            {availableCostPools.map(cp => <option key={cp.id} value={cp.id}>{cp.name}</option>)}
                        </select>
                     </div>
                     <div>
                         <label htmlFor="newCostAmount" className={labelClasses}>Annual Cost</label>
                         <input
                            type="number"
                            id="newCostAmount"
                            placeholder="e.g., 50000"
                            value={newCost.amount}
                            onChange={(e) => setNewCost(p => ({ ...p, amount: e.target.value }))}
                            className={inputClasses}
                            min="0"
                        />
                     </div>
                     <div className="flex justify-end space-x-4 pt-2">
                        <button type="button" onClick={() => setIsCostModalOpen(false)} className="px-4 py-2 bg-slate-200 text-slate-800 dark:bg-slate-600 dark:text-slate-100 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">
                            Cancel
                        </button>
                        <button type="button" onClick={handleAddCost} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                            Add Cost
                        </button>
                     </div>
                </div>
             </Modal>
        </>
    );
};

export default ValueStreamForm;
