import React, { useState } from 'react';
import { 
  Briefcase, Building2, MapPin, Calendar, Clock, 
  CheckCircle2, FileText, MessageSquare, ChevronRight,
  ExternalLink, Search, Filter
} from 'lucide-react';
import './Dashboard.css'; // Use shared styles

const PIPELINE_STEPS = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired'];

const MOCK_APPLICATIONS = [
  {
    id: 1,
    role: "Senior Frontend Engineer",
    company: "TechNova Solutions",
    location: "Remote, US",
    appliedDate: "Oct 15, 2026",
    status: "Interview",
    currentStepIndex: 2, // 'Interview'
    logo: "T",
    logoBg: "#4f46e5",
    type: "Full-time",
    salary: "$140k - $160k",
    timeline: [
      { id: 101, status: "Applied", date: "Oct 15, 2026", time: "09:00 AM", note: "Application submitted via QualHire." },
      { id: 102, status: "Screening", date: "Oct 18, 2026", time: "02:30 PM", note: "Resume parsed. ATS score: 92%. Recruiter reviewed profile." },
      { id: 103, status: "Interview", date: "Oct 25, 2026", time: "10:00 AM", note: "Technical Round 1 scheduled with Engineering Manager." }
    ],
    nextAction: {
      title: "Technical Interview",
      date: "Oct 25, 2026",
      time: "10:00 AM - 11:00 AM PST",
      link: "https://zoom.us/j/123456789"
    },
    recruiterNotes: "Strong background in React and performance optimization. Needs to demonstrate system design skills in the next round."
  },
  {
    id: 2,
    role: "Full Stack Developer",
    company: "FinServe Inc.",
    location: "New York, NY",
    appliedDate: "Oct 20, 2026",
    status: "Screening",
    currentStepIndex: 1, // 'Screening'
    logo: "F",
    logoBg: "#0ea5e9",
    type: "Hybrid",
    salary: "$130k - $150k",
    timeline: [
      { id: 201, status: "Applied", date: "Oct 20, 2026", time: "11:15 AM", note: "Application submitted." },
      { id: 202, status: "Screening", date: "Oct 22, 2026", time: "04:00 PM", note: "Initial HR screening scheduled." }
    ],
    nextAction: {
      title: "HR Screening Call",
      date: "Oct 24, 2026",
      time: "03:00 PM - 03:30 PM EST",
      link: "Phone Call"
    },
    recruiterNotes: "Candidate aligns well with the hybrid role requirements. Verify availability for NYC office."
  },
  {
    id: 3,
    role: "React Native Developer",
    company: "Appify Mobile",
    location: "San Francisco, CA",
    appliedDate: "Sep 28, 2026",
    status: "Offer",
    currentStepIndex: 3, // 'Offer'
    logo: "A",
    logoBg: "#10b981",
    type: "Full-time",
    salary: "$150k + Equity",
    timeline: [
      { id: 301, status: "Applied", date: "Sep 28, 2026", time: "08:45 AM", note: "Application submitted." },
      { id: 302, status: "Screening", date: "Oct 02, 2026", time: "10:00 AM", note: "Completed HR screening." },
      { id: 303, status: "Interview", date: "Oct 10, 2026", time: "01:00 PM", note: "Completed technical and behavioral rounds." },
      { id: 304, status: "Offer", date: "Oct 18, 2026", time: "05:00 PM", note: "Offer extended. Awaiting candidate signature." }
    ],
    nextAction: {
      title: "Review Offer Letter",
      date: "Oct 25, 2026 (Deadline)",
      time: "5:00 PM PST",
      link: "View Document"
    },
    recruiterNotes: "Outstanding performance in mobile architecture round. Team is very excited."
  }
];

