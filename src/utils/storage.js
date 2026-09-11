const USERS_KEY = 'scholarsync_users';
const RDATA_KEY = 'scholarsync_rdata';
const AUTH_KEY = 'scholarsync_auth';
const MESSAGES_KEY = 'scholarsync_messages';
const SETTINGS_KEY = 'scholarsync_settings';

const DEFAULT_SETTINGS = {
  institutionName: 'ScholarSync',
  institutionTagline: 'Research Data Management Portal',
  logoUrl: '',
  primaryColor: '#6366f1',
  accentColor: '#818cf8',
  contactEmail: 'research@college.edu',
  contactPhone: '+1 234 567 8900',
  address: '123 University Avenue, Campus Building',
  website: 'www.college.edu',
  welcomeMessage: 'Welcome to the Research Data Management Portal. Submit and track your research proposals here.',
  announcementBanner: '',
  enableAnnouncementBanner: false,
  maintenanceMode: false,
  maintenanceMessage: 'System under maintenance. Please try again later.',
  database: {
    type: 'local',
    local: {
      enabled: true
    },
    sql: {
      enabled: false,
      host: 'localhost',
      port: '3306',
      database: 'scholarsync',
      username: '',
      password: ''
    },
    cloud: {
      enabled: false,
      provider: 'firebase',
      apiKey: '',
      authDomain: '',
      projectId: '',
      storageBucket: '',
      messagingSenderId: '',
      appId: ''
    }
  },
  aboutContent: {
    description: 'ScholarSync is a comprehensive Research Data Management Portal designed to streamline the submission, review, and approval process for academic research proposals.',
    modules: [
      { id: 1, title: 'Dashboard', icon: 'BarChart3', description: 'Personalized dashboard showing research statistics, pending approvals, and recent activity.', features: ['Statistics overview', 'Recent submissions', 'Role-based views', 'Quick actions'] },
      { id: 2, title: 'Research Feed', icon: 'BookOpen', description: 'Browse and filter all research proposals with advanced search capabilities.', features: ['Filter by status', 'Department filtering', 'Keyword search', 'Detailed views'] },
      { id: 3, title: 'Announcements', icon: 'Bell', description: 'WhatsApp-style group for announcements and discussions.', features: ['Official announcements', 'Department groups', 'Role-based posting', 'Pinned messages'] },
      { id: 4, title: 'Approvals', icon: 'CheckCircle', description: 'Multi-level approval workflow for research proposals.', features: ['HOD review', 'Research Cell review', 'College Admin final approval', 'Rejection handling'] },
      { id: 5, title: 'Statistics', icon: 'Layers', description: 'Comprehensive analytics and visualizations of research data.', features: ['Department breakdown', 'Status distribution', 'Trend analysis', 'Export reports'] },
      { id: 6, title: 'Profile & Settings', icon: 'Users', description: 'User profile management and admin controls.', features: ['Profile management', 'Role assignment', 'Data import/export', 'User management'] }
    ],
    securityFeatures: [
      { id: 1, title: 'Role-Based Access Control', description: 'Four distinct user roles with specific permissions and capabilities.' },
      { id: 2, title: 'Password Authentication', description: 'Secure login with username/password for all users.' },
      { id: 3, title: 'Protected Routes', description: 'Dashboard and sensitive pages are protected from unauthorized access.' },
      { id: 4, title: 'Maintenance Mode', description: 'Admins can enable maintenance mode to restrict access during updates.' }
    ],
    keyFeatures: [
      { id: 1, title: 'Multi-Level Approvals', description: 'Streamlined approval workflow from submission to final approval' },
      { id: 2, title: 'Role Management', description: 'Flexible role assignment and user management for admins' },
      { id: 3, title: 'Research Tracking', description: 'Complete tracking of research proposals through all stages' },
      { id: 4, title: 'Analytics Dashboard', description: 'Visual insights into research statistics and trends' },
      { id: 5, title: 'Announcements', description: 'WhatsApp-style group for official announcements' },
      { id: 6, title: 'Data Export', description: 'Export data to JSON and CSV formats for backup' }
    ]
  },
  appendixContent: {
    academicDatabases: [
      { id: 1, name: 'N-LIST (INFLIBNET)', url: 'https://nlist.inflibnet.ac.in', desc: 'National Library and Information Services', icon: '📚' },
      { id: 2, name: 'DELNET', url: 'https://delnet.in', desc: 'Developing Library Network', icon: '🔗' },
      { id: 3, name: 'DOAJ', url: 'https://doaj.org', desc: 'Directory of Open Access Journals', icon: '📄' },
      { id: 4, name: 'ISSN Portal', url: 'https://portal.issn.org', desc: 'International Standard Serial Number', icon: '🔢' },
      { id: 5, name: 'SCImago Journal Rank', url: 'https://www.scimagojr.com', desc: 'Journal metrics and rankings', icon: '📊' },
      { id: 6, name: 'Web of Science', url: 'https://www.webofscience.com', desc: 'Research citation database', icon: '🌐' },
      { id: 7, name: 'Scopus', url: 'https://www.scopus.com', desc: 'Abstract and citation database', icon: '🔍' }
    ],
    publishers: [
      { id: 1, name: 'Elsevier ScienceDirect', url: 'https://www.sciencedirect.com', desc: 'Peer-reviewed articles', icon: '🏢' },
      { id: 2, name: 'Springer', url: 'https://link.springer.com', desc: 'Academic publisher', icon: '📖' },
      { id: 3, name: 'Wiley Online Library', url: 'https://onlinelibrary.wiley.com', desc: 'Research publications', icon: '📕' },
      { id: 4, name: 'IEEE Xplore', url: 'https://ieeexplore.ieee.org', desc: 'Engineering & technology', icon: '⚡' },
      { id: 5, name: 'ACM Digital Library', url: 'https://dl.acm.org', desc: 'Computing & IT', icon: '💻' }
    ],
    searchEngines: [
      { id: 1, name: 'Google Scholar', url: 'https://scholar.google.com', desc: 'Free scholarly literature search', icon: '🔎' },
      { id: 2, name: 'Semantic Scholar', url: 'https://www.semanticscholar.org', desc: 'AI-powered research', icon: '🤖' },
      { id: 3, name: 'Core', url: 'https://core.ac.uk', desc: 'Open access research', icon: '💎' },
      { id: 4, name: 'Connected Papers', url: 'https://www.connectedpapers.com', desc: 'Visual research graph', icon: '🔗' }
    ],
    repositories: [
      { id: 1, name: 'arXiv', url: 'https://arxiv.org', desc: 'Preprints in physics, math, CS', icon: '📜' },
      { id: 2, name: 'PubMed Central', url: 'https://www.ncbi.nlm.nih.gov/pmc', desc: 'Biomedical literature', icon: '🏥' },
      { id: 3, name: 'SSRN', url: 'https://www.ssrn.com', desc: 'Social science preprints', icon: '📝' },
      { id: 4, name: 'Zenodo', url: 'https://zenodo.org', desc: 'Open science repository', icon: '🗄️' }
    ],
    aiTools: [
      { id: 1, name: 'ChatGPT', url: 'https://chat.openai.com', desc: 'AI assistant for research', icon: '🤖' },
      { id: 2, name: 'Claude', url: 'https://claude.ai', desc: 'AI research assistant', icon: '🧠' },
      { id: 3, name: 'Consensus', url: 'https://consensus.app', desc: 'AI-powered research search', icon: '💡' },
      { id: 4, name: 'Elicit', url: 'https://elicit.org', desc: 'AI research assistant', icon: '🔬' }
    ],
    citationTools: [
      { id: 1, name: 'Zotero', url: 'https://www.zotero.org', desc: 'Free reference manager', icon: '📚' },
      { id: 2, name: 'Mendeley', url: 'https://www.mendeley.com', desc: 'Academic social network', icon: '👥' },
      { id: 3, name: 'Grammarly', url: 'https://grammarly.com', desc: 'Writing assistant', icon: '✏️' },
      { id: 4, name: 'Turnitin', url: 'https://www.turnitin.com', desc: 'Plagiarism detection', icon: '🕵️' }
    ]
  }
};

