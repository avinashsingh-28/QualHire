import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, Users, Sparkles, FileText, Award, Code,
  MessageSquare, Star, Plus, Minus, CheckCircle2, ChevronRight,
  ShieldAlert, Zap, Briefcase
} from 'lucide-react';
import Button from '../../components/Button';
import './Landing.css';

/* ---- Mock data ---- */
const FEATURES = [
  {
    icon: <FileText size={24} />,
    iconBg: 'rgba(99, 102, 241, 0.1)',
    iconColor: 'var(--color-primary)',
    title: 'AI Resume Analysis',
    desc: 'Extract skills, evaluate experience level, and generate structured candidate summaries automatically.',
  },
  {
    icon: <Award size={24} />,
    iconBg: 'rgba(6, 182, 212, 0.1)',
    iconColor: 'var(--color-accent)',
    title: 'ATS Score Prediction',
    desc: 'Analyze how well candidate resumes align with job descriptions to calculate objective match scores.',
  },
  {
    icon: <Sparkles size={24} />,
    iconBg: 'rgba(139, 92, 246, 0.1)',
    iconColor: '#8b5cf6',
    title: 'Smart Job Recommendations',
    desc: 'Candidates receive personalized role suggestions based on their skills, career path, and preferences.',
  },
  {
    icon: <Code size={24} />,
    iconBg: 'rgba(239, 68, 68, 0.1)',
    iconColor: 'var(--color-danger)',
    title: 'Coding Assessments',
    desc: 'Evaluate candidate technical skills with built-in sandbox challenges and automated grading.',
  },
  {
    icon: <MessageSquare size={24} />,
    iconBg: 'rgba(34, 197, 94, 0.1)',
    iconColor: 'var(--color-success)',
    title: 'Real-Time Communication',
    desc: 'Seamless messaging between candidates, recruiters, and mentors directly in the dashboard.',
  },
  {
    icon: <Users size={24} />,
    iconBg: 'rgba(245, 158, 11, 0.1)',
    iconColor: 'var(--color-warning)',
    title: 'Industry Mentorship',
    desc: 'Connect with experienced industry professionals for 1:1 coaching, mock interviews, and feedback.',
  },
];

const CANDIDATE_STEPS = [
  { step: '01', title: 'Create Profile', desc: 'Build your professional digital identity highlights your expertise.' },
  { step: '02', title: 'Upload Resume', desc: 'Our AI scans and builds your semantic skill graph instantly.' },
  { step: '03', title: 'Apply Jobs', desc: 'Submit applications directly to matching high-growth companies.' },
  { step: '04', title: 'Get Hired', desc: 'Nail assessments and interview flows to receive competitive offers.' },
];

const RECRUITER_STEPS = [
  { step: '01', title: 'Create Job', desc: 'Post modern job descriptions with core skills and salary ranges.' },
  { step: '02', title: 'Evaluate Candidates', desc: 'Review pre-scored AI matches and ATS compatibility ratings.' },
  { step: '03', title: 'Schedule Interviews', desc: 'Use integrated calendar links to coordinate panel chats.' },
  { step: '04', title: 'Hire Talent', desc: 'Send digital offers, track acceptances, and onboard top hires.' },
];

const METRICS = [
  { value: '12,400+', label: 'Active Jobs' },
  { value: '85,000+', label: 'Verified Candidates' },
  { value: '3,200+', label: 'Global Recruiters' },
  { value: '150,000+', label: 'Assessments Taken' },
];

const TESTIMONIALS = [
  {
    quote: "QualHire's ATS scoring and coding assessment suite cut our time-to-hire by 40%. The candidates matched are consistently high quality.",
    author: "Sarah Jenkins",
    role: "Director of Talent Acquisition at FinTech ScaleUp",
    rating: 5,
    avatar: "SJ"
  },
  {
    quote: "The mock interviews with industry mentors gave me the confidence I needed. I landed my dream React developer role within 3 weeks!",
    author: "Alex Rivera",
    role: "Frontend Engineer (Candidate)",
    rating: 5,
    avatar: "AR"
  },
  {
    quote: "As a recruiter, finding candidates with pre-verified skill assessments is a game changer. No more wasting time on unqualified profiles.",
    author: "David Chen",
    role: "Senior Recruiter at TechCorp Global",
    rating: 5,
    avatar: "DC"
  }
];

