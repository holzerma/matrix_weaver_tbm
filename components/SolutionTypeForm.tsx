
import React, { useState, useEffect } from 'react';
import { SolutionTypeDefinition } from '../types';

interface SolutionTypeFormProps {
    solutionType: SolutionTypeDefinition | null;
    onSave: (solutionType: SolutionTypeDefinition) => void;
    onCancel: () => void;
}

const COLORS: { label: string; value: SolutionTypeDefinition['colorTheme'] }[] = [
    { label: 'Sky Blue', value: 'sky' },
    { label: 'Lime Green', value: 'lime' },
    { label: 'Amber', value: 'amber' },
    { label: 'Rose Red', value: 'rose' },
    { label: 'Slate Grey', value: 'slate' },
    { label: 'Violet', value: 'violet' },
    { label: 'Indigo', value: 'indigo' },
    { label: 'Emerald', value: 'emerald' },
];

const SolutionTypeForm: React.FC<SolutionTypeFormProps> = ({ solutionType, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        colorTheme: 'sky' as SolutionTypeDefinition['colorTheme'],
    });

    useEffect(() => {
        if (solutionType) {
            setFormData({
                name: solutionType.name,
                description: solutionType.description,
                colorTheme: solutionType.colorTheme || 'sky',
            });
        } else {
            setFormData({
                name: '',
                description: '',
                colorTheme: 'sky',
            });
        }
    }, [solutionType]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalType: SolutionTypeDefinition = {
            id: solutionType?.id || `st_${Date.now()}`,
            name: formData.name,
            description: formData.description,
            colorTheme: formData.colorTheme,
        };
        onSave(finalType);
    };

    const inputClasses = "mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400 dark:text-slate-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500";
    const labelClasses = "block text-sm font-medium text-slate-700 dark:text-slate-300";

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="name" className={labelClasses}>Type Name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={inputClasses} required placeholder="e.g., Innovation" />
            </div>
            <div>
                <label htmlFor="description" className={labelClasses}>Description</label>
                <textarea name="description" id="description" value={formData.description} onChange={handleChange} className={inputClasses} rows={3} placeholder="Describe this solution type..." required />
            </div>
            <div>
                <label htmlFor="colorTheme" className={labelClasses}>Color Theme</label>
                <select name="colorTheme" id="colorTheme" value={formData.colorTheme} onChange={handleChange} className={inputClasses}>
                    {COLORS.map(c => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                </select>
                <div className={`mt-2 h-6 w-full rounded border border-slate-200 dark:border-slate-600 bg-${formData.colorTheme}-100`}></div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 text-slate-800 dark:bg-slate-600 dark:text-slate-100 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">
                    Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                    Save Type
                </button>
            </div>
        </form>
    );
};

export default SolutionTypeForm;
