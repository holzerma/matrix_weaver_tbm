
import React, { useState, useMemo } from 'react';
import { Employee, Competence, ValueStream, Skill } from '../types';
import Modal from './common/Modal';
import Card from './common/Card';
import PlusIcon from './icons/PlusIcon';
import EditIcon from './icons/EditIcon';
import DeleteIcon from './icons/DeleteIcon';
import EmployeeForm from './EmployeeForm';
import UserStarIcon from './icons/UserStarIcon';

interface EmployeeManagementProps {
    employees: Employee[];
    competences: Competence[];
    valueStreams: ValueStream[];
    skills: Skill[];
    onAddEmployee: (employee: Employee) => void;
    onUpdateEmployee: (employee: Employee) => void;
    onDeleteEmployee: (employeeId: string) => void;
}

const proficiencyColors: { [key: number]: string } = {
    1: 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300',
    2: 'bg-sky-200 text-sky-800 dark:bg-sky-800 dark:text-sky-200',
    3: 'bg-sky-300 text-sky-900 dark:bg-sky-700 dark:text-sky-100',
    4: 'bg-sky-500 text-white dark:bg-sky-600 dark:text-white',
    5: 'bg-sky-700 text-white dark:bg-sky-500 dark:text-white',
};

const EmployeeManagement: React.FC<EmployeeManagementProps> = ({ employees, competences, valueStreams, skills, onAddEmployee, onUpdateEmployee, onDeleteEmployee }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

    const competenceMap = useMemo(() => new Map(competences.map(ch => [ch.id, ch.name])), [competences]);
    const valueStreamMap = useMemo(() => new Map(valueStreams.map(vs => [vs.id, vs.name])), [valueStreams]);
    const skillMap = useMemo(() => new Map(skills.map(s => [s.id, s.name])), [skills]);

    const handleAddNew = () => {
        setEditingEmployee(null);
        setIsModalOpen(true);
    };

    const handleEdit = (employee: Employee) => {
        setEditingEmployee(employee);
        setIsModalOpen(true);
    };

    const handleDelete = (employeeId: string) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            onDeleteEmployee(employeeId);
        }
    };

    const handleSave = (employee: Employee) => {
        if (editingEmployee) {
            onUpdateEmployee(employee);
        } else {
            onAddEmployee(employee);
        }
        setIsModalOpen(false);
        setEditingEmployee(null);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingEmployee(null);
    };

    const typeBadges: { [key: string]: string } = {
        internal: 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200',
        external: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Employee Management</h2>
                <button onClick={handleAddNew} className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors">
                    <PlusIcon className="w-5 h-5" />
                    <span>Add Employee</span>
                </button>
            </div>

            <Card className="!p-0">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-800">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Role & Competence</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Skills</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Value Streams</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                            {employees.map(emp => (
                                <tr key={emp.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100 align-top">
                                        <div className="flex items-start gap-2">
                                            <div>
                                                <p>{emp.name}</p>
                                                <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full capitalize ${typeBadges[emp.employeeType]}`}>
                                                    {emp.employeeType}
                                                </span>
                                            </div>
                                            {emp.isManager && <span title="Manager" className="text-amber-500 flex-shrink-0"><UserStarIcon /></span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 align-top">
                                        <p className="font-medium text-slate-800 dark:text-slate-200">{emp.role}</p>
                                        <p>{competenceMap.get(emp.competenceId) || 'N/A'}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 align-top max-w-sm">
                                        <div className="flex flex-wrap gap-1">
                                            {emp.skills?.map(skill => (
                                                <span key={skill.skillId} className={`px-2 py-1 text-xs font-bold rounded-full ${proficiencyColors[skill.proficiency] || 'bg-slate-200'}`}>
                                                    {skillMap.get(skill.skillId)} ({skill.proficiency})
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 align-top max-w-sm">
                                        <div className="flex flex-wrap gap-1">
                                            {emp.valueStreamIds.map(vsId => (
                                                <span key={vsId} className="px-2 py-1 text-xs font-semibold text-indigo-800 bg-indigo-100 dark:text-indigo-100 dark:bg-indigo-900 rounded-full">
                                                    {valueStreamMap.get(vsId) || 'Unknown'}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium align-top">
                                        <div className="flex items-center justify-end space-x-3">
                                            <button onClick={() => handleEdit(emp)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200"><EditIcon /></button>
                                            <button onClick={() => handleDelete(emp.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"><DeleteIcon /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal isOpen={isModalOpen} onClose={handleCancel} title={editingEmployee ? 'Edit Employee' : 'Add New Employee'}>
                <EmployeeForm
                    employee={editingEmployee}
                    competences={competences}
                    valueStreams={valueStreams}
                    skills={skills}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            </Modal>
        </div>
    );
};

export default EmployeeManagement;
