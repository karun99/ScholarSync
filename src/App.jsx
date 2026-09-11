import { useState, useEffect, createContext, useContext, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, BarChart3, BookOpen, Users, Clock, CheckCircle, XCircle, LogOut, Menu, X, Download, Upload, Plus, Send, Megaphone, Bell, Users as UsersIcon, Pin, MessageSquare, Settings as SettingsIcon, Image, Type, Palette, Mail, Phone, MapPin, Globe, Shield, AlertTriangle, Save, RotateCcw, Database, HardDrive, Cloud, Server, Eye, EyeOff, Info, Workflow, Layers, Code, Lock, Zap, FileText, Award, ArrowRight, ExternalLink, Search, BookMarked, Video, Sparkles, Library, Book, Globe as GlobeIcon, Link2, FileSearch, School, Lightbulb, ArrowUpRight, LogIn, Archive, Edit3, Trash2, PlusCircle, X as XIcon, Check, ChevronDown, ChevronUp, FileCode, FolderOpen, Edit, Calculator, BookUser, GraduationCap as GraduationCapIcon, PenTool, Award as AwardIcon, Presentation, UsersRound, Newspaper, BookOpen as BookOpenIcon, Briefcase, Building2, Hash, Calendar, Star, DollarSign, Building, MessageCircle, Bot, Sparkles as SparklesIcon, Copy, RefreshCw, Settings as SettingsIconAlt, ChevronRight, Loader, UserPlus, CheckSquare, Rocket, User } from 'lucide-react';
import { initializeData, getUsers, setAuth, getAuth, setUsers, getResearchData, setResearchData, getNextId, getMessages, setMessages, getSettings, setSettings, exportToJSON, exportToCSV, importFromJSON } from './utils/storage';
import './App.css';

const AuthContext = createContext(null);
const SettingsContext = createContext(null);

const ROLES = {
  researcher: { label: 'Researcher', color: '#3b82f6' },
  dept_hod: { label: 'Department HOD', color: '#8b5cf6' },
  research_cell_admin: { label: 'Research Cell Admin', color: '#10b981' },
  college_admin: { label: 'College Admin', color: '#f59e0b' }
};

