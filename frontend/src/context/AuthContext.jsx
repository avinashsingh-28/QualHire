import { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

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
    try {
      const data = await api.post('/auth/signup', { name, email, password, role });
      localStorage.setItem('qh_token', data.token);

      const userSession = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        avatar: data.user.avatar || null,
        title: data.user.role === 'candidate' ? 'Software Engineer' : data.user.role === 'recruiter' ? 'Recruiter' : 'Mentor',
        location: data.user.location || 'Remote',
      };

      setUser(userSession);
      localStorage.setItem('qh_user', JSON.stringify(userSession));
      setIsLoading(false);
      return userSession;
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  }, []);

  const login = useCallback(async (email, password, role = 'candidate') => {
    setIsLoading(true);
    try {
      const data = await api.post('/auth/login', { email, password });
      localStorage.setItem('qh_token', data.token);

      const userSession = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        avatar: data.user.avatar || null,
        title: data.user.role === 'candidate' ? 'Software Engineer' : data.user.role === 'recruiter' ? 'Recruiter' : 'Mentor',
        location: data.user.location || 'Remote',
      };

      // Set user role to context
      setUser(userSession);
      localStorage.setItem('qh_user', JSON.stringify(userSession));
      setIsLoading(false);
      return userSession;
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('qh_user');
    localStorage.removeItem('qh_token');
  }, []);

  // Role switcher for demo/debug purposes
  const switchRole = useCallback((newRole) => {
    // This is optional, but we can update role in context if needed
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, role: newRole };
      localStorage.setItem('qh_user', JSON.stringify(updated));
      return updated;
    });
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
