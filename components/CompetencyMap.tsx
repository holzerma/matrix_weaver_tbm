
import React, { useState, useMemo } from 'react';
import { AppData, Employee, Skill, Competence } from '../types';
import Card from './common/Card';
import { SKILL_CATEGORIES } from '../constants';
import AlertTriangleIcon from './icons/AlertTriangleIcon';

interface CompetencyMapProps {
    data: AppData;
}

const proficiencyColors: { [key: number]: string } = {
    1: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
    2: 'bg-yellow-300 text-yellow-900 dark:bg-yellow-700 dark:text-yellow-100 border-yellow-400 dark:border-yellow-600',
    3: 'bg-lime-300 text-lime-900 dark:bg-lime-700 dark:text-lime-100 border-lime-400 dark:border-lime-600',
    4: 'bg-green-400 text-green-900 dark:bg-green-600 dark:text-green-100 border-green-500 dark:border-green-500',
    5: 'bg-green-600 text-white dark:bg-green-500 dark:text-white border-green-700 dark:border-green-400',
};

const CompetencyMap: React.FC<CompetencyMapProps> = ({ data }) => {
    const { employees, skills, competences } = data;
    const [filterCompetence, setFilterCompetence] = useState('');
    const [filterSkillCategory, setFilterSkillCategory] = useState('');
    const [filterSkillName, setFilterSkillName] = useState('');

    const skillCategories = SKILL_CATEGORIES;

    const filteredSkills = useMemo(() => {
        return skills
            .filter(s => filterSkillCategory ? s.category === filterSkillCategory : true)
            .filter(s => filterSkillName ? s.name.toLowerCase().includes(filterSkillName.toLowerCase()) : true);
    }, [skills, filterSkillCategory, filterSkillName]);

    const filteredEmployees = useMemo(() => {
        return employees
            .filter(e => filterCompetence ? e.competenceId === filterCompetence : true);
    }, [employees, filterCompetence]);

    const employeeSkillMap = useMemo(() => {
        const map = new Map<string, Map<string, number>>();
        filteredEmployees.forEach(emp => {
            const skillsMap = new Map<string, number>();
            emp.skills.forEach(skill => {
                skillsMap.set(skill.skillId, skill.proficiency);
            });
            map.set(emp.id, skillsMap);
        });
        return map;
    }, [filteredEmployees]);

    const skillUsageCount = useMemo(() => {
        const usage = new Map<string, number>();
        filteredEmployees.forEach(emp => {
            emp.skills.forEach(skill => {
                usage.set(skill.skillId, (usage.get(skill.skillId) || 0) + 1);
            });
        });
        return usage;
    }, [filteredEmployees]);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Competency Map</h2>

            <Card>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="competenceFilter" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Filter by Competence</label>
                        <select id="competenceFilter" value={filterCompetence} onChange={e => setFilterCompetence(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                            <option value="">All Competences</option>
                            {competences.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="skillCategoryFilter" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Filter by Skill Category</label>
                        <select id="skillCategoryFilter" value={filterSkillCategory} onChange={e => setFilterSkillCategory(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                            <option value="">All Categories</option>
                            {skillCategories.map(sc => <option key={sc} value={sc}>{sc}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="skillNameFilter" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Search Skill Name</label>
                        <input type="text" id="skillNameFilter" value={filterSkillName} onChange={e => setFilterSkillName(e.target.value)} placeholder="e.g., React" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"/>
                    </div>
                </div>
            </Card>

            <div className="overflow-x-auto">
                <table className="min-w-full border-separate" style={{ borderSpacing: '4px 4px' }}>
                    <thead>
                        <tr className="h-28">
                            <th className="sticky left-0 bg-slate-100 dark:bg-slate-900 p-2 text-left text-sm font-semibold text-slate-800 dark:text-slate-100 z-20 w-48 align-bottom">Employee</th>
                            {filteredSkills.map(skill => {
                                const isAtRisk = skillUsageCount.get(skill.id) === 1;
                                const thClassName = `p-2 align-bottom text-sm font-semibold text-slate-600 dark:text-slate-300 min-w-[100px] w-40 transition-colors ${isAtRisk ? 'bg-red-100 dark:bg-red-900/40 rounded-t-lg' : ''}`;
                                return (
                                    <th key={skill.id} className={thClassName} title={isAtRisk ? 'At-Risk Skill: Only one employee has this skill.' : ''}>
                                        <div className="transform -rotate-45 origin-bottom-left !whitespace-nowrap">
                                            {skill.name}
                                        </div>
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-800">
                        {filteredEmployees.map(employee => (
                            <tr key={employee.id}>
                                <td className="sticky left-0 bg-white dark:bg-slate-800 p-2 whitespace-nowrap z-10 w-48 border-r border-slate-200 dark:border-slate-700 align-top">
                                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{employee.name}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">{employee.role}</div>
                                </td>
                                {filteredSkills.map(skill => {
                                    const proficiency = employeeSkillMap.get(employee.id)?.get(skill.id);
                                    const isAtRisk = skillUsageCount.get(skill.id) === 1;
                                    const tdClassName = `text-center transition-colors ${isAtRisk ? 'bg-red-100 dark:bg-red-900/40' : ''}`;
                                    return (
                                        <td key={skill.id} className={tdClassName}>
                                            {proficiency ? (
                                                <div className={`w-full h-full flex items-center justify-center font-bold text-sm rounded border ${proficiencyColors[proficiency]}`}>
                                                    {proficiency}
                                                </div>
                                            ) : (
                                                <div className="w-full h-full bg-slate-100 dark:bg-slate-700/50 rounded"></div>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {filteredEmployees.length === 0 && <Card><p className="text-center text-slate-500 dark:text-slate-400">No employees match the current filter.</p></Card>}
            {filteredSkills.length === 0 && <Card><p className="text-center text-slate-500 dark:text-slate-400">No skills match the current filter.</p></Card>}
        </div>
    );
};

export default CompetencyMap;
