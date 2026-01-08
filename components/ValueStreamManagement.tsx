
import React, { useState, useMemo } from 'react';
import { Employee, ValueStream, ResourceTower, CostPool, Service, SolutionCategory, SolutionTypeDefinition } from '../types';
import Modal from './common/Modal';
import Card from './common/Card';
import PlusIcon from './icons/PlusIcon';
import EditIcon from './icons/EditIcon';
import DeleteIcon from './icons/DeleteIcon';
import ValueStreamForm from './ValueStreamForm';
import SearchIcon from './icons/SearchIcon';

interface ValueStreamManagementProps {
    employees: Employee[];
    valueStreams: ValueStream[];
    resourceTowers: ResourceTower[];
    costPools: CostPool[];
    services: Service[];
    solutionCategories?: SolutionCategory[]; 
    solutionTypes?: SolutionTypeDefinition[];
    onAddValueStream: (vs: ValueStream) => void;
    onUpdateValueStream: (vs: ValueStream) => void;
    onDeleteValueStream: (vsId: string) => void;
}

const ValueStreamManagement: React.FC<ValueStreamManagementProps> = ({ employees, valueStreams, resourceTowers, costPools, services, solutionCategories = [], solutionTypes = [], onAddValueStream, onUpdateValueStream, onDeleteValueStream }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVs, setEditingVs] = useState<ValueStream | null>(null);

    // Filtering & Sorting State
    const [searchTerm, setSearchTerm] = useState('');
    const [filterClassification, setFilterClassification] = useState('all');
    const [filterType, setFilterType] = useState('all');
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

    const vsUsageMap = useMemo(() => {
        const usage = new Map<string, number>();
        employees.forEach(emp => {
            emp.valueStreamIds.forEach(vsId => {
                usage.set(vsId, (usage.get(vsId) || 0) + 1);
            });
        });
        return usage;
    }, [employees]);

    const serviceMap = useMemo(() => new Map(services.map(s => [s.id, s.name])), [services]);

    const handleAddNew = () => {
        setEditingVs(null);
        setIsModalOpen(true);
    };

    const handleEdit = (vs: ValueStream) => {
        setEditingVs(vs);
        setIsModalOpen(true);
    };

    const handleDelete = (vsId: string) => {
        if (vsUsageMap.has(vsId)) {
            alert('This solution cannot be deleted because it is assigned to one or more employees.');
            return;
        }
        if (window.confirm('Are you sure you want to delete this solution?')) {
            onDeleteValueStream(vsId);
        }
    }

    const handleSave = (vs: ValueStream) => {
        if (editingVs) {
            onUpdateValueStream(vs);
        } else {
            onAddValueStream(vs);
        }
        setIsModalOpen(false);
        setEditingVs(null);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingVs(null);
    };

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const processedValueStreams = useMemo(() => {
        let result = [...valueStreams];

        if (searchTerm) {
             const lowerTerm = searchTerm.toLowerCase();
             result = result.filter(vs => 
                vs.name.toLowerCase().includes(lowerTerm) ||
                vs.description.toLowerCase().includes(lowerTerm) ||
                (vs.solutionCategory && vs.solutionCategory.toLowerCase().includes(lowerTerm))
             );
        }

        if (filterClassification !== 'all') {
            result = result.filter(vs => vs.solutionClassification === filterClassification);
        }

        if (filterType !== 'all') {
             result = result.filter(vs => vs.solutionType === filterType);
        }

        if (sortConfig) {
             result.sort((a, b) => {
                let aVal: string | number = '';
                let bVal: string | number = '';

                if (sortConfig.key === 'name') {
                    aVal = a.name.toLowerCase();
                    bVal = b.name.toLowerCase();
                } else if (sortConfig.key === 'classification') {
                    aVal = (a.solutionClassification || '').toLowerCase();
                    bVal = (b.solutionClassification || '').toLowerCase();
                } else if (sortConfig.key === 'category') {
                    aVal = (a.solutionCategory || '').toLowerCase();
                    bVal = (b.solutionCategory || '').toLowerCase();
                } else if (sortConfig.key === 'employees') {
                    aVal = vsUsageMap.get(a.id) || 0;
                    bVal = vsUsageMap.get(b.id) || 0;
                }

                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [valueStreams, searchTerm, filterClassification, filterType, sortConfig, vsUsageMap]);

    const SortIcon = ({ active, direction }: { active: boolean; direction: 'asc' | 'desc' }) => (
        <span className={`ml-1 inline-block transition-opacity ${active ? 'opacity-100' : 'opacity-20 hover:opacity-50'}`}>
            {active && direction === 'desc' ? '↓' : '↑'}
        </span>
    );

    const classBadges: { [key: string]: string } = {
        Product: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        Service: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Solution Management</h2>
                <button onClick={handleAddNew} className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors">
                    <PlusIcon className="w-5 h-5" />
                    <span>Add Solution</span>
                </button>
            </div>

            <Card className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-grow">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon className="w-5 h-5 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by name, description or category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 sm:text-sm py-2"
                        />
                    </div>
                    <div className="relative min-w-[200px]">
                        <select
                            value={filterClassification}
                            onChange={(e) => setFilterClassification(e.target.value)}
                            className="block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 sm:text-sm py-2 pl-3 pr-10"
                        >
                            <option value="all">All Classifications</option>
                            <option value="Product">Product</option>
                            <option value="Service">Service</option>
                        </select>
                    </div>
                    <div className="relative min-w-[200px]">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 sm:text-sm py-2 pl-3 pr-10"
                        >
                            <option value="all">All Types</option>
                            {solutionTypes.map(type => (
                                <option key={type.id} value={type.name}>{type.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </Card>

            <Card className="!p-0">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-800">
                            <tr>
                                <th 
                                    scope="col" 
                                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider cursor-pointer select-none hover:bg-slate-100 dark:hover:bg-slate-700"
                                    onClick={() => handleSort('name')}
                                >
                                    <div className="flex items-center">
                                        Solution Name
                                        <SortIcon active={sortConfig?.key === 'name'} direction={sortConfig?.direction || 'asc'} />
                                    </div>
                                </th>
                                <th 
                                    scope="col" 
                                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider cursor-pointer select-none hover:bg-slate-100 dark:hover:bg-slate-700"
                                    onClick={() => handleSort('classification')}
                                >
                                    <div className="flex items-center">
                                        Classification
                                        <SortIcon active={sortConfig?.key === 'classification'} direction={sortConfig?.direction || 'asc'} />
                                    </div>
                                </th>
                                <th 
                                    scope="col" 
                                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider cursor-pointer select-none hover:bg-slate-100 dark:hover:bg-slate-700"
                                    onClick={() => handleSort('category')}
                                >
                                    <div className="flex items-center">
                                        Category
                                        <SortIcon active={sortConfig?.key === 'category'} direction={sortConfig?.direction || 'asc'} />
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Provided Services</th>
                                <th 
                                    scope="col" 
                                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider cursor-pointer select-none hover:bg-slate-100 dark:hover:bg-slate-700"
                                    onClick={() => handleSort('employees')}
                                >
                                    <div className="flex items-center">
                                        Employees
                                        <SortIcon active={sortConfig?.key === 'employees'} direction={sortConfig?.direction || 'asc'} />
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                            {processedValueStreams.length > 0 ? (
                                processedValueStreams.map(vs => (
                                <tr key={vs.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{vs.name}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs truncate">{vs.description}</p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {vs.solutionClassification && (
                                            <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full capitalize ${classBadges[vs.solutionClassification]}`}>
                                                {vs.solutionClassification}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{vs.solutionCategory || 'N/A'}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 max-w-xs">
                                        <div className="flex flex-wrap gap-1">
                                            {vs.serviceIds?.map(serviceId => (
                                                <span key={serviceId} className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 dark:text-gray-100 dark:bg-gray-700 rounded-full">
                                                    {serviceMap.get(serviceId) || 'Unknown'}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 text-center">{vsUsageMap.get(vs.id) || 0}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-3">
                                            <button onClick={() => handleEdit(vs)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200">
                                                <EditIcon />
                                            </button>
                                            <button onClick={() => handleDelete(vs.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 disabled:opacity-50 disabled:cursor-not-allowed" disabled={vsUsageMap.has(vs.id)}>
                                                <DeleteIcon />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                                        No solutions found matching your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal isOpen={isModalOpen} onClose={handleCancel} title={editingVs ? 'Edit Solution' : 'Add New Solution'}>
                <ValueStreamForm valueStream={editingVs} resourceTowers={resourceTowers} costPools={costPools} services={services} solutionCategories={solutionCategories} solutionTypes={solutionTypes} onSave={handleSave} onCancel={handleCancel} />
            </Modal>
        </div>
    );
};

export default ValueStreamManagement;
