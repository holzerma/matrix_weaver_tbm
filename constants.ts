
import { Employee, ValueStream, Competence, CostPool, ResourceTower, Skill, Service, SolutionType } from './types';

export const APP_VERSION = '1.3.0';

export const SKILL_CATEGORIES = [
    'Frontend Development',
    'Backend Development',
    'Design',
    'Product Management',
    'Cloud & SRE',
    'Data Science',
    'Marketing',
    'Sales',
    'Security',
    'General',
];

export const SOLUTION_TYPES: SolutionType[] = ['Business', 'Workplace', 'Infrastructure', 'Delivery', 'Shared & Corporate', 'Artificial Intelligence'];

export const SOLUTION_CATEGORIES = [
    // Business
    'Product Management', 'Sales & Marketing', 'Manufacturing & Delivery', 'Customer Service',
    // Workplace
    'Client Computing', 'Communication & Collaboration', 'Connectivity',
    // Infrastructure
    'Compute', 'Data Center', 'Data', 'Network', 'Storage',
    // Delivery
    'Strategy & Planning', 'Development', 'Operations', 'Support', 'Security & Compliance', 'Enabling Platforms',
    // Shared & Corporate
    'Finance', 'Workforce', 'Vendor & Procurement', 'Health, Safety, Security, and Environmental', 'Risk, Audit & Compliance', 'Legal', 'Property & Facility', 'Corporate Communications', 'Sustainability & ESG',
    // Artificial Intelligence
    'Agentic', 'Generative', 'Interpretive', 'Predictive', 'Prescriptive'
].sort();

export const initialSkills: Skill[] = [
    { id: 'skill1', name: 'React', category: 'Frontend Development' },
    { id: 'skill2', name: 'Angular', category: 'Frontend Development' },
    { id: 'skill3', name: 'Vue.js', category: 'Frontend Development' },
    { id: 'skill4', name: 'Node.js', category: 'Backend Development' },
    { id: 'skill5', name: 'Python', category: 'Backend Development' },
    { id: 'skill6', name: 'Go', category: 'Backend Development' },
    { id: 'skill7', name: 'Figma', category: 'Design' },
    { id: 'skill8', name: 'Sketch', category: 'Design' },
    { id: 'skill9', name: 'User Research', category: 'Design' },
    { id: 'skill10', name: 'Agile Methodology', category: 'Product Management' },
    { id: 'skill11', name: 'Scrum', category: 'Product Management' },
    { id: 'skill12', name: 'Roadmap Planning', category: 'Product Management' },
    { id: 'skill13', name: 'AWS', category: 'Cloud & SRE' },
    { id: 'skill14', name: 'Docker', category: 'Cloud & SRE' },
    { id: 'skill15', name: 'Kubernetes', category: 'Cloud & SRE' },
    { id: 'skill16', name: 'SQL', category: 'Data Science' },
    { id: 'skill17', name: 'Machine Learning', category: 'Data Science' },
    { id: 'skill18', name: 'Data Visualization', category: 'Data Science' },
    { id: 'skill19', name: 'SEO', category: 'Marketing' },
    { id: 'skill20', name: 'Content Marketing', category: 'Marketing' },
    { id: 'skill21', name: 'Salesforce', category: 'Sales' },
    { id: 'skill22', name: 'Negotiation', category: 'Sales' },
    { id: 'skill23', name: 'TypeScript', category: 'Frontend Development'},
    { id: 'skill24', name: 'Java', category: 'Backend Development'},
    { id: 'skill25', name: 'C#', category: 'Backend Development'},
    { id: 'skill26', name: 'Terraform', category: 'Cloud & SRE'},
    { id: 'skill27', name: 'Ansible', category: 'Cloud & SRE'},
    { id: 'skill28', name: 'Azure', category: 'Cloud & SRE'},
    { id: 'skill29', name: 'Power BI', category: 'Data Science'},
    { id: 'skill30', name: 'Tableau', category: 'Data Science'},
    { id: 'skill31', name: 'Penetration Testing', category: 'Security'},
    { id: 'skill32', name: 'CISSP', category: 'Security'},
    { id: 'skill33', name: 'Kanban', category: 'Product Management' },
];

