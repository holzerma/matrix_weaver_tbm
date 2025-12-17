
import React, { useState, useRef, useLayoutEffect, useEffect, useMemo, useCallback } from 'react';
import { AppData, Employee, ValueStream, Competence, Service, CompetenceTeamType } from '../types';
import Card from './common/Card';
import UserStarIcon from './icons/UserStarIcon';
import OrgChartIcon from './icons/OrgChartIcon';

type Position = { x: number; y: number; width: number; height: number };
type Positions = Record<string, Position>;
type Connection = { key: string; d: string; employeeId: string; vsId: string; competenceId: string };
type Highlight = { type: 'vs' | 'competence' | null; id: string | null };

const typeBadges: Record<CompetenceTeamType, string> = {
    'Product Team': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    'Crew': 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200',
    'Enabling Team': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    'Unassigned': 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300',
};

const OrganizationView: React.FC<{ data: AppData }> = ({ data }) => {
    const { employees, competences, valueStreams, services } = data;
    const containerRef = useRef<HTMLDivElement>(null);
    const elementRefs = useRef<Map<string, HTMLElement | null>>(new Map());
    const [positions, setPositions] = useState<Positions>({});
    const [connections, setConnections] = useState<Connection[]>([]);
    const [highlight, setHighlight] = useState<Highlight>({ type: null, id: null });

    const employeeCompetenceMap = useMemo(() => new Map(employees.map(e => [e.id, e.competenceId])), [employees]);
    const serviceMap = useMemo(() => new Map(services.map(s => [s.id, s.name])), [services]);

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
        
        const timeoutId = setTimeout(calculatePositions, 50);

        return () => {
            resizeObserver.disconnect();
            clearTimeout(timeoutId);
        };
    }, [data]);

    useEffect(() => {
        const newConnections: Connection[] = [];
        employees.forEach(emp => {
            emp.valueStreamIds.forEach(vsId => {
                const empPos = positions[emp.id];
                const vsPos = positions[vsId];

                if (empPos && vsPos) {
                    const startX = empPos.x + empPos.width / 2;
                    const startY = empPos.y + empPos.height;
                    const endX = vsPos.x + vsPos.width / 2;
                    const endY = vsPos.y;

                    const cpx1 = startX;
                    const cpy1 = startY + 60;
                    const cpx2 = endX;
                    const cpy2 = endY - 60;

                    newConnections.push({
                        key: `${emp.id}-${vsId}`,
                        d: `M ${startX} ${startY} C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${endX} ${endY}`,
                        employeeId: emp.id,
                        vsId: vsId,
                        competenceId: employeeCompetenceMap.get(emp.id) || '',
                    });
                }
            });
        });
        setConnections(newConnections);
    }, [positions, employees, employeeCompetenceMap]);
    
    const isConnectionHighlighted = (conn: Connection) => {
        if (!highlight.id || !highlight.type) return false;
        if (highlight.type === 'vs') return highlight.id === conn.vsId;
        if (highlight.type === 'competence') return highlight.id === conn.competenceId;
        return false;
    };

    const isEmployeeHighlighted = (emp: Employee) => {
        if (!highlight.id || !highlight.type) return false;
        if (highlight.type === 'competence' && highlight.id === emp.competenceId) return true;
        if (highlight.type === 'vs' && emp.valueStreamIds.includes(highlight.id)) return true;
        return false;
    };

    const getCardClasses = (type: 'competence' | 'vs', id: string) => {
        if (!highlight.id) return 'opacity-100';

        let isActive = false;
        if (highlight.type === type && highlight.id === id) {
            isActive = true;
        } else if (highlight.type === 'competence') {
            const competenceMembers = employees.filter(e => e.competenceId === highlight.id);
            if (type === 'vs' && competenceMembers.some(e => e.valueStreamIds.includes(id))) {
                 isActive = true;
            }
        } else if (highlight.type === 'vs') {
            const vsMembers = employees.filter(e => e.valueStreamIds.includes(highlight.id!));
            if (type === 'competence' && vsMembers.some(e => e.competenceId === id)) {
                isActive = true;
            }
        }

        return isActive ? 'opacity-100' : 'opacity-40 blur-sm grayscale';
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Organization View</h2>
            </div>
            <Card>
                <div className="flex items-start gap-4">
                    <OrgChartIcon className="w-8 h-8 text-indigo-500 dark:text-indigo-400 flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">How to use this chart</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            This is a live map of your organization. Hover over any competence or value stream to instantly see its connections and contributing members. This helps visualize resource allocation and team structure at a glance.
                        </p>
                    </div>
                </div>
            </Card>
            <Card className="!p-0">
                <div ref={containerRef} onMouseLeave={() => setHighlight({ type: null, id: null })} className="relative bg-slate-50 dark:bg-slate-900/50 p-6 min-h-[800px] overflow-x-auto">
                    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                        <g>
                            {connections.map(conn => {
                                const isHighlighted = isConnectionHighlighted(conn);
                                return (
                                <path
                                    key={conn.key}
                                    d={conn.d}
                                    strokeWidth={isHighlighted ? 2.5 : 1}
                                    className={`fill-none transition-all duration-300 ${isHighlighted ? 'stroke-indigo-500 dark:stroke-indigo-400 opacity-100' : 'stroke-slate-400 dark:stroke-slate-600 opacity-20'}`}
                                />
                            )})}
                        </g>
                    </svg>
                    <div className="relative z-10 flex flex-col items-center gap-8 md:gap-16">
                        <div className="w-full space-y-4">
                            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 text-center">Competences & Employees</h3>
                            <div className="flex flex-wrap justify-center gap-4">
                                {competences.map(competence => (
                                    <Card 
                                        key={competence.id}
                                        className={`w-72 !bg-white/80 dark:!bg-slate-800/80 backdrop-blur-sm transition-all duration-300 ${getCardClasses('competence', competence.id)}`}
                                        onMouseEnter={() => setHighlight({ type: 'competence', id: competence.id })}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-indigo-700 dark:text-indigo-400">{competence.name}</h4>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${typeBadges[competence.teamType || 'Unassigned']}`}>
                                                {competence.teamType || 'Unassigned'}
                                            </span>
                                        </div>
                                        {competence.lineTeamName && (
                                            <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 italic mb-1 uppercase tracking-tight">Line: {competence.lineTeamName}</p>
                                        )}
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{competence.skill}</p>
                                        <div className="space-y-2">
                                            {employees.filter(e => e.competenceId === competence.id).map(emp => (
                                                <div
                                                    key={emp.id}
                                                    ref={el => setRef(emp.id, el)}
                                                    className={`p-2 rounded-md flex justify-between items-center transition-all duration-200 ${isEmployeeHighlighted(emp) ? 'bg-indigo-100 dark:bg-indigo-900' : 'bg-slate-100 dark:bg-slate-700'}`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{emp.name}</span>
                                                        {emp.isManager && <span title="Manager" className="text-amber-500"><UserStarIcon /></span>}
                                                    </div>
                                                    <span className="text-xs text-slate-500 dark:text-slate-400">{emp.role}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        <div className="w-full space-y-4">
                             <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 text-center">Value Streams</h3>
                            <div className="flex flex-wrap justify-center gap-4">
                                {valueStreams.map(vs => (
                                    <div key={vs.id} ref={el => setRef(vs.id, el)} className="w-72">
                                         <Card
                                            onMouseEnter={() => setHighlight({ type: 'vs', id: vs.id })}
                                            className={`h-full !bg-white/80 dark:!bg-slate-800/80 backdrop-blur-sm transition-all duration-300 ${getCardClasses('vs', vs.id)}`}
                                         >
                                            <h4 className="font-bold text-green-700 dark:text-green-400">{vs.name}</h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{vs.description}</p>
                                            {vs.serviceIds && vs.serviceIds.length > 0 && (
                                                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                                                    <h5 className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">Provided Services:</h5>
                                                    <div className="flex flex-wrap gap-1">
                                                        {vs.serviceIds.map(serviceId => (
                                                            <span key={serviceId} className="px-2 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 dark:text-gray-100 dark:bg-gray-700 rounded-full">
                                                                {serviceMap.get(serviceId) || 'Unknown'}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default OrganizationView;
