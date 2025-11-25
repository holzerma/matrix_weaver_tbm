
import React, { useState, useMemo } from 'react';
import { Service, ValueStream } from '../types';
import Modal from './common/Modal';
import Card from './common/Card';
import PlusIcon from './icons/PlusIcon';
import EditIcon from './icons/EditIcon';
import DeleteIcon from './icons/DeleteIcon';
import ServiceForm from './ServiceForm';

interface ServiceManagementProps {
    services: Service[];
    valueStreams: ValueStream[];
    onAddService: (service: Service) => void;
    onUpdateService: (service: Service) => void;
    onDeleteService: (serviceId: string) => void;
}

const ServiceManagement: React.FC<ServiceManagementProps> = ({ services, valueStreams, onAddService, onUpdateService, onDeleteService }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);

    const serviceUsageMap = useMemo(() => {
        const usage = new Map<string, number>();
        valueStreams.forEach(vs => {
            vs.serviceIds?.forEach(serviceId => {
                usage.set(serviceId, (usage.get(serviceId) || 0) + 1);
            });
        });
        return usage;
    }, [valueStreams]);

    const handleAddNew = () => {
        setEditingService(null);
        setIsModalOpen(true);
    };

    const handleEdit = (service: Service) => {
        setEditingService(service);
        setIsModalOpen(true);
    };

    const handleDelete = (serviceId: string) => {
        if (serviceUsageMap.has(serviceId)) {
            alert('This service cannot be deleted because it is provided by one or more solutions.');
            return;
        }
        if (window.confirm('Are you sure you want to delete this service?')) {
            onDeleteService(serviceId);
        }
    };

    const handleSave = (service: Service) => {
        if (editingService) {
            onUpdateService(service);
        } else {
            onAddService(service);
        }
        setIsModalOpen(false);
        setEditingService(null);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingService(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Service Management</h2>
                <button onClick={handleAddNew} className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors">
                    <PlusIcon className="w-5 h-5" />
                    <span>Add Service</span>
                </button>
            </div>

            <Card className="!p-0">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-800">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Description</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Solutions</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                            {services.map(s => (
                                <tr key={s.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">{s.name}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 max-w-md truncate">{s.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{serviceUsageMap.get(s.id) || 0}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-3">
                                            <button onClick={() => handleEdit(s)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200">
                                                <EditIcon />
                                            </button>
                                            <button onClick={() => handleDelete(s.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 disabled:opacity-50 disabled:cursor-not-allowed" disabled={serviceUsageMap.has(s.id)}>
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

            <Modal isOpen={isModalOpen} onClose={handleCancel} title={editingService ? 'Edit Service' : 'Add New Service'}>
                <ServiceForm service={editingService} onSave={handleSave} onCancel={handleCancel} />
            </Modal>
        </div>
    );
};

export default ServiceManagement;