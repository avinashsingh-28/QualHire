import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Users, Calendar, MapPin, DollarSign, Clock, Plus, 
  Search, Filter, Trash2, Edit2, CheckCircle, XCircle, BarChart3,
  Eye, FileText, ArrowLeft, ChevronRight, CheckCircle2, MoreVertical
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { StatCard } from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import useAuth from '../../hooks/useAuth';
import { useSearchParams } from 'react-router-dom';
import '../candidate/Dashboard.css'; // Leverage existing dashboard styles

const INITIAL_JOBS = [
  {
    id: 1,
    title: 'Senior Frontend Engineer',
    description: 'We are looking for a Senior Frontend Engineer with expertise in React, TypeScript, and modern CSS methodologies. You will own the front-end architecture of our candidate hiring pipeline products.',
    skills: ['React', 'TypeScript', 'CSS', 'Redux', 'Jest'],
    salary: '$130k - $160k',
    experience: '5+ years',
    location: 'San Francisco, CA (Hybrid)',
    status: 'active',
    applicantCount: 342,
    views: 1205,
    interviews: 45,
    hired: 3,
    pipelineBreakdown: { applied: 200, screening: 94, interview: 45, offer: 6, hired: 3 }
  },
  {
    id: 2,
    title: 'Lead Backend Developer',
    description: 'Join us to design and scale our microservices backend using Spring Boot, Hibernate, and AWS. Ideal candidates have strong Java background and experience with message brokers like Kafka.',
    skills: ['Java', 'Spring Boot', 'AWS', 'MySQL', 'Kafka'],
    salary: '$150k - $185k',
    experience: '8+ years',
    location: 'Remote (US)',
    status: 'active',
    applicantCount: 289,
    views: 954,
    interviews: 32,
    hired: 2,
    pipelineBreakdown: { applied: 170, screening: 85, interview: 32, offer: 4, hired: 2 }
  },
  {
    id: 3,
    title: 'Product Designer',
    description: 'Looking for a generalist Product Designer to craft outstanding user flows and layouts. Must have solid UI/UX portfolio showing complex dashboard designs and client interaction.',
    skills: ['Figma', 'UI/UX', 'Wireframing', 'Prototyping', 'User Research'],
    salary: '$110k - $140k',
    experience: '3+ years',
    location: 'New York, NY (Hybrid)',
    status: 'active',
    applicantCount: 412,
    views: 1680,
    interviews: 58,
    hired: 4,
    pipelineBreakdown: { applied: 250, screening: 100, interview: 58, offer: 8, hired: 4 }
  },
  {
    id: 4,
    title: 'Data Scientist',
    description: 'Help us build recommending algorithms using Machine Learning. Python, Pandas, TensorFlow and strong statistical background required.',
    skills: ['Python', 'SQL', 'TensorFlow', 'Scikit-learn', 'Pandas'],
    salary: '$140k - $175k',
    experience: '4+ years',
    location: 'Seattle, WA',
    status: 'closed',
    applicantCount: 156,
    views: 620,
    interviews: 18,
    hired: 1,
    pipelineBreakdown: { applied: 100, screening: 37, interview: 18, offer: 2, hired: 1 }
  },
  {
    id: 5,
    title: 'DevOps Engineer',
    description: 'Manage infrastructure deployment pipelines, CI/CD, Kubernetes cluster administration, and cloud security compliance across multiple regions.',
    skills: ['Kubernetes', 'Docker', 'Terraform', 'CI/CD', 'AWS'],
    salary: '$135k - $165k',
    experience: '4+ years',
    location: 'Remote (US)',
    status: 'active',
    applicantCount: 49,
    views: 280,
    interviews: 8,
    hired: 0,
    pipelineBreakdown: { applied: 30, screening: 11, interview: 8, offer: 0, hired: 0 }
  }
];

const STAGE_COLORS = {
  applied: '#3b82f6',
  screening: '#6366f1',
  interview: '#8b5cf6',
  offer: '#10b981',
  hired: '#059669'
};

const RecruiterJobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const [searchParams] = useSearchParams();
  const globalSearchQuery = searchParams.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(globalSearchQuery);

  useEffect(() => {
    setSearchQuery(globalSearchQuery);
  }, [globalSearchQuery]);
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Modals / Drawer State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  
  // Forms State
  const [formValues, setFormValues] = useState({
    title: '',
    description: '',
    skills: '',
    salary: '',
    experience: '',
    location: '',
    status: 'active'
  });

  const handleOpenCreateModal = () => {
    setFormValues({
      title: '',
      description: '',
      skills: '',
      salary: '',
      experience: '',
      location: '',
      status: 'active'
    });
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = (job) => {
    setSelectedJob(job);
    setFormValues({
      title: job.title,
      description: job.description,
      skills: job.skills.join(', '),
      salary: job.salary,
      experience: job.experience,
      location: job.location,
      status: job.status
    });
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteModal = (job) => {
    setSelectedJob(job);
    setIsDeleteModalOpen(true);
  };

  const handleCreateJob = (e) => {
    e.preventDefault();
    const newJob = {
      id: Date.now(),
      title: formValues.title,
      description: formValues.description,
      skills: formValues.skills.split(',').map(s => s.trim()).filter(Boolean),
      salary: formValues.salary,
      experience: formValues.experience,
      location: formValues.location,
      status: formValues.status,
      applicantCount: 0,
      views: 0,
      interviews: 0,
      hired: 0,
      pipelineBreakdown: { applied: 0, screening: 0, interview: 0, offer: 0, hired: 0 }
    };
    setJobs([newJob, ...jobs]);
    setIsCreateModalOpen(false);
  };

  const handleEditJob = (e) => {
    e.preventDefault();
    const updatedSkills = formValues.skills.split(',').map(s => s.trim()).filter(Boolean);
    const updatedJob = {
      ...selectedJob,
      title: formValues.title,
      description: formValues.description,
      skills: updatedSkills,
      salary: formValues.salary,
      experience: formValues.experience,
      location: formValues.location,
      status: formValues.status
    };
    setJobs(jobs.map(j => j.id === selectedJob.id ? { ...j, ...updatedJob } : j));
    setSelectedJob(updatedJob);
    setIsEditModalOpen(false);
  };

  const handleDeleteJob = () => {
    setJobs(jobs.filter(j => j.id !== selectedJob.id));
    setIsDeleteModalOpen(false);
    setSelectedJob(null);
  };

  const handleToggleJobStatus = (job) => {
    const nextStatus = job.status === 'active' ? 'closed' : 'active';
    setJobs(jobs.map(j => {
      if (j.id === job.id) {
        const updated = { ...j, status: nextStatus };
        if (selectedJob && selectedJob.id === job.id) {
          setSelectedJob(updated);
        }
        return updated;
      }
      return j;
    }));
  };

  // Metrics
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter(j => j.status === 'active').length;
  const closedJobs = jobs.filter(j => j.status === 'closed').length;
  const totalApplicants = jobs.reduce((sum, j) => sum + j.applicantCount, 0);

  // Filtering
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          job.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' ? true : job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Analytics helper data
  const pipelineChartData = selectedJob ? [
    { name: 'Applied', count: selectedJob.pipelineBreakdown.applied, fill: STAGE_COLORS.applied },
    { name: 'Screening', count: selectedJob.pipelineBreakdown.screening, fill: STAGE_COLORS.screening },
    { name: 'Interview', count: selectedJob.pipelineBreakdown.interview, fill: STAGE_COLORS.interview },
    { name: 'Offer', count: selectedJob.pipelineBreakdown.offer, fill: STAGE_COLORS.offer },
    { name: 'Hired', count: selectedJob.pipelineBreakdown.hired, fill: STAGE_COLORS.hired }
  ] : [];

  return (
    <div className="dashboard-page">
      {/* Header Banner */}
      <div style={{ 
        background: 'var(--color-surface)', border: '1px solid var(--color-border)', 
        borderRadius: 'var(--radius-xl)', padding: '32px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        boxShadow: 'var(--shadow-sm)', marginBottom: 'var(--space-6)'
      }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '8px' }}>
            Job Postings
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px' }}>
            Create, manage, and analyze your job advertisements in one centralized hub.
          </p>
        </div>
        <div>
          <Button variant="primary" leftIcon={<Plus size={18} />} onClick={handleOpenCreateModal}>
            Post a Job
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="stats-row" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 'var(--space-6)' }}>
        <StatCard label="Total Openings" value={totalJobs} icon={<Briefcase size={20} />} iconBg="rgba(59, 130, 246, 0.1)" iconColor="#3b82f6" />
        <StatCard label="Active Jobs" value={activeJobs} icon={<CheckCircle size={20} />} iconBg="rgba(16, 185, 129, 0.1)" iconColor="#10b981" />
        <StatCard label="Closed Jobs" value={closedJobs} icon={<XCircle size={20} />} iconBg="rgba(239, 68, 68, 0.1)" iconColor="#ef4444" />
        <StatCard label="Total Applications Received" value={totalApplicants} icon={<Users size={20} />} iconBg="rgba(139, 92, 246, 0.1)" iconColor="#8b5cf6" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedJob ? '1.4fr 1fr' : '1fr', gap: 'var(--space-6)', transition: 'all 0.3s ease' }}>
        
        {/* Main Job List Column */}
        <div className="section-card" style={{ height: 'fit-content' }}>
          <div className="section-card-header" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <h2 className="section-card-title">All Postings ({filteredJobs.length})</h2>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ position: 'relative', width: '220px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
                <input 
                  type="text" 
                  placeholder="Search jobs..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%', padding: '8px 12px 8px 36px', borderRadius: '8px', 
                    border: '1px solid var(--color-border)', background: 'var(--color-bg)',
                    color: 'var(--color-text-primary)', fontSize: '14px'
                  }}
                />
              </div>

              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', 
                  background: 'var(--color-bg)', color: 'var(--color-text-primary)', fontSize: '14px',
                  outline: 'none', cursor: 'pointer'
                }}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="section-card-body" style={{ padding: 0 }}>
            {filteredJobs.length === 0 ? (
              <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                <Briefcase size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
                <p style={{ fontWeight: 600, fontSize: '16px', color: 'var(--color-text-primary)' }}>No jobs found</p>
                <p style={{ fontSize: '14px' }}>Try adjusting your search criteria or create a new job posting.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {filteredJobs.map(job => (
                  <div 
                    key={job.id} 
                    onClick={() => setSelectedJob(job)}
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '20px var(--space-6)', borderBottom: '1px solid var(--color-border)',
                      cursor: 'pointer', transition: 'background-color 0.2s',
                      backgroundColor: selectedJob?.id === job.id ? 'var(--color-bg-hover)' : 'transparent'
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{job.title}</h3>
                        <span style={{ 
                          fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '12px',
                          textTransform: 'uppercase',
                          backgroundColor: job.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                          color: job.status === 'active' ? '#10b981' : '#ef4444'
                        }}>
                          {job.status}
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={14} /> {job.location}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={14} /> {job.experience}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <DollarSign size={14} /> {job.salary}
                        </span>
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                        {job.skills.map(skill => (
                          <span key={skill} style={{ 
                            fontSize: '11px', background: 'var(--color-bg)', padding: '2px 8px', 
                            borderRadius: '4px', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)'
                          }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '18px', fontWeight: 700, color: '#3b82f6' }}>{job.applicantCount}</p>
                        <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Applicants</p>
                      </div>

                      <div style={{ display: 'flex', gap: '6px' }}>
                        <Button 
                          variant="ghost" 
                          iconOnly 
                          size="sm" 
                          leftIcon={<Edit2 size={15} style={{ color: 'var(--color-text-secondary)' }} />} 
                          onClick={() => handleOpenEditModal(job)}
                          title="Edit Job"
                        />
                        <Button 
                          variant="ghost" 
                          iconOnly 
                          size="sm" 
                          leftIcon={job.status === 'active' ? <XCircle size={15} style={{ color: '#ef4444' }} /> : <CheckCircle size={15} style={{ color: '#10b981' }} />} 
                          onClick={() => handleToggleJobStatus(job)}
                          title={job.status === 'active' ? 'Close Job' : 'Reopen Job'}
                        />
                        <Button 
                          variant="ghost" 
                          iconOnly 
                          size="sm" 
                          leftIcon={<Trash2 size={15} style={{ color: '#ef4444' }} />} 
                          onClick={() => handleOpenDeleteModal(job)}
                          title="Delete Job"
                        />
                      </div>
                      <ChevronRight size={18} style={{ color: 'var(--color-text-secondary)' }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Selected Job Analytics Panel */}
        {selectedJob && (
          <div className="section-card" style={{ display: 'flex', flexDirection: 'column', height: 'fit-content' }}>
            <div className="section-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Button 
                  variant="ghost" 
                  iconOnly 
                  size="sm" 
                  leftIcon={<ArrowLeft size={16} />} 
                  onClick={() => setSelectedJob(null)}
                />
                <h2 className="section-card-title">Job Details & Analytics</h2>
              </div>
              <span style={{ 
                fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '12px',
                textTransform: 'uppercase',
                backgroundColor: selectedJob.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                color: selectedJob.status === 'active' ? '#10b981' : '#ef4444'
              }}>
                {selectedJob.status}
              </span>
            </div>

            <div className="section-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>{selectedJob.title}</h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span><MapPin size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} /> {selectedJob.location}</span>
                  <span>•</span>
                  <span>{selectedJob.experience} Experience</span>
                  <span>•</span>
                  <span>{selectedJob.salary}</span>
                </p>
              </div>

              {/* Stat Boxes */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div style={{ padding: '16px', background: 'var(--color-bg)', borderRadius: '8px', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                  <p style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{selectedJob.views}</p>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '4px' }}>
                    <Eye size={13} /> Views
                  </p>
                </div>
                <div style={{ padding: '16px', background: 'var(--color-bg)', borderRadius: '8px', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                  <p style={{ fontSize: '20px', fontWeight: 700, color: '#3b82f6' }}>{selectedJob.applicantCount}</p>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '4px' }}>
                    <Users size={13} /> Applicants
                  </p>
                </div>
                <div style={{ padding: '16px', background: 'var(--color-bg)', borderRadius: '8px', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                  <p style={{ fontSize: '20px', fontWeight: 700, color: '#10b981' }}>{selectedJob.hired}</p>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '4px' }}>
                    <CheckCircle2 size={13} /> Hires
                  </p>
                </div>
              </div>

              {/* Pipeline funnel */}
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '12px' }}>Applicant Pipeline Breakdown</h4>
                {selectedJob.applicantCount === 0 ? (
                  <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontStyle: 'italic', textAlign: 'center', padding: '16px' }}>No pipeline data available yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {pipelineChartData.map(stage => {
                      const percentage = selectedJob.applicantCount > 0 ? ((stage.count / selectedJob.pipelineBreakdown.applied) * 100).toFixed(0) : 0;
                      return (
                        <div key={stage.name} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 500 }}>
                            <span style={{ color: 'var(--color-text-primary)' }}>{stage.name}</span>
                            <span style={{ color: 'var(--color-text-secondary)' }}>{stage.count} ({percentage}%)</span>
                          </div>
                          <div style={{ height: '8px', background: 'var(--color-bg)', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                            <div style={{ height: '100%', background: stage.fill, width: `${percentage}%`, borderRadius: '4px' }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <hr style={{ border: 0, borderTop: '1px solid var(--color-border)' }} />

              {/* Description & Skills */}
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>Job Description</h4>
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                  {selectedJob.description}
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>Skills & Keywords</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {selectedJob.skills.map(skill => (
                    <span key={skill} style={{ 
                      fontSize: '12px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', 
                      padding: '4px 10px', borderRadius: '4px', fontWeight: 500
                    }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- CREATE JOB MODAL --- */}
      <Modal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        title="Post a New Job"
        subtitle="Provide the details for the position you want to advertise."
        size="md"
      >
        <form onSubmit={handleCreateJob} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input 
            label="Role / Title" 
            id="title" 
            required 
            value={formValues.title}
            onChange={(e) => setFormValues({ ...formValues, title: e.target.value })}
            placeholder="e.g. Senior Frontend Engineer"
          />

          <Input 
            label="Location" 
            id="location" 
            required 
            value={formValues.location}
            onChange={(e) => setFormValues({ ...formValues, location: e.target.value })}
            placeholder="e.g. San Francisco, CA (Hybrid) or Remote"
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Input 
              label="Experience Required" 
              id="experience" 
              required 
              value={formValues.experience}
              onChange={(e) => setFormValues({ ...formValues, experience: e.target.value })}
              placeholder="e.g. 5+ years"
            />
            <Input 
              label="Salary Range" 
              id="salary" 
              required 
              value={formValues.salary}
              onChange={(e) => setFormValues({ ...formValues, salary: e.target.value })}
              placeholder="e.g. $120k - $150k"
            />
          </div>

          <Input 
            label="Skills & Keywords" 
            id="skills" 
            required 
            helperText="Separate skills with commas (e.g. React, JavaScript, AWS)"
            value={formValues.skills}
            onChange={(e) => setFormValues({ ...formValues, skills: e.target.value })}
            placeholder="React, Redux, Node.js"
          />

          <Input 
            label="Job Description" 
            id="description" 
            required 
            as="textarea"
            rows={5}
            value={formValues.description}
            onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
            placeholder="Describe the responsibilities, goals, and culture of the role..."
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
            <Button variant="ghost" type="button" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Post Job
            </Button>
          </div>
        </form>
      </Modal>

      {/* --- EDIT JOB MODAL --- */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Job Posting"
        subtitle={`Update details for ${selectedJob?.title}`}
        size="md"
      >
        <form onSubmit={handleEditJob} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input 
            label="Role / Title" 
            id="edit-title" 
            required 
            value={formValues.title}
            onChange={(e) => setFormValues({ ...formValues, title: e.target.value })}
          />

          <Input 
            label="Location" 
            id="edit-location" 
            required 
            value={formValues.location}
            onChange={(e) => setFormValues({ ...formValues, location: e.target.value })}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Input 
              label="Experience Required" 
              id="edit-experience" 
              required 
              value={formValues.experience}
              onChange={(e) => setFormValues({ ...formValues, experience: e.target.value })}
            />
            <Input 
              label="Salary Range" 
              id="edit-salary" 
              required 
              value={formValues.salary}
              onChange={(e) => setFormValues({ ...formValues, salary: e.target.value })}
            />
          </div>

          <Input 
            label="Skills & Keywords" 
            id="edit-skills" 
            required 
            helperText="Separate skills with commas"
            value={formValues.skills}
            onChange={(e) => setFormValues({ ...formValues, skills: e.target.value })}
          />

          <Input 
            label="Job Description" 
            id="edit-description" 
            required 
            as="textarea"
            rows={5}
            value={formValues.description}
            onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
            <Button variant="ghost" type="button" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* --- DELETE CONFIRMATION MODAL --- */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Job Posting"
        subtitle="This action cannot be undone."
        size="sm"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: '1.5' }}>
            Are you sure you want to delete the job posting for <strong>{selectedJob?.title}</strong>? All application records associated with this posting will be permanently deleted.
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteJob}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RecruiterJobs;