export const initialEmployees: Employee[] = [
    { id: 'emp1', name: 'Alice Johnson', role: 'Software Engineer', salary: 90000, competenceId: 'comp1', valueStreamIds: ['vs_biz_pm_1'], employeeType: 'internal', isManager: false, skills: [{ skillId: 'skill1', proficiency: 4 }, { skillId: 'skill4', proficiency: 3 }, { skillId: 'skill23', proficiency: 4 }] },
    { id: 'emp2', name: 'Bob Williams', role: 'Product Manager', salary: 110000, competenceId: 'comp2', valueStreamIds: ['vs_biz_pm_1', 'vs_biz_pm_2'], employeeType: 'internal', isManager: true, skills: [{ skillId: 'skill10', proficiency: 5 }, { skillId: 'skill12', proficiency: 4 }, { skillId: 'skill33', proficiency: 3 }] },
    { id: 'emp3', name: 'Charlie Brown', role: 'UX Designer', salary: 85000, competenceId: 'comp3', valueStreamIds: ['vs_biz_pm_1'], employeeType: 'internal', isManager: false, skills: [{ skillId: 'skill7', proficiency: 5 }, { skillId: 'skill9', proficiency: 4 }] },
    { id: 'emp4', name: 'Diana Miller', role: 'QA Engineer', salary: 75000, competenceId: 'comp1', valueStreamIds: ['vs_del_dev_4'], employeeType: 'external', isManager: false, skills: [{ skillId: 'skill1', proficiency: 2 }, { skillId: 'skill10', proficiency: 3 }] },
    { id: 'emp5', name: 'Ethan Davis', role: 'DevOps Engineer', salary: 105000, competenceId: 'comp4', valueStreamIds: ['vs_inf_cmp_4', 'vs_del_sp_1'], employeeType: 'internal', isManager: false, skills: [{ skillId: 'skill13', proficiency: 4 }, { skillId: 'skill14', proficiency: 5 }, { skillId: 'skill15', proficiency: 3 }, { skillId: 'skill26', proficiency: 4 }] },
    { id: 'emp6', name: 'Fiona Garcia', role: 'Senior Consultant', salary: 140000, competenceId: 'comp2', valueStreamIds: ['vs_del_sp_3'], employeeType: 'external', isManager: true, skills: [{ skillId: 'skill12', proficiency: 5 }] },
    { id: 'emp7', name: 'George Harris', role: 'Backend Engineer', salary: 95000, competenceId: 'comp5', valueStreamIds: ['vs_biz_pm_2'], employeeType: 'internal', isManager: false, skills: [{ skillId: 'skill5', proficiency: 4 }, { skillId: 'skill6', proficiency: 3 }, { skillId: 'skill24', proficiency: 2 }] },
    { id: 'emp8', name: 'Hannah Clark', role: 'Data Scientist', salary: 120000, competenceId: 'comp6', valueStreamIds: ['vs_ai_prd_1'], employeeType: 'internal', isManager: false, skills: [{ skillId: 'skill16', proficiency: 5 }, { skillId: 'skill17', proficiency: 3 }, { skillId: 'skill29', proficiency: 4 }] },
    { id: 'emp9', name: 'Ian Wright', role: 'Senior Backend Engineer', salary: 125000, competenceId: 'comp5', valueStreamIds: ['vs_inf_cmp_2', 'vs_del_dev_2'], employeeType: 'internal', isManager: false, skills: [{ skillId: 'skill24', proficiency: 5 }, { skillId: 'skill4', proficiency: 3 }, { skillId: 'skill6', proficiency: 2 }] },
    { id: 'emp10', name: 'Jane Doe', role: 'Security Analyst', salary: 98000, competenceId: 'comp9', valueStreamIds: ['vs_sc_fin_1'], employeeType: 'internal', isManager: false, skills: [{ skillId: 'skill31', proficiency: 4 }, { skillId: 'skill32', proficiency: 3 }] },
    { id: 'emp11', name: 'Kevin Moore', role: 'Cloud Architect', salary: 150000, competenceId: 'comp4', valueStreamIds: ['vs_del_sp_1'], employeeType: 'internal', isManager: true, skills: [{ skillId: 'skill13', proficiency: 5 }, { skillId: 'skill28', proficiency: 4 }, { skillId: 'skill15', proficiency: 4 }] },
    { id: 'emp12', name: 'Laura Taylor', role: 'Frontend Developer', salary: 88000, competenceId: 'comp1', valueStreamIds: ['vs_wkp_cc_4'], employeeType: 'internal', isManager: false, skills: [{ skillId: 'skill2', proficiency: 4 }, { skillId: 'skill23', proficiency: 3 }] },
    { id: 'emp13', name: 'Michael Scott', role: 'Engineering Manager', salary: 160000, competenceId: 'comp5', valueStreamIds: [], employeeType: 'internal', isManager: true, skills: [{ skillId: 'skill10', proficiency: 5 }, { skillId: 'skill22', proficiency: 4 }] },
    { id: 'emp14', name: 'Nancy Green', role: 'Scrum Master', salary: 92000, competenceId: 'comp2', valueStreamIds: ['vs_biz_pm_1', 'vs_biz_pm_2'], employeeType: 'internal', isManager: false, skills: [{ skillId: 'skill10', proficiency: 5 }, { skillId: 'skill11', proficiency: 5 }] },
    { id: 'emp15', name: 'Oliver King', role: 'Data Analyst', salary: 78000, competenceId: 'comp6', valueStreamIds: ['vs_sc_fin_1'], employeeType: 'external', isManager: false, skills: [{ skillId: 'skill16', proficiency: 4 }, { skillId: 'skill30', proficiency: 4 }] },
    { id: 'emp16', name: 'Penelope Hill', role: 'UI Designer', salary: 82000, competenceId: 'comp3', valueStreamIds: ['vs_wkp_cc_4'], employeeType: 'internal', isManager: false, skills: [{ skillId: 'skill7', proficiency: 4 }, { skillId: 'skill8', proficiency: 3 }] },
    { id: 'emp17', name: 'Quincy Adams', role: 'Site Reliability Engineer', salary: 115000, competenceId: 'comp4', valueStreamIds: ['vs_inf_cmp_1'], employeeType: 'internal', isManager: false, skills: [{ skillId: 'skill15', proficiency: 4 }, { skillId: 'skill27', proficiency: 4 }, { skillId: 'skill5', proficiency: 3 }] },
    { id: 'emp18', name: 'Rachel Zane', role: 'Marketing Specialist', salary: 72000, competenceId: 'comp7', valueStreamIds: ['vs_biz_pm_2'], employeeType: 'internal', isManager: false, skills: [{ skillId: 'skill19', proficiency: 4 }, { skillId: 'skill20', proficiency: 3 }] },
    { id: 'emp19', name: 'Steve Rogers', role: 'Sales Executive', salary: 100000, competenceId: 'comp8', valueStreamIds: ['vs_biz_pm_2'], employeeType: 'internal', isManager: false, skills: [{ skillId: 'skill21', proficiency: 5 }, { skillId: 'skill22', proficiency: 5 }] },
    { id: 'emp20', name: 'Tony Stark', role: 'Principal Engineer', salary: 180000, competenceId: 'comp5', valueStreamIds: ['vs_ai_gen_1'], employeeType: 'internal', isManager: true, skills: [{ skillId: 'skill5', proficiency: 5 }, { skillId: 'skill17', proficiency: 5 }, { skillId: 'skill25', proficiency: 4 }] },
];

