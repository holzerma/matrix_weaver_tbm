
import React, { useState, useEffect, useMemo } from 'react';
import { FunctionalTeam, ValueStream } from '../types';
import SearchIcon from './icons/SearchIcon';

interface FunctionalTeamFormProps {
    team: FunctionalTeam | null;
    valueStreams: ValueStream[];
    onSave: (team: FunctionalTeam) => void;
    onCancel: () => void;
}

const OPERATING_MODELS = ['Scrum', 'Kanban', 'Project', 'IT-Demand', 'Other'];
const TEAM_TYPES = ['Product', 'Service'];

const FunctionalTeamForm: React.FC<FunctionalTeamFormProps> = ({ team, valueStreams, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Omit<FunctionalTeam, 'id'>>({
        name: '',
        description: '',
        type: 'Product',
        operatingModel: 'Scrum',
        valueStreamIds: [],
    });
    const [vsSearch, setVsSearch] = useState('');

    useEffect(() => {
        if (team) {
            setFormData({
                name: team.name,
                description: team.description,
                type: team.type,
                operatingModel: team.operatingModel,
                valueStreamIds: team.valueStreamIds || [],
            });
        } else {
            setFormData({
                name: '',
                description: '',
                type: 'Product',
                operatingModel: 'Scrum',
                valueStreamIds: [],
            });
        }
    }, [team]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleValueStreamChange = (vsId: string) => {
        setFormData(prev => {
            const newVsIds = prev.valueStreamIds.includes(vsId)
                ? prev.valueStreamIds.filter(id => id !== vsId)
                : [...prev.valueStreamIds, vsId];
            return { ...prev, valueStreamIds: newVsIds };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalTeam: FunctionalTeam = {
            id: team?.id || `ft_${Date.now()}`,
            ...formData,
        } as FunctionalTeam;
        onSave(finalTeam);
    };

    // Sort and Filter Logic for VS
    const sortedValueStreams = useMemo(() => {
        return [...valueStreams].sort((a, b) => a.name.localeCompare(b.name));
    }, [valueStreams]);

    const filteredValueStreams = useMemo(() => {
        return sortedValueStreams.filter(vs => vs.name.toLowerCase().includes(vsSearch.toLowerCase()));
    }, [sortedValueStreams, vsSearch]);

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

            <div>
                <label className={labelClasses}>Assigned Value Streams (Solutions)</label>
                <div className="relative mt-1 mb-2">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="w-4 h-4 text-slate-400" />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Filter solutions..." 
                        value={vsSearch}
                        onChange={(e) => setVsSearch(e.target.value)}
                        className="pl-9 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-xs py-1.5"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-slate-50 dark:bg-slate-800/50">
                    {filteredValueStreams.length === 0 && <p className="text-xs text-slate-500 p-1">No matches found.</p>}
                    {filteredValueStreams.map(vs => (
                        <label key={vs.id} className="flex items-center space-x-2 text-sm text-slate-800 dark:text-slate-200">
                            <input
                                type="checkbox"
                                checked={formData.valueStreamIds.includes(vs.id)}
                                onChange={() => handleValueStreamChange(vs.id)}
                                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="truncate" title={vs.name}>{vs.name}</span>
                        </label>
                    ))}
                </div>
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
