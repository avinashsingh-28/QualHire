import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Clock, Video, FileText, Check, Award, Eye, RefreshCw
} from 'lucide-react';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import api from '../../services/api';
import useAuth from '../../hooks/useAuth';
import './Dashboard.css';

const CandidateInterviews = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeEval, setActiveEval] = useState(null);

  // Fetch interviews
  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const data = await api.get('/interviews');
      setInterviews(data);
    } catch (err) {
      console.error('Failed to fetch interviews', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  // Open feedback scorecard
  const handleViewFeedback = async (interviewId) => {
    try {
      const evalData = await api.get(`/interviews/${interviewId}/evaluations`);
      setActiveEval(evalData);
    } catch (err) {
      console.error('Failed to fetch feedback data', err);
      alert('Feedback is not yet available for this interview.');
    }
  };

  // Status Badge Helper
  const renderStatusBadge = (status) => {
    const s = status ? status.toLowerCase() : 'scheduled';
    let bg = 'rgba(59, 130, 246, 0.1)';
    let color = '#3b82f6';
    if (s === 'ongoing') {
      bg = 'rgba(34, 197, 94, 0.1)';
      color = 'var(--color-success)';
    } else if (s === 'completed') {
      bg = 'rgba(16, 185, 129, 0.1)';
      color = '#10b981';
    } else if (s === 'cancelled') {
      bg = 'rgba(239, 68, 68, 0.1)';
      color = 'var(--color-danger)';
    }
    return (
      <span style={{ 
        fontSize: '11px', fontWeight: 600, padding: '4px 8px', borderRadius: '12px',
        background: bg, color: color, textTransform: 'capitalize'
      }}>
        {s}
      </span>
    );
  };

  const upcomingInterviews = interviews.filter(i => i.status !== 'COMPLETED' && i.status !== 'CANCELLED');
  const pastInterviews = interviews.filter(i => i.status === 'COMPLETED' || i.status === 'CANCELLED');

  return (
    <div className="dashboard-page">
      {/* Header Banner */}
      <div className="welcome-banner" style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, #06b6d4 100%)' }}>
        <div className="welcome-banner-content">
          <h1 className="welcome-banner-title" style={{ color: 'white' }}>Your Video Interviews 🎥</h1>
          <p className="welcome-banner-subtitle" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
            Join secure, real-time video calls with interviewers directly on QualHire. No external downloads required.
          </p>
        </div>
        <div className="welcome-banner-actions">
          <Button variant="outline" leftIcon={<RefreshCw size={16} />} style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)', background: 'transparent' }} onClick={fetchInterviews}>
            Refresh
          </Button>
        </div>
      </div>

      <div className="dashboard-grid-3">
        {/* Left Column: Scheduled Calls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <div className="section-card">
            <div className="section-card-header">
              <h2 className="section-card-title"><Calendar size={18} /> Scheduled Interviews</h2>
            </div>
            <div className="section-card-body" style={{ padding: '0' }}>
              {loading ? (
                <div style={{ padding: '48px', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
                  Loading your scheduled interviews...
                </div>
              ) : upcomingInterviews.length === 0 ? (
                <div style={{ padding: '48px', textAlign: 'center', color: 'var(--color-text-tertiary)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <Video size={36} style={{ opacity: 0.3 }} />
                  <p style={{ fontSize: '14px', fontWeight: 500 }}>No interviews scheduled yet</p>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', maxWidth: '320px' }}>
                    Recruiters will schedule calls directly and send invitations when you are shortlisted.
                  </p>
                </div>
              ) : (
                upcomingInterviews.map((item, idx) => (
                  <div key={item.id} style={{ 
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '20px 24px', borderBottom: idx < upcomingInterviews.length - 1 ? '1px solid var(--color-border)' : 'none',
                    transition: 'background 0.2s ease'
                  }} className="hover-bg-surface">
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div style={{ 
                        width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)'
                      }}>
                        <Video size={20} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '4px' }}>{item.title}</h4>
                        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '2px' }}>
                          Interviewer: <strong style={{ color: 'var(--color-text-primary)' }}>{item.interviewerName}</strong>
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={12} /> {new Date(item.scheduledTime).toLocaleDateString()} at {new Date(item.scheduledTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {item.durationMinutes} mins</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {renderStatusBadge(item.status)}
                      <Button variant="primary" size="sm" onClick={() => navigate(`/interview/setup/${item.roomCode}`)}>
                        Join Setup
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: History & Feedback Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <div className="section-card">
            <div className="section-card-header">
              <h2 className="section-card-title"><Check size={18} /> Past Interview & Feedback History</h2>
            </div>
            <div className="section-card-body" style={{ padding: '0' }}>
              {loading ? (
                <div style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
                  Loading...
                </div>
              ) : pastInterviews.length === 0 ? (
                <div style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-tertiary)', fontSize: '13px', fontStyle: 'italic' }}>
                  No past interview sessions found.
                </div>
              ) : (
                pastInterviews.map((item, idx) => (
                  <div key={item.id} style={{ 
                    padding: '16px 20px', borderBottom: idx < pastInterviews.length - 1 ? '1px solid var(--color-border)' : 'none',
                    display: 'flex', flexDirection: 'column', gap: '8px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{item.title}</h4>
                        <p style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>Interviewer: {item.interviewerName} • {new Date(item.scheduledTime).toLocaleDateString()}</p>
                      </div>
                      {renderStatusBadge(item.status)}
                    </div>

                    {item.status === 'COMPLETED' && (
                      <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                        {item.hasEvaluation ? (
                          <Button size="sm" variant="outline" leftIcon={<Award size={12} />} onClick={() => handleViewFeedback(item.id)}>
                            View Scorecard Feedback
                          </Button>
                        ) : (
                          <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', fontStyle: 'italic' }}>
                            Feedback scorecard processing...
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scorecard Feedback Viewer Modal */}
      <Modal
        isOpen={!!activeEval}
        onClose={() => setActiveEval(null)}
        title="Your Performance Scorecard"
        size="md"
      >
        {activeEval && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ 
              padding: '16px', borderRadius: '12px', textAlign: 'center',
              background: activeEval.recommendation === 'STRONG_HIRE' || activeEval.recommendation === 'HIRE' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
              color: activeEval.recommendation === 'STRONG_HIRE' || activeEval.recommendation === 'HIRE' ? 'var(--color-success)' : 'var(--color-danger)'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>{activeEval.recommendation?.replace('_', ' ')}</h3>
              <p style={{ fontSize: '12px', opacity: 0.8, marginTop: '2px' }}>Overall Recommendation</p>
            </div>

            {/* Score grids */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ border: '1px solid var(--color-border)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                <h4 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-primary)' }}>{activeEval.technicalScore} / 10</h4>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>Technical Skills</p>
              </div>
              <div style={{ border: '1px solid var(--color-border)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                <h4 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-primary)' }}>{activeEval.communicationScore} / 10</h4>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>Communication</p>
              </div>
              <div style={{ border: '1px solid var(--color-border)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                <h4 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-primary)' }}>{activeEval.problemSolvingScore} / 10</h4>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>Problem Solving</p>
              </div>
              <div style={{ border: '1px solid var(--color-border)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                <h4 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-primary)' }}>{activeEval.culturalFitScore} / 10</h4>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>Cultural Fit</p>
              </div>
            </div>

            {/* Written feedback */}
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>Written Feedback Summary</h4>
              <p style={{ 
                padding: '16px', background: 'var(--color-surface-2)', borderRadius: '10px',
                fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.5,
                border: '1px solid var(--color-border)'
              }}>
                {activeEval.detailedFeedback || 'No feedback text provided.'}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
              <Button variant="primary" onClick={() => setActiveEval(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CandidateInterviews;
