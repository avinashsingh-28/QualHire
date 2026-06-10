import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowRight, Sparkles, FileText, Award, Code, 
  Users, MessageSquare, Briefcase, Shield, CheckCircle, GraduationCap, Calendar, BarChart3, Settings, Star, Zap, Minus, Plus
} from 'lucide-react';
import Button from '../../components/Button';
import './Landing.css';

const ROLE_DATA = {
  candidate: {
    badge: 'Job Seekers & Software Engineers',
    title: 'Accelerate Your Tech Career with AI Match & Verified Skills',
    subtitle: 'QualHire connects developers with top-tier companies. Optimize your resume, showcase verified coding skills, and book live mentor sessions.',
    ctaText: 'Sign Up as Candidate',
    ctaLink: '/signup?role=candidate',
    loginLink: '/login?role=candidate',
    visualTitle: 'Candidate Match Report',
    visualContent: (
      <>
        <div className="mockup-widget mockup-candidate">
          <div className="cand-info">
            <div className="cand-avatar">AJ</div>
            <div>
              <p className="cand-name">Alex Johnson</p>
              <p className="cand-title">Senior Frontend Engineer</p>
            </div>
          </div>
          <div className="cand-score">
            <span className="score-label">ATS MATCH</span>
            <span className="score-val" style={{ color: 'var(--color-success)' }}>94%</span>
          </div>
        </div>
        <div className="mockup-widget mockup-analysis">
          <p className="analysis-heading"><Sparkles size={14} className="sparkle-icon" /> AI Skills Optimization</p>
          <div className="skills-row">
            <span className="skill-badge verified">React (9/10)</span>
            <span className="skill-badge verified">TypeScript (8/10)</span>
            <span className="skill-badge">GraphQL</span>
          </div>
        </div>
      </>
    ),
    features: [
      {
        icon: <FileText size={24} />,
        iconBg: 'rgba(99, 102, 241, 0.1)',
        iconColor: 'var(--color-primary)',
        title: 'ATS Resume Scoring',
        desc: 'Compare your resume instantly against target job descriptions to identify missing keywords and formatting issues.',
      },
      {
        icon: <Code size={24} />,
        iconBg: 'rgba(239, 68, 68, 0.1)',
        iconColor: 'var(--color-danger)',
        title: 'Automated Coding Sandbox',
        desc: 'Solve interactive algorithmic coding problems. Get pre-evaluated grades added to your profile immediately.',
      },
      {
        icon: <Users size={24} />,
        iconBg: 'rgba(245, 158, 11, 0.1)',
        iconColor: 'var(--color-warning)',
        title: '1:1 Expert Mentorship',
        desc: 'Schedule sessions with staff engineers from top companies for resume reviews and live technical mock interviews.',
      }
    ],
    steps: [
      { step: '01', title: 'Sign Up & Build Profile', desc: 'Create your digital resume and highlight your stack.' },
      { step: '02', title: 'ATS Check & Upload', desc: 'Scan your resume against live roles to gauge score compatibility.' },
      { step: '03', title: 'Verify Your Coding Skills', desc: 'Complete standard assessment sandbox challenges to verify expertise.' },
      { step: '04', title: 'Fast-Track Applications', desc: 'Direct-apply with pre-screened scores for high-priority recruiter reviews.' }
    ],
    metrics: [
      { value: '88%', label: 'Average ATS Improvement' },
      { value: '25 Days', label: 'Average Time-to-Hire' },
      { value: '$135k', label: 'Average Base Salary' },
      { value: '15,000+', label: 'Successful Placements' }
    ],
    testimonials: [
      {
        quote: "The ATS checker showed me exactly why my resume was being filtered out. I fixed the issues, took a coding check, and got an interview in 4 days!",
        author: "Marcus Vance",
        role: "Frontend Engineer at Stripe",
        rating: 5,
        avatar: "MV"
      },
      {
        quote: "Booking a mock system design session with a TechCorp mentor prepared me perfectly. I would have failed my panel loop without it.",
        author: "Lina Alvarez",
        role: "Fullstack Engineer at HubSpot",
        rating: 5,
        avatar: "LA"
      }
    ]
  },
  recruiter: {
    badge: 'Talent Acquisition & Hiring Managers',
    title: 'Source & Hire Pre-Screened Candidates 3x Faster',
    subtitle: 'Stop wasting time on mismatched resumes. Sift through candidates automatically using objective ATS matching and pre-verified assessment scores.',
    ctaText: 'Register Company Account',
    ctaLink: '/signup?role=recruiter',
    loginLink: '/login?role=recruiter',
    visualTitle: 'Recruiting Funnel Analytics',
    visualContent: (
      <>
        <div className="mockup-widget mockup-candidate">
          <div className="cand-info">
            <div className="cand-avatar">TC</div>
            <div>
              <p className="cand-name">Hiring Funnel Openings</p>
              <p className="cand-title">4 Active Requisitions</p>
            </div>
          </div>
          <div className="cand-score">
            <span className="score-label">MATCH RATE</span>
            <span className="score-val" style={{ color: 'var(--color-success)' }}>92%</span>
          </div>
        </div>
        <div className="mockup-widget mockup-jobs">
          <p className="widget-label">Candidate Screening Stats</p>
          <div className="job-item">
            <span className="job-title">Average Assessment Score</span>
            <span className="match-tag" style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--color-primary)' }}>84/100</span>
          </div>
        </div>
      </>
    ),
    features: [
      {
        icon: <Award size={24} />,
        iconBg: 'rgba(6, 182, 212, 0.1)',
        iconColor: 'var(--color-accent)',
        title: 'Smart ATS Match Engine',
        desc: 'Automatically parses and ranks applicants against your specific job criteria using custom NLP matching models.',
      },
      {
        icon: <Code size={24} />,
        iconBg: 'rgba(239, 68, 68, 0.1)',
        iconColor: 'var(--color-danger)',
        title: 'Custom Coding Sandboxes',
        desc: 'Send customized technical screening tests directly through the platform, with cheat detection and code replays.',
      },
      {
        icon: <MessageSquare size={24} />,
        iconBg: 'rgba(34, 197, 94, 0.1)',
        iconColor: 'var(--color-success)',
        title: 'Integrated Interviewer Panel',
        desc: 'Co-ordinate team evaluations, aggregate feedback, and schedule interviews with synchronized calendar links.',
      }
    ],
    steps: [
      { step: '01', title: 'Post Requisitions', desc: 'Create job specs and input required technology stacks and skills.' },
      { step: '02', title: 'Review Smart Matches', desc: 'Instantly view ranked lists of candidates with pre-calculated ATS scores.' },
      { step: '03', title: 'Send Sandbox Tests', desc: 'Assess coding proficiency using anti-cheat sandboxes with automated grading.' },
      { step: '04', title: 'Coordinate & Hire', desc: 'Conduct interviews and finalize offers collaboratively in one portal.' }
    ],
    metrics: [
      { value: '40%', label: 'Reduction in Time-to-Hire' },
      { value: '$8,500', label: 'Average Savings per Hire' },
      { value: '3,200+', label: 'Corporate Partners' },
      { value: '94%', label: 'Offer Acceptance Rate' }
    ],
    testimonials: [
      {
        quote: "QualHire changed how we recruit engineers. Pre-verified test scores cut our screening workload in half. We only interview matches.",
        author: "Sarah Mitchell",
        role: "VP of People at TechCorp Solutions",
        rating: 5,
        avatar: "SM"
      },
      {
        quote: "We hired 3 engineers in under two weeks. The integrated technical assessment pipeline is miles ahead of basic legacy ATS solutions.",
        author: "David Chen",
        role: "Engineering Director at FinTech Hub",
        rating: 5,
        avatar: "DC"
      }
    ]
  },
  mentor: {
    badge: 'Industry Experts & Coaches',
    title: 'Share Your Expertise. Guide Developers. Earn Rewards.',
    subtitle: 'Give back to the developer community. Review candidate portfolios, host mock technical sessions, and establish your professional brand.',
    ctaText: 'Apply to Mentor',
    ctaLink: '/signup?role=mentor',
    loginLink: '/login?role=mentor',
    visualTitle: 'Mentor Scheduling Widget',
    visualContent: (
      <>
        <div className="mockup-widget mockup-candidate">
          <div className="cand-info">
            <div className="cand-avatar">MP</div>
            <div>
              <p className="cand-name">Upcoming Sessions</p>
              <p className="cand-title">2 Mock Loops Today</p>
            </div>
          </div>
          <div className="cand-score">
            <span className="score-label">RATING</span>
            <span className="score-val" style={{ color: 'var(--color-warning)' }}>4.9★</span>
          </div>
        </div>
        <div className="mockup-widget mockup-analysis">
          <p className="analysis-heading"><Calendar size={14} className="sparkle-icon" /> Calendar Availability</p>
          <div className="skills-row">
            <span className="skill-badge verified">Mondays (5-7 PM)</span>
            <span className="skill-badge verified">Saturdays (10-2 PM)</span>
          </div>
        </div>
      </>
    ),
    features: [
      {
        icon: <Users size={24} />,
        iconBg: 'rgba(99, 102, 241, 0.1)',
        iconColor: 'var(--color-primary)',
        title: 'Seamless Session Booking',
        desc: 'Connect your personal Google or Outlook calendars. Candidates book open spots instantly without back-and-forth emails.',
      },
      {
        icon: <MessageSquare size={24} />,
        iconBg: 'rgba(34, 197, 94, 0.1)',
        iconColor: 'var(--color-success)',
        title: 'Built-in Coaching Suite',
        desc: 'Review candidate profiles, write session notes, and submit formal mock evaluation reports inside the dashboard.',
      },
      {
        icon: <Award size={24} />,
        iconBg: 'rgba(6, 182, 212, 0.1)',
        iconColor: 'var(--color-accent)',
        title: 'Earn Compensation',
        desc: 'Receive rewards and competitive compensation for conducting verified profile checks and mock interviews.',
      }
    ],
    steps: [
      { step: '01', title: 'Complete Verification', desc: 'Verify your company email and role details to secure approval.' },
      { step: '02', title: 'Set Hours & Booking', desc: 'Sync your calendar and define your weekly session limits.' },
      { step: '03', title: 'Host Live Sessions', desc: 'Conduct mock interviews, system design checks, or resume feedback.' },
      { step: '04', title: 'Submit Feedbacks', desc: 'Fill out candidate scoring sheets to guide them toward placements.' }
    ],
    metrics: [
      { value: '1,500+', label: 'Verified Tech Mentors' },
      { value: '10k+', label: 'Sessions Completed' },
      { value: '$120/hr', label: 'Average Rewards Earned' },
      { value: '4.95', label: 'Average Candidate Rating' }
    ],
    testimonials: [
      {
        quote: "Mentoring on QualHire is incredibly rewarding. The platform takes care of scheduling, note-taking, and payments completely.",
        author: "Dr. Raj Patel",
        role: "Engineering Manager (Mentor)",
        rating: 5,
        avatar: "RP"
      },
      {
        quote: "I love helping junior devs break into tech. Seeing a candidate you coached update their LinkedIn with a new role is an unmatched feeling.",
        author: "Elena Petrova",
        role: "Staff Engineer at Google (Mentor)",
        rating: 5,
        avatar: "EP"
      }
    ]
  },
  admin: {
    badge: 'Platform Administration & Security',
    title: 'Ecosystem Moderation & Platform Control Panel',
    subtitle: 'Supervise QualHire users, review jobs audit trails, manage community standards compliance, and track infrastructure telemetry metrics.',
    ctaText: 'Access Admin Console',
    ctaLink: '/login?role=admin',
    loginLink: '/login?role=admin',
    visualTitle: 'System Integrity Dashboard',
    visualContent: (
      <>
        <div className="mockup-widget mockup-candidate">
          <div className="cand-info">
            <div className="cand-avatar">AD</div>
            <div>
              <p className="cand-name">QualHire Admin Panel</p>
              <p className="cand-title">System Status: Active</p>
            </div>
          </div>
          <div className="cand-score">
            <span className="score-label">UPTIME</span>
            <span className="score-val" style={{ color: 'var(--color-success)' }}>99.99%</span>
          </div>
        </div>
        <div className="mockup-widget mockup-jobs">
          <p className="widget-label">Infrastructure Monitoring</p>
          <div className="job-item">
            <span className="job-title">Active Security Scans</span>
            <span className="match-tag" style={{ background: 'rgba(34,197,94,0.15)', color: 'var(--color-success)' }}>Pass</span>
          </div>
        </div>
      </>
    ),
    features: [
      {
        icon: <Shield size={24} />,
        iconBg: 'rgba(99, 102, 241, 0.1)',
        iconColor: 'var(--color-primary)',
        title: 'Platform Audit Logging',
        desc: 'Review comprehensive audit trails tracking user changes, logins, job creations, and role updates.',
      },
      {
        icon: <Users size={24} />,
        iconBg: 'rgba(34, 197, 94, 0.1)',
        iconColor: 'var(--color-success)',
        title: 'Account Oversight Control',
        desc: 'Approve corporate recruiters, verify mentor credentials, and manage candidate account permissions.',
      },
      {
        icon: <BarChart3 size={24} />,
        iconBg: 'rgba(6, 182, 212, 0.1)',
        iconColor: 'var(--color-accent)',
        title: 'Ecosystem Analytics',
        desc: 'Monitor user signup rates, completed assessment ratios, session bookings, and job-match metrics.',
      }
    ],
    steps: [
      { step: '01', title: 'Sign In Admin Account', desc: 'Securely login using platform-issued administrative keys.' },
      { step: '02', title: 'Audit User Directory', desc: 'Review user registries and coordinate recruiter company approval chains.' },
      { step: '03', title: 'Moderate Content Pools', desc: 'Moderate reported job descriptions or standard coding sandbox test questions.' },
      { step: '04', title: 'Supervise System Uptime', desc: 'Monitor API metrics and review platform telemetry performance values.' }
    ],
    metrics: [
      { value: '99.99%', label: 'System Uptime' },
      { value: '24/7', label: 'Security Auditing' },
      { value: '0.2s', label: 'Average API Latency' },
      { value: '4 Roles', label: 'Orchestrated Ecosystem' }
    ],
    testimonials: [
      {
        quote: "The administrative dashboards allow us to quickly review reported jobs and approve enterprise recruiters in seconds.",
        author: "Emily Chen",
        role: "Lead Platform Admin",
        rating: 5,
        avatar: "EC"
      },
      {
        quote: "QualHire's automated security audit trails satisfy all compliance audits with zero development friction.",
        author: "Jason Miller",
        role: "Director of Platform Operations",
        rating: 5,
        avatar: "JM"
      }
    ]
  }
};

