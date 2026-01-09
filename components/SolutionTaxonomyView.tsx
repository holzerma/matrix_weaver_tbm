
import React, { useMemo, useState } from 'react';
import { AppData, ValueStream, Service, SolutionType, SolutionTypeDefinition } from '../types';
import Card from './common/Card';
import SitemapIcon from './icons/SitemapIcon';
import UsersIcon from './icons/UsersIcon';

interface SolutionTaxonomyViewProps {
    data: AppData;
}

// Taxonomy node structure
type TaxonomyNode = {
    [key: string]: {
        [category: string]: ValueStream[];
    };
};

const colorClasses: Record<string, string> = {
    sky: 'bg-sky-100 dark:bg-sky-900/50 border-sky-300 dark:border-sky-700 text-sky-800 dark:text-sky-200',
    lime: 'bg-lime-100 dark:bg-lime-900/50 border-lime-300 dark:border-lime-700 text-lime-800 dark:text-lime-200',
    amber: 'bg-amber-100 dark:bg-amber-900/50 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200',
    rose: 'bg-rose-100 dark:bg-rose-900/50 border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-200',
    slate: 'bg-slate-100 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200',
    violet: 'bg-violet-100 dark:bg-violet-900/50 border-violet-300 dark:border-violet-700 text-violet-800 dark:text-violet-200',
    indigo: 'bg-indigo-100 dark:bg-indigo-900/50 border-indigo-300 dark:border-indigo-700 text-indigo-800 dark:text-indigo-200',
    emerald: 'bg-emerald-100 dark:bg-emerald-900/50 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200',
};

const Tooltip: React.FC<{ item: ValueStream | Service | null, position: { top: number, left: number } }> = ({ item, position }) => {
    if (!item) return null;

    return (
        <div 
            className="fixed z-50 p-3 text-sm bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700 max-w-xs transition-opacity duration-200 pointer-events-none"
            style={{ top: position.top + 10, left: position.left + 10 }}
        >
            <p className="font-bold text-slate-800 dark:text-slate-100">{item.name}</p>
            <p className="text-slate-600 dark:text-slate-300">{item.description}</p>
        </div>
    );
};