const CandidateApplications = () => {
  const [selectedApp, setSelectedApp] = useState(MOCK_APPLICATIONS[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredApps = MOCK_APPLICATIONS.filter(app => 
    app.role.toLowerCase().includes(searchTerm.toLowerCase()) || 
    app.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Application Tracking</h1>
          <p className="page-subtitle">Track your pipeline, upcoming interviews, and offers.</p>
        </div>
      </div>

      <div className="dashboard-grid-3">
        {/* LEFT COLUMN: Application List */}
        <div className="applications-list-container section-card" style={{ display: 'flex', flexDirection: 'column', padding: 0 }}>
          <div className="section-card-header" style={{ borderBottom: '1px solid var(--color-border)' }}>
            <h2 className="section-card-title">My Applications</h2>
            <div style={{ position: 'relative', width: '200px' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
              <input 
                type="text" 
                placeholder="Search jobs..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%', padding: '8px 12px 8px 32px', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)', background: 'var(--color-background)',
                  color: 'var(--color-text-primary)', fontSize: '13px'
                }}
              />
            </div>
          </div>
          <div className="applications-list" style={{ overflowY: 'auto', maxHeight: '700px' }}>
            {filteredApps.map(app => (
              <div 
                key={app.id} 
                className={`application-card-minimal ${selectedApp.id === app.id ? 'active' : ''}`}
                onClick={() => setSelectedApp(app)}
                style={{
                  padding: '20px', borderBottom: '1px solid var(--color-border)', cursor: 'pointer',
                  background: selectedApp.id === app.id ? 'var(--color-surface-hover)' : 'transparent',
                  transition: 'background 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '10px', background: app.logoBg,
                    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 'bold', fontSize: '18px', flexShrink: 0
                  }}>
                    {app.logo}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '4px', color: 'var(--color-text-primary)' }}>{app.role}</h3>
                    <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                      <Building2 size={13} /> {app.company}
                    </p>
                    
                    {/* Mini Pipeline Indicator */}
                    <div className="mini-pipeline" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {PIPELINE_STEPS.map((step, idx) => (
                        <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{
                            height: '4px', borderRadius: '2px',
                            background: idx <= app.currentStepIndex ? (idx === 3 && app.currentStepIndex >= 3 ? '#10b981' : '#3b82f6') : 'var(--color-border)'
                          }} />
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: '500' }}>
                      <span>Applied</span>
                      <span style={{ color: app.currentStepIndex >= 3 ? '#10b981' : '#3b82f6' }}>{app.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Application Details */}
        <div className="application-details-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Header Card */}
          <div className="section-card">
            <div className="section-card-body" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '16px', background: selectedApp.logoBg,
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 'bold', fontSize: '28px', flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                  {selectedApp.logo}
                </div>
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '8px' }}>
                    {selectedApp.role}
                  </h2>
                  <div style={{ display: 'flex', gap: '16px', color: 'var(--color-text-secondary)', fontSize: '14px', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Building2 size={16} /> {selectedApp.company}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={16} /> {selectedApp.location}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Briefcase size={16} /> {selectedApp.type}</span>
                  </div>
                </div>
              </div>
              <button className="welcome-btn-secondary" style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                View Job Post <ExternalLink size={14} />
              </button>
            </div>
            
            {/* Full Pipeline */}
            <div style={{ padding: '24px', borderTop: '1px solid var(--color-border)', background: 'var(--color-background)' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '20px', color: 'var(--color-text-primary)' }}>Application Pipeline</h3>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '16px', left: '10%', right: '10%', height: '2px', background: 'var(--color-border)', zIndex: 0 }} />
                {PIPELINE_STEPS.map((step, idx) => {
                  const isCompleted = idx <= selectedApp.currentStepIndex;
                  const isCurrent = idx === selectedApp.currentStepIndex;
                  return (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 1, width: '80px' }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        background: isCompleted ? (idx === 3 && selectedApp.currentStepIndex >= 3 ? '#10b981' : '#3b82f6') : 'var(--color-surface)',
                        border: `2px solid ${isCompleted ? (idx === 3 && selectedApp.currentStepIndex >= 3 ? '#10b981' : '#3b82f6') : 'var(--color-border)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: isCompleted ? '#fff' : 'var(--color-text-secondary)',
                        boxShadow: isCurrent ? '0 0 0 4px rgba(59, 130, 246, 0.2)' : 'none',
                        transition: 'all 0.3s ease'
                      }}>
                        {isCompleted ? <CheckCircle2 size={16} /> : <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-border)' }} />}
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: isCurrent ? '600' : '500', color: isCompleted ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="dashboard-grid">
            {/* Next Action & Schedule */}
            <div className="section-card">
              <div className="section-card-header">
                <h3 className="section-card-title"><Calendar size={18} style={{ color: '#3b82f6' }} /> Interview Schedule</h3>
              </div>
              <div className="section-card-body">
                {selectedApp.nextAction ? (
                  <div style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <h4 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--color-text-primary)' }}>{selectedApp.nextAction.title}</h4>
                      <span style={{ fontSize: '11px', fontWeight: '600', background: '#3b82f6', color: '#fff', padding: '4px 8px', borderRadius: '12px' }}>Upcoming</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={14} /> {selectedApp.nextAction.date}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={14} /> {selectedApp.nextAction.time}</span>
                    </div>
                    <button className="welcome-btn-primary" style={{ marginTop: '16px', width: '100%', padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: '600' }}>
                      {selectedApp.nextAction.link.includes('http') ? 'Join Meeting' : selectedApp.nextAction.link}
                    </button>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '20px', color: 'var(--color-text-secondary)' }}>
                    <Calendar size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                    <p style={{ fontSize: '14px' }}>No upcoming interviews scheduled.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recruiter Notes */}
            <div className="section-card">
              <div className="section-card-header">
                <h3 className="section-card-title"><MessageSquare size={18} style={{ color: '#8b5cf6' }} /> Recruiter Notes</h3>
              </div>
              <div className="section-card-body">
                <div style={{ background: 'var(--color-background)', borderRadius: '12px', padding: '16px', border: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#8b5cf6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold' }}>
                      R
                    </div>
                    <div>
                      <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)' }}>Sarah Recruiter</h4>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Shared with Hiring Team</p>
                    </div>
                  </div>
                  <p style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--color-text-primary)' }}>
                    "{selectedApp.recruiterNotes}"
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="section-card">
            <div className="section-card-header">
              <h3 className="section-card-title"><FileText size={18} /> Status Timeline</h3>
            </div>
            <div className="section-card-body" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0', position: 'relative' }}>
                <div style={{ position: 'absolute', left: '11px', top: '24px', bottom: '24px', width: '2px', background: 'var(--color-border)', zIndex: 0 }} />
                
                {[...selectedApp.timeline].reverse().map((event, index) => (
                  <div key={event.id} style={{ display: 'flex', gap: '20px', position: 'relative', zIndex: 1, paddingBottom: index === selectedApp.timeline.length - 1 ? '0' : '32px' }}>
                    <div style={{
                      width: '24px', height: '24px', borderRadius: '50%', background: index === 0 ? '#3b82f6' : 'var(--color-surface)',
                      border: `2px solid ${index === 0 ? '#3b82f6' : 'var(--color-border)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px'
                    }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: index === 0 ? '#fff' : 'var(--color-border)' }} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '4px' }}>
                        <h4 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--color-text-primary)' }}>{event.status}</h4>
                        <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{event.date} at {event.time}</span>
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: '1.5' }}>{event.note}</p>
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

export default CandidateApplications;
