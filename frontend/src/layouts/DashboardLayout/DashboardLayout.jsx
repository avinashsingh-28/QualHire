import { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard, Briefcase, FileText, Calendar, Users, Settings,
  Bell, Sun, Moon, ChevronDown, LogOut, User, ChevronLeft, ChevronRight,
  Menu, Shield, BookOpen, Star, BarChart3, MessageSquare, Search, ClipboardList,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useTheme from '../../hooks/useTheme';
import NotificationBadge from '../../components/NotificationBadge';
import SearchBar from '../../components/SearchBar';
import './DashboardLayout.css';

/* ---- Role-aware nav config ---- */
const NAV_CONFIG = {
  candidate: [
    { label: 'Dashboard',     icon: <LayoutDashboard size={18} />, to: '/candidate' },
    { label: 'Profile',       icon: <User size={18} />,            to: '/candidate/profile' },
    { label: 'Resume',        icon: <FileText size={18} />,        to: '/candidate/resume' },
    { label: 'Jobs',          icon: <Search size={18} />,          to: '/candidate/jobs' },
    { label: 'Applications',  icon: <Briefcase size={18} />,       to: '/candidate/applications', badge: 3 },
    { label: 'Assessments',   icon: <ClipboardList size={18} />,   to: '/candidate/assessments' },
    { label: 'Messages',      icon: <MessageSquare size={18} />,   to: '/candidate/messages', badge: 2 },
    { label: 'Mentorship',    icon: <BookOpen size={18} />,        to: '/candidate/mentorship' },
    { label: 'Notifications', icon: <Bell size={18} />,            to: '/candidate/notifications', badge: 5 },
  ],
  recruiter: [
    { label: 'Dashboard',     icon: <LayoutDashboard size={18} />, to: '/recruiter' },
    { label: 'Job Postings',  icon: <Briefcase size={18} />,       to: '/recruiter/jobs' },
    { label: 'Candidates',    icon: <Users size={18} />,           to: '/recruiter/candidates', badge: 12 },
    { label: 'Interviews',    icon: <Calendar size={18} />,        to: '/recruiter/interviews' },
    { label: 'Messages',      icon: <MessageSquare size={18} />,   to: '/recruiter/messages', badge: 2 },
  ],
  mentor: [
    { label: 'Dashboard',     icon: <LayoutDashboard size={18} />, to: '/mentor' },
    { label: 'Sessions',      icon: <BookOpen size={18} />,        to: '/mentor/sessions' },
    { label: 'My Mentees',    icon: <Users size={18} />,           to: '/mentor/candidates' },
    { label: 'Reviews',       icon: <Star size={18} />,            to: '/mentor/reviews' },
    { label: 'Messages',      icon: <MessageSquare size={18} />,   to: '/mentor/messages', badge: 1 },
  ],
  admin: [
    { label: 'Dashboard',     icon: <LayoutDashboard size={18} />, to: '/admin' },
    { label: 'Users',         icon: <Users size={18} />,           to: '/admin/users' },
    { label: 'Jobs',          icon: <Briefcase size={18} />,       to: '/admin/jobs' },
    { label: 'Analytics',     icon: <BarChart3 size={18} />,       to: '/admin/analytics' },
    { label: 'Moderation',    icon: <Shield size={18} />,          to: '/admin/moderation' },
  ],
};

const BOTTOM_NAV = [
  { label: 'Settings', icon: <Settings size={18} />, to: 'settings' },
];

const getInitials = (name = '') => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

const ROLES = ['candidate', 'recruiter', 'mentor', 'admin'];

/* ---- Sidebar Component ---- */
const Sidebar = ({ collapsed, setCollapsed, mobileOpen, onMobileClose }) => {
  const { user, role, switchRole, logout } = useAuth();
  const navigate = useNavigate();
  const navItems = NAV_CONFIG[role] || NAV_CONFIG.candidate;

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={onMobileClose} aria-hidden="true" />
      )}

      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Header */}
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo" aria-label="QualHire home">
            <div className="sidebar-logo-icon">Q</div>
            <span className="sidebar-logo-text">QualHire</span>
          </Link>
          <button
            className="sidebar-collapse-btn"
            onClick={() => setCollapsed(v => !v)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            id="sidebar-collapse-btn"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Role Badge */}
        <div className="sidebar-role-badge">
          <span className={`sidebar-role-pill role-${role}`}>
            {role}
          </span>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav" aria-label="Dashboard navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to.split('/').length === 2}
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
              title={collapsed ? item.label : undefined}
              onClick={onMobileClose}
            >
              <span className="sidebar-item-icon" aria-hidden="true">{item.icon}</span>
              <span className="sidebar-item-label">{item.label}</span>
              {item.badge && !collapsed && (
                <span className="sidebar-item-badge">{item.badge}</span>
              )}
            </NavLink>
          ))}

          <div style={{ flex: 1 }} />

          {BOTTOM_NAV.map(item => (
            <NavLink
              key={item.to}
              to={`/${role}/${item.to}`}
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
              title={collapsed ? item.label : undefined}
              onClick={onMobileClose}
            >
              <span className="sidebar-item-icon" aria-hidden="true">{item.icon}</span>
              <span className="sidebar-item-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div className="sidebar-footer">
          <div
            className="sidebar-user"
            role="button"
            tabIndex={0}
            title={collapsed ? user?.name : undefined}
          >
            <div className="sidebar-user-avatar">
              {getInitials(user?.name)}
            </div>
            <div className="sidebar-user-info">
              <p className="sidebar-user-name">{user?.name}</p>
              <p className="sidebar-user-role">{user?.title || role}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

/* ---- Profile Dropdown ---- */
const ProfileDropdown = () => {
  const { user, role, logout, switchRole } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="profile-dropdown-wrapper" ref={ref}>
      <button
        className="profile-avatar-btn"
        onClick={() => setOpen(v => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        id="profile-menu-btn"
      >
        <div className="profile-avatar">{getInitials(user?.name)}</div>
        <span className="profile-name">{user?.name}</span>
        <ChevronDown size={14} className={`profile-chevron ${open ? 'open' : ''}`} />
      </button>

      {open && (
        <div className="profile-dropdown-menu" role="menu">
          <div className="dropdown-user-info">
            <p className="dropdown-user-name">{user?.name}</p>
            <p className="dropdown-user-email">{user?.email}</p>
          </div>

          <div className="dropdown-items">
            <Link
              to={`/${role}/profile`}
              className="dropdown-item"
              onClick={() => setOpen(false)}
              role="menuitem"
            >
              <User size={15} />
              View Profile
            </Link>
            <Link
              to={`/${role}/settings`}
              className="dropdown-item"
              onClick={() => setOpen(false)}
              role="menuitem"
            >
              <Settings size={15} />
              Settings
            </Link>
          </div>

          {/* Role Switcher (demo) */}
          <div className="role-switcher">
            <p className="role-switcher-label">Demo: Switch Role</p>
            <div className="role-switcher-btns">
              {ROLES.map(r => (
                <button
                  key={r}
                  className={`role-switcher-btn ${r === role ? 'active' : ''}`}
                  onClick={() => {
                    switchRole(r);
                    navigate(`/${r}`);
                    setOpen(false);
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="dropdown-divider" />
          <div className="dropdown-items">
            <button
              className="dropdown-item danger"
              onClick={handleLogout}
              role="menuitem"
            >
              <LogOut size={15} />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ---- Dashboard Header ---- */
const DashboardHeader = ({ collapsed, setCollapsed, onMobileOpen }) => {
  const { toggle, isDark } = useTheme();

  return (
    <header className="dashboard-header">
      <div className="dashboard-header-left">
        {/* Mobile menu button */}
        <button
          className="header-icon-btn"
          onClick={onMobileOpen}
          aria-label="Open sidebar"
          id="mobile-menu-btn"
          style={{ display: 'none' }}
          data-mobile-only="true"
        >
          <Menu size={20} />
        </button>

        {/* Search */}
        <div className="dashboard-header-search">
          <SearchBar
            placeholder="Search jobs, candidates, sessions…"
            variant="filled"
            size="sm"
            onSearch={(q) => console.log('Search:', q)}
          />
        </div>
      </div>

      <div className="dashboard-header-right">
        {/* Theme toggle */}
        <button
          className="header-icon-btn"
          onClick={toggle}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          id="dashboard-theme-btn"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <button
          className="header-icon-btn"
          aria-label="Notifications (5 unread)"
          id="notifications-btn"
        >
          <NotificationBadge count={5} ping>
            <Bell size={18} />
          </NotificationBadge>
        </button>

        {/* Profile */}
        <ProfileDropdown />
      </div>
    </header>
  );
};

/* ---- DashboardLayout ---- */
const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Hide body scroll when mobile sidebar open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Show mobile menu button via JS (avoids CSS specificity issues)
  useEffect(() => {
    const btn = document.querySelector('[data-mobile-only="true"]');
    const handleResize = () => {
      if (btn) btn.style.display = window.innerWidth <= 1024 ? 'flex' : 'none';
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className={`dashboard-main ${collapsed ? 'sidebar-collapsed' : ''}`}>
        <DashboardHeader
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          onMobileOpen={() => setMobileOpen(true)}
        />
        <main className="dashboard-content" id="dashboard-main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
