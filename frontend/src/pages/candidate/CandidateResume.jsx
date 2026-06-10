import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UploadCloud, FileText, CheckCircle, AlertCircle, File, Eye, Download, Trash2, Target, BarChart2, Sparkles, FolderOpen
} from 'lucide-react';
import { StatCard } from '../../components/Card';
import Button from '../../components/Button';
import useAuth from '../../hooks/useAuth';
import './Dashboard.css';

const DEFAULT_ANALYTICS = {
  atsScore: 'N/A',
  strength: 'N/A',
  missingSkills: [],
  suggestions: ['Please upload or select a resume and click "Analyze with AI" to get feedback.']
};

const MOCK_PROFILE = {
  personal: {
    name: 'Alex Johnson',
    title: 'Senior Frontend Engineer',
    location: 'San Francisco, CA (Remote)',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 123-4567',
    summary: 'Passionate and detail-oriented Frontend Engineer with 6+ years of experience building scalable web applications. Specializing in React, TypeScript, and modern CSS architecture. Proven track record of improving web performance and leading UI development teams.',
  },
  skills: {
    core: ['JavaScript (ES6+)', 'TypeScript', 'React', 'Next.js', 'Node.js'],
    ui: ['CSS/SASS', 'Tailwind CSS', 'Framer Motion', 'Storybook', 'Figma'],
    tools: ['Git', 'Webpack', 'Vite', 'Jest', 'Cypress']
  },
  experience: [
    {
      id: 1,
      role: 'Senior Frontend Engineer',
      company: 'TechCorp Solutions',
      duration: 'Jan 2021 – Present',
      description: 'Led the frontend architecture for a high-traffic SaaS platform. Improved initial load time by 40% using code splitting and lazy loading. Mentored 3 junior developers.',
    },
    {
      id: 2,
      role: 'UI Developer',
      company: 'Creative Digital Studio',
      duration: 'Mar 2018 – Dec 2020',
      description: 'Developed responsive and accessible user interfaces for e-commerce clients. Created a reusable component library that reduced development time across projects by 25%.',
    }
  ],
  education: [
    {
      id: 1,
      degree: 'B.S. in Computer Science',
      school: 'University of California, Berkeley',
      year: '2014 – 2018',
    }
  ],
  projects: [
    {
      id: 1,
      name: 'OpenSource Dashboard UI',
      description: 'A comprehensive admin dashboard template built with React and Tailwind CSS. Garnered 2k+ stars on GitHub.',
      link: 'github.com/alexj/dashboard'
    },
    {
      id: 2,
      name: 'E-commerce Storefront',
      description: 'Headless e-commerce build using Next.js and Shopify API, featuring 99/100 Lighthouse performance scores.',
      link: 'ecommerce-demo.alexj.dev'
    }
  ],
  certifications: [
    { id: 1, name: 'AWS Certified Developer - Associate', date: '2023', issuer: 'Amazon Web Services' },
    { id: 2, name: 'Advanced React Patterns', date: '2022', issuer: 'Frontend Masters' }
  ],
  links: {
    github: 'github.com/alexjohnson',
    linkedin: 'linkedin.com/in/alexjohnson',
    portfolio: 'alexj.dev'
  }
};

