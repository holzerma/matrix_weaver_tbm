
import React, { useState, useEffect, useRef } from 'react';
import { AppData, Employee, ValueStream, Competence, CostPool, ResourceTower, Skill, Service } from '../types';
import ChartBarIcon from './icons/ChartBarIcon';
import UsersIcon from './icons/UsersIcon';
import StreamIcon from './icons/StreamIcon';
import BookOpenIcon from './icons/BookOpenIcon';
import TowerIcon from './icons/TowerIcon';
import OrgChartIcon from './icons/OrgChartIcon';
import SearchIcon from './icons/SearchIcon';
import ResourceTowerIcon from './icons/ResourceTowerIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';
import AnalyticsIcon from './icons/AnalyticsIcon';
import InformationCircleIcon from './icons/InformationCircleIcon';
import Modal from './common/Modal';
import { APP_VERSION } from '../constants';
import SkillsIcon from './icons/SkillsIcon';
import MapIcon from './icons/MapIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';
import SitemapIcon from './icons/SitemapIcon';
import QuestionMarkCircleIcon from './icons/QuestionMarkCircleIcon';
import UserGroupIcon from './icons/UserGroupIcon';

type View = 'dashboard' | 'employees' | 'valueStreams' | 'competences' | 'costPools' | 'resourceTowers' | 'orgView' | 'financialAnalytics' | 'skills' | 'competencyMap' | 'services' | 'solutionTaxonomy' | 'solutionCategories' | 'solutionTypes' | 'functionalTeams';

interface HeaderProps {
    currentView: View;
    setView: (view: View) => void;
    appData: AppData;
    onSearchSelect: (view: View) => void;
}

type NavItemChild = { id: View; label: string; icon: React.ReactElement<{ className?: string }> };
type NavItem = {
    id: View | string;
    label: string;
    icon: React.ReactElement<{ className?: string }>;
    children?: NavItemChild[];
};

const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <ChartBarIcon /> },
    { 
        id: 'analytics', label: 'Analytics', icon: <AnalyticsIcon />, children: [
            { id: 'financialAnalytics', label: 'Financial Analytics', icon: <AnalyticsIcon /> },
            { id: 'solutionTaxonomy', label: 'Solution Taxonomy', icon: <SitemapIcon /> },
        ] 
    },
    { id: 'orgView', label: 'Org View', icon: <OrgChartIcon /> },
    {
        id: 'offerings', label: 'Offerings', icon: <StreamIcon />, children: [
            { id: 'valueStreams', label: 'Solutions', icon: <StreamIcon /> },
            { id: 'services', label: 'Services', icon: <BriefcaseIcon /> },
        ]
    },
    {
        id: 'people', label: 'People', icon: <UsersIcon />, children: [
            { id: 'employees', label: 'Employees', icon: <UsersIcon /> },
            { id: 'functionalTeams', label: 'Functional Teams', icon: <UserGroupIcon /> },
            { id: 'competences', label: 'Competence Teams / Line', icon: <BookOpenIcon /> },
            { id: 'skills', label: 'Skills', icon: <SkillsIcon /> },
            { id: 'competencyMap', label: 'Competency Map', icon: <MapIcon /> },
        ]
    },
    {
        id: 'tbm', label: 'TBM', icon: <TowerIcon />, children: [
            { id: 'resourceTowers', label: 'Resource Towers', icon: <ResourceTowerIcon /> },
            { id: 'costPools', label: 'Cost Pools', icon: <TowerIcon /> },
            { id: 'solutionTypes', label: 'Solution Types', icon: <SitemapIcon /> },
            { id: 'solutionCategories', label: 'Solution Categories', icon: <SitemapIcon /> },
        ]
    },
];

type SearchResult = {
    employees: Employee[];
    valueStreams: ValueStream[];
    competences: Competence[];
    costPools: CostPool[];
    resourceTowers: ResourceTower[];
    skills: Skill[];
    services: Service[];
}

