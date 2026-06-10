import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

// Mock user data per role
const MOCK_USERS = {
  candidate: {
    id: 'u-001',
    name: 'Alex Johnson',
    email: 'candidate@qualhire.com',
    role: 'candidate',
    avatar: null,
    title: 'Software Engineer',
    location: 'San Francisco, CA',
  },
  recruiter: {
    id: 'u-002',
    name: 'Sarah Mitchell',
    email: 'recruiter@qualhire.com',
    role: 'recruiter',
    avatar: null,
    company: 'TechCorp Inc.',
    title: 'Senior Recruiter',
  },
  mentor: {
    id: 'u-003',
    name: 'Dr. Raj Patel',
    email: 'mentor@qualhire.com',
    role: 'mentor',
    avatar: null,
    title: 'Engineering Manager',
    expertise: ['React', 'System Design', 'Career Growth'],
  },
  admin: {
    id: 'u-004',
    name: 'Emily Chen',
    email: 'admin@qualhire.com',
    role: 'admin',
    avatar: null,
    title: 'Platform Administrator',
  },
};

const DEMO_CREDENTIALS = {
  candidate: { email: 'candidate@qualhire.com', password: 'password123' },
  recruiter: { email: 'recruiter@qualhire.com', password: 'password123' },
  mentor: { email: 'mentor@qualhire.com', password: 'password123' },
  admin: { email: 'admin@qualhire.com', password: 'password123' }
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

  const signup = useCallback(async (name, email, password, role = 'candidate') => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));

    const registeredUsers = JSON.parse(localStorage.getItem('qh_users') || '[]');
    if (registeredUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      setIsLoading(false);
      throw new Error('Email already exists');
    }

    const newUser = {
      id: `u_${Date.now()}`,
      name,
      email,
      password, // Save password
      role,
      avatar: null,
      title: role === 'candidate' ? 'Software Engineer' : role === 'recruiter' ? 'Recruiter' : 'Mentor',
      location: 'Remote',
    };

    registeredUsers.push(newUser);
    localStorage.setItem('qh_users', JSON.stringify(registeredUsers));

    setUser(newUser);
    localStorage.setItem('qh_user', JSON.stringify(newUser));
    setIsLoading(false);
    return newUser;
  }, []);

  const login = useCallback(async (email, password, role = 'candidate') => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 800));

    // 1. Check if it matches explicit demo credentials for this role
    const demo = DEMO_CREDENTIALS[role];
    if (demo && demo.email.toLowerCase() === email.toLowerCase() && demo.password === password) {
      const mockUser = MOCK_USERS[role];
      setUser(mockUser);
      localStorage.setItem('qh_user', JSON.stringify(mockUser));
      setIsLoading(false);
      return mockUser;
    }

    // 2. Check registered users in localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('qh_users') || '[]');
    const registeredUser = registeredUsers.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.role === role
    );

    if (registeredUser) {
      if (registeredUser.password === password) {
        // Remove password from user session storage
        const { password: _, ...userSession } = registeredUser;
        setUser(userSession);
        localStorage.setItem('qh_user', JSON.stringify(userSession));
        setIsLoading(false);
        return userSession;
      } else {
        setIsLoading(false);
        throw new Error('Invalid email or password');
      }
    }

    setIsLoading(false);
    throw new Error('Invalid email or password');
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
      
      // Also update in registered users list if found
      const registeredUsers = JSON.parse(localStorage.getItem('qh_users') || '[]');
      const updatedUsers = registeredUsers.map(u => u.id === prev.id ? { ...u, ...updates } : u);
      localStorage.setItem('qh_users', JSON.stringify(updatedUsers));
      
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
      signup,
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
