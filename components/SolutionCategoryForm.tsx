
import React, { useState, useEffect } from 'react';
import { SolutionCategory, SolutionTypeDefinition, SolutionType } from '../types';

interface SolutionCategoryFormProps {
    category: SolutionCategory | null;
    solutionTypes?: SolutionTypeDefinition[];
    onSave: (category: SolutionCategory) => void;
    onCancel: () => void;
}

const SolutionCategoryForm: React.FC<SolutionCategoryFormProps> = ({ category, solutionTypes = [], onSave, onCancel }) => {
    // Default to first available type or Business if empty
    const defaultType = solutionTypes.length > 0 ? solutionTypes[0].name : 'Business';
    const [formData, setFormData] = useState({ name: '', description: '', type: defaultType as SolutionType });

    useEffect(() => {
        if (category) {
            setFormData({ 
                name: category.name, 
                description: category.description,
                type: category.type || defaultType 
            });
        } else {
            setFormData({ name: '', description: '', type: defaultType });
        }
    }, [category, defaultType]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalCategory: SolutionCategory = {
            id: category?.id || `solcat_${Date.now()}`,
            name: formData.name,
            description: formData.description,
            type: formData.type,
        };
        onSave(finalCategory);
    };

    const inputClasses = "mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400 dark:text-slate-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500";
    const labelClasses = "block text-sm font-medium text-slate-700 dark:text-slate-300";

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="name" className={labelClasses}>Category Name</label>
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={inputClasses} required placeholder="e.g., Cloud Computing" />
                </div>
                <div>
                    <label htmlFor="type" className={labelClasses}>Parent Type</label>
                    <select name="type" id="type" value={formData.type} onChange={handleChange} className={inputClasses} required>
                        {solutionTypes.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                    </select>
                </div>
            </div>
            <div>
                <label htmlFor="description" className={labelClasses}>Description</label>
                <textarea name="description" id="description" value={formData.description} onChange={handleChange} className={inputClasses} rows={3} placeholder="Optional description..." />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 text-slate-800 dark:bg-slate-600 dark:text-slate-100 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">
                    Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                    Save Category
                </button>
            </div>
        </form>
    );
};

export default SolutionCategoryForm;
