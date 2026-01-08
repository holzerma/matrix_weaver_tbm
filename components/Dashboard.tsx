
import React, { useMemo, useState } from 'react';
import { AppData, Competence, Employee, ValueStream, CostPool, ResourceTower, Service, Skill } from '../types';
import Card from './common/Card';
import UsersIcon from './icons/UsersIcon';
import StreamIcon from './icons/StreamIcon';
import BookOpenIcon from './icons/BookOpenIcon';
import TowerIcon from './icons/TowerIcon';
import FilterIcon from './icons/FilterIcon';
import XCircleIcon from './icons/XCircleIcon';
import UserStarIcon from './icons/UserStarIcon';
import PrinterIcon from './icons/PrinterIcon';
import DollarSignIcon from './icons/DollarSignIcon';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import ResourceTowerIcon from './icons/ResourceTowerIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';
import ShieldCheckIcon from './icons/ShieldCheckIcon';
import AlertTriangleIcon from './icons/AlertTriangleIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';

interface DashboardProps {
    data: AppData;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
};

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string; }> = ({ icon, title, value }) => (
    <Card>
        <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300">
                {icon}
            </div>
            <div className="ml-4">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">{title}</p>
                <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{value}</p>
            </div>
        </div>
    </Card>
);

const HealthCheckSection: React.FC<{
    title: string;
    isHealthy: boolean;
    children: React.ReactNode;
}> = ({ title, isHealthy, children }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div>
            <button 
                className={`w-full flex justify-between items-center mb-2 text-left group ${!isHealthy ? 'cursor-pointer' : 'cursor-default'}`}
                onClick={() => !isHealthy && setIsExpanded(!isExpanded)}
                type="button"
                disabled={isHealthy}
            >
                <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-slate-700 dark:text-slate-200">{title}</h4>
                    {!isHealthy && (
                        <ChevronDownIcon className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                    )}
                </div>
                {isHealthy ? (
                    <span className="flex items-center gap-1.5 text-sm font-medium text-green-600 dark:text-green-400">
                        <CheckCircleIcon /> Healthy
                    </span>
                ) : (
                    <span className="flex items-center gap-1.5 text-sm font-medium text-amber-600 dark:text-amber-400">
                        <AlertTriangleIcon /> Needs Review
                    </span>
                )}
            </button>
            {!isHealthy && isExpanded && (
                <div className="mt-2 pl-2 border-l-2 border-slate-100 dark:border-slate-700 animate-fadeIn">
                    {children}
                </div>
            )}
        </div>
    );
};

const COLORS = ['#4338ca', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#8b5cf6'];
const MiniCell = ({ fill }: { fill: string }) => <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: fill }}></div>;


