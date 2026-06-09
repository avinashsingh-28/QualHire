import React, { useState } from 'react';
import { 
  Users, Search, Filter, Calendar, Mail, Phone, MapPin, 
  Briefcase, CheckCircle, XCircle, Clock, ChevronRight, FileText, 
  MessageSquare, Star, ArrowRight, Download
} from 'lucide-react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import useAuth from '../../hooks/useAuth';
import '../candidate/Dashboard.css';

// ---- Mock Data ----
const INITIAL_APPLICANTS = [
  {
    id: 1,
    name: 'Alex Johnson',
    email: 'alex.j@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    role: 'Senior Frontend Engineer',
    status: 'interview',
    atsScore: 92,
    appliedDate: '2026-06-05',
    experience: '6 years',
    skills: ['React', 'TypeScript', 'Redux', 'Jest', 'Tailwind'],
    missingSkills: ['GraphQL'],
    timeline: [
      { id: 1, date: '2026-06-05 09:00 AM', action: 'Applied', actor: 'Candidate' },
      { id: 2, date: '2026-06-06 10:30 AM', action: 'Moved to Screening', actor: 'System ATS' },
      { id: 3, date: '2026-06-07 02:15 PM', action: 'Moved to Interview', actor: 'Sarah (Recruiter)' }
    ],
    notes: [
      { id: 1, date: '2026-06-07 02:20 PM', author: 'Sarah (Recruiter)', text: 'Strong portfolio. Scheduled technical interview with the engineering team.' }
    ]
  },
  {
    id: 2,
    name: 'Maria Garcia',
    email: 'm.garcia@example.com',
    phone: '+1 (555) 987-6543',
    location: 'Remote (Texas)',
    role: 'Lead Backend Developer',
    status: 'screening',
    atsScore: 85,
    appliedDate: '2026-06-08',
    experience: '8 years',
    skills: ['Java', 'Spring Boot', 'MySQL', 'AWS'],
    missingSkills: ['Kafka', 'Kubernetes'],
    timeline: [
      { id: 1, date: '2026-06-08 11:45 AM', action: 'Applied', actor: 'Candidate' },
      { id: 2, date: '2026-06-09 09:00 AM', action: 'Moved to Screening', actor: 'System ATS' }
    ],
    notes: []
  },
  {
    id: 3,
    name: 'James Chen',
    email: 'jchen.design@example.com',
    phone: '+1 (555) 456-7890',
    location: 'New York, NY',
    role: 'Product Designer',
    status: 'applied',
    atsScore: 78,
    appliedDate: '2026-06-09',
    experience: '3 years',
    skills: ['Figma', 'UI/UX', 'Wireframing'],
    missingSkills: ['Prototyping', 'User Research'],
    timeline: [
      { id: 1, date: '2026-06-09 04:30 PM', action: 'Applied', actor: 'Candidate' }
    ],
    notes: []
  },
  {
    id: 4,
    name: 'Priya Sharma',
    email: 'priya.s.data@example.com',
    phone: '+1 (555) 222-3333',
    location: 'Seattle, WA',
    role: 'Data Scientist',
    status: 'offered',
    atsScore: 95,
    appliedDate: '2026-05-20',
    experience: '5 years',
    skills: ['Python', 'TensorFlow', 'SQL', 'Pandas', 'Scikit-learn'],
    missingSkills: [],
    timeline: [
      { id: 1, date: '2026-05-20 10:00 AM', action: 'Applied', actor: 'Candidate' },
      { id: 2, date: '2026-05-22 01:00 PM', action: 'Moved to Screening', actor: 'System ATS' },
      { id: 3, date: '2026-05-25 11:00 AM', action: 'Moved to Interview', actor: 'Sarah (Recruiter)' },
      { id: 4, date: '2026-06-02 04:00 PM', action: 'Offer Extended', actor: 'Hiring Manager' }
    ],
    notes: [
      { id: 1, date: '2026-05-26 09:00 AM', author: 'Technical Lead', text: 'Excellent problem solving skills during the technical round.' },
      { id: 2, date: '2026-06-02 04:05 PM', author: 'Sarah (Recruiter)', text: 'Offer sent out. Waiting for candidate response.' }
    ]
  },
  {
    id: 5,
    name: 'David Wilson',
    email: 'david.wilson123@example.com',
    phone: '+1 (555) 777-8888',
    location: 'Chicago, IL',
    role: 'DevOps Engineer',
    status: 'rejected',
    atsScore: 62,
    appliedDate: '2026-06-01',
    experience: '2 years',
    skills: ['Docker', 'AWS'],
    missingSkills: ['Kubernetes', 'Terraform', 'CI/CD'],
    timeline: [
      { id: 1, date: '2026-06-01 08:15 AM', action: 'Applied', actor: 'Candidate' },
      { id: 2, date: '2026-06-02 10:00 AM', action: 'Rejected', actor: 'Sarah (Recruiter)' }
    ],
    notes: [
      { id: 1, date: '2026-06-02 10:05 AM', author: 'Sarah (Recruiter)', text: 'Not enough experience with infrastructure as code (Terraform) or Kubernetes.' }
    ]
  }
];

