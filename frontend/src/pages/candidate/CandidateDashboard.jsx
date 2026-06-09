import { useNavigate } from 'react-router-dom';
import {
  FileText, Calendar, Search, BookOpen,
  Briefcase, Star, ArrowRight, CheckCircle,
  Eye, Target, ShieldCheck, ClipboardList, Activity
} from 'lucide-react';
import { StatCard } from '../../components/Card';
import Button from '../../components/Button';
import useAuth from '../../hooks/useAuth';
import './Dashboard.css';

// Recharts
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, Legend
} from 'recharts';

/* ---- Mock Data ---- */
const STATS = [
  { label: 'ATS Score',          value: '88/100', trend: '+5', trendDir: 'up', trendLabel: 'vs last month', icon: <Target size={20} />,        iconBg: 'rgba(212,175,55,0.15)', iconColor: '#b8860b' },
  { label: 'Applications Sent',  value: '12',     trend: '+3', trendDir: 'up', trendLabel: 'this week',     icon: <FileText size={20} />,      iconBg: 'rgba(99,102,241,0.12)', iconColor: 'var(--color-primary)' },
  { label: 'Interviews Scheduled',value: '3',     trend: '+1', trendDir: 'up', trendLabel: 'upcoming',      icon: <Calendar size={20} />,      iconBg: 'rgba(34,197,94,0.12)',  iconColor: 'var(--color-success)' },
  { label: 'Recommended Jobs',   value: '24',     trend: '+8', trendDir: 'up', trendLabel: 'new matches',   icon: <Briefcase size={20} />,     iconBg: 'rgba(6,182,212,0.12)',  iconColor: 'var(--color-accent)' },
  { label: 'Upcoming Assessments',value: '2',     trend: null, trendDir: 'up', trendLabel: null,            icon: <ClipboardList size={20} />, iconBg: 'rgba(245,158,11,0.12)', iconColor: 'var(--color-warning)' },
];

const RECOMMENDED_JOBS = [
  { id: 1, title: 'Senior Frontend Engineer', company: 'Stripe', location: 'Remote', salary: '$160–200K', type: 'Full-time', logo: 'S', match: 97 },
  { id: 2, title: 'Staff React Developer',    company: 'Linear', location: 'SF, CA', salary: '$150–180K', type: 'Full-time', logo: 'L', match: 93 },
  { id: 3, title: 'Frontend Architect',       company: 'Figma',  location: 'Remote', salary: '$170–210K', type: 'Full-time', logo: 'F', match: 89 },
];

const ACTIVITY_FEED = [
  { icon: <CheckCircle size={16} />, iconBg: 'rgba(34,197,94,0.12)', iconColor: 'var(--color-success)', text: 'Stripe scheduled an interview', time: '2 hours ago' },
  { icon: <ShieldCheck size={16} />, iconBg: 'rgba(212,175,55,0.15)',iconColor: '#b8860b',               text: 'Profile passed ATS screening for Linear', time: '5 hours ago' },
  { icon: <FileText size={16} />,    iconBg: 'rgba(99,102,241,0.12)',iconColor: 'var(--color-primary)', text: 'Application sent to Figma', time: '1 day ago' },
  { icon: <Activity size={16} />,    iconBg: 'rgba(6,182,212,0.12)', iconColor: 'var(--color-accent)',  text: 'Completed Frontend Skill Assessment', time: '2 days ago' },
];

/* ---- Chart Data ---- */
const APPLICATION_ACTIVITY_DATA = [
  { name: 'Mon', applications: 2, profileViews: 12 },
  { name: 'Tue', applications: 3, profileViews: 19 },
  { name: 'Wed', applications: 1, profileViews: 15 },
  { name: 'Thu', applications: 4, profileViews: 25 },
  { name: 'Fri', applications: 2, profileViews: 22 },
  { name: 'Sat', applications: 0, profileViews: 30 },
  { name: 'Sun', applications: 0, profileViews: 28 },
];

