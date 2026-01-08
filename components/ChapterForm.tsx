
import React, { useState, useEffect } from 'react';
import { Competence, CompetenceTeamType } from '../types';

interface CompetenceFormProps {
    competence: Competence | null;
    onSave: (competence: Competence) => void;
    onCancel: () => void;
}

// Updated Team Types
const TEAM_TYPES: CompetenceTeamType[] = ['Enabling', 'Crew', 'Standard', 'Unassigned'];

const CompetenceForm: React.FC<CompetenceFormProps> = ({ competence, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Omit<Competence, 'id'>>({ 
        name: '', 
        skill: '',
        teamType: 'Unassigned',
        lineTeamName: ''
    });

    useEffect(() => {
        if (competence) {
            setFormData({ ...competence });
        } else {
            setFormData({ 
                name: '', 
                skill: '',
                teamType: 'Unassigned',
                lineTeamName: ''
            });
        }
    }, [competence]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalCompetence: Competence = {
            id: competence?.id || `comp${Date.now()}`,
            ...formData,
        };
        onSave(finalCompetence);
    };

    const inputClasses = "mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400 dark:text-slate-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500";
    const labelClasses = "block text-sm font-medium text-slate-700 dark:text-slate-300";

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="name" className={labelClasses}>Competence Name</label>
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={inputClasses} required />
                </div>
                <div>
                    <label htmlFor="skill" className={labelClasses}>Core Skill</label>
                    <input type="text" name="skill" id="skill" value={formData.skill} onChange={handleChange} className={inputClasses} required />
                </div>
                <div>
                    <label htmlFor="teamType" className={labelClasses}>Team Type</label>
                    <select name="teamType" id="teamType" value={formData.teamType} onChange={handleChange} className={inputClasses} required>
                        {TEAM_TYPES.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="lineTeamName" className={labelClasses}>Current Line Team</label>
                    <input type="text" name="lineTeamName" id="lineTeamName" value={formData.lineTeamName} onChange={handleChange} className={inputClasses} placeholder="e.g. Engineering Team A" />
                </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 text-slate-800 dark:bg-slate-600 dark:text-slate-100 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">
                    Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                    Save Competence
                </button>
            </div>
        </form>
    );
};

export default CompetenceForm;