const CandidateResume = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const userResumesKey = `qh_resumes_${user?.id}`;
  const userProfileKey = `qh_profile_${user?.id}`;

  const [resumes, setResumes] = useState(() => {
    try {
      const saved = localStorage.getItem(userResumesKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [profileData, setProfileData] = useState(() => {
    try {
      const saved = localStorage.getItem(userProfileKey);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const activeResume = resumes.find(res => res.active) || resumes[0];

  const downloadResume = () => {
    if (!activeResume) return;
    
    let text = `RESUME: ${profileData?.personal?.name || user?.name || 'Candidate'}\n`;
    text += `Title: ${profileData?.personal?.title || user?.title || ''}\n`;
    text += `Email: ${profileData?.personal?.email || user?.email || ''}\n`;
    text += `Location: ${profileData?.personal?.location || ''}\n\n`;
    
    if (profileData?.personal?.summary) {
      text += `SUMMARY:\n${profileData.personal.summary}\n\n`;
    }
    
    if (profileData?.experience && profileData.experience.length > 0) {
      text += `EXPERIENCE:\n`;
      profileData.experience.forEach(exp => {
        text += `- ${exp.role} at ${exp.company} (${exp.duration})\n  ${exp.description}\n`;
      });
      text += `\n`;
    }
    
    if (profileData?.education && profileData.education.length > 0) {
      text += `EDUCATION:\n`;
      profileData.education.forEach(edu => {
        text += `- ${edu.degree} from ${edu.school} (${edu.year})\n`;
      });
      text += `\n`;
    }
    
    if (profileData?.skills?.core?.length > 0) {
      text += `SKILLS:\n${profileData.skills.core.join(', ')}\n`;
    }
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(profileData?.personal?.name || user?.name || 'Resume').replace(/\s+/g, '_')}_Resume.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    addResume(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    addResume(file);
  };

  const addResume = (file) => {
    const newResume = {
      id: Date.now(),
      name: file.name,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      active: resumes.length === 0, // set active if it's the first one
      atsScore: null,
      analysis: null
    };

    const updated = [...resumes, newResume];
    setResumes(updated);
    localStorage.setItem(userResumesKey, JSON.stringify(updated));
  };

  const handleSetActive = (id) => {
    const updated = resumes.map(res => ({
      ...res,
      active: res.id === id
    }));
    setResumes(updated);
    localStorage.setItem(userResumesKey, JSON.stringify(updated));
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    const filtered = resumes.filter(res => res.id !== id);
    // If the active resume was deleted, make the first remaining one active
    if (filtered.length > 0 && !filtered.some(res => res.active)) {
      filtered[0].active = true;
    }
    setResumes(filtered);
    localStorage.setItem(userResumesKey, JSON.stringify(filtered));
  };

  const loadDemoResume = () => {
    const demoResumes = [
      { id: 1, name: 'Alex_Johnson_Resume_2024.pdf', date: 'Oct 24, 2024', size: '2.4 MB', active: true, atsScore: 88, analysis: {
        atsScore: 88,
        industryMatch: 92,
        readability: 85,
        keywordOptimization: 78,
        skills: [
          { name: 'React', match: 100 },
          { name: 'TypeScript', match: 90 },
          { name: 'Node.js', match: 80 }
        ],
        missingSkills: ['GraphQL', 'AWS', 'Docker'],
        suggestions: [
          { type: 'critical', text: 'You are missing "GraphQL", which is required in 60% of your target job descriptions.' },
          { type: 'warning', text: 'In the "TechCorp" experience section, replace "worked on" with stronger verbs.' },
          { type: 'success', text: 'Great use of quantifiable metrics in the recent role.' }
        ]
      }},
      { id: 2, name: 'Alex_Johnson_Frontend.pdf', date: 'Aug 12, 2024', size: '1.8 MB', active: false, atsScore: 75, analysis: null },
    ];
    setResumes(demoResumes);
    localStorage.setItem(userResumesKey, JSON.stringify(demoResumes));

    // Sync demo profile to localStorage and load state
    localStorage.setItem(userProfileKey, JSON.stringify(MOCK_PROFILE));
    setProfileData(MOCK_PROFILE);
  };

  // Compute analytics based on active resume
  const getAnalytics = () => {
    if (!activeResume) return DEFAULT_ANALYTICS;
    if (!activeResume.analysis) {
      return {
        atsScore: 'N/A',
        strength: 'Not Scanned',
        missingSkills: [],
        suggestions: ['This resume has not been scanned yet. Click "Analyze with AI" to generate feedback.']
      };
    }
    const score = activeResume.analysis.atsScore;
    return {
      atsScore: `${score}/100`,
      strength: score >= 85 ? 'Strong' : score >= 70 ? 'Fair' : 'Weak',
      missingSkills: activeResume.analysis.missingSkills || [],
      suggestions: activeResume.analysis.suggestions?.map(s => s.text) || []
    };
  };

  const analytics = getAnalytics();

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Resume Management</h1>
          <p className="page-subtitle">Upload, manage, and analyze your resumes for better ATS compatibility.</p>
        </div>
      </div>

      <div className="dashboard-grid-3">
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          
          {/* Upload Area */}
          <div className="section-card">
            <div className="section-card-header">
              <h2 className="section-card-title"><UploadCloud size={18} /> Upload Resume</h2>
            </div>
            <div className="section-card-body">
              <div 
                className="upload-dropzone"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.docx"
                  style={{ display: 'none' }}
                />
                <UploadCloud size={48} color="var(--color-primary-light)" style={{ marginBottom: 'var(--space-4)' }} />
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-primary)' }}>
                  Drag & drop your resume here
                </h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                  Supports PDF, DOCX, up to 5MB.
                </p>
                <Button type="button">Browse Files</Button>
              </div>
            </div>
          </div>

          {/* Resume Preview */}
          <div className="section-card">
            <div className="section-card-header">
              <h2 className="section-card-title"><Eye size={18} /> Active Resume Preview</h2>
              {activeResume && (
                <Button variant="ghost" size="sm" rightIcon={<Download size={14} />} onClick={downloadResume}>Download Resume</Button>
              )}
            </div>
            <div className="section-card-body">
              <div className="resume-preview-container">
                {activeResume ? (
                  <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
                    <div className="resume-preview-file-header" style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 16px',
                      background: 'var(--color-surface-2)',
                      borderBottom: '1px solid var(--color-border)',
                      borderTopLeftRadius: '8px',
                      borderTopRightRadius: '8px'
                    }}>
                      <FileText size={18} color="var(--color-primary)" />
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{activeResume.name}</span>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginLeft: 'auto' }}>{activeResume.size}</span>
                    </div>
                    <div className="resume-preview-mock" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
                      <div className="resume-mock-header">
                        <h2>{profileData?.personal?.name?.toUpperCase() || user?.name?.toUpperCase() || 'YOUR NAME'}</h2>
                        <p>
                          {profileData?.personal?.title || user?.title || 'Title'} | {profileData?.personal?.location || 'Location'} | {profileData?.personal?.email || user?.email}
                          {profileData?.personal?.phone && ` | ${profileData.personal.phone}`}
                        </p>
                      </div>
                      <div className="resume-mock-body">
                        {profileData?.personal?.summary ? (
                          <>
                            <h3>PROFESSIONAL SUMMARY</h3>
                            <p style={{ fontSize: '13px', lineHeight: '1.5', color: 'var(--color-text-secondary)' }}>{profileData.personal.summary}</p>
                          </>
                        ) : (
                          <div style={{ padding: '8px 0', borderBottom: '1px solid var(--color-border)', marginBottom: '16px' }}>
                            <p style={{ fontStyle: 'italic', fontSize: '13px', color: 'var(--color-text-secondary)' }}>No summary added yet. Edit your profile to fill details.</p>
                          </div>
                        )}

                        <h3>EXPERIENCE</h3>
                        {profileData?.experience && profileData.experience.length > 0 ? (
                          profileData.experience.map(exp => (
                            <div key={exp.id} style={{ marginBottom: '16px' }}>
                              <h4 style={{ fontWeight: 'bold', fontSize: '14px', color: 'var(--color-text-primary)' }}>{exp.role} — {exp.company}</h4>
                              <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>{exp.duration}</p>
                              <p style={{ fontSize: '13px', lineHeight: '1.5', color: 'var(--color-text-secondary)' }}>{exp.description}</p>
                            </div>
                          ))
                        ) : (
                          <div style={{ marginBottom: '16px' }}>
                            <p style={{ fontStyle: 'italic', fontSize: '13px', color: 'var(--color-text-secondary)' }}>No experience listed. Edit your profile to add experience details.</p>
                          </div>
                        )}

                        <h3>EDUCATION</h3>
                        {profileData?.education && profileData.education.length > 0 ? (
                          profileData.education.map(edu => (
                            <div key={edu.id} style={{ marginBottom: '12px' }}>
                              <h4 style={{ fontWeight: 'bold', fontSize: '13px', color: 'var(--color-text-primary)' }}>{edu.degree}</h4>
                              <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{edu.school} ({edu.year})</p>
                            </div>
                          ))
                        ) : (
                          <div style={{ marginBottom: '16px' }}>
                            <p style={{ fontStyle: 'italic', fontSize: '13px', color: 'var(--color-text-secondary)' }}>No education listed. Edit your profile to add school details.</p>
                          </div>
                        )}
                        
                        {profileData?.skills?.core && profileData.skills.core.length > 0 && (
                          <>
                            <h3>SKILLS</h3>
                            <p style={{ fontSize: '13px', lineHeight: '1.5', color: 'var(--color-text-secondary)' }}>{profileData.skills.core.join(', ')}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--color-text-secondary)' }}>
                    <FileText size={48} style={{ opacity: 0.2, margin: '0 auto 16px' }} />
                    <p style={{ fontSize: '15px', fontWeight: 500 }}>No active resume</p>
                    <p style={{ fontSize: '12px', marginTop: '4px' }}>Upload a resume file to see its preview here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          
          {/* Analytics Summary */}
          <div className="section-card">
            <div className="section-card-header">
              <h2 className="section-card-title"><BarChart2 size={18} /> Resume Analytics</h2>
            </div>
            <div className="section-card-body">
              <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                <div className="analytics-score-box">
                  <Target size={24} color="var(--color-warning)" />
                  <span className="analytics-score-val">{analytics.atsScore}</span>
                  <span className="analytics-score-lbl">ATS Score</span>
                </div>
                <div className="analytics-score-box">
                  <CheckCircle size={24} color="var(--color-success)" />
                  <span className="analytics-score-val">{analytics.strength}</span>
                  <span className="analytics-score-lbl">Strength</span>
                </div>
              </div>

              <div className="analytics-section">
                <h4 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--color-danger)', marginBottom: 'var(--space-2)' }}>
                  <AlertCircle size={16} /> Missing Key Skills
                </h4>
                <div className="job-tags">
                  {analytics.missingSkills.length > 0 ? (
                    analytics.missingSkills.map(s => <span key={s} className="job-tag">{s}</span>)
                  ) : (
                    <span style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', fontStyle: 'italic' }}>
                      {activeResume ? 'No missing skills detected' : 'Upload resume to analyze'}
                    </span>
                  )}
                </div>
              </div>

              <div className="analytics-section" style={{ marginTop: 'var(--space-5)' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>
                  <FileText size={16} /> Improvement Suggestions
                </h4>
                <ul className="suggestions-list">
                  {analytics.suggestions.map((sug, i) => (
                    <li key={i} className="suggestion-item">
                      <div className="suggestion-dot" />
                      <p>{sug}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Resume History */}
          <div className="section-card">
            <div className="section-card-header">
              <h2 className="section-card-title"><FileText size={18} /> Resume History</h2>
            </div>
            <div className="section-card-body" style={{ padding: '0 var(--space-6) var(--space-4)' }}>
              <div className="resume-history-list">
                {resumes.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '32px var(--space-4)', color: 'var(--color-text-secondary)' }}>
                    <p style={{ fontSize: '13px', fontStyle: 'italic' }}>No resumes uploaded yet.</p>
                  </div>
                ) : (
                  resumes.map(res => (
                    <div 
                      key={res.id} 
                      className={`resume-history-item ${res.active ? 'active' : ''}`} 
                      onClick={() => handleSetActive(res.id)}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--color-border)', cursor: 'pointer' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <File size={24} color={res.active ? 'var(--color-primary)' : 'var(--color-text-tertiary)'} />
                        <div className="resume-history-info">
                          <p className="resume-history-name" style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                            {res.name} {res.active && <span className="badge badge-primary" style={{ fontSize: '10px', marginLeft: 'var(--space-2)' }}>Active</span>}
                          </p>
                          <p className="resume-history-meta" style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                            {res.date} • {res.size}
                          </p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} onClick={e => e.stopPropagation()}>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={() => navigate(`/candidate/resume/${res.id}/analysis`)} 
                          leftIcon={<Sparkles size={14} color="#8b5cf6" />}
                        >
                          {res.analysis ? 'View AI Report' : 'Analyze with AI'}
                        </Button>
                        <button 
                          className="resume-history-action" 
                          title="Delete" 
                          onClick={(e) => handleDelete(res.id, e)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          <Trash2 size={16} color="var(--color-text-tertiary)" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CandidateResume;
