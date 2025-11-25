import React, { useMemo, useState } from 'react';
import { AppData, ValueStream, Service, SolutionType } from '../types';
import Card from './common/Card';
import SitemapIcon from './icons/SitemapIcon';

interface SolutionTaxonomyViewProps {
    data: AppData;
}

type TaxonomyNode = {
    [key in SolutionType]?: {
        [category: string]: ValueStream[];
    };
};

const typeColors: { [key in SolutionType]: string } = {
    'Business': 'bg-sky-100 dark:bg-sky-900/50 border-sky-300 dark:border-sky-700 text-sky-800 dark:text-sky-200',
    'Workplace': 'bg-lime-100 dark:bg-lime-900/50 border-lime-300 dark:border-lime-700 text-lime-800 dark:text-lime-200',
    'Infrastructure': 'bg-amber-100 dark:bg-amber-900/50 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200',
    'Delivery': 'bg-rose-100 dark:bg-rose-900/50 border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-200',
    'Shared & Corporate': 'bg-slate-100 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200',
    'Artificial Intelligence': 'bg-violet-100 dark:bg-violet-900/50 border-violet-300 dark:border-violet-700 text-violet-800 dark:text-violet-200',
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
    const { valueStreams, services } = data;
    const [hoveredItem, setHoveredItem] = useState<{ item: ValueStream | Service; position: { top: number; left: number } } | null>(null);

    const serviceMap = useMemo(() => new Map(services.map(s => [s.id, s])), [services]);

    const taxonomy = useMemo(() => {
        const result: TaxonomyNode = {};
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
    }, [valueStreams]);

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
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Solution Hierarchy</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            This diagram shows the full TBM solution hierarchy, from the high-level Solution Type down to the specific Services (Offerings) provided. Hover over any item to see its description.
                        </p>
                    </div>
                </div>
            </Card>

            <div className="space-y-8">
                {Object.entries(taxonomy).map(([type, categories]) => (
                    <div key={type} className={`p-4 border-l-4 ${typeColors[type as SolutionType]}`}>
                        <h3 className="text-2xl font-bold">{type}</h3>
                        <div className="mt-4 space-y-4">
                            {Object.entries(categories).map(([category, solutions]) => (
                                <div key={category} className="pl-4">
                                    <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-300">{category}</h4>
                                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {solutions.map(solution => (
                                            <div
                                                key={solution.id}
                                                className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-200"
                                                onMouseEnter={(e) => handleMouseEnter(solution, e)}
                                                onMouseLeave={handleMouseLeave}
                                            >
                                                <p className="font-bold text-indigo-700 dark:text-indigo-400">{solution.name}</p>
                                                <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
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
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            {hoveredItem && <Tooltip item={hoveredItem.item} position={hoveredItem.position} />}
        </div>
    );
};

export default SolutionTaxonomyView;
