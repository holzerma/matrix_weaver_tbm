
import React, { useState, useEffect } from 'react';
import { CostPool, ResourceTower } from '../types';

interface CostPoolFormProps {
    costPool: CostPool | null;
    resourceTowers: ResourceTower[];
    onSave: (costPool: CostPool) => void;
    onCancel: () => void;
}

const CostPoolForm: React.FC<CostPoolFormProps> = ({ costPool, resourceTowers, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        defaultResourceTowerId: '',
    });

    useEffect(() => {
        if (costPool) {
            setFormData({
                name: costPool.name,
                category: costPool.category,
                defaultResourceTowerId: costPool.defaultResourceTowerId,
            });
        } else {
            setFormData({ name: '', category: '', defaultResourceTowerId: resourceTowers.length > 0 ? resourceTowers[0].id : '' });
        }
    }, [costPool, resourceTowers]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalCostPool: CostPool = {
            id: costPool?.id || `cp${Date.now()}`,
            name: formData.name,
            category: formData.category,
            defaultResourceTowerId: formData.defaultResourceTowerId,
        };
        onSave(finalCostPool);
    };

    const inputClasses = "mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400 dark:text-slate-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500";
    const labelClasses = "block text-sm font-medium text-slate-700 dark:text-slate-300";

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label htmlFor="name" className={labelClasses}>Cost Pool Name</label>
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={inputClasses} required placeholder="e.g., AWS Cloud Services" />
                </div>
                <div>
                    <label htmlFor="category" className={labelClasses}>Category</label>
                    <input type="text" name="category" id="category" value={formData.category} onChange={handleChange} className={inputClasses} required placeholder="e.g., Software, Hardware"/>
                </div>
            </div>
             <div>
                <label htmlFor="defaultResourceTowerId" className={labelClasses}>Default Resource Tower</label>
                <select name="defaultResourceTowerId" id="defaultResourceTowerId" value={formData.defaultResourceTowerId} onChange={handleChange} className={inputClasses} required>
                    <option value="" disabled>Select a default tower</option>
                    {resourceTowers.map(rt => <option key={rt.id} value={rt.id}>{rt.name}</option>)}
                </select>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 text-slate-800 dark:bg-slate-600 dark:text-slate-100 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">
                    Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                    Save Cost Pool
                </button>
            </div>
        </form>
    );
};

export default CostPoolForm;
