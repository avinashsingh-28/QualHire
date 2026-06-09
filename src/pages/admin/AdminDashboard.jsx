import { useNavigate } from 'react-router-dom';
import { Users, Briefcase, BarChart3, Shield, TrendingUp, AlertTriangle, CheckCircle, ArrowRight, Eye, Trash2 } from 'lucide-react';
import { StatCard } from '../../components/Card';
import Button from '../../components/Button';
import useAuth from '../../hooks/useAuth';
import '../candidate/Dashboard.css';

const STATS = [
  { label: 'Total Users',      value: '52.4K', trend: '+1.2K', trendDir: 'up', trendLabel: 'this month', icon: <Users size={20} />,     iconBg: 'rgba(99,102,241,0.12)', iconColor: 'var(--color-primary)' },
  { label: 'Active Jobs',      value: '4,820', trend: '+320',  trendDir: 'up', trendLabel: 'this month', icon: <Briefcase size={20} />,  iconBg: 'rgba(34,197,94,0.12)',  iconColor: 'var(--color-success)' },
  { label: 'Monthly Revenue',  value: '$84K',  trend: '+12%',  trendDir: 'up', trendLabel: 'vs last mo.',icon: <TrendingUp size={20} />, iconBg: 'rgba(245,158,11,0.12)', iconColor: 'var(--color-warning)' },
  { label: 'Open Reports',     value: '7',     trend: '-3',    trendDir: 'up', trendLabel: 'resolved',   icon: <Shield size={20} />,    iconBg: 'rgba(239,68,68,0.12)',  iconColor: 'var(--color-danger)' },
];

const RECENT_USERS = [
  { name: 'Alex Johnson',  email: 'alex@ex.com',   role: 'candidate', joined: '2h ago',  status: 'active' },
  { name: 'Sarah Mitchell',email: 'sarah@ex.com',  role: 'recruiter', joined: '5h ago',  status: 'active' },
  { name: 'Dr. Raj Patel', email: 'raj@ex.com',    role: 'mentor',    joined: '1d ago',  status: 'active' },
  { name: 'Emma Wilson',   email: 'emma@ex.com',   role: 'candidate', joined: '2d ago',  status: 'suspended' },
  { name: 'Carlos Rivera', email: 'carlos@ex.com', role: 'recruiter', joined: '3d ago',  status: 'active' },
];

const REPORTS = [
  { type: 'Spam Job Posting',       target: 'FakeCorp Ltd.',   severity: 'high',   date: '1h ago' },
  { type: 'Inappropriate Content',  target: '@user_xyz',       severity: 'medium', date: '3h ago' },
  { type: 'Account Impersonation',  target: '@recruiter_abc',  severity: 'high',   date: '5h ago' },
  { type: 'Misleading Job Ad',      target: 'QuickHire Inc.',  severity: 'low',    date: '1d ago' },
];

const GROWTH_DATA = [
  { month: 'Jan', users: 38000, jobs: 3100 },
  { month: 'Feb', users: 41000, jobs: 3400 },
  { month: 'Mar', users: 44500, jobs: 3700 },
  { month: 'Apr', users: 46000, jobs: 4000 },
  { month: 'May', users: 49000, jobs: 4400 },
  { month: 'Jun', users: 52400, jobs: 4820 },
];

const ROLE_CONFIG = {
  candidate: { class: 'badge badge-primary' },
  recruiter: { class: 'badge badge-info' },
  mentor:    { class: 'badge badge-warning' },
  admin:     { class: 'badge badge-danger' },
};

