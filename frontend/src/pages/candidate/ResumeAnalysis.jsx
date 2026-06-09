import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Sparkles, Target, Zap, 
  FileText, CheckCircle, AlertTriangle, TrendingUp, XCircle 
} from 'lucide-react';
import Button from '../../components/Button';
import './Dashboard.css';

const MOCK_ANALYSIS = {
  resumeName: 'Alex_Johnson_Resume_2024.pdf',
  atsScore: 88,
  industryMatch: 92,
  readability: 85,
  keywordOptimization: 78,
  skills: [
    { name: 'React', match: 100 },
    { name: 'TypeScript', match: 90 },
    { name: 'Node.js', match: 80 },
    { name: 'System Design', match: 60 }
  ],
  missingSkills: ['GraphQL', 'AWS', 'Docker'],
  structure: {
    metricsUsed: '45%',
    actionVerbs: 'High',
    fluffWords: 'Low',
    length: 'Optimal (1 page)'
  },
  suggestions: [
    { type: 'critical', text: 'You are missing "GraphQL", which is required in 60% of your target job descriptions.' },
    { type: 'warning', text: 'In the "TechCorp" experience section, replace "worked on" with stronger verbs like "engineered" or "architected".' },
    { type: 'success', text: 'Great use of quantifiable metrics in the recent role (e.g., "Increased conversion by 40%").' },
    { type: 'warning', text: 'Consider reducing the summary length to 2-3 concise sentences.' }
  ]
};

// Simple SVG Circle Progress Component
const CircularProgress = ({ value, color, size = 120, strokeWidth = 10 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle 
          cx={size / 2} cy={size / 2} r={radius} 
          fill="transparent" stroke="var(--color-surface)" strokeWidth={strokeWidth} 
        />
        <circle 
          cx={size / 2} cy={size / 2} r={radius} 
          fill="transparent" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
        />
      </svg>
      <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>{value}</span>
        <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>/ 100</span>
      </div>
    </div>
  );
};

const ResumeAnalysis = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(MOCK_ANALYSIS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        // Replace with actual resume extraction logic eventually
        const sampleResume = `
          Alex Johnson
          Senior Frontend Engineer
          alex.johnson@example.com
          
          Experience:
          Senior Frontend Engineer at TechCorp Solutions (2020 - Present)
          - Led frontend architecture for SaaS platform.
          - Improved load time by 40%.
          
          Skills: React, TypeScript, Node.js
        `;
        
        const response = await fetch('http://localhost:8080/api/resume/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resumeText: sampleResume, targetRole: 'Senior Frontend Engineer' })
        });

        if (!response.ok) {
          throw new Error('Failed to analyze resume');
        }

        const data = await response.json();
        // Assume API returns exactly the format we need, but maybe keep resumeName
        data.resumeName = MOCK_ANALYSIS.resumeName;
        setAnalysis(data);
      } catch (err) {
        console.error("Error fetching analysis:", err);
        setError("Could not generate AI analysis. Using cached data.");
        setAnalysis(MOCK_ANALYSIS); // Fallback
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [id]);

  if (loading) {
    return (
      <div className="dashboard-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: '16px' }}>
        <Sparkles size={48} color="#8b5cf6" style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
        <h2 style={{ color: 'var(--color-text-primary)' }}>AI is analyzing your resume...</h2>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: 'var(--space-6)' }}>
        <button onClick={() => navigate('/candidate/resume')} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '8px', color: 'var(--color-text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            AI Analysis
            <Sparkles size={20} color="#8b5cf6" />
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>{analysis.resumeName}</p>
          {error && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{error}</p>}
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <Button variant="primary" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', border: 'none' }} leftIcon={<Target size={16} />}>
            Match with Jobs
          </Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-6)' }}>
        
        {/* Left Column: Overall Scores */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <div className="section-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '32px 24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '24px' }}>Overall ATS Score</h2>
            <CircularProgress value={analysis.atsScore} color="#10b981" size={160} strokeWidth={12} />
            <p style={{ marginTop: '24px', fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
              Your resume is highly optimized for Applicant Tracking Systems. It will likely pass the automated screening for Senior Frontend roles.
            </p>
          </div>

          <div className="section-card">
            <div className="section-card-header">
              <h2 className="section-card-title"><TrendingUp size={18} /> Breakdown Metrics</h2>
            </div>
            <div className="section-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', fontWeight: 600 }}>
                  <span color="var(--color-text-primary)">Industry Match</span>
                  <span style={{ color: '#3b82f6' }}>{analysis.industryMatch}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'var(--color-surface)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${analysis.industryMatch}%`, height: '100%', background: '#3b82f6', borderRadius: '4px' }} />
                </div>
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', fontWeight: 600 }}>
                  <span color="var(--color-text-primary)">Readability</span>
                  <span style={{ color: '#10b981' }}>{analysis.readability}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'var(--color-surface)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${analysis.readability}%`, height: '100%', background: '#10b981', borderRadius: '4px' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', fontWeight: 600 }}>
                  <span color="var(--color-text-primary)">Keyword Optimization</span>
                  <span style={{ color: '#f59e0b' }}>{analysis.keywordOptimization}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'var(--color-surface)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${analysis.keywordOptimization}%`, height: '100%', background: '#f59e0b', borderRadius: '4px' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          
          {/* Skill Gap Analysis */}
          <div className="section-card">
            <div className="section-card-header">
              <h2 className="section-card-title"><Zap size={18} /> Skill Gap Analysis</h2>
            </div>
            <div className="section-card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '16px' }}>Verified Skills</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {analysis.skills?.map((skill, i) => (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                        <span style={{ color: 'var(--color-text-primary)' }}>{skill.name}</span>
                        <span style={{ color: 'var(--color-text-secondary)' }}>{skill.match}% Match</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'var(--color-surface)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${skill.match}%`, height: '100%', background: skill.match > 80 ? '#10b981' : skill.match > 50 ? '#f59e0b' : '#ef4444', borderRadius: '3px' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#ef4444', marginBottom: '16px' }}>Missing Core Skills</h3>
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
                  These skills appear frequently in your target roles but are missing from your resume.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {analysis.missingSkills?.map((ms, i) => (
                    <span key={i} style={{ padding: '6px 12px', background: '#ef444415', color: '#ef4444', borderRadius: '16px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <XCircle size={14} /> {ms}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* AI Line-by-Line Suggestions */}
          <div className="section-card">
            <div className="section-card-header">
              <h2 className="section-card-title"><FileText size={18} /> AI Resume Suggestions</h2>
            </div>
            <div className="section-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {analysis.suggestions?.map((sug, i) => (
                <div key={i} style={{ 
                  display: 'flex', gap: '16px', padding: '16px', borderRadius: '12px',
                  background: sug.type === 'critical' ? '#ef444410' : sug.type === 'warning' ? '#f59e0b10' : '#10b98110',
                  border: `1px solid ${sug.type === 'critical' ? '#ef444430' : sug.type === 'warning' ? '#f59e0b30' : '#10b98130'}`
                }}>
                  <div style={{ marginTop: '2px' }}>
                    {sug.type === 'critical' && <AlertTriangle size={20} color="#ef4444" />}
                    {sug.type === 'warning' && <AlertTriangle size={20} color="#f59e0b" />}
                    {sug.type === 'success' && <CheckCircle size={20} color="#10b981" />}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '4px', textTransform: 'capitalize' }}>
                      {sug.type === 'critical' ? 'High Priority Fix' : sug.type === 'warning' ? 'Optimization' : 'Strength'}
                    </h4>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: '1.5' }}>
                      {sug.text}
                    </p>
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

export default ResumeAnalysis;
