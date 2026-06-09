import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Briefcase, Calendar, TrendingUp, Plus,
  Search, Filter, ArrowRight, Eye, MessageSquare,
  BarChart3, UserCheck, Clock, CheckCircle2, ChevronRight
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { StatCard } from '../../components/Card';
import Button from '../../components/Button';
import SearchBar from '../../components/SearchBar';
import useAuth from '../../hooks/useAuth';
import '../candidate/Dashboard.css';

// ---- Mock Data ----
const METRICS = [
  { label: 'Active Jobs',       value: '14',    trend: '+3',   trendDir: 'up',   trendLabel: 'this month', icon: <Briefcase size={20} />, iconBg: 'rgba(59, 130, 246, 0.15)', iconColor: '#3b82f6' },
  { label: 'Applications',      value: '1,248', trend: '+12%', trendDir: 'up',   trendLabel: 'vs last mo', icon: <Users size={20} />,     iconBg: 'rgba(139, 92, 246, 0.15)', iconColor: '#8b5cf6' },
  { label: 'Interviews',        value: '42',    trend: '+8',   trendDir: 'up',   trendLabel: 'this week',  icon: <Calendar size={20} />,  iconBg: 'rgba(245, 158, 11, 0.15)', iconColor: '#f59e0b' },
  { label: 'Hires',             value: '8',     trend: '-2',   trendDir: 'down', trendLabel: 'this month', icon: <UserCheck size={20} />, iconBg: 'rgba(16, 185, 129, 0.15)', iconColor: '#10b981' },
];

const HIRING_FUNNEL = [
  { stage: 'Applied', count: 1248, fill: '#3b82f6', percent: 100 },
  { stage: 'Screening', count: 485, fill: '#6366f1', percent: 38.8 },
  { stage: 'Interview', count: 142, fill: '#8b5cf6', percent: 11.3 },
  { stage: 'Offer', count: 28, fill: '#10b981', percent: 2.2 },
  { stage: 'Hired', count: 18, fill: '#059669', percent: 1.4 }
];

const APPS_PER_JOB = [
  { name: 'Frontend Eng', apps: 342, interviews: 45 },
  { name: 'Backend Dev', apps: 289, interviews: 32 },
  { name: 'Product Designer', apps: 412, interviews: 58 },
  { name: 'Data Scientist', apps: 156, interviews: 18 },
  { name: 'DevOps Eng', apps: 49, interviews: 8 }
];

const CONVERSION_DATA = [
  { month: 'Jan', rate: 1.2 },
  { month: 'Feb', rate: 1.5 },
  { month: 'Mar', rate: 1.4 },
  { month: 'Apr', rate: 1.8 },
  { month: 'May', rate: 2.1 },
  { month: 'Jun', rate: 2.4 }
];

const RECENT_APPLICANTS = [
  { id: 1, name: 'Alex Johnson', role: 'Frontend Engineer', stage: 'interview', date: '2h ago', source: 'LinkedIn' },
  { id: 2, name: 'Maria Garcia', role: 'Backend Developer', stage: 'screening', date: '4h ago', source: 'Direct' },
  { id: 3, name: 'James Chen', role: 'Product Designer', stage: 'applied', date: '5h ago', source: 'Referral' },
  { id: 4, name: 'Priya Sharma', role: 'Data Scientist', stage: 'offer', date: '1d ago', source: 'Direct' }
];