const DEFAULT_USERS = [
  { id: 1, username: 'researcher1', password: 'pass', role: 'researcher', department: 'CS', email: 'researcher1@college.edu' },
  { id: 2, username: 'faculty2', password: 'pass', role: 'researcher', department: 'EE', email: 'faculty2@college.edu' },
  { id: 3, username: 'rc_admin', password: 'pass', role: 'research_cell_admin', department: 'RCA', email: 'rc_admin@college.edu' },
  { id: 4, username: 'hod_cs', password: 'pass', role: 'dept_hod', department: 'CS', email: 'hod_cs@college.edu' },
  { id: 5, username: 'hod_ee', password: 'pass', role: 'dept_hod', department: 'EE', email: 'hod_ee@college.edu' },
  { id: 6, username: 'college_admin', password: 'pass', role: 'college_admin', department: 'College', email: 'college_admin@college.edu' },
];

const DEFAULT_RDATA = [
  {
    r_id: 1,
    title: 'Machine Learning in Healthcare',
    abstract: 'Application of ML algorithms for disease prediction and diagnosis.',
    keywords: 'machine learning, healthcare, diagnosis',
    r_department: 'CS',
    submission_date: '2024-01-15',
    author_id: 1,
    status: 'Approved by College',
    file_path: null
  },
  {
    r_id: 2,
    title: 'Renewable Energy Systems',
    abstract: 'Study of solar and wind energy integration in power grids.',
    keywords: 'renewable energy, solar, wind power',
    r_department: 'EE',
    submission_date: '2024-02-20',
    author_id: 2,
    status: 'Pending HOD',
    file_path: null
  }
];

