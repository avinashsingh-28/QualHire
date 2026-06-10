import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Briefcase, Users, BookOpen, Shield } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import Button from '../../components/Button';
import Input from '../../components/Input';
import useAuth from '../../hooks/useAuth';
import '../Login/Auth.css';

const ROLES = [
  { id: 'candidate', label: 'Candidate', icon: <Briefcase size={18} /> },
  { id: 'recruiter', label: 'Recruiter', icon: <Users size={18} /> },
  { id: 'mentor',    label: 'Mentor',    icon: <BookOpen size={18} /> },
  { id: 'admin',     label: 'Admin',     icon: <Shield size={18} /> },
];

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const queryRole = searchParams.get('role');
  const [role, setRole] = useState(() => {
    const validRoles = ['candidate', 'recruiter', 'mentor', 'admin'];
    return validRoles.includes(queryRole) ? queryRole : 'candidate';
  });
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', rememberMe: false });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.email)    errs.email    = 'Email is required';
    if (!form.password) errs.password = 'Password is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    try {
      await login(form.email, form.password, role);
      navigate(`/${role}`);
    } catch {
      setErrors({ general: 'Invalid email or password' });
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
      setErrors({ general: 'Google sign-in failed. Please try again.' });
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

          <h1 className="auth-heading">Welcome back</h1>
          <p className="auth-subheading">Sign in to your account to continue</p>

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
              id="login-email"
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1-5)' }}>
              <Input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                label="Password"
                placeholder="Enter your password"
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
                autoComplete="current-password"
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-1)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.rememberMe}
                    onChange={e => setForm(f => ({ ...f, rememberMe: e.target.checked }))}
                    style={{ cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Remember me</span>
                </label>
                <Link to="/forgot-password" className="auth-forgot-link">Forgot password?</Link>
              </div>
            </div>

            {errors.general && (
              <p style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)' }}>{errors.general}</p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
              id="login-submit-btn"
            >
              Sign in as {role.charAt(0).toUpperCase() + role.slice(1)}
            </Button>
          </form>

          <div className="auth-form-footer">
            <div className="auth-divider">or continue with</div>
            <div className="auth-social-btns" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setErrors({ general: 'Google Login Failed' })}
                shape="rectangular"
                text="continue_with"
                size="large"
                logo_alignment="center"
              />
              <button className="auth-social-btn" id="linkedin-login-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#0077B5"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                LinkedIn
              </button>
            </div>
          </div>

          <p className="auth-link-row">
            Don't have an account?{' '}
            <Link to="/signup" className="auth-link">Create one free</Link>
          </p>
        </div>
      </div>

      {/* Right — Visual Panel */}
      <div className="auth-right">
        <div className="auth-right-content">
          <div className="auth-right-tag">⚡ Trusted by 50,000+ professionals</div>
          <h2 className="auth-right-title">Your next opportunity is one click away</h2>
          <p className="auth-right-subtitle">
            Join the platform that connects talent with opportunity through intelligent matching and expert mentorship.
          </p>

          <div className="auth-testimonial">
            <p className="auth-testimonial-text">
              "QualHire helped me land my dream job in 3 weeks. The AI matching was spot-on and the mentor sessions gave me the confidence to ace my interviews."
            </p>
            <div className="auth-testimonial-author">
              <div className="auth-testimonial-avatar">AJ</div>
              <div>
                <p className="auth-testimonial-name">Alex Johnson</p>
                <p className="auth-testimonial-role">Software Engineer at Stripe</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