const STAGE_COLORS = {
  applied: { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6', label: 'Applied' },
  screening: { bg: 'rgba(139, 92, 246, 0.1)', text: '#8b5cf6', label: 'Screening' },
  interview: { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b', label: 'Interview' },
  offer: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981', label: 'Offer' }
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'var(--color-surface)', padding: '12px', border: '1px solid var(--color-border)', borderRadius: '8px', boxShadow: 'var(--shadow-md)' }}>
        <p style={{ fontWeight: 600, marginBottom: '8px', color: 'var(--color-text-primary)' }}>{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: entry.color }} />
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.name?.split(' ')[0] || 'Team';

  return (
    <div className="dashboard-page">
      {/* Welcome banner - Lever/Greenhouse inspired Enterprise feel */}
      <div style={{ 
        background: 'var(--color-surface)', border: '1px solid var(--color-border)', 
        borderRadius: 'var(--radius-xl)', padding: '32px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '8px' }}>
            Good morning, {firstName}
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px' }}>
            Here is what's happening in your hiring pipeline today.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="welcome-btn-secondary" style={{ padding: '10px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }} onClick={() => navigate('/recruiter/applicants')}>
            <Users size={18} /> View Pipeline
          </button>
          <button className="welcome-btn-primary" style={{ padding: '10px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, background: '#3b82f6', color: '#fff' }} onClick={() => navigate('/recruiter/jobs')}>
            <Plus size={18} /> Post a Job
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="stats-row" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {METRICS.map(s => (
          <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} iconBg={s.iconBg} iconColor={s.iconColor} trend={s.trend} trendDirection={s.trendDir} trendLabel={s.trendLabel} />
        ))}
      </div>

      <div className="dashboard-grid-3">
        {/* LEFT COLUMN: Charts & Data */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          
          {/* Applications Per Job Chart */}
          <div className="section-card">
            <div className="section-card-header">
              <h2 className="section-card-title">Applications vs Interviews per Job</h2>
            </div>
            <div className="section-card-body">
              <div style={{ width: '100%', height: 320 }}>
                <ResponsiveContainer>
                  <BarChart data={APPS_PER_JOB} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }} />
                    <Bar dataKey="apps" name="Total Applications" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="interviews" name="Interviews Scheduled" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Candidate Conversion Chart */}
          <div className="section-card">
            <div className="section-card-header">
              <h2 className="section-card-title">Candidate Conversion Rate (%)</h2>
              <span style={{ fontSize: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '4px 10px', borderRadius: '12px', fontWeight: 600 }}>+12% YTD</span>
            </div>
            <div className="section-card-body">
              <div style={{ width: '100%', height: 280 }}>
                <ResponsiveContainer>
                  <AreaChart data={CONVERSION_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="rate" name="Conversion Rate (%)" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Funnel & Applicants */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          
          {/* Custom ATS Hiring Funnel */}
          <div className="section-card">
            <div className="section-card-header">
              <h2 className="section-card-title">Hiring Funnel</h2>
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight size={14} />} onClick={() => navigate('/recruiter/analytics')}>Details</Button>
            </div>
            <div className="section-card-body" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {HIRING_FUNNEL.map((stage, index) => (
                  <div key={stage.stage} style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{stage.stage}</span>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{stage.count} candidates</span>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: stage.fill, width: '40px', textAlign: 'right' }}>{stage.percent}%</span>
                      </div>
                    </div>
                    {/* Funnel Bar */}
                    <div style={{ width: '100%', height: '8px', background: 'var(--color-surface-hover)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ 
                        height: '100%', background: stage.fill, borderRadius: '4px',
                        width: `${stage.percent}%`, transition: 'width 1s ease-out'
                      }} />
                    </div>
                    {/* Connective Line for Funnel visual */}
                    {index < HIRING_FUNNEL.length - 1 && (
                      <div style={{ 
                        position: 'absolute', left: '16px', bottom: '-20px', height: '16px', width: '2px', 
                        background: 'var(--color-border)', zIndex: 0 
                      }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Applicants */}
          <div className="section-card">
            <div className="section-card-header">
              <h2 className="section-card-title">Recent Applicants</h2>
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight size={14} />} onClick={() => navigate('/recruiter/applicants')}>View All</Button>
            </div>
            <div className="section-card-body" style={{ padding: '0' }}>
              {RECENT_APPLICANTS.map((applicant, index) => (
                <div key={applicant.id} style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '16px 24px', borderBottom: index < RECENT_APPLICANTS.length - 1 ? '1px solid var(--color-border)' : 'none',
                  cursor: 'pointer', transition: 'background 0.2s ease'
                }} className="hover-bg-surface">
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ 
                      width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-surface-hover)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',
                      color: 'var(--color-text-primary)', border: '1px solid var(--color-border)'
                    }}>
                      {applicant.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{applicant.name}</h4>
                      <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{applicant.role}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <span style={{ 
                      fontSize: '11px', fontWeight: 600, padding: '4px 8px', borderRadius: '12px',
                      background: STAGE_COLORS[applicant.stage].bg, color: STAGE_COLORS[applicant.stage].text 
                    }}>
                      {STAGE_COLORS[applicant.stage].label}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>{applicant.date} • {applicant.source}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
