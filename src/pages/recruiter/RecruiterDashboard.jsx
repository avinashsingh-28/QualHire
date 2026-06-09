import { useNavigate } from 'react-router-dom';
import {
  Users, Briefcase, Calendar, TrendingUp, Plus,
  Clock, MapPin, Search, Filter, ArrowRight,
  CheckCircle, XCircle, Eye, MessageSquare
} from 'lucide-react';
import { StatCard } from '../../components/Card';
import Button from '../../components/Button';
import SearchBar from '../../components/SearchBar';
import useAuth from '../../hooks/useAuth';
import '../candidate/Dashboard.css';

const STATS = [
  { label: 'Active Jobs',       value: '8',   trend: '+2',  trendDir: 'up',   trendLabel: 'this month',  icon: <Briefcase size={20} />, iconBg: 'rgba(99,102,241,0.12)', iconColor: 'var(--color-primary)' },
  { label: 'Total Applicants',  value: '143', trend: '+28', trendDir: 'up',   trendLabel: 'this week',   icon: <Users size={20} />,     iconBg: 'rgba(34,197,94,0.12)',  iconColor: 'var(--color-success)' },
  { label: 'Interviews Sched.', value: '12',  trend: '+5',  trendDir: 'up',   trendLabel: 'this week',   icon: <Calendar size={20} />,  iconBg: 'rgba(245,158,11,0.12)', iconColor: 'var(--color-warning)' },
  { label: 'Time to Hire',      value: '18d', trend: '-3d', trendDir: 'up',   trendLabel: 'improved',    icon: <TrendingUp size={20} />,iconBg: 'rgba(6,182,212,0.12)',  iconColor: 'var(--color-accent)' },
];

const CANDIDATES = [
  { id: 1, name: 'Alex Johnson',    role: 'Frontend Engineer', stage: 'interview',  score: 94, location: 'SF, CA',    skills: ['React', 'TypeScript'] },
  { id: 2, name: 'Maria Garcia',    role: 'Backend Developer', stage: 'review',     score: 88, location: 'Remote',    skills: ['Node.js', 'Go'] },
  { id: 3, name: 'James Chen',      role: 'Product Designer',  stage: 'applied',    score: 91, location: 'NY, NY',    skills: ['Figma', 'Research'] },
  { id: 4, name: 'Priya Sharma',    role: 'Data Scientist',    stage: 'offer',      score: 96, location: 'Austin, TX',skills: ['Python', 'ML'] },
  { id: 5, name: 'Carlos Rivera',   role: 'DevOps Engineer',   stage: 'rejected',   score: 72, location: 'Remote',    skills: ['K8s', 'AWS'] },
];

const PIPELINE = [
  { label: 'Applied',   count: 143, color: 'var(--color-primary)', pct: '100%' },
  { label: 'Screened',  count: 62,  color: 'var(--color-info)',    pct: '43%' },
  { label: 'Interview', count: 24,  color: 'var(--color-warning)', pct: '17%' },
  { label: 'Offer',     count: 8,   color: 'var(--color-success)', pct: '6%' },
  { label: 'Hired',     count: 3,   color: '#22c55e',              pct: '2%' },
];

const JOBS = [
  { id: 1, title: 'Senior Frontend Engineer', applicants: 38, status: 'active',  posted: '3d ago',  closes: '27d' },
  { id: 2, title: 'Backend Developer (Go)',    applicants: 21, status: 'active',  posted: '5d ago',  closes: '25d' },
  { id: 3, title: 'Product Designer',         applicants: 54, status: 'active',  posted: '1w ago',  closes: '21d' },
  { id: 4, title: 'Data Scientist',           applicants: 30, status: 'paused',  posted: '2w ago',  closes: '14d' },
];

