import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle, ArrowLeft } from 'lucide-react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import authService from '../../services/authService';
import '../Login/Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      await authService.forgotPassword(email);
      setIsSuccess(true);
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
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

          {!isSuccess ? (
            <>
              <Link to="/login" className="auth-forgot-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: 'var(--space-4)' }}>
                <ArrowLeft size={16} /> Back to login
              </Link>
              <h1 className="auth-heading">Forgot Password?</h1>
              <p className="auth-subheading">No worries, we'll send you reset instructions.</p>

              <form className="auth-form" onSubmit={handleSubmit} noValidate style={{ marginTop: 'var(--space-6)' }}>
                <Input
                  id="forgot-email"
                  type="email"
                  label="Email address"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  prefixIcon={<Mail size={16} />}
                  error={error}
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={isLoading}
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
              <h1 className="auth-heading">Check your email</h1>
              <p className="auth-subheading" style={{ marginBottom: 'var(--space-8)' }}>
                We sent a password reset link to <br/><strong>{email}</strong>
              </p>
              <Link to="/login">
                <Button variant="primary" size="lg" fullWidth>
                  Return to log in
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Right — Visual Panel */}
      <div className="auth-right">
        <div className="auth-right-content">
          <div className="auth-right-tag">🔒 Secure & Encrypted</div>
          <h2 className="auth-right-title">Regain access to your account</h2>
          <p className="auth-right-subtitle">
            Get back to exploring top jobs, reviewing candidates, and mentoring in just a few clicks.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