// TBM 5.0.1 Resource Towers (Pages 14-20)
export const initialResourceTowers: ResourceTower[] = [
    { id: 'rt_dc_1', name: 'Enterprise Data Center', tower: 'Data Center', domain: 'Infrastructure' },
    { id: 'rt_dc_2', name: 'Other Facilities', tower: 'Data Center', domain: 'Infrastructure' },
    { id: 'rt_st_1', name: 'Online Storage', tower: 'Storage', domain: 'Infrastructure' },
    { id: 'rt_st_2', name: 'Offline Storage', tower: 'Storage', domain: 'Infrastructure' },
    { id: 'rt_st_3', name: 'Mainframe Online Storage', tower: 'Storage', domain: 'Infrastructure' },
    { id: 'rt_st_4', name: 'Mainframe Offline Storage', tower: 'Storage', domain: 'Infrastructure' },
    { id: 'rt_st_5', name: 'AI Storage', tower: 'Storage', domain: 'Infrastructure' },
    { id: 'rt_cp_1', name: 'Servers', tower: 'Compute', domain: 'Infrastructure' },
    { id: 'rt_cp_2', name: 'Converged Infrastructure', tower: 'Compute', domain: 'Infrastructure' },
    { id: 'rt_cp_3', name: 'High Performance Compute', tower: 'Compute', domain: 'Infrastructure' },
    { id: 'rt_cp_4', name: 'Mainframe', tower: 'Compute', domain: 'Infrastructure' },
    { id: 'rt_cp_5', name: 'AI Compute', tower: 'Compute', domain: 'Infrastructure' },
    { id: 'rt_cp_6', name: 'Quantum', tower: 'Compute', domain: 'Infrastructure' },
    { id: 'rt_cp_7', name: 'Serverless', tower: 'Compute', domain: 'Infrastructure' },
    { id: 'rt_cp_8', name: 'Auto-Scalers', tower: 'Compute', domain: 'Infrastructure' },
    { id: 'rt_nw_1', name: 'LAN', tower: 'Network', domain: 'Infrastructure' },
    { id: 'rt_nw_2', name: 'WAN', tower: 'Network', domain: 'Infrastructure' },
    { id: 'rt_nw_3', name: 'Voice & Collaboration', tower: 'Network', domain: 'Infrastructure' },
    { id: 'rt_nw_4', name: 'AI Network', tower: 'Network', domain: 'Infrastructure' },
    { id: 'rt_nw_5', name: 'Network Management', tower: 'Network', domain: 'Infrastructure' },
    { id: 'rt_ap_1', name: 'Development', tower: 'Application', domain: 'Application' },
    { id: 'rt_ap_2', name: 'Support & Operations', tower: 'Application', domain: 'Application' },
    { id: 'rt_ap_3', name: 'Licensing', tower: 'Application', domain: 'Application' },
    { id: 'rt_ap_4', name: 'Middleware', tower: 'Application', domain: 'Application' },
    { id: 'rt_ap_5', name: 'Mainframe Middleware', tower: 'Application', domain: 'Application' },
    { id: 'rt_ap_6', name: 'Container Orchestration', tower: 'Application', domain: 'Application' },
    { id: 'rt_ap_7', name: 'Blockchain & Tokenization', tower: 'Application', domain: 'Application' },
    { id: 'rt_ap_8', name: 'AI Models', tower: 'Application', domain: 'Application' },
    { id: 'rt_dt_1', name: 'Data Operations', tower: 'Data', domain: 'Application' },
    { id: 'rt_dt_2', name: 'Data Management', tower: 'Data', domain: 'Application' },
    { id: 'rt_dt_3', name: 'Mainframe Database', tower: 'Data', domain: 'Application' },
    { id: 'rt_dt_4', name: 'Database', tower: 'Data', domain: 'Application' },
    { id: 'rt_dl_1', name: 'Service Management', tower: 'Delivery', domain: 'Operations' },
    { id: 'rt_dl_2', name: 'Client Management', tower: 'Delivery', domain: 'Operations' },
    { id: 'rt_dl_3', name: 'Operations Center', tower: 'Delivery', domain: 'Operations' },
    { id: 'rt_dl_4', name: 'Tech Portfolio & Project Management', tower: 'Delivery', domain: 'Operations' },
    { id: 'rt_dl_5', name: 'Central Print', tower: 'Delivery', domain: 'Operations' },
    { id: 'rt_tm_1', name: 'Tech Management & Strategy', tower: 'Tech Management', domain: 'Operations' },
    { id: 'rt_tm_2', name: 'Tech Finance', tower: 'Tech Management', domain: 'Operations' },
    { id: 'rt_tm_3', name: 'Enterprise Architecture', tower: 'Tech Management', domain: 'Operations' },
    { id: 'rt_tm_4', name: 'Tech Vendor Management', tower: 'Tech Management', domain: 'Operations' },
    { id: 'rt_tm_5', name: 'Tech Human Capital Management', tower: 'Tech Management', domain: 'Operations' },
    { id: 'rt_se_1', name: 'Digital Security', tower: 'Security', domain: 'Operations' },
    { id: 'rt_se_2', name: 'Identity & Access Governance', tower: 'Security', domain: 'Operations' },
    { id: 'rt_rc_1', name: 'Regulatory & Audit', tower: 'Risk & Compliance', domain: 'Operations' },
    { id: 'rt_rc_2', name: 'Risk Management', tower: 'Risk & Compliance', domain: 'Operations' },
    { id: 'rt_rc_3', name: 'Disaster Recovery', tower: 'Risk & Compliance', domain: 'Operations' },
    { id: 'rt_sd_1', name: 'Intelligent Devices', tower: 'Smart Devices', domain: 'Field & Office' },
    { id: 'rt_sd_2', name: 'Industrial & Control Systems', tower: 'Smart Devices', domain: 'Field & Office' },
    { id: 'rt_eu_1', name: 'Workspace', tower: 'End User', domain: 'Field & Office' },
    { id: 'rt_eu_2', name: 'Mobile Devices', tower: 'End User', domain: 'Field & Office' },
    { id: 'rt_eu_3', name: 'Network Printers', tower: 'End User', domain: 'Field & Office' },
    { id: 'rt_eu_4', name: 'Conferencing & AV', tower: 'End User', domain: 'Field & Office' },
    { id: 'rt_eu_5', name: 'Help Desk', tower: 'End User', domain: 'Field & Office' },
    { id: 'rt_eu_6', name: 'Deskside Support', tower: 'End User', domain: 'Field & Office' },
];