const STAGE_CONFIG = {
  applied:   { label: 'Applied',    class: 'badge badge-info' },
  review:    { label: 'In Review',  class: 'badge badge-warning' },
  interview: { label: 'Interview',  class: 'badge badge-primary' },
  offer:     { label: 'Offer Out',  class: 'badge badge-success' },
  rejected:  { label: 'Rejected',   class: 'badge badge-danger' },
};

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className="dashboard-page">
      {/* Welcome banner */}
      <div className="welcome-banner">
        <div className="welcome-banner-content">
          <h1 className="welcome-banner-title">Welcome back, {firstName}! 🎯</h1>
          <p className="welcome-banner-subtitle">
            You have 12 interviews scheduled this week and 28 new applicants to review.
          </p>
        </div>
        <div className="welcome-banner-actions">
          <Button
            variant="secondary"
            leftIcon={<Plus size={16} />}
            onClick={() => navigate('/recruiter/jobs')}
            id="post-job-btn"
          >
            Post a Job
          </Button>
          <Button
            as="div" variant="ghost"
            style={{ color: 'rgba(255,255,255,0.85)', borderColor: 'rgba(255,255,255,0.25)', border: '1.5px solid rgba(255,255,255,0.25)', cursor: 'pointer' }}
            onClick={() => navigate('/recruiter/candidates')}
          >
            View Pipeline
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        {STATS.map(s => (
          <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} iconBg={s.iconBg} iconColor={s.iconColor} trend={s.trend} trendDirection={s.trendDir} trendLabel={s.trendLabel} />
        ))}
      </div>

      {/* Main grid */}
      <div className="dashboard-grid-3">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Candidates */}
          <div className="section-card">
            <div className="section-card-header">
              <h2 className="section-card-title">Candidate Pipeline</h2>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <Button variant="ghost" size="sm" leftIcon={<Filter size={14} />}>Filter</Button>
                <Button variant="ghost" size="sm" rightIcon={<ArrowRight size={14} />} onClick={() => navigate('/recruiter/candidates')}>All</Button>
              </div>
            </div>
            <div className="data-table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
              <table className="data-table">
                <thead>
                  <tr><th>Candidate</th><th>Role</th><th>Stage</th><th>Score</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {CANDIDATES.map(c => (
                    <tr key={c.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                          <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: 'white', flexShrink: 0 }}>
                            {c.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="data-table-name">{c.name}</p>
                            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{c.location}</p>
                          </div>
                        </div>
                      </td>
                      <td>{c.role}</td>
                      <td><span className={STAGE_CONFIG[c.stage].class}>{STAGE_CONFIG[c.stage].label}</span></td>
                      <td><span style={{ fontWeight: 'var(--font-semibold)', color: c.score >= 90 ? 'var(--color-success)' : 'var(--color-text-primary)' }}>{c.score}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                          <button style={{ padding: '4px', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--color-surface-2)', cursor: 'pointer', color: 'var(--color-text-secondary)', display: 'flex' }} title="View Profile"><Eye size={14} /></button>
                          <button style={{ padding: '4px', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--color-surface-2)', cursor: 'pointer', color: 'var(--color-text-secondary)', display: 'flex' }} title="Message"><MessageSquare size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Active Jobs */}
          <div className="section-card">
            <div className="section-card-header">
              <h2 className="section-card-title">Active Job Postings</h2>
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight size={14} />} onClick={() => navigate('/recruiter/jobs')}>Manage</Button>
            </div>
            <div className="data-table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
              <table className="data-table">
                <thead><tr><th>Job Title</th><th>Applicants</th><th>Status</th><th>Closes</th></tr></thead>
                <tbody>
                  {JOBS.map(j => (
                    <tr key={j.id}>
                      <td className="data-table-name">{j.title}</td>
                      <td>{j.applicants}</td>
                      <td><span className={`badge ${j.status === 'active' ? 'badge-success' : 'badge-warning'}`}>{j.status}</span></td>
                      <td style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)' }}>in {j.closes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Pipeline Funnel */}
          <div className="section-card">
            <div className="section-card-header">
              <h2 className="section-card-title">Hiring Funnel</h2>
              <span className="badge badge-primary">This Month</span>
            </div>
            <div className="section-card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {PIPELINE.map(({ label, count, color, pct }) => (
                  <div key={label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--color-text-secondary)' }}>{label}</span>
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-primary)' }}>{count}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-bar-fill" style={{ width: pct, background: color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="section-card">
            <div className="section-card-header"><h2 className="section-card-title">Quick Actions</h2></div>
            <div className="section-card-body">
              <div className="quick-actions">
                {[
                  { icon: <Plus size={20} />,         iconBg: 'rgba(99,102,241,0.12)', iconColor: 'var(--color-primary)', label: 'Post Job',         desc: 'Create a posting',   to: '/recruiter/jobs/new' },
                  { icon: <Users size={20} />,        iconBg: 'rgba(34,197,94,0.12)',  iconColor: 'var(--color-success)', label: 'View Pipeline',    desc: 'See all candidates', to: '/recruiter/candidates' },
                  { icon: <Calendar size={20} />,     iconBg: 'rgba(245,158,11,0.12)', iconColor: 'var(--color-warning)', label: 'Schedule',         desc: 'Book interviews',    to: '/recruiter/interviews' },
                  { icon: <MessageSquare size={20} />,iconBg: 'rgba(6,182,212,0.12)',  iconColor: 'var(--color-accent)',  label: 'Messages',         desc: 'Inbox (2 unread)',   to: '/recruiter/messages' },
                ].map(({ icon, iconBg, iconColor, label, desc, to }) => (
                  <button key={label} className="quick-action-btn" onClick={() => navigate(to)}>
                    <div className="quick-action-icon" style={{ background: iconBg, color: iconColor }}>{icon}</div>
                    <p className="quick-action-label">{label}</p>
                    <p className="quick-action-desc">{desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
