import { 
  User, Briefcase, GraduationCap, Award, Link as LinkIcon, 
  MapPin, Mail, Phone, Code, Globe, ExternalLink,
  Edit3
} from 'lucide-react';
import Button from '../../components/Button';
import './Dashboard.css';

const MOCK_PROFILE = {
  personal: {
    name: 'Alex Johnson',
    title: 'Senior Frontend Engineer',
    location: 'San Francisco, CA (Remote)',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 123-4567',
    summary: 'Passionate and detail-oriented Frontend Engineer with 6+ years of experience building scalable web applications. Specializing in React, TypeScript, and modern CSS architecture. Proven track record of improving web performance and leading UI development teams.',
  },
  skills: {
    core: ['JavaScript (ES6+)', 'TypeScript', 'React', 'Next.js', 'Node.js'],
    ui: ['CSS/SASS', 'Tailwind CSS', 'Framer Motion', 'Storybook', 'Figma'],
    tools: ['Git', 'Webpack', 'Vite', 'Jest', 'Cypress']
  },
  experience: [
    {
      id: 1,
      role: 'Senior Frontend Engineer',
      company: 'TechCorp Solutions',
      duration: 'Jan 2021 – Present',
      description: 'Led the frontend architecture for a high-traffic SaaS platform. Improved initial load time by 40% using code splitting and lazy loading. Mentored 3 junior developers.',
    },
    {
      id: 2,
      role: 'UI Developer',
      company: 'Creative Digital Studio',
      duration: 'Mar 2018 – Dec 2020',
      description: 'Developed responsive and accessible user interfaces for e-commerce clients. Created a reusable component library that reduced development time across projects by 25%.',
    }
  ],
  education: [
    {
      id: 1,
      degree: 'B.S. in Computer Science',
      school: 'University of California, Berkeley',
      year: '2014 – 2018',
    }
  ],
  projects: [
    {
      id: 1,
      name: 'OpenSource Dashboard UI',
      description: 'A comprehensive admin dashboard template built with React and Tailwind CSS. Garnered 2k+ stars on GitHub.',
      link: 'github.com/alexj/dashboard'
    },
    {
      id: 2,
      name: 'E-commerce Storefront',
      description: 'Headless e-commerce build using Next.js and Shopify API, featuring 99/100 Lighthouse performance scores.',
      link: 'ecommerce-demo.alexj.dev'
    }
  ],
  certifications: [
    { id: 1, name: 'AWS Certified Developer - Associate', date: '2023', issuer: 'Amazon Web Services' },
    { id: 2, name: 'Advanced React Patterns', date: '2022', issuer: 'Frontend Masters' }
  ],
  links: {
    github: 'github.com/alexjohnson',
    linkedin: 'linkedin.com/in/alexjohnson',
    portfolio: 'alexj.dev'
  }
};

const CandidateProfile = () => {
  const { personal, skills, experience, education, projects, certifications, links } = MOCK_PROFILE;

  return (
    <div className="dashboard-page">
      {/* Profile Header Banner */}
      <div className="profile-banner">
        <div className="profile-banner-info">
          <div className="profile-avatar-large">
            {personal.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h1 className="profile-name">{personal.name}</h1>
            <p className="profile-title">{personal.title}</p>
            <div className="profile-meta">
              <span><MapPin size={14} /> {personal.location}</span>
              <span><Mail size={14} /> {personal.email}</span>
              <span><Phone size={14} /> {personal.phone}</span>
            </div>
          </div>
        </div>
        <div className="profile-banner-actions">
          <Button variant="secondary" leftIcon={<Edit3 size={16} />}>Edit Profile</Button>
          <Button>Share Profile</Button>
        </div>
      </div>

      <div className="dashboard-grid-3">
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          
          {/* About */}
          <div className="section-card">
            <div className="section-card-header">
              <h2 className="section-card-title"><User size={18} /> About</h2>
            </div>
            <div className="section-card-body">
              <p className="profile-summary">{personal.summary}</p>
            </div>
          </div>

          {/* Experience */}
          <div className="section-card">
            <div className="section-card-header">
              <h2 className="section-card-title"><Briefcase size={18} /> Experience</h2>
            </div>
            <div className="section-card-body">
              <div className="timeline">
                {experience.map(exp => (
                  <div key={exp.id} className="timeline-item">
                    <div className="timeline-dot" />
                    <div className="timeline-content">
                      <h3 className="timeline-title">{exp.role}</h3>
                      <p className="timeline-subtitle">{exp.company} <span className="timeline-date">• {exp.duration}</span></p>
                      <p className="timeline-desc">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Projects */}
          <div className="section-card">
            <div className="section-card-header">
              <h2 className="section-card-title"><Code size={18} /> Featured Projects</h2>
            </div>
            <div className="section-card-body">
              <div className="project-grid">
                {projects.map(proj => (
                  <div key={proj.id} className="project-card">
                    <h3 className="project-title">{proj.name}</h3>
                    <p className="project-desc">{proj.description}</p>
                    <a href={`https://${proj.link}`} target="_blank" rel="noreferrer" className="project-link">
                      <ExternalLink size={14} /> {proj.link}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          
          {/* Skills */}
          <div className="section-card">
            <div className="section-card-header">
              <h2 className="section-card-title"><Award size={18} /> Skills</h2>
            </div>
            <div className="section-card-body">
              <div className="skill-group">
                <h4 className="skill-group-title">Core Technologies</h4>
                <div className="job-tags">
                  {skills.core.map(s => <span key={s} className="job-tag">{s}</span>)}
                </div>
              </div>
              <div className="skill-group" style={{ marginTop: 'var(--space-4)' }}>
                <h4 className="skill-group-title">UI & Design</h4>
                <div className="job-tags">
                  {skills.ui.map(s => <span key={s} className="job-tag">{s}</span>)}
                </div>
              </div>
              <div className="skill-group" style={{ marginTop: 'var(--space-4)' }}>
                <h4 className="skill-group-title">Tools & Testing</h4>
                <div className="job-tags">
                  {skills.tools.map(s => <span key={s} className="job-tag">{s}</span>)}
                </div>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="section-card">
            <div className="section-card-header">
              <h2 className="section-card-title"><GraduationCap size={18} /> Education</h2>
            </div>
            <div className="section-card-body">
              {education.map(edu => (
                <div key={edu.id} className="education-item">
                  <h3 className="education-degree">{edu.degree}</h3>
                  <p className="education-school">{edu.school}</p>
                  <p className="education-year">{edu.year}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications & Achievements */}
          <div className="section-card">
            <div className="section-card-header">
              <h2 className="section-card-title"><Award size={18} /> Certifications</h2>
            </div>
            <div className="section-card-body">
              {certifications.map(cert => (
                <div key={cert.id} className="certification-item" style={{ marginBottom: 'var(--space-3)' }}>
                  <h3 className="certification-name" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-primary)' }}>{cert.name}</h3>
                  <p className="certification-issuer" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{cert.issuer} • {cert.date}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Portfolio Links */}
          <div className="section-card">
            <div className="section-card-header">
              <h2 className="section-card-title"><LinkIcon size={18} /> Portfolio Links</h2>
            </div>
            <div className="section-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <a href={`https://${links.linkedin}`} className="portfolio-link-item">
                <Globe size={18} /> {links.linkedin}
              </a>
              <a href={`https://${links.github}`} className="portfolio-link-item">
                <Code size={18} /> {links.github}
              </a>
              <a href={`https://${links.portfolio}`} className="portfolio-link-item">
                <LinkIcon size={18} /> {links.portfolio}
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
