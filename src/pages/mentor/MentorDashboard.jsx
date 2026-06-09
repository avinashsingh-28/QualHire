import { useNavigate } from 'react-router-dom';
import { Users, Star, Calendar, DollarSign, ArrowRight, Plus, Clock, BookOpen, MessageSquare } from 'lucide-react';
import { StatCard } from '../../components/Card';
import Button from '../../components/Button';
import useAuth from '../../hooks/useAuth';
import '../candidate/Dashboard.css';

const STATS = [
  { label: 'Active Mentees',   value: '14',    trend: '+3',   trendDir: 'up', trendLabel: 'this month', icon: <Users size={20} />,    iconBg: 'rgba(99,102,241,0.12)', iconColor: 'var(--color-primary)' },
  { label: 'Sessions Done',    value: '87',    trend: '+12',  trendDir: 'up', trendLabel: 'this month', icon: <Calendar size={20} />, iconBg: 'rgba(34,197,94,0.12)',  iconColor: 'var(--color-success)' },
  { label: 'Avg. Rating',      value: '4.9',   trend: '+0.1', trendDir: 'up', trendLabel: 'vs last mo.',icon: <Star size={20} />,     iconBg: 'rgba(245,158,11,0.12)', iconColor: 'var(--color-warning)' },
  { label: 'Total Earnings',   value: '$3.2K', trend: '+$400',trendDir: 'up', trendLabel: 'this month', icon: <DollarSign size={20} />,iconBg: 'rgba(6,182,212,0.12)',  iconColor: 'var(--color-accent)' },
];

const MENTEES = [
  { name: 'Alex Johnson',  goal: 'Senior Engineer Role',  progress: 72, nextSession: 'Tomorrow 2pm',   status: 'on-track' },
  { name: 'Maria Garcia',  goal: 'Product Manager Switch', progress: 45, nextSession: 'Wed 4pm',        status: 'on-track' },
  { name: 'James Chen',    goal: 'First Tech Job',         progress: 88, nextSession: 'Fri 10am',       status: 'ahead' },
  { name: 'Priya Sharma',  goal: 'Salary Negotiation',     progress: 60, nextSession: 'Next Mon 3pm',   status: 'on-track' },
];

const UPCOMING = [
  { mentee: 'Alex Johnson', type: 'Mock Interview',   date: 'Today',     time: '3:00 PM',  duration: '60 min' },
  { mentee: 'James Chen',   type: 'Code Review',      date: 'Tomorrow',  time: '10:00 AM', duration: '45 min' },
  { mentee: 'Priya Sharma', type: 'Career Coaching',  date: 'Wed, Jun 5',time: '4:00 PM',  duration: '30 min' },
];

const REVIEWS = [
  { name: 'Sarah M.', rating: 5, text: '"Dr. Patel completely changed how I approach technical interviews. Got my dream job at Google!"', date: '2d ago' },
  { name: 'Kevin L.', rating: 5, text: '"The system design sessions were incredible. Best investment in my career."', date: '1w ago' },
];

const MentorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className="dashboard-page">
      {/* Welcome banner */}
      <div className="welcome-banner" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
        <div className="welcome-banner-content">
          <h1 className="welcome-banner-title">Good to see you, {firstName}! 🌟</h1>
          <p className="welcome-banner-subtitle">You have 3 sessions today and 2 mentee milestones to review.</p>
        </div>
        <div className="welcome-banner-actions">
          <Button variant="secondary" leftIcon={<Plus size={16} />} onClick={() => navigate('/mentor/sessions')} id="add-session-btn">New Session</Button>
          <Button as="div" variant="ghost" style={{ color: 'rgba(255,255,255,0.85)', borderColor: 'rgba(255,255,255,0.25)', border: '1.5px solid rgba(255,255,255,0.25)', cursor: 'pointer' }} onClick={() => navigate('/mentor/candidates')}>My Mentees</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        {STATS.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Main grid */}
      <div className="dashboard-grid">
        {/* Upcoming Sessions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <div className="section-card">
            <div className="section-card-header">
              <h2 className="section-card-title">Upcoming Sessions</h2>
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight size={14} />} onClick={() => navigate('/mentor/sessions')}>View all</Button>
            </div>
            <div className="section-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {UPCOMING.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-4)', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-lg)', background: 'rgba(245,158,11,0.12)', color: 'var(--color-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <BookOpen size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-primary)' }}>{s.mentee}</p>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{s.type} · {s.duration}</p>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={10} /> {s.date} at {s.time}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">Join</Button>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="section-card">
            <div className="section-card-header">
              <h2 className="section-card-title">Recent Reviews</h2>
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight size={14} />} onClick={() => navigate('/mentor/reviews')}>See all</Button>
            </div>
            <div className="section-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {REVIEWS.map((r, i) => (
                <div key={i} style={{ padding: 'var(--space-4)', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 'var(--space-2)' }}>
                    {Array.from({ length: r.rating }).map((_, j) => <Star key={j} size={12} fill="var(--color-warning)" color="var(--color-warning)" />)}
                  </div>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-2)', fontStyle: 'italic' }}>{r.text}</p>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>— {r.name} · {r.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Mentees */}
        <div>
          <div className="section-card">
            <div className="section-card-header">
              <h2 className="section-card-title">My Mentees</h2>
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight size={14} />} onClick={() => navigate('/mentor/candidates')}>All</Button>
            </div>
            <div className="section-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              {MENTEES.map((m, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: 'white' }}>
                        {m.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-primary)' }}>{m.name}</p>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{m.goal}</p>
                      </div>
                    </div>
                    <span className={`badge ${m.status === 'ahead' ? 'badge-success' : 'badge-info'}`}>{m.status === 'ahead' ? 'Ahead' : 'On Track'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <div className="progress-bar" style={{ flex: 1 }}>
                      <div className="progress-bar-fill" style={{ width: `${m.progress}%`, background: 'linear-gradient(135deg, #f59e0b, #d97706)' }} />
                    </div>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-secondary)', minWidth: 32 }}>{m.progress}%</span>
                  </div>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 4 }}>Next: {m.nextSession}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;
