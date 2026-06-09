import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

// Mock user data per role
const MOCK_USERS = {
  candidate: {
    id: 'u-001',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    role: 'candidate',
    avatar: null,
    title: 'Software Engineer',
    location: 'San Francisco, CA',
  },
  recruiter: {
    id: 'u-002',
    name: 'Sarah Mitchell',
    email: 'sarah@techcorp.com',
    role: 'recruiter',
    avatar: null,
    company: 'TechCorp Inc.',
    title: 'Senior Recruiter',
  },
  mentor: {
    id: 'u-003',
    name: 'Dr. Raj Patel',
    email: 'raj@mentors.io',
    role: 'mentor',
    avatar: null,
    title: 'Engineering Manager',
    expertise: ['React', 'System Design', 'Career Growth'],
  },
  admin: {
    id: 'u-004',
    name: 'Emily Chen',
    email: 'emily@qualhire.io',
    role: 'admin',
    avatar: null,
    title: 'Platform Administrator',
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('qh_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email, password, role = 'candidate') => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 800));

    const mockUser = MOCK_USERS[role] || MOCK_USERS.candidate;
    setUser(mockUser);
    localStorage.setItem('qh_user', JSON.stringify(mockUser));
    setIsLoading(false);
    return mockUser;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('qh_user');
  }, []);

  // Role switcher for demo purposes
  const switchRole = useCallback((role) => {
    const mockUser = MOCK_USERS[role];
    if (mockUser) {
      setUser(mockUser);
      localStorage.setItem('qh_user', JSON.stringify(mockUser));
    }
  }, []);

  const updateUser = useCallback((updates) => {
    setUser(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('qh_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      role: user?.role ?? null,
      login,
      logout,
      switchRole,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
