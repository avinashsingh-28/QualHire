import { useState, useEffect } from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import { Sun, Moon, Menu, X, Briefcase } from 'lucide-react';
import useTheme from '../../hooks/useTheme';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/Button';
import './PublicLayout.css';

/* ---- Navbar ---- */
const Navbar = () => {
  const { toggle, isDark } = useTheme();
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = 'hidden';
    else          document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const getDashboardPath = () => `/${role || 'candidate'}`;

  const navLinks = [
    { label: 'For Candidates', to: '/for-candidates' },
    { label: 'For Recruiters', to: '/for-recruiters' },
    { label: 'For Mentors', to: '/for-mentors' },
    { label: 'Pricing', to: '/#pricing' },
    { label: 'About', to: '/#about' },
  ];

  return (
    <>
      <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-inner">
          {/* Logo */}
          <Link to="/" className="navbar-logo" aria-label="QualHire home">
            <div className="navbar-logo-icon">Q</div>
            <span className="navbar-logo-text">
              <span className="logo-qual">Qual</span>Hire
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="navbar-links" aria-label="Main navigation">
            {navLinks.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="navbar-actions">
            <button
              className="navbar-theme-btn"
              onClick={toggle}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              id="theme-toggle-btn"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {isAuthenticated ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(getDashboardPath())}
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  Sign in
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/signup')}
                >
                  Get started
                </Button>
              </>
            )}

            {/* Mobile hamburger */}
            <button
              className="navbar-hamburger"
              onClick={() => setMenuOpen(v => !v)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="navbar-mobile-menu" aria-label="Mobile navigation">
          {navLinks.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className="navbar-mobile-link"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
          <div className="navbar-mobile-divider" />
          <div className="navbar-mobile-actions">
            {isAuthenticated ? (
              <Button
                variant="primary"
                fullWidth
                onClick={() => { navigate(getDashboardPath()); setMenuOpen(false); }}
              >
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => { navigate('/login'); setMenuOpen(false); }}
                >
                  Sign in
                </Button>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => { navigate('/signup'); setMenuOpen(false); }}
                >
                  Get started free
                </Button>
              </>
            )}
          </div>
        </nav>
      )}
    </>
  );
};

/* ---- Footer ---- */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="navbar-logo">
              <div className="navbar-logo-icon">Q</div>
              <span className="navbar-logo-text">
                <span className="logo-qual">Qual</span>Hire
              </span>
            </Link>
            <p className="footer-brand-desc">
              The modern recruitment platform connecting top talent with world-class companies through AI-powered matching and expert mentorship.
            </p>
            <div className="footer-social">
              <a href="#" className="footer-social-link" aria-label="Twitter">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/></svg>
              </a>
              <a href="#" className="footer-social-link" aria-label="LinkedIn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="#" className="footer-social-link" aria-label="GitHub">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <p className="footer-col-title">Product</p>
            <div className="footer-col-links">
              {['Features', 'Pricing', 'Changelog', 'Roadmap', 'API'].map(t => (
                <Link key={t} to="#" className="footer-col-link">{t}</Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <p className="footer-col-title">Company</p>
            <div className="footer-col-links">
              {['About', 'Blog', 'Careers', 'Press', 'Contact'].map(t => (
                <Link key={t} to="#" className="footer-col-link">{t}</Link>
              ))}
            </div>
          </div>

          {/* For you */}
          <div>
            <p className="footer-col-title">Resources</p>
            <div className="footer-col-links">
              {['Candidates', 'Recruiters', 'Mentors', 'Documentation', 'Support'].map(t => (
                <Link key={t} to="#" className="footer-col-link">{t}</Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <span>© {currentYear} QualHire, Inc. All rights reserved.</span>
          <div className="footer-bottom-links">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(t => (
              <Link key={t} to="#" className="footer-bottom-link">{t}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

/* ---- PublicLayout ---- */
const PublicLayout = () => (
  <div className="public-layout">
    <Navbar />
    <main className="public-layout-main" id="main-content">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default PublicLayout;
