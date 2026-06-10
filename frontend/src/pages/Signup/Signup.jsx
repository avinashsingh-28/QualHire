import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Briefcase, Users, BookOpen, Shield, Check } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import Button from '../../components/Button';
import Input from '../../components/Input';
import useAuth from '../../hooks/useAuth';
import '../Login/Auth.css';

const ROLES = [
  { id: 'candidate', label: 'Job Seeker',  icon: <Briefcase size={18} />, desc: 'Find & apply for roles' },
  { id: 'recruiter', label: 'Recruiter',   icon: <Users size={18} />,     desc: 'Hire top talent' },
  { id: 'mentor',    label: 'Mentor',      icon: <BookOpen size={18} />,  desc: 'Guide candidates' },
];

const Signup = () => {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const queryRole = searchParams.get('role');
  const [role, setRole] = useState(() => {
    const validRoles = ['candidate', 'recruiter', 'mentor', 'admin'];
    return validRoles.includes(queryRole) ? queryRole : 'candidate';
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name || form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email is required';
    if (!form.password || form.password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const getPasswordStrength = (pw) => {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8)          score++;
    if (/[A-Z]/.test(pw))        score++;
    if (/[0-9]/.test(pw))        score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const strength = getPasswordStrength(form.password);
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['', 'var(--color-danger)', 'var(--color-warning)', 'var(--color-info)', 'var(--color-success)'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    try {
      await signup(form.name, form.email, form.password, role);
      navigate(`/${role}`);
    } catch (err) {
      setErrors({ general: err.message || 'Something went wrong. Please try again.' });
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch('http://localhost:8080/api/v1/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: credentialResponse.credential })
      });
      if (!res.ok) throw new Error('Google auth failed');
      const data = await res.json();
      localStorage.setItem('qh_token', data.token);
      localStorage.setItem('role', role);
      
      const googleUser = {
        id: data.user?.id || `u_${Date.now()}`,
        name: data.user?.name || 'Google User',
        email: data.user?.email || 'google@example.com',
        role: role,
        avatar: data.user?.picture || null,
        title: role === 'candidate' ? 'Software Engineer' : role === 'recruiter' ? 'Recruiter' : 'Mentor',
        location: 'Remote'
      };
      localStorage.setItem('qh_user', JSON.stringify(googleUser));
      window.location.href = `/${role}`;
    } catch (err) {
      console.error(err);
      setErrors({ general: 'Google sign-up failed. Please try again.' });
    }
  };

  return (
    <div className="auth-page">
      {/* Left — Form */}
      <div className="auth-left">
        <div className="auth-form-wrapper">
          <Link to="/" className="auth-logo">
            <div className="auth-logo-icon">Q</div>
            <span className="auth-logo-text">
              <span className="logo-qual">Qual</span>Hire
            </span>
          </Link>

          <h1 className="auth-heading">Create your account</h1>
          <p className="auth-subheading">Join 50,000+ professionals on QualHire</p>

          {/* Role Selector */}
          <div className="auth-role-selector" role="group" aria-label="Select your role">
            {ROLES.map(r => (
              <button
                key={r.id}
                type="button"
                className={`auth-role-btn ${role === r.id ? 'selected' : ''}`}
                onClick={() => setRole(r.id)}
                aria-pressed={role === r.id}
              >
                {r.icon}
                {r.label}
              </button>
            ))}
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <Input
              id="signup-name"
              type="text"
              label="Full name"
              placeholder="Alex Johnson"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              prefixIcon={<User size={16} />}
              error={errors.name}
              required
              autoComplete="name"
            />

            <Input
              id="signup-email"
              type="email"
              label="Email address"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              prefixIcon={<Mail size={16} />}
              error={errors.email}
              required
              autoComplete="email"
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <Input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                label="Password"
                placeholder="At least 8 characters"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                prefixIcon={<Lock size={16} />}
                suffixIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
                error={errors.password}
                required
                autoComplete="new-password"
              />

              {/* Password strength */}
              {form.password && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1-5)' }}>
                  <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                    {[1,2,3,4].map(i => (
                      <div key={i} style={{
                        height: '3px',
                        flex: 1,
                        borderRadius: '2px',
                        background: i <= strength ? strengthColors[strength] : 'var(--color-border)',
                        transition: 'background 0.3s',
                      }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 'var(--text-xs)', color: strengthColors[strength], fontWeight: 'var(--font-medium)' }}>
                    {strengthLabels[strength]}
                  </span>
                </div>
              )}

              <Input
                id="signup-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                label="Confirm Password"
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                prefixIcon={<Lock size={16} />}
                suffixIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(v => !v)}
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
                error={errors.confirmPassword}
                required
                autoComplete="new-password"
              />
            </div>

            {errors.general && (
              <p style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)' }}>{errors.general}</p>
            )}

            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', lineHeight: 'var(--leading-relaxed)' }}>
              By creating an account, you agree to our{' '}
              <Link to="/terms" className="auth-link">Terms of Service</Link> and{' '}
              <Link to="/privacy" className="auth-link">Privacy Policy</Link>.
            </p>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
              id="signup-submit-btn"
            >
              Create account as {role.charAt(0).toUpperCase() + role.slice(1)}
            </Button>
          </form>

          <div className="auth-form-footer">
            <div className="auth-divider">or continue with</div>
            <div className="auth-social-btns" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setErrors({ general: 'Google Sign-Up Failed' })}
                shape="rectangular"
                text="signup_with"
                size="large"
                logo_alignment="center"
              />
              <button className="auth-social-btn" id="linkedin-signup-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#0077B5"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                LinkedIn
              </button>
            </div>
          </div>

          <p className="auth-link-row">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">Sign in</Link>
          </p>
        </div>
      </div>

      {/* Right — Visual Panel */}
      <div className="auth-right">
        <div className="auth-right-content">
          <div className="auth-right-tag">🚀 Join 50,000+ professionals</div>
          <h2 className="auth-right-title">Start your journey to success</h2>
          <p className="auth-right-subtitle">
            Get AI-matched to roles, mentored by industry experts, and hired faster than ever before.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {[
              'AI job matching in under 60 seconds',
              '1:1 sessions with industry mentors',
              'Structured, bias-free interview process',
              'Real-time application tracking',
            ].map(benefit => (
              <div key={benefit} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: 'rgba(99,102,241,0.2)',
                  border: '1px solid rgba(99,102,241,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: 'var(--color-primary-light)',
                }}>
                  <Check size={12} />
                </div>
                <span style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.75)', fontWeight: 'var(--font-medium)' }}>
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
