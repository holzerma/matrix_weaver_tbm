import React, { useState, useEffect } from 'react';
import { ResourceTower } from '../types';

interface ResourceTowerFormProps {
    resourceTower: ResourceTower | null;
    onSave: (resourceTower: ResourceTower) => void;
    onCancel: () => void;
}

const DOMAINS = ['Infrastructure', 'Application', 'Field & Office', 'Operations', 'Shared & Corporate'];

const ResourceTowerForm: React.FC<ResourceTowerFormProps> = ({ resourceTower, onSave, onCancel }) => {
    const [formData, setFormData] = useState({ 
        name: '', 
        tower: '', 
        domain: 'Infrastructure', 
    });

    useEffect(() => {
        if (resourceTower) {
            setFormData({ 
                name: resourceTower.name, 
                tower: resourceTower.tower, 
                domain: resourceTower.domain,
            });
        } else {
            setFormData({ 
                name: '', 
                tower: '', 
                domain: 'Infrastructure',
            });
        }
    }, [resourceTower]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalResourceTower: ResourceTower = {
            id: resourceTower?.id || `rt${Date.now()}`,
            name: formData.name,
            tower: formData.tower,
            domain: formData.domain,
        };
        onSave(finalResourceTower);
    };

    const inputClasses = "mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400 dark:text-slate-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500";
    const labelClasses = "block text-sm font-medium text-slate-700 dark:text-slate-300";

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label htmlFor="name" className={labelClasses}>Sub-Tower Name</label>
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={inputClasses} required placeholder="e.g., Servers, LAN"/>
                </div>
                <div>
                    <label htmlFor="tower" className={labelClasses}>Tower</label>
                    <input type="text" name="tower" id="tower" value={formData.tower} onChange={handleChange} className={inputClasses} required placeholder="e.g., Compute, Network" />
                </div>
                 <div>
                    <label htmlFor="domain" className={labelClasses}>Domain</label>
                    <select name="domain" id="domain" value={formData.domain} onChange={handleChange} className={inputClasses} required>
                         {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 text-slate-800 dark:bg-slate-600 dark:text-slate-100 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">
                    Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                    Save Resource Tower
                </button>
            </div>
        </form>
    );
};

export default ResourceTowerForm;
