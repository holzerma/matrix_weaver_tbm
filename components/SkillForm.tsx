import React, { useState, useEffect } from 'react';
import { Skill } from '../types';
import { SKILL_CATEGORIES } from '../constants';

interface SkillFormProps {
    skill: Skill | null;
    onSave: (skill: Skill) => void;
    onCancel: () => void;
}

const SkillForm: React.FC<SkillFormProps> = ({ skill, onSave, onCancel }) => {
    const [formData, setFormData] = useState({ name: '', category: '' });

    useEffect(() => {
        if (skill) {
            setFormData({ name: skill.name, category: skill.category });
        } else {
            setFormData({ name: '', category: SKILL_CATEGORIES[0] || '' });
        }
    }, [skill]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalSkill: Skill = {
            id: skill?.id || `skill${Date.now()}`,
            name: formData.name,
            category: formData.category,
        };
        onSave(finalSkill);
    };

    const inputClasses = "mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400 dark:text-slate-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500";
    const labelClasses = "block text-sm font-medium text-slate-700 dark:text-slate-300";

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="name" className={labelClasses}>Skill Name</label>
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={inputClasses} required placeholder="e.g., React" />
                </div>
                <div>
                    <label htmlFor="category" className={labelClasses}>Category</label>
                    <select name="category" id="category" value={formData.category} onChange={handleChange} className={inputClasses} required>
                        {SKILL_CATEGORIES.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 text-slate-800 dark:bg-slate-600 dark:text-slate-100 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">
                    Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                    Save Skill
                </button>
            </div>
        </form>
    );
};

export default SkillForm;
