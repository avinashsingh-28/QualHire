import api from './api';

/**
 * Job service stub
 */
const jobService = {
  // Public
  getJobs: (params) => api.get('/jobs', params),
  getJobById: (id) => api.get(`/jobs/${id}`),
  searchJobs: (query) => api.get('/jobs/search', { q: query }),

  // Recruiter
  createJob: (data) => api.post('/jobs', data),
  updateJob: (id, data) => api.put(`/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  publishJob: (id) => api.patch(`/jobs/${id}/publish`),
  closeJob: (id) => api.patch(`/jobs/${id}/close`),

  // Applications
  getApplications: (jobId) => api.get(`/jobs/${jobId}/applications`),
  updateApplicationStatus: (appId, status) =>
    api.patch(`/applications/${appId}/status`, { status }),

  // Candidate
  applyToJob: (jobId, data) => api.post(`/jobs/${jobId}/apply`, data),
  withdrawApplication: (appId) => api.delete(`/applications/${appId}`),
  getMyApplications: () => api.get('/applications/mine'),
  saveJob: (jobId) => api.post(`/jobs/${jobId}/save`),
  getSavedJobs: () => api.get('/jobs/saved'),
};

export default jobService;
