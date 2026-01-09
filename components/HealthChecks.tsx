
import React, { useState, useMemo } from 'react';
import { AppData, Skill, Service, Employee } from '../types';
import Card from './common/Card';
import ShieldCheckIcon from './icons/ShieldCheckIcon';
import AlertTriangleIcon from './icons/AlertTriangleIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';
import UsersIcon from './icons/UsersIcon';

interface HealthChecksProps {
    data: AppData;
}

const HealthCheckSection: React.FC<{
    title: string;
    description?: string;
    isHealthy: boolean;
    children: React.ReactNode;
    extraControls?: React.ReactNode;
}> = ({ title, description, isHealthy, children, extraControls }) => {
    const [isExpanded, setIsExpanded] = useState(!isHealthy);

    return (
        <Card className={`border-l-4 ${isHealthy ? 'border-green-500' : 'border-amber-500'}`}>
            <div className="flex justify-between items-start">
                <button 
                    className="flex-grow text-left group focus:outline-none"
                    onClick={() => setIsExpanded(!isExpanded)}
                    type="button"
                >
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h4>
                        {isHealthy ? (
                            <span className="flex items-center gap-1 text-xs font-bold text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/50 px-2 py-0.5 rounded-full uppercase">
                                <CheckCircleIcon className="w-4 h-4" /> Healthy
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-900/50 px-2 py-0.5 rounded-full uppercase">
                                <AlertTriangleIcon className="w-4 h-4" /> Needs Attention
                            </span>
                        )}
                    </div>
                    {description && <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>}
                </button>
                <div className="flex items-center gap-4 pl-4 pt-1">
                    {extraControls && (
                        <div onClick={e => e.stopPropagation()}>
                            {extraControls}
                        </div>
                    )}
                    <button onClick={() => setIsExpanded(!isExpanded)} className="focus:outline-none">
                        <ChevronDownIcon className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </div>
            {isExpanded && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 animate-fadeIn">
                    {children}
                    {isHealthy && !extraControls && ( // Only show "No issues" text if it's healthy and there isn't a control that might reveal data
                        <p className="text-sm text-slate-500 italic mt-2">No issues detected.</p>
                    )}
                </div>
            )}
        </Card>
    );
};