const SolutionTaxonomyView: React.FC<SolutionTaxonomyViewProps> = ({ data }) => {
    const { employees, valueStreams, services, solutionCategories, solutionTypes = [], functionalTeams } = data;
    const [hoveredItem, setHoveredItem] = useState<{ item: ValueStream | Service; position: { top: number; left: number } } | null>(null);

    const serviceMap = useMemo(() => new Map(services.map(s => [s.id, s])), [services]);
    const solutionTypeMap = useMemo(() => new Map(solutionTypes.map(t => [t.name, t])), [solutionTypes]);

    const stats = useMemo(() => {
        // Headcount Sets (Unique People)
        const typeHC = new Map<string, Set<string>>();
        const categoryHC = new Map<string, Set<string>>();
        const solutionHC = new Map<string, Set<string>>();

        // Assignment Counts (Total Roles Filled)
        const typeAssignments = new Map<string, number>();
        const categoryAssignments = new Map<string, number>();
        
        // FTE Sums (Capacity)
        const typeFTE = new Map<string, number>();
        const categoryFTE = new Map<string, number>();
        const solutionFTE = new Map<string, number>();

        // Pre-calculation map: FunctionalTeamID -> List of Employee IDs
        const teamEmployeesMap = new Map<string, string[]>();
        
        employees.forEach(emp => {
            (emp.functionalTeamIds || []).forEach(ftId => {
                if (!teamEmployeesMap.has(ftId)) teamEmployeesMap.set(ftId, []);
                teamEmployeesMap.get(ftId)!.push(emp.id);
            });
        });

        // Iterate through Functional Teams to propagate value to Value Streams
        functionalTeams.forEach(ft => {
            const assignedVsIds = ft.valueStreamIds || [];
            if (assignedVsIds.length === 0) return; // Team not assigned to any solution

            const teamMemberIds = teamEmployeesMap.get(ft.id) || [];
            if (teamMemberIds.length === 0) return; // Empty team

            // Split Rule 1: A team's capacity is split equally among the solutions it serves.
            const teamToSolutionFactor = 1 / assignedVsIds.length;

            teamMemberIds.forEach(empId => {
                const emp = employees.find(e => e.id === empId);
                if (!emp) return;

                // Split Rule 2: An employee's capacity is split equally among the teams they are in.
                const empTeamCount = emp.functionalTeamIds?.length || 0;
                const empToTeamFactor = empTeamCount > 0 ? (1 / empTeamCount) : 0;

                // Combined FTE contribution of this person, through this specific team, to a specific solution
                const contributionFTE = empToTeamFactor * teamToSolutionFactor;

                assignedVsIds.forEach(vsId => {
                    const vs = valueStreams.find(v => v.id === vsId);
                    if (vs) {
                        // --- Headcount (Reach) ---
                        if (!solutionHC.has(vsId)) solutionHC.set(vsId, new Set());
                        solutionHC.get(vsId)!.add(empId);

                        const catKey = `${vs.solutionType}:${vs.solutionCategory}`;
                        if (!categoryHC.has(catKey)) categoryHC.set(catKey, new Set());
                        categoryHC.get(catKey)!.add(empId);

                        if (!typeHC.has(vs.solutionType)) typeHC.set(vs.solutionType, new Set());
                        typeHC.get(vs.solutionType)!.add(empId);

                        // --- Assignments (Volume) ---
                        // Increment for every distinct path (Person -> Team -> Solution)
                        categoryAssignments.set(catKey, (categoryAssignments.get(catKey) || 0) + 1);
                        typeAssignments.set(vs.solutionType, (typeAssignments.get(vs.solutionType) || 0) + 1);

                        // --- FTE (Capacity) ---
                        solutionFTE.set(vsId, (solutionFTE.get(vsId) || 0) + contributionFTE);
                        categoryFTE.set(catKey, (categoryFTE.get(catKey) || 0) + contributionFTE);
                        typeFTE.set(vs.solutionType, (typeFTE.get(vs.solutionType) || 0) + contributionFTE);
                    }
                });
            });
        });

        return {
            getTypeStats: (type: string) => ({
                headcount: typeHC.get(type)?.size || 0,
                assignments: typeAssignments.get(type) || 0,
                fte: typeFTE.get(type) || 0
            }),
            getCategoryStats: (type: string, category: string) => ({
                headcount: categoryHC.get(`${type}:${category}`)?.size || 0,
                assignments: categoryAssignments.get(`${type}:${category}`) || 0,
                fte: categoryFTE.get(`${type}:${category}`) || 0
            }),
            getSolutionStats: (vsId: string) => ({
                headcount: solutionHC.get(vsId)?.size || 0,
                fte: solutionFTE.get(vsId) || 0
            }),
        };
    }, [employees, valueStreams, functionalTeams]);

    const taxonomy = useMemo(() => {
        const result: TaxonomyNode = {};
        
        // 1. Initialize structure based on defined solution types
        solutionTypes.forEach(typeDef => {
            result[typeDef.name] = {};
        });

        // 2. Add empty categories that exist in definition
        solutionCategories.forEach(cat => {
            if (cat.type) {
                if (!result[cat.type]) {
                    result[cat.type] = {};
                }
                if (!result[cat.type]![cat.name]) {
                    result[cat.type]![cat.name] = [];
                }
            }
        });

        // 3. Populate with Value Streams
        valueStreams.forEach(vs => {
            const { solutionType, solutionCategory } = vs;
            if (!result[solutionType]) {
                result[solutionType] = {};
            }
            if (!result[solutionType]![solutionCategory]) {
                result[solutionType]![solutionCategory] = [];
            }
            result[solutionType]![solutionCategory].push(vs);
        });
        
        return result;
    }, [valueStreams, solutionCategories, solutionTypes]);

    const handleMouseEnter = (item: ValueStream | Service, e: React.MouseEvent) => {
        setHoveredItem({ item, position: { top: e.clientY, left: e.clientX } });
    };

    const handleMouseLeave = () => {
        setHoveredItem(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Solution Taxonomy</h2>
            </div>
            <Card>
                <div className="flex items-start gap-4">
                    <SitemapIcon className="w-8 h-8 text-indigo-500 dark:text-indigo-400 flex-shrink-0 mt-1" />
                    <div className="space-y-1">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Solution Hierarchy & Resource Metrics</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            This diagram shows the TBM solution hierarchy with metrics derived from <span className="font-semibold text-pink-600 dark:text-pink-400">Functional Team</span> assignments.
                        </p>
                        <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 ml-2">
                            <li><strong>Unique:</strong> Distinct individuals found in the assigned teams (Reach).</li>
                            <li><strong>Roles:</strong> Total team seats filled. (One person in two assigned teams counts as 2 roles).</li>
                            <li><strong>FTE:</strong> Estimated capacity. An employee's time is split equally across their teams, and a team's time is split equally across its solutions.</li>
                        </ul>
                    </div>
                </div>
            </Card>

            <div className="space-y-8">
                {Object.entries(taxonomy).map(([type, categories]) => {
                    const typeStats = stats.getTypeStats(type);
                    const isSplit = typeStats.assignments > typeStats.headcount;
                    const typeDef = solutionTypeMap.get(type);
                    const colorClass = typeDef ? colorClasses[typeDef.colorTheme] : colorClasses['slate'];
                    
                    return (
                        <div key={type} className={`p-4 border-l-4 ${colorClass || 'bg-gray-100 border-gray-300'}`}>
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                                {type}
                                <div 
                                    className="text-sm font-medium text-slate-600 dark:text-slate-300 bg-white/60 dark:bg-black/20 px-3 py-1 rounded-full flex items-center gap-2 border border-slate-200 dark:border-slate-700/50 cursor-help shadow-sm"
                                    title={`Reach: ${typeStats.headcount} unique individuals\nVolume: ${typeStats.assignments} total roles filled\nCapacity: ${typeStats.fte.toFixed(1)} FTE`}
                                >
                                    <div className="flex items-center gap-1">
                                        <UsersIcon className="w-4 h-4" /> 
                                        <span>{typeStats.headcount} Unique</span>
                                    </div>
                                    {isSplit && (
                                        <span className="text-slate-400 border-l border-slate-300 dark:border-slate-600 pl-2">
                                            {typeStats.assignments} Roles
                                        </span>
                                    )}
                                    <span className="text-slate-400 border-l border-slate-300 dark:border-slate-600 pl-2">
                                        {typeStats.fte.toFixed(1)} FTE
                                    </span>
                                </div>
                            </h3>
                            {typeDef?.description && (
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 mb-2 italic">{typeDef.description}</p>
                            )}
                            <div className="mt-4 space-y-4">
                                {Object.entries(categories).sort((a,b) => a[0].localeCompare(b[0])).map(([category, solutions]) => {
                                    const catStats = stats.getCategoryStats(type, category);
                                    const isCatSplit = catStats.assignments > catStats.headcount;

                                    return (
                                        <div key={category} className="pl-4">
                                            <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 pb-1 mb-2 inline-flex items-center gap-3">
                                                {category}
                                                <div 
                                                    className="text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full flex items-center gap-2 cursor-help"
                                                    title={`Reach: ${catStats.headcount} unique individuals\nVolume: ${catStats.assignments} total roles filled\nCapacity: ${catStats.fte.toFixed(1)} FTE`}
                                                >
                                                     <div className="flex items-center gap-1">
                                                        <UsersIcon className="w-3 h-3" /> 
                                                        <span>{catStats.headcount}</span>
                                                    </div>
                                                    {isCatSplit && (
                                                        <span className="opacity-75 border-l border-slate-400 pl-2">
                                                            {catStats.assignments} Roles
                                                        </span>
                                                    )}
                                                    <span className="opacity-75 border-l border-slate-400 pl-2">
                                                        {catStats.fte.toFixed(1)} FTE
                                                    </span>
                                                </div>
                                            </h4>
                                            
                                            {solutions.length === 0 ? (
                                                <p className="text-sm text-slate-400 italic pl-2">No solutions defined.</p>
                                            ) : (
                                                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                    {solutions.map(solution => {
                                                        const solStats = stats.getSolutionStats(solution.id);
                                                        return (
                                                            <div
                                                                key={solution.id}
                                                                className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-200"
                                                                onMouseEnter={(e) => handleMouseEnter(solution, e)}
                                                                onMouseLeave={handleMouseLeave}
                                                            >
                                                                <div className="flex justify-between items-start mb-2">
                                                                    <p className="font-bold text-indigo-700 dark:text-indigo-400 leading-tight">{solution.name}</p>
                                                                    <span 
                                                                        className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded ml-2 whitespace-nowrap cursor-help"
                                                                        title={`${solStats.headcount} people | ${solStats.fte.toFixed(1)} FTE`}
                                                                    >
                                                                        <UsersIcon className="w-3 h-3" /> {solStats.headcount} ({solStats.fte.toFixed(1)} FTE)
                                                                    </span>
                                                                </div>
                                                                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                                                                    <h5 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Services / Offerings:</h5>
                                                                    {solution.serviceIds && solution.serviceIds.length > 0 ? (
                                                                        <div className="flex flex-wrap gap-2">
                                                                            {solution.serviceIds.map(serviceId => {
                                                                                const service = serviceMap.get(serviceId);
                                                                                if (!service) return null;
                                                                                return (
                                                                                    <span
                                                                                        key={serviceId}
                                                                                        className="px-2.5 py-1 text-xs font-semibold text-gray-800 bg-gray-100 dark:text-gray-100 dark:bg-gray-700 rounded-full cursor-default"
                                                                                        onMouseEnter={(e) => handleMouseEnter(service, e)}
                                                                                        onMouseLeave={handleMouseLeave}
                                                                                    >
                                                                                        {service.name}
                                                                                    </span>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    ) : (
                                                                        <p className="text-xs text-slate-400 italic">No services defined</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
            {hoveredItem && <Tooltip item={hoveredItem.item} position={hoveredItem.position} />}
        </div>
    );
};

export default SolutionTaxonomyView;
