
import React, { useState, useEffect } from 'react';
import { Service } from '../types';

interface ServiceFormProps {
    service: Service | null;
    onSave: (service: Service) => void;
    onCancel: () => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ service, onSave, onCancel }) => {
    const [formData, setFormData] = useState({ name: '', description: '' });

    useEffect(() => {
        if (service) {
            setFormData({ name: service.name, description: service.description });
        } else {
            setFormData({ name: '', description: '' });
        }
    }, [service]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalService: Service = {
            id: service?.id || `serv${Date.now()}`,
            name: formData.name,
            description: formData.description,
        };
        onSave(finalService);
    };

    const inputClasses = "mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400 dark:text-slate-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500";
    const labelClasses = "block text-sm font-medium text-slate-700 dark:text-slate-300";

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="name" className={labelClasses}>Service Name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={inputClasses} required />
            </div>
            <div>
                <label htmlFor="description" className={labelClasses}>Description</label>
                <textarea name="description" id="description" value={formData.description} onChange={handleChange} className={inputClasses} rows={3} required />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 text-slate-800 dark:bg-slate-600 dark:text-slate-100 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">
                    Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                    Save Service
                </button>
            </div>
        </form>
    );
};

export default ServiceForm;