const STATUS_CONFIG = {
  applied: { label: 'Applied', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  screening: { label: 'Screening', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
  interview: { label: 'Interview', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  offered: { label: 'Offered', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
  rejected: { label: 'Rejected', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' }
};

const getScoreColor = (score) => {
  if (score >= 85) return '#10b981'; // Green
  if (score >= 70) return '#f59e0b'; // Yellow
  return '#ef4444'; // Red
};

const RecruiterApplicants = () => {
  const { user } = useAuth();
  const [applicants, setApplicants] = useState(INITIAL_APPLICANTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplicant, setSelectedApplicant] = useState(applicants[0]);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'notes'

  // Modals state
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  
  // Form States
  const [scheduleData, setScheduleData] = useState({ date: '', time: '', type: 'Technical Interview' });
  const [rejectReason, setRejectReason] = useState('');
  const [newNote, setNewNote] = useState('');

  // Filtering
  const filteredApplicants = applicants.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' ? true : app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (applicantId, newStatus, actionLabel, additionalNote = null) => {
    const now = new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' });
    const actor = user?.name || 'Recruiter';
    
    setApplicants(prev => prev.map(app => {
      if (app.id === applicantId) {
        const updatedApp = {
          ...app,
          status: newStatus,
          timeline: [...app.timeline, { id: Date.now(), date: now, action: actionLabel, actor }]
        };
        if (additionalNote) {
          updatedApp.notes = [...updatedApp.notes, { id: Date.now() + 1, date: now, author: actor, text: additionalNote }];
        }
        if (selectedApplicant?.id === applicantId) setSelectedApplicant(updatedApp);
        return updatedApp;
      }
      return app;
    }));
  };

  const handleShortlist = () => {
    if (!selectedApplicant) return;
    const stages = ['applied', 'screening', 'interview', 'offered'];
    const currentIndex = stages.indexOf(selectedApplicant.status);
    if (currentIndex < stages.length - 1) {
      const nextStatus = stages[currentIndex + 1];
      const actionLabels = {
        'screening': 'Moved to Screening',
        'interview': 'Moved to Interview',
        'offered': 'Offer Extended'
      };
      handleStatusChange(selectedApplicant.id, nextStatus, actionLabels[nextStatus]);
    }
  };

  const handleScheduleInterview = (e) => {
    e.preventDefault();
    if (!selectedApplicant) return;
    const noteText = `Scheduled ${scheduleData.type} on ${scheduleData.date} at ${scheduleData.time}.`;
    handleStatusChange(selectedApplicant.id, 'interview', `Interview Scheduled: ${scheduleData.type}`, noteText);
    setIsScheduleModalOpen(false);
  };

  const handleReject = (e) => {
    e.preventDefault();
    if (!selectedApplicant) return;
    handleStatusChange(selectedApplicant.id, 'rejected', 'Rejected', rejectReason ? `Rejection Reason: ${rejectReason}` : null);
    setIsRejectModalOpen(false);
    setRejectReason('');
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim() || !selectedApplicant) return;
    const now = new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' });
    const actor = user?.name || 'Recruiter';
    
    setApplicants(prev => prev.map(app => {
      if (app.id === selectedApplicant.id) {
        const updatedApp = {
          ...app,
          notes: [...app.notes, { id: Date.now(), date: now, author: actor, text: newNote }]
        };
        setSelectedApplicant(updatedApp);
        return updatedApp;
      }
      return app;
    }));
    setNewNote('');
  };

  return (
    <div className="dashboard-page" style={{ height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      
      {/* Header Banner */}
      <div style={{ 
        background: 'var(--color-surface)', border: '1px solid var(--color-border)', 
        borderRadius: 'var(--radius-xl)', padding: '24px 32px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        boxShadow: 'var(--shadow-sm)', marginBottom: 'var(--space-4)', flexShrink: 0
      }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '4px' }}>
            Applicant Pipeline
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
            Review candidates, manage workflow, and schedule interviews efficiently.
          </p>
        </div>
      </div>

      {/* Split Pane Layout */}
      <div style={{ display: 'flex', flex: 1, gap: 'var(--space-6)', minHeight: 0 }}>
        
        {/* LEFT PANE: Candidate List */}
        <div className="section-card" style={{ flex: '0 0 380px', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
          
          <div className="section-card-header" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h2 className="section-card-title">Candidates ({filteredApplicants.length})</h2>
            
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
              <input 
                type="text" 
                placeholder="Search candidates, roles, skills..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%', padding: '10px 12px 10px 36px', borderRadius: '8px', 
                  border: '1px solid var(--color-border)', background: 'var(--color-bg)',
                  color: 'var(--color-text-primary)', fontSize: '13px'
                }}
              />
            </div>

            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', 
                background: 'var(--color-bg)', color: 'var(--color-text-primary)', fontSize: '13px',
                outline: 'none', cursor: 'pointer'
              }}
            >
              <option value="all">All Statuses</option>
              <option value="applied">Applied</option>
              <option value="screening">Screening</option>
              <option value="interview">Interview</option>
              <option value="offered">Offered</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px 12px 12px' }}>
            {filteredApplicants.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                <Users size={32} style={{ opacity: 0.3, marginBottom: '12px', margin: '0 auto' }} />
                <p style={{ fontWeight: 600, fontSize: '14px', color: 'var(--color-text-primary)' }}>No candidates found</p>
                <p style={{ fontSize: '12px', marginTop: '4px' }}>Try adjusting your filters.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filteredApplicants.map(app => (
                  <div 
                    key={app.id} 
                    onClick={() => setSelectedApplicant(app)}
                    style={{
                      padding: '16px', borderRadius: '12px', border: '1px solid',
                      borderColor: selectedApplicant?.id === app.id ? '#3b82f6' : 'var(--color-border)',
                      background: selectedApplicant?.id === app.id ? 'var(--color-bg-hover)' : 'var(--color-surface)',
                      cursor: 'pointer', transition: 'all 0.2s ease',
                      boxShadow: selectedApplicant?.id === app.id ? '0 0 0 1px #3b82f6' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{app.name}</h3>
                        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{app.role}</p>
                      </div>
                      <div style={{ 
                        width: '36px', height: '36px', borderRadius: '50%', display: 'flex', 
                        alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '13px',
                        border: `2px solid ${getScoreColor(app.atsScore)}`, color: getScoreColor(app.atsScore)
                      }}>
                        {app.atsScore}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                      <span style={{ 
                        fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '12px',
                        textTransform: 'uppercase', letterSpacing: '0.05em',
                        backgroundColor: STATUS_CONFIG[app.status].bg,
                        color: STATUS_CONFIG[app.status].color
                      }}>
                        {STATUS_CONFIG[app.status].label}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>{app.appliedDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANE: Detail View */}
        <div className="section-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
          {selectedApplicant ? (
            <>
              {/* Detail Header */}
              <div style={{ padding: '24px', borderBottom: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '20px', flexShrink: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{ 
                      width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '24px', fontWeight: 'bold'
                    }}>
                      {selectedApplicant.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>{selectedApplicant.name}</h2>
                        <span style={{ 
                          fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '12px', textTransform: 'uppercase',
                          backgroundColor: STATUS_CONFIG[selectedApplicant.status].bg, color: STATUS_CONFIG[selectedApplicant.status].color
                        }}>
                          {STATUS_CONFIG[selectedApplicant.status].label}
                        </span>
                      </div>
                      <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>{selectedApplicant.role}</p>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {selectedApplicant.status !== 'rejected' && selectedApplicant.status !== 'offered' && (
                      <>
                        <Button variant="danger" size="sm" onClick={() => setIsRejectModalOpen(true)}>Reject</Button>
                        <Button variant="secondary" size="sm" onClick={() => setIsScheduleModalOpen(true)}>Schedule</Button>
                        <Button variant="primary" size="sm" onClick={handleShortlist}>Advance Stage</Button>
                      </>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} /> {selectedApplicant.email}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={14} /> {selectedApplicant.phone}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} /> {selectedApplicant.location}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Briefcase size={14} /> {selectedApplicant.experience} exp.</span>
                </div>
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', flexShrink: 0 }}>
                <button 
                  onClick={() => setActiveTab('profile')}
                  style={{ 
                    padding: '16px 24px', fontSize: '14px', fontWeight: 600, border: 'none', background: 'transparent', cursor: 'pointer',
                    color: activeTab === 'profile' ? '#3b82f6' : 'var(--color-text-secondary)',
                    borderBottom: `2px solid ${activeTab === 'profile' ? '#3b82f6' : 'transparent'}`, transition: 'all 0.2s'
                  }}
                >
                  Profile & Resume
                </button>
                <button 
                  onClick={() => setActiveTab('notes')}
                  style={{ 
                    padding: '16px 24px', fontSize: '14px', fontWeight: 600, border: 'none', background: 'transparent', cursor: 'pointer',
                    color: activeTab === 'notes' ? '#3b82f6' : 'var(--color-text-secondary)',
                    borderBottom: `2px solid ${activeTab === 'notes' ? '#3b82f6' : 'transparent'}`, transition: 'all 0.2s'
                  }}
                >
                  Notes & Timeline
                </button>
              </div>

              {/* Tab Content */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {activeTab === 'profile' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px', height: '100%' }}>
                    {/* Left side of profile tab: ATS & Skills */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      {/* ATS Score Card */}
                      <div style={{ padding: '20px', borderRadius: '12px', background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Star size={18} style={{ color: getScoreColor(selectedApplicant.atsScore) }} /> 
                          ATS Evaluation
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                          <div style={{ 
                            fontSize: '32px', fontWeight: 800, color: getScoreColor(selectedApplicant.atsScore)
                          }}>
                            {selectedApplicant.atsScore}/100
                          </div>
                          <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                            <p>Match Level: <strong style={{ color: 'var(--color-text-primary)' }}>{selectedApplicant.atsScore >= 85 ? 'Excellent' : selectedApplicant.atsScore >= 70 ? 'Good' : 'Poor'}</strong></p>
                          </div>
                        </div>
                        
                        {selectedApplicant.missingSkills.length > 0 && (
                          <div style={{ marginTop: '16px' }}>
                            <p style={{ fontSize: '12px', fontWeight: 600, color: '#ef4444', marginBottom: '8px', textTransform: 'uppercase' }}>Missing Keywords</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                              {selectedApplicant.missingSkills.map(s => (
                                <span key={s} style={{ fontSize: '11px', padding: '2px 8px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '4px' }}>{s}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Extracted Skills */}
                      <div>
                        <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Matched Skills</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {selectedApplicant.skills.map(skill => (
                            <span key={skill} style={{ 
                              fontSize: '12px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', 
                              padding: '6px 12px', borderRadius: '6px', fontWeight: 500
                            }}>
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right side of profile tab: Resume Preview Mock */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Resume Preview</h3>
                        <Button variant="ghost" size="sm" leftIcon={<Download size={14} />}>Download PDF</Button>
                      </div>
                      <div style={{ 
                        flex: 1, minHeight: '400px', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', padding: '40px', overflowY: 'auto'
                      }}>
                        {/* Mock Resume Document */}
                        <div style={{ maxWidth: '800px', margin: '0 auto', color: '#333', fontFamily: 'serif' }}>
                          <h1 style={{ fontSize: '28px', borderBottom: '2px solid #333', paddingBottom: '8px', marginBottom: '16px' }}>{selectedApplicant.name}</h1>
                          <p style={{ fontSize: '14px', marginBottom: '24px' }}>{selectedApplicant.email} | {selectedApplicant.phone} | {selectedApplicant.location}</p>
                          
                          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '24px', marginBottom: '12px' }}>Professional Summary</h2>
                          <p style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
                            Dedicated {selectedApplicant.role} with {selectedApplicant.experience} of experience building scalable systems and intuitive interfaces. Proven track record of improving performance and leading cross-functional teams.
                          </p>

                          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '24px', marginBottom: '12px' }}>Experience</h2>
                          <div style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '14px' }}>
                              <span>Senior {selectedApplicant.role} - Tech Corp</span>
                              <span>2022 - Present</span>
                            </div>
                            <ul style={{ fontSize: '14px', lineHeight: '1.6', paddingLeft: '20px', marginTop: '8px' }}>
                              <li>Spearheaded development of core product features using {selectedApplicant.skills[0]} and {selectedApplicant.skills[1]}.</li>
                              <li>Reduced load times by 40% through aggressive caching and optimization.</li>
                              <li>Mentored junior engineers and led code reviews.</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                    {/* Notes Section */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-primary)' }}>Recruiter Notes</h3>
                      
                      <form onSubmit={handleAddNote} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <Input 
                          as="textarea"
                          rows={3}
                          placeholder="Add a note about this candidate..."
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                        />
                        <div style={{ alignSelf: 'flex-end' }}>
                          <Button type="submit" variant="primary" size="sm" disabled={!newNote.trim()}>Add Note</Button>
                        </div>
                      </form>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                        {selectedApplicant.notes.length === 0 ? (
                          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>No notes added yet.</p>
                        ) : (
                          selectedApplicant.notes.slice().reverse().map(note => (
                            <div key={note.id} style={{ padding: '16px', background: 'var(--color-bg)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
                                <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{note.author}</span>
                                <span style={{ color: 'var(--color-text-tertiary)' }}>{note.date}</span>
                              </div>
                              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: '1.5' }}>{note.text}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Timeline Section */}
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '20px' }}>Activity Timeline</h3>
                      <div className="timeline-container" style={{ paddingLeft: '8px' }}>
                        {selectedApplicant.timeline.slice().reverse().map((event, idx) => (
                          <div key={event.id} className="timeline-item" style={{ position: 'relative', paddingLeft: '24px', paddingBottom: '24px', borderLeft: idx === selectedApplicant.timeline.length - 1 ? 'none' : '2px solid var(--color-border)' }}>
                            <div style={{ 
                              position: 'absolute', left: '-5px', top: '0', width: '10px', height: '10px', 
                              borderRadius: '50%', background: '#3b82f6', border: '2px solid var(--color-surface)' 
                            }} />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '-4px' }}>
                              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{event.action}</span>
                              <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{event.date} • by {event.actor}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)' }}>
              <div style={{ textAlign: 'center' }}>
                <Users size={48} style={{ opacity: 0.2, marginBottom: '16px', margin: '0 auto' }} />
                <p style={{ fontSize: '16px', fontWeight: 500 }}>Select a candidate to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- SCHEDULE INTERVIEW MODAL --- */}
      <Modal 
        isOpen={isScheduleModalOpen} 
        onClose={() => setIsScheduleModalOpen(false)}
        title="Schedule Interview"
        subtitle={`Schedule a meeting with ${selectedApplicant?.name}`}
        size="sm"
      >
        <form onSubmit={handleScheduleInterview} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '6px' }}>Interview Type</label>
            <select 
              value={scheduleData.type}
              onChange={(e) => setScheduleData({ ...scheduleData, type: e.target.value })}
              style={{
                width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', 
                background: 'var(--color-bg)', color: 'var(--color-text-primary)', fontSize: '14px', outline: 'none'
              }}
            >
              <option>HR Screening</option>
              <option>Technical Interview</option>
              <option>System Design</option>
              <option>Culture Fit</option>
            </select>
          </div>
          
          <Input 
            label="Date" 
            type="date" 
            required 
            value={scheduleData.date}
            onChange={(e) => setScheduleData({ ...scheduleData, date: e.target.value })}
          />
          
          <Input 
            label="Time" 
            type="time" 
            required 
            value={scheduleData.time}
            onChange={(e) => setScheduleData({ ...scheduleData, time: e.target.value })}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
            <Button variant="ghost" type="button" onClick={() => setIsScheduleModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Schedule</Button>
          </div>
        </form>
      </Modal>

      {/* --- REJECT CANDIDATE MODAL --- */}
      <Modal 
        isOpen={isRejectModalOpen} 
        onClose={() => setIsRejectModalOpen(false)}
        title="Reject Candidate"
        subtitle={`Are you sure you want to reject ${selectedApplicant?.name}?`}
        size="sm"
      >
        <form onSubmit={handleReject} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input 
            label="Rejection Reason (Internal Note)" 
            as="textarea"
            rows={3}
            placeholder="e.g. Lacks required experience with React..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
            <Button variant="ghost" type="button" onClick={() => setIsRejectModalOpen(false)}>Cancel</Button>
            <Button variant="danger" type="submit">Confirm Rejection</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default RecruiterApplicants;
