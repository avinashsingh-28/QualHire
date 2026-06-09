import { Link, useNavigate } from 'react-router-dom';
import {
  Zap, Shield, Users, Search, ArrowRight, CheckCircle,
  Briefcase, BookOpen, Star, ChevronRight, Sparkles,
} from 'lucide-react';
import Button from '../../components/Button';
import './Landing.css';

/* ---- Mock data ---- */
const FEATURES = [
  {
    icon: <Zap size={24} />,
    iconBg: 'rgba(99,102,241,0.12)',
    iconColor: 'var(--color-primary)',
    title: 'AI-Powered Matching',
    desc: 'Our intelligent algorithm matches candidates with roles based on skills, experience, culture fit, and growth potential — not just keywords.',
  },
  {
    icon: <Shield size={24} />,
    iconBg: 'rgba(34,197,94,0.12)',
    iconColor: 'var(--color-success)',
    title: 'Verified Credentials',
    desc: 'Every candidate profile is verified. Recruiters get accurate data on skills, education, and experience — no more guesswork.',
  },
  {
    icon: <Users size={24} />,
    iconBg: 'rgba(245,158,11,0.12)',
    iconColor: 'var(--color-warning)',
    title: 'Expert Mentorship',
    desc: 'Connect candidates with industry mentors for 1:1 coaching, mock interviews, and career guidance that accelerates growth.',
  },
  {
    icon: <Search size={24} />,
    iconBg: 'rgba(6,182,212,0.12)',
    iconColor: 'var(--color-accent)',
    title: 'Smart Search',
    desc: 'Advanced semantic search finds the perfect candidates or jobs instantly. Filter by skills, location, salary, company culture and more.',
  },
  {
    icon: <Star size={24} />,
    iconBg: 'rgba(239,68,68,0.12)',
    iconColor: 'var(--color-danger)',
    title: 'Structured Interviews',
    desc: 'Standardized, bias-free interview kits with scorecards. Make data-driven hiring decisions with confidence and consistency.',
  },
  {
    icon: <Sparkles size={24} />,
    iconBg: 'rgba(139,92,246,0.12)',
    iconColor: '#8b5cf6',
    title: 'Real-Time Analytics',
    desc: 'Track pipeline health, time-to-hire, offer acceptance rates, and DEI metrics. Turn your data into actionable insights.',
  },
];

const STEPS = [
  { num: '01', title: 'Create Your Profile', desc: 'Sign up in minutes and build your profile with skills, experience, and goals.' },
  { num: '02', title: 'Get Matched',          desc: 'Our AI surfaces the best opportunities or candidates tailored to your needs.' },
  { num: '03', title: 'Interview & Grow',     desc: 'Complete structured interviews and connect with mentors for guidance.' },
  { num: '04', title: 'Land the Role',        desc: 'Receive offers, negotiate confidently, and launch your next chapter.' },
];

const ROLES = [
  {
    icon: <Briefcase size={28} />,
    iconBg: 'rgba(99,102,241,0.12)',
    iconColor: 'var(--color-primary)',
    title: 'For Candidates',
    subtitle: 'Find your dream role faster',
    to: '/candidate',
    features: ['AI job matching', 'Skill assessments', 'Interview prep', 'Offer negotiation tools'],
    checkBg: 'rgba(99,102,241,0.12)',
    checkColor: 'var(--color-primary)',
    ctaLabel: 'Start your search',
  },
  {
    icon: <Users size={28} />,
    iconBg: 'rgba(6,182,212,0.12)',
    iconColor: 'var(--color-accent)',
    title: 'For Recruiters',
    subtitle: 'Hire top talent with confidence',
    to: '/recruiter',
    features: ['Pipeline management', 'Structured interviews', 'Team collaboration', 'Analytics dashboard'],
    checkBg: 'rgba(6,182,212,0.12)',
    checkColor: 'var(--color-accent)',
    ctaLabel: 'Post your first job',
  },
  {
    icon: <BookOpen size={28} />,
    iconBg: 'rgba(245,158,11,0.12)',
    iconColor: 'var(--color-warning)',
    title: 'For Mentors',
    subtitle: 'Share your expertise and impact careers',
    to: '/mentor',
    features: ['Schedule sessions', 'Track mentee progress', 'Earn income', 'Build your brand'],
    checkBg: 'rgba(245,158,11,0.12)',
    checkColor: 'var(--color-warning)',
    ctaLabel: 'Become a mentor',
  },
  {
    icon: <Shield size={28} />,
    iconBg: 'rgba(239,68,68,0.12)',
    iconColor: 'var(--color-danger)',
    title: 'For Admins',
    subtitle: 'Manage your platform at scale',
    to: '/admin',
    features: ['User management', 'Platform analytics', 'Content moderation', 'System health'],
    checkBg: 'rgba(239,68,68,0.12)',
    checkColor: 'var(--color-danger)',
    ctaLabel: 'Admin dashboard',
  },
];