// TBM 5.0.1 Cost Pools (Pages 8-11)
export const initialCostPools: CostPool[] = [
    // OpEx
    { id: 'cp_op_sf_1', name: 'Internal Labor', category: 'Staffing', defaultResourceTowerId: 'rt_tm_5' },
    { id: 'cp_op_sf_2', name: 'Staff Augmentation', category: 'Staffing', defaultResourceTowerId: 'rt_tm_5' },
    { id: 'cp_op_sf_3', name: 'Other Operating (Staffing)', category: 'Staffing', defaultResourceTowerId: 'rt_tm_5' },
    { id: 'cp_op_os_1', name: 'Consulting', category: 'Outside Services', defaultResourceTowerId: 'rt_tm_4' },
    { id: 'cp_op_os_2', name: 'Managed Services (Outside Services)', category: 'Outside Services', defaultResourceTowerId: 'rt_tm_4' },
    { id: 'cp_op_os_3', name: 'Other Operating (Outside Services)', category: 'Outside Services', defaultResourceTowerId: 'rt_tm_4' },
    { id: 'cp_op_cs_1', name: 'Cloud Service Provider', category: 'Cloud Services', defaultResourceTowerId: 'rt_cp_1' },
    { id: 'cp_op_cs_2', name: 'Other Operating (Cloud Services)', category: 'Cloud Services', defaultResourceTowerId: 'rt_cp_1' },
    { id: 'cp_op_hw_1', name: 'Lease (Hardware)', category: 'Hardware', defaultResourceTowerId: 'rt_cp_1' },
    { id: 'cp_op_hw_2', name: 'Maintenance & Support (Hardware)', category: 'Hardware', defaultResourceTowerId: 'rt_cp_1' },
    { id: 'cp_op_hw_3', name: 'Depreciation & Amortization (Hardware)', category: 'Hardware', defaultResourceTowerId: 'rt_cp_1' },
    { id: 'cp_op_hw_4', name: 'Managed Services (Hardware)', category: 'Hardware', defaultResourceTowerId: 'rt_tm_4' },
    { id: 'cp_op_hw_5', name: 'Other Operating (Hardware)', category: 'Hardware', defaultResourceTowerId: 'rt_cp_1' },
    { id: 'cp_op_sw_1', name: 'Licensing', category: 'Software & SaaS', defaultResourceTowerId: 'rt_ap_3' },
    { id: 'cp_op_sw_2', name: 'Maintenance & Support (Software)', category: 'Software & SaaS', defaultResourceTowerId: 'rt_ap_2' },
    { id: 'cp_op_sw_3', name: 'Depreciation & Amortization (Software)', category: 'Software & SaaS', defaultResourceTowerId: 'rt_ap_1' },
    { id: 'cp_op_sw_4', name: 'SaaS', category: 'Software & SaaS', defaultResourceTowerId: 'rt_ap_3' },
    { id: 'cp_op_sw_5', name: 'Other Operating (Software & SaaS)', category: 'Software & SaaS', defaultResourceTowerId: 'rt_ap_2' },
    { id: 'cp_op_dc_1', name: 'Lease (Data Center)', category: 'Data Center Facilities', defaultResourceTowerId: 'rt_dc_1' },
    { id: 'cp_op_dc_2', name: 'Maintenance & Support (Data Center)', category: 'Data Center Facilities', defaultResourceTowerId: 'rt_dc_1' },
    { id: 'cp_op_dc_3', name: 'Depreciation & Amortization (Data Center)', category: 'Data Center Facilities', defaultResourceTowerId: 'rt_dc_1' },
    { id: 'cp_op_dc_4', name: 'Managed Services (Data Center)', category: 'Data Center Facilities', defaultResourceTowerId: 'rt_dc_1' },
    { id: 'cp_op_dc_5', name: 'Other Operating (Data Center)', category: 'Data Center Facilities', defaultResourceTowerId: 'rt_dc_1' },
    { id: 'cp_op_tc_1', name: 'Lease (Telecom)', category: 'Telecom', defaultResourceTowerId: 'rt_nw_2' },
    { id: 'cp_op_tc_2', name: 'Maintenance & Support (Telecom)', category: 'Telecom', defaultResourceTowerId: 'rt_nw_5' },
    { id: 'cp_op_tc_3', name: 'Depreciation & Amortization (Telecom)', category: 'Telecom', defaultResourceTowerId: 'rt_nw_2' },
    { id: 'cp_op_tc_4', name: 'Managed Services (Telecom)', category: 'Telecom', defaultResourceTowerId: 'rt_nw_5' },
    { id: 'cp_op_tc_5', name: 'Other Operating (Telecom)', category: 'Telecom', defaultResourceTowerId: 'rt_nw_5' },
    { id: 'cp_op_mc_1', name: 'Managed Services (Misc)', category: 'Misc Costs', defaultResourceTowerId: 'rt_tm_2' },
    { id: 'cp_op_mc_2', name: 'Other Operating (Misc)', category: 'Misc Costs', defaultResourceTowerId: 'rt_tm_2' },
    { id: 'cp_op_cc_1', name: 'By Internal Department', category: 'Cross Charges', defaultResourceTowerId: 'rt_tm_2' },
    // CapEx
    { id: 'cp_cap_sf_1', name: 'Internal Labor Capital', category: 'Staffing', defaultResourceTowerId: 'rt_tm_5' },
    { id: 'cp_cap_sf_2', name: 'Staff Augmentation Capital', category: 'Staffing', defaultResourceTowerId: 'rt_tm_5' },
    { id: 'cp_cap_os_1', name: 'Capital (Outside Services)', category: 'Outside Services', defaultResourceTowerId: 'rt_tm_4' },
    { id: 'cp_cap_cs_1', name: 'Capital (Cloud Services)', category: 'Cloud Services', defaultResourceTowerId: 'rt_cp_1' },
    { id: 'cp_cap_hw_1', name: 'Capital (Hardware)', category: 'Hardware', defaultResourceTowerId: 'rt_cp_1' },
    { id: 'cp_cap_sw_1', name: 'Capital (Software & SaaS)', category: 'Software & SaaS', defaultResourceTowerId: 'rt_ap_1' },
    { id: 'cp_cap_dc_1', name: 'Capital (Data Center Facilities)', category: 'Data Center Facilities', defaultResourceTowerId: 'rt_dc_1' },
    { id: 'cp_cap_tc_1', name: 'Capital (Telecom)', category: 'Telecom', defaultResourceTowerId: 'rt_nw_2' },
    { id: 'cp_cap_mc_1', name: 'Capital (Misc Costs)', category: 'Misc Costs', defaultResourceTowerId: 'rt_tm_2' },
];