const SEV_CONFIG = {
  high:   { class: 'badge badge-danger' },
  medium: { class: 'badge badge-warning' },
  low:    { class: 'badge badge-info' },
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.name?.split(' ')[0] || 'Admin';
  const maxUsers = Math.max(...GROWTH_DATA.map(d => d.users));

  return (
    <div className="dashboard-page">
      {/* Welcome */}
      <div className="welcome-banner" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
        <div className="welcome-banner-content">
          <h1 className="welcome-banner-title">Admin Panel — {firstName} 🛡️</h1>
          <p className="welcome-banner-subtitle">7 reports need attention. Platform health: <strong style={{ color: 'rgba(255,255,255,0.95)' }}>Good</strong></p>
        </div>
        <div className="welcome-banner-actions">
          <Button variant="secondary" leftIcon={<BarChart3 size={16} />} onClick={() => navigate('/admin/analytics')} id="analytics-btn">Analytics</Button>
          <Button as="div" variant="ghost" style={{ color: 'rgba(255,255,255,0.85)', borderColor: 'rgba(255,255,255,0.25)', border: '1.5px solid rgba(255,255,255,0.25)', cursor: 'pointer' }} onClick={() => navigate('/admin/moderation')}>Moderation</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        {STATS.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Main grid */}
      <div className="dashboard-grid-3">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Users Table */}
          <div className="section-card">
            <div className="section-card-header">
              <h2 className="section-card-title">Recent Registrations</h2>
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight size={14} />} onClick={() => navigate('/admin/users')}>All Users</Button>
            </div>
            <div className="data-table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
              <table className="data-table">
                <thead><tr><th>User</th><th>Role</th><th>Joined</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {RECENT_USERS.map(u => (
                    <tr key={u.email}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: 'white', flexShrink: 0 }}>
                            {u.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="data-table-name" style={{ fontSize: 'var(--text-xs)' }}>{u.name}</p>
                            <p style={{ fontSize: '10px', color: 'var(--color-text-tertiary)' }}>{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td><span className={ROLE_CONFIG[u.role].class}>{u.role}</span></td>
                      <td style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)' }}>{u.joined}</td>
                      <td><span className={`badge ${u.status === 'active' ? 'badge-success' : 'badge-danger'}`}>{u.status}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button style={{ padding: '4px', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--color-surface-2)', cursor: 'pointer', color: 'var(--color-text-secondary)', display: 'flex' }} title="View"><Eye size={12} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Reports */}
          <div className="section-card">
            <div className="section-card-header">
              <h2 className="section-card-title">Open Reports</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <span className="badge badge-danger">{REPORTS.length} open</span>
                <Button variant="ghost" size="sm" rightIcon={<ArrowRight size={14} />} onClick={() => navigate('/admin/moderation')}>All</Button>
              </div>
            </div>
            <div className="data-table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
              <table className="data-table">
                <thead><tr><th>Type</th><th>Target</th><th>Severity</th><th>Date</th><th>Action</th></tr></thead>
                <tbody>
                  {REPORTS.map((r, i) => (
                    <tr key={i}>
                      <td className="data-table-name" style={{ fontSize: 'var(--text-xs)' }}>{r.type}</td>
                      <td style={{ fontSize: 'var(--text-xs)' }}>{r.target}</td>
                      <td><span className={SEV_CONFIG[r.severity].class}>{r.severity}</span></td>
                      <td style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)' }}>{r.date}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button style={{ padding: '4px', borderRadius: 'var(--radius-md)', border: 'none', background: 'rgba(34,197,94,0.1)', cursor: 'pointer', color: 'var(--color-success)', display: 'flex' }} title="Resolve"><CheckCircle size={12} /></button>
                          <button style={{ padding: '4px', borderRadius: 'var(--radius-md)', border: 'none', background: 'rgba(239,68,68,0.1)', cursor: 'pointer', color: 'var(--color-danger)', display: 'flex' }} title="Remove"><Trash2 size={12} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right — Growth Chart */}
        <div>
          <div className="section-card">
            <div className="section-card-header">
              <h2 className="section-card-title">User Growth</h2>
              <span className="badge badge-success">6 Months</span>
            </div>
            <div className="section-card-body">
              {/* Simple bar chart */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {GROWTH_DATA.map(d => (
                  <div key={d.month}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', fontWeight: 'var(--font-medium)' }}>{d.month}</span>
                      <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-primary)' }}>{(d.users / 1000).toFixed(1)}K</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-bar-fill" style={{ width: `${(d.users / maxUsers) * 100}%`, background: 'linear-gradient(135deg, #ef4444, #dc2626)' }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Platform Health */}
              <div style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-5)', borderTop: '1px solid var(--color-border)' }}>
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>Platform Health</p>
                {[
                  { label: 'API Uptime',       value: '99.98%', ok: true },
                  { label: 'Avg Response',     value: '124ms',  ok: true },
                  { label: 'Error Rate',       value: '0.02%',  ok: true },
                  { label: 'Active Sessions',  value: '1,240',  ok: true },
                ].map(({ label, value, ok }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: ok ? 'var(--color-success)' : 'var(--color-danger)' }} />
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{label}</span>
                    </div>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-primary)' }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
