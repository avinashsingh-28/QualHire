import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import authService from '../../services/authService';
import '../Login/Auth.css';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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

  const validate = () => {
    const errs = {};
    if (!form.password || form.password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setIsLoading(true);
    setErrors({});
    try {
      await authService.resetPassword(token, form.password);
      setIsSuccess(true);
    } catch (err) {
      setErrors({ general: 'Failed to reset password. Link may be expired.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token && !isSuccess) {
    return (
      <div className="auth-page">
        <div className="auth-left" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <h1 className="auth-heading">Invalid Link</h1>
            <p className="auth-subheading">Password reset token is missing or invalid.</p>
            <Link to="/forgot-password">
              <Button variant="primary">Request new link</Button>
            </Link>
          </div>
        </div>
        <div className="auth-right"></div>
      </div>
    );
  }

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

          {!isSuccess ? (
            <>
              <h1 className="auth-heading">Set new password</h1>
              <p className="auth-subheading">Please enter your new password below.</p>

              <form className="auth-form" onSubmit={handleSubmit} noValidate style={{ marginTop: 'var(--space-6)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <Input
                    id="reset-password"
                    type={showPassword ? 'text' : 'password'}
                    label="New Password"
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
                    id="reset-confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    label="Confirm New Password"
                    placeholder="Confirm your new password"
                    value={form.confirmPassword}
                    onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                    prefixIcon={<Lock size={16} />}
                    error={errors.confirmPassword}
                    required
                  />
                </div>

                {errors.general && (
                  <p style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>{errors.general}</p>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={isLoading}
                  style={{ marginTop: 'var(--space-4)' }}
                >
                  Reset Password
                </Button>
              </form>
            </>
          ) : (
            <div style={{ textAlign: 'center', marginTop: 'var(--space-10)' }}>
              <div style={{ display: 'inline-flex', padding: '16px', background: 'rgba(34,197,94,0.1)', borderRadius: '50%', color: 'var(--color-success)', marginBottom: 'var(--space-6)' }}>
                <CheckCircle size={48} />
              </div>
              <h1 className="auth-heading">Password reset</h1>
              <p className="auth-subheading" style={{ marginBottom: 'var(--space-8)' }}>
                Your password has been successfully reset. <br/>You can now log in with your new password.
              </p>
              <Link to="/login">
                <Button variant="primary" size="lg" fullWidth>
                  Log In
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Right — Visual Panel */}
      <div className="auth-right">
        <div className="auth-right-content">
          <div className="auth-right-tag">⚡ Ready to go</div>
          <h2 className="auth-right-title">Jump right back in</h2>
          <p className="auth-right-subtitle">
            Continue where you left off. QualHire helps you hire smarter and get hired faster.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
