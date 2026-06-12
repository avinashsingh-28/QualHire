import { useState, useEffect, useRef } from 'react';
import { 
  User, Briefcase, GraduationCap, Award, Link as LinkIcon, 
  MapPin, Mail, Phone, Code, Globe, ExternalLink,
  Edit3, Trash2, Plus, CheckCircle, Camera
} from 'lucide-react';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import useAuth from '../../hooks/useAuth';
import api from '../../services/api';
import './Dashboard.css';

const BLANK_PROFILE = {
  personal: {
    name: '',
    title: '',
    location: '',
    email: '',
    phone: '',
    summary: '',
    avatar: '',
  },
  skills: {
    core: [],
    ui: [],
    tools: []
  },
  experience: [],
  education: [],
  projects: [],
  certifications: [],
  links: {
    github: '',
    linkedin: '',
    portfolio: ''
  }
};

const CandidateProfile = () => {
  const { user, updateUser } = useAuth();
  const userProfileKey = `qh_profile_${user?.id}`;

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleShareProfile = () => {
    const profileUrl = `${window.location.origin}/candidate/profile?id=${user?.id}`;
    navigator.clipboard.writeText(profileUrl)
      .then(() => {
        setToastMessage('Profile link copied to clipboard!');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      })
      .catch((err) => {
        console.error('Could not copy text: ', err);
        alert(`Profile Link: ${profileUrl}`);
      });
  };

  const avatarInputRef = useRef(null);

  const triggerAvatarUpload = () => {
    avatarInputRef.current.click();
  };

  const handleAvatarFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.upload('/chat/upload', formData);
      const fileUrl = response.fileUrl;
      const updatedProfile = {
        ...profileData,
        personal: {
          ...profileData.personal,
          avatar: fileUrl
        }
      };
      setProfileData(updatedProfile);
      localStorage.setItem(userProfileKey, JSON.stringify(updatedProfile));
      updateUser({ avatar: fileUrl });
      
      setToastMessage('Profile picture updated successfully!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error('Failed to upload avatar', err);
      alert('Failed to upload profile picture. Please try again.');
    }
  };

  const [profileData, setProfileData] = useState(() => {
    try {
      const saved = localStorage.getItem(userProfileKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    
    return {
      ...BLANK_PROFILE,
      personal: {
        ...BLANK_PROFILE.personal,
        name: user?.name || '',
        email: user?.email || '',
        title: user?.title || 'Software Engineer',
        location: user?.location || 'Remote',
        summary: '',
        avatar: user?.avatar || ''
      }
    };
  });

  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        personal: {
          ...prev.personal,
          name: user.name || prev.personal.name,
          email: user.email || prev.personal.email,
          title: user.title || prev.personal.title,
          location: user.location || prev.personal.location,
          avatar: user.avatar || prev.personal.avatar
        }
      }));
    }
  }, [user]);

  // Modal & Edit states
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [personalForm, setPersonalForm] = useState({
    name: '',
    title: '',
    location: '',
    phone: '',
    email: '',
    summary: ''
  });

  const [expModalOpen, setExpModalOpen] = useState(false);
  const [editingExpItem, setEditingExpItem] = useState(null);
  const [expForm, setExpForm] = useState({ role: '', company: '', duration: '', description: '' });

  const [projModalOpen, setProjModalOpen] = useState(false);
  const [editingProjItem, setEditingProjItem] = useState(null);
  const [projForm, setProjForm] = useState({ name: '', description: '', link: '' });

  const [eduModalOpen, setEduModalOpen] = useState(false);
  const [editingEduItem, setEditingEduItem] = useState(null);
  const [eduForm, setEduForm] = useState({ degree: '', school: '', year: '' });

  const [certModalOpen, setCertModalOpen] = useState(false);
  const [editingCertItem, setEditingCertItem] = useState(null);
  const [certForm, setCertForm] = useState({ name: '', issuer: '', date: '' });

  const [skillsModalOpen, setSkillsModalOpen] = useState(false);
  const [skillsForm, setSkillsForm] = useState({ core: '', ui: '', tools: '' });

  const [linksModalOpen, setLinksModalOpen] = useState(false);
  const [linksForm, setLinksForm] = useState({ linkedin: '', github: '', portfolio: '' });

  // 1. Personal Information Handlers
  const handleEditPersonal = () => {
    setPersonalForm({
      name: profileData.personal.name,
      title: profileData.personal.title,
      location: profileData.personal.location,
      phone: profileData.personal.phone || '',
      email: profileData.personal.email,
      summary: profileData.personal.summary || ''
    });
    setIsEditingPersonal(true);
  };

  const handleSavePersonal = (e) => {
    e.preventDefault();
    const updatedPersonal = {
      ...profileData.personal,
      name: personalForm.name,
      title: personalForm.title,
      location: personalForm.location,
      phone: personalForm.phone,
      email: personalForm.email,
      summary: personalForm.summary
    };
    const updatedProfile = { ...profileData, personal: updatedPersonal };
    setProfileData(updatedProfile);
    localStorage.setItem(userProfileKey, JSON.stringify(updatedProfile));
    
    updateUser({
      name: personalForm.name,
      title: personalForm.title,
      location: personalForm.location,
      email: personalForm.email
    });
    
    setIsEditingPersonal(false);
  };

  // 2. Experience Handlers
  const handleAddExp = () => {
    setEditingExpItem(null);
    setExpForm({ role: '', company: '', duration: '', description: '' });
    setExpModalOpen(true);
  };

  const handleEditExp = (item) => {
    setEditingExpItem(item);
    setExpForm({
      role: item.role,
      company: item.company,
      duration: item.duration,
      description: item.description || ''
    });
    setExpModalOpen(true);
  };

  const handleSaveExp = (e) => {
    e.preventDefault();
    let updatedExp;
    if (editingExpItem) {
      updatedExp = profileData.experience.map(item =>
        item.id === editingExpItem.id ? { ...item, ...expForm } : item
      );
    } else {
      updatedExp = [
        ...profileData.experience,
        { id: Date.now(), ...expForm }
      ];
    }
    const updatedProfile = { ...profileData, experience: updatedExp };
    setProfileData(updatedProfile);
    localStorage.setItem(userProfileKey, JSON.stringify(updatedProfile));
    setExpModalOpen(false);
  };

  const handleDeleteExp = (id) => {
    const updatedExp = profileData.experience.filter(item => item.id !== id);
    const updatedProfile = { ...profileData, experience: updatedExp };
    setProfileData(updatedProfile);
    localStorage.setItem(userProfileKey, JSON.stringify(updatedProfile));
  };

  // 3. Projects Handlers
  const handleAddProj = () => {
    setEditingProjItem(null);
    setProjForm({ name: '', description: '', link: '' });
    setProjModalOpen(true);
  };

  const handleEditProj = (item) => {
    setEditingProjItem(item);
    setProjForm({
      name: item.name,
      description: item.description,
      link: item.link || ''
    });
    setProjModalOpen(true);
  };

  const handleSaveProj = (e) => {
    e.preventDefault();
    let updatedProj;
    if (editingProjItem) {
      updatedProj = profileData.projects.map(item =>
        item.id === editingProjItem.id ? { ...item, ...projForm } : item
      );
    } else {
      updatedProj = [
        ...profileData.projects,
        { id: Date.now(), ...projForm }
      ];
    }
    const updatedProfile = { ...profileData, projects: updatedProj };
    setProfileData(updatedProfile);
    localStorage.setItem(userProfileKey, JSON.stringify(updatedProfile));
    setProjModalOpen(false);
  };

  const handleDeleteProj = (id) => {
    const updatedProj = profileData.projects.filter(item => item.id !== id);
    const updatedProfile = { ...profileData, projects: updatedProj };
    setProfileData(updatedProfile);
    localStorage.setItem(userProfileKey, JSON.stringify(updatedProfile));
  };

  // 4. Education Handlers
  const handleAddEdu = () => {
    setEditingEduItem(null);
    setEduForm({ degree: '', school: '', year: '' });
    setEduModalOpen(true);
  };

  const handleEditEdu = (item) => {
    setEditingEduItem(item);
    setEduForm({
      degree: item.degree,
      school: item.school,
      year: item.year
    });
    setEduModalOpen(true);
  };

  const handleSaveEdu = (e) => {
    e.preventDefault();
    let updatedEdu;
    if (editingEduItem) {
      updatedEdu = profileData.education.map(item =>
        item.id === editingEduItem.id ? { ...item, ...eduForm } : item
      );
    } else {
      updatedEdu = [
        ...profileData.education,
        { id: Date.now(), ...eduForm }
      ];
    }
    const updatedProfile = { ...profileData, education: updatedEdu };
    setProfileData(updatedProfile);
    localStorage.setItem(userProfileKey, JSON.stringify(updatedProfile));
    setEduModalOpen(false);
  };

  const handleDeleteEdu = (id) => {
    const updatedEdu = profileData.education.filter(item => item.id !== id);
    const updatedProfile = { ...profileData, education: updatedEdu };
    setProfileData(updatedProfile);
    localStorage.setItem(userProfileKey, JSON.stringify(updatedProfile));
  };

  // 5. Certifications Handlers
  const handleAddCert = () => {
    setEditingCertItem(null);
    setCertForm({ name: '', issuer: '', date: '' });
    setCertModalOpen(true);
  };

  const handleEditCert = (item) => {
    setEditingCertItem(item);
    setCertForm({
      name: item.name,
      issuer: item.issuer,
      date: item.date
    });
    setCertModalOpen(true);
  };

  const handleSaveCert = (e) => {
    e.preventDefault();
    let updatedCert;
    if (editingCertItem) {
      updatedCert = profileData.certifications.map(item =>
        item.id === editingCertItem.id ? { ...item, ...certForm } : item
      );
    } else {
      updatedCert = [
        ...profileData.certifications,
        { id: Date.now(), ...certForm }
      ];
    }
    const updatedProfile = { ...profileData, certifications: updatedCert };
    setProfileData(updatedProfile);
    localStorage.setItem(userProfileKey, JSON.stringify(updatedProfile));
    setCertModalOpen(false);
  };

  const handleDeleteCert = (id) => {
    const updatedCert = profileData.certifications.filter(item => item.id !== id);
    const updatedProfile = { ...profileData, certifications: updatedCert };
    setProfileData(updatedProfile);
    localStorage.setItem(userProfileKey, JSON.stringify(updatedProfile));
  };

  // 6. Skills Handlers
  const handleEditSkills = () => {
    setSkillsForm({
      core: (profileData.skills?.core || []).join(', '),
      ui: (profileData.skills?.ui || []).join(', '),
      tools: (profileData.skills?.tools || []).join(', ')
    });
    setSkillsModalOpen(true);
  };

  const handleSaveSkills = (e) => {
    e.preventDefault();
    const splitAndClean = (str) => str ? str.split(',').map(s => s.trim()).filter(Boolean) : [];
    const updatedSkills = {
      core: splitAndClean(skillsForm.core),
      ui: splitAndClean(skillsForm.ui),
      tools: splitAndClean(skillsForm.tools)
    };
    const updatedProfile = { ...profileData, skills: updatedSkills };
    setProfileData(updatedProfile);
    localStorage.setItem(userProfileKey, JSON.stringify(updatedProfile));
    setSkillsModalOpen(false);
  };

  // 7. Links Handlers
  const handleEditLinks = () => {
    setLinksForm({
      linkedin: profileData.links?.linkedin || '',
      github: profileData.links?.github || '',
      portfolio: profileData.links?.portfolio || ''
    });
    setLinksModalOpen(true);
  };

  const handleSaveLinks = (e) => {
    e.preventDefault();
    const updatedProfile = { ...profileData, links: linksForm };
    setProfileData(updatedProfile);
    localStorage.setItem(userProfileKey, JSON.stringify(updatedProfile));
    setLinksModalOpen(false);
  };

  const { personal, skills, experience, education, projects, certifications, links } = profileData;

  return (
    <div className="dashboard-page profile-animate-fade-in">
      {/* Profile Header Banner */}
      <div className="profile-banner profile-animate-slide-up">
        <div className="profile-banner-info">
          <div className="profile-avatar-large" onClick={triggerAvatarUpload} style={{ cursor: 'pointer' }}>
            {personal.avatar ? (
              <img 
                src={personal.avatar.startsWith('http') ? personal.avatar : `http://localhost:8080${personal.avatar}`} 
                alt="Avatar" 
                className="profile-avatar-image" 
              />
            ) : (
              personal.name ? personal.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U'
            )}
            <div className="profile-avatar-hover-overlay">
              <Camera size={20} />
            </div>
            <input 
              type="file" 
              ref={avatarInputRef} 
              onChange={handleAvatarFileChange} 
              accept="image/*" 
              style={{ display: 'none' }} 
            />
          </div>
          <div>
            <h1 className="profile-name">{personal.name || 'Candidate Name'}</h1>
            <p className="profile-title">{personal.title || 'Software Engineer'}</p>
            <div className="profile-meta">
              <span><MapPin size={14} /> {personal.location || 'Remote'}</span>
              <span><Mail size={14} /> {personal.email || 'No email specified'}</span>
              {personal.phone && <span><Phone size={14} /> {personal.phone}</span>}
            </div>
          </div>
        </div>
        <div className="profile-banner-actions">
          <Button variant="secondary" leftIcon={<Edit3 size={16} />} onClick={handleEditPersonal}>Edit Profile</Button>
          <Button onClick={handleShareProfile}>Share Profile</Button>
        </div>
      </div>

      <div className="dashboard-grid-3">
        {/* Left Column */}
        <div className="profile-animate-slide-up profile-delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          
          {/* About */}
          <div className="section-card profile-page-grid-card">
            <div className="section-card-header">
              <h2 className="section-card-title"><User size={18} /> About</h2>
              <Button size="sm" variant="ghost" onClick={handleEditPersonal}>Edit About</Button>
            </div>
            <div className="section-card-body">
              {personal.summary ? (
                <p className="profile-summary">{personal.summary}</p>
              ) : (
                <div className="empty-placeholder-card">
                  <User size={24} className="empty-placeholder-icon" />
                  <p className="empty-placeholder-text">No summary added yet.</p>
                  <Button variant="ghost" size="sm" onClick={handleEditPersonal}>Add Summary</Button>
                </div>
              )}
            </div>
          </div>

          {/* Experience */}
          <div className="section-card profile-page-grid-card">
            <div className="section-card-header">
              <h2 className="section-card-title"><Briefcase size={18} /> Experience</h2>
              <Button size="sm" variant="ghost" onClick={handleAddExp} leftIcon={<Plus size={14} />}>Add</Button>
            </div>
            <div className="section-card-body">
              {!experience || experience.length === 0 ? (
                <div className="empty-placeholder-card">
                  <Briefcase size={24} className="empty-placeholder-icon" />
                  <p className="empty-placeholder-text">No work experience added yet.</p>
                  <Button variant="ghost" size="sm" onClick={handleAddExp}>Add Experience</Button>
                </div>
              ) : (
                <div className="timeline">
                  {experience.map(exp => (
                    <div key={exp.id} className="timeline-item">
                      <div className="timeline-dot" />
                      <div className="timeline-content" style={{ position: 'relative', paddingRight: '60px' }}>
                        <div style={{ position: 'absolute', top: 0, right: 0, display: 'flex', gap: '8px' }}>
                          <button onClick={() => handleEditExp(exp)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-tertiary)' }} title="Edit"><Edit3 size={14} /></button>
                          <button onClick={() => handleDeleteExp(exp.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-tertiary)' }} title="Delete"><Trash2 size={14} /></button>
                        </div>
                        <h3 className="timeline-title">{exp.role}</h3>
                        <p className="timeline-subtitle">{exp.company} <span className="timeline-date">• {exp.duration}</span></p>
                        {exp.description && <p className="timeline-desc">{exp.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Projects */}
          <div className="section-card profile-page-grid-card">
            <div className="section-card-header">
              <h2 className="section-card-title"><Code size={18} /> Featured Projects</h2>
              <Button size="sm" variant="ghost" onClick={handleAddProj} leftIcon={<Plus size={14} />}>Add</Button>
            </div>
            <div className="section-card-body">
              {!projects || projects.length === 0 ? (
                <div className="empty-placeholder-card">
                  <Code size={24} className="empty-placeholder-icon" />
                  <p className="empty-placeholder-text">No featured projects listed yet.</p>
                  <Button variant="ghost" size="sm" onClick={handleAddProj}>Add Project</Button>
                </div>
              ) : (
                <div className="project-grid">
                  {projects.map(proj => (
                    <div key={proj.id} className="project-card" style={{ position: 'relative', paddingRight: '60px' }}>
                      <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleEditProj(proj)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-tertiary)' }} title="Edit"><Edit3 size={14} /></button>
                        <button onClick={() => handleDeleteProj(proj.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-tertiary)' }} title="Delete"><Trash2 size={14} /></button>
                      </div>
                      <h3 className="project-title">{proj.name}</h3>
                      <p className="project-desc">{proj.description}</p>
                      {proj.link && (
                        <a href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} target="_blank" rel="noreferrer" className="project-link">
                          <ExternalLink size={14} /> {proj.link}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="profile-animate-slide-up profile-delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          
          {/* Skills */}
          <div className="section-card profile-page-grid-card">
            <div className="section-card-header">
              <h2 className="section-card-title"><Award size={18} /> Skills</h2>
              <Button size="sm" variant="ghost" onClick={handleEditSkills}>Edit</Button>
            </div>
            <div className="section-card-body">
              {(!skills || (!skills.core?.length && !skills.ui?.length && !skills.tools?.length)) ? (
                <div className="empty-placeholder-card">
                  <Award size={24} className="empty-placeholder-icon" />
                  <p className="empty-placeholder-text">No skills added yet.</p>
                  <Button variant="ghost" size="sm" onClick={handleEditSkills}>Add Skills</Button>
                </div>
              ) : (
                <>
                  {skills.core && skills.core.length > 0 && (
                    <div className="skill-group">
                      <h4 className="skill-group-title">Core Technologies</h4>
                      <div className="job-tags">
                        {skills.core.map(s => <span key={s} className="job-tag">{s}</span>)}
                      </div>
                    </div>
                  )}
                  {skills.ui && skills.ui.length > 0 && (
                    <div className="skill-group" style={{ marginTop: 'var(--space-4)' }}>
                      <h4 className="skill-group-title">UI & Design</h4>
                      <div className="job-tags">
                        {skills.ui.map(s => <span key={s} className="job-tag">{s}</span>)}
                      </div>
                    </div>
                  )}
                  {skills.tools && skills.tools.length > 0 && (
                    <div className="skill-group" style={{ marginTop: 'var(--space-4)' }}>
                      <h4 className="skill-group-title">Tools & Testing</h4>
                      <div className="job-tags">
                        {skills.tools.map(s => <span key={s} className="job-tag">{s}</span>)}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Education */}
          <div className="section-card profile-page-grid-card">
            <div className="section-card-header">
              <h2 className="section-card-title"><GraduationCap size={18} /> Education</h2>
              <Button size="sm" variant="ghost" onClick={handleAddEdu} leftIcon={<Plus size={14} />}>Add</Button>
            </div>
            <div className="section-card-body">
              {!education || education.length === 0 ? (
                <div className="empty-placeholder-card">
                  <GraduationCap size={24} className="empty-placeholder-icon" />
                  <p className="empty-placeholder-text">No education details added yet.</p>
                  <Button variant="ghost" size="sm" onClick={handleAddEdu}>Add Education</Button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  {education.map(edu => (
                    <div key={edu.id} className="education-item" style={{ position: 'relative', paddingRight: '60px' }}>
                      <div style={{ position: 'absolute', top: 0, right: 0, display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleEditEdu(edu)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-tertiary)' }} title="Edit"><Edit3 size={14} /></button>
                        <button onClick={() => handleDeleteEdu(edu.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-tertiary)' }} title="Delete"><Trash2 size={14} /></button>
                      </div>
                      <h3 className="education-degree">{edu.degree}</h3>
                      <p className="education-school">{edu.school}</p>
                      <p className="education-year">{edu.year}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Certifications & Achievements */}
          <div className="section-card profile-page-grid-card">
            <div className="section-card-header">
              <h2 className="section-card-title"><Award size={18} /> Certifications</h2>
              <Button size="sm" variant="ghost" onClick={handleAddCert} leftIcon={<Plus size={14} />}>Add</Button>
            </div>
            <div className="section-card-body">
              {!certifications || certifications.length === 0 ? (
                <div className="empty-placeholder-card">
                  <Award size={24} className="empty-placeholder-icon" />
                  <p className="empty-placeholder-text">No certifications listed yet.</p>
                  <Button variant="ghost" size="sm" onClick={handleAddCert}>Add Certification</Button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {certifications.map(cert => (
                    <div key={cert.id} className="certification-item" style={{ position: 'relative', paddingRight: '60px' }}>
                      <div style={{ position: 'absolute', top: 0, right: 0, display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleEditCert(cert)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-tertiary)' }} title="Edit"><Edit3 size={14} /></button>
                        <button onClick={() => handleDeleteCert(cert.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-tertiary)' }} title="Delete"><Trash2 size={14} /></button>
                      </div>
                      <h3 className="certification-name" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-primary)' }}>{cert.name}</h3>
                      <p className="certification-issuer" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{cert.issuer} • {cert.date}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Portfolio Links */}
          <div className="section-card profile-page-grid-card">
            <div className="section-card-header">
              <h2 className="section-card-title"><LinkIcon size={18} /> Portfolio Links</h2>
              <Button size="sm" variant="ghost" onClick={handleEditLinks}>Edit</Button>
            </div>
            <div className="section-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {(!links || (!links.linkedin && !links.github && !links.portfolio)) ? (
                <div className="empty-placeholder-card">
                  <LinkIcon size={24} className="empty-placeholder-icon" />
                  <p className="empty-placeholder-text">No portfolio links added yet.</p>
                  <Button variant="ghost" size="sm" onClick={handleEditLinks}>Add Links</Button>
                </div>
              ) : (
                <>
                  {links.linkedin && (
                    <a href={links.linkedin.startsWith('http') ? links.linkedin : `https://${links.linkedin}`} target="_blank" rel="noreferrer" className="portfolio-link-item">
                      <Globe size={18} /> {links.linkedin}
                    </a>
                  )}
                  {links.github && (
                    <a href={links.github.startsWith('http') ? links.github : `https://${links.github}`} target="_blank" rel="noreferrer" className="portfolio-link-item">
                      <Code size={18} /> {links.github}
                    </a>
                  )}
                  {links.portfolio && (
                    <a href={links.portfolio.startsWith('http') ? links.portfolio : `https://${links.portfolio}`} target="_blank" rel="noreferrer" className="portfolio-link-item">
                      <LinkIcon size={18} /> {links.portfolio}
                    </a>
                  )}
                </>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* 1. Edit Personal Info Modal */}
      <Modal
        isOpen={isEditingPersonal}
        onClose={() => setIsEditingPersonal(false)}
        title="Edit Personal Information"
        size="md"
      >
        <form onSubmit={handleSavePersonal} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input 
            label="Full Name"
            type="text"
            required
            value={personalForm.name}
            onChange={e => setPersonalForm({ ...personalForm, name: e.target.value })}
          />
          <Input 
            label="Professional Title"
            type="text"
            required
            value={personalForm.title}
            onChange={e => setPersonalForm({ ...personalForm, title: e.target.value })}
          />
          <Input 
            label="Location"
            type="text"
            required
            value={personalForm.location}
            onChange={e => setPersonalForm({ ...personalForm, location: e.target.value })}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Input 
              label="Email Address"
              type="email"
              required
              value={personalForm.email}
              onChange={e => setPersonalForm({ ...personalForm, email: e.target.value })}
            />
            <Input 
              label="Phone Number"
              type="text"
              value={personalForm.phone}
              onChange={e => setPersonalForm({ ...personalForm, phone: e.target.value })}
            />
          </div>
          <Input 
            label="Summary"
            as="textarea"
            rows={4}
            value={personalForm.summary}
            onChange={e => setPersonalForm({ ...personalForm, summary: e.target.value })}
          />
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
            <Button variant="ghost" type="button" onClick={() => setIsEditingPersonal(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Save Changes</Button>
          </div>
        </form>
      </Modal>

      {/* 2. Experience Modal */}
      <Modal
        isOpen={expModalOpen}
        onClose={() => setExpModalOpen(false)}
        title={editingExpItem ? "Edit Experience" : "Add Experience"}
        size="md"
      >
        <form onSubmit={handleSaveExp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input 
            label="Role / Position"
            type="text"
            required
            value={expForm.role}
            onChange={e => setExpForm({ ...expForm, role: e.target.value })}
          />
          <Input 
            label="Company"
            type="text"
            required
            value={expForm.company}
            onChange={e => setExpForm({ ...expForm, company: e.target.value })}
          />
          <Input 
            label="Duration (e.g. Jan 2021 – Present)"
            type="text"
            required
            value={expForm.duration}
            onChange={e => setExpForm({ ...expForm, duration: e.target.value })}
          />
          <Input 
            label="Description"
            as="textarea"
            rows={4}
            value={expForm.description}
            onChange={e => setExpForm({ ...expForm, description: e.target.value })}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
            <Button variant="ghost" type="button" onClick={() => setExpModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Save</Button>
          </div>
        </form>
      </Modal>

      {/* 3. Project Modal */}
      <Modal
        isOpen={projModalOpen}
        onClose={() => setProjModalOpen(false)}
        title={editingProjItem ? "Edit Project" : "Add Project"}
        size="md"
      >
        <form onSubmit={handleSaveProj} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input 
            label="Project Name"
            type="text"
            required
            value={projForm.name}
            onChange={e => setProjForm({ ...projForm, name: e.target.value })}
          />
          <Input 
            label="Description"
            as="textarea"
            rows={3}
            required
            value={projForm.description}
            onChange={e => setProjForm({ ...projForm, description: e.target.value })}
          />
          <Input 
            label="Project Link (e.g. github.com/username/project)"
            type="text"
            value={projForm.link}
            onChange={e => setProjForm({ ...projForm, link: e.target.value })}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
            <Button variant="ghost" type="button" onClick={() => setProjModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Save</Button>
          </div>
        </form>
      </Modal>

      {/* 4. Education Modal */}
      <Modal
        isOpen={eduModalOpen}
        onClose={() => setEduModalOpen(false)}
        title={editingEduItem ? "Edit Education" : "Add Education"}
        size="md"
      >
        <form onSubmit={handleSaveEdu} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input 
            label="Degree / Program"
            type="text"
            required
            value={eduForm.degree}
            onChange={e => setEduForm({ ...eduForm, degree: e.target.value })}
          />
          <Input 
            label="School / University"
            type="text"
            required
            value={eduForm.school}
            onChange={e => setEduForm({ ...eduForm, school: e.target.value })}
          />
          <Input 
            label="Year Range (e.g. 2018 – 2022)"
            type="text"
            required
            value={eduForm.year}
            onChange={e => setEduForm({ ...eduForm, year: e.target.value })}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
            <Button variant="ghost" type="button" onClick={() => setEduModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Save</Button>
          </div>
        </form>
      </Modal>

      {/* 5. Certification Modal */}
      <Modal
        isOpen={certModalOpen}
        onClose={() => setCertModalOpen(false)}
        title={editingCertItem ? "Edit Certification" : "Add Certification"}
        size="md"
      >
        <form onSubmit={handleSaveCert} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input 
            label="Certification Name"
            type="text"
            required
            value={certForm.name}
            onChange={e => setCertForm({ ...certForm, name: e.target.value })}
          />
          <Input 
            label="Issuing Organization"
            type="text"
            required
            value={certForm.issuer}
            onChange={e => setCertForm({ ...certForm, issuer: e.target.value })}
          />
          <Input 
            label="Date / Year"
            type="text"
            required
            value={certForm.date}
            onChange={e => setCertForm({ ...certForm, date: e.target.value })}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
            <Button variant="ghost" type="button" onClick={() => setCertModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Save</Button>
          </div>
        </form>
      </Modal>

      {/* 6. Skills Modal */}
      <Modal
        isOpen={skillsModalOpen}
        onClose={() => setSkillsModalOpen(false)}
        title="Edit Skills"
        size="md"
      >
        <form onSubmit={handleSaveSkills} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input 
            label="Core Technologies (comma-separated)"
            type="text"
            helperText="e.g. React, TypeScript, Node.js"
            value={skillsForm.core}
            onChange={e => setSkillsForm({ ...skillsForm, core: e.target.value })}
          />
          <Input 
            label="UI & Design (comma-separated)"
            type="text"
            helperText="e.g. Tailwind CSS, CSS Grid, Figma"
            value={skillsForm.ui}
            onChange={e => setSkillsForm({ ...skillsForm, ui: e.target.value })}
          />
          <Input 
            label="Tools & Testing (comma-separated)"
            type="text"
            helperText="e.g. Git, Jest, Webpack"
            value={skillsForm.tools}
            onChange={e => setSkillsForm({ ...skillsForm, tools: e.target.value })}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
            <Button variant="ghost" type="button" onClick={() => setSkillsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Save</Button>
          </div>
        </form>
      </Modal>

      {/* 7. Links Modal */}
      <Modal
        isOpen={linksModalOpen}
        onClose={() => setLinksModalOpen(false)}
        title="Edit Portfolio Links"
        size="md"
      >
        <form onSubmit={handleSaveLinks} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input 
            label="LinkedIn URL"
            type="text"
            placeholder="linkedin.com/in/username"
            value={linksForm.linkedin}
            onChange={e => setLinksForm({ ...linksForm, linkedin: e.target.value })}
          />
          <Input 
            label="GitHub URL"
            type="text"
            placeholder="github.com/username"
            value={linksForm.github}
            onChange={e => setLinksForm({ ...linksForm, github: e.target.value })}
          />
          <Input 
            label="Portfolio Website URL"
            type="text"
            placeholder="myportfolio.com"
            value={linksForm.portfolio}
            onChange={e => setLinksForm({ ...linksForm, portfolio: e.target.value })}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
            <Button variant="ghost" type="button" onClick={() => setLinksModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Save</Button>
          </div>
        </form>
      </Modal>

      {showToast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'var(--color-success)',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: '8px',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 1000,
          fontWeight: 'var(--font-semibold)',
          fontSize: 'var(--text-sm)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'fadeInUp 0.3s ease-out'
        }}>
          <CheckCircle size={16} />
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default CandidateProfile;
