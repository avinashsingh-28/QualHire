import { 
  UploadCloud, FileText, CheckCircle, AlertCircle, File, Eye, Download, Trash2, Target, BarChart2
} from 'lucide-react';
import { StatCard } from '../../components/Card';
import Button from '../../components/Button';
import './Dashboard.css';

const MOCK_RESUMES = [
  { id: 1, name: 'Alex_Johnson_Resume_2024.pdf', date: 'Oct 24, 2024', size: '2.4 MB', active: true },
  { id: 2, name: 'Alex_Johnson_Frontend.pdf', date: 'Aug 12, 2024', size: '1.8 MB', active: false },
  { id: 3, name: 'Alex_Johnson_Resume_Old.pdf', date: 'Jan 05, 2024', size: '2.1 MB', active: false },
];

const ANALYTICS = {
  atsScore: '88/100',
  strength: 'Strong',
  missingSkills: ['GraphQL', 'AWS', 'Docker'],
  suggestions: [
    'Add more quantifiable metrics (e.g., "Increased conversion by X%").',
    'Include missing skill "GraphQL" based on your target roles.',
    'Use stronger action verbs in the "TechCorp Solutions" experience section.'
  ]
};

const CandidateResume = () => {
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
              <div className="upload-dropzone">
                <UploadCloud size={48} color="var(--color-primary-light)" style={{ marginBottom: 'var(--space-4)' }} />
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-primary)' }}>
                  Drag & drop your resume here
                </h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                  Supports PDF, DOCX, up to 5MB.
                </p>
                <Button>Browse Files</Button>
              </div>
            </div>
          </div>

          {/* Resume Preview */}
          <div className="section-card">
            <div className="section-card-header">
              <h2 className="section-card-title"><Eye size={18} /> Active Resume Preview</h2>
              <Button variant="ghost" size="sm" rightIcon={<Download size={14} />}>Download PDF</Button>
            </div>
            <div className="section-card-body">
              <div className="resume-preview-container">
                <div className="resume-preview-mock">
                  <div className="resume-mock-header">
                    <h2>ALEX JOHNSON</h2>
                    <p>Senior Frontend Engineer | San Francisco, CA | alex.johnson@example.com</p>
                  </div>
                  <div className="resume-mock-body">
                    <h3>EXPERIENCE</h3>
                    <h4>Senior Frontend Engineer — TechCorp Solutions</h4>
                    <p>• Led the frontend architecture for a high-traffic SaaS platform...</p>
                    <p>• Improved initial load time by 40% using code splitting...</p>
                    
                    <h3>EDUCATION</h3>
                    <h4>B.S. Computer Science — UC Berkeley</h4>
                  </div>
                </div>
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
                  <span className="analytics-score-val">{ANALYTICS.atsScore}</span>
                  <span className="analytics-score-lbl">ATS Score</span>
                </div>
                <div className="analytics-score-box">
                  <CheckCircle size={24} color="var(--color-success)" />
                  <span className="analytics-score-val">{ANALYTICS.strength}</span>
                  <span className="analytics-score-lbl">Strength</span>
                </div>
              </div>

              <div className="analytics-section">
                <h4 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--color-danger)', marginBottom: 'var(--space-2)' }}>
                  <AlertCircle size={16} /> Missing Key Skills
                </h4>
                <div className="job-tags">
                  {ANALYTICS.missingSkills.map(s => <span key={s} className="job-tag">{s}</span>)}
                </div>
              </div>

              <div className="analytics-section" style={{ marginTop: 'var(--space-5)' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>
                  <FileText size={16} /> Improvement Suggestions
                </h4>
                <ul className="suggestions-list">
                  {ANALYTICS.suggestions.map((sug, i) => (
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
                {MOCK_RESUMES.map(res => (
                  <div key={res.id} className={`resume-history-item ${res.active ? 'active' : ''}`}>
                    <File size={24} color={res.active ? 'var(--color-primary)' : 'var(--color-text-tertiary)'} />
                    <div className="resume-history-info">
                      <p className="resume-history-name">{res.name} {res.active && <span className="badge badge-primary" style={{ fontSize: '10px', marginLeft: 'var(--space-2)' }}>Active</span>}</p>
                      <p className="resume-history-meta">{res.date} • {res.size}</p>
                    </div>
                    <button className="resume-history-action" title="Delete">
                      <Trash2 size={16} color="var(--color-text-tertiary)" />
                    </button>
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

export default CandidateResume;
