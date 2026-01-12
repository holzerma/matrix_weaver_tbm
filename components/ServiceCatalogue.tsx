
import React, { useMemo, useState } from 'react';
import { AppData, SolutionTypeDefinition, SolutionCategory, ValueStream, Service, FunctionalTeam, Competence, Employee } from '../types';
import ChevronDownIcon from './icons/ChevronDownIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';
import UserGroupIcon from './icons/UserGroupIcon';
import BookOpenIcon from './icons/BookOpenIcon';
import SitemapIcon from './icons/SitemapIcon';
import UsersIcon from './icons/UsersIcon';
import UserStarIcon from './icons/UserStarIcon';
import ShieldCheckIcon from './icons/ShieldCheckIcon';

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

interface KeyRoleEntry {
    employee: Employee;
    contextFte: number;
    // IDs of streams relevant to the current context (Category or Solution)
    contextStreamIds: string[];
    // All global stream IDs for this person (for the tooltip)
    globalStreamIds: string[];
    // Global FTE per stream
    globalFtePerStream: number;
}

const KeyRolesDisplay: React.FC<{ 
    entries: KeyRoleEntry[]; 
    label?: string; 
    valueStreamMap: Map<string, ValueStream>;
}> = ({ entries, label, valueStreamMap }) => {
    if (entries.length === 0) return null;

    // Sort by name
    const sortedEntries = [...entries].sort((a, b) => a.employee.name.localeCompare(b.employee.name));

    return (
        <div className="flex flex-wrap items-center gap-2 mt-2 mb-3">
            {label && <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mr-1">{label}:</span>}
            {sortedEntries.map(({ employee, contextFte, globalStreamIds, globalFtePerStream }) => (
                <div key={employee.id} className="group relative">
                    {/* Badge */}
                    <div className="flex items-center gap-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full pl-2 pr-1.5 py-1 shadow-sm cursor-help hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors">
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap">{employee.name}</span>
                        
                        <div className="flex gap-0.5">
                            {employee.isLineManager && <span className="text-amber-600 dark:text-amber-400"><UserStarIcon className="w-3 h-3" /></span>}
                            {employee.isFunctionalManager && <span className="text-indigo-600 dark:text-indigo-400"><BriefcaseIcon className="w-3 h-3" /></span>}
                            {employee.isSupportRole && <span className="text-emerald-600 dark:text-emerald-400"><ShieldCheckIcon className="w-3 h-3" /></span>}
                        </div>

                        <span className="bg-slate-100 dark:bg-slate-600 text-slate-600 dark:text-slate-300 text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[3em] text-center">
                            {contextFte.toFixed(2)}
                        </span>
                    </div>

                    {/* Rich Tooltip */}
                    <div className="absolute bottom-full left-0 mb-2 w-72 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-600 p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
                        <div className="border-b border-slate-100 dark:border-slate-700 pb-2 mb-2">
                            <p className="font-bold text-slate-800 dark:text-slate-100">{employee.name}</p>
                            <div className="flex flex-wrap gap-2 mt-1 text-[10px] uppercase font-semibold text-slate-500">
                                {employee.isLineManager && <span>Line Manager</span>}
                                {employee.isFunctionalManager && <span>Functional Manager</span>}
                                {employee.isSupportRole && <span>Support Role</span>}
                            </div>
                        </div>
                        
                        <div className="space-y-2 text-xs">
                            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-1.5 rounded">
                                <span className="text-slate-600 dark:text-slate-400">Total Solutions:</span>
                                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{globalStreamIds.length}</span>
                            </div>
                            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-1.5 rounded">
                                <span className="text-slate-600 dark:text-slate-400">FTE per Solution:</span>
                                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{globalFtePerStream.toFixed(2)}</span>
                            </div>
                            
                            <div className="mt-2">
                                <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">Assigned Solutions:</p>
                                <ul className="max-h-32 overflow-y-auto space-y-1">
                                    {globalStreamIds.map(id => {
                                        const vs = valueStreamMap.get(id);
                                        return (
                                            <li key={id} className="flex items-start gap-1 text-slate-600 dark:text-slate-400">
                                                <span className="mt-1 w-1 h-1 rounded-full bg-indigo-400 flex-shrink-0"></span>
                                                <span>{vs?.name || 'Unknown'}</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                        {/* Arrow */}
                        <div className="absolute top-full left-4 -mt-1 border-4 border-transparent border-t-white dark:border-t-slate-800"></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const TypeSection: React.FC<{ 
    typeDef: SolutionTypeDefinition; 
    categories: SolutionCategory[]; 
    valueStreams: ValueStream[]; 
    services: Service[];
    employees: Employee[];
    functionalTeams: FunctionalTeam[];
    competences: Competence[];
}> = ({ typeDef, categories, valueStreams, services, employees, functionalTeams, competences }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    const typeCategories = useMemo(() => 
        categories.filter(c => c.type === typeDef.name).sort((a, b) => a.name.localeCompare(b.name)), 
    [categories, typeDef]);

    const serviceMap = useMemo(() => new Map(services.map(s => [s.id, s])), [services]);
    const compMap = useMemo(() => new Map(competences.map(c => [c.id, c])), [competences]);
    const valueStreamMap = useMemo(() => new Map(valueStreams.map(vs => [vs.id, vs])), [valueStreams]);

    // Calculate which Value Streams belong to this Type
    const typeValueStreams = useMemo(() => 
        valueStreams.filter(vs => vs.solutionType === typeDef.name),
    [valueStreams, typeDef]);

    // Global Employee Map: Calculates total unique streams per person for FTE logic
    const employeeGlobalMap = useMemo(() => {
        const map = new Map<string, { uniqueVsIds: Set<string>; ftePerStream: number }>();
        
        employees.forEach(emp => {
            const uniqueVsIds = new Set<string>();
            // Direct
            (emp.valueStreamIds || []).forEach(id => uniqueVsIds.add(id));
            // Via Functional Team
            (emp.functionalTeamIds || []).forEach(ftId => {
                const team = functionalTeams.find(ft => ft.id === ftId);
                if (team && team.valueStreamIds) {
                    team.valueStreamIds.forEach(vsId => uniqueVsIds.add(vsId));
                }
            });

            const count = uniqueVsIds.size;
            map.set(emp.id, {
                uniqueVsIds,
                ftePerStream: count > 0 ? 1.0 / count : 0
            });
        });
        return map;
    }, [employees, functionalTeams]);

    // Helper to find key people for a specific Value Stream
    const getVsKeyPeople = (vs: ValueStream) => {
        const assignedTeamIds = functionalTeams
            .filter(ft => ft.valueStreamIds && ft.valueStreamIds.includes(vs.id))
            .map(ft => ft.id);

        return employees.filter(e => {
            const hasRole = e.isLineManager || e.isFunctionalManager || e.isSupportRole;
            if (!hasRole) return false;

            const inAssignedTeam = e.functionalTeamIds && e.functionalTeamIds.some(ftId => assignedTeamIds.includes(ftId));
            const isDirectlyAssigned = e.valueStreamIds && e.valueStreamIds.includes(vs.id);
            
            return inAssignedTeam || isDirectlyAssigned;
        });
    };

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

                        // ---------------------------------------------------------
                        // REFINED LOGIC: Partition Key People & Calculate Context FTE
                        // ---------------------------------------------------------
                        
                        // Map EmployeeID -> Set of VS IDs they are key for *in this category*
                        const empVsMap = new Map<string, Set<string>>();
                        
                        catValueStreams.forEach(vs => {
                            const people = getVsKeyPeople(vs);
                            people.forEach(p => {
                                if (!empVsMap.has(p.id)) {
                                    empVsMap.set(p.id, new Set());
                                }
                                empVsMap.get(p.id)!.add(vs.id);
                            });
                        });

                        // Create data structures for display
                        const categoryLeadership: KeyRoleEntry[] = [];
                        const vsSpecificLeadership = new Map<string, KeyRoleEntry[]>(); // VS_ID -> Entry[]

                        // Initialize vsSpecificLeadership map
                        catValueStreams.forEach(vs => vsSpecificLeadership.set(vs.id, []));

                        // Iterate employees found in this category
                        const uniqueEmployeeIds = Array.from(empVsMap.keys());
                        uniqueEmployeeIds.forEach(empId => {
                            const vsSet = empVsMap.get(empId)!;
                            const employee = employees.find(e => e.id === empId)!;
                            const globalInfo = employeeGlobalMap.get(empId) || { uniqueVsIds: new Set(), ftePerStream: 0 };
                            
                            const globalStreamIds = Array.from(globalInfo.uniqueVsIds);
                            
                            // Context Logic
                            if (vsSet.size > 1) {
                                // Associated with multiple solutions in this category -> Show at Category Level
                                // FTE here is sum of FTE for all streams in this category
                                const contextFte = globalInfo.ftePerStream * vsSet.size;
                                
                                categoryLeadership.push({
                                    employee,
                                    contextFte,
                                    contextStreamIds: Array.from(vsSet),
                                    globalStreamIds,
                                    globalFtePerStream: globalInfo.ftePerStream
                                });
                            } else if (vsSet.size === 1) {
                                // Associated with exactly one solution -> Show at Solution Level
                                const vsId = vsSet.values().next().value!;
                                const list = vsSpecificLeadership.get(vsId) || [];
                                
                                list.push({
                                    employee,
                                    contextFte: globalInfo.ftePerStream, // Just 1 stream worth
                                    contextStreamIds: [vsId],
                                    globalStreamIds,
                                    globalFtePerStream: globalInfo.ftePerStream
                                });
                                vsSpecificLeadership.set(vsId, list);
                            }
                        });

                        return (
                            <div key={category.id} className="mb-8 last:mb-2">
                                <div className="border-b border-slate-100 dark:border-slate-800 pb-2 mb-4">
                                    <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                        <SitemapIcon className="w-5 h-5 text-slate-400" />
                                        {category.name}
                                    </h4>
                                    {/* Level 2: Category Leadership (Multi-solution assignments) */}
                                    {categoryLeadership.length > 0 && (
                                        <div className="mt-2">
                                            <KeyRolesDisplay 
                                                entries={categoryLeadership} 
                                                label="Category Leadership" 
                                                valueStreamMap={valueStreamMap}
                                            />
                                        </div>
                                    )}
                                </div>
                                
                                <div className="space-y-4">
                                    {catValueStreams.map(vs => {
                                        const vsServices = (vs.serviceIds || []).map(id => serviceMap.get(id)).filter(Boolean);
                                        
                                        // Metrics Calculation
                                        const assignedFunctionalTeams = functionalTeams.filter(ft => 
                                            ft.valueStreamIds && ft.valueStreamIds.includes(vs.id)
                                        );
                                        const derivedEmployees = employees.filter(e => {
                                            const inTeam = e.functionalTeamIds && e.functionalTeamIds.some((ftId: string) => 
                                                assignedFunctionalTeams.some(ft => ft.id === ftId)
                                            );
                                            const direct = e.valueStreamIds && e.valueStreamIds.includes(vs.id);
                                            return inTeam || direct;
                                        });
                                        const uniqueHeadcount = derivedEmployees.length; 
                                        const assignedSquadCount = assignedFunctionalTeams.length;

                                        // Competence Grouping
                                        const competenceMembersMap = new Map<string, string[]>();
                                        derivedEmployees.forEach(e => {
                                            if (e.competenceId) {
                                                const list = competenceMembersMap.get(e.competenceId) || [];
                                                list.push(e.name);
                                                competenceMembersMap.set(e.competenceId, list);
                                            }
                                        });
                                        const uniqueCompIds = Array.from(competenceMembersMap.keys());

                                        // Level 1: Solution Specific Roles (Single-solution assignments)
                                        const specificKeyPeople = vsSpecificLeadership.get(vs.id) || [];

                                        return (
                                            <div key={vs.id} className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 flex flex-col lg:flex-row gap-6 transition-all hover:border-indigo-300 dark:hover:border-indigo-700">
                                                {/* Left: Solution & Services */}
                                                <div className="flex-grow lg:w-2/3">
                                                    <div className="flex items-center flex-wrap gap-3 mb-2">
                                                        <h5 className="text-md font-bold text-slate-800 dark:text-slate-100">{vs.name}</h5>
                                                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${vs.solutionClassification === 'Product' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'}`}>
                                                            {vs.solutionClassification}
                                                        </span>
                                                        <div 
                                                            className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-700 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-600 cursor-help"
                                                            title={`Capacity provided by ${assignedSquadCount} assigned functional team(s) and direct assignments.`}
                                                        >
                                                            <UsersIcon className="w-3 h-3" />
                                                            <span className="font-semibold">{uniqueHeadcount} People Capacity</span>
                                                        </div>
                                                    </div>

                                                    {/* Key Roles at Solution Level (Specific only) */}
                                                    {specificKeyPeople.length > 0 && (
                                                        <div className="mb-3">
                                                            <KeyRolesDisplay 
                                                                entries={specificKeyPeople} 
                                                                valueStreamMap={valueStreamMap}
                                                            />
                                                        </div>
                                                    )}

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
    const { solutionTypes = [], solutionCategories, valueStreams, services, employees, functionalTeams, competences } = data;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Service Catalogue</h2>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 mb-6">
                <p className="text-slate-600 dark:text-slate-300">
                    A comprehensive view of the organization's solution portfolio, organized by Type and Category. 
                    Expand each section to see the value streams (solutions), the services they provide, and the key personnel leading delivery.
                </p>
            </div>

            <div className="space-y-6">
                {solutionTypes.length > 0 ? (
                    solutionTypes.map(typeDef => (
                        <TypeSection 
                            key={typeDef.id} 
                            typeDef={typeDef} 
                            categories={solutionCategories} 
                            valueStreams={valueStreams} 
                            services={services} 
                            employees={employees} 
                            functionalTeams={functionalTeams} 
                            competences={competences} 
                        />
                    ))
                ) : (
                    <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                        No solution types defined. Add types in the TBM section to organize your catalogue.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServiceCatalogue;