const Dashboard: React.FC<DashboardProps> = ({ data }) => {
    const { employees, valueStreams, competences, costPools, resourceTowers } = data;
    const [filter, setFilter] = useState<{ type: 'vs' | 'comp' | null; id: string | null }>({ type: null, id: null });

    const competenceMap = useMemo(() => new Map(competences.map(c => [c.id, c.name])), [competences]);
    const valueStreamMap = useMemo(() => new Map(valueStreams.map(vs => [vs.id, vs.name])), [valueStreams]);

    const handleFilterChange = (type: 'vs' | 'comp', id: string) => {
        if (id) {
            setFilter({ type, id });
        } else {
            setFilter({ type: null, id: null });
        }
    };
    
    const renderContent = () => {
        if (filter.type === 'vs' && filter.id) {
            const vs = valueStreams.find(v => v.id === filter.id);
            if (!vs) return <p>Solution not found.</p>;
            const members = employees.filter(e => e.valueStreamIds.includes(vs.id));
            return <ValueStreamDetailView valueStream={vs} members={members} data={data} />;
        }
        if (filter.type === 'comp' && filter.id) {
            const comp = competences.find(c => c.id === filter.id);
            if (!comp) return <p>Competence not found.</p>;
            const members = employees.filter(e => e.competenceId === comp.id);
            return <CompetenceDetailView competence={comp} members={members} valueStreamMap={valueStreamMap} />;
        }
        return <OverallDashboardView data={data} />;
    };
    
    const currentFilterName = useMemo(() => {
        if (filter.type === 'vs') return valueStreamMap.get(filter.id ?? '');
        if (filter.type === 'comp') return competenceMap.get(filter.id ?? '');
        return '';
    }, [filter, valueStreamMap, competenceMap]);

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                    Dashboard {currentFilterName && <span className="text-indigo-500 font-medium text-2xl">: {currentFilterName}</span>}
                </h2>
                <div className="flex items-center gap-2">
                    <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-300 dark:border-slate-600 divide-x divide-slate-300 dark:divide-slate-600 no-print">
                        <div className="flex items-center space-x-2 px-3 py-1.5">
                            <StreamIcon className="w-5 h-5 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                            <select
                                value={filter.type === 'vs' ? filter.id ?? '' : ''}
                                onChange={(e) => handleFilterChange('vs', e.target.value)}
                                className="bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none border-0 focus:ring-0"
                                aria-label="Filter by Solution"
                            >
                                <option value="">By Solution</option>
                                {valueStreams.map(vs => <option key={vs.id} value={vs.id}>{vs.name}</option>)}
                            </select>
                        </div>
                        <div className="flex items-center space-x-2 px-3 py-1.5">
                            <BookOpenIcon className="w-5 h-5 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                            <select
                                value={filter.type === 'comp' ? filter.id ?? '' : ''}
                                onChange={(e) => handleFilterChange('comp', e.target.value)}
                                className="bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none border-0 focus:ring-0"
                                aria-label="Filter by Competence"
                            >
                                 <option value="">By Competence</option>
                                {competences.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>
                    {filter.id && (
                         <button onClick={() => setFilter({ type: null, id: null })} className="text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 transition-colors no-print p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-300 dark:border-slate-600" aria-label="Clear filter">
                             <XCircleIcon />
                         </button>
                    )}
                     <button
                        onClick={() => window.print()}
                        className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors no-print"
                        aria-label="Download Report"
                    >
                        <PrinterIcon />
                        <span className="hidden sm:inline">Download Report</span>
                    </button>
                </div>
            </div>
            {renderContent()}
        </div>
    );
};