const Header: React.FC<HeaderProps> = ({ currentView, setView, appData, onSearchSelect }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
    const [isUserGuideModalOpen, setIsUserGuideModalOpen] = useState(false);

    const searchRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const performSearch = () => {
            if (searchQuery.length < 2) {
                setSearchResults(null);
                return;
            }
            const lowerCaseQuery = searchQuery.toLowerCase();
            const results: SearchResult = {
                employees: appData.employees.filter(e =>
                    e.name.toLowerCase().includes(lowerCaseQuery) ||
                    e.role.toLowerCase().includes(lowerCaseQuery) ||
                    e.id.toLowerCase().includes(lowerCaseQuery)
                ),
                valueStreams: appData.valueStreams.filter(vs =>
                    vs.name.toLowerCase().includes(lowerCaseQuery) ||
                    vs.description.toLowerCase().includes(lowerCaseQuery) ||
                    vs.solutionType?.toLowerCase().includes(lowerCaseQuery) ||
                    vs.solutionCategory?.toLowerCase().includes(lowerCaseQuery)
                ),
                competences: appData.competences.filter(c =>
                    c.name.toLowerCase().includes(lowerCaseQuery) ||
                    c.skill.toLowerCase().includes(lowerCaseQuery)
                ),
                costPools: appData.costPools.filter(ct =>
                    ct.name.toLowerCase().includes(lowerCaseQuery) ||
                    ct.category.toLowerCase().includes(lowerCaseQuery)
                ),
                resourceTowers: appData.resourceTowers.filter(rt =>
                    rt.name.toLowerCase().includes(lowerCaseQuery) ||
                    rt.tower.toLowerCase().includes(lowerCaseQuery) ||
                    rt.domain.toLowerCase().includes(lowerCaseQuery)
                ),
                skills: appData.skills.filter(s =>
                    s.name.toLowerCase().includes(lowerCaseQuery) ||
                    s.category.toLowerCase().includes(lowerCaseQuery)
                ),
                services: appData.services.filter(s =>
                    s.name.toLowerCase().includes(lowerCaseQuery) ||
                    s.description.toLowerCase().includes(lowerCaseQuery)
                ),
            };
            setSearchResults(results);
        };
        performSearch();
    }, [searchQuery, appData]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchFocused(false);
            }
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleResultClick = (view: View) => {
        onSearchSelect(view);
        setSearchQuery('');
        setIsSearchFocused(false);
    }
    
    const handleMenuToggle = (menuId: string) => {
        setOpenMenu(openMenu === menuId ? null : menuId);
    };

    const handleSubMenuClick = (view: View) => {
        setView(view);
        setOpenMenu(null);
    };

    // FIX: Replaced reduce with direct summation for type safety and clarity to fix an 'unknown' type error on totalResults.
    const totalResults = searchResults ?
        searchResults.employees.length +
        searchResults.valueStreams.length +
        searchResults.competences.length +
        searchResults.costPools.length +
        searchResults.resourceTowers.length +
        searchResults.skills.length +
        searchResults.services.length
        : 0;
    
    const renderNavItem = (item: NavItem) => {
        const isParentActive = item.children?.some(child => child.id === currentView);
        const isActive = currentView === item.id || isParentActive;

        if (item.children) {
            return (
                <div key={item.id} className="relative">
                    <button
                        onClick={() => handleMenuToggle(item.id as string)}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200'
                            : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
                            }`}
                    >
                        {React.cloneElement(item.icon, { className: 'w-5 h-5' })}
                        <span>{item.label}</span>
                        <ChevronDownIcon className={`w-4 h-4 transition-transform ${openMenu === item.id ? 'rotate-180' : ''}`} />
                    </button>
                    {openMenu === item.id && (
                        <div className="absolute mt-2 w-52 bg-white dark:bg-slate-800 rounded-md shadow-lg z-20 border border-slate-200 dark:border-slate-700">
                            <ul className="py-1">
                                {item.children.map(child => (
                                    <li key={child.id}>
                                        <button
                                            onClick={() => handleSubMenuClick(child.id)}
                                            className={`w-full text-left flex items-center space-x-3 px-4 py-2 text-sm transition-colors ${currentView === child.id
                                                ? 'bg-indigo-50 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200'
                                                : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
                                                }`}
                                        >
                                            {React.cloneElement(child.icon, { className: 'w-5 h-5' })}
                                            <span>{child.label}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            );
        }

        return (
            <button
                key={item.id}
                onClick={() => setView(item.id as View)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}
            >
                {React.cloneElement(item.icon, { className: 'w-5 h-5' })}
                <span>{item.label}</span>
            </button>
        );
    };

    return (
        <header className="bg-white dark:bg-slate-800 shadow-md no-print">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 flex items-center gap-2">
                            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-indigo-600">
                                <path d="M14 0C21.732 0 28 6.26801 28 14C28 21.732 21.732 28 14 28C6.26801 28 0 21.732 0 14C0 6.26801 6.26801 0 14 0Z" fill="currentColor" />
                                <path d="M14 5.25C9.16725 5.25 5.25 9.16725 5.25 14C5.25 18.8327 9.16725 22.75 14 22.75C18.8327 22.75 22.75 18.8327 22.75 14C22.75 9.16725 18.8327 5.25 14 5.25Z" fill="white" />
                                <path d="M14 7C10.134 7 7 10.134 7 14C7 17.866 10.134 21 14 21C17.866 21 21 17.866 21 14C21 10.134 17.866 7 14 7Z" fill="currentColor" />
                            </svg>
                            <span className="text-xl font-bold text-slate-800 dark:text-slate-100">Matrix Weaver TBM Edition</span>
                        </div>
                        <nav ref={menuRef} className="hidden md:flex items-center space-x-1">
                            {navItems.map(renderNavItem)}
                        </nav>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div ref={searchRef} className="relative">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search anything..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    onFocus={() => setIsSearchFocused(true)}
                                    className="w-64 pl-10 pr-4 py-2 text-sm bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <SearchIcon className="w-5 h-5 text-slate-400" />
                                </div>
                            </div>
                            {isSearchFocused && searchQuery.length > 1 && (
                                <div className="absolute mt-2 w-full md:w-96 right-0 bg-white dark:bg-slate-800 rounded-lg shadow-2xl z-50 overflow-hidden border border-slate-200 dark:border-slate-700">
                                    {totalResults > 0 ? (
                                        <div className="max-h-96 overflow-y-auto">
                                            {searchResults?.employees.length > 0 && (
                                                <div>
                                                    <h3 className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500 p-3 bg-slate-50 dark:bg-slate-900/50">Employees</h3>
                                                    <ul>{searchResults.employees.map(e => <li key={e.id} onClick={() => handleResultClick('employees')} className="p-3 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-200">{e.name} <span className="text-slate-500 dark:text-slate-400">- {e.role}</span></li>)}</ul>
                                                </div>
                                            )}
                                            {searchResults?.valueStreams.length > 0 && (
                                                <div>
                                                    <h3 className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500 p-3 bg-slate-50 dark:bg-slate-900/50">Solutions</h3>
                                                    <ul>{searchResults.valueStreams.map(vs => <li key={vs.id} onClick={() => handleResultClick('valueStreams')} className="p-3 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-200">{vs.name}</li>)}</ul>
                                                </div>
                                            )}
                                             {searchResults?.services.length > 0 && (
                                                <div>
                                                    <h3 className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500 p-3 bg-slate-50 dark:bg-slate-900/50">Services</h3>
                                                    <ul>{searchResults.services.map(s => <li key={s.id} onClick={() => handleResultClick('services')} className="p-3 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-200">{s.name}</li>)}</ul>
                                                </div>
                                            )}
                                            {searchResults?.competences.length > 0 && (
                                                <div>
                                                    <h3 className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500 p-3 bg-slate-50 dark:bg-slate-900/50">Competences</h3>
                                                    <ul>{searchResults.competences.map(c => <li key={c.id} onClick={() => handleResultClick('competences')} className="p-3 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-200">{c.name}</li>)}</ul>
                                                </div>
                                            )}
                                             {searchResults?.skills.length > 0 && (
                                                <div>
                                                    <h3 className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500 p-3 bg-slate-50 dark:bg-slate-900/50">Skills</h3>
                                                    <ul>{searchResults.skills.map(s => <li key={s.id} onClick={() => handleResultClick('skills')} className="p-3 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-200">{s.name}</li>)}</ul>
                                                </div>
                                            )}
                                            {searchResults?.resourceTowers.length > 0 && (
                                                <div>
                                                    <h3 className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500 p-3 bg-slate-50 dark:bg-slate-900/50">Resource Towers</h3>
                                                    <ul>{searchResults.resourceTowers.map(rt => <li key={rt.id} onClick={() => handleResultClick('resourceTowers')} className="p-3 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-200">{rt.name}</li>)}</ul>
                                                </div>
                                            )}
                                            {searchResults?.costPools.length > 0 && (
                                                <div>
                                                    <h3 className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500 p-3 bg-slate-50 dark:bg-slate-900/50">Cost Pools</h3>
                                                    <ul>{searchResults.costPools.map(ct => <li key={ct.id} onClick={() => handleResultClick('costPools')} className="p-3 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-200">{ct.name}</li>)}</ul>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="p-4 text-sm text-slate-500 dark:text-slate-400">No results found for "{searchQuery}"</p>
                                    )}
                                </div>
                            )}
                        </div>
                         <button
                            onClick={() => setIsUserGuideModalOpen(true)}
                            className="p-2 rounded-md text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                            aria-label="User Guide"
                        >
                            <QuestionMarkCircleIcon className="w-6 h-6" />
                        </button>
                         <button
                            onClick={() => setIsAboutModalOpen(true)}
                            className="p-2 rounded-md text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                            aria-label="About this application"
                        >
                            <InformationCircleIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>

            <Modal isOpen={isUserGuideModalOpen} onClose={() => setIsUserGuideModalOpen(false)} title="User Guide">
                <div className="text-slate-600 dark:text-slate-300 space-y-6 text-sm">
                    <div>
                        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-2">Welcome to Matrix Weaver!</h3>
                        <p>This application helps you model your organization using Technology Business Management (TBM) principles. It shows how your people, costs, and technology resources all connect to deliver value.</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-2">Core Concepts</h3>
                        <ul className="space-y-3">
                            <li><strong className="text-indigo-600 dark:text-indigo-400">Solutions (Value Streams):</strong> These are the products or services your organization delivers to its consumers. They are the focal point for measuring value.</li>
                            <li><strong className="text-indigo-600 dark:text-indigo-400">Services (Offerings):</strong> These are the specific, concrete activities that a Solution provides. A single Service can be shared and provided by multiple Solutions.</li>
                            <li><strong className="text-sky-600 dark:text-sky-400">Employees & Competences:</strong> Employees are the people doing the work. Competences are their functional homes or centers of excellence (e.g., 'Backend Engineering').</li>
                            <li><strong className="text-pink-600 dark:text-pink-400">Functional Teams:</strong> Operational squads where work happens (e.g., 'Mobile Squad A'). Employees can belong to multiple Functional Teams.</li>
                            <li><strong className="text-amber-600 dark:text-amber-400">Cost Pools & Resource Towers:</strong> This is how costs are modeled. Cost Pools are financial categories (like 'Software Licenses'). Resource Towers are the IT components they map to (like 'Application').</li>
                        </ul>
                    </div>
                     <div>
                        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-2">How to Get Started</h3>
                        <ol className="list-decimal list-inside space-y-2">
                           <li><span className="font-semibold">Explore the Dashboard:</span> This is your main overview. You can filter by a specific Solution or Competence to drill down into details. Check the 'Organizational Health Checks' to spot any immediate issues.</li>
                           <li><span className="font-semibold">Manage Your Data:</span> Use the navigation menus at the top to visit different management pages. Under 'People', 'Offerings', and 'TBM', you can add, edit, or delete any item.</li>
                           <li><span className="font-semibold">Analyze & Visualize:</span> Dive into the 'Analytics' and 'Org View' pages to see how everything connects. The Competency Map under 'People' is great for finding skill experts and gaps.</li>
                        </ol>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-2">Data Management</h3>
                        <p>Your work is automatically saved in your browser's local storage. You can use the 'Data Management' widget at the bottom of the screen to <span className="font-semibold">Export</span> your entire setup to a JSON file for backup, or <span className="font-semibold">Import</span> a file to load a previous state.</p>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} title="About Matrix Weaver TBM Edition">
                <div className="text-slate-600 dark:text-slate-300 space-y-4">
                    <p>
                        This application provides an interactive way to model, manage, and visualize a matrix organization based on Technology Business Management (TBM) principles. It helps highlight the connections between functional competences, employees, and the value-delivering solutions they contribute to.
                    </p>
                    <div>
                        <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">Created By:</h3>
                        <ul className="list-disc list-inside ml-4">
                            <li>Matthias</li>
                            <li>Lorenzo</li>
                            <li>Doris</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">Technology Stack:</h3>
                        <ul className="list-disc list-inside ml-4">
                            <li>React</li>
                            <li>TypeScript</li>
                            <li>Tailwind CSS</li>
                            <li>Recharts</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">Version:</h3>
                        <p className="text-sm">{APP_VERSION}</p>
                    </div>
                </div>
            </Modal>
        </header>
    );
};

export default Header;
