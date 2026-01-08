
import React, { useState, useEffect } from 'react';
import { FunctionalTeam } from '../types';

interface FunctionalTeamFormProps {
    team: FunctionalTeam | null;
    onSave: (team: FunctionalTeam) => void;
    onCancel: () => void;
}

const OPERATING_MODELS = ['Scrum', 'Kanban', 'Project', 'IT-Demand', 'Other'];
const TEAM_TYPES = ['Product', 'Service'];

const FunctionalTeamForm: React.FC<FunctionalTeamFormProps> = ({ team, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Omit<FunctionalTeam, 'id'>>({
        name: '',
        description: '',
        type: 'Product',
        operatingModel: 'Scrum',
    });

    useEffect(() => {
        if (team) {
            setFormData({
                name: team.name,
                description: team.description,
                type: team.type,
                operatingModel: team.operatingModel,
            });
        } else {
            setFormData({
                name: '',
                description: '',
                type: 'Product',
                operatingModel: 'Scrum',
            });
        }
    }, [team]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalTeam: FunctionalTeam = {
            id: team?.id || `ft_${Date.now()}`,
            ...formData,
        } as FunctionalTeam;
        onSave(finalTeam);
    };

    const inputClasses = "mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400 dark:text-slate-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500";
    const labelClasses = "block text-sm font-medium text-slate-700 dark:text-slate-300";

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="name" className={labelClasses}>Team Name</label>
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={inputClasses} required placeholder="e.g., Checkout Squad" />
                </div>
                <div>
                    <label htmlFor="type" className={labelClasses}>Team Type</label>
                    <select name="type" id="type" value={formData.type} onChange={handleChange} className={inputClasses} required>
                        {TEAM_TYPES.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="operatingModel" className={labelClasses}>Operating Model</label>
                    <select name="operatingModel" id="operatingModel" value={formData.operatingModel} onChange={handleChange} className={inputClasses} required>
                        {OPERATING_MODELS.map(model => (
                            <option key={model} value={model}>{model}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div>
                <label htmlFor="description" className={labelClasses}>Description</label>
                <textarea name="description" id="description" value={formData.description} onChange={handleChange} className={inputClasses} rows={3} placeholder="Describe the team's purpose..." required />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 text-slate-800 dark:bg-slate-600 dark:text-slate-100 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">
                    Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                    Save Team
                </button>
            </div>
        </form>
    );
};

export default FunctionalTeamForm;