const DEFAULT_MESSAGES = [
  {
    id: 1,
    senderId: 6,
    senderName: 'college_admin',
    senderRole: 'college_admin',
    content: 'Welcome to ScholarSync! This is the Research Announcements group. All important updates regarding research submissions will be posted here.',
    timestamp: '2024-01-10T09:00:00',
    isAnnouncement: true,
    department: 'College'
  },
  {
    id: 2,
    senderId: 3,
    senderName: 'rc_admin',
    senderRole: 'research_cell_admin',
    content: 'New deadline for research submissions: March 31st. Please ensure all pending proposals are submitted before the cutoff.',
    timestamp: '2024-02-01T14:30:00',
    isAnnouncement: true,
    department: 'RCA'
  },
  {
    id: 3,
    senderId: 4,
    senderName: 'hod_cs',
    senderRole: 'dept_hod',
    content: 'CS Department: We have 3 new research proposals awaiting review. HOD will conduct review meeting this Friday.',
    timestamp: '2024-02-15T10:15:00',
    isAnnouncement: true,
    department: 'CS'
  },
  {
    id: 4,
    senderId: 1,
    senderName: 'researcher1',
    senderRole: 'researcher',
    content: 'Has anyone submitted research on AI ethics recently? Looking for collaborators.',
    timestamp: '2024-02-18T16:45:00',
    isAnnouncement: false,
    department: 'CS'
  },
  {
    id: 5,
    senderId: 6,
    senderName: 'college_admin',
    senderRole: 'college_admin',
    content: 'Important: The college has approved increased funding for research projects. Contact the research cell for more details.',
    timestamp: '2024-02-20T11:00:00',
    isAnnouncement: true,
    department: 'College'
  }
];

export const initializeData = () => {
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
  }
  if (!localStorage.getItem(RDATA_KEY)) {
    localStorage.setItem(RDATA_KEY, JSON.stringify(DEFAULT_RDATA));
  }
  if (!localStorage.getItem(MESSAGES_KEY)) {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(DEFAULT_MESSAGES));
  }
  if (!localStorage.getItem(SETTINGS_KEY)) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
  }
};

export const getSettings = () => {
  const data = localStorage.getItem(SETTINGS_KEY);
  return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
};

export const setSettings = (settings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const getUsers = () => {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const setUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getResearchData = () => {
  const data = localStorage.getItem(RDATA_KEY);
  return data ? JSON.parse(data) : [];
};

export const setResearchData = (rdata) => {
  localStorage.setItem(RDATA_KEY, JSON.stringify(rdata));
};

export const getAuth = () => {
  const data = localStorage.getItem(AUTH_KEY);
  return data ? JSON.parse(data) : null;
};

export const setAuth = (auth) => {
  if (auth) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
  } else {
    localStorage.removeItem(AUTH_KEY);
  }
};

export const exportToJSON = () => {
  const data = {
    users: getUsers(),
    researchData: getResearchData(),
    exportDate: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `scholarsync_backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportToCSV = () => {
  const rdata = getResearchData();
  const users = getUsers();
  
  const rdataCsv = [
    ['ID', 'Title', 'Abstract', 'Keywords', 'Department', 'Submission Date', 'Author ID', 'Status'].join(','),
    ...rdata.map(r => [
      r.r_id, `"${r.title}"`, `"${r.abstract}"`, `"${r.keywords}"`,
      r.r_department, r.submission_date, r.author_id, r.status
    ].join(','))
  ].join('\n');

  const usersCsv = [
    ['ID', 'Username', 'Role', 'Department', 'Email'].join(','),
    ...users.map(u => [u.id, u.username, u.role, u.department, u.email].join(','))
  ].join('\n');

  const combined = `RESEARCH DATA\n${rdataCsv}\n\nUSERS\n${usersCsv}`;
  const blob = new Blob([combined], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `scholarsync_backup_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

export const importFromJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.users) setUsers(data.users);
        if (data.researchData) setResearchData(data.researchData);
        resolve(data);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

export const getNextId = (key) => {
  const data = key === 'users' ? getUsers() : key === 'messages' ? getMessages() : getResearchData();
  return data.length > 0 ? Math.max(...data.map(d => d.id || d.r_id)) + 1 : 1;
};

export const getMessages = () => {
  const data = localStorage.getItem(MESSAGES_KEY);
  return data ? JSON.parse(data) : [];
};

export const setMessages = (messages) => {
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
};
