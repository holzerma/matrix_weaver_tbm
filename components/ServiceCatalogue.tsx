
import React, { useMemo, useState } from 'react';
import { AppData, SolutionTypeDefinition, SolutionCategory, ValueStream, Service, FunctionalTeam, Competence } from '../types';
import ChevronDownIcon from './icons/ChevronDownIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';
import UserGroupIcon from './icons/UserGroupIcon';
import BookOpenIcon from './icons/BookOpenIcon';
import SitemapIcon from './icons/SitemapIcon';
import UsersIcon from './icons/UsersIcon';

interface ServiceCatalogueProps {
    data: AppData;
}

// Helper to determine text/bg colors based on theme
const getThemeClasses = (theme: string) => {
    const map: Record<string, string> = {
        sky: 'bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-800 text-sky-900 dark:text-sky-100',
        lime: 'bg-lime-50 dark:bg-lime-900/20 border-lime-200 dark:border-lime-800 text-lime-900 dark:text-lime-100',
        amber: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-100',
        rose: 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-100',
        slate: 'bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100',
        violet: 'bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800 text-violet-900 dark:text-violet-100',
        indigo: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-100',
        emerald: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100',
    };
    return map[theme] || map['slate'];
};

const TypeSection: React.FC<{ 
    typeDef: SolutionTypeDefinition; 
    categories: SolutionCategory[]; 
    valueStreams: ValueStream[]; 
    services: Service[];
    employees: any[];
    functionalTeams: FunctionalTeam[];
    competences: Competence[];
}> = ({ typeDef, categories, valueStreams, services, employees, functionalTeams, competences }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    const typeCategories = useMemo(() => 
        categories.filter(c => c.type === typeDef.name).sort((a, b) => a.name.localeCompare(b.name)), 
    [categories, typeDef]);

    const serviceMap = useMemo(() => new Map(services.map(s => [s.id, s])), [services]);
    const compMap = useMemo(() => new Map(competences.map(c => [c.id, c])), [competences]);

    // Calculate which Value Streams belong to this Type
    const typeValueStreams = useMemo(() => 
        valueStreams.filter(vs => vs.solutionType === typeDef.name),
    [valueStreams, typeDef]);

    if (typeValueStreams.length === 0) return null;

    const themeClass = getThemeClasses(typeDef.colorTheme);

    return (
        <div className={`rounded-lg border mb-6 overflow-hidden ${themeClass}`}>
            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex justify-between items-center p-4 text-left transition-colors hover:bg-black/5 dark:hover:bg-white/5"
            >
                <div>
                    <h3 className="text-xl font-bold">{typeDef.name}</h3>
                    <p className="text-sm opacity-80">{typeDef.description}</p>
                </div>
                <ChevronDownIcon className={`w-6 h-6 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
            </button>

            {isExpanded && (
                <div className="p-4 bg-white dark:bg-slate-900 border-t border-inherit">
                    {typeCategories.map(category => {
                        const catValueStreams = typeValueStreams.filter(vs => vs.solutionCategory === category.name);
                        
                        if (catValueStreams.length === 0) return null;

                        return (
                            <div key={category.id} className="mb-8 last:mb-2">
                                <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
                                    <SitemapIcon className="w-5 h-5 text-slate-400" />
                                    {category.name}
                                </h4>
                                
                                <div className="space-y-4">
                                    {catValueStreams.map(vs => {
                                        const vsServices = (vs.serviceIds || []).map(id => serviceMap.get(id)).filter(Boolean);
                                        
                                        // 1. Identify Functional Teams explicitly assigned to this Value Stream
                                        const assignedFunctionalTeams = functionalTeams.filter(ft => 
                                            ft.valueStreamIds && ft.valueStreamIds.includes(vs.id)
                                        );

                                        // 2. Identify Employees who are members of these assigned Functional Teams
                                        const derivedEmployees = employees.filter(e => 
                                            e.functionalTeamIds && e.functionalTeamIds.some((ftId: string) => 
                                                assignedFunctionalTeams.some(ft => ft.id === ftId)
                                            )
                                        );

                                        // 3. Identify Competences based on the derived employees
                                        // We group employees by competence to show counts and names in tooltips
                                        const competenceMembersMap = new Map<string, string[]>();
                                        derivedEmployees.forEach(e => {
                                            if (e.competenceId) {
                                                const list = competenceMembersMap.get(e.competenceId) || [];
                                                list.push(e.name);
                                                competenceMembersMap.set(e.competenceId, list);
                                            }
                                        });
                                        const uniqueCompIds = Array.from(competenceMembersMap.keys());

                                        // Metrics
                                        const uniqueHeadcount = derivedEmployees.length; // Unique people in the assigned squads
                                        const assignedSquadCount = assignedFunctionalTeams.length;

                                        return (
                                            <div key={vs.id} className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 flex flex-col lg:flex-row gap-6">
                                                {/* Left: Solution & Services */}
                                                <div className="flex-grow lg:w-2/3">
                                                    <div className="flex items-center flex-wrap gap-3 mb-2">
                                                        <h5 className="text-md font-bold text-slate-800 dark:text-slate-100">{vs.name}</h5>
                                                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${vs.solutionClassification === 'Product' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'}`}>
                                                            {vs.solutionClassification}
                                                        </span>
                                                        <div 
                                                            className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-700 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-600 cursor-help"
                                                            title={`Capacity provided by ${assignedSquadCount} assigned functional team(s).`}
                                                        >
                                                            <UsersIcon className="w-3 h-3" />
                                                            <span className="font-semibold">{uniqueHeadcount} People Capacity</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{vs.description}</p>
                                                    
                                                    <div>
                                                        <h6 className="text-xs font-semibold uppercase text-slate-400 mb-2 flex items-center gap-1">
                                                            <BriefcaseIcon className="w-3 h-3" /> Services Offered
                                                        </h6>
                                                        {vsServices.length > 0 ? (
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                                {vsServices.map(s => (
                                                                    <div key={s?.id} className="text-sm bg-white dark:bg-slate-700/50 p-2 rounded border border-slate-200 dark:border-slate-600">
                                                                        <span className="font-semibold text-slate-700 dark:text-slate-200 block">{s?.name}</span>
                                                                        <span className="text-xs text-slate-500 dark:text-slate-400 block">{s?.description}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <p className="text-sm text-slate-400 italic">No specific services cataloged yet.</p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Right: Delivery Units (Who) */}
                                                <div className="lg:w-1/3 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-700 pt-4 lg:pt-0 lg:pl-6">
                                                    <h6 className="text-xs font-semibold uppercase text-slate-400 mb-3">Delivery Units</h6>
                                                    
                                                    <div className="space-y-4">
                                                        <div>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                                                                <UserGroupIcon className="w-3 h-3" /> Functional Teams
                                                            </p>
                                                            <div className="flex flex-wrap gap-1.5">
                                                                {assignedFunctionalTeams.length > 0 ? assignedFunctionalTeams.map(ft => {
                                                                    // Find members of this specific team for the tooltip
                                                                    const members = employees
                                                                        .filter(e => e.functionalTeamIds && e.functionalTeamIds.includes(ft.id))
                                                                        .map(e => e.name);

                                                                    return (
                                                                        <span 
                                                                            key={ft.id} 
                                                                            className="text-xs bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-200 px-2 py-1 rounded-md border border-pink-200 dark:border-pink-800 flex items-center gap-1 cursor-help hover:bg-pink-200 dark:hover:bg-pink-900 transition-colors" 
                                                                            title={`Team: ${ft.name}\nMembers: ${members.join(', ')}`}
                                                                        >
                                                                            {ft.name}
                                                                            <span className="bg-white/40 dark:bg-black/20 px-1.5 rounded-sm text-[9px] font-bold min-w-[1.2em] text-center">
                                                                                {members.length}
                                                                            </span>
                                                                        </span>
                                                                    );
                                                                }) : <span className="text-xs text-slate-400 italic">No squads assigned</span>}
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                                                                <BookOpenIcon className="w-3 h-3" /> Competence Teams
                                                            </p>
                                                            <div className="flex flex-wrap gap-1.5">
                                                                {uniqueCompIds.length > 0 ? uniqueCompIds.map(id => {
                                                                    const comp = compMap.get(id);
                                                                    const memberNames = competenceMembersMap.get(id) || [];
                                                                    if (!comp) return null;
                                                                    return (
                                                                        <span 
                                                                            key={id} 
                                                                            className="text-xs bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200 px-2 py-1 rounded-md border border-indigo-200 dark:border-indigo-800 flex items-center gap-1 cursor-help hover:bg-indigo-200 dark:hover:bg-indigo-900 transition-colors"
                                                                            title={`Competence: ${comp.name}\nEmployees in squads: ${memberNames.join(', ')}`}
                                                                        >
                                                                            {comp.name}
                                                                            <span className="bg-white/40 dark:bg-black/20 px-1.5 rounded-sm text-[9px] font-bold min-w-[1.2em] text-center">
                                                                                {memberNames.length}
                                                                            </span>
                                                                        </span>
                                                                    );
                                                                }) : <span className="text-xs text-slate-400 italic">No associated competences</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const ServiceCatalogue: React.FC<ServiceCatalogueProps> = ({ data }) => {
    const { solutionTypes = [] } = data;

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Service Catalogue</h2>
                <p className="text-slate-600 dark:text-slate-400">
                    A hierarchical view of all services offered by the organization, mapping the 
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400"> Value Stream</span> (What) to the 
                    <span className="font-semibold text-pink-600 dark:text-pink-400"> Delivery Teams</span> (Who).
                </p>
                <p className="text-xs text-slate-500 italic mt-1">
                    * Functional Teams are explicitly assigned to Solutions. Competence Teams are derived from the employees working within those assigned Functional Teams.
                </p>
            </div>

            <div className="mt-6">
                {solutionTypes.map(type => (
                    <TypeSection 
                        key={type.id} 
                        typeDef={type} 
                        categories={data.solutionCategories}
                        valueStreams={data.valueStreams}
                        services={data.services}
                        employees={data.employees}
                        functionalTeams={data.functionalTeams}
                        competences={data.competences}
                    />
                ))}
            </div>
        </div>
    );
};

export default ServiceCatalogue;