export const initialServices: Service[] = [
    { id: 'serv1', name: 'New Account Setup', description: 'Automated and manual processes for creating and configuring new customer accounts.' },
    { id: 'serv2', name: 'User Training Portal', description: 'Online platform for user documentation, tutorials, and training sessions.' },
    { id: 'serv3', name: 'Mobile App Support', description: 'Tier 1 and 2 support for users of the mobile application.' },
    { id: 'serv4', name: 'Data Analytics Reporting', description: 'Generation and delivery of standard and custom data analysis reports.' },
    { id: 'serv5', name: 'Identity & Access Management', description: 'Shared service for managing user authentication and authorization across applications.' },
    { id: 'serv6', name: 'API Gateway Management', description: 'Manages the full lifecycle of APIs, including security, rate limiting, and analytics.' },
    { id: 'serv7', name: 'Legacy Monolith Support', description: 'Maintenance and support for the old monolithic backend system (to be deprecated).' },
    { id: 'serv8', name: 'Automated Testing Suite', description: 'CI/CD pipeline service for running automated integration and E2E tests.'},
    { id: 'serv9', name: 'Container Registry', description: 'Private, secure registry for storing and managing Docker container images.'},
    { id: 'serv10', name: 'Virtual Desktop Infrastructure', description: 'Provides virtualized desktop environments for remote and secure access to corporate resources.'}
];