const SKILL_GROWTH_DATA = [
  { subject: 'React', A: 95, fullMark: 100 },
  { subject: 'Node.js', A: 80, fullMark: 100 },
  { subject: 'System Design', A: 75, fullMark: 100 },
  { subject: 'Algorithms', A: 85, fullMark: 100 },
  { subject: 'CSS/UI', A: 90, fullMark: 100 },
  { subject: 'Testing', A: 70, fullMark: 100 },
];

const ASSESSMENT_PERFORMANCE_DATA = [
  { name: 'React Advanced', score: 92 },
  { name: 'Data Structures', score: 85 },
  { name: 'Web Core', score: 95 },
  { name: 'Sys Design', score: 78 },
];

/* ---- Custom Tooltip Style for Recharts ---- */
const customTooltipStyle = {
  backgroundColor: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-md)',
  color: 'var(--color-text-primary)'
};

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
            Your profile is standing out! You have an 88/100 ATS match score for top tier roles.
          </p>
        </div>
        <div className="welcome-banner-actions">
          <button className="welcome-btn-primary" style={{ padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => navigate('/candidate/jobs')}>
            View Recommended Jobs
          </button>
          <button className="welcome-btn-secondary" style={{ padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => navigate('/candidate/profile')}>
            Enhance Profile
          </button>
        </div>
      </div>

      {/* Stats Widgets */}
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
        {/* Left Column (Charts & Jobs) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          
          {/* Chart 1: Application Activity */}
          <div className="section-card">
            <div className="section-card-header">
              <h2 className="section-card-title"><Activity size={18} /> Application Activity</h2>
            </div>
            <div className="section-card-body">
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={APPLICATION_ACTIVITY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }} />
                    <RechartsTooltip contentStyle={customTooltipStyle} cursor={{ stroke: 'var(--color-border)', strokeWidth: 1 }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                    <Area type="monotone" name="Applications" dataKey="applications" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorApps)" />
                    <Area type="monotone" name="Profile Views" dataKey="profileViews" stroke="var(--color-accent)" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recommended Jobs */}
          <div className="section-card">
            <div className="section-card-header">
              <h2 className="section-card-title"><Star size={18} /> Premium Job Matches</h2>
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
                      <span className="job-tag match-badge">{job.match}% ATS Match</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>Apply Now</Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Skill & Assessment Charts) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          
          {/* Chart 2: Skill Growth (Radar) */}
          <div className="section-card">
            <div className="section-card-header">
              <h2 className="section-card-title"><BookOpen size={18} /> Skill Proficiency</h2>
            </div>
            <div className="section-card-body">
              <div className="chart-container" style={{ height: '260px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={SKILL_GROWTH_DATA}>
                    <PolarGrid stroke="var(--color-border)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <RechartsTooltip contentStyle={customTooltipStyle} />
                    <Radar name="Candidate" dataKey="A" stroke="var(--color-primary)" strokeWidth={2} fill="var(--color-primary)" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Chart 3: Assessment Performance (Bar) */}
          <div className="section-card">
            <div className="section-card-header">
              <h2 className="section-card-title"><ClipboardList size={18} /> Assessment Scores</h2>
            </div>
            <div className="section-card-body">
              <div className="chart-container" style={{ height: '220px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ASSESSMENT_PERFORMANCE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={30}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} />
                    <YAxis axisLine={false} tickLine={false} domain={[0, 100]} tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }} />
                    <RechartsTooltip contentStyle={customTooltipStyle} cursor={{ fill: 'var(--color-surface-2)' }} />
                    <Bar dataKey="score" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="section-card">
            <div className="section-card-header">
              <h2 className="section-card-title"><Calendar size={18} /> Recent Activity</h2>
            </div>
            <div className="section-card-body">
              <div className="activity-feed">
                {ACTIVITY_FEED.map(({ icon, iconBg, iconColor, text, time }, i) => (
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