const RoleLanding = ({ role: roleProp }) => {
  const navigate = useNavigate();
  const params = useParams();
  
  // Accept role from prop or URL param
  const role = roleProp || params.role || 'candidate';
  const data = ROLE_DATA[role] || ROLE_DATA.candidate;

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
              <span>{data.badge}</span>
            </div>

            <h1 className="hero-title">
              {data.title.split('&')[0]}
              {data.title.includes('&') && (
                <>
                  &{' '}
                  <span className="gradient-word">{data.title.split('&')[1]}</span>
                </>
              )}
            </h1>

            <p className="hero-subtitle">{data.subtitle}</p>

            <div className="hero-actions">
              <Button
                variant="primary"
                size="xl"
                rightIcon={<ArrowRight size={20} />}
                onClick={() => navigate(data.ctaLink)}
                id="hero-cta-get-started"
              >
                {data.ctaText}
              </Button>
              <Button
                variant="outline"
                size="xl"
                onClick={() => navigate(data.loginLink)}
                id="hero-cta-login"
                className="hero-secondary-btn"
              >
                Sign In
              </Button>
            </div>
          </div>

          {/* Interactive UI Mockup Visual */}
          <div className="hero-visual">
            <div className="mockup-frame">
              <div className="mockup-header">
                <span className="dot dot-red" />
                <span className="dot dot-yellow" />
                <span className="dot dot-green" />
                <span className="mockup-title">{data.visualTitle}</span>
              </div>
              <div className="mockup-body">
                {data.visualContent}
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
            <h2 className="section-title">Designed for Professional Efficiency</h2>
            <p className="section-subtitle-text">
              QualHire combines automated tools and industry experts to provide a clean ecosystem for all roles.
            </p>
          </div>

          <div className="features-grid">
            {data.features.map(({ icon, iconBg, iconColor, title, desc }) => (
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
            <h2 className="section-title">Your Step-by-Step Pathway</h2>
            <p className="section-subtitle-text">A structured approach designed to deliver results with minimum friction.</p>
          </div>

          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="flow-column">
              <h3 className="flow-column-title" style={{ justifyContent: 'center' }}>
                <CheckCircle size={20} className="flow-title-icon" /> Operational Steps
              </h3>
              <div className="flow-steps" style={{ marginTop: '24px' }}>
                {data.steps.map(({ step, title, desc }) => (
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
          {data.metrics.map(({ value, label }) => (
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
            <h2 className="section-title">Pre-Verified and Loved</h2>
            <p className="section-subtitle-text">Read how members of this role achieve targets and accelerate tasks using QualHire.</p>
          </div>

          <div className="testimonials-grid" style={{ gridTemplateColumns: '1fr 1fr', maxWidth: '960px', margin: '0 auto' }}>
            {data.testimonials.map(({ quote, author, role, rating, avatar }) => (
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

      {/* pre-footer CTA */}
      <section className="pre-footer-cta">
        <div className="section-container">
          <h2 className="cta-heading">Ready to Experience Smarter Technical Hiring?</h2>
          <p className="cta-subtext">Get started with your custom dashboard instantly.</p>
          <div className="cta-btn-group">
            <Button
              variant="primary"
              size="xl"
              onClick={() => navigate(data.ctaLink)}
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

export default RoleLanding;