// TBM 5.0.1 Solutions (Pages 23-44)
export const initialValueStreams: ValueStream[] = [
    // Delivery Solutions
    { id: 'vs_del_sp_1', name: 'Enterprise Architecture', description: 'Guides organizations through the business, information, process, and technology changes necessary to execute their business and Technology strategies.', costPoolConsumption: [{ costPoolId: 'cp_op_sw_4', annualCost: 50000 }], solutionType: 'Delivery', solutionCategory: 'Strategy & Planning', solutionClassification: 'Service', serviceIds: ['serv6'] },
    { id: 'vs_del_sp_2', name: 'Business Solution Consulting', description: 'Helps the enterprise improve their performance, primarily through the analysis of existing business problems and development of plans for improvement.', costPoolConsumption: [], solutionType: 'Delivery', solutionCategory: 'Strategy & Planning', solutionClassification: 'Service', serviceIds: [] },
    { id: 'vs_del_sp_3', name: 'Technology Business Management', description: 'Solutions supporting business-aligned technology decisions, including cost transparency, financial management, and value optimization.', costPoolConsumption: [], solutionType: 'Delivery', solutionCategory: 'Strategy & Planning', solutionClassification: 'Service', serviceIds: [] },
    { id: 'vs_del_sp_4', name: 'Innovation & Ideation', description: 'The investment, development, and incubation of new technologies to create new or better solutions which meet unarticulated or existing market needs.', costPoolConsumption: [], solutionType: 'Delivery', solutionCategory: 'Strategy & Planning', solutionClassification: 'Product', serviceIds: [] },
    { id: 'vs_del_sp_5', name: 'Technology Vendor Management', description: 'The management of technology suppliers who provide, deliver and support technology products and solutions.', costPoolConsumption: [], solutionType: 'Delivery', solutionCategory: 'Strategy & Planning', solutionClassification: 'Service', serviceIds: [] },
    { id: 'vs_del_sp_6', name: 'Program, Product & Project Management', description: 'The process of managing software development-focused projects, programs, and products with the intention of improving an organization\'s performance.', costPoolConsumption: [], solutionType: 'Delivery', solutionCategory: 'Strategy & Planning', solutionClassification: 'Service', serviceIds: [] },
    { id: 'vs_del_dev_1', name: 'Design & Development', description: 'Provides the planning, design, programming, documenting, testing, and fixing involved in creating and maintaining a software product.', costPoolConsumption: [], solutionType: 'Delivery', solutionCategory: 'Development', solutionClassification: 'Service', serviceIds: [] },
    { id: 'vs_del_dev_2', name: 'System Integration', description: 'Links together different computing systems and software applications physically or functionally, to act as a coordinated whole.', costPoolConsumption: [], solutionType: 'Delivery', solutionCategory: 'Development', solutionClassification: 'Service', serviceIds: ['serv6'] },
    { id: 'vs_del_dev_3', name: 'Modernization & Migration', description: 'Provides the planning, design, and architecture for moving from older, often legacy systems and platforms to newer, more modern systems and platforms.', costPoolConsumption: [], solutionType: 'Delivery', solutionCategory: 'Development', solutionClassification: 'Service', serviceIds: [] },
    { id: 'vs_del_dev_4', name: 'Testing', description: 'Executes programs or applications with the intent of finding errors or other defects.', costPoolConsumption: [], solutionType: 'Delivery', solutionCategory: 'Development', solutionClassification: 'Service', serviceIds: ['serv8'] },
    // Infrastructure Solutions
    { id: 'vs_inf_cmp_1', name: 'Compute on Demand', description: 'Temporary, scalable compute solutions provisioned automatically in response to triggers or schedules, supporting dynamic workload requirements.', costPoolConsumption: [{ costPoolId: 'cp_op_cs_1', annualCost: 250000 }], solutionType: 'Infrastructure', solutionCategory: 'Compute', solutionClassification: 'Service', serviceIds: [] },
    { id: 'vs_inf_cmp_2', name: 'Mainframe', description: 'Transactional and batch-oriented compute solutions supported by a mainframe infrastructure.', costPoolConsumption: [], solutionType: 'Infrastructure', solutionCategory: 'Compute', solutionClassification: 'Service', serviceIds: [] },
    { id: 'vs_inf_cmp_3', name: 'Physical Compute', description: 'Variety of compute configurations comprised of physical servers.', costPoolConsumption: [], solutionType: 'Infrastructure', solutionCategory: 'Compute', solutionClassification: 'Service', serviceIds: [] },
    { id: 'vs_inf_cmp_4', name: 'Virtual Compute & Containers', description: 'Virtualized compute resources delivered on-demand, including containers for application, data, and workload portability.', costPoolConsumption: [{ costPoolId: 'cp_op_sw_1', annualCost: 75000 }], solutionType: 'Infrastructure', solutionCategory: 'Compute', solutionClassification: 'Service', serviceIds: ['serv9'] },
    // Workplace Solutions
    { id: 'vs_wkp_cc_1', name: 'Bring Your Own Device', description: 'Enables users to bring in their own personal computing devices (laptop, tablet, smartphone) and connect to the organization\'s corporate network.', costPoolConsumption: [], solutionType: 'Workplace', solutionCategory: 'Client Computing', solutionClassification: 'Service', serviceIds: [] },
    { id: 'vs_wkp_cc_2', name: 'Computer', description: 'Computers, workstations, laptop, tablet, and similar devices.', costPoolConsumption: [], solutionType: 'Workplace', solutionCategory: 'Client Computing', solutionClassification: 'Service', serviceIds: [] },
    { id: 'vs_wkp_cc_3', name: 'Mobile', description: 'Mobile phones and smartphones.', costPoolConsumption: [], solutionType: 'Workplace', solutionCategory: 'Client Computing', solutionClassification: 'Service', serviceIds: [] },
    { id: 'vs_wkp_cc_4', name: 'Virtual Client', description: 'The virtualization of desktop and application software enables PC and tablet functionality to be separate from the physical device used to access those functions.', costPoolConsumption: [], solutionType: 'Workplace', solutionCategory: 'Client Computing', solutionClassification: 'Service', serviceIds: ['serv10'] },
    // Business Solutions
    { id: 'vs_biz_pm_1', name: 'Product Development', description: 'Enables product design and development including innovation management, computer aided design, simulation visualization, enterprise feedback, and social product feedback and crowdsourcing.', costPoolConsumption: [{ costPoolId: 'cp_cap_sf_1', annualCost: 400000 }], solutionType: 'Business', solutionCategory: 'Product Management', solutionClassification: 'Product', serviceIds: ['serv1', 'serv5'] },
    { id: 'vs_biz_pm_2', name: 'Product Planning', description: 'Enables product life-cycle management including requirements management, product data management, change and configuration management, manufacturing process management, quality management, product analytics, and risk and compliance management.', costPoolConsumption: [], solutionType: 'Business', solutionCategory: 'Product Management', solutionClassification: 'Service', serviceIds: ['serv4'] },
    // Shared & Corporate Solutions
    { id: 'vs_sc_fin_1', name: 'Planning & Management Accounting', description: 'Enables the strategic allocation of funds in support of established future and current business goals, including planning, budgeting and forecasting, ad-hoc analysis and reporting.', costPoolConsumption: [{ costPoolId: 'cp_op_sw_4', annualCost: 120000 }], solutionType: 'Shared & Corporate', solutionCategory: 'Finance', solutionClassification: 'Service', serviceIds: ['serv5'] },
    { id: 'vs_sc_fin_2', name: 'Revenue Accounting', description: 'Enables the comparison of revenue targets to actual achievement. Supervisory responsibility over all transactions and entries that pass into the final periodic accounts of an entity.', costPoolConsumption: [], solutionType: 'Shared & Corporate', solutionCategory: 'Finance', solutionClassification: 'Service', serviceIds: [] },
    // Artificial Intelligence Solutions
    { id: 'vs_ai_agn_1', name: 'Autonomous Navigation', description: 'Enables physical or digital systems to perceive environments, plan routes, and navigate independently using sensor data and real-time decision-making.', costPoolConsumption: [], solutionType: 'Artificial Intelligence', solutionCategory: 'Agentic', solutionClassification: 'Product', serviceIds: [] },
    { id: 'vs_ai_gen_1', name: 'Image & Video Generation', description: 'Creates synthetic visual content using AI techniques such as generative adversarial networks (GANs) or diffusion models, supporting design, simulation, and media production use cases.', costPoolConsumption: [], solutionType: 'Artificial Intelligence', solutionCategory: 'Generative', solutionClassification: 'Product', serviceIds: [] },
    { id: 'vs_ai_prd_1', name: 'Predictive Analytics', description: 'Applies statistical and machine learning techniques to identify patterns and forecast future outcomes based on historical and real-time data.', costPoolConsumption: [{ costPoolId: 'cp_op_cs_1', annualCost: 180000 }], solutionType: 'Artificial Intelligence', solutionCategory: 'Predictive', solutionClassification: 'Product', serviceIds: ['serv4'] },
];

export const initialCompetences: Competence[] = [
    { id: 'comp1', name: 'Frontend Engineering', skill: 'Web Development' },
    { id: 'comp2', name: 'Product Management', skill: 'Agile & Scrum' },
    { id: 'comp3', name: 'User Experience', skill: 'Design Thinking' },
    { id: 'comp4', name: 'Infrastructure', skill: 'Cloud & SRE' },
    { id: 'comp5', name: 'Backend Engineering', skill: 'APIs & Services' },
    { id: 'comp6', name: 'Data Science', skill: 'Analytics & ML' },
    { id: 'comp7', name: 'Marketing', skill: 'Digital & Content' },
    { id: 'comp8', name: 'Sales', skill: 'Business Development' },
    { id: 'comp9', name: 'Cybersecurity', skill: 'Security & Compliance' },
];
