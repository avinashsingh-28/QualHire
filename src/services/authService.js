import api from './api';

/**
 * Auth service stub
 * Implement real endpoints when backend is available.
 */
const authService = {
  login: (email, password) =>
    api.post('/auth/login', { email, password }),

  signup: (data) =>
    api.post('/auth/signup', data),

  logout: () =>
    api.post('/auth/logout'),

  refreshToken: () =>
    api.post('/auth/refresh'),

  forgotPassword: (email) =>
    api.post('/auth/forgot-password', { email }),

  resetPassword: (token, password) =>
    api.post('/auth/reset-password', { token, password }),

  me: () =>
    api.get('/auth/me'),
};

export default authService;
