import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardList, Code, Brain, Target, 
  Trophy, TrendingUp, CheckCircle, Clock, ChevronRight
} from 'lucide-react';
import Button from '../../components/Button';
import './Dashboard.css';

// ---- Mock Data ----
const ASSESSMENT_STATS = {
  globalRank: 1245,
  percentile: 88,
  testsCompleted: 14,
  averageScore: 82
};

const ACTIVE_ASSESSMENTS = [
  {
    id: 'a1',
    title: 'Software Engineer Assessment',
    company: 'Tech Corp',
    type: 'Coding',
    duration: '90 mins',
    dueDate: 'Tomorrow',
    icon: <Code size={20} color="#3b82f6" />,
    color: '#3b82f6',
    route: '/candidate/assessments/coding/a1'
  },
  {
    id: 'a2',
    title: 'General Aptitude Test',
    company: 'Fintech Solutions',
    type: 'Aptitude',
    duration: '45 mins',
    dueDate: 'In 3 days',
    icon: <Target size={20} color="#f59e0b" />,
    color: '#f59e0b',
    route: '#' // Placeholder
  },
  {
    id: 'a3',
    title: 'Frontend Frameworks MCQ',
    company: 'Design Systems Inc',
    type: 'MCQ',
    duration: '30 mins',
    dueDate: 'Next Week',
    icon: <Brain size={20} color="#8b5cf6" />,
    color: '#8b5cf6',
    route: '#' // Placeholder
  }
];

const ASSESSMENT_HISTORY = [
  { id: 'h1', title: 'Data Structures Core', type: 'Coding', score: 95, date: '2026-05-15', status: 'Passed' },
  { id: 'h2', title: 'React Performance MCQ', type: 'MCQ', score: 88, date: '2026-05-10', status: 'Passed' },
  { id: 'h3', title: 'System Design Basics', type: 'Coding', score: 72, date: '2026-04-22', status: 'Needs Improvement' },
  { id: 'h4', title: 'Logical Reasoning', type: 'Aptitude', score: 90, date: '2026-04-10', status: 'Passed' }
];

const CandidateAssessments = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-page">
      {/* Header Banner */}
      <div style={{ 
        background: 'linear-gradient(135deg, #1e293b, #0f172a)', borderRadius: 'var(--radius-xl)', padding: '32px',
        color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ClipboardList size={28} color="#3b82f6" />
            Assessments Arena
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '15px', maxWidth: '600px' }}>
            Prove your skills to employers through interactive coding challenges, MCQs, and aptitude tests. Your scores directly impact your ATS matching.
          </p>
        </div>
      </div>

      {/* Top Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
        <div className="stat-card" style={{ background: 'var(--color-surface)' }}>
          <div className="stat-header">
            <h3 className="stat-title">Global Rank</h3>
            <Trophy size={20} color="#f59e0b" />
          </div>
          <p className="stat-value">#{ASSESSMENT_STATS.globalRank}</p>
          <div className="stat-trend positive">
            <TrendingUp size={16} /> Top {100 - ASSESSMENT_STATS.percentile}% of candidates
          </div>
        </div>

        <div className="stat-card" style={{ background: 'var(--color-surface)' }}>
          <div className="stat-header">
            <h3 className="stat-title">Tests Completed</h3>
            <CheckCircle size={20} color="#10b981" />
          </div>
          <p className="stat-value">{ASSESSMENT_STATS.testsCompleted}</p>
          <div className="stat-trend">
            Across 3 different categories
          </div>
        </div>

        <div className="stat-card" style={{ background: 'var(--color-surface)' }}>
          <div className="stat-header">
            <h3 className="stat-title">Average Score</h3>
            <Target size={20} color="#3b82f6" />
          </div>
          <p className="stat-value">{ASSESSMENT_STATS.averageScore}%</p>
          <div className="stat-trend positive">
            <TrendingUp size={16} /> +5% from last month
          </div>
        </div>

        <div className="stat-card" style={{ background: 'var(--color-surface)' }}>
          <div className="stat-header">
            <h3 className="stat-title">Pending Tests</h3>
            <Clock size={20} color="#ef4444" />
          </div>
          <p className="stat-value">{ACTIVE_ASSESSMENTS.length}</p>
          <div className="stat-trend negative">
            Requires your attention
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 'var(--space-6)' }}>
        
        {/* Left Column: Active Assessments */}
        <div className="section-card">
          <div className="section-card-header">
            <h2 className="section-card-title">Active Assessments</h2>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {ACTIVE_ASSESSMENTS.map(test => (
              <div key={test.id} style={{ 
                border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-bg)',
                transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'default'
              }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                 onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${test.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {test.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '4px' }}>{test.title}</h3>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                      <span style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{test.company}</span>
                      <span>•</span>
                      <span>{test.type} Test</span>
                      <span>•</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {test.duration}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#ef4444', backgroundColor: '#ef444415', padding: '4px 8px', borderRadius: '4px' }}>
                    Due {test.dueDate}
                  </span>
                  <Button variant="primary" size="sm" onClick={() => navigate(test.route)}>
                    Start Test
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: History */}
        <div className="section-card">
          <div className="section-card-header">
            <h2 className="section-card-title">Assessment History</h2>
          </div>
          <div style={{ padding: '0 24px 24px 24px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '12px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-secondary)', fontSize: '13px' }}>
                  <th style={{ padding: '12px 8px', fontWeight: 600 }}>Test Name</th>
                  <th style={{ padding: '12px 8px', fontWeight: 600 }}>Score</th>
                  <th style={{ padding: '12px 8px', fontWeight: 600 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {ASSESSMENT_HISTORY.map(history => (
                  <tr key={history.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '16px 8px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{history.title}</div>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', marginTop: '4px' }}>{history.date} • {history.type}</div>
                    </td>
                    <td style={{ padding: '16px 8px', fontSize: '14px', fontWeight: 'bold', color: history.score >= 80 ? '#10b981' : history.score >= 60 ? '#f59e0b' : '#ef4444' }}>
                      {history.score}%
                    </td>
                    <td style={{ padding: '16px 8px' }}>
                      <span style={{ 
                        fontSize: '11px', fontWeight: 600, padding: '4px 8px', borderRadius: '12px',
                        background: history.status === 'Passed' ? '#10b98115' : '#f59e0b15',
                        color: history.status === 'Passed' ? '#10b981' : '#f59e0b'
                      }}>
                        {history.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <Button variant="ghost" size="sm" rightIcon={<ChevronRight size={16} />}>View Full History</Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CandidateAssessments;
