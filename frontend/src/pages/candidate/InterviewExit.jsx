import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Home, Briefcase, Calendar } from 'lucide-react';
import Button from '../../components/Button';
import useAuth from '../../hooks/useAuth';
import './Dashboard.css';

const InterviewExit = () => {
  const navigate = useNavigate();
  const { role } = useAuth();

  const handleReturnDashboard = () => {
    navigate(`/${role || 'candidate'}`);
  };

  return (
    <div style={{ 
      display: 'flex', alignItems: 'center', justifyContent: 'center', 
      minHeight: '100vh', background: 'radial-gradient(circle, var(--color-surface) 0%, rgba(99,102,241,0.02) 100%)', 
      padding: '24px' 
    }}>
      <div className="section-card" style={{ 
        maxWidth: '480px', width: '100%', padding: '48px', 
        textAlign: 'center', display: 'flex', flexDirection: 'column', 
        alignItems: 'center', gap: '24px', boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ 
          width: '72px', height: '72px', borderRadius: '50%', 
          background: 'rgba(99, 102, 241, 0.1)', color: 'var(--color-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <LogOut size={36} />
        </div>
        
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-text-primary)' }}>Meeting Left</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px', marginTop: '10px', lineHeight: 1.5 }}>
            You have successfully disconnected from the secure interview room. Thank you for participating!
          </p>
        </div>

        <div style={{ 
          width: '100%', borderTop: '1px solid var(--color-border)', 
          paddingTop: '20px', display: 'flex', gap: '12px', justifyContent: 'center' 
        }}>
          <Button variant="outline" leftIcon={<Home size={16} />} onClick={() => navigate('/')}>
            Home
          </Button>
          <Button variant="primary" leftIcon={<Calendar size={16} />} onClick={handleReturnDashboard}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewExit;