const OverallDashboardView: React.FC<{ data: AppData }> = ({ data }) => {
    const { employees, valueStreams, competences, costPools, resourceTowers, services, skills } = data;

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

    const { internalCost, externalCost, poolCost, totalCost } = useMemo(() => {
        const internal = employees.filter(e => e.employeeType === 'internal').reduce((sum, e) => sum + e.salary, 0);
        const external = employees.filter(e => e.employeeType === 'external').reduce((sum, e) => sum + e.salary, 0);
        const pool = valueStreams.reduce((sum, vs) => sum + vs.costPoolConsumption.reduce((s, cpc) => s + cpc.annualCost, 0), 0);
        return { internalCost: internal, externalCost: external, poolCost: pool, totalCost: internal + external + pool }
    }, [employees, valueStreams]);
    
    const costBreakdownData = [
        { name: 'Internal Employees', value: internalCost },
        { name: 'External Employees', value: externalCost },
        { name: 'Cost Pools', value: poolCost },
    ];

    const valueStreamMetrics = useMemo(() => {
        const vsMetrics = new Map<string, { totalSalary: number; employeeCount: number; internalCount: number, externalCount: number, resourceCost: number }>();
        valueStreams.forEach(vs => {
            const resourceCost = vs.costPoolConsumption.reduce((sum, cpc) => sum + cpc.annualCost, 0);
            vsMetrics.set(vs.id, { totalSalary: 0, employeeCount: 0, internalCount: 0, externalCount: 0, resourceCost });
        });
        employees.forEach(emp => {
            const salaryPerVs = emp.salary / (emp.valueStreamIds.length || 1);
            emp.valueStreamIds.forEach(vsId => {
                if (vsMetrics.has(vsId)) {
                    const current = vsMetrics.get(vsId)!;
                    current.totalSalary += salaryPerVs;
                    current.employeeCount += 1;
                    emp.employeeType === 'internal' ? current.internalCount += 1 : current.externalCount += 1;
                }
            });
        });
        return vsMetrics;
    }, [employees, valueStreams]);

    const competenceCostData = useMemo(() => {
        const compCosts: { [key: string]: number } = {};
        competences.forEach(c => compCosts[c.name] = 0);
        employees.forEach(emp => {
            const compName = competences.find(c => c.id === emp.competenceId)?.name;
            if (compName) {
                compCosts[compName] += emp.salary;
            }
        });
        return Object.entries(compCosts).map(([name, cost]) => ({ name, cost }));
    }, [employees, competences]);

     return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                <StatCard icon={<DollarSignIcon />} title="Total Annual Cost" value={formatCurrency(totalCost)} />
                <StatCard icon={<UsersIcon />} title="Total Employees" value={String(employees.length)} />
                <StatCard icon={<StreamIcon />} title="Solutions" value={String(valueStreams.length)} />
                <StatCard icon={<BookOpenIcon />} title="Competences" value={String(competences.length)} />
                <StatCard icon={<ResourceTowerIcon />} title="Resource Towers" value={String(resourceTowers.length)} />
                <StatCard icon={<TowerIcon />} title="Cost Pools" value={String(costPools.length)} />
            </div>

            <Card>
                 <div className="flex items-start gap-4 mb-4">
                    <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 flex-shrink-0">
                        <ShieldCheckIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Organizational Health Checks</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Review of service alignment and skill coverage risks.</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 border-t border-slate-200 dark:border-slate-700 pt-4">
                    {/* Service Catalog Health */}
                    <HealthCheckSection
                        title="Service Catalog"
                        isHealthy={unassignedServices.length === 0 && sharedServices.length === 0}
                    >
                         {unassignedServices.length > 0 && (
                            <div className="mt-2">
                                <h5 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Unassigned Services:</h5>
                                <ul className="list-disc list-inside space-y-1">
                                    {unassignedServices.map(s => (
                                        <li key={s.id} className="text-sm text-slate-600 dark:text-slate-300">{s.name}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                         {sharedServices.length > 0 && (
                             <div className="mt-2">
                                <h5 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Shared Services:</h5>
                                <ul className="list-disc list-inside space-y-1">
                                    {sharedServices.map(s => (
                                        <li key={s.id} className="text-sm text-slate-600 dark:text-slate-300">{s.name}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </HealthCheckSection>

                     {/* Skill Coverage Health */}
                    <HealthCheckSection
                        title="Skill Coverage"
                        isHealthy={atRiskSkills.length === 0}
                    >
                        {atRiskSkills.length > 0 && (
                            <div className="mt-2">
                                <h5 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">At-Risk Skills (Single Point of Failure):</h5>
                                <ul className="list-disc list-inside space-y-1">
                                    {atRiskSkills.map(s => (
                                        <li key={s.id} className="text-sm text-slate-600 dark:text-slate-300">{s.name}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </HealthCheckSection>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <Card className="lg:col-span-2">
                     <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">Overall Cost Breakdown</h3>
                     <div style={{ width: '100%', height: 350 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={costBreakdownData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" labelLine={false} label={({ percent }) => (typeof percent === 'number' ? `${(percent * 100).toFixed(0)}%` : '')}>
                                     {costBreakdownData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                <Legend />
                            </PieChart>
                         </ResponsiveContainer>
                     </div>
                </Card>
                <Card className="lg:col-span-3">
                     <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Cost Distribution by Competence</h3>
                    <div style={{ width: '100%', height: 350 }}>
                        <ResponsiveContainer>
                             <BarChart data={competenceCostData} margin={{ top: 20, right: 20, left: 20, bottom: 80 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.2)" />
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} angle={-45} textAnchor="end" interval={0} height={70} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value: any) => (typeof value === 'number' ? formatCurrency(value / 1000) + 'k' : value)} />
                                <Tooltip formatter={(value: number) => formatCurrency(value)} cursor={{ fill: 'rgba(199, 210, 254, 0.5)' }} />
                                <Bar dataKey="cost" fill="#4338ca" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
            
            <Card>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Solution Cost Analysis</h3>
                <div className="overflow-x-auto mt-4">
                    <table className="min-w-full">
                        <thead className="border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="text-left py-2 pr-2 font-semibold text-slate-600 dark:text-slate-300">Solution</th>
                                <th className="text-right py-2 px-2 font-semibold text-slate-600 dark:text-slate-300">Total Cost</th>
                                <th className="text-right py-2 px-2 font-semibold text-slate-600 dark:text-slate-300"># Employees</th>
                                <th className="text-right py-2 px-2 font-semibold text-slate-600 dark:text-slate-300">Int/Ext Ratio</th>
                            </tr>
                        </thead>
                        <tbody>
                        {valueStreams.map(vs => {
                            const metrics = valueStreamMetrics.get(vs.id);
                            if (!metrics) return null;
                            const totalVsCost = metrics.totalSalary + metrics.resourceCost;
                            return (
                                <tr key={vs.id} className="border-b border-slate-200 dark:border-slate-800">
                                    <td className="py-3 pr-2">
                                        <p className="font-semibold text-slate-800 dark:text-slate-100">{vs.name}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-md">{vs.description}</p>
                                    </td>
                                    <td className="py-3 px-2 text-right font-semibold text-indigo-600 dark:text-indigo-400 text-lg">{formatCurrency(totalVsCost)}</td>
                                    <td className="py-3 px-2 text-right text-slate-600 dark:text-slate-300">{metrics.employeeCount}</td>
                                    <td className="py-3 px-2 text-right text-slate-600 dark:text-slate-300">{`${metrics.internalCount} / ${metrics.externalCount}`}</td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

interface ValueStreamDetailViewProps {
    valueStream: ValueStream;
    members: Employee[];
    data: AppData;
}
const ValueStreamDetailView: React.FC<ValueStreamDetailViewProps> = ({ valueStream, members, data }) => {
    const { competences, resourceTowers, costPools, services } = data;
    const competenceMap = useMemo(() => new Map(competences.map(c => [c.id, c.name])), [competences]);
    const costPoolMap = useMemo(() => new Map(costPools.map(cp => [cp.id, cp])), [costPools]);
    const resourceTowerMap = useMemo(() => new Map(resourceTowers.map(rt => [rt.id, rt])), [resourceTowers]);
    const serviceMap = useMemo(() => new Map(services.map(s => [s.id, s])), [services]);

    const providedServices = useMemo(() => {
        return (valueStream.serviceIds || [])
            .map(id => serviceMap.get(id))
            .filter((s): s is Service => s !== undefined);
    }, [valueStream.serviceIds, serviceMap]);

    const metrics = useMemo(() => {
        const salaryCost = members.reduce((sum, m) => sum + (m.salary / (m.valueStreamIds.length || 1)), 0);
        const poolCost = valueStream.costPoolConsumption.reduce((sum, cpc) => sum + cpc.annualCost, 0);
        const managers = members.filter(m => m.isManager).length;
        const nonManagers = members.length - managers;
        const internal = members.filter(m => m.employeeType === 'internal').length;
        const external = members.length - internal;

        const sourceCostBreakdown = [
            { source: 'Employee Salaries', cost: salaryCost },
            ...valueStream.costPoolConsumption.map(cpc => ({
                source: costPoolMap.get(cpc.costPoolId)?.name || 'Unknown Pool',
                cost: cpc.annualCost,
            }))
        ].filter(item => item.cost > 0);

        return {
            salaryCost,
            poolCost,
            totalCost: salaryCost + poolCost,
            managerRatio: `${managers} / ${nonManagers}`,
            intExtRatio: `${internal} / ${external}`,
            managers, nonManagers, internal, external,
            sourceCostBreakdown,
        };
    }, [valueStream, members, costPoolMap]);

    const competenceCostData = useMemo(() => {
        const costs: { [competenceId: string]: { name: string, cost: number } } = {};
        members.forEach(m => {
            const compName = competenceMap.get(m.competenceId) || 'Unknown Competence';
            if (!costs[m.competenceId]) {
                costs[m.competenceId] = { name: compName, cost: 0 };
            }
            costs[m.competenceId].cost += (m.salary / (m.valueStreamIds.length || 1));
        });
        return Object.values(costs);
    }, [members, competenceMap]);

    // FIX: Explicitly type the initial value for the reduce function and use generic for better inference to avoid type errors.
    const costsByTower = useMemo(() => {
        type CostsByTowerAcc = Record<string, { towerName: string, tower: ResourceTower | undefined, costs: { costPoolId: string, annualCost: number }[] }>;
        return valueStream.costPoolConsumption.reduce((acc, cost) => {
            const pool = costPoolMap.get(cost.costPoolId);
            if (pool) {
                const towerId = pool.defaultResourceTowerId;
                if (!acc[towerId]) {
                    const tower = resourceTowerMap.get(towerId);
                    acc[towerId] = { towerName: tower?.name || 'Unassigned', tower, costs: [] };
                }
                acc[towerId].costs.push(cost);
            }
            return acc;
        }, {} as CostsByTowerAcc);
    }, [valueStream, costPoolMap, resourceTowerMap]);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={<UsersIcon />} title="Total Cost" value={formatCurrency(metrics.totalCost)} />
                <StatCard icon={<UsersIcon />} title="# Employees" value={String(members.length)} />
                <StatCard icon={<UserStarIcon className="w-6 h-6"/>} title="Manager Ratio (M/NM)" value={metrics.managerRatio} />
                <StatCard icon={<UsersIcon />} title="Int/Ext Ratio" value={metrics.intExtRatio} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <Card className="lg:col-span-2">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Source Cost Breakdown</h3>
                    <div className="mt-4" style={{ width: '100%', height: 250 }}>
                        <ResponsiveContainer>
                            <BarChart data={metrics.sourceCostBreakdown} layout="vertical" margin={{ top: 5, right: 20, left: 100, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(128,128,128,0.2)" />
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="source" width={120} tickLine={false} axisLine={false} fontSize={12} interval={0} />
                                <Tooltip formatter={(value: number) => formatCurrency(value)} cursor={{ fill: 'rgba(199, 210, 254, 0.5)' }} />
                                <Bar dataKey="cost" fill={COLORS[0]} radius={[0, 4, 4, 0]} barSize={20}>
                                    {metrics.sourceCostBreakdown.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.source === 'Employee Salaries' ? COLORS[1] : COLORS[0]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
                 <Card className="lg:col-span-3">
                     <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Competence Contribution (Cost)</h3>
                     <div style={{ width: '100%', height: 250 }}>
                         <ResponsiveContainer>
                            <BarChart data={competenceCostData} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.2)" />
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} interval={0} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value: any) => (typeof value === 'number' ? formatCurrency(value / 1000) + 'k' : value)} />
                                <Tooltip formatter={(value: number) => formatCurrency(value)} cursor={{ fill: 'rgba(199, 210, 254, 0.5)' }} />
                                <Bar dataKey="cost" fill={COLORS[0]} radius={[4, 4, 0, 0]} />
                            </BarChart>
                         </ResponsiveContainer>
                     </div>
                 </Card>
            </div>
            
            {providedServices.length > 0 && (
                <Card>
                    <div className="flex items-start gap-4 mb-4">
                        <div className="p-2 rounded-full bg-slate-100 dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 flex-shrink-0">
                            <BriefcaseIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Provided Services</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Services delivered by the {valueStream.name} solution.</p>
                        </div>
                    </div>
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                        {providedServices.map(service => (
                            <div key={service.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                                <p className="font-semibold text-slate-800 dark:text-slate-200">{service.name}</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{service.description}</p>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">Team Members ({members.length})</h3>
                    <div className="max-h-80 overflow-y-auto pr-2">
                        {members.map(m => (
                             <div key={m.id} className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700">
                                 <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                                            {m.name}
                                            {m.isManager && <span title="Manager" className="text-amber-500 inline-block align-middle ml-1"><UserStarIcon /></span>}
                                        </p>
                                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${m.employeeType === 'internal' ? 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200' : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'}`}>
                                            {m.employeeType}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{m.role}</p>
                                 </div>
                                 <p className="text-sm text-slate-600 dark:text-slate-300">{competenceMap.get(m.competenceId)}</p>
                            </div>
                        ))}
                    </div>
                </Card>
                 <Card>
                    <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">Consumed Resources & Costs</h3>
                     <div className="max-h-80 overflow-y-auto pr-2 space-y-3">
                        {/* FIX: Explicitly cast the entry to [string, any] to fix property does not exist on type {} error. */}
                        {Object.entries(costsByTower).map(([towerId, { tower, costs }]: [string, any]) => (
                            <div key={towerId}>
                                <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700">
                                     <div>
                                         <p className="font-semibold text-slate-800 dark:text-slate-200">{tower?.name || 'Unassigned'}</p>
                                         <p className="text-sm text-slate-500 dark:text-slate-400">{tower?.tower} / {tower?.domain}</p>
                                     </div>
                                      <span className="font-medium text-green-600 dark:text-green-400">{formatCurrency(costs.reduce((s: number, c: { annualCost: number }) => s + c.annualCost, 0))}</span>
                                </div>
                                <div className="pl-4 mt-1 space-y-1">
                                    {(costs as { costPoolId: string, annualCost: number }[]).map(c => (
                                        <div key={c.costPoolId} className="flex justify-between items-center">
                                            <p className="text-sm text-slate-600 dark:text-slate-300 pl-2 border-l-2 border-slate-300 dark:border-slate-600">
                                                {costPoolMap.get(c.costPoolId)?.name || 'Unknown Pool'}
                                            </p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{formatCurrency(c.annualCost)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                     </div>
                 </Card>
             </div>
        </div>
    );
};

interface CompetenceDetailViewProps {
    competence: Competence;
    members: Employee[];
    valueStreamMap: Map<string, string>;
}
const CompetenceDetailView: React.FC<CompetenceDetailViewProps> = ({ competence, members, valueStreamMap }) => {
    const metrics = useMemo(() => {
        const totalSalary = members.reduce((sum, m) => sum + m.salary, 0);
        return {
            totalSalary,
            avgSalary: members.length > 0 ? totalSalary / members.length : 0,
        };
    }, [members]);

    const vsAllocationData = useMemo(() => {
        const vsCounts: { [key: string]: number } = {};
        members.forEach(member => {
            member.valueStreamIds.forEach(vsId => {
                const vsName = valueStreamMap.get(vsId) || 'Unknown';
                vsCounts[vsName] = (vsCounts[vsName] || 0) + 1;
            });
        });
        return Object.entries(vsCounts).map(([name, value]) => ({ name, value }));
    }, [members, valueStreamMap]);
    
    return(
        <div className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon={<UsersIcon />} title="Total Members" value={String(members.length)} />
                <StatCard icon={<UsersIcon />} title="Total Salary Cost" value={formatCurrency(metrics.totalSalary)} />
                <StatCard icon={<UsersIcon />} title="Average Salary" value={formatCurrency(metrics.avgSalary)} />
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">Solution Allocation (Headcount)</h3>
                    <div className="flex items-center">
                        <div style={{ width: '50%', height: 200 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie data={vsAllocationData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                                        {vsAllocationData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip formatter={(value) => `${value} employee(s)`} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-1/2 pl-4 space-y-2 text-sm">
                            {vsAllocationData.map((item, index) => (
                                <div key={item.name} className="flex items-center gap-2">
                                    <MiniCell fill={COLORS[index % COLORS.length]} />
                                    <span className="font-semibold text-slate-700 dark:text-slate-200">{item.name}:</span>
                                    <span className="text-slate-500 dark:text-slate-400">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
                <Card>
                     <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">Competence Members ({members.length})</h3>
                    <div className="max-h-64 overflow-y-auto pr-2">
                         {members.map(m => (
                             <div key={m.id} className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700">
                                 <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                                            {m.name}
                                            {m.isManager && <span title="Manager" className="text-amber-500 inline-block align-middle ml-1"><UserStarIcon /></span>}
                                        </p>
                                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${m.employeeType === 'internal' ? 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200' : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'}`}>
                                            {m.employeeType}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{m.role}</p>
                                 </div>
                                 <div className="flex flex-wrap gap-1 justify-end max-w-[50%]">
                                      {m.valueStreamIds.map(vsId => (
                                         <span key={vsId} className="px-2 py-1 text-xs font-semibold text-indigo-800 bg-indigo-100 dark:text-indigo-100 dark:bg-indigo-900 rounded-full">
                                             {valueStreamMap.get(vsId) || 'Unknown'}
                                         </span>
                                     ))}
                                 </div>
                            </div>
                        ))}
                    </div>
                </Card>
             </div>
        </div>
    );
};


export default Dashboard;