const HealthChecks: React.FC<HealthChecksProps> = ({ data }) => {
    const { employees, valueStreams, services, skills, functionalTeams } = data;
    const [externalThreshold, setExternalThreshold] = useState(50);

    // --- Check 1: Service Catalog Health ---
    const { unassignedServices, sharedServices } = useMemo(() => {
        const serviceUsageCount = new Map<string, number>();
        valueStreams.forEach(vs => {
            (vs.serviceIds || []).forEach(serviceId => {
                serviceUsageCount.set(serviceId, (serviceUsageCount.get(serviceId) || 0) + 1);
            });
        });

        const unassigned = services.filter(s => !serviceUsageCount.has(s.id));
        const shared = services.filter(s => (serviceUsageCount.get(s.id) || 0) > 1);

        return { unassignedServices: unassigned, sharedServices: shared };
    }, [services, valueStreams]);

    // --- Check 2: Skill Coverage Health ---
    const atRiskSkills = useMemo(() => {
        const skillUsageCount = new Map<string, number>();
        employees.forEach(emp => {
            emp.skills.forEach(skill => {
                skillUsageCount.set(skill.skillId, (skillUsageCount.get(skill.skillId) || 0) + 1);
            });
        });
        
        const atRisk: Skill[] = [];
        skillUsageCount.forEach((count, skillId) => {
            if (count === 1) {
                const skill = skills.find(s => s.id === skillId);
                if (skill) {
                    atRisk.push(skill);
                }
            }
        });

        return atRisk;
    }, [employees, skills]);

    // --- Check 3: Fractured Focus (Context Switching) ---
    // Stricter Thresholds: 
    // Red: > 5 Streams OR >= 2 Functional Teams
    // Orange: > 3 Streams
    const fracturedEmployees = useMemo(() => {
        const ftMap = new Map(functionalTeams.map(ft => [ft.id, ft]));

        return employees.map(emp => {
            const ftCount = emp.functionalTeamIds ? emp.functionalTeamIds.length : 0;
            const directVsIds = emp.valueStreamIds || [];
            
            // Calculate inherited VS IDs from Functional Teams
            const inheritedVsIds = new Set<string>();
            (emp.functionalTeamIds || []).forEach(ftId => {
                const team = ftMap.get(ftId);
                if (team && team.valueStreamIds) {
                    team.valueStreamIds.forEach(vsId => inheritedVsIds.add(vsId));
                }
            });

            // Combine sets
            const allUniqueVsIds = new Set([...directVsIds, ...Array.from(inheritedVsIds)]);
            const totalVsCount = allUniqueVsIds.size;

            let severity: 'critical' | 'warning' | 'healthy' = 'healthy';

            if (ftCount >= 2 || totalVsCount > 5) {
                severity = 'critical';
            } else if (totalVsCount > 3) {
                severity = 'warning';
            }

            return {
                ...emp,
                severity,
                metrics: {
                    ftCount,
                    totalVsCount,
                    directVsCount: directVsIds.length,
                    inheritedVsCount: inheritedVsIds.size, // Size of unique inherited
                    uniqueInheritedOnly: Array.from(inheritedVsIds).filter(id => !directVsIds.includes(id)).length
                }
            };
        }).filter(emp => emp.severity !== 'healthy')
          .sort((a, b) => (a.severity === 'critical' ? -1 : 1)); // Critical first
    }, [employees, functionalTeams]);

    // --- Check 4: External Dependency Risk ---
    const externalDependencyRisks = useMemo(() => {
        const risks: { vs: any; externalCount: number; totalCount: number; percentage: number }[] = [];
        
        valueStreams.forEach(vs => {
            const members = employees.filter(e => e.valueStreamIds.includes(vs.id));
            const totalCount = members.length;
            if (totalCount === 0) return;

            const externalCount = members.filter(e => e.employeeType === 'external').length;
            const percentage = (externalCount / totalCount) * 100;

            if (percentage > externalThreshold) {
                risks.push({ vs, externalCount, totalCount, percentage });
            }
        });

        return risks;
    }, [valueStreams, employees, externalThreshold]);

    // Helper maps for display
    const ftMap = useMemo(() => new Map(functionalTeams.map(ft => [ft.id, ft.name])), [functionalTeams]);
    
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-600 text-white shadow-lg">
                    <ShieldCheckIcon className="w-8 h-8" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Organizational Health Checks</h2>
                    <p className="text-slate-600 dark:text-slate-400">Automated guardrails to identify structural, financial, and operational risks.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                
                {/* Check 4: External Dependency Risk (New) */}
                <HealthCheckSection
                    title="External Dependency Risk"
                    description="Flags solutions with a high reliance on external contractors, posing potential IP retention and knowledge transfer risks."
                    isHealthy={externalDependencyRisks.length === 0}
                    extraControls={
                        <div className="flex items-center gap-2">
                            <label htmlFor="extThreshold" className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">Threshold:</label>
                            <div className="relative">
                                <input 
                                    id="extThreshold"
                                    type="number" 
                                    min="1" 
                                    max="100" 
                                    value={externalThreshold} 
                                    onChange={(e) => setExternalThreshold(Number(e.target.value))}
                                    className="w-16 px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:ring-indigo-500 focus:border-indigo-500 pr-6"
                                />
                                <span className="absolute right-2 top-1 text-xs text-slate-400 pointer-events-none">%</span>
                            </div>
                        </div>
                    }
                >
                    {externalDependencyRisks.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-slate-50 dark:bg-slate-800/50">
                                    <tr>
                                        <th className="px-4 py-2 text-left font-medium text-slate-500 dark:text-slate-400">Value Stream / Solution</th>
                                        <th className="px-4 py-2 text-left font-medium text-slate-500 dark:text-slate-400">External Ratio</th>
                                        <th className="px-4 py-2 text-left font-medium text-slate-500 dark:text-slate-400">Composition (Ext / Total)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                    {externalDependencyRisks.map(risk => (
                                        <tr key={risk.vs.id}>
                                            <td className="px-4 py-2 font-medium text-slate-800 dark:text-slate-200">{risk.vs.name}</td>
                                            <td className="px-4 py-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                                                        <div className="bg-red-500 h-full rounded-full" style={{ width: `${risk.percentage}%` }}></div>
                                                    </div>
                                                    <span className="text-red-600 font-bold">{risk.percentage.toFixed(0)}%</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-2 text-slate-600 dark:text-slate-400">
                                                {risk.externalCount} / {risk.totalCount} employees
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-sm text-slate-500 italic">No solutions exceed the {externalThreshold}% external contractor threshold.</p>
                    )}
                </HealthCheckSection>

                {/* Fractured Focus Check */}
                <HealthCheckSection
                    title="Fractured Focus & Context Switching"
                    description="Identifies employees suffering from high cognitive load. Critical if assigned to ≥2 Functional Teams or >5 Value Streams. Warning if >3 Value Streams."
                    isHealthy={fracturedEmployees.length === 0}
                >
                    {fracturedEmployees.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-slate-50 dark:bg-slate-800/50">
                                <tr>
                                    <th className="px-4 py-2 text-left font-medium text-slate-500 dark:text-slate-400">Employee</th>
                                    <th className="px-4 py-2 text-left font-medium text-slate-500 dark:text-slate-400">Status</th>
                                    <th className="px-4 py-2 text-left font-medium text-slate-500 dark:text-slate-400">Functional Teams (Limit: 1)</th>
                                    <th className="px-4 py-2 text-left font-medium text-slate-500 dark:text-slate-400">Value Streams / Solutions (Limit: 3)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {fracturedEmployees.map(emp => (
                                    <tr key={emp.id} className={emp.severity === 'critical' ? 'bg-red-50/50 dark:bg-red-900/10' : ''}>
                                        <td className="px-4 py-2 font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                            <UsersIcon className="w-4 h-4 text-slate-400" />
                                            {emp.name}
                                        </td>
                                        <td className="px-4 py-2">
                                            {emp.severity === 'critical' ? (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200 uppercase">
                                                    Critical
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200 uppercase">
                                                    Warning
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-2">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    {emp.metrics.ftCount >= 2 ? (
                                                        <span className="text-red-600 dark:text-red-400 font-bold text-xs">{emp.metrics.ftCount} Functional Teams</span>
                                                    ) : (
                                                        <span className="text-slate-600 dark:text-slate-400 text-xs">{emp.metrics.ftCount} Functional Teams</span>
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap gap-1">
                                                    {emp.functionalTeamIds?.map(id => (
                                                        <span key={id} className="text-[10px] bg-white dark:bg-slate-700 px-1.5 rounded text-slate-500 border border-slate-200 dark:border-slate-600">{ftMap.get(id)}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-2">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    {emp.metrics.totalVsCount > 5 ? (
                                                        <span className="text-red-600 dark:text-red-400 font-bold text-xs">{emp.metrics.totalVsCount} Value Streams / Solutions</span>
                                                    ) : emp.metrics.totalVsCount > 3 ? (
                                                        <span className="text-amber-600 dark:text-amber-400 font-bold text-xs">{emp.metrics.totalVsCount} Value Streams / Solutions</span>
                                                    ) : (
                                                        <span className="text-slate-600 dark:text-slate-400 text-xs">{emp.metrics.totalVsCount} Value Streams / Solutions</span>
                                                    )}
                                                </div>
                                                <p className="text-[10px] text-slate-400">
                                                    {emp.metrics.directVsCount} Direct + {emp.metrics.uniqueInheritedOnly} Inherited
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    ) : null}
                </HealthCheckSection>

                {/* Service Catalog Check */}
                <HealthCheckSection 
                    title="Service Catalog Hygiene"
                    description="Ensures all defined services have an owner (Value Stream / Solution) and identifies potentially redundant shared services."
                    isHealthy={unassignedServices.length === 0 && sharedServices.length === 0}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {unassignedServices.length > 0 && (
                            <div>
                                <h5 className="text-xs font-bold uppercase text-red-500 mb-2">Unassigned Services (Ghost Services)</h5>
                                <ul className="space-y-1">
                                    {unassignedServices.map(s => (
                                        <li key={s.id} className="text-sm p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-100 dark:border-red-900/30 text-slate-700 dark:text-slate-300">
                                            {s.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {sharedServices.length > 0 && (
                            <div>
                                <h5 className="text-xs font-bold uppercase text-amber-500 mb-2">Shared Services (Duplication Risk)</h5>
                                <ul className="space-y-1">
                                    {sharedServices.map(s => (
                                        <li key={s.id} className="text-sm p-2 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-100 dark:border-amber-900/30 text-slate-700 dark:text-slate-300">
                                            {s.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </HealthCheckSection>

                {/* Skill Coverage Check */}
                <HealthCheckSection
                    title="Skill Resilience & Bus Factor"
                    description="Highlights critical skills that are possessed by only one employee, representing a single point of failure."
                    isHealthy={atRiskSkills.length === 0}
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {atRiskSkills.map(s => (
                            <div key={s.id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-md">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{s.name}</span>
                                <span className="text-xs bg-white dark:bg-slate-800 px-2 py-1 rounded text-slate-500 border border-slate-200 dark:border-slate-700">{s.category}</span>
                            </div>
                        ))}
                    </div>
                </HealthCheckSection>

            </div>
        </div>
    );
};

export default HealthChecks;