const AVATARS = ['AJ', 'SM', 'RP', 'EC', 'MK'];

/* ---- Landing Page ---- */
const Landing = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Hero */}
      <section className="hero" id="hero">
        <div className="hero-bg-glow" aria-hidden="true" />
        <div className="hero-bg-grid" aria-hidden="true" />

        <div className="hero-inner">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Now with AI-powered job matching
          </div>

          <h1 className="hero-title">
            The smarter way to hire and{' '}
            <span className="gradient-word">land your dream role</span>
          </h1>

          <p className="hero-subtitle">
            QualHire connects ambitious candidates with top companies and expert mentors — powered by AI, built for humans.
          </p>

          <div className="hero-actions">
            <Button
              variant="primary"
              size="xl"
              rightIcon={<ArrowRight size={20} />}
              onClick={() => navigate('/signup')}
              id="hero-cta-primary"
            >
              Get started free
            </Button>
            <Button
              variant="ghost"
              size="xl"
              onClick={() => navigate('/login')}
              id="hero-cta-secondary"
              style={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.2)', border: '1.5px solid rgba(255,255,255,0.2)' }}
            >
              Sign in
            </Button>
          </div>

          <div className="hero-social-proof">
            <div className="hero-avatars">
              {AVATARS.map((a, i) => (
                <div key={i} className="hero-avatar" style={{ zIndex: AVATARS.length - i }}>
                  {a}
                </div>
              ))}
            </div>
            <p className="hero-social-text">
              Trusted by <strong>50,000+</strong> professionals worldwide
            </p>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="stats-bar">
        <div className="stats-bar-inner">
          {[
            { value: '50K+',  label: 'Active Candidates' },
            { value: '8K+',   label: 'Partner Companies' },
            { value: '1.2K+', label: 'Expert Mentors' },
            { value: '92%',   label: 'Offer Acceptance Rate' },
          ].map(({ value, label }) => (
            <div key={label} className="stat-item">
              <p className="stat-value">{value}</p>
              <p className="stat-label">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="section" id="features">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-tag">
              <Zap size={12} />
              Features
            </div>
            <h2 className="section-title">Everything you need to hire better</h2>
            <p className="section-desc">
              From job posting to signed offer — QualHire covers the entire recruitment lifecycle with intelligent tools.
            </p>
          </div>

          <div className="features-grid">
            {FEATURES.map(({ icon, iconBg, iconColor, title, desc }) => (
              <div key={title} className="feature-card">
                <div
                  className="feature-icon"
                  style={{ background: iconBg, color: iconColor }}
                >
                  {icon}
                </div>
                <h3 className="feature-title">{title}</h3>
                <p className="feature-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section how-it-works" id="how-it-works">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-tag">Process</div>
            <h2 className="section-title">How QualHire works</h2>
            <p className="section-desc">From sign up to success in four simple steps.</p>
          </div>

          <div className="steps-grid">
            {STEPS.map(({ num, title, desc }) => (
              <div key={num} className="step-card">
                <div className="step-number">{num}</div>
                <h3 className="step-title">{title}</h3>
                <p className="step-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role cards */}
      <section className="section" id="roles">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-tag">For everyone</div>
            <h2 className="section-title">Built for every stakeholder</h2>
            <p className="section-desc">Whether you're hiring, job-seeking, mentoring, or managing — QualHire has you covered.</p>
          </div>

          <div className="roles-grid">
            {ROLES.map(({ icon, iconBg, iconColor, title, subtitle, to, features, checkBg, checkColor, ctaLabel }) => (
              <div key={title} className="role-card">
                <div className="role-card-header">
                  <div className="role-card-icon" style={{ background: iconBg, color: iconColor }}>
                    {icon}
                  </div>
                  <div>
                    <h3 className="role-card-title">{title}</h3>
                    <p className="role-card-subtitle">{subtitle}</p>
                  </div>
                </div>

                <div className="role-card-features">
                  {features.map(f => (
                    <div key={f} className="role-feature-item">
                      <div className="role-feature-check" style={{ background: checkBg, color: checkColor }}>
                        ✓
                      </div>
                      {f}
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  rightIcon={<ChevronRight size={16} />}
                  onClick={() => navigate(to)}
                >
                  {ctaLabel}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" id="cta">
        <div className="section-inner" style={{ position: 'relative' }}>
          <h2 className="cta-title">Ready to transform your hiring?</h2>
          <p className="cta-subtitle">
            Join 50,000+ professionals who've already made the switch to smarter recruitment.
          </p>
          <div className="cta-actions">
            <Button
              variant="primary"
              size="xl"
              rightIcon={<ArrowRight size={20} />}
              onClick={() => navigate('/signup')}
              id="cta-signup-btn"
            >
              Start free today
            </Button>
            <Button
              size="xl"
              onClick={() => navigate('/#features')}
              style={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.25)', border: '1.5px solid rgba(255,255,255,0.25)', background: 'transparent' }}
              id="cta-learn-btn"
            >
              Learn more
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Landing;
