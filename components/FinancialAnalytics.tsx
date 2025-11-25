
import React, { useState, useMemo } from 'react';
import { AppData, ValueStream, Employee, Competence, CostPool, ResourceTower } from '../types';
import Card from './common/Card';
import SankeyChart from './SankeyChart';
import AnalyticsIcon from './icons/AnalyticsIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface FinancialAnalyticsProps {
    data: AppData;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
};

const COLORS = ['#4338ca', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#8b5cf6'];

type ViewLens = 'financial' | 'tbm' | 'org';

const FinancialAnalytics: React.FC<FinancialAnalyticsProps> = ({ data }) => {
    const { employees, valueStreams, competences, costPools, resourceTowers } = data;
    const [selectedVsId, setSelectedVsId] = useState<string | null>(null);
    const [activeView, setActiveView] = useState<ViewLens>('financial');

    const selectedVs = useMemo(() => {
        return valueStreams.find(vs => vs.id === selectedVsId) || null;
    }, [selectedVsId, valueStreams]);

    const solutionMembers = useMemo(() => {
        if (!selectedVs) return [];
        return employees.filter(e => e.valueStreamIds.includes(selectedVs.id));
    }, [selectedVs, employees]);

    const solutionSalaryCost = useMemo(() => {
        return solutionMembers.reduce((sum, m) => sum + (m.salary / (m.valueStreamIds.length || 1)), 0);
    }, [solutionMembers]);

    const addNode = (name: string, map: Map<string, number>, nodes: { name: string }[]) => {
        if (!map.has(name)) {
            map.set(name, nodes.length);
            nodes.push({ name });
        }
        return map.get(name)!;
    };
    
    // Data for Financial View
    const financialSankeyData = useMemo(() => {
        if (!selectedVs) return { nodes: [], links: [] };
        
        const nodes: { name: string }[] = [];
        const nodeMap = new Map<string, number>();
        const links: { source: number; target: number; value: number }[] = [];

        const solutionNode = addNode(selectedVs.name, nodeMap, nodes);

        if (solutionSalaryCost > 0) {
            const salaryNode = addNode('Employee Salaries', nodeMap, nodes);
            links.push({ source: salaryNode, target: solutionNode, value: solutionSalaryCost });
        }

        selectedVs.costPoolConsumption.forEach(cpc => {
            const pool = costPools.find(p => p.id === cpc.costPoolId);
            if (pool && cpc.annualCost > 0) {
                const poolNode = addNode(pool.name, nodeMap, nodes);
                links.push({ source: poolNode, target: solutionNode, value: cpc.annualCost });
            }
        });

        return { nodes, links };
    }, [selectedVs, solutionSalaryCost, costPools]);
    
    // Data for TBM Structure View
    const tbmSankeyData = useMemo(() => {
        if (!selectedVs) return { nodes: [], links: [] };

        const nodes: { name: string }[] = [];
        const nodeMap = new Map<string, number>();
        const links: { source: number; target: number; value: number }[] = [];

        const solutionNode = addNode(selectedVs.name, nodeMap, nodes);

        selectedVs.costPoolConsumption.forEach(cpc => {
            const pool = costPools.find(p => p.id === cpc.costPoolId);
            const tower = resourceTowers.find(t => t.id === pool?.defaultResourceTowerId);

            if (pool && tower && cpc.annualCost > 0) {
                const poolNode = addNode(pool.name, nodeMap, nodes);
                const towerNode = addNode(tower.name, nodeMap, nodes);
                
                links.push({ source: poolNode, target: towerNode, value: cpc.annualCost });
                links.push({ source: towerNode, target: solutionNode, value: cpc.annualCost });
            }
        });

        return { nodes, links };

    }, [selectedVs, costPools, resourceTowers]);

    // Data for Organizational View
    const orgSankeyData = useMemo(() => {
        if (!selectedVs || solutionMembers.length === 0) return { nodes: [], links: [] };

        const nodes: { name: string }[] = [];
        const nodeMap = new Map<string, number>();
        const links: { source: number; target: number; value: number }[] = [];

        const solutionNode = addNode(selectedVs.name, nodeMap, nodes);
        const internalNode = addNode('Internal', nodeMap, nodes);
        const externalNode = addNode('External', nodeMap, nodes);

        const competenceCosts = new Map<string, { internal: number, external: number }>();
        solutionMembers.forEach(member => {
            const cost = member.salary / (member.valueStreamIds.length || 1);
            if (!competenceCosts.has(member.competenceId)) {
                competenceCosts.set(member.competenceId, { internal: 0, external: 0 });
            }
            const costs = competenceCosts.get(member.competenceId)!;
            if (member.employeeType === 'internal') {
                costs.internal += cost;
            } else {
                costs.external += cost;
            }
        });

        competenceCosts.forEach((costs, competenceId) => {
            const competence = competences.find(c => c.id === competenceId);
            if (competence) {
                const competenceNode = addNode(competence.name, nodeMap, nodes);
                if (costs.internal > 0) {
                    links.push({ source: competenceNode, target: internalNode, value: costs.internal });
                }
                if (costs.external > 0) {
                    links.push({ source: competenceNode, target: externalNode, value: costs.external });
                }
            }
        });
        
        const totalInternal = Array.from(competenceCosts.values()).reduce((sum, c) => sum + c.internal, 0);
        const totalExternal = Array.from(competenceCosts.values()).reduce((sum, c) => sum + c.external, 0);

        if (totalInternal > 0) links.push({ source: internalNode, target: solutionNode, value: totalInternal });
        if (totalExternal > 0) links.push({ source: externalNode, target: solutionNode, value: totalExternal });

        return { nodes, links };
    }, [selectedVs, solutionMembers, competences]);
    
    const orgBarChartData = useMemo(() => {
        if (!selectedVs) return [];
        const competenceCosts = new Map<string, { name: string, internal: number, external: number }>();
        solutionMembers.forEach(member => {
            const cost = member.salary / (member.valueStreamIds.length || 1);
            const competence = competences.find(c => c.id === member.competenceId);
            if (competence) {
                if (!competenceCosts.has(competence.id)) {
                    competenceCosts.set(competence.id, { name: competence.name, internal: 0, external: 0 });
                }
                const costs = competenceCosts.get(competence.id)!;
                if (member.employeeType === 'internal') {
                    costs.internal += cost;
                } else {
                    costs.external += cost;
                }
            }
        });
        return Array.from(competenceCosts.values());
    }, [selectedVs, solutionMembers, competences]);


    const renderContent = () => {
        if (!selectedVs) {
            return (
                <Card>
                    <div className="text-center py-12">
                        <AnalyticsIcon className="mx-auto w-12 h-12 text-slate-400" />
                        <h3 className="mt-2 text-lg font-medium text-slate-800 dark:text-slate-100">Select a Solution</h3>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Please select a solution from the dropdown above to begin analysis.</p>
                    </div>
                </Card>
            );
        }

        let sankeyToRender;
        let chartTitle = '';
        switch(activeView) {
            case 'financial':
                sankeyToRender = financialSankeyData;
                chartTitle = 'Financial View: Source Costs to Solution';
                break;
            case 'tbm':
                sankeyToRender = tbmSankeyData;
                chartTitle = 'TBM Structure View: Pools to Towers to Solution';
                break;
            case 'org':
                sankeyToRender = orgSankeyData;
                chartTitle = 'Organizational View: Competences to Solution';
                break;
        }

        return (
            <div className="space-y-6">
                <Card>
                    <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">{chartTitle}</h3>
                    {sankeyToRender.links.length > 0 ? (
                        <SankeyChart data={sankeyToRender} height={Math.max(400, sankeyToRender.nodes.length * 30)} />
                    ) : (
                        <p className="text-center text-slate-500 dark:text-slate-400 py-10">No relevant cost data to display for this view.</p>
                    )}
                </Card>
                {activeView === 'org' && orgBarChartData.length > 0 && (
                    <Card>
                        <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">Competence Contribution Breakdown</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={orgBarChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.2)" />
                                <XAxis dataKey="name" />
                                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                                <Tooltip formatter={(value: number) => formatCurrency(value)} cursor={{ fill: 'rgba(199, 210, 254, 0.5)' }} />
                                <Legend />
                                <Bar dataKey="internal" stackId="a" fill={COLORS[0]} name="Internal" />
                                <Bar dataKey="external" stackId="a" fill={COLORS[1]} name="External" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                )}
            </div>
        )
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Financial Analytics</h2>
                <div className="flex items-center space-x-4">
                    <select
                        value={selectedVsId || ''}
                        onChange={(e) => setSelectedVsId(e.target.value || null)}
                        className="w-64 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">Select a Solution...</option>
                        {valueStreams.map(vs => <option key={vs.id} value={vs.id}>{vs.name}</option>)}
                    </select>
                </div>
            </div>
            
            {selectedVsId && (
                <div className="border-b border-slate-200 dark:border-slate-700">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        {(['financial', 'tbm', 'org'] as ViewLens[]).map((view) => (
                            <button
                                key={view}
                                onClick={() => setActiveView(view)}
                                className={`${
                                    activeView === view
                                        ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:border-slate-600'
                                } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm capitalize`}
                            >
                                {view === 'tbm' ? 'TBM Structure' : view}
                            </button>
                        ))}
                    </nav>
                </div>
            )}
            
            {renderContent()}
        </div>
    );
};

export default FinancialAnalytics;