const FAQS = [
  {
    q: "How does the AI Resume Analysis work?",
    a: "When you upload your resume, our NLP parser extracts experience levels, technologies, and career trajectory, comparing it semantically against job requisitions to assess fit beyond simple keyword matches."
  },
  {
    q: "What is the ATS Score?",
    a: "The Applicant Tracking System (ATS) Score indicates how well a resume aligns with a specific job's requirements. It gives both candidates and recruiters immediate transparency on candidate relevance."
  },
  {
    q: "Are coding assessments customizable?",
    a: "Yes! Recruiters can select from our standard library of front-end, back-end, and systems assessments, or design custom questions with distinct test cases."
  },
  {
    q: "How can candidates connect with mentors?",
    a: "Through the candidate dashboard, users can search for active mentors based on industry, role, or company and request 1:1 sessions directly via calendar sync."
  }
];

const Landing = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="landing-page-root">
      {/* 1. HERO SECTION */}
      <section className="hero" id="hero">
        <div className="hero-bg-glow" aria-hidden="true" />
        <div className="hero-bg-grid" aria-hidden="true" />

        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              <span>Next-Gen Hiring Ecosystem</span>
            </div>

            <h1 className="hero-title">
              AI-Powered Recruitment &{' '}
              <span className="gradient-word">Talent Management</span> Platform
            </h1>

            <p className="hero-subtitle">
              QualHire bridges the gap between top talent, high-growth recruiters, and expert mentors with pre-verified skills and smart matching.
            </p>

            <div className="hero-actions">
              <Button
                variant="primary"
                size="xl"
                rightIcon={<ArrowRight size={20} />}
                onClick={() => navigate('/signup')}
                id="hero-cta-get-started"
              >
                Get Started
              </Button>
              <Button
                variant="outline"
                size="xl"
                onClick={() => navigate('/signup?role=recruiter')}
                id="hero-cta-recruiters"
                className="hero-secondary-btn"
              >
                For Recruiters
              </Button>
            </div>

            <div className="hero-trust">
              <div className="avatar-group">
                {['JD', 'AM', 'KL', 'PH', 'ST'].map((initials, idx) => (
                  <span key={idx} className="avatar-bubble" style={{ zIndex: 5 - idx }}>{initials}</span>
                ))}
              </div>
              <p className="trust-text">Trusted by <strong>10,000+</strong> candidates & leading hiring teams.</p>
            </div>
          </div>

          {/* Interactive UI Mockup Visual */}
          <div className="hero-visual">
            <div className="mockup-frame">
              <div className="mockup-header">
                <span className="dot dot-red" />
                <span className="dot dot-yellow" />
                <span className="dot dot-green" />
                <span className="mockup-title">QualHire AI Dashboard</span>
              </div>
              <div className="mockup-body">
                <div className="mockup-widget mockup-candidate">
                  <div className="cand-info">
                    <div className="cand-avatar">JD</div>
                    <div>
                      <p className="cand-name">Jane Doe</p>
                      <p className="cand-title">Senior React Developer</p>
                    </div>
                  </div>
                  <div className="cand-score">
                    <span className="score-label">ATS MATCH</span>
                    <span className="score-val">96%</span>
                  </div>
                </div>

                <div className="mockup-widget mockup-analysis">
                  <p className="analysis-heading"><Sparkles size={14} className="sparkle-icon" /> AI Skills Breakdown</p>
                  <div className="skills-row">
                    <span className="skill-badge verified">ReactJS (9/10)</span>
                    <span className="skill-badge verified">TypeScript (8/10)</span>
                    <span className="skill-badge">Node.js</span>
                  </div>
                </div>

                <div className="mockup-widget mockup-jobs">
                  <p className="widget-label">Recommended Roles</p>
                  <div className="job-item">
                    <span className="job-title">Staff Frontend Engineer</span>
                    <span className="job-company">Stripe</span>
                    <span className="match-tag">Excellent Match</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURES SECTION */}
      <section className="section features-section" id="features">
        <div className="section-container">
          <div className="section-header">
            <div className="section-tag"><Zap size={12} /> Features</div>
            <h2 className="section-title">Revolutionizing the Recruitment Lifecycle</h2>
            <p className="section-subtitle-text">
              Say goodbye to manual review pipelines. QualHire uses next-generation automation to source, evaluate, and verify talent.
            </p>
          </div>

          <div className="features-grid">
            {FEATURES.map(({ icon, iconBg, iconColor, title, desc }) => (
              <div key={title} className="feature-card">
                <div className="feature-icon" style={{ background: iconBg, color: iconColor }}>
                  {icon}
                </div>
                <h3 className="feature-title">{title}</h3>
                <p className="feature-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="section flows-section" id="how-it-works">
        <div className="section-container">
          <div className="section-header">
            <div className="section-tag">Workflows</div>
            <h2 className="section-title">How QualHire Empowers You</h2>
            <p className="section-subtitle-text">Tailored paths for job-seekers and corporate recruiters to ensure success.</p>
          </div>

          <div className="flows-container">
            {/* Candidate Flow */}
            <div className="flow-column candidate-flow">
              <h3 className="flow-column-title"><Users size={20} className="flow-title-icon" /> Candidate Path</h3>
              <div className="flow-steps">
                {CANDIDATE_STEPS.map(({ step, title, desc }) => (
                  <div key={step} className="flow-step-item">
                    <div className="flow-step-badge">{step}</div>
                    <div className="flow-step-content">
                      <h4 className="flow-step-title">{title}</h4>
                      <p className="flow-step-desc">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recruiter Flow */}
            <div className="flow-column recruiter-flow">
              <h3 className="flow-column-title"><Briefcase size={20} className="flow-title-icon" /> Recruiter Path</h3>
              <div className="flow-steps">
                {RECRUITER_STEPS.map(({ step, title, desc }) => (
                  <div key={step} className="flow-step-item">
                    <div className="flow-step-badge">{step}</div>
                    <div className="flow-step-content">
                      <h4 className="flow-step-title">{title}</h4>
                      <p className="flow-step-desc">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. STATISTICS SECTION */}
      <section className="stats-section">
        <div className="stats-container">
          {METRICS.map(({ value, label }) => (
            <div key={label} className="metric-box">
              <p className="metric-value">{value}</p>
              <p className="metric-label">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="section testimonials-section" id="testimonials">
        <div className="section-container">
          <div className="section-header">
            <div className="section-tag">Success Stories</div>
            <h2 className="section-title">Loved by Candidates & Teams</h2>
            <p className="section-subtitle-text">See how professionals are accelerating their hiring pipelines and careers with QualHire.</p>
          </div>

          <div className="testimonials-grid">
            {TESTIMONIALS.map(({ quote, author, role, rating, avatar }) => (
              <div key={author} className="testimonial-card">
                <div className="stars-row">
                  {[...Array(rating)].map((_, i) => (
                    <Star key={i} size={16} fill="var(--color-warning)" stroke="var(--color-warning)" />
                  ))}
                </div>
                <p className="testimonial-quote">"{quote}"</p>
                <div className="testimonial-footer">
                  <div className="testimonial-avatar">{avatar}</div>
                  <div>
                    <h4 className="testimonial-author">{author}</h4>
                    <p className="testimonial-role">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQ */}
      <section className="section faq-section" id="faq">
        <div className="section-container">
          <div className="section-header">
            <div className="section-tag">FAQ</div>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle-text">Got questions? We've got answers.</p>
          </div>

          <div className="faq-accordion">
            {FAQS.map(({ q, a }, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className={`faq-item ${isOpen ? 'active' : ''}`}>
                  <button className="faq-trigger" onClick={() => toggleFaq(idx)}>
                    <span className="faq-question">{q}</span>
                    <span className="faq-icon-holder">
                      {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                    </span>
                  </button>
                  <div className="faq-content">
                    <p className="faq-answer">{a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Hero CTA pre-footer */}
      <section className="pre-footer-cta">
        <div className="section-container">
          <h2 className="cta-heading">Ready to Match with Your Next Opportunity?</h2>
          <p className="cta-subtext">Join thousands of software engineers, mentors, and recruiting partners today.</p>
          <div className="cta-btn-group">
            <Button
              variant="primary"
              size="xl"
              onClick={() => navigate('/signup')}
              rightIcon={<ArrowRight size={20} />}
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
