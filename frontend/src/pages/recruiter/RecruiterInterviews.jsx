import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Clock, Users, Plus, Eye, Trash2, 
  Video, FileText, Check, AlertCircle, X, ExternalLink, RefreshCw
} from 'lucide-react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import api from '../../services/api';
import useAuth from '../../hooks/useAuth';
import '../candidate/Dashboard.css';

const RecruiterInterviews = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State
  const [interviews, setInterviews] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Modals
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    title: '',
    description: '',
    candidateId: '',
    scheduledTime: '',
    durationMinutes: 45
  });

  const [activeEval, setActiveEval] = useState(null);
  const [activeNotes, setActiveNotes] = useState(null);

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

  // Fetch candidate users
  const fetchCandidates = async () => {
    try {
      const usersList = await api.get('/chat/users/search');
      // Filter for candidate role (raw database uses role = 'candidate', formatted details returns role = 'Candidate')
      const filtered = usersList.filter(u => 
        u.role?.toLowerCase() === 'candidate'
      );
      setCandidates(filtered);
    } catch (err) {
      console.error('Failed to fetch candidates', err);
    }
  };

  useEffect(() => {
    fetchInterviews();
    fetchCandidates();
  }, []);

  // Submit Schedule
  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!scheduleForm.candidateId || !scheduleForm.scheduledTime) {
      alert('Please select a candidate and a date/time.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: scheduleForm.title || 'Technical Video Interview',
        description: scheduleForm.description,
        candidateId: parseInt(scheduleForm.candidateId),
        scheduledTime: scheduleForm.scheduledTime,
        durationMinutes: parseInt(scheduleForm.durationMinutes)
      };

      await api.post('/interviews', payload);
      setIsScheduleOpen(false);
      
      // Reset form
      setScheduleForm({
        title: '',
        description: '',
        candidateId: '',
        scheduledTime: '',
        durationMinutes: 45
      });
      
      fetchInterviews();
      
      // Dispatch in-app notification seeding trigger
      window.dispatchEvent(new Event('qh_notifications_updated'));
    } catch (err) {
      console.error('Failed to schedule interview', err);
      alert('Failed to schedule interview. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Cancel Interview
  const handleCancelInterview = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this interview?')) return;
    try {
      await api.put(`/interviews/${id}/status?status=cancelled`, {});
      fetchInterviews();
    } catch (err) {
      console.error('Failed to cancel interview', err);
      alert('Failed to cancel interview.');
    }
  };

  // Open evaluation viewer
  const handleViewEvaluation = async (interviewId) => {
    try {
      const evalData = await api.get(`/interviews/${interviewId}/evaluations`);
      setActiveEval(evalData);
    } catch (err) {
      console.error('Failed to fetch evaluation details', err);
      alert('No evaluation has been submitted for this interview yet.');
    }
  };

  // Open notes viewer
  const handleViewNotes = (notes) => {
    setActiveNotes(notes || 'No private notes saved for this interview.');
  };

  // Format status badge
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
      <div className="welcome-banner" style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, #3b82f6 100%)' }}>
        <div className="welcome-banner-content">
          <h1 className="welcome-banner-title" style={{ color: 'white' }}>Built-in Video Interviews 🎥</h1>
          <p className="welcome-banner-subtitle" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
            Conduct live WebRTC calls, share screens, chat, review documents, and score candidate performance instantly.
          </p>
        </div>
        <div className="welcome-banner-actions">
          <Button variant="outline" leftIcon={<RefreshCw size={16} />} style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)', background: 'transparent' }} onClick={fetchInterviews}>
            Refresh
          </Button>
          <Button leftIcon={<Plus size={16} />} onClick={() => setIsScheduleOpen(true)} style={{ background: '#fff', color: 'var(--color-primary)', border: 'none' }}>
            Schedule Call
          </Button>
        </div>
      </div>

      <div className="dashboard-grid-3">
        {/* Left Column: Scheduled and Active Meetings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <div className="section-card">
            <div className="section-card-header">
              <h2 className="section-card-title"><Calendar size={18} /> Upcoming Interviews</h2>
            </div>
            <div className="section-card-body" style={{ padding: '0' }}>
              {loading ? (
                <div style={{ padding: '48px', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
                  Loading scheduled interviews...
                </div>
              ) : upcomingInterviews.length === 0 ? (
                <div style={{ padding: '48px', textAlign: 'center', color: 'var(--color-text-tertiary)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <Video size={36} style={{ opacity: 0.3 }} />
                  <p style={{ fontSize: '14px', fontWeight: 500 }}>No upcoming interviews scheduled</p>
                  <Button variant="ghost" size="sm" onClick={() => setIsScheduleOpen(true)}>Schedule one now</Button>
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
                        width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)'
                      }}>
                        <Video size={20} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '4px' }}>{item.title}</h4>
                        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '2px' }}>
                          Candidate: <strong style={{ color: 'var(--color-text-primary)' }}>{item.candidateName}</strong>
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
                        Join
                      </Button>
                      <button 
                        onClick={() => handleCancelInterview(item.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: 'var(--color-text-tertiary)', transition: 'color 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--color-danger)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-tertiary)'}
                        title="Cancel Interview"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Past Logs, Notes, and Evaluation Reports */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <div className="section-card">
            <div className="section-card-header">
              <h2 className="section-card-title"><Check size={18} /> Past Interviews & Evaluation Logs</h2>
            </div>
            <div className="section-card-body" style={{ padding: '0' }}>
              {loading ? (
                <div style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
                  Loading...
                </div>
              ) : pastInterviews.length === 0 ? (
                <div style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-tertiary)', fontSize: '13px', fontStyle: 'italic' }}>
                  No completed interviews found.
                </div>
              ) : (
                pastInterviews.map((item, idx) => (
                  <div key={item.id} style={{ 
                    padding: '16px 20px', borderBottom: idx < pastInterviews.length - 1 ? '1px solid var(--color-border)' : 'none',
                    display: 'flex', flexDirection: 'column', gap: '8px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{item.candidateName}</h4>
                        <p style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>{item.title} • {new Date(item.scheduledTime).toLocaleDateString()}</p>
                      </div>
                      {renderStatusBadge(item.status)}
                    </div>

                    {item.status === 'COMPLETED' && (
                      <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                        {item.hasEvaluation ? (
                          <Button size="sm" variant="outline" leftIcon={<FileText size={12} />} onClick={() => handleViewEvaluation(item.id)}>
                            View Scorecard
                          </Button>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--color-warning)' }}>
                            <AlertCircle size={12} /> Pending Scorecard
                          </div>
                        )}
                        <Button size="sm" variant="ghost" leftIcon={<Eye size={12} />} onClick={() => handleViewNotes(item.notes)}>
                          View Notes
                        </Button>
                        {item.recordingUrl && (
                          <a href={`http://localhost:8080${item.recordingUrl}`} target="_blank" rel="noreferrer" style={{
                            display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', 
                            color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500, padding: '4px'
                          }}>
                            Play Call <ExternalLink size={12} />
                          </a>
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

      {/* 1. Schedule Interview Modal */}
      <Modal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        title="Schedule Video Interview"
        size="md"
      >
        <form onSubmit={handleScheduleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input 
            label="Interview Title"
            type="text"
            required
            placeholder="e.g. Senior React Developer Technical Interview"
            value={scheduleForm.title}
            onChange={e => setScheduleForm({ ...scheduleForm, title: e.target.value })}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-secondary)' }}>
              Candidate *
            </label>
            <select
              required
              value={scheduleForm.candidateId}
              onChange={e => setScheduleForm({ ...scheduleForm, candidateId: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                color: 'var(--color-text-primary)',
                fontSize: '14px',
                outline: 'none'
              }}
            >
              <option value="">Select Candidate</option>
              {candidates.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Input 
              label="Date & Time (PST)"
              type="datetime-local"
              required
              value={scheduleForm.scheduledTime}
              onChange={e => setScheduleForm({ ...scheduleForm, scheduledTime: e.target.value })}
            />
            <Input 
              label="Duration (minutes)"
              type="number"
              required
              min={15}
              max={180}
              value={scheduleForm.durationMinutes}
              onChange={e => setScheduleForm({ ...scheduleForm, durationMinutes: e.target.value })}
            />
          </div>

          <Input 
            label="Instructions / Description (Optional)"
            as="textarea"
            rows={3}
            placeholder="Describe context, projects to present, or coding guidelines..."
            value={scheduleForm.description}
            onChange={e => setScheduleForm({ ...scheduleForm, description: e.target.value })}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
            <Button variant="ghost" type="button" onClick={() => setIsScheduleOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? 'Scheduling...' : 'Schedule & Invite'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* 2. Scorecard Evaluation Viewer Modal */}
      <Modal
        isOpen={!!activeEval}
        onClose={() => setActiveEval(null)}
        title="Candidate Performance Scorecard"
        size="md"
      >
        {activeEval && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Recommendation badge */}
            <div style={{ 
              padding: '16px', borderRadius: '12px', textAlign: 'center',
              background: activeEval.recommendation === 'STRONG_HIRE' || activeEval.recommendation === 'HIRE' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
              color: activeEval.recommendation === 'STRONG_HIRE' || activeEval.recommendation === 'HIRE' ? 'var(--color-success)' : 'var(--color-danger)'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>{activeEval.recommendation?.replace('_', ' ')}</h3>
              <p style={{ fontSize: '12px', opacity: 0.8, marginTop: '2px' }}>Overall Interview Recommendation</p>
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
              <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>Detailed Feedback Summary</h4>
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

      {/* 3. Notes Viewer Modal */}
      <Modal
        isOpen={!!activeNotes}
        onClose={() => setActiveNotes(null)}
        title="Interviewer's Private Notes"
        size="md"
      >
        {activeNotes && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ 
              padding: '20px', background: 'var(--color-surface-2)', borderRadius: '12px',
              fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.6,
              border: '1px solid var(--color-border)', minHeight: '150px', whiteSpace: 'pre-line'
            }}>
              {activeNotes}
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="primary" onClick={() => setActiveNotes(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RecruiterInterviews;