const STATUS_FLOW = ['Pending HOD', 'Pending Research Cell', 'Approved by College'];

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    initializeData();
    const auth = getAuth();
    if (auth) setUser(auth);
  }, []);

  const login = (username, password) => {
    const users = getUsers();
    const found = users.find(u => u.username === username && u.password === password);
    if (found) {
      setAuth(found);
      setUser(found);
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const logout = () => {
    setAuth(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => useContext(AuthContext);
const useSettings = () => useContext(SettingsContext);

function SettingsProvider({ children }) {
  const [settings, setSettingsState] = useState(getSettings());

  const updateSettings = (newSettings) => {
    const updated = { ...settings, ...newSettings };
    setSettingsState(updated);
    setSettings(updated);
  };

  const resetSettings = () => {
    setSettingsState(getSettings());
    setSettings(getSettings());
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function Layout({ children }) {
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/feed', label: 'Announcements', icon: Bell },
    { path: '/research', label: 'Research', icon: BookOpen },
    { path: '/statistics', label: 'Statistics', icon: BarChart3 },
    ...(user?.role === 'researcher' ? [{ path: '/submit', label: 'Submit', icon: Plus }] : []),
    ...(['dept_hod', 'research_cell_admin', 'college_admin'].includes(user?.role) 
      ? [{ path: '/approvals', label: 'Approvals', icon: CheckCircle }] : []),
    ...(['dept_hod', 'research_cell_admin', 'college_admin'].includes(user?.role) 
      ? [{ path: '/reports', label: 'Reports', icon: FileSearch }] : []),
    { path: '/helix-ai', label: 'Helix AI', icon: SparklesIcon },
    { path: '/profile', label: 'Profile', icon: Users },
    ...(user?.role === 'college_admin' ? [{ path: '/settings', label: 'Settings', icon: SettingsIcon }] : []),
  ];

  return (
    <div className="layout">
      {settings.enableAnnouncementBanner && settings.announcementBanner && (
        <div className="announcement-banner">
          <AlertTriangle size={14} />
          <span>{settings.announcementBanner}</span>
        </div>
      )}
      <nav className="navbar">
        <div className="nav-brand" onClick={() => navigate('/dashboard')}>
          {settings.logoUrl ? (
            <img src={settings.logoUrl} alt="Logo" className="nav-logo" />
          ) : (
            <div className="logo-ss-nav">SS</div>
          )}
          <span>{settings.institutionName}</span>
        </div>
        <div className="nav-links desktop">
          {navItems.map(item => (
            <Link key={item.path} to={item.path} className="nav-link">
              <item.icon size={18} />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
        <div className="nav-user">
          <span className="user-role" style={{ backgroundColor: ROLES[user?.role]?.color }}>
            {ROLES[user?.role]?.label}
          </span>
          <button onClick={handleLogout} className="btn-icon">
            <LogOut size={20} />
          </button>
          <button className="btn-icon mobile-menu" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>
      {mobileMenuOpen && (
        <div className="mobile-menu">
          {navItems.map(item => (
            <Link key={item.path} to={item.path} className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      )}
      <main className="main-content">{children}</main>
    </div>
  );
}

function LoginPage() {
  const { login } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(username, password);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
  };

  const roleInfo = [
    { role: 'researcher', label: 'Researcher', desc: 'Submit and track research proposals' },
    { role: 'dept_hod', label: 'Dept HOD', desc: 'Review department submissions' },
    { role: 'research_cell_admin', label: 'Research Cell Admin', desc: 'Manage research workflow' },
    { role: 'college_admin', label: 'College Admin', desc: 'Full access & approvals' },
  ];

  return (
    <div className="login-page">
      <div className="login-bg-gradient"></div>
      <div className="login-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      
      <div className="login-container">
        <div className="login-left">
          <div className="login-brand">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt="Logo" className="login-logo-lg" />
            ) : (
              <div className="brand-icon">
                <span className="logo-ss-large">SS</span>
              </div>
            )}
            <h1>{settings.institutionName}</h1>
            <p className="tagline">{settings.institutionTagline}</p>
          </div>
          
          <div className="stats-preview">
            <div className="stat-preview-item">
              <div className="stat-icon">
                <Users size={20} />
              </div>
              <div>
                <span className="stat-number">100+</span>
                <span className="stat-label">Researchers</span>
              </div>
            </div>
            <div className="stat-preview-item">
              <div className="stat-icon">
                <BookOpen size={20} />
              </div>
              <div>
                <span className="stat-number">500+</span>
                <span className="stat-label">Publications</span>
              </div>
            </div>
            <div className="stat-preview-item">
              <div className="stat-icon">
                <Award size={20} />
              </div>
              <div>
                <span className="stat-number">50+</span>
                <span className="stat-label">Departments</span>
              </div>
            </div>
          </div>

          <div className="feature-list">
            <div className="feature-item">
              <div className="feature-icon">
                <Workflow size={22} />
              </div>
              <div className="feature-item-content">
                <h3>Multi-Level Approvals</h3>
                <p>Streamlined approval workflow from HOD to College Admin</p>
              </div>
              <div className="feature-item-number">1</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <BarChart3 size={22} />
              </div>
              <div className="feature-item-content">
                <h3>Real-time Analytics</h3>
                <p>Track research progress with visual dashboards</p>
              </div>
              <div className="feature-item-number">2</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <Bell size={22} />
              </div>
              <div className="feature-item-content">
                <h3>Instant Notifications</h3>
                <p>WhatsApp-style announcements and updates</p>
              </div>
              <div className="feature-item-number">3</div>
            </div>
          </div>
          
          <div className="login-page-links">
            <Link to="/about" className="page-link">
              <Info size={16} />
              About
            </Link>
            <Link to="/appendix" className="page-link">
              <Library size={16} />
              Appendix
            </Link>
          </div>
        </div>
        
        <div className="login-right">
          <div className="login-card">
            <div className="login-tabs">
              <button 
                className={`login-tab ${activeTab === 'login' ? 'active' : ''}`}
                onClick={() => setActiveTab('login')}
              >
                Sign In
              </button>
              <button 
                className={`login-tab ${activeTab === 'demo' ? 'active' : ''}`}
                onClick={() => setActiveTab('demo')}
              >
                Demo Access
              </button>
            </div>

            {activeTab === 'login' && (
              <>
                <div className="login-header">
                  <h2>Welcome Back</h2>
                  <p>Sign in to your account</p>
                </div>
                <form onSubmit={handleSubmit} className="login-form">
                  {error && <div className="error-message">{error}</div>}
                  <div className="form-group">
                    <label>Username</label>
                    <div className="input-with-icon">
                      <Users size={18} />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <div className="input-with-icon password-input">
                      <Lock size={18} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                      />
                      <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <button type="submit" className="btn-primary btn-full">
                    <LogIn size={18} />
                    Sign In
                  </button>
                </form>
              </>
            )}

            {activeTab === 'demo' && (
              <>
                <div className="login-header">
                  <h2>Quick Demo Access</h2>
                  <p>Click any account to login instantly</p>
                </div>
                <div className="demo-accounts">
                  <div className="demo-grid">
                    {getUsers().map(u => (
                      <button key={u.id} onClick={() => { setUsername(u.username); setPassword('pass'); setActiveTab('login'); }} className="demo-account-btn">
                        <div className="demo-avatar" style={{ backgroundColor: ROLES[u.role]?.color }}>
                          {u.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="demo-info">
                          <span className="demo-name">{u.username}</span>
                          <span className="demo-role">{ROLES[u.role]?.label}</span>
                        </div>
                        <ArrowRight size={16} className="demo-arrow" />
                      </button>
                    ))}
                  </div>
                  <p className="demo-hint">Password for all: <strong>pass</strong></p>
                </div>
              </>
            )}
            
            <div className="role-info-section">
              <p className="role-info-title">Available Roles</p>
              <div className="role-info-cards">
                {roleInfo.map(r => (
                  <div key={r.role} className="role-info-card">
                    <span className="role-badge" style={{ backgroundColor: ROLES[r.role]?.color }}>{r.label}</span>
                    <span className="role-desc">{r.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const { settings } = useSettings();
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0 });
  const [recentData, setRecentData] = useState([]);

  useEffect(() => {
    const rdata = getResearchData();
    
    let filtered = rdata;
    if (user.role === 'dept_hod') {
      filtered = rdata.filter(r => r.r_department === user.department);
    }
    
    setStats({
      total: filtered.length,
      pending: filtered.filter(r => r.status.includes('Pending')).length,
      approved: filtered.filter(r => r.status === 'Approved by College').length
    });
    
    setRecentData(filtered.slice(-5).reverse());
  }, [user]);

  const statCards = [
    { label: 'Total Research', value: stats.total, icon: BookOpen, color: settings.primaryColor },
    { label: 'Pending Review', value: stats.pending, icon: Clock, color: '#f59e0b' },
    { label: 'Approved', value: stats.approved, icon: CheckCircle, color: '#10b981' },
  ];

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Welcome, {user.username}</h1>
        <p>{ROLES[user.role]?.label} | {user.department}</p>
      </div>
      
      {settings.welcomeMessage && (
        <div className="welcome-banner">
          <div className="welcome-content">
            <GraduationCap size={24} />
            <p>{settings.welcomeMessage}</p>
          </div>
        </div>
      )}
      
      <div className="stats-grid">
        {statCards.map((stat, i) => (
          <div key={i} className="stat-card" style={{ borderLeftColor: stat.color }}>
            <stat.icon size={32} style={{ color: stat.color }} />
            <div>
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="section">
        <h2>Recent Submissions</h2>
        {recentData.length === 0 ? (
          <p className="empty-state">No research submissions yet.</p>
        ) : (
          <div className="recent-list">
            {recentData.map(item => (
              <div key={item.r_id} className="recent-item">
                <div className="recent-info">
                  <h4>{item.title}</h4>
                  <p>{item.r_department} | {item.submission_date}</p>
                </div>
                <span className={`status-badge ${item.status.toLowerCase().replace(/\s/g, '-')}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ResearchFeed() {
  const { user } = useAuth();
  const [researchData, setResearchData] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    let data = getResearchData();
    if (user.role === 'dept_hod') {
      data = data.filter(r => r.r_department === user.department);
    }
    if (filter !== 'all') {
      data = data.filter(r => r.status === filter);
    }
    setResearchData(data);
  }, [user, filter]);

  return (
    <div className="research-feed">
      <div className="page-header">
        <h1>Research Feed</h1>
        <div className="filters">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Status</option>
            {STATUS_FLOW.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      
      <div className="research-grid">
        {researchData.map(item => (
          <div key={item.r_id} className="research-card">
            <div className="card-header">
              <span className="dept-tag">{item.r_department}</span>
              <span className={`status-badge ${item.status.toLowerCase().replace(/\s/g, '-')}`}>
                {item.status}
              </span>
            </div>
            <h3>{item.title}</h3>
            <p className="abstract">{item.abstract}</p>
            <div className="keywords">
              {item.keywords.split(',').map((kw, i) => (
                <span key={i} className="keyword-tag">{kw.trim()}</span>
              ))}
            </div>
            <div className="card-footer">
              <span>Author ID: {item.author_id}</span>
              <span>{item.submission_date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Feed() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showNewPost, setShowNewPost] = useState(false);
  const [postType, setPostType] = useState('message');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMessages(getMessages());
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const formatFullDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: getNextId('messages'),
      senderId: user.id,
      senderName: user.username,
      senderRole: user.role,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      isAnnouncement: postType === 'announcement',
      department: user.department
    };

    const updated = [...messages, message];
    setMessages(updated);
    setMessages(updated);
    localStorage.setItem('scholarsync_messages', JSON.stringify(updated));
    setNewMessage('');
    setShowNewPost(false);
  };

  const filteredMessages = messages.filter(m => {
    if (activeTab === 'announcements') return m.isAnnouncement;
    if (activeTab === 'department') return m.department === user.department;
    if (activeTab === 'all') {
      return m.isAnnouncement || m.department === user.department || user.role === 'college_admin' || user.role === 'research_cell_admin';
    }
    return true;
  }).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  const pinnedAnnouncements = messages.filter(m => m.isAnnouncement).slice(-2);

  return (
    <div className="feed-page">
      <div className="feed-container">
        <div className="feed-header">
          <div className="feed-header-info">
            <div className="feed-avatar">
              <GraduationCap size={24} />
            </div>
            <div>
              <h1>Research Announcements</h1>
              <p>College Research Cell Group</p>
            </div>
          </div>
          <div className="feed-header-actions">
            <button className="feed-action-btn" onClick={() => setShowNewPost(!showNewPost)}>
              <Megaphone size={20} />
              {(user.role === 'college_admin' || user.role === 'research_cell_admin') && (
                <span className="admin-badge">Admin</span>
              )}
            </button>
          </div>
        </div>

        {pinnedAnnouncements.length > 0 && (
          <div className="pinned-section">
            <div className="pinned-header">
              <Pin size={14} />
              <span>Pinned</span>
            </div>
            {pinnedAnnouncements.map(msg => (
              <div key={msg.id} className="pinned-item">
                <div className="pinned-content">
                  <Megaphone size={14} className="pinned-icon" />
                  <span>{msg.content.substring(0, 80)}...</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {showNewPost && (
          <div className="new-post-card">
            <div className="new-post-header">
              <div className="user-avatar-small" style={{ backgroundColor: ROLES[user.role]?.color }}>
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="new-post-user">
                <span className="new-post-name">{user.username}</span>
                <span className="new-post-role" style={{ backgroundColor: ROLES[user.role]?.color }}>
                  {ROLES[user.role]?.label}
                </span>
              </div>
            </div>
            <form onSubmit={handleSendMessage}>
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message or announcement..."
                rows={3}
                autoFocus
              />
              <div className="new-post-footer">
                <div className="post-type-select">
                  {(user.role === 'college_admin' || user.role === 'research_cell_admin' || user.role === 'dept_hod') && (
                    <>
                      <button
                        type="button"
                        className={`type-btn ${postType === 'message' ? 'active' : ''}`}
                        onClick={() => setPostType('message')}
                      >
                        <MessageSquare size={16} />
                        Message
                      </button>
                      <button
                        type="button"
                        className={`type-btn ${postType === 'announcement' ? 'active announcement' : ''}`}
                        onClick={() => setPostType('announcement')}
                      >
                        <Megaphone size={16} />
                        Announcement
                      </button>
                    </>
                  )}
                </div>
                <div className="post-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowNewPost(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-send" disabled={!newMessage.trim()}>
                    <Send size={16} />
                    Post
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        <div className="feed-tabs">
          <button 
            className={`feed-tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <UsersIcon size={16} />
            All
          </button>
          <button 
            className={`feed-tab ${activeTab === 'announcements' ? 'active' : ''}`}
            onClick={() => setActiveTab('announcements')}
          >
            <Megaphone size={16} />
            Announcements
          </button>
          <button 
            className={`feed-tab ${activeTab === 'department' ? 'active' : ''}`}
            onClick={() => setActiveTab('department')}
          >
            <Users size={16} />
            My Dept
          </button>
        </div>

        <div className="messages-list">
          {filteredMessages.length === 0 ? (
            <div className="empty-messages">
              <MessageSquare size={48} />
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            filteredMessages.map((msg, index) => {
              const prevMsg = filteredMessages[index - 1];
              const showDateDivider = !prevMsg || 
                new Date(msg.timestamp).toDateString() !== new Date(prevMsg.timestamp).toDateString();
              
              const isOwn = msg.senderId === user.id;
              const isAdmin = msg.senderRole === 'college_admin' || msg.senderRole === 'research_cell_admin' || msg.senderRole === 'dept_hod';
              
              return (
                <div key={msg.id}>
                  {showDateDivider && (
                    <div className="date-divider">
                      <span>{new Date(msg.timestamp).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'short', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                  )}
                  <div className={`message ${isOwn ? 'own' : ''} ${msg.isAnnouncement ? 'announcement' : ''}`}>
                    {!isOwn && (
                      <div className="message-avatar" style={{ backgroundColor: ROLES[msg.senderRole]?.color }}>
                        {msg.senderName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="message-content">
                      {!isOwn && (
                        <div className="message-header">
                          <span className="message-sender">{msg.senderName}</span>
                          <span className="message-role" style={{ backgroundColor: ROLES[msg.senderRole]?.color }}>
                            {ROLES[msg.senderRole]?.label}
                          </span>
                          {msg.isAnnouncement && (
                            <span className="announcement-badge">
                              <Megaphone size={12} />
                              Announcement
                            </span>
                          )}
                        </div>
                      )}
                      <div className={`message-bubble ${msg.isAnnouncement ? 'announcement-bubble' : ''}`}>
                        <p>{msg.content}</p>
                      </div>
                      <div className="message-meta">
                        <span className="message-time">{formatFullDate(msg.timestamp)}</span>
                        {isOwn && (
                          <span className="message-status">
                            <CheckCircle size={14} />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="message-input-container" onSubmit={handleSendMessage}>
          <div className="message-input-wrapper">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <button type="submit" className="send-btn" disabled={!newMessage.trim()}>
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SubmitResearch() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    keywords: '',
    r_department: user?.department || '',
    publicationType: 'journal-article',
    authorshipPosition: 'first-author',
    totalAuthors: 1,
    language: 'en',
    translations: {}
  });
  const [showTranslations, setShowTranslations] = useState(false);
  const [selectedTranslationLang, setSelectedTranslationLang] = useState('');
  const [translationForm, setTranslationForm] = useState({
    title: '',
    abstract: '',
    keywords: ''
  });
  const [translationLanguages, setTranslationLanguages] = useState([]);

  const LANGUAGES = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
    { code: 'mr', name: 'Marathi', native: 'मराठी' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
    { code: 'es', name: 'Spanish', native: 'Español' },
    { code: 'fr', name: 'French', native: 'Français' },
    { code: 'de', name: 'German', native: 'Deutsch' },
    { code: 'zh', name: 'Chinese', native: '中文' },
    { code: 'ja', name: 'Japanese', native: '日本語' },
    { code: 'ko', name: 'Korean', native: '한국어' },
    { code: 'ar', name: 'Arabic', native: 'العربية' },
    { code: 'pt', name: 'Portuguese', native: 'Português' },
    { code: 'ru', name: 'Russian', native: 'Русский' },
  ];

  const availableTranslationLangs = LANGUAGES.filter(l => 
    l.code !== formData.language && !translationLanguages.includes(l.code)
  );

  const addTranslationLanguage = (code) => {
    if (code && !translationLanguages.includes(code)) {
      setTranslationLanguages([...translationLanguages, code]);
      setSelectedTranslationLang('');
    }
  };

  const removeTranslationLanguage = (code) => {
    setTranslationLanguages(translationLanguages.filter(l => l !== code));
    const newTranslations = { ...formData.translations };
    delete newTranslations[code];
    setFormData({ ...formData, translations: newTranslations });
  };

  const updateTranslation = (langCode, field, value) => {
    setFormData({
      ...formData,
      translations: {
        ...formData.translations,
        [langCode]: {
          ...formData.translations[langCode],
          [field]: value
        }
      }
    });
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateApiScore = () => {
    const { publicationType, authorshipPosition, totalAuthors } = formData;
    
    const authorshipMultiplier = {
      'first-author': 1.0,
      'corresponding-author': 1.0,
      'second-author': 0.5,
      'co-author': 0.3,
      'other': 0.2
    };

    const publicationScores = {
      'journal-article': 25,
      'conference-paper': 15,
      'book': 30,
      'book-chapter': 15,
      'review-article': 20,
      'short-communication': 10,
      'case-study': 10,
      'patent': 40,
      'mphil-thesis': 25,
      'phd-thesis': 50
    };

    let baseScore = publicationScores[publicationType] || 10;
    const multiplier = authorshipMultiplier[authorshipPosition] || 0.5;
    
    let totalScore = Math.round(baseScore * multiplier);
    
    if (totalAuthors > 1) {
      totalScore = Math.round(totalScore / Math.sqrt(totalAuthors));
    }
    
    return totalScore;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const rdata = getResearchData();
    const apiScore = calculateApiScore();
    
    const newEntry = {
      r_id: getNextId('rdata'),
      ...formData,
      submission_date: new Date().toISOString().split('T')[0],
      author_id: user.id,
      author_name: user.username,
      status: 'Pending HOD',
      file_path: null,
      apiScore: apiScore,
      apiBreakdown: {
        publicationType: formData.publicationType,
        authorshipPosition: formData.authorshipPosition,
        totalAuthors: formData.totalAuthors,
        calculatedScore: apiScore
      }
    };
    setResearchData([...rdata, newEntry]);
    navigate('/research');
  };

  const previewScore = calculateApiScore();

  const renderDynamicFields = () => {
    const { publicationType } = formData;

    switch (publicationType) {
      case 'journal-article':
      case 'review-article':
        return (
          <div className="dynamic-fields">
            <div className="form-row three-col">
              <div className="form-group">
                <label><Book size={16} /> Journal Name</label>
                <input
                  type="text"
                  value={formData.journalName || ''}
                  onChange={(e) => updateField('journalName', e.target.value)}
                  placeholder="Enter journal name"
                  required
                />
              </div>
              <div className="form-group">
                <label><Hash size={16} /> Volume</label>
                <input
                  type="text"
                  value={formData.volume || ''}
                  onChange={(e) => updateField('volume', e.target.value)}
                  placeholder="e.g., 12"
                />
              </div>
              <div className="form-group">
                <label><FileText size={16} /> Issue</label>
                <input
                  type="text"
                  value={formData.issue || ''}
                  onChange={(e) => updateField('issue', e.target.value)}
                  placeholder="e.g., 3"
                />
              </div>
            </div>
            <div className="form-row three-col">
              <div className="form-group">
                <label><Pages size={16} /> Pages</label>
                <input
                  type="text"
                  value={formData.pages || ''}
                  onChange={(e) => updateField('pages', e.target.value)}
                  placeholder="e.g., 101-115"
                />
              </div>
              <div className="form-group">
                <label><Globe size={16} /> DOI</label>
                <input
                  type="text"
                  value={formData.doi || ''}
                  onChange={(e) => updateField('doi', e.target.value)}
                  placeholder="10.xxxx/xxxxx"
                />
              </div>
              <div className="form-group">
                <label><Hash size={16} /> ISSN</label>
                <input
                  type="text"
                  value={formData.issn || ''}
                  onChange={(e) => updateField('issn', e.target.value)}
                  placeholder="e.g., 1234-5678"
                />
              </div>
            </div>
            <div className="form-row two-col">
              <div className="form-group">
                <label><Calendar size={16} /> Publication Date</label>
                <input
                  type="date"
                  value={formData.publicationDate || ''}
                  onChange={(e) => updateField('publicationDate', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label><Star size={16} /> Impact Factor</label>
                <select
                  value={formData.impactFactor || 'low'}
                  onChange={(e) => updateField('impactFactor', e.target.value)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="sci">SCI Indexed</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'conference-paper':
        return (
          <div className="dynamic-fields">
            <div className="form-row two-col">
              <div className="form-group">
                <label><Users size={16} /> Conference Name</label>
                <input
                  type="text"
                  value={formData.conferenceName || ''}
                  onChange={(e) => updateField('conferenceName', e.target.value)}
                  placeholder="Enter conference name"
                  required
                />
              </div>
              <div className="form-group">
                <label><MapPin size={16} /> Conference Location</label>
                <input
                  type="text"
                  value={formData.conferenceLocation || ''}
                  onChange={(e) => updateField('conferenceLocation', e.target.value)}
                  placeholder="City, Country"
                />
              </div>
            </div>
            <div className="form-row three-col">
              <div className="form-group">
                <label><Calendar size={16} /> Conference Date</label>
                <input
                  type="date"
                  value={formData.conferenceDate || ''}
                  onChange={(e) => updateField('conferenceDate', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label><Globe size={16} /> DOI</label>
                <input
                  type="text"
                  value={formData.doi || ''}
                  onChange={(e) => updateField('doi', e.target.value)}
                  placeholder="10.xxxx/xxxxx"
                />
              </div>
              <div className="form-group">
                <label><FileText size={16} /> ISBN</label>
                <input
                  type="text"
                  value={formData.isbn || ''}
                  onChange={(e) => updateField('isbn', e.target.value)}
                  placeholder="978-x-xxx-xxxxx-x"
                />
              </div>
            </div>
            <div className="form-row two-col">
              <div className="form-group">
                <label><Award size={16} /> Publisher</label>
                <input
                  type="text"
                  value={formData.publisher || ''}
                  onChange={(e) => updateField('publisher', e.target.value)}
                  placeholder="Publisher name"
                />
              </div>
              <div className="form-group">
                <label><Star size={16} /> Indexed In</label>
                <input
                  type="text"
                  value={formData.indexedIn || ''}
                  onChange={(e) => updateField('indexedIn', e.target.value)}
                  placeholder="e.g., Scopus, IEEE Xplore"
                />
              </div>
            </div>
          </div>
        );

      case 'book':
        return (
          <div className="dynamic-fields">
            <div className="form-row two-col">
              <div className="form-group">
                <label><Building2 size={16} /> Publisher</label>
                <input
                  type="text"
                  value={formData.publisher || ''}
                  onChange={(e) => updateField('publisher', e.target.value)}
                  placeholder="Publisher name"
                  required
                />
              </div>
              <div className="form-group">
                <label><MapPin size={16} /> Publication City</label>
                <input
                  type="text"
                  value={formData.publicationCity || ''}
                  onChange={(e) => updateField('publicationCity', e.target.value)}
                  placeholder="City, Country"
                />
              </div>
            </div>
            <div className="form-row three-col">
              <div className="form-group">
                <label><Calendar size={16} /> Publication Date</label>
                <input
                  type="date"
                  value={formData.publicationDate || ''}
                  onChange={(e) => updateField('publicationDate', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label><FileText size={16} /> ISBN</label>
                <input
                  type="text"
                  value={formData.isbn || ''}
                  onChange={(e) => updateField('isbn', e.target.value)}
                  placeholder="978-x-xxx-xxxxx-x"
                  required
                />
              </div>
              <div className="form-group">
                <label><Pages size={16} /> Pages</label>
                <input
                  type="text"
                  value={formData.totalPages || ''}
                  onChange={(e) => updateField('totalPages', e.target.value)}
                  placeholder="e.g., 350"
                />
              </div>
            </div>
            <div className="form-row two-col">
              <div className="form-group">
                <label><DollarSign size={16} /> Edition</label>
                <input
                  type="text"
                  value={formData.edition || ''}
                  onChange={(e) => updateField('edition', e.target.value)}
                  placeholder="e.g., 1st, 2nd"
                />
              </div>
              <div className="form-group">
                <label><Globe size={16} /> DOI (if available)</label>
                <input
                  type="text"
                  value={formData.doi || ''}
                  onChange={(e) => updateField('doi', e.target.value)}
                  placeholder="10.xxxx/xxxxx"
                />
              </div>
            </div>
          </div>
        );

      case 'book-chapter':
        return (
          <div className="dynamic-fields">
            <div className="form-group">
              <label><Book size={16} /> Book Title</label>
              <input
                type="text"
                value={formData.bookTitle || ''}
                onChange={(e) => updateField('bookTitle', e.target.value)}
                placeholder="Enter the book title"
                required
              />
            </div>
            <div className="form-row two-col">
              <div className="form-group">
                <label><Users size={16} /> Editors</label>
                <input
                  type="text"
                  value={formData.bookEditors || ''}
                  onChange={(e) => updateField('bookEditors', e.target.value)}
                  placeholder="Editor names"
                />
              </div>
              <div className="form-group">
                <label><Building2 size={16} /> Publisher</label>
                <input
                  type="text"
                  value={formData.publisher || ''}
                  onChange={(e) => updateField('publisher', e.target.value)}
                  placeholder="Publisher name"
                  required
                />
              </div>
            </div>
            <div className="form-row three-col">
              <div className="form-group">
                <label><FileText size={16} /> Chapter Number</label>
                <input
                  type="text"
                  value={formData.chapterNumber || ''}
                  onChange={(e) => updateField('chapterNumber', e.target.value)}
                  placeholder="e.g., Chapter 5"
                />
              </div>
              <div className="form-group">
                <label><Pages size={16} /> Pages</label>
                <input
                  type="text"
                  value={formData.pages || ''}
                  onChange={(e) => updateField('pages', e.target.value)}
                  placeholder="e.g., 101-130"
                />
              </div>
              <div className="form-group">
                <label><FileText size={16} /> ISBN</label>
                <input
                  type="text"
                  value={formData.isbn || ''}
                  onChange={(e) => updateField('isbn', e.target.value)}
                  placeholder="978-x-xxx-xxxxx-x"
                />
              </div>
            </div>
            <div className="form-row two-col">
              <div className="form-group">
                <label><Calendar size={16} /> Publication Date</label>
                <input
                  type="date"
                  value={formData.publicationDate || ''}
                  onChange={(e) => updateField('publicationDate', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label><Globe size={16} /> DOI (if available)</label>
                <input
                  type="text"
                  value={formData.doi || ''}
                  onChange={(e) => updateField('doi', e.target.value)}
                  placeholder="10.xxxx/xxxxx"
                />
              </div>
            </div>
          </div>
        );

      case 'patent':
        return (
          <div className="dynamic-fields">
            <div className="form-row two-col">
              <div className="form-group">
                <label><Shield size={16} /> Patent Number</label>
                <input
                  type="text"
                  value={formData.patentNumber || ''}
                  onChange={(e) => updateField('patentNumber', e.target.value)}
                  placeholder="e.g., US1234567"
                  required
                />
              </div>
              <div className="form-group">
                <label><Globe size={16} /> Patent Office</label>
                <select
                  value={formData.patentOffice || 'india'}
                  onChange={(e) => updateField('patentOffice', e.target.value)}
                >
                  <option value="india">India (IPO)</option>
                  <option value="us">United States (USPTO)</option>
                  <option value="europe">European (EPO)</option>
                  <option value="wipo">WIPO</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="form-row three-col">
              <div className="form-group">
                <label><Calendar size={16} /> Filing Date</label>
                <input
                  type="date"
                  value={formData.filingDate || ''}
                  onChange={(e) => updateField('filingDate', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label><CheckCircle size={16} /> Grant Date</label>
                <input
                  type="date"
                  value={formData.grantDate || ''}
                  onChange={(e) => updateField('grantDate', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label><Award size={16} /> Status</label>
                <select
                  value={formData.patentStatus || 'granted'}
                  onChange={(e) => updateField('patentStatus', e.target.value)}
                >
                  <option value="granted">Granted</option>
                  <option value="pending">Pending</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label><Link2 size={16} /> Patent URL</label>
              <input
                type="text"
                value={formData.patentUrl || ''}
                onChange={(e) => updateField('patentUrl', e.target.value)}
                placeholder="Link to patent database"
              />
            </div>
          </div>
        );

      case 'mphil-thesis':
      case 'phd-thesis':
        return (
          <div className="dynamic-fields">
            <div className="form-group">
              <label><School size={16} /> University</label>
              <input
                type="text"
                value={formData.university || ''}
                onChange={(e) => updateField('university', e.target.value)}
                placeholder="University name"
                required
              />
            </div>
            <div className="form-row two-col">
              <div className="form-group">
                <label><Award size={16} /> Supervisor</label>
                <input
                  type="text"
                  value={formData.supervisor || ''}
                  onChange={(e) => updateField('supervisor', e.target.value)}
                  placeholder="Supervisor name"
                />
              </div>
              <div className="form-group">
                <label><MapPin size={16} /> Department</label>
                <input
                  type="text"
                  value={formData.thesisDepartment || ''}
                  onChange={(e) => updateField('thesisDepartment', e.target.value)}
                  placeholder="Department name"
                />
              </div>
            </div>
            <div className="form-row two-col">
              <div className="form-group">
                <label><Calendar size={16} /> Submission Date</label>
                <input
                  type="date"
                  value={formData.thesisDate || ''}
                  onChange={(e) => updateField('thesisDate', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label><CheckCircle size={16} /> Status</label>
                <select
                  value={formData.thesisStatus || 'submitted'}
                  onChange={(e) => updateField('thesisStatus', e.target.value)}
                >
                  <option value="submitted">Submitted</option>
                  <option value="awarded">Awarded</option>
                  <option value="ongoing">Ongoing</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label><Link2 size={16} /> Thesis URL (if available)</label>
              <input
                type="text"
                value={formData.thesisUrl || ''}
                onChange={(e) => updateField('thesisUrl', e.target.value)}
                placeholder="Link to repository"
              />
            </div>
          </div>
        );

      case 'short-communication':
      case 'case-study':
        return (
          <div className="dynamic-fields">
            <div className="form-row two-col">
              <div className="form-group">
                <label><Book size={16} /> Journal Name</label>
                <input
                  type="text"
                  value={formData.journalName || ''}
                  onChange={(e) => updateField('journalName', e.target.value)}
                  placeholder="Enter journal name"
                  required
                />
              </div>
              <div className="form-group">
                <label><Globe size={16} /> DOI</label>
                <input
                  type="text"
                  value={formData.doi || ''}
                  onChange={(e) => updateField('doi', e.target.value)}
                  placeholder="10.xxxx/xxxxx"
                />
              </div>
            </div>
            <div className="form-row three-col">
              <div className="form-group">
                <label><Pages size={16} /> Volume</label>
                <input
                  type="text"
                  value={formData.volume || ''}
                  onChange={(e) => updateField('volume', e.target.value)}
                  placeholder="e.g., 12"
                />
              </div>
              <div className="form-group">
                <label><FileText size={16} /> Issue</label>
                <input
                  type="text"
                  value={formData.issue || ''}
                  onChange={(e) => updateField('issue', e.target.value)}
                  placeholder="e.g., 3"
                />
              </div>
              <div className="form-group">
                <label><Hash size={16} /> Pages</label>
                <input
                  type="text"
                  value={formData.pages || ''}
                  onChange={(e) => updateField('pages', e.target.value)}
                  placeholder="e.g., 45-50"
                />
              </div>
            </div>
            <div className="form-group">
              <label><Calendar size={16} /> Publication Date</label>
              <input
                type="date"
                value={formData.publicationDate || ''}
                onChange={(e) => updateField('publicationDate', e.target.value)}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="submit-research">
      <div className="page-header">
        <h1>Submit Research</h1>
        <p>Submit your research publication and calculate API score automatically</p>
      </div>
      <form onSubmit={handleSubmit} className="research-form">
        <div className="api-score-preview">
          <Calculator size={24} />
          <div>
            <span className="preview-label">Estimated API Score</span>
            <span className="preview-score">{previewScore}</span>
          </div>
        </div>

        <div className="form-group">
          <label><FileText size={16} /> Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => updateField('title', e.target.value)}
            required
          />
        </div>

        <div className="form-row two-col">
          <div className="form-group">
            <label><Globe size={16} /> Primary Language</label>
            <select
              value={formData.language}
              onChange={(e) => updateField('language', e.target.value)}
              required
            >
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.name} ({lang.native})
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label><BookOpen size={16} /> Publication Type</label>
            <select
              value={formData.publicationType}
              onChange={(e) => updateField('publicationType', e.target.value)}
              required
            >
              <option value="journal-article">Journal Article</option>
              <option value="conference-paper">Conference Paper</option>
              <option value="book">Book</option>
              <option value="book-chapter">Book Chapter</option>
              <option value="review-article">Review Article</option>
              <option value="short-communication">Short Communication</option>
              <option value="case-study">Case Study</option>
              <option value="patent">Patent</option>
              <option value="mphil-thesis">M.Phil Thesis</option>
              <option value="phd-thesis">Ph.D Thesis</option>
            </select>
          </div>
        </div>

        <div className="form-row three-col">
          <div className="form-group">
            <label><Users size={16} /> Authorship Position</label>
            <select
              value={formData.authorshipPosition}
              onChange={(e) => updateField('authorshipPosition', e.target.value)}
              required
            >
              <option value="first-author">First Author</option>
              <option value="corresponding-author">Corresponding Author</option>
              <option value="second-author">Second Author</option>
              <option value="co-author">Co-Author</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="form-group">
            <label><Users size={16} /> Total Authors</label>
            <input
              type="number"
              min="1"
              value={formData.totalAuthors}
              onChange={(e) => updateField('totalAuthors', Math.max(1, parseInt(e.target.value) || 1))}
              required
            />
          </div>
        </div>

        {renderDynamicFields()}

        <div className="form-group">
          <label><FileText size={16} /> Abstract</label>
          <textarea
            value={formData.abstract}
            onChange={(e) => updateField('abstract', e.target.value)}
            rows={5}
            required
          />
        </div>
        
        <div className="form-group">
          <label><Search size={16} /> Keywords (comma-separated)</label>
          <input
            type="text"
            value={formData.keywords}
            onChange={(e) => updateField('keywords', e.target.value)}
            placeholder="AI, Machine Learning, Data Science"
            required
          />
        </div>
        
        <div className="form-group">
          <label><Building size={16} /> Department</label>
          <select
            value={formData.r_department}
            onChange={(e) => setFormData({...formData, r_department: e.target.value})}
            required
          >
            <option value="">Select Department</option>
            <option value="CS">Computer Science</option>
            <option value="EE">Electrical Engineering</option>
            <option value="ME">Mechanical Engineering</option>
            <option value="CE">Civil Engineering</option>
          </select>
        </div>

        <div className="translations-section">
          <div className="translations-header">
            <button 
              type="button" 
              className="btn-secondary translation-toggle"
              onClick={() => setShowTranslations(!showTranslations)}
            >
              <Globe size={16} />
              {showTranslations ? 'Hide Translations' : 'Add Translations'}
              {translationLanguages.length > 0 && (
                <span className="translation-count">{translationLanguages.length}</span>
              )}
            </button>
          </div>

          {showTranslations && (
            <div className="translations-content">
              <p className="translations-info">
                Add translations of your research title, abstract, and keywords in other languages.
              </p>
              
              <div className="add-language-controls">
                <select
                  value={selectedTranslationLang}
                  onChange={(e) => setSelectedTranslationLang(e.target.value)}
                  className="language-select"
                >
                  <option value="">Select a language to add...</option>
                  {availableTranslationLangs.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name} ({lang.native})
                    </option>
                  ))}
                </select>
                <button 
                  type="button" 
                  className="btn-primary btn-sm"
                  onClick={() => addTranslationLanguage(selectedTranslationLang)}
                  disabled={!selectedTranslationLang}
                >
                  <Plus size={14} /> Add Language
                </button>
              </div>

              {translationLanguages.length > 0 && (
                <div className="translation-tabs">
                  {translationLanguages.map(langCode => {
                    const lang = LANGUAGES.find(l => l.code === langCode);
                    const trans = formData.translations[langCode] || {};
                    return (
                      <div key={langCode} className="translation-lang-panel">
                        <div className="lang-header">
                          <span className="lang-name">
                            <Globe size={14} />
                            {lang?.name} ({lang?.native})
                          </span>
                          <button 
                            type="button" 
                            className="btn-icon btn-danger btn-sm"
                            onClick={() => removeTranslationLanguage(langCode)}
                          >
                            <X size={14} />
                          </button>
                        </div>
                        <div className="form-group">
                          <label>Title ({lang?.name})</label>
                          <input
                            type="text"
                            value={trans.title || ''}
                            onChange={(e) => updateTranslation(langCode, 'title', e.target.value)}
                            placeholder={`Title in ${lang?.name}`}
                          />
                        </div>
                        <div className="form-group">
                          <label>Abstract ({lang?.name})</label>
                          <textarea
                            value={trans.abstract || ''}
                            onChange={(e) => updateTranslation(langCode, 'abstract', e.target.value)}
                            rows={4}
                            placeholder={`Abstract in ${lang?.name}`}
                          />
                        </div>
                        <div className="form-group">
                          <label>Keywords ({lang?.name})</label>
                          <input
                            type="text"
                            value={trans.keywords || ''}
                            onChange={(e) => updateTranslation(langCode, 'keywords', e.target.value)}
                            placeholder={`Keywords in ${lang?.name}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {translationLanguages.length === 0 && (
                <p className="no-translations">No translations added yet. Select a language above to add translations.</p>
              )}
            </div>
          )}
        </div>
        
        <button type="submit" className="btn-primary">
          <Calculator size={18} />
          Submit Research (API Score: {previewScore})
        </button>
      </form>
    </div>
  );
}

function Approvals() {
  const { user } = useAuth();
  const [pendingData, setPendingData] = useState([]);

  useEffect(() => {
    const rdata = getResearchData();
    let filtered = rdata.filter(r => r.status.includes('Pending'));
    
    if (user.role === 'dept_hod') {
      filtered = filtered.filter(r => r.r_department === user.department);
    }
    
    setPendingData(filtered);
  }, [user]);

  const handleAction = (id, action) => {
    const rdata = getResearchData();
    let newStatus = '';
    
    if (action === 'approve') {
      if (user.role === 'dept_hod') newStatus = 'Pending Research Cell';
      else if (user.role === 'research_cell_admin') newStatus = 'Pending College';
      else if (user.role === 'college_admin') newStatus = 'Approved by College';
    } else {
      newStatus = 'Rejected';
    }
    
    const updated = rdata.map(r => r.r_id === id ? {...r, status: newStatus} : r);
    setResearchData(updated);
    setPendingData(updated.filter(r => r.status.includes('Pending')));
  };

  return (
    <div className="approvals">
      <div className="page-header">
        <h1>Pending Approvals</h1>
        <p>Review and approve research submissions</p>
      </div>
      
      {pendingData.length === 0 ? (
        <div className="empty-state">
          <CheckCircle size={48} />
          <p>No pending approvals</p>
        </div>
      ) : (
        <div className="approval-list">
          {pendingData.map(item => (
            <div key={item.r_id} className="approval-card">
              <div className="approval-info">
                <h3>{item.title}</h3>
                <p className="abstract">{item.abstract}</p>
                <div className="meta">
                  <span>{item.r_department}</span>
                  <span>{item.submission_date}</span>
                  <span>Author: {item.author_id}</span>
                </div>
              </div>
              <div className="approval-actions">
                <button onClick={() => handleAction(item.r_id, 'approve')} className="btn-success">
                  <CheckCircle size={16} /> Approve
                </button>
                <button onClick={() => handleAction(item.r_id, 'reject')} className="btn-danger">
                  <XCircle size={16} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Statistics() {
  const [stats, setStats] = useState({ byDept: [], byStatus: [], total: 0 });

  useEffect(() => {
    const rdata = getResearchData();
    
    const byDept = {};
    const byStatus = {};
    
    rdata.forEach(r => {
      byDept[r.r_department] = (byDept[r.r_department] || 0) + 1;
      byStatus[r.status] = (byStatus[r.status] || 0) + 1;
    });
    
    setStats({
      total: rdata.length,
      byDept: Object.entries(byDept).map(([dept, count]) => ({ dept, count })),
      byStatus: Object.entries(byStatus).map(([status, count]) => ({ status, count }))
    });
  }, []);

  const maxCount = Math.max(...stats.byDept.map(d => d.count), 1);

  return (
    <div className="statistics">
      <div className="page-header">
        <h1>Statistics</h1>
      </div>
      
      <div className="stats-overview">
        <div className="overview-card">
          <h3>Total Research</h3>
          <p className="big-number">{stats.total}</p>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-card">
          <h3>By Department</h3>
          <div className="bar-chart">
            {stats.byDept.map(item => (
              <div key={item.dept} className="bar-row">
                <span className="bar-label">{item.dept}</span>
                <div className="bar-container">
                  <div className="bar" style={{ width: `${(item.count / maxCount) * 100}%` }}></div>
                </div>
                <span className="bar-value">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <h3>By Status</h3>
          <div className="status-chart">
            {stats.byStatus.map(item => (
              <div key={item.status} className="status-row">
                <span className={`status-badge ${item.status.toLowerCase().replace(/\s/g, '-')}`}>
                  {item.status}
                </span>
                <span className="count">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Reports() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [activeTab, setActiveTab] = useState('department');
  const [reportData, setReportData] = useState({
    departmentStats: [],
    facultyStats: [],
    topResearchers: [],
    activityStats: { submissions: 0, approvals: 0, rejections: 0 }
  });

  const calculateApiScore = (research) => {
    const baseScores = {
      'journal-article': 25, 'conference-paper': 15, 'book': 30,
      'book-chapter': 15, 'patent': 40, 'review': 20, 'thesis': 10
    };
    const multipliers = { 'first-author': 1.0, 'second-author': 0.5, 'co-author': 0.3 };
    const base = baseScores[research.publicationType] || 10;
    const mult = multipliers[research.authorshipPosition] || 0.3;
    const authors = research.totalAuthors || 1;
    return Math.round((base * mult / Math.sqrt(authors)) * 100) / 100;
  };

  useEffect(() => {
    const rdata = getResearchData();
    const users = getUsers();

    const filteredByDate = rdata.filter(r => {
      const date = new Date(r.submission_date);
      return date.getFullYear() === parseInt(year) && (month === 0 || date.getMonth() + 1 === parseInt(month));
    });

    const deptStats = {};
    const facultyStats = {};
    const researcherScores = {};

    filteredByDate.forEach(r => {
      deptStats[r.r_department] = (deptStats[r.r_department] || 0) + 1;
      
      const authorName = users.find(u => u.id === r.author_id)?.fullName || r.author_id;
      facultyStats[authorName] = (facultyStats[authorName] || 0) + 1;
      
      if (!researcherScores[r.author_id]) {
        researcherScores[r.author_id] = { name: authorName, department: r.r_department, score: 0 };
      }
      researcherScores[r.author_id].score += calculateApiScore(r);
    });

    const totalResearch = rdata.filter(r => {
      const date = new Date(r.submission_date);
      return date.getFullYear() === parseInt(year) && (month === 0 || date.getMonth() + 1 === parseInt(month));
    });

    const allTimeStats = rdata.reduce((acc, r) => {
      const date = new Date(r.submission_date);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      acc[key] = (acc[key] || { submissions: 0, approvals: 0, rejections: 0 });
      acc[key].submissions++;
      if (r.status === 'Approved by College') acc[key].approvals++;
      if (r.status === 'Rejected') acc[key].rejections++;
      return acc;
    }, {});

    const currentKey = `${year}-${month === 0 ? '*' : month}`;

    setReportData({
      departmentStats: Object.entries(deptStats).map(([dept, count]) => ({ dept, count })).sort((a, b) => b.count - a.count),
      facultyStats: Object.entries(facultyStats).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
      topResearchers: Object.values(researcherScores).sort((a, b) => b.score - a.score).slice(0, 10),
      activityStats: {
        submissions: filteredByDate.length,
        approvals: filteredByDate.filter(r => r.status === 'Approved by College').length,
        rejections: filteredByDate.filter(r => r.status === 'Rejected').length
      }
    });
  }, [year, month]);

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
  const months = [
    { value: 0, label: 'All Months' },
    { value: 1, label: 'January' }, { value: 2, label: 'February' }, { value: 3, label: 'March' },
    { value: 4, label: 'April' }, { value: 5, label: 'May' }, { value: 6, label: 'June' },
    { value: 7, label: 'July' }, { value: 8, label: 'August' }, { value: 9, label: 'September' },
    { value: 10, label: 'October' }, { value: 11, label: 'November' }, { value: 12, label: 'December' }
  ];

  const maxCount = Math.max(...reportData.departmentStats.map(d => d.count), 1);
  const maxFaculty = Math.max(...reportData.facultyStats.map(d => d.count), 1);

  return (
    <div className="reports-page">
      <div className="page-header">
        <h1>Reports & Visualisations</h1>
        <div className="report-filters">
          <div className="filter-group">
            <label>Year</label>
            <select value={year} onChange={(e) => setYear(e.target.value)}>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <label>Month</label>
            <select value={month} onChange={(e) => setMonth(parseInt(e.target.value))}>
              {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="activity-summary-cards">
        <div className="summary-card">
          <div className="summary-icon submissions"><FileText size={24} /></div>
          <div className="summary-content">
            <span className="summary-value">{reportData.activityStats.submissions}</span>
            <span className="summary-label">Submissions</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon approvals"><CheckCircle size={24} /></div>
          <div className="summary-content">
            <span className="summary-value">{reportData.activityStats.approvals}</span>
            <span className="summary-label">Approvals</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon rejections"><XCircle size={24} /></div>
          <div className="summary-content">
            <span className="summary-value">{reportData.activityStats.rejections}</span>
            <span className="summary-label">Rejections</span>
          </div>
        </div>
      </div>

      <div className="reports-tabs">
        <button className={activeTab === 'department' ? 'active' : ''} onClick={() => setActiveTab('department')}>
          <Building size={18} /> Department
        </button>
        <button className={activeTab === 'faculty' ? 'active' : ''} onClick={() => setActiveTab('faculty')}>
          <Users size={18} /> Faculty
        </button>
        <button className={activeTab === 'topresearchers' ? 'active' : ''} onClick={() => setActiveTab('topresearchers')}>
          <Award size={18} /> Top Researchers
        </button>
        <button className={activeTab === 'activity' ? 'active' : ''} onClick={() => setActiveTab('activity')}>
          <BarChart3 size={18} /> Activity
        </button>
      </div>

      <div className="reports-content">
        {activeTab === 'department' && (
          <div className="report-section">
            <h2><Building size={20} /> Department-wise Research Statistics</h2>
            <div className="bar-chart-container">
              {reportData.departmentStats.length > 0 ? (
                reportData.departmentStats.map(item => (
                  <div key={item.dept} className="bar-row">
                    <span className="bar-label">{item.dept}</span>
                    <div className="bar-container">
                      <div className="bar department-bar" style={{ width: `${(item.count / maxCount) * 100}%` }}></div>
                    </div>
                    <span className="bar-value">{item.count}</span>
                  </div>
                ))
              ) : (
                <p className="no-data">No research data for selected period</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'faculty' && (
          <div className="report-section">
            <h2><Users size={20} /> Faculty-wise Statistics</h2>
            <div className="bar-chart-container">
              {reportData.facultyStats.length > 0 ? (
                reportData.facultyStats.map(item => (
                  <div key={item.name} className="bar-row">
                    <span className="bar-label">{item.name}</span>
                    <div className="bar-container">
                      <div className="bar faculty-bar" style={{ width: `${(item.count / maxFaculty) * 100}%` }}></div>
                    </div>
                    <span className="bar-value">{item.count}</span>
                  </div>
                ))
              ) : (
                <p className="no-data">No faculty data for selected period</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'topresearchers' && (
          <div className="report-section">
            <h2><Award size={20} /> Best API Score Researchers by Department</h2>
            <div className="top-researchers-grid">
              {reportData.topResearchers.length > 0 ? (
                reportData.topResearchers.map((researcher, idx) => (
                  <div key={researcher.name} className="researcher-rank-card">
                    <div className={`rank-badge rank-${idx + 1}`}>{idx + 1}</div>
                    <div className="researcher-info">
                      <h4>{researcher.name}</h4>
                      <span className="dept-tag">{researcher.department}</span>
                    </div>
                    <div className="api-score-display">
                      <span className="score-value">{researcher.score.toFixed(2)}</span>
                      <span className="score-label">API Score</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-data">No researcher data for selected period</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="report-section">
            <h2><BarChart3 size={20} /> Activity Report</h2>
            <div className="activity-chart">
              <div className="activity-bar-group">
                <div className="activity-bar submissions" style={{ height: `${Math.max(reportData.activityStats.submissions * 5, 10)}px` }}>
                  <span className="bar-tooltip">{reportData.activityStats.submissions}</span>
                </div>
                <span className="activity-label">Submissions</span>
              </div>
              <div className="activity-bar-group">
                <div className="activity-bar approvals" style={{ height: `${Math.max(reportData.activityStats.approvals * 5, 10)}px` }}>
                  <span className="bar-tooltip">{reportData.activityStats.approvals}</span>
                </div>
                <span className="activity-label">Approvals</span>
              </div>
              <div className="activity-bar-group">
                <div className="activity-bar rejections" style={{ height: `${Math.max(reportData.activityStats.rejections * 5, 10)}px` }}>
                  <span className="bar-tooltip">{reportData.activityStats.rejections}</span>
                </div>
                <span className="activity-label">Rejections</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Profile() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setUsers(getUsers());
  }, []);

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        await importFromJSON(file);
        alert('Data imported successfully!');
        window.location.reload();
      } catch (err) {
        alert('Failed to import data');
      }
    }
  };

  const handleUserRoleChange = (userId, newRole) => {
    const allUsers = getUsers();
    const updated = allUsers.map(u => u.id === userId ? {...u, role: newRole} : u);
    setUsers(updated);
    localStorage.setItem('scholarsync_users', JSON.stringify(updated));
  };

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: user.username,
    orcid: user.orcid || '',
    alsoKnownAs: user.alsoKnownAs || '',
    country: user.country || 'India',
    keywords: user.keywords || '',
    biography: user.biography || '',
    website: user.website || '',
    linkedIn: user.linkedIn || '',
    googleScholar: user.googleScholar || '',
    researchGate: user.researchGate || '',
    employment: user.employment || [],
    works: user.works || [],
    publications: []
  });

  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem(`scholarsync_profile_${user.id}`) || '{}');
    if (savedProfile.fullName) {
      setProfileData({ ...profileData, ...savedProfile });
    }
    const rdata = getResearchData();
    const userPublications = rdata
      .filter(r => r.author_id === user.id)
      .map(r => ({
        id: r.r_id,
        title: r.title,
        journal: r.journalName || r.r_department,
        year: new Date(r.submission_date).getFullYear(),
        publicationType: r.publicationType || 'journal-article',
        authorshipPosition: r.authorshipPosition || 'first-author',
        totalAuthors: r.totalAuthors || 1,
        apiScore: r.apiScore || 0,
        status: r.status,
        doi: r.doi || ''
      }));
    setProfileData(prev => ({ ...prev, publications: userPublications }));
  }, []);

  const handleProfileChange = (field, value) => {
    setProfileData({ ...profileData, [field]: value });
  };

  const saveProfile = () => {
    localStorage.setItem(`scholarsync_profile_${user.id}`, JSON.stringify(profileData));
    setIsEditing(false);
    alert('Profile saved successfully!');
  };

  const exportProfile = () => {
    const dataStr = JSON.stringify(profileData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${profileData.fullName.replace(/\s+/g, '_')}_Profile.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const [activeSection, setActiveSection] = useState('overview');

  return (
    <div className="researcher-profile">
      <div className="profile-header-section">
        <div className="profile-avatar-large">
          {profileData.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
        </div>
        <div className="profile-header-info">
          <div className="profile-name-row">
            <h1>{profileData.fullName}</h1>
            {profileData.orcid && (
              <a href={`https://orcid.org/${profileData.orcid}`} target="_blank" rel="noopener noreferrer" className="orcid-badge">
                <svg width="16" height="16" viewBox="0 0 256 256">
                  <path fill="#A6CE39" d="M256 128c0 70.7-57.3 128-128 128S0 198.7 0 128 57.3 0 128 0s128 57.3 128 128z"/>
                  <path fill="#fff" d="M86.3 186.2H70.9V79.1h15.4v107.1zM108.9 79.1h41.6c39.6 0 57 28.3 57 53.6 0 27.5-21.5 53.6-56.8 53.6h-41.8V79.1zm15.4 93.3h24.5c34.9 0 42.9-26.5 42.9-39.7C191.7 111.2 178 93 146 93h-21.7v79.4z"/>
                  <circle fill="#fff" cx="78.6" cy="64.1" r="9.2"/>
                </svg>
                {profileData.orcid}
              </a>
            )}
          </div>
          {profileData.alsoKnownAs && (
            <p className="also-known-as">Also known as: <em>{profileData.alsoKnownAs}</em></p>
          )}
          <div className="profile-meta-row">
            {profileData.country && (
              <span className="meta-item"><MapPin size={14} /> {profileData.country}</span>
            )}
            {profileData.keywords && (
              <span className="meta-item keywords-display">
                <span className="keyword-tag-profile">{profileData.keywords}</span>
              </span>
            )}
          </div>
          <div className="profile-contact-row">
            {profileData.email && (
              <a href={`mailto:${profileData.email}`} className="contact-link">
                <Mail size={14} /> {profileData.email}
              </a>
            )}
            {profileData.website && (
              <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="contact-link">
                <Globe size={14} /> Website
              </a>
            )}
          </div>
          {profileData.googleScholar && (
            <div className="social-links">
              <a href={profileData.googleScholar} target="_blank" rel="noopener noreferrer" className="social-badge google-scholar">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 24a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm0-24L0 9.5l4.838 3.94A8 8 0 0 1 12 9a8 8 0 0 1 7.162 4.44L24 9.5z"/>
                </svg>
                Google Scholar
              </a>
              {profileData.researchGate && (
                <a href={profileData.researchGate} target="_blank" rel="noopener noreferrer" className="social-badge researchgate">
                  R
                </a>
              )}
            </div>
          )}
        </div>
        <div className="profile-actions-header">
          <button className="btn-secondary" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? <X size={16} /> : <Edit3 size={16} />}
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
          <button className="btn-secondary" onClick={exportProfile}>
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="profile-edit-section">
          <h3><Edit3 size={20} /> Edit Profile Information</h3>
          <div className="edit-form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" value={profileData.fullName} onChange={(e) => handleProfileChange('fullName', e.target.value)} />
            </div>
            <div className="form-group">
              <label>ORCID</label>
              <input type="text" value={profileData.orcid} onChange={(e) => handleProfileChange('orcid', e.target.value)} placeholder="0009-0007-9218-9750" />
            </div>
            <div className="form-group">
              <label>Also Known As</label>
              <input type="text" value={profileData.alsoKnownAs} onChange={(e) => handleProfileChange('alsoKnownAs', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input type="text" value={profileData.country} onChange={(e) => handleProfileChange('country', e.target.value)} />
            </div>
            <div className="form-group full-width">
              <label>Keywords (comma-separated)</label>
              <input type="text" value={profileData.keywords} onChange={(e) => handleProfileChange('keywords', e.target.value)} placeholder="Artificial Intelligence, Machine Learning" />
            </div>
            <div className="form-group full-width">
              <label>Biography</label>
              <textarea rows="4" value={profileData.biography} onChange={(e) => handleProfileChange('biography', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Website URL</label>
              <input type="text" value={profileData.website} onChange={(e) => handleProfileChange('website', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Google Scholar URL</label>
              <input type="text" value={profileData.googleScholar} onChange={(e) => handleProfileChange('googleScholar', e.target.value)} />
            </div>
          </div>
          <div className="edit-actions">
            <button className="btn-primary" onClick={saveProfile}>
              <Save size={16} /> Save Profile
            </button>
          </div>
        </div>
      )}

      <div className="profile-nav-tabs">
        <button className={`profile-tab ${activeSection === 'overview' ? 'active' : ''}`} onClick={() => setActiveSection('overview')}>
          <FileText size={18} /> Overview
        </button>
        <button className={`profile-tab ${activeSection === 'works' ? 'active' : ''}`} onClick={() => setActiveSection('works')}>
          <BookOpen size={18} /> Works
        </button>
        <button className={`profile-tab ${activeSection === 'employment' ? 'active' : ''}`} onClick={() => setActiveSection('employment')}>
          <Briefcase size={18} /> Employment
        </button>
        <button className={`profile-tab ${activeSection === 'api' ? 'active' : ''}`} onClick={() => setActiveSection('api')}>
          <Calculator size={18} /> API Score
        </button>
      </div>

      <div className="profile-content">
        {activeSection === 'overview' && (
          <div className="overview-section">
            {profileData.biography && (
              <div className="profile-section">
                <h3><FileText size={20} /> Biography</h3>
                <p className="biography-text">{profileData.biography}</p>
              </div>
            )}

            {profileData.keywords && (
              <div className="profile-section">
                <h3><Search size={20} /> Keywords</h3>
                <div className="keywords-list">
                  {profileData.keywords.split(',').map((kw, i) => (
                    <span key={i} className="keyword-chip">{kw.trim()}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="profile-section">
              <h3><Award size={20} /> Research Statistics</h3>
              <div className="stats-summary-grid">
                <div className="stat-item">
                  <span className="stat-number">{profileData.publications.reduce((sum, p) => sum + (p.apiScore || 0), 0)}</span>
                  <span className="stat-label">Total API Score</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{profileData.publications.length}</span>
                  <span className="stat-label">Publications</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{profileData.publications.filter(p => p.publicationType === 'journal-article').length}</span>
                  <span className="stat-label">Journal Articles</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{profileData.publications.filter(p => p.publicationType === 'conference-paper').length}</span>
                  <span className="stat-label">Conference Papers</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'works' && (
          <div className="works-section">
            <div className="section-header">
              <h3><BookOpen size={20} /> Works ({profileData.publications.length})</h3>
              <span className="api-score-badge">API: {profileData.publications.reduce((sum, p) => sum + (p.apiScore || 0), 0)}</span>
            </div>
            {profileData.publications.length === 0 ? (
              <p className="empty-state">No publications yet. Submit research to see them here.</p>
            ) : (
              <div className="works-list">
                {profileData.publications.map((work, index) => (
                  <div key={index} className="work-item">
                    <div className="work-header">
                      <div className="work-type-badge">{work.publicationType?.replace('-', ' ')}</div>
                      <span className="work-api-score"><Calculator size={14} /> API: {work.apiScore || 0}</span>
                    </div>
                    <h4>{work.title}</h4>
                    <p className="work-meta">
                      <span className="work-journal">{work.journal}</span>
                      <span className="work-year">{work.year}</span>
                      <span className="work-authorship">{work.authorshipPosition?.replace('-', ' ')}</span>
                    </p>
                    {work.doi && <p className="work-doi">DOI: {work.doi}</p>}
                    <div className="work-footer">
                      <span className={`status-badge ${work.status?.toLowerCase().replace(/\s/g, '-')}`}>{work.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeSection === 'employment' && (
          <div className="employment-section">
            <div className="section-header">
              <h3><Briefcase size={20} /> Employment History</h3>
            </div>
            <div className="employment-list">
              <div className="employment-item">
                <div className="employment-icon"><Building2 size={24} /></div>
                <div className="employment-details">
                  <h4>{user.department} Department</h4>
                  <p className="employment-org">ScholarSync Research Portal</p>
                  <p className="employment-period">
                    <Clock size={14} /> Role: {ROLES[user.role]?.label}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'api' && (
          <div className="api-section">
            <div className="section-header">
              <h3><Calculator size={20} /> API Score Summary</h3>
            </div>
            <p style={{ color: 'var(--text-light)', marginBottom: '20px' }}>
              Your API score is automatically calculated based on your submitted research publications.
            </p>
            
            <div className="api-summary-cards">
              <div className="api-summary-card total">
                <Calculator size={32} />
                <div>
                  <span className="api-label">Total API Score</span>
                  <span className="api-value">{profileData.publications.reduce((sum, p) => sum + (p.apiScore || 0), 0)}</span>
                </div>
              </div>
              <div className="api-summary-card">
                <BookOpen size={24} />
                <div>
                  <span className="api-label">Journal Articles</span>
                  <span className="api-value">{profileData.publications.filter(p => p.publicationType === 'journal-article').reduce((sum, p) => sum + (p.apiScore || 0), 0)}</span>
                </div>
              </div>
              <div className="api-summary-card">
                <Presentation size={24} />
                <div>
                  <span className="api-label">Conference Papers</span>
                  <span className="api-value">{profileData.publications.filter(p => p.publicationType === 'conference-paper').reduce((sum, p) => sum + (p.apiScore || 0), 0)}</span>
                </div>
              </div>
              <div className="api-summary-card">
                <Book size={24} />
                <div>
                  <span className="api-label">Books & Chapters</span>
                  <span className="api-value">{profileData.publications.filter(p => ['book', 'book-chapter'].includes(p.publicationType)).reduce((sum, p) => sum + (p.apiScore || 0), 0)}</span>
                </div>
              </div>
            </div>

            <div className="api-scores-table">
              <h4><FileText size={18} /> API Score Breakdown by Publication</h4>
              {profileData.publications.length === 0 ? (
                <p className="empty-state">No publications yet. Submit research to earn API scores.</p>
              ) : (
                <table className="breakdown-table">
                  <thead>
                    <tr>
                      <th>Publication</th>
                      <th>Type</th>
                      <th>Authorship</th>
                      <th>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profileData.publications.map((pub, index) => (
                      <tr key={index}>
                        <td>{pub.title?.substring(0, 50)}...</td>
                        <td><span className="type-badge">{pub.publicationType?.replace('-', ' ')}</span></td>
                        <td>{pub.authorshipPosition?.replace('-', ' ')}</td>
                        <td className="score-col">{pub.apiScore || 0}</td>
                      </tr>
                    ))}
                    <tr style={{ fontWeight: 'bold', background: 'var(--bg)' }}>
                      <td colSpan="3">Total API Score</td>
                      <td className="score-col">{profileData.publications.reduce((sum, p) => sum + (p.apiScore || 0), 0)}</td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>

      {(user.role === 'research_cell_admin' || user.role === 'college_admin') && (
        <div className="admin-section" style={{ marginTop: '32px' }}>
          <h3>Admin Controls</h3>
          <div className="data-actions">
            <button onClick={() => exportToJSON()} className="btn-secondary">
              <Download size={16} /> Export JSON
            </button>
            <button onClick={() => exportToCSV()} className="btn-secondary">
              <Download size={16} /> Export CSV
            </button>
            <label className="btn-secondary">
              <Upload size={16} /> Import JSON
              <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
            </label>
          </div>
        </div>
      )}

      {(user.role === 'research_cell_admin' || user.role === 'college_admin') && (
        <div className="admin-section">
          <h3>User Management</h3>
          <div className="user-list">
            {users.map(u => (
              <div key={u.id} className="user-item">
                <span className="user-name">{u.username}</span>
                <span className="user-dept">{u.department}</span>
                <select
                  value={u.role}
                  onChange={(e) => handleUserRoleChange(u.id, e.target.value)}
                  className="role-select"
                >
                  <option value="researcher">Researcher</option>
                  <option value="dept_hod">Dept HOD</option>
                  <option value="research_cell_admin">Research Cell Admin</option>
                  <option value="college_admin">College Admin</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Settings() {
  const { settings, updateSettings, resetSettings } = useSettings();
  const location = useLocation();
  const [formData, setFormData] = useState(settings);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState(location.search.includes('tab=') ? location.search.split('tab=')[1].split('&')[0] : 'general');
  const [editingItem, setEditingItem] = useState(null);
  const [newItemForm, setNewItemForm] = useState({});

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  useEffect(() => {
    const tab = location.search.includes('tab=') ? location.search.split('tab=')[1].split('&')[0] : 'general';
    setActiveTab(tab);
  }, [location.search]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setSaved(false);
  };

  const handleSave = () => {
    updateSettings(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    if (confirm('Reset all settings to default? This cannot be undone.')) {
      resetSettings();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleDbTypeChange = (type) => {
    const newDb = {
      type,
      local: { enabled: type === 'local' },
      sql: {
        enabled: type === 'sql',
        host: formData.database?.sql?.host || 'localhost',
        port: formData.database?.sql?.port || '3306',
        database: formData.database?.sql?.database || 'scholarsync',
        username: formData.database?.sql?.username || '',
        password: formData.database?.sql?.password || ''
      },
      cloud: {
        enabled: type === 'cloud',
        provider: formData.database?.cloud?.provider || 'firebase',
        apiKey: formData.database?.cloud?.apiKey || '',
        authDomain: formData.database?.cloud?.authDomain || '',
        projectId: formData.database?.cloud?.projectId || '',
        storageBucket: formData.database?.cloud?.storageBucket || '',
        messagingSenderId: formData.database?.cloud?.messagingSenderId || '',
        appId: formData.database?.cloud?.appId || ''
      }
    };
    setFormData({ ...formData, database: newDb });
    setSaved(false);
  };

  const handleDbConfigChange = (dbType, field, value) => {
    const newDb = {
      ...formData.database,
      [dbType]: {
        ...formData.database[dbType],
        [field]: value
      }
    };
    setFormData({ ...formData, database: newDb });
    setSaved(false);
  };

  const testDbConnection = () => {
    const dbType = formData.database?.type;
    if (dbType === 'local') {
      alert('Local Storage: Connection successful! Data is being stored locally.');
    } else if (dbType === 'sql') {
      const sql = formData.database?.sql;
      if (!sql?.host || !sql?.database) {
        alert('Please fill in all required SQL fields (Host, Database Name).');
        return;
      }
      alert(`SQL Connection Test\n\nHost: ${sql.host}:${sql.port}\nDatabase: ${sql.database}\n\nNote: This is a demo. Actual connection would require a backend API.`);
    } else if (dbType === 'cloud') {
      const cloud = formData.database?.cloud;
      if (!cloud?.apiKey || !cloud?.projectId) {
        alert('Please fill in API Key and Project ID for cloud connection.');
        return;
      }
      alert(`Cloud DB Connection Test\n\nProvider: ${cloud.provider}\nProject ID: ${cloud.projectId}\n\nNote: This is a demo. Actual connection would require a backend API.`);
    }
  };

  const handleContentChange = (section, field, value) => {
    const newContent = {
      ...formData[section],
      [field]: value
    };
    setFormData({ ...formData, [section]: newContent });
    setSaved(false);
  };

  const handleArrayItemChange = (section, index, field, value) => {
    const items = [...(formData[section] || [])];
    items[index] = { ...items[index], [field]: value };
    setFormData({ ...formData, [section]: items });
    setSaved(false);
  };

  const handleAddArrayItem = (section, defaultItem) => {
    const items = [...(formData[section] || [])];
    items.push({ ...defaultItem, id: Date.now() });
    setFormData({ ...formData, [section]: items });
    setSaved(false);
  };

  const handleRemoveArrayItem = (section, index) => {
    const items = [...(formData[section] || [])];
    items.splice(index, 1);
    setFormData({ ...formData, [section]: items });
    setSaved(false);
  };

  const renderGeneralSettings = () => (
    <>
      <div className="settings-grid">
        <div className="settings-section">
          <div className="settings-section-header">
            <Type size={20} />
            <div>
              <h3>Institution Details</h3>
              <p>Basic information about your institution</p>
            </div>
          </div>
          <div className="settings-form">
            <div className="form-group">
              <label>Institution Name</label>
              <input
                type="text"
                value={formData.institutionName}
                onChange={(e) => handleChange('institutionName', e.target.value)}
                placeholder="Enter institution name"
              />
            </div>
            <div className="form-group">
              <label>Tagline</label>
              <input
                type="text"
                value={formData.institutionTagline}
                onChange={(e) => handleChange('institutionTagline', e.target.value)}
                placeholder="Enter tagline"
              />
            </div>
            <div className="form-group">
              <label>Welcome Message</label>
              <textarea
                value={formData.welcomeMessage}
                onChange={(e) => handleChange('welcomeMessage', e.target.value)}
                rows={3}
                placeholder="Message shown on login page"
              />
            </div>
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section-header">
            <Image size={20} />
            <div>
              <h3>Branding</h3>
              <p>Logo and visual identity</p>
            </div>
          </div>
          <div className="settings-form">
            <div className="form-group">
              <label>Logo URL</label>
              <input
                type="text"
                value={formData.logoUrl}
                onChange={(e) => handleChange('logoUrl', e.target.value)}
                placeholder="https://example.com/logo.png"
              />
              <span className="form-hint">Enter a URL to your institution's logo</span>
            </div>
            {formData.logoUrl && (
              <div className="logo-preview">
                <img src={formData.logoUrl} alt="Logo Preview" onError={(e) => e.target.style.display = 'none'} />
              </div>
            )}
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section-header">
            <Palette size={20} />
            <div>
              <h3>Colors</h3>
              <p>Customize the portal color scheme</p>
            </div>
          </div>
          <div className="settings-form">
            <div className="color-inputs">
              <div className="form-group">
                <label>Primary Color</label>
                <div className="color-input-wrapper">
                  <input
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) => handleChange('primaryColor', e.target.value)}
                  />
                  <input
                    type="text"
                    value={formData.primaryColor}
                    onChange={(e) => handleChange('primaryColor', e.target.value)}
                    placeholder="#6366f1"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Accent Color</label>
                <div className="color-input-wrapper">
                  <input
                    type="color"
                    value={formData.accentColor}
                    onChange={(e) => handleChange('accentColor', e.target.value)}
                  />
                  <input
                    type="text"
                    value={formData.accentColor}
                    onChange={(e) => handleChange('accentColor', e.target.value)}
                    placeholder="#818cf8"
                  />
                </div>
              </div>
            </div>
            <div className="color-preview">
              <div className="color-swatch" style={{ backgroundColor: formData.primaryColor }}></div>
              <span>Primary</span>
              <div className="color-swatch" style={{ backgroundColor: formData.accentColor }}></div>
              <span>Accent</span>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section-header">
            <Mail size={20} />
            <div>
              <h3>Contact Information</h3>
              <p>Contact details shown in the portal</p>
            </div>
          </div>
          <div className="settings-form">
            <div className="form-group">
              <label><Mail size={14} /> Email</label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                placeholder="research@college.edu"
              />
            </div>
            <div className="form-group">
              <label><Phone size={14} /> Phone</label>
              <input
                type="text"
                value={formData.contactPhone}
                onChange={(e) => handleChange('contactPhone', e.target.value)}
                placeholder="+1 234 567 8900"
              />
            </div>
            <div className="form-group">
              <label><MapPin size={14} /> Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="123 University Avenue"
              />
            </div>
            <div className="form-group">
              <label><Globe size={14} /> Website</label>
              <input
                type="text"
                value={formData.website}
                onChange={(e) => handleChange('website', e.target.value)}
                placeholder="www.college.edu"
              />
            </div>
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section-header">
            <AlertTriangle size={20} />
            <div>
              <h3>Announcements</h3>
              <p>Banner announcements for all users</p>
            </div>
          </div>
          <div className="settings-form">
            <div className="form-group">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={formData.enableAnnouncementBanner}
                  onChange={(e) => handleChange('enableAnnouncementBanner', e.target.checked)}
                />
                <span>Enable Announcement Banner</span>
              </label>
            </div>
            <div className="form-group">
              <label>Banner Message</label>
              <textarea
                value={formData.announcementBanner}
                onChange={(e) => handleChange('announcementBanner', e.target.value)}
                rows={2}
                placeholder="Important notice for all users..."
                disabled={!formData.enableAnnouncementBanner}
              />
            </div>
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section-header">
            <Shield size={20} />
            <div>
              <h3>System Settings</h3>
              <p>Portal maintenance and access</p>
            </div>
          </div>
          <div className="settings-form">
            <div className="form-group">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={formData.maintenanceMode}
                  onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                />
                <span>Enable Maintenance Mode</span>
              </label>
              <span className="form-hint warning">When enabled, only admins can access the portal</span>
            </div>
            {formData.maintenanceMode && (
              <div className="form-group">
                <label>Maintenance Message</label>
                <textarea
                  value={formData.maintenanceMessage}
                  onChange={(e) => handleChange('maintenanceMessage', e.target.value)}
                  rows={2}
                />
              </div>
            )}
          </div>
        </div>

        <div className="settings-section full-width">
          <div className="settings-section-header">
            <Database size={20} />
            <div>
              <h3>Database Configuration</h3>
              <p>Configure where your data is stored</p>
            </div>
          </div>
          <div className="settings-form">
            <div className="db-type-selector">
              <button
                type="button"
                className={`db-type-btn ${formData.database?.type === 'local' ? 'active' : ''}`}
                onClick={() => handleDbTypeChange('local')}
              >
                <HardDrive size={24} />
                <span>Local Storage</span>
                <small>Browser-based storage</small>
              </button>
              <button
                type="button"
                className={`db-type-btn ${formData.database?.type === 'sql' ? 'active' : ''}`}
                onClick={() => handleDbTypeChange('sql')}
              >
                <Server size={24} />
                <span>SQL Database</span>
                <small>MySQL, PostgreSQL, etc.</small>
              </button>
              <button
                type="button"
                className={`db-type-btn ${formData.database?.type === 'cloud' ? 'active' : ''}`}
                onClick={() => handleDbTypeChange('cloud')}
              >
                <Cloud size={24} />
                <span>Cloud DB</span>
                <small>Firebase, Supabase, etc.</small>
              </button>
            </div>

            {formData.database?.type === 'local' && (
              <div className="db-config-panel local-config">
                <div className="db-status success">
                  <HardDrive size={18} />
                  <div>
                    <strong>Local Storage Active</strong>
                    <p>Data is stored in the browser's local storage</p>
                  </div>
                </div>
                <div className="form-hint">
                  Data will persist in the browser but may be cleared when cache is deleted.
                </div>
              </div>
            )}

            {formData.database?.type === 'sql' && (
              <div className="db-config-panel sql-config">
                <div className="db-config-grid">
                  <div className="form-group">
                    <label>Host</label>
                    <input
                      type="text"
                      value={formData.database?.sql?.host || ''}
                      onChange={(e) => handleDbConfigChange('sql', 'host', e.target.value)}
                      placeholder="localhost"
                    />
                  </div>
                  <div className="form-group">
                    <label>Port</label>
                    <input
                      type="text"
                      value={formData.database?.sql?.port || ''}
                      onChange={(e) => handleDbConfigChange('sql', 'port', e.target.value)}
                      placeholder="3306"
                    />
                  </div>
                  <div className="form-group">
                    <label>Database Name</label>
                    <input
                      type="text"
                      value={formData.database?.sql?.database || ''}
                      onChange={(e) => handleDbConfigChange('sql', 'database', e.target.value)}
                      placeholder="scholarsync"
                    />
                  </div>
                  <div className="form-group">
                    <label>Username</label>
                    <input
                      type="text"
                      value={formData.database?.sql?.username || ''}
                      onChange={(e) => handleDbConfigChange('sql', 'username', e.target.value)}
                      placeholder="root"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Password</label>
                    <div className="password-field">
                      <input
                        type={formData.showSqlPassword ? 'text' : 'password'}
                        value={formData.database?.sql?.password || ''}
                        onChange={(e) => handleDbConfigChange('sql', 'password', e.target.value)}
                        placeholder="Enter database password"
                      />
                      <button
                        type="button"
                        className="toggle-visibility"
                        onClick={() => setFormData({ ...formData, showSqlPassword: !formData.showSqlPassword })}
                      >
                        {formData.showSqlPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="db-status info">
                  <Server size={18} />
                  <div>
                    <strong>SQL Configuration</strong>
                    <p>Supports MySQL, PostgreSQL, MariaDB, SQLite</p>
                  </div>
                </div>
              </div>
            )}

            {formData.database?.type === 'cloud' && (
              <div className="db-config-panel cloud-config">
                <div className="cloud-provider-tabs">
                  <button
                    type="button"
                    className={`provider-tab ${formData.database?.cloud?.provider === 'firebase' ? 'active' : ''}`}
                    onClick={() => handleDbConfigChange('cloud', 'provider', 'firebase')}
                  >
                    Firebase
                  </button>
                  <button
                    type="button"
                    className={`provider-tab ${formData.database?.cloud?.provider === 'supabase' ? 'active' : ''}`}
                    onClick={() => handleDbConfigChange('cloud', 'provider', 'supabase')}
                  >
                    Supabase
                  </button>
                  <button
                    type="button"
                    className={`provider-tab ${formData.database?.cloud?.provider === 'mongodb' ? 'active' : ''}`}
                    onClick={() => handleDbConfigChange('cloud', 'provider', 'mongodb')}
                  >
                    MongoDB Atlas
                  </button>
                </div>
                <div className="cloud-config-grid">
                  <div className="form-group">
                    <label>API Key</label>
                    <input
                      type="text"
                      value={formData.database?.cloud?.apiKey || ''}
                      onChange={(e) => handleDbConfigChange('cloud', 'apiKey', e.target.value)}
                      placeholder="Enter API key"
                    />
                  </div>
                  <div className="form-group">
                    <label>Auth Domain</label>
                    <input
                      type="text"
                      value={formData.database?.cloud?.authDomain || ''}
                      onChange={(e) => handleDbConfigChange('cloud', 'authDomain', e.target.value)}
                      placeholder="your-app.firebaseapp.com"
                    />
                  </div>
                  <div className="form-group">
                    <label>Project ID</label>
                    <input
                      type="text"
                      value={formData.database?.cloud?.projectId || ''}
                      onChange={(e) => handleDbConfigChange('cloud', 'projectId', e.target.value)}
                      placeholder="your-project-id"
                    />
                  </div>
                  <div className="form-group">
                    <label>Storage Bucket</label>
                    <input
                      type="text"
                      value={formData.database?.cloud?.storageBucket || ''}
                      onChange={(e) => handleDbConfigChange('cloud', 'storageBucket', e.target.value)}
                      placeholder="your-app.appspot.com"
                    />
                  </div>
                  <div className="form-group">
                    <label>Messaging Sender ID</label>
                    <input
                      type="text"
                      value={formData.database?.cloud?.messagingSenderId || ''}
                      onChange={(e) => handleDbConfigChange('cloud', 'messagingSenderId', e.target.value)}
                      placeholder="123456789"
                    />
                  </div>
                  <div className="form-group">
                    <label>App ID</label>
                    <input
                      type="text"
                      value={formData.database?.cloud?.appId || ''}
                      onChange={(e) => handleDbConfigChange('cloud', 'appId', e.target.value)}
                      placeholder="1:123456789:web:abc123"
                    />
                  </div>
                </div>
                <div className="db-status info">
                  <Cloud size={18} />
                  <div>
                    <strong>Cloud Configuration</strong>
                    <p>Securely connect to cloud database services</p>
                  </div>
                </div>
              </div>
            )}

            <div className="db-actions">
              <button type="button" className="btn-secondary" onClick={testDbConnection}>
                Test Connection
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderAboutContent = () => {
    const aboutContent = formData.aboutContent || {};
    return (
      <div className="content-editor">
        <div className="settings-section full-width">
          <div className="settings-section-header">
            <Info size={20} />
            <div>
              <h3>About Page Content</h3>
              <p>Edit the content displayed on the About page</p>
            </div>
          </div>
          <div className="settings-form">
            <div className="form-group">
              <label>Application Description</label>
              <textarea
                value={aboutContent.description || ''}
                onChange={(e) => handleContentChange('aboutContent', 'description', e.target.value)}
                rows={4}
                placeholder="Enter the main description for the application"
              />
            </div>
          </div>
        </div>

        <div className="settings-section full-width">
          <div className="settings-section-header">
            <Layers size={20} />
            <div>
              <h3>Core Modules</h3>
              <p>Edit the modules displayed on the About page</p>
            </div>
            <button 
              className="btn-secondary" 
              style={{marginLeft: 'auto'}}
              onClick={() => handleAddArrayItem('aboutContent', {
                modules: [...(aboutContent.modules || []), { id: Date.now(), title: '', icon: 'Layers', description: '', features: [] }]
              })}
            >
              <Plus size={16} /> Add Module
            </button>
          </div>
          <div className="items-list">
            {(aboutContent.modules || []).map((module, index) => (
              <div key={module.id || index} className="item-card">
                <div className="item-header">
                  <h4>{module.title || `Module ${index + 1}`}</h4>
                  <button className="btn-icon-danger" onClick={() => {
                    const modules = [...(aboutContent.modules || [])];
                    modules.splice(index, 1);
                    handleContentChange('aboutContent', 'modules', modules);
                  }}>
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="item-form">
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      value={module.title || ''}
                      onChange={(e) => handleArrayItemChange('aboutContent', index, 'title', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={module.description || ''}
                      onChange={(e) => handleArrayItemChange('aboutContent', index, 'description', e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div className="form-group">
                    <label>Features (comma-separated)</label>
                    <input
                      type="text"
                      value={(module.features || []).join(', ')}
                      onChange={(e) => handleArrayItemChange('aboutContent', index, 'features', e.target.value.split(',').map(f => f.trim()))}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="settings-section full-width">
          <div className="settings-section-header">
            <Shield size={20} />
            <div>
              <h3>Security Features</h3>
              <p>Edit the security features listed on the About page</p>
            </div>
          </div>
          <div className="items-list">
            {(aboutContent.securityFeatures || []).map((feature, index) => (
              <div key={feature.id || index} className="item-card">
                <div className="item-header">
                  <h4>{feature.title || `Feature ${index + 1}`}</h4>
                  <button className="btn-icon-danger" onClick={() => {
                    const features = [...(aboutContent.securityFeatures || [])];
                    features.splice(index, 1);
                    handleContentChange('aboutContent', 'securityFeatures', features);
                  }}>
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="item-form">
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      value={feature.title || ''}
                      onChange={(e) => handleArrayItemChange('aboutContent', index, 'title', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={feature.description || ''}
                      onChange={(e) => handleArrayItemChange('aboutContent', index, 'description', e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            ))}
            <button className="btn-secondary" onClick={() => {
              const features = [...(aboutContent.securityFeatures || []), { id: Date.now(), title: '', description: '' }];
              handleContentChange('aboutContent', 'securityFeatures', features);
            }}>
              <Plus size={16} /> Add Security Feature
            </button>
          </div>
        </div>

        <div className="settings-section full-width">
          <div className="settings-section-header">
            <Zap size={20} />
            <div>
              <h3>Key Features</h3>
              <p>Edit the key features listed on the About page</p>
            </div>
          </div>
          <div className="items-list">
            {(aboutContent.keyFeatures || []).map((feature, index) => (
              <div key={feature.id || index} className="item-card">
                <div className="item-header">
                  <h4>{feature.title || `Feature ${index + 1}`}</h4>
                  <button className="btn-icon-danger" onClick={() => {
                    const features = [...(aboutContent.keyFeatures || [])];
                    features.splice(index, 1);
                    handleContentChange('aboutContent', 'keyFeatures', features);
                  }}>
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="item-form">
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      value={feature.title || ''}
                      onChange={(e) => handleArrayItemChange('aboutContent', index, 'title', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={feature.description || ''}
                      onChange={(e) => handleArrayItemChange('aboutContent', index, 'description', e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            ))}
            <button className="btn-secondary" onClick={() => {
              const features = [...(aboutContent.keyFeatures || []), { id: Date.now(), title: '', description: '' }];
              handleContentChange('aboutContent', 'keyFeatures', features);
            }}>
              <Plus size={16} /> Add Key Feature
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderAppendixContent = () => {
    const appendixContent = formData.appendixContent || {};
    const sections = [
      { key: 'academicDatabases', title: 'Academic Databases', icon: Search },
      { key: 'publishers', title: 'Publishers', icon: Book },
      { key: 'searchEngines', title: 'Search Engines', icon: GlobeIcon },
      { key: 'repositories', title: 'Repositories', icon: Archive },
      { key: 'aiTools', title: 'AI Tools', icon: Sparkles },
      { key: 'citationTools', title: 'Citation Tools', icon: FileText }
    ];

    return (
      <div className="content-editor">
        <div className="settings-section full-width">
          <div className="settings-section-header">
            <Library size={20} />
            <div>
              <h3>Appendix Page Content</h3>
              <p>Edit the research resource links displayed on the Appendix page</p>
            </div>
          </div>
        </div>

        {sections.map(({ key, title, icon: Icon }) => (
          <div key={key} className="settings-section full-width">
            <div className="settings-section-header">
              <Icon size={20} />
              <div>
                <h3>{title}</h3>
                <p>Edit {title.toLowerCase()} links</p>
              </div>
              <button 
                className="btn-secondary" 
                style={{marginLeft: 'auto'}}
                onClick={() => {
                  const items = [...(appendixContent[key] || []), { id: Date.now(), name: '', url: '', desc: '', icon: '🔗' }];
                  handleContentChange('appendixContent', key, items);
                }}
              >
                <Plus size={16} /> Add
              </button>
            </div>
            <div className="items-list">
              {(appendixContent[key] || []).map((item, index) => (
                <div key={item.id || index} className="item-card">
                  <div className="item-header">
                    <h4>{item.name || `Item ${index + 1}`}</h4>
                    <button className="btn-icon-danger" onClick={() => {
                      const items = [...(appendixContent[key] || [])];
                      items.splice(index, 1);
                      handleContentChange('appendixContent', key, items);
                    }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="item-form">
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        value={item.name || ''}
                        onChange={(e) => handleArrayItemChange('appendixContent', index, 'name', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>URL</label>
                      <input
                        type="text"
                        value={item.url || ''}
                        onChange={(e) => handleArrayItemChange('appendixContent', index, 'url', e.target.value)}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <input
                        type="text"
                        value={item.desc || ''}
                        onChange={(e) => handleArrayItemChange('appendixContent', index, 'desc', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Icon (emoji)</label>
                      <input
                        type="text"
                        value={item.icon || ''}
                        onChange={(e) => handleArrayItemChange('appendixContent', index, 'icon', e.target.value)}
                        placeholder="📚"
                        style={{ width: '80px' }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>Portal Settings</h1>
        <p>Customize your research portal appearance and content</p>
      </div>

      <div className="settings-tabs">
        <button 
          className={`settings-tab ${activeTab === 'general' ? 'active' : ''}`}
          onClick={() => setActiveTab('general')}
        >
          <SettingsIcon size={18} />
          General
        </button>
        <button 
          className={`settings-tab ${activeTab === 'about' ? 'active' : ''}`}
          onClick={() => setActiveTab('about')}
        >
          <Info size={18} />
          About Page
        </button>
        <button 
          className={`settings-tab ${activeTab === 'appendix' ? 'active' : ''}`}
          onClick={() => setActiveTab('appendix')}
        >
          <Library size={18} />
          Appendix
        </button>
      </div>

      {activeTab === 'general' && renderGeneralSettings()}
      {activeTab === 'about' && renderAboutContent()}
      {activeTab === 'appendix' && renderAppendixContent()}

      <div className="settings-actions">
        {saved && <span className="save-success">Settings saved successfully!</span>}
        <button className="btn-secondary" onClick={handleReset}>
          <RotateCcw size={16} /> Reset to Default
        </button>
        <button className="btn-primary" onClick={handleSave}>
          <Save size={16} /> Save Changes
        </button>
      </div>
    </div>
  );
}

function HelixAI() {
  const { user } = useAuth();
  const { settings } = useSettings();
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('openai/gpt-4o-mini');
  const [availableModels, setAvailableModels] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [enableWebSearch, setEnableWebSearch] = useState(true);
  const [error, setError] = useState('');
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [appStats, setAppStats] = useState({ totalResearchers: 0, totalPublications: 0, totalDepartments: 0, totalApiScore: 0 });
  const messagesEndRef = useRef(null);
  
  const [aiTimer, setAiTimer] = useState({ enabled: false, dailyLimit: 30, usedToday: 0, lastResetDate: null });
  const [timerWarning, setTimerWarning] = useState(false);
  const [timerExpired, setTimerExpired] = useState(false);

  const fetchModels = async () => {
    if (!apiKey.trim()) return;
    setIsLoadingModels(true);
    try {
      const response = await fetch('https://openrouter.ai/api/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        const models = data.data.map(m => ({
          id: m.id,
          name: m.name || m.id.split('/')[1] || m.id,
          provider: m.id.split('/')[0] || 'Unknown',
          desc: m.description?.substring(0, 60) + '...' || ''
        })).sort((a, b) => a.provider.localeCompare(b.provider));
        setAvailableModels(models);
      }
    } catch (err) {
      console.error('Failed to fetch models:', err);
    } finally {
      setIsLoadingModels(false);
    }
  };

  const fetchAppStats = () => {
    const users = getUsers();
    const rdata = getResearchData();
    const departments = [...new Set(rdata.map(r => r.r_department).filter(Boolean))];
    const totalApiScore = rdata.reduce((sum, r) => sum + (r.apiScore || 0), 0);
    setAppStats({
      totalResearchers: users.length,
      totalPublications: rdata.length,
      totalDepartments: departments.length,
      totalApiScore: Math.round(totalApiScore * 100) / 100
    });
  };

  useEffect(() => {
    if (!user?.id) return;
    const savedConfig = localStorage.getItem(`scholarsync_ai_config_${user.id}`);
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      setApiKey(config.apiKey || '');
      setSelectedModel(config.model || 'openai/gpt-4o-mini');
      setEnableWebSearch(config.enableWebSearch !== undefined ? config.enableWebSearch : true);
    }
    const savedMessages = localStorage.getItem(`scholarsync_ai_messages_${user.id}`);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
    const savedTimer = localStorage.getItem(`scholarsync_ai_timer_${user.id}`);
    if (savedTimer) {
      const parsed = JSON.parse(savedTimer);
      const today = new Date().toDateString();
      if (parsed.lastResetDate !== today) {
        parsed.usedToday = 0;
        parsed.lastResetDate = today;
      }
      setAiTimer(parsed);
      if (parsed.enabled && parsed.usedToday >= parsed.dailyLimit) {
        setTimerExpired(true);
      }
    }
    fetchAppStats();
  }, [user?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!aiTimer.enabled || !user?.id) return;
    if (timerExpired) return;
    
    const interval = setInterval(() => {
      setAiTimer(prev => {
        if (prev.usedToday >= prev.dailyLimit) {
          setTimerExpired(true);
          localStorage.setItem(`scholarsync_ai_timer_${user.id}`, JSON.stringify(prev));
          return prev;
        }
        const newUsed = prev.usedToday + 1;
        const warning = newUsed >= prev.dailyLimit * 0.8;
        setTimerWarning(warning && newUsed < prev.dailyLimit);
        const updated = { ...prev, usedToday: newUsed };
        localStorage.setItem(`scholarsync_ai_timer_${user.id}`, JSON.stringify(updated));
        return updated;
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [aiTimer.enabled, timerExpired, user?.id]);

  const saveTimerSettings = (newTimer) => {
    if (!user?.id) return;
    const today = new Date().toDateString();
    const updated = { ...newTimer, lastResetDate: today, usedToday: newTimer.usedToday || 0 };
    setAiTimer(updated);
    setTimerExpired(updated.enabled && updated.usedToday >= updated.dailyLimit);
    setTimerWarning(false);
    localStorage.setItem(`scholarsync_ai_timer_${user.id}`, JSON.stringify(updated));
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatMarkdown = (text) => {
    if (!text) return '';
    let formatted = text;
    
    formatted = formatted.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    formatted = formatted.replace(/\\\[([\s\S]*?)\\\]/g, '<div class="math-block">$1</div>');
    formatted = formatted.replace(/\\\(([\s\S]*?)\\\)/g, '<span class="math-inline">$1</span>');
    
    formatted = formatted.replace(/```(\w*)\n?([\s\S]*?)```/g, '<pre class="code-block"><code>$2</code></pre>');
    formatted = formatted.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
    
    formatted = formatted.replace(/^### (.+)$/gm, '<h4 class="md-h3">$1</h4>');
    formatted = formatted.replace(/^## (.+)$/gm, '<h3 class="md-h2">$1</h3>');
    formatted = formatted.replace(/^# (.+)$/gm, '<h2 class="md-h1">$1</h2>');
    
    formatted = formatted.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\*(.+?)\*/g, '<em>$1</em>');
    formatted = formatted.replace(/_(.+?)_/g, '<em>$1</em>');
    
    formatted = formatted.replace(/^\s*[-*+]\s+(.+)$/gm, '<li>$1</li>');
    formatted = formatted.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
    
    formatted = formatted.replace(/^\s*(\d+)\.\s+(.+)$/gm, '<li class="numbered">$2</li>');
    
    formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    
    const paragraphs = formatted.split(/\n\n+/);
    formatted = paragraphs.map(p => {
      p = p.trim();
      if (!p) return '';
      if (p.startsWith('<h') || p.startsWith('<ul') || p.startsWith('<ol') || p.startsWith('<pre') || p.startsWith('<div class="math')) {
        return p;
      }
      return `<p>${p.replace(/\n/g, '<br/>')}</p>`;
    }).join('');
    
    return formatted;
  };

  const saveMessages = (msgs) => {
    if (!user?.id) return;
    localStorage.setItem(`scholarsync_ai_messages_${user.id}`, JSON.stringify(msgs));
  };

  const saveConfig = (key, model) => {
    if (!user?.id) return;
    const config = { apiKey: key, model: model, enableWebSearch: enableWebSearch };
    localStorage.setItem(`scholarsync_ai_config_${user.id}`, JSON.stringify(config));
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !apiKey.trim()) return;

    const userMessage = { 
      role: 'user', 
      content: inputMessage, 
      timestamp: Date.now()
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);
    setError('');

    try {
      const systemPrompt = `You are Helix AI, an advanced research assistant integrated into ScholarSync - a comprehensive Research Data Management Portal for academic institutions. You help researchers with:

1. Literature review and research methodology suggestions
2. Writing assistance for research papers, abstracts, and proposals
3. Code assistance for data analysis and machine learning
4. Academic writing tips and citation guidance
5. Explaining complex research concepts
6. Grant proposal assistance
7. API score calculation guidance based on publication type and authorship
8. Research paper formatting in LaTeX

Always be professional, helpful, and academically oriented. Format your responses clearly with headers, bullet points, and code blocks when appropriate. Use LaTeX formatting for mathematical equations and scientific notation.`;

      const apiMessages = [
        { role: 'system', content: systemPrompt },
        ...newMessages.map(m => ({ role: m.role, content: m.content }))
      ];

      const requestBody = {
        model: selectedModel,
        messages: apiMessages,
        max_tokens: 4096,
        temperature: 0.7
      };

      if (enableWebSearch) {
        requestBody.extra_body = {
          'openrouter-alpha': 'choices-1'
        };
        requestBody.transforms = ['llmdo/remove-me'];
      }

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'ScholarSync Helix AI'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API Error: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage = {
        role: 'assistant',
        content: data.choices[0].message.content || 'I received your message. How can I help you further?',
        timestamp: Date.now(),
        model: selectedModel,
        webSearchUsed: enableWebSearch
      };
      const finalMessages = [...newMessages, assistantMessage];
      setMessages(finalMessages);
      saveMessages(finalMessages);
    } catch (err) {
      setError(err.message || 'Failed to get response. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = (content) => {
    navigator.clipboard.writeText(content);
  };

  const handleClearChat = () => {
    setMessages([]);
    saveMessages([]);
  };

  const handleModelChange = (modelId) => {
    setSelectedModel(modelId);
    saveConfig(apiKey, modelId);
  };

  const handleApiKeySave = () => {
    saveConfig(apiKey, selectedModel);
    setShowSettings(false);
    if (apiKey.trim()) {
      fetchModels();
    }
  };

  const quickPrompts = [
    { label: 'Help with literature review', prompt: 'How do I conduct an effective literature review for my research paper?' },
    { label: 'Research methodology', prompt: 'What research methodology would be best for studying the impact of AI in education?' },
    { label: 'Write abstract', prompt: 'Help me write an abstract for a paper on renewable energy integration in smart grids.' },
    { label: 'API Score guidance', prompt: 'How is the API score calculated in ScholarSync for different publication types?' },
  ];

  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToTxt = () => {
    const content = messages.map(m => 
      `${m.role === 'user' ? 'You' : 'Helix AI'}:\n${m.content}\n`
    ).join('\n---\n\n');
    downloadFile(content, 'helix-ai-chat.txt', 'text/plain');
    setShowExportMenu(false);
  };

  const exportToJson = () => {
    const exportData = {
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
        timestamp: new Date(m.timestamp).toISOString()
      })),
      exportedAt: new Date().toISOString(),
      settings: { selectedModel }
    };
    downloadFile(JSON.stringify(exportData, null, 2), 'helix-ai-chat.json', 'application/json');
    setShowExportMenu(false);
  };

  const exportToPdf = () => {
    const content = messages.map(m => 
      `<div style="margin-bottom: 20px; padding: 15px; background: ${m.role === 'user' ? '#f0f0f0' : '#e8f4fd'}; border-radius: 8px;">
        <strong>${m.role === 'user' ? 'You' : 'Helix AI'}:</strong>
        <p style="white-space: pre-wrap;">${m.content}</p>
      </div>`
    ).join('');

    const html = `<!DOCTYPE html>
<html>
<head>
  <title>Helix AI Chat Export</title>
  <style>
    body { font-family: sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #6366f1; }
    .meta { color: #666; font-size: 12px; margin-bottom: 20px; }
  </style>
</head>
<body>
  <h1>Helix AI Chat Export</h1>
  <p class="meta">Exported on ${new Date().toLocaleString()}</p>
  ${content}
</body>
</html>`;
    downloadFile(html, 'helix-ai-chat.html', 'text/html');
    setShowExportMenu(false);
  };

  const exportToLatex = () => {
    let latexContent = `\\documentclass[12pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{amsmath}
\\usepackage{graphicx}
\\usepackage{hyperref}
\\usepackage{geometry}
\\geometry{margin=1in}

\\title{ScholarSync - Helix AI Chat Export}
\\author{Exported on ${new Date().toLocaleDateString()}}
\\date{}

\\begin{document}

\\maketitle

`;

    messages.forEach((m, idx) => {
      if (m.role === 'user') {
        latexContent += `\\section*{User Message ${idx}}
\\begin{verbatim}
${m.content}
\\end{verbatim}

`;
      } else {
        latexContent += `\\section*{Helix AI Response ${idx}}
${m.content}

`;
      }
    });

    latexContent += `\\end{document}`;
    downloadFile(latexContent, 'helix-ai-chat.tex', 'application/x-latex');
    setShowExportMenu(false);
  };

  return (
    <div className="helix-ai-page">
      <div className="helix-header">
        <div className="helix-title">
          <div className="helix-logo">
            <Bot size={28} />
            <span className="helix-badge">AI</span>
          </div>
          <div>
            <h1>Helix AI</h1>
            <p>Your Research Assistant</p>
          </div>
        </div>
        <div className="helix-actions">
          {messages.length > 0 && (
            <div className="export-dropdown">
              <button className="btn-icon-text" onClick={() => setShowExportMenu(!showExportMenu)}>
                <Download size={18} />
                <span>Export</span>
              </button>
              {showExportMenu && (
                <div className="export-menu">
                  <button onClick={exportToTxt}><FileText size={16} /> Text (.txt)</button>
                  <button onClick={exportToJson}><FileCode size={16} /> JSON (.json)</button>
                  <button onClick={exportToPdf}><FileSearch size={16} /> PDF/HTML (.html)</button>
                  <button onClick={exportToLatex}><FileCode size={16} /> LaTeX (.tex)</button>
                </div>
              )}
            </div>
          )}
          <button className="btn-icon-text" onClick={() => setShowSettings(!showSettings)}>
            <SettingsIconAlt size={18} />
            <span>Settings</span>
          </button>
          <button className="btn-icon-text" onClick={handleClearChat}>
            <Trash2 size={18} />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="helix-settings-panel">
          <h3><SettingsIconAlt size={18} /> API Configuration</h3>
          <div className="settings-form">
            <div className="form-group">
              <label>OpenRouter API Key</label>
              <div className="api-key-input">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-or-v1-..."
                />
                <button className="btn-link" onClick={fetchModels} disabled={!apiKey.trim() || isLoadingModels}>
                  {isLoadingModels ? <Loader size={14} className="spin" /> : <RefreshCw size={14} />}
                  Load Models
                </button>
              </div>
              <small>Your API key is stored locally and never shared.</small>
            </div>
            <div className="form-group">
              <label>AI Model</label>
              <select value={selectedModel} onChange={(e) => handleModelChange(e.target.value)}>
                {availableModels.length > 0 ? (
                  availableModels.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.provider})
                    </option>
                  ))
                ) : (
                  <option value="openai/gpt-4o-mini">GPT-4o Mini (OpenAI) - Enter API key to load more</option>
                )}
              </select>
              {availableModels.find(m => m.id === selectedModel) && (
                <small>{availableModels.find(m => m.id === selectedModel).desc}</small>
              )}
            </div>
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={enableWebSearch}
                  onChange={(e) => {
                    setEnableWebSearch(e.target.checked);
                    saveConfig(apiKey, selectedModel);
                  }}
                />
                <Search size={16} />
                Enable Web Search
              </label>
              <small>Allow AI to search the web for up-to-date information and citations.</small>
            </div>
            <button className="btn-primary" onClick={handleApiKeySave}>
              <Save size={16} /> Save Settings
            </button>
          </div>
        </div>
      )}

      {!apiKey && (
        <div className="helix-welcome">
          <div className="welcome-icon">
            <Bot size={64} />
          </div>
          <h2>Welcome to Helix AI</h2>
          <p>Your intelligent research assistant powered by advanced AI models through OpenRouter.</p>
          <div className="setup-steps">
            <h4>To get started:</h4>
            <ol>
              <li>Click the <strong>Settings</strong> button above</li>
              <li>Enter your OpenRouter API key</li>
              <li>Click <strong>Load Models</strong></li>
              <li>Select your preferred AI model</li>
              <li>Start chatting with Helix AI!</li>
            </ol>
          </div>
          <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="btn-primary">
            <ExternalLink size={16} /> Get OpenRouter API Key
          </a>
        </div>
      )}

      <div className="helix-chat-container">
        {messages.length === 0 && apiKey && (
          <div className="quick-prompts">
            <h4>Quick Prompts</h4>
            <div className="prompts-grid">
              {quickPrompts.map((qp, idx) => (
                <button key={idx} className="prompt-card" onClick={() => setInputMessage(qp.prompt)}>
                  <SparklesIcon size={16} />
                  <span>{qp.label}</span>
                  <ChevronRight size={14} />
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="messages-container">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.role}`}>
              <div className="message-avatar">
                {msg.role === 'user' ? (
                  <div className="user-avatar">{(user?.username || 'U')[0].toUpperCase()}</div>
                ) : (
                  <div className="ai-avatar"><Bot size={20} /></div>
                )}
              </div>
              <div className="message-content">
                <div className="message-header">
                  <span className="message-role">{msg.role === 'user' ? (user?.username || 'User') : 'Helix AI'}</span>
                  {msg.model && <span className="message-model">{msg.model.split('/')[1]}</span>}
                </div>
                <div className="message-text" dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.content) }} />
                <div className="message-actions">
                  <button onClick={() => handleCopyMessage(msg.content)} title="Copy">
                    <Copy size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message assistant loading">
              <div className="message-avatar">
                <div className="ai-avatar"><Bot size={20} /></div>
              </div>
              <div className="message-content">
                <div className="message-text">
                  <span className="typing-indicator">
                    <span></span><span></span><span></span>
                  </span>
                </div>
              </div>
            </div>
          )}
          {error && (
            <div className="error-message">
              <AlertTriangle size={16} />
              <span>{error}</span>
              <button onClick={() => setError('')}><X size={16} /></button>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {apiKey && (
          <div className={`helix-input-container ${timerExpired && aiTimer.enabled ? 'timer-disabled' : ''}`}>
            <div className="input-row">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                placeholder="Ask Helix AI about research, writing, methodology..."
                disabled={isLoading || (aiTimer.enabled && timerExpired)}
              />
              <button 
                onClick={handleSendMessage} 
                disabled={!inputMessage.trim() || isLoading || (aiTimer.enabled && timerExpired)}
              >
                {isLoading ? <Loader size={20} className="spin" /> : <Send size={20} />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AboutPage() {
  const { settings } = useSettings();
  const { user } = useAuth();
  const [editingContent, setEditingContent] = useState(null);
  const [editForm, setEditForm] = useState({});
  const navigate = useNavigate();

  const isAdmin = user?.role === 'college_admin' || user?.role === 'research_cell_admin';

  const aboutContent = settings.aboutContent || {};
  const modules = aboutContent.modules || [
    { id: 1, title: 'Dashboard', icon: 'BarChart3', description: 'Personalized dashboard with statistics and quick actions', features: ['Statistics', 'Charts', 'Quick Actions', 'Notifications'] },
    { id: 2, title: 'Research Feed', icon: 'BookOpen', description: 'Browse and filter research publications', features: ['Filter', 'Search', 'Export'] },
    { id: 3, title: 'Submit Research', icon: 'Plus', description: 'Submit new research with multi-language support', features: ['Multi-Language', 'API Score', 'File Upload'] },
    { id: 4, title: 'Helix AI', icon: 'Bot', description: 'AI-powered research assistant with web search', features: ['Web Search', 'Export', 'LaTeX'] }
  ];

  const techStack = [
    { name: 'React', version: '19.x', description: 'UI framework with hooks and context API for state management' },
    { name: 'Vite', version: '8.x', description: 'Lightning-fast build tool with instant server start' },
    { name: 'React Router', version: '7.x', description: 'Client-side routing with nested routes and layouts' },
    { name: 'Lucide React', version: '1.8.x', description: 'Beautiful, consistent icon library' },
    { name: 'OpenRouter API', version: 'v1', description: 'Unified API for accessing multiple LLM models' },
    { name: 'LocalStorage', version: 'API', description: 'Client-side data persistence with JSON serialization' }
  ];

  const databaseTypes = [
    {
      type: 'Local Storage',
      icon: HardDrive,
      description: 'Browser-based storage using localStorage API - perfect for demos and single-user environments',
      pros: ['Zero configuration', 'Works offline', 'Instant data access', 'Easy backup via JSON export'],
      cons: ['5-10 MB storage limit', 'Browser-specific', 'Single device only', 'No concurrent access']
    },
    {
      type: 'SQL Database',
      icon: Server,
      description: 'MySQL, PostgreSQL, SQLite, or SQL Server for enterprise deployments',
      pros: ['Unlimited scalability', 'ACID compliance', 'Complex queries', 'Multi-user concurrent access'],
      cons: ['Requires backend API', 'Server infrastructure', 'Setup complexity', 'Regular maintenance']
    },
    {
      type: 'Cloud Database',
      icon: Cloud,
      description: 'Firebase, Supabase, MongoDB Atlas for cloud-native applications',
      pros: ['Managed infrastructure', 'Real-time sync', 'Automatic backups', 'Global availability'],
      cons: ['Requires internet', 'Vendor lock-in risk', 'Cost at scale', 'Learning curve']
    }
  ];

  const workflowSteps = [
    { step: 1, title: 'Researcher Submit', description: 'Faculty submits research proposal with all details including multi-language metadata', color: '#3b82f6' },
    { step: 2, title: 'HOD Review', description: 'Department Head reviews for departmental relevance and approves or rejects', color: '#8b5cf6' },
    { step: 3, title: 'Research Cell', description: 'Cell admin evaluates technical merit, API scoring, and compliance standards', color: '#10b981' },
    { step: 4, title: 'College Approval', description: 'College Admin provides final institutional approval and certification', color: '#f59e0b' }
  ];

  const capabilities = [
    { icon: FileText, title: 'Multi-Format Submissions', desc: 'Support for journal articles, conference papers, books, patents, theses, and reviews with detailed metadata' },
    { icon: Calculator, title: 'API Score Calculation', desc: 'Automatic Academic Performance Index scoring based on publication type, authorship position, and department' },
    { icon: FileSearch, title: 'Reports & Analytics', desc: 'Comprehensive reports with department-wise, faculty-wise, and researcher rankings' },
    { icon: Users, title: 'Role-Based Access', desc: 'Four distinct roles: Researcher, HOD, Research Cell Admin, College Admin with specific permissions' },
    { icon: Bot, title: 'Helix AI Assistant', desc: 'AI-powered chatbot with web search, LaTeX support, and exportable responses' },
    { icon: Globe, title: 'Multi-Language Support', desc: 'Submit research content in 19 Indian and international languages' },
    { icon: Shield, title: 'Data Security', desc: 'Protected routes, role-based access control, and encrypted local storage' },
    { icon: Download, title: 'Import/Export', desc: 'Backup and restore data in JSON or CSV format, bulk user management' }
  ];

  const systemRequirements = [
    { name: 'Browser', details: 'Chrome 90+, Firefox 88+, Safari 14+, Edge 90+', icon: Globe },
    { name: 'JavaScript', details: 'ES6+ enabled (modern browsers)', icon: Code },
    { name: 'Storage', details: '50MB minimum for app + data', icon: HardDrive },
    { name: 'Network', details: 'Required for cloud databases & AI features', icon: Zap }
  ];

  const quickStartSteps = [
    { step: 1, title: 'Configure Settings', desc: 'Set up institution details, branding, and database in Settings' },
    { step: 2, title: 'Add Users', desc: 'Create user accounts and assign roles (Researcher, HOD, RC Admin, College Admin)' },
    { step: 3, title: 'Submit Research', desc: 'Researchers submit publications with multi-language metadata' },
    { step: 4, title: 'Review & Approve', desc: 'HOD and Research Cell review, then College Admin provides final approval' },
    { step: 5, title: 'Generate Reports', desc: 'View statistics, export data, and track API scores' }
  ];

  return (
    <div className="about-page">
      <div className="about-header">
        <div className="about-header-content">
          {settings.logoUrl ? (
            <img src={settings.logoUrl} alt="Logo" className="about-logo" />
          ) : (
            <div className="about-logo-icon">
              <GraduationCap size={40} />
            </div>
          )}
          <div>
            <h1>{settings.institutionName}</h1>
            <p>{settings.institutionTagline}</p>
          </div>
        </div>
        <div className="about-badges">
          <span className="badge"><Zap size={14} /> v1.0.0</span>
          <span className="badge"><Shield size={14} /> Secure</span>
          <span className="badge"><Globe size={14} /> Multi-Language</span>
        </div>
      </div>

      <section className="about-section">
        <div className="section-header">
          <h2><Info size={24} /> About ScholarSync</h2>
          {isAdmin && (
            <button className="btn-edit" onClick={() => navigate('/settings?tab=about')}>
              <Edit3 size={16} /> Edit
            </button>
          )}
        </div>
        <p className="about-description">
          {aboutContent.description || `${settings.institutionName} is a comprehensive Research Data Management Portal designed to streamline the submission, review, and approval process for academic research proposals. The platform supports multi-language submissions, AI-powered research assistance, and comprehensive API score calculation.`}
        </p>
      </section>

      <section className="about-section">
        <div className="section-header">
          <h2><Rocket size={24} /> Quick Start Guide</h2>
        </div>
        <div className="quickstart-timeline">
          {quickStartSteps.map((item, index) => (
            <div key={item.step} className="quickstart-step">
              <div className="quickstart-number">{item.step}</div>
              <div className="quickstart-content">
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="about-section">
        <h2><Workflow size={24} /> Approval Workflow</h2>
        <p className="section-intro">Research submissions flow through a multi-level approval process ensuring quality and compliance.</p>
        <div className="workflow-timeline">
          {workflowSteps.map((item, index) => (
            <div key={item.step} className="workflow-step">
              <div className="workflow-connector" style={{ display: index === workflowSteps.length - 1 ? 'none' : 'block' }}></div>
              <div className="workflow-icon" style={{ backgroundColor: item.color }}>
                {index + 1}
              </div>
              <div className="workflow-content">
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="about-section">
        <div className="section-header">
          <h2><Layers size={24} /> Core Modules</h2>
          {isAdmin && (
            <button className="btn-edit" onClick={() => navigate('/settings?tab=about')}>
              <Edit3 size={16} /> Edit
            </button>
          )}
        </div>
        <div className="modules-grid">
          {modules.map((mod) => (
            <div key={mod.id} className="module-card">
              <div className="module-icon">
                <Layers size={28} />
              </div>
              <div className="module-content">
                <h3>{mod.title}</h3>
                <p>{mod.description}</p>
                <ul className="module-features">
                  {(mod.features || []).map((feature, index) => (
                    <li key={index}><CheckCircle size={14} /> {feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="about-section">
        <h2><Sparkles size={24} /> Key Capabilities</h2>
        <div className="capabilities-grid">
          {capabilities.map((cap, index) => (
            <div key={index} className="capability-card">
              <div className="capability-icon">
                <cap.icon size={28} />
              </div>
              <h4>{cap.title}</h4>
              <p>{cap.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="about-section">
        <h2><Database size={24} /> Database Options</h2>
        <p className="section-intro">Choose the database that best fits your deployment requirements.</p>
        <div className="db-options-grid">
          {databaseTypes.map((db) => (
            <div key={db.type} className="db-option-card">
              <div className="db-option-icon">
                <db.icon size={32} />
              </div>
              <h3>{db.type}</h3>
              <p>{db.description}</p>
              <div className="db-pros-cons">
                <div className="db-pros">
                  <strong>Pros:</strong>
                  <ul>
                    {db.pros.map((pro) => (
                      <li key={pro}>{pro}</li>
                    ))}
                  </ul>
                </div>
                <div className="db-cons">
                  <strong>Cons:</strong>
                  <ul>
                    {db.cons.map((con) => (
                      <li key={con}>{con}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="about-section">
        <h2><Code size={24} /> Technical Stack</h2>
        <div className="tech-stack-grid">
          {techStack.map((tech) => (
            <div key={tech.name} className="tech-card">
              <h4>{tech.name}</h4>
              <span className="tech-version">{tech.version}</span>
              <p>{tech.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="about-section">
        <h2><SettingsIcon size={24} /> System Requirements</h2>
        <div className="requirements-grid">
          {systemRequirements.map((req, index) => (
            <div key={index} className="requirement-item">
              <div className="req-icon"><req.icon size={20} /></div>
              <div className="req-content">
                <h4>{req.name}</h4>
                <p>{req.details}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="about-section">
        <div className="section-header">
          <h2><Lock size={24} /> Security & Access Control</h2>
          {isAdmin && (
            <button className="btn-edit" onClick={() => navigate('/settings?tab=about')}>
              <Edit3 size={16} /> Edit
            </button>
          )}
        </div>
        <div className="security-features">
          {(aboutContent.securityFeatures || [
            { id: 1, title: 'Role-Based Access Control', description: 'Four distinct user roles with specific permissions and capabilities' },
            { id: 2, title: 'Protected Routes', description: 'All routes are protected and require authentication' },
            { id: 3, title: 'Local Data Encryption', description: 'Data stored locally is protected with browser security' },
            { id: 4, title: 'API Key Security', description: 'AI API keys stored locally and never transmitted to third parties' }
          ]).map((feature) => (
            <div key={feature.id} className="security-item">
              <Shield size={20} />
              <div>
                <h4>{feature.title}</h4>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="about-footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <GraduationCap size={32} />
              <span>{settings.institutionName}</span>
            </div>
            <p>A comprehensive Research Data Management Portal for academic institutions.</p>
            <div className="footer-social">
              <span className="social-badge"><BookOpen size={14} /> Research Portal</span>
              <span className="social-badge"><Bot size={14} /> AI Powered</span>
            </div>
          </div>
          <div className="footer-section">
            <h4>Navigation</h4>
            <ul>
              <li><Link to="/dashboard"><BarChart3 size={14} /> Dashboard</Link></li>
              <li><Link to="/research"><BookOpen size={14} /> Research Feed</Link></li>
              <li><Link to="/submit"><Plus size={14} /> Submit Research</Link></li>
              <li><Link to="/appendix"><Book size={14} /> Research Appendix</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Resources</h4>
            <ul>
              <li><Link to="/about"><Info size={14} /> Documentation</Link></li>
              <li><Link to="/settings"><SettingsIconAlt size={14} /> Settings</Link></li>
              <li><Link to="/profile"><User size={14} /> My Profile</Link></li>
              <li><Link to="/helix-ai"><Bot size={14} /> Helix AI</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact Us</h4>
            <ul>
              <li><Mail size={14} /> {settings.contactEmail || 'Not configured'}</li>
              <li><Phone size={14} /> {settings.contactPhone || 'Not configured'}</li>
              <li><Globe size={14} /> {settings.website || 'Not configured'}</li>
              <li><MapPin size={14} /> {settings.address || 'Not configured'}</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} {settings.institutionName}. All rights reserved.</p>
          <p>Built with React + Vite | Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
}

function AppendixPage() {
  const { settings } = useSettings();
  const { user } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.role === 'college_admin' || user?.role === 'research_cell_admin';
  const appendixContent = settings.appendixContent || {};

  const academicDatabases = appendixContent.academicDatabases || [];
  const publishers = appendixContent.publishers || [];
  const searchEngines = appendixContent.searchEngines || [];
  const repositories = appendixContent.repositories || [];
  const aiTools = appendixContent.aiTools || [];
  const citationTools = appendixContent.citationTools || [];

  const LinkCard = ({ name, url, desc, icon }) => (
    <a href={url} target="_blank" rel="noopener noreferrer" className="link-card">
      <div className="link-icon">{icon}</div>
      <div className="link-content">
        <h4>{name}</h4>
        <p>{desc}</p>
      </div>
      <ExternalLink size={16} className="link-arrow" />
    </a>
  );

  return (
    <div className="about-page">
      <div className="about-header appendix-header">
        <div className="about-header-content">
          {settings.logoUrl ? (
            <img src={settings.logoUrl} alt="Logo" className="about-logo" />
          ) : (
            <div className="logo-ss appendix-logo">SS</div>
          )}
          <div>
            <h1>Research Appendix</h1>
            <p>Essential Resources for Academic Researchers</p>
          </div>
        </div>
        <div className="about-badges">
          <span className="badge">Curated Collection</span>
          <span className="badge">Regularly Updated</span>
          {isAdmin && (
            <button className="btn-edit light" onClick={() => navigate('/settings?tab=appendix')}>
              <Edit3 size={14} /> Manage
            </button>
          )}
        </div>
      </div>

      <section className="about-section">
        <div className="section-header">
          <h2><Search size={24} /> Academic Databases & Library Networks</h2>
          {isAdmin && (
            <button className="btn-edit" onClick={() => navigate('/settings?tab=appendix')}>
              <Edit3 size={16} /> Edit
            </button>
          )}
        </div>
        <p className="section-intro">Essential databases for accessing peer-reviewed journals, articles, and research publications.</p>
        <div className="links-grid">
          {academicDatabases.map((link) => (
            <LinkCard key={link.id || link.name} {...link} />
          ))}
        </div>
      </section>

      <section className="about-section">
        <div className="section-header">
          <h2><Book size={24} /> Major Publishers</h2>
          {isAdmin && (
            <button className="btn-edit" onClick={() => navigate('/settings?tab=appendix')}>
              <Edit3 size={16} /> Edit
            </button>
          )}
        </div>
        <p className="section-intro">Leading academic publishers offering journals, books, and research resources.</p>
        <div className="links-grid">
          {publishers.map((link) => (
            <LinkCard key={link.id || link.name} {...link} />
          ))}
        </div>
      </section>

      <section className="about-section">
        <div className="section-header">
          <h2><GlobeIcon size={24} /> Research Search Engines</h2>
          {isAdmin && (
            <button className="btn-edit" onClick={() => navigate('/settings?tab=appendix')}>
              <Edit3 size={16} /> Edit
            </button>
          )}
        </div>
        <p className="section-intro">Free and paid search engines for discovering scholarly literature and research papers.</p>
        <div className="links-grid">
          {searchEngines.map((link) => (
            <LinkCard key={link.id || link.name} {...link} />
          ))}
        </div>
      </section>

      <section className="about-section">
        <div className="section-header">
          <h2><Archive size={24} /> Open Access Repositories</h2>
          {isAdmin && (
            <button className="btn-edit" onClick={() => navigate('/settings?tab=appendix')}>
              <Edit3 size={16} /> Edit
            </button>
          )}
        </div>
        <p className="section-intro">Preprint servers and open access repositories for sharing and discovering research.</p>
        <div className="links-grid">
          {repositories.map((link) => (
            <LinkCard key={link.id || link.name} {...link} />
          ))}
        </div>
      </section>

      <section className="about-section">
        <div className="section-header">
          <h2><Sparkles size={24} /> AI Research Tools</h2>
          {isAdmin && (
            <button className="btn-edit" onClick={() => navigate('/settings?tab=appendix')}>
              <Edit3 size={16} /> Edit
            </button>
          )}
        </div>
        <p className="section-intro">Artificial intelligence tools to assist with literature review, writing, and research analysis.</p>
        <div className="links-grid">
          {aiTools.map((link) => (
            <LinkCard key={link.id || link.name} {...link} />
          ))}
        </div>
      </section>

      <section className="about-section">
        <div className="section-header">
          <h2><FileText size={24} /> Citation & Writing Tools</h2>
          {isAdmin && (
            <button className="btn-edit" onClick={() => navigate('/settings?tab=appendix')}>
              <Edit3 size={16} /> Edit
            </button>
          )}
        </div>
        <p className="section-intro">Tools for managing citations, references, and academic writing.</p>
        <div className="links-grid">
          {citationTools.map((link) => (
            <LinkCard key={link.id || link.name} {...link} />
          ))}
        </div>
      </section>

      <section className="about-section quick-tips">
        <div className="section-header">
          <h2><Award size={24} /> Quick Research Tips</h2>
          {isAdmin && (
            <button className="btn-edit" onClick={() => navigate('/settings?tab=appendix')}>
              <Edit3 size={16} /> Edit
            </button>
          )}
        </div>
        <div className="tips-grid">
          <div className="tip-card">
            <h4>Start with Google Scholar</h4>
            <p>Begin your literature search here for a broad overview of your topic.</p>
          </div>
          <div className="tip-card">
            <h4>Use Boolean Operators</h4>
            <p>Combine keywords with AND, OR, NOT for more precise searches.</p>
          </div>
          <div className="tip-card">
            <h4>Check References</h4>
            <p>Review the bibliography of relevant papers for additional sources.</p>
          </div>
          <div className="tip-card">
            <h4>Set Alerts</h4>
            <p>Create Google Scholar alerts for keywords relevant to your research.</p>
          </div>
          <div className="tip-card">
            <h4>Use Citation Networks</h4>
            <p>Explore Connected Papers to visualize paper relationships.</p>
          </div>
          <div className="tip-card">
            <h4>Organize with Zotero</h4>
            <p>Use reference managers to organize and cite your sources.</p>
          </div>
        </div>
      </section>

      <div className="about-footer">
        <p>&copy; {new Date().getFullYear()} {settings.institutionName}. All rights reserved.</p>
        <p>These resources are provided for educational purposes.</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/appendix" element={<AppendixPage />} />
            <Route path="/*" element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/feed" element={<Feed />} />
                    <Route path="/research" element={<ResearchFeed />} />
                    <Route path="/statistics" element={<Statistics />} />
                    <Route path="/reports" element={
                      <ProtectedRoute allowedRoles={['dept_hod', 'research_cell_admin', 'college_admin']}>
                        <Reports />
                      </ProtectedRoute>
                    } />
                    <Route path="/helix-ai" element={<HelixAI />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/submit" element={
                      <ProtectedRoute allowedRoles={['researcher']}>
                        <SubmitResearch />
                      </ProtectedRoute>
                    } />
                    <Route path="/approvals" element={
                      <ProtectedRoute allowedRoles={['dept_hod', 'research_cell_admin', 'college_admin']}>
                        <Approvals />
                      </ProtectedRoute>
                    } />
                    <Route path="/settings" element={
                      <ProtectedRoute allowedRoles={['college_admin']}>
                        <Settings />
                      </ProtectedRoute>
                    } />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
