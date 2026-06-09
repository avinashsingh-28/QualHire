import { useNavigate } from 'react-router-dom';
import {
  FileText, Calendar, Search, BookOpen, TrendingUp,
  MapPin, Clock, Briefcase, Star, ArrowRight, CheckCircle,
  AlertCircle, Eye
} from 'lucide-react';
import { StatCard } from '../../components/Card';
import Button from '../../components/Button';
import EmptyState from '../../components/EmptyState';
import useAuth from '../../hooks/useAuth';
import './Dashboard.css';

/* ---- Mock Data ---- */
const STATS = [
  { label: 'Applications',   value: '12',  trend: '+3', trendDir: 'up',   trendLabel: 'this week',    icon: <FileText size={20} />,   iconBg: 'rgba(99,102,241,0.12)', iconColor: 'var(--color-primary)' },
  { label: 'Interviews',     value: '3',   trend: '+1', trendDir: 'up',   trendLabel: 'scheduled',    icon: <Calendar size={20} />,   iconBg: 'rgba(34,197,94,0.12)',  iconColor: 'var(--color-success)' },
  { label: 'Profile Views',  value: '248', trend: '+42', trendDir: 'up',  trendLabel: 'this week',    icon: <Eye size={20} />,        iconBg: 'rgba(6,182,212,0.12)',  iconColor: 'var(--color-accent)' },
  { label: 'Saved Jobs',     value: '7',   trend: null, trendDir: 'up',   trendLabel: null,            icon: <Star size={20} />,       iconBg: 'rgba(245,158,11,0.12)', iconColor: 'var(--color-warning)' },
];

const RECOMMENDED_JOBS = [
  { id: 1, title: 'Senior Frontend Engineer', company: 'Stripe', location: 'Remote', salary: '$160–200K', type: 'Full-time', logo: 'S',  match: 97 },
  { id: 2, title: 'Staff React Developer',     company: 'Linear', location: 'SF, CA', salary: '$150–180K', type: 'Full-time', logo: 'L',  match: 93 },
  { id: 3, title: 'Frontend Architect',        company: 'Figma',  location: 'Remote', salary: '$170–210K', type: 'Full-time', logo: 'F',  match: 89 },
];

const APPLICATIONS = [
  { id: 1, role: 'Senior Frontend Engineer', company: 'Stripe',  status: 'interview',  date: '2d ago' },
  { id: 2, role: 'React Developer',           company: 'Notion',  status: 'applied',    date: '5d ago' },
  { id: 3, role: 'UI Engineer',               company: 'Vercel',  status: 'reviewed',   date: '1w ago' },
  { id: 4, role: 'Frontend Lead',             company: 'Shopify', status: 'rejected',   date: '2w ago' },
];

const ACTIVITY = [
  { icon: <CheckCircle size={16} />, iconBg: 'rgba(34,197,94,0.12)', iconColor: 'var(--color-success)', text: 'Stripe scheduled an interview', time: '2 hours ago' },
  { icon: <Eye size={16} />,         iconBg: 'rgba(6,182,212,0.12)', iconColor: 'var(--color-accent)',   text: 'Linear viewed your profile',   time: '5 hours ago' },
  { icon: <FileText size={16} />,    iconBg: 'rgba(99,102,241,0.12)', iconColor: 'var(--color-primary)', text: 'Application sent to Figma',    time: '1 day ago' },
  { icon: <Star size={16} />,        iconBg: 'rgba(245,158,11,0.12)', iconColor: 'var(--color-warning)', text: 'Saved 2 new job postings',     time: '2 days ago' },
];

const STATUS_CONFIG = {
  applied:   { label: 'Applied',    class: 'badge badge-info' },
  interview: { label: 'Interview',  class: 'badge badge-success' },
  reviewed:  { label: 'Reviewed',   class: 'badge badge-warning' },
  rejected:  { label: 'Rejected',   class: 'badge badge-danger' },
  offered:   { label: 'Offered',    class: 'badge badge-primary' },
};

const QUICK_ACTIONS = [
  { icon: <Search size={20} />,   iconBg: 'rgba(99,102,241,0.12)', iconColor: 'var(--color-primary)', label: 'Find Jobs',       desc: 'Browse new openings',    to: '/candidate/jobs' },
  { icon: <BookOpen size={20} />, iconBg: 'rgba(245,158,11,0.12)', iconColor: 'var(--color-warning)', label: 'Book Mentor',     desc: '1:1 coaching session',   to: '/candidate/mentors' },
  { icon: <FileText size={20} />, iconBg: 'rgba(34,197,94,0.12)',  iconColor: 'var(--color-success)', label: 'My Applications', desc: 'Track your progress',    to: '/candidate/applications' },
  { icon: <Calendar size={20} />, iconBg: 'rgba(6,182,212,0.12)',  iconColor: 'var(--color-accent)',  label: 'Interviews',      desc: 'Upcoming sessions',      to: '/candidate/interviews' },
];

const CandidateDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.name?.split(' ')[0] || 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="dashboard-page">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-banner-content">
          <h1 className="welcome-banner-title">{greeting}, {firstName}! 👋</h1>
          <p className="welcome-banner-subtitle">
            You have 3 interviews this week and 2 new job matches. Keep it up!
          </p>
        </div>
        <div className="welcome-banner-actions">
          <Button
            variant="secondary"
            onClick={() => navigate('/candidate/jobs')}
            leftIcon={<Search size={16} />}
            id="candidate-find-jobs-btn"
          >
            Find Jobs
          </Button>
          <Button
            as="div"
            variant="ghost"
            style={{ color: 'rgba(255,255,255,0.85)', borderColor: 'rgba(255,255,255,0.25)', border: '1.5px solid rgba(255,255,255,0.25)', cursor: 'pointer' }}
            onClick={() => navigate('/candidate/profile')}
          >
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        {STATS.map(s => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            icon={s.icon}
            iconBg={s.iconBg}
            iconColor={s.iconColor}
            trend={s.trend}
            trendDirection={s.trendDir}
            trendLabel={s.trendLabel}
          />
        ))}
      </div>

      {/* Main content grid */}
      <div className="dashboard-grid-3">
        {/* Left — Recommended + Applications */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Recommended Jobs */}
          <div className="section-card">
            <div className="section-card-header">
              <h2 className="section-card-title">Recommended for you</h2>
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight size={14} />} onClick={() => navigate('/candidate/jobs')}>
                View all
              </Button>
            </div>
            <div className="section-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {RECOMMENDED_JOBS.map(job => (
                <div key={job.id} className="job-card">
                  <div className="job-company-logo">{job.logo}</div>
                  <div className="job-info">
                    <p className="job-title">{job.title}</p>
                    <p className="job-company">{job.company} · {job.location}</p>
                    <div className="job-tags">
                      <span className="job-tag">{job.salary}</span>
                      <span className="job-tag">{job.type}</span>
                      <span className="badge badge-primary" style={{ fontSize: '10px' }}>
                        {job.match}% match
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Apply</Button>
                </div>
              ))}
            </div>
          </div>

          {/* Applications Table */}
          <div className="section-card">
            <div className="section-card-header">
              <h2 className="section-card-title">Recent Applications</h2>
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight size={14} />} onClick={() => navigate('/candidate/applications')}>
                View all
              </Button>
            </div>
            <div className="data-table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Position</th>
                    <th>Company</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {APPLICATIONS.map(app => (
                    <tr key={app.id}>
                      <td className="data-table-name">{app.role}</td>
                      <td>{app.company}</td>
                      <td><span className={STATUS_CONFIG[app.status].class}>{STATUS_CONFIG[app.status].label}</span></td>
                      <td>{app.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right — Quick Actions + Activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Profile Completion */}
          <div className="section-card">
            <div className="section-card-header">
              <h2 className="section-card-title">Profile Completion</h2>
              <span className="badge badge-warning">72%</span>
            </div>
            <div className="section-card-body">
              <div className="progress-bar" style={{ marginBottom: 'var(--space-4)' }}>
                <div className="progress-bar-fill" style={{ width: '72%' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {[
                  { task: 'Add portfolio links', done: false },
                  { task: 'Upload resume',        done: true  },
                  { task: 'Add skills',           done: true  },
                  { task: 'Write about me',       done: false },
                ].map(({ task, done }) => (
                  <div key={task} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <span style={{ color: done ? 'var(--color-success)' : 'var(--color-text-tertiary)', display: 'flex' }}>
                      {done ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
                    </span>
                    <span style={{ fontSize: 'var(--text-sm)', color: done ? 'var(--color-text-secondary)' : 'var(--color-text-primary)', fontWeight: done ? 'normal' : 'var(--font-medium)', textDecoration: done ? 'line-through' : 'none' }}>{task}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="section-card">
            <div className="section-card-header">
              <h2 className="section-card-title">Quick Actions</h2>
            </div>
            <div className="section-card-body">
              <div className="quick-actions">
                {QUICK_ACTIONS.map(({ icon, iconBg, iconColor, label, desc, to }) => (
                  <button key={label} className="quick-action-btn" onClick={() => navigate(to)}>
                    <div className="quick-action-icon" style={{ background: iconBg, color: iconColor }}>{icon}</div>
                    <p className="quick-action-label">{label}</p>
                    <p className="quick-action-desc">{desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="section-card">
            <div className="section-card-header">
              <h2 className="section-card-title">Recent Activity</h2>
            </div>
            <div className="section-card-body" style={{ padding: '0 var(--space-6) var(--space-4)' }}>
              <div className="activity-feed">
                {ACTIVITY.map(({ icon, iconBg, iconColor, text, time }, i) => (
                  <div key={i} className="activity-item">
                    <div className="activity-icon" style={{ background: iconBg, color: iconColor }}>{icon}</div>
                    <div className="activity-content">
                      <p className="activity-text">{text}</p>
                      <p className="activity-time">{time}</p>
                    </div>
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

export default CandidateDashboard;
