
import React, { useState, useMemo } from 'react';
import { SolutionCategory, ValueStream } from '../types';
import Modal from './common/Modal';
import Card from './common/Card';
import PlusIcon from './icons/PlusIcon';
import EditIcon from './icons/EditIcon';
import DeleteIcon from './icons/DeleteIcon';
import SolutionCategoryForm from './SolutionCategoryForm';
import SearchIcon from './icons/SearchIcon';

interface SolutionCategoryManagementProps {
    categories: SolutionCategory[];
    valueStreams: ValueStream[];
    onAddCategory: (category: SolutionCategory) => void;
    onUpdateCategory: (category: SolutionCategory) => void;
    onDeleteCategory: (categoryId: string) => void;
}

const SolutionCategoryManagement: React.FC<SolutionCategoryManagementProps> = ({ categories, valueStreams, onAddCategory, onUpdateCategory, onDeleteCategory }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<SolutionCategory | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

    const categoryUsageMap = useMemo(() => {
        const usage = new Map<string, number>();
        valueStreams.forEach(vs => {
            // valueStream.solutionCategory holds the name string
            // We need to count occurrences by name since VS stores name, not ID
            const count = usage.get(vs.solutionCategory) || 0;
            usage.set(vs.solutionCategory, count + 1);
        });
        return usage;
    }, [valueStreams]);

    const handleAddNew = () => {
        setEditingCategory(null);
        setIsModalOpen(true);
    };

    const handleEdit = (category: SolutionCategory) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const handleDelete = (category: SolutionCategory) => {
        const usageCount = categoryUsageMap.get(category.name) || 0;
        if (usageCount > 0) {
            alert(`This category cannot be deleted because it is used by ${usageCount} solutions.`);
            return;
        }
        if (window.confirm('Are you sure you want to delete this category?')) {
            onDeleteCategory(category.id);
        }
    };

    const handleSave = (category: SolutionCategory) => {
        if (editingCategory) {
            onUpdateCategory(category);
        } else {
            onAddCategory(category);
        }
        setIsModalOpen(false);
        setEditingCategory(null);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
    };

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const processedCategories = useMemo(() => {
        let result = [...categories];

        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(c => 
                c.name.toLowerCase().includes(lowerTerm) ||
                (c.type && c.type.toLowerCase().includes(lowerTerm)) ||
                (c.description && c.description.toLowerCase().includes(lowerTerm))
            );
        }

        if (sortConfig) {
            result.sort((a, b) => {
                let aVal: string | number = '';
                let bVal: string | number = '';

                if (sortConfig.key === 'name') {
                    aVal = a.name.toLowerCase();
                    bVal = b.name.toLowerCase();
                } else if (sortConfig.key === 'type') {
                    aVal = (a.type || '').toLowerCase();
                    bVal = (b.type || '').toLowerCase();
                } else if (sortConfig.key === 'usage') {
                    aVal = categoryUsageMap.get(a.name) || 0;
                    bVal = categoryUsageMap.get(b.name) || 0;
                }

                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return result;
    }, [categories, searchTerm, sortConfig, categoryUsageMap]);

    const SortIcon = ({ active, direction }: { active: boolean; direction: 'asc' | 'desc' }) => (
        <span className={`ml-1 inline-block transition-opacity ${active ? 'opacity-100' : 'opacity-20 hover:opacity-50'}`}>
            {active && direction === 'desc' ? '↓' : '↑'}
        </span>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Solution Categories</h2>
                <button onClick={handleAddNew} className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors">
                    <PlusIcon className="w-5 h-5" />
                    <span>Add Category</span>
                </button>
            </div>

            <Card className="space-y-4">
                 <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="w-5 h-5 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search categories by name or type..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 sm:text-sm py-2"
                    />
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
                                        Name
                                        <SortIcon active={sortConfig?.key === 'name'} direction={sortConfig?.direction || 'asc'} />
                                    </div>
                                </th>
                                 <th 
                                    scope="col" 
                                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider cursor-pointer select-none hover:bg-slate-100 dark:hover:bg-slate-700"
                                    onClick={() => handleSort('type')}
                                >
                                    <div className="flex items-center">
                                        Parent Type
                                        <SortIcon active={sortConfig?.key === 'type'} direction={sortConfig?.direction || 'asc'} />
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Description</th>
                                <th 
                                    scope="col" 
                                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider cursor-pointer select-none hover:bg-slate-100 dark:hover:bg-slate-700"
                                    onClick={() => handleSort('usage')}
                                >
                                    <div className="flex items-center">
                                        Solutions Count
                                        <SortIcon active={sortConfig?.key === 'usage'} direction={sortConfig?.direction || 'asc'} />
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                            {processedCategories.map(cat => (
                                <tr key={cat.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">{cat.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                        <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 py-0.5 px-2.5 rounded-full text-xs font-semibold">{cat.type || 'Unknown'}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 max-w-md truncate">{cat.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{categoryUsageMap.get(cat.name) || 0}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-3">
                                            <button onClick={() => handleEdit(cat)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200">
                                                <EditIcon />
                                            </button>
                                            <button onClick={() => handleDelete(cat)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 disabled:opacity-50 disabled:cursor-not-allowed" disabled={(categoryUsageMap.get(cat.name) || 0) > 0}>
                                                <DeleteIcon />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal isOpen={isModalOpen} onClose={handleCancel} title={editingCategory ? 'Edit Category' : 'Add New Category'}>
                <SolutionCategoryForm category={editingCategory} onSave={handleSave} onCancel={handleCancel} />
            </Modal>
        </div>
    );
};

export default SolutionCategoryManagement;
