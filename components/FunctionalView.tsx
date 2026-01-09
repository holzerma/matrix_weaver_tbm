
import React, { useState, useRef, useLayoutEffect, useEffect, useMemo, useCallback } from 'react';
import { AppData, Employee, ValueStream, FunctionalTeam, SolutionType } from '../types';
import Card from './common/Card';
import UserStarIcon from './icons/UserStarIcon';
import OrgChartIcon from './icons/OrgChartIcon';
import UsersIcon from './icons/UsersIcon';
import XCircleIcon from './icons/XCircleIcon';
import FilterIcon from './icons/FilterIcon';
import UserGroupIcon from './icons/UserGroupIcon';

type Position = { x: number; y: number; width: number; height: number };
type Positions = Record<string, Position>;
type Connection = { key: string; d: string; ftId: string; vsId: string; strength: number };
type Highlight = { type: 'vs' | 'ft' | null; id: string | null };

const modelBadges: Record<string, string> = {
    'Scrum': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Kanban': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Project': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    'IT-Demand': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'Other': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
};

const FunctionalView: React.FC<{ data: AppData }> = ({ data }) => {
    const { employees, functionalTeams, valueStreams, solutionTypes = [] } = data;
    const containerRef = useRef<HTMLDivElement>(null);
    const elementRefs = useRef<Map<string, HTMLElement | null>>(new Map());
    const [positions, setPositions] = useState<Positions>({});
    const [connections, setConnections] = useState<Connection[]>([]);
    const [highlight, setHighlight] = useState<Highlight>({ type: null, id: null });

    // Filter State
    const [filterOperatingModel, setFilterOperatingModel] = useState<string>('All');
    const [filterSolutionType, setFilterSolutionType] = useState<SolutionType | 'All'>('All');

    // Filter Logic
    const filteredFunctionalTeams = useMemo(() => {
        return functionalTeams.filter(ft => {
            return filterOperatingModel === 'All' || ft.operatingModel === filterOperatingModel;
        }).sort((a, b) => a.name.localeCompare(b.name));
    }, [functionalTeams, filterOperatingModel]);

    const filteredValueStreams = useMemo(() => {
        return valueStreams.filter(vs => {
            return filterSolutionType === 'All' || vs.solutionType === filterSolutionType;
        }).sort((a, b) => a.name.localeCompare(b.name));
    }, [valueStreams, filterSolutionType]);

    // FTE Calculation Logic
    const valueStreamFteMap = useMemo(() => {
        const fteMap = new Map<string, number>();
        const teamMap = new Map<string, FunctionalTeam>(functionalTeams.map(t => [t.id, t]));

        employees.forEach(emp => {
            const directVsIds = emp.valueStreamIds || [];
            const teamIds = emp.functionalTeamIds || [];
            
            // Only consider valid teams that actually exist in the system
            const validTeamIds = teamIds.filter(id => teamMap.has(id));
            
            // An employee's total capacity (1.0 FTE) is split between their direct contexts and their team contexts.
            // Each direct assignment counts as 1 unit.
            // Each team membership counts as 1 unit.
            const totalAllocationUnits = directVsIds.length + validTeamIds.length;
            
            if (totalAllocationUnits === 0) return;

            const ftePerUnit = 1.0 / totalAllocationUnits;

            // 1. Distribute FTE for Direct Assignments
            directVsIds.forEach(vsId => {
                fteMap.set(vsId, (fteMap.get(vsId) || 0) + ftePerUnit);
            });

            // 2. Distribute FTE for Team Assignments
            validTeamIds.forEach(ftId => {
                const team = teamMap.get(ftId)!;
                const teamVsIds = team.valueStreamIds || [];
                if (teamVsIds.length > 0) {
                    // The portion of time the employee gives to this team is further split 
                    // among the solutions that team serves.
                    const ftePerTeamVs = ftePerUnit / teamVsIds.length;
                    teamVsIds.forEach(vsId => {
                        fteMap.set(vsId, (fteMap.get(vsId) || 0) + ftePerTeamVs);
                    });
                }
            });
        });

        return fteMap;
    }, [employees, functionalTeams]);

    const setRef = useCallback((id: string, node: HTMLElement | null) => {
        if (node) {
            elementRefs.current.set(id, node);
        } else {
            elementRefs.current.delete(id);
        }
    }, []);

    useLayoutEffect(() => {
        const calculatePositions = () => {
            const newPositions: Positions = {};
            const containerRect = containerRef.current?.getBoundingClientRect();
            if (!containerRect) return;

            elementRefs.current.forEach((node, id) => {
                if (node) {
                    const rect = node.getBoundingClientRect();
                    newPositions[id] = {
                        x: rect.left - containerRect.left,
                        y: rect.top - containerRect.top,
                        width: rect.width,
                        height: rect.height,
                    };
                }
            });
            setPositions(newPositions);
        };

        calculatePositions();
        const resizeObserver = new ResizeObserver(calculatePositions);
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }
        
        const timeoutId = setTimeout(calculatePositions, 100); // Slight delay for rendering

        return () => {
            resizeObserver.disconnect();
            clearTimeout(timeoutId);
        };
    }, [filteredFunctionalTeams, filteredValueStreams]); 

    useEffect(() => {
        const newConnections: Connection[] = [];

        // Iterate through filtered Functional Teams to establish connections
        filteredFunctionalTeams.forEach(ft => {
            // Skip if no solutions assigned
            if (!ft.valueStreamIds || ft.valueStreamIds.length === 0) return;

            // Calculate strength based on team size (Capacity)
            const teamMembersCount = employees.filter(e => e.functionalTeamIds && e.functionalTeamIds.includes(ft.id)).length;
            const strength = Math.max(1, teamMembersCount);

            ft.valueStreamIds.forEach(vsId => {
                // Only create connection if the target Value Stream is visible
                if (filteredValueStreams.some(vs => vs.id === vsId)) {
                    const ftPos = positions[ft.id];
                    const vsPos = positions[vsId];

                    if (ftPos && vsPos) {
                        const key = `${ft.id}::${vsId}`;
                        const startX = ftPos.x + ftPos.width / 2;
                        const startY = ftPos.y + ftPos.height;
                        const endX = vsPos.x + vsPos.width / 2;
                        const endY = vsPos.y;

                        const cpx1 = startX;
                        const cpy1 = startY + 80;
                        const cpx2 = endX;
                        const cpy2 = endY - 80;

                        newConnections.push({
                            key: key,
                            d: `M ${startX} ${startY} C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${endX} ${endY}`,
                            ftId: ft.id,
                            vsId: vsId,
                            strength: strength
                        });
                    }
                }
            });
        });

        setConnections(newConnections);
    }, [positions, employees, filteredFunctionalTeams, filteredValueStreams]);
    
    const isConnectionHighlighted = (conn: Connection) => {
        if (!highlight.id || !highlight.type) return false;
        if (highlight.type === 'vs') return highlight.id === conn.vsId;
        if (highlight.type === 'ft') return highlight.id === conn.ftId;
        return false;
    };

    const getCardClasses = (type: 'ft' | 'vs', id: string) => {
        if (!highlight.id) return 'opacity-100';

        let isActive = false;
        if (highlight.type === type && highlight.id === id) {
            isActive = true;
        } else if (highlight.type === 'ft' && type === 'vs') {
            // Highlight VS if connected to highlighted FT
            const isConnected = connections.some(c => c.ftId === highlight.id && c.vsId === id);
            if (isConnected) isActive = true;
        } else if (highlight.type === 'vs' && type === 'ft') {
            // Highlight FT if connected to highlighted VS
            const isConnected = connections.some(c => c.vsId === highlight.id && c.ftId === id);
            if (isConnected) isActive = true;
        }

        return isActive ? 'opacity-100 scale-105 shadow-lg' : 'opacity-30 blur-sm grayscale';
    };

    const getEmployeeAvatars = (empIds: string[]) => {
        const emps = employees.filter(e => empIds.includes(e.id));
        return (
            <div className="flex -space-x-2 overflow-hidden py-1">
                {emps.slice(0, 5).map(emp => (
                    <div key={emp.id} className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-slate-800 bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-[10px] font-bold text-indigo-800 dark:text-indigo-200" title={emp.name}>
                        {emp.name.charAt(0)}
                    </div>
                ))}
                {emps.length > 5 && (
                    <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-slate-800 bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300">
                        +{emps.length - 5}
                    </div>
                )}
            </div>
        );
    }

    // Helper to get employees in a Functional Team
    const getTeamMembers = (ftId: string) => employees.filter(e => e.functionalTeamIds && e.functionalTeamIds.includes(ftId));
    
    // Helper to get unique employees involved in a Value Stream (for Avatar display)
    const getVsMembers = useCallback((vsId: string) => {
        const assignedTeamIds = functionalTeams
            .filter(ft => ft.valueStreamIds && ft.valueStreamIds.includes(vsId))
            .map(ft => ft.id);
        
        return employees.filter(e => {
            const inAssignedTeam = e.functionalTeamIds && e.functionalTeamIds.some(ftId => assignedTeamIds.includes(ftId));
            const isDirectlyAssigned = e.valueStreamIds && e.valueStreamIds.includes(vsId);
            return inAssignedTeam || isDirectlyAssigned;
        });
    }, [functionalTeams, employees]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Functional Map</h2>
            </div>
            
            <Card className="mb-6">
                <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2 flex-grow md:flex-grow-0">
                        <FilterIcon className="w-5 h-5 text-slate-500" />
                        <select
                            value={filterOperatingModel}
                            onChange={(e) => setFilterOperatingModel(e.target.value)}
                            className="block w-full md:w-auto rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 sm:text-sm py-2 pr-8"
                        >
                            <option value="All">All Operating Models</option>
                            <option value="Scrum">Scrum</option>
                            <option value="Kanban">Kanban</option>
                            <option value="Project">Project</option>
                            <option value="IT-Demand">IT-Demand</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2 flex-grow md:flex-grow-0">
                         <select
                            value={filterSolutionType}
                            onChange={(e) => setFilterSolutionType(e.target.value as SolutionType | 'All')}
                            className="block w-full md:w-auto rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 sm:text-sm py-2 pr-8"
                        >
                            <option value="All">All Solution Types</option>
                            {solutionTypes.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                        </select>
                    </div>
                    {(filterOperatingModel !== 'All' || filterSolutionType !== 'All') && (
                        <button onClick={() => { setFilterOperatingModel('All'); setFilterSolutionType('All'); }} className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 dark:text-red-400 font-medium whitespace-nowrap ml-auto md:ml-0">
                            <XCircleIcon className="w-4 h-4" /> Reset
                        </button>
                    )}
                </div>
            </Card>

            <Card>
                <div className="flex items-start gap-4">
                    <UserGroupIcon className="w-8 h-8 text-pink-500 dark:text-pink-400 flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Functional Interaction Map</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Visualizing how execution squads and functional teams align with value streams. 
                            Line thickness indicates capacity. Metrics show calculated FTE based on assignment splits.
                        </p>
                    </div>
                </div>
            </Card>

            <Card className="!p-0">
                <div ref={containerRef} onMouseLeave={() => setHighlight({ type: null, id: null })} className="relative bg-slate-50 dark:bg-slate-900/50 p-6 min-h-[800px] overflow-x-auto">
                    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                        <defs>
                            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" style={{ stopColor: '#6366f1', stopOpacity: 1 }} />
                                <stop offset="100%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
                            </linearGradient>
                        </defs>
                        <g>
                            {connections.map(conn => {
                                const isHighlighted = isConnectionHighlighted(conn);
                                const strokeWidth = Math.max(1, Math.min(conn.strength, 8)); // Cap thickness
                                return (
                                <path
                                    key={conn.key}
                                    d={conn.d}
                                    strokeWidth={isHighlighted ? strokeWidth + 2 : strokeWidth}
                                    className={`fill-none transition-all duration-300 ${isHighlighted ? 'stroke-indigo-500 dark:stroke-indigo-400 opacity-100' : 'stroke-slate-300 dark:stroke-slate-600 opacity-30'}`}
                                />
                            )})}
                        </g>
                    </svg>
                    <div className="relative z-10 flex flex-col items-center gap-24">
                        {/* Functional Teams Row (Top) */}
                        <div className="w-full space-y-4">
                            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 text-center">Functional Teams / Squads</h3>
                            {filteredFunctionalTeams.length === 0 ? (
                                <p className="text-center text-slate-500 dark:text-slate-400 italic">No teams match your filters.</p>
                            ) : (
                                <div className="flex flex-wrap justify-center gap-6">
                                    {filteredFunctionalTeams.map(ft => {
                                        const members = getTeamMembers(ft.id);
                                        return (
                                            <div 
                                                key={ft.id}
                                                ref={el => setRef(ft.id, el)}
                                                className={`w-72 bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border-t-4 border-pink-500 dark:border-pink-400 transition-all duration-300 cursor-default ${getCardClasses('ft', ft.id)}`}
                                                onMouseEnter={() => setHighlight({ type: 'ft', id: ft.id })}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-bold text-slate-800 dark:text-slate-100 text-md">{ft.name}</h4>
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${modelBadges[ft.operatingModel] || 'bg-gray-100'}`}>
                                                        {ft.operatingModel}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 h-8 overflow-hidden">{ft.description}</p>
                                                
                                                <div className="flex justify-between items-end border-t border-slate-100 dark:border-slate-700 pt-2">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] uppercase text-slate-400 font-bold">Members</span>
                                                        <span className="text-lg font-bold text-slate-700 dark:text-slate-200">{members.length}</span>
                                                    </div>
                                                    <div>
                                                        {getEmployeeAvatars(members.map(m => m.id))}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Value Streams Row (Bottom) */}
                        <div className="w-full space-y-4">
                             <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 text-center">Value Streams / Solutions</h3>
                             {filteredValueStreams.length === 0 ? (
                                <p className="text-center text-slate-500 dark:text-slate-400 italic">No solutions match your filters.</p>
                             ) : (
                                <div className="flex flex-wrap justify-center gap-6">
                                    {filteredValueStreams.map(vs => {
                                        const members = getVsMembers(vs.id);
                                        const fte = valueStreamFteMap.get(vs.id) || 0;
                                        return (
                                            <div 
                                                key={vs.id} 
                                                ref={el => setRef(vs.id, el)} 
                                                className={`w-72 bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border-t-4 border-indigo-500 dark:border-indigo-400 transition-all duration-300 cursor-default ${getCardClasses('vs', vs.id)}`}
                                                onMouseEnter={() => setHighlight({ type: 'vs', id: vs.id })}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-bold text-slate-800 dark:text-slate-100 text-md">{vs.name}</h4>
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                                                        {vs.solutionClassification?.substring(0, 1)}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 h-8 overflow-hidden">{vs.description}</p>
                                                
                                                <div className="flex justify-between items-end border-t border-slate-100 dark:border-slate-700 pt-2">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] uppercase text-slate-400 font-bold">Capacity</span>
                                                        <div className="flex items-baseline gap-1">
                                                            <span className="text-lg font-bold text-slate-700 dark:text-slate-200">{fte.toFixed(1)} FTE</span>
                                                            <span className="text-xs text-slate-500 font-medium">({members.length} ppl)</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        {getEmployeeAvatars(members.map(m => m.id))}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                             )}
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default FunctionalView;
