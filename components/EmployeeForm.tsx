
import React, { useState, useEffect, useMemo } from 'react';
import { Employee, Competence, ValueStream, Skill, EmployeeSkill } from '../types';
import XIcon from './icons/XIcon';

interface EmployeeFormProps {
    employee: Employee | null;
    competences: Competence[];
    valueStreams: ValueStream[];
    skills: Skill[];
    onSave: (employee: Employee) => void;
    onCancel: () => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ employee, competences, valueStreams, skills, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        salary: '',
        competenceId: '',
        valueStreamIds: [] as string[],
        employeeType: 'internal' as 'internal' | 'external',
        isManager: false,
        skills: [] as EmployeeSkill[],
    });
    const [newSkillId, setNewSkillId] = useState('');
    const [newSkillProficiency, setNewSkillProficiency] = useState(3);

    const skillMap = useMemo(() => new Map(skills.map(s => [s.id, s.name])), [skills]);

    useEffect(() => {
        if (employee) {
            setFormData({
                name: employee.name,
                role: employee.role,
                salary: String(employee.salary),
                competenceId: employee.competenceId,
                valueStreamIds: employee.valueStreamIds,
                employeeType: employee.employeeType,
                isManager: employee.isManager || false,
                skills: employee.skills || [],
            });
        } else {
            setFormData({
                name: '',
                role: '',
                salary: '',
                competenceId: competences.length > 0 ? competences[0].id : '',
                valueStreamIds: [],
                employeeType: 'internal',
                isManager: false,
                skills: [],
            });
        }
    }, [employee, competences]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleValueStreamChange = (vsId: string) => {
        setFormData(prev => {
            const newVsIds = prev.valueStreamIds.includes(vsId)
                ? prev.valueStreamIds.filter(id => id !== vsId)
                : [...prev.valueStreamIds, vsId];
            if (newVsIds.length > 2) {
                alert("An employee can contribute to a maximum of 2 Value Streams.");
                return prev;
            }
            return { ...prev, valueStreamIds: newVsIds };
        });
    };

    const handleAddSkill = () => {
        if (newSkillId && !formData.skills.some(s => s.skillId === newSkillId)) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, { skillId: newSkillId, proficiency: newSkillProficiency }]
            }));
            setNewSkillId('');
            setNewSkillProficiency(3);
        }
    };
    
    const handleRemoveSkill = (skillId: string) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(s => s.skillId !== skillId)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalEmployee: Employee = {
            id: employee?.id || `emp${Date.now()}`,
            name: formData.name,
            role: formData.role,
            salary: Number(formData.salary),
            competenceId: formData.competenceId,
            valueStreamIds: formData.valueStreamIds,
            employeeType: formData.employeeType,
            isManager: formData.isManager,
            skills: formData.skills,
        };
        onSave(finalEmployee);
    };

    const availableSkills = skills.filter(s => !formData.skills.some(es => es.skillId === s.id));

    const inputClasses = "mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400 dark:text-slate-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500";
    const labelClasses = "block text-sm font-medium text-slate-700 dark:text-slate-300";

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="name" className={labelClasses}>Full Name</label>
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={inputClasses} required />
                </div>
                <div>
                    <label htmlFor="role" className={labelClasses}>Role</label>
                    <input type="text" name="role" id="role" value={formData.role} onChange={handleChange} className={inputClasses} required />
                </div>
                 <div>
                    <label htmlFor="salary" className={labelClasses}>Annual Salary</label>
                    <input type="number" name="salary" id="salary" value={formData.salary} onChange={handleChange} className={inputClasses} required min="0" />
                </div>
                 <div>
                    <label htmlFor="employeeType" className={labelClasses}>Employee Type</label>
                    <select name="employeeType" id="employeeType" value={formData.employeeType} onChange={handleChange} className={inputClasses} required>
                        <option value="internal">Internal</option>
                        <option value="external">External</option>
                    </select>
                </div>
            </div>
             <div>
                <label htmlFor="competenceId" className={labelClasses}>Competence</label>
                <select name="competenceId" id="competenceId" value={formData.competenceId} onChange={handleChange} className={inputClasses} required>
                    <option value="" disabled>Select a competence</option>
                    {competences.map(ch => <option key={ch.id} value={ch.id}>{ch.name}</option>)}
                </select>
            </div>
            <div>
                <label className={labelClasses}>Value Streams (Max 2)</label>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border border-slate-300 dark:border-slate-600 rounded-md">
                    {valueStreams.map(vs => (
                        <label key={vs.id} className="flex items-center space-x-2 text-sm text-slate-800 dark:text-slate-200">
                            <input
                                type="checkbox"
                                checked={formData.valueStreamIds.includes(vs.id)}
                                onChange={() => handleValueStreamChange(vs.id)}
                                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span>{vs.name}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                 <label className={labelClasses}>Skills & Proficiency (1-5)</label>
                 <div className="mt-2 space-y-2 p-2 border border-slate-300 dark:border-slate-600 rounded-md">
                    <div className="flex items-center gap-2">
                         <select value={newSkillId} onChange={e => setNewSkillId(e.target.value)} className={`${inputClasses} mt-0 flex-grow`}>
                            <option value="" disabled>Select a skill...</option>
                            {availableSkills.map(skill => (
                                <option key={skill.id} value={skill.id}>{skill.name}</option>
                            ))}
                        </select>
                        <input type="range" min="1" max="5" value={newSkillProficiency} onChange={e => setNewSkillProficiency(Number(e.target.value))} className="w-32 accent-indigo-600" />
                        <span className="font-bold text-indigo-600 dark:text-indigo-300 w-4">{newSkillProficiency}</span>
                        <button type="button" onClick={handleAddSkill} disabled={!newSkillId} className="px-3 py-2 bg-indigo-500 text-white rounded-md text-sm hover:bg-indigo-600 disabled:bg-slate-300 dark:disabled:bg-slate-500">
                            Add
                        </button>
                    </div>
                     <div className="flex flex-wrap gap-2 pt-2">
                        {formData.skills.map(skill => (
                            <div key={skill.skillId} className="flex items-center gap-2 bg-slate-200 dark:bg-slate-600 rounded-full px-3 py-1 text-sm">
                                <span className="font-medium text-slate-800 dark:text-slate-100">{skillMap.get(skill.skillId)} ({skill.proficiency})</span>
                                <button type="button" onClick={() => handleRemoveSkill(skill.skillId)} className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100">
                                    <XIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                 </div>
            </div>

             <div className="flex items-center">
                <input
                    type="checkbox"
                    name="isManager"
                    id="isManager"
                    checked={formData.isManager}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="isManager" className="ml-2 block text-sm text-slate-900 dark:text-slate-200">
                    This employee is a manager
                </label>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 text-slate-800 dark:bg-slate-600 dark:text-slate-100 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">
                    Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                    Save Employee
                </button>
            </div>
        </form>
    );
};

export default EmployeeForm;
