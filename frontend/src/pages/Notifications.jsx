import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, MessageSquare, Briefcase, Calendar, ClipboardList, TrendingUp, Filter, Trash2 } from 'lucide-react';
import Button from '../components/Button';
import useAuth from '../hooks/useAuth';

const TYPE_CONFIGS = {
  message: {
    icon: <MessageSquare size={18} />,
    color: '#3b82f6',
    bgColor: '#3b82f615'
  },
  interview: {
    icon: <Calendar size={18} />,
    color: '#8b5cf6',
    bgColor: '#8b5cf615'
  },
  job: {
    icon: <Briefcase size={18} />,
    color: '#10b981',
    bgColor: '#10b98115'
  },
  application: {
    icon: <TrendingUp size={18} />,
    color: '#f59e0b',
    bgColor: '#f59e0b15'
  },
  assessment: {
    icon: <ClipboardList size={18} />,
    color: '#ec4899',
    bgColor: '#ec489915'
  }
};

const DEFAULT_NOTIFICATIONS = [
  {
    id: 1,
    type: 'message',
    title: 'New message from Sarah Miller',
    description: 'Hi there! We reviewed your application and would love to...',
    time: '2 mins ago',
    read: false
  },
  {
    id: 2,
    type: 'interview',
    title: 'Interview Scheduled: Senior Frontend Engineer',
    description: 'Your technical interview is confirmed for tomorrow at 10:00 AM PST.',
    time: '1 hour ago',
    read: false
  },
  {
    id: 3,
    type: 'job',
    title: 'New Job Match: TechCorp Solutions',
    description: 'A new job matching your 95% skill profile was just posted.',
    time: '3 hours ago',
    read: true
  },
  {
    id: 4,
    type: 'application',
    title: 'Application Update: Google',
    description: 'Your application for "Product Designer" has moved to the Screening phase.',
    time: '1 day ago',
    read: true
  },
  {
    id: 5,
    type: 'assessment',
    title: 'Assessment Results Available',
    description: 'You scored 92% on the React Advanced Assessment. View your detailed breakdown.',
    time: '2 days ago',
    read: true
  }
];

const Notifications = () => {
  const { user, role } = useAuth();
  const storageKey = `qh_notifications_${user?.id || 'default'}`;
  
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
      // Seed if not present
      localStorage.setItem(storageKey, JSON.stringify(DEFAULT_NOTIFICATIONS));
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_NOTIFICATIONS;
  });

  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const saveNotifications = (newNotifications) => {
    setNotifications(newNotifications);
    localStorage.setItem(storageKey, JSON.stringify(newNotifications));
    window.dispatchEvent(new Event('qh_notifications_updated'));
  };

  const handleMarkAsRead = (id) => {
    const next = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    saveNotifications(next);
  };

  const handleMarkAllAsRead = () => {
    const next = notifications.map(n => ({ ...n, read: true }));
    saveNotifications(next);
  };

  const clearAll = () => {
    saveNotifications([]);
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'messages') return n.type === 'message';
    if (filter === 'jobs') return n.type === 'job' || n.type === 'application';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="dashboard-page">
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={24} color="var(--color-primary)" />
            Notifications
            {unreadCount > 0 && (
              <span style={{ 
                background: '#ef4444', color: 'white', fontSize: '12px', fontWeight: 'bold', 
                padding: '2px 8px', borderRadius: '12px', marginLeft: '8px' 
              }}>
                {unreadCount} New
              </span>
            )}
          </h1>
          <p className="page-subtitle">Stay updated on your hiring journey.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="outline" leftIcon={<Check size={16} />} onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
            Mark all as read
          </Button>
          <Button variant="outline" leftIcon={<Trash2 size={16} />} onClick={clearAll} style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}>
            Clear all
          </Button>
        </div>
      </div>

      <div className="section-card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Filters */}
        <div style={{ display: 'flex', gap: '16px', padding: '16px 24px', borderBottom: '1px solid var(--color-border)', overflowX: 'auto' }}>
          {['all', 'unread', 'messages', 'jobs'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '6px 16px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                background: filter === f ? 'var(--color-primary)' : 'var(--color-surface)',
                color: filter === f ? '#fff' : 'var(--color-text-secondary)',
                transition: 'all 0.2s',
                textTransform: 'capitalize'
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          {filteredNotifications.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '48px', color: 'var(--color-text-tertiary)' }}>
              <Bell size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
              <h3 style={{ color: 'var(--color-text-secondary)', marginBottom: '8px' }}>No notifications here</h3>
              <p style={{ fontSize: '14px', textAlign: 'center' }}>You're all caught up! Check back later for updates.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredNotifications.map(notification => {
                const config = TYPE_CONFIGS[notification.type] || {
                  icon: <Bell size={18} />,
                  color: 'var(--color-primary)',
                  bgColor: 'var(--color-primary-lightest)'
                };
                
                return (
                  <div 
                    key={notification.id} 
                    onClick={() => handleMarkAsRead(notification.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '16px',
                      padding: '20px',
                      borderRadius: '12px',
                      background: notification.read ? 'transparent' : 'var(--color-surface)',
                      border: '1px solid',
                      borderColor: notification.read ? 'var(--color-border)' : 'var(--color-primary-light)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
                  >
                    {!notification.read && (
                      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: 'var(--color-primary)' }} />
                    )}
                    
                    <div style={{ 
                      width: '40px', height: '40px', borderRadius: '50%', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      background: config.bgColor, color: config.color 
                    }}>
                      {config.icon}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                        <h4 style={{ 
                          fontSize: '15px', fontWeight: notification.read ? 500 : 600, 
                          color: notification.read ? 'var(--color-text-secondary)' : 'var(--color-text-primary)',
                          margin: 0
                        }}>
                          {notification.title}
                        </h4>
                        <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', whiteSpace: 'nowrap' }}>
                          {notification.time}
                        </span>
                      </div>
                      <p style={{ 
                        fontSize: '14px', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 
                      }}>
                        {notification.description}
                      </p>
                    </div>
                    
                    {!notification.read && (
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-primary)', alignSelf: 'center' }} />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
