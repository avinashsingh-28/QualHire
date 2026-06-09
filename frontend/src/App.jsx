import { Routes, Route, Navigate } from 'react-router-dom';
import { Search, FileText, Calendar, Users, Briefcase, BookOpen, BarChart3, Shield, Settings, MessageSquare, Bell, ClipboardList } from 'lucide-react';

// Layouts
import PublicLayout    from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Landing             from './pages/Landing';
import Login, { ForgotPassword, ResetPassword } from './pages/Login';
import Signup              from './pages/Signup';
import CandidateDashboard  from './pages/candidate/CandidateDashboard';
import CandidateProfile    from './pages/candidate/CandidateProfile';
import CandidateResume     from './pages/candidate/CandidateResume';
import CandidateApplications from './pages/candidate/CandidateApplications';
import RecruiterDashboard  from './pages/recruiter/RecruiterDashboard';
import RecruiterJobs       from './pages/recruiter/RecruiterJobs';
import RecruiterApplicants from './pages/recruiter/RecruiterApplicants';
import MentorDashboard     from './pages/mentor/MentorDashboard';
import AdminDashboard      from './pages/admin/AdminDashboard';
import ComingSoon          from './pages/ComingSoon';
import Messages            from './pages/Messages';
import CandidateAssessments from './pages/candidate/CandidateAssessments';
import CodingAssessment     from './pages/candidate/CodingAssessment';
import ResumeAnalysis       from './pages/candidate/ResumeAnalysis';
import Notifications        from './pages/Notifications';

// Auth guard
import useAuth from './hooks/useAuth';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRole && role !== allowedRole) return <Navigate to={`/${role}`} replace />;
  return children;
};

const App = () => (
  <Routes>
    {/* ---- Public ---- */}
    <Route element={<PublicLayout />}>
      <Route index element={<Landing />} />
      <Route path="login"  element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="reset-password"  element={<ResetPassword />} />
    </Route>

    {/* ---- Candidate Dashboard ---- */}
    <Route
      path="candidate"
      element={
        <ProtectedRoute allowedRole="candidate">
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<CandidateDashboard />} />
      <Route path="profile"      element={<CandidateProfile />} />
      <Route path="resume"       element={<CandidateResume />} />
      <Route path="resume/:id/analysis" element={<ResumeAnalysis />} />
      <Route path="jobs"         element={<ComingSoon icon={<Search size={32} />}    title="Find Jobs"         description="Browse thousands of curated job openings matched to your skills."      backPath="/candidate" backLabel="Back to Dashboard" />} />
      <Route path="applications" element={<CandidateApplications />} />
      <Route path="assessments"  element={<CandidateAssessments />} />
      <Route path="assessments/coding/:id" element={<CodingAssessment />} />
      <Route path="messages"     element={<Messages />} />
      <Route path="mentorship"   element={<ComingSoon icon={<BookOpen size={32} />}  title="Mentorship"        description="Find and connect with industry mentors."                                backPath="/candidate" backLabel="Back to Dashboard" />} />
      <Route path="notifications" element={<Notifications />} />
      <Route path="settings"     element={<ComingSoon icon={<Settings size={32} />}  title="Settings"          description="Manage your account and notification preferences."                      backPath="/candidate" backLabel="Back to Dashboard" />} />
    </Route>

    {/* ---- Recruiter Dashboard ---- */}
    <Route
      path="recruiter"
      element={
        <ProtectedRoute allowedRole="recruiter">
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<RecruiterDashboard />} />
      <Route path="jobs"        element={<RecruiterJobs />} />
      <Route path="applicants"  element={<RecruiterApplicants />} />
      <Route path="interviews"  element={<ComingSoon icon={<Calendar size={32} />}   title="Interviews"        description="Schedule and manage candidate interviews."                              backPath="/recruiter" backLabel="Back to Dashboard" />} />
      <Route path="assessments" element={<ComingSoon icon={<ClipboardList size={32} />} title="Assessments"     description="Manage technical assessments and reviews."                              backPath="/recruiter" backLabel="Back to Dashboard" />} />
      <Route path="messages"    element={<Messages />} />
      <Route path="analytics"   element={<ComingSoon icon={<BarChart3 size={32} />}   title="Analytics"         description="Deep dive into hiring metrics and funnel."                              backPath="/recruiter" backLabel="Back to Dashboard" />} />
      <Route path="settings"    element={<ComingSoon icon={<Settings size={32} />}   title="Settings"          description="Configure your recruiter account settings."                            backPath="/recruiter" backLabel="Back to Dashboard" />} />
      <Route path="notifications" element={<Notifications />} />
    </Route>

    {/* ---- Mentor Dashboard ---- */}
    <Route
      path="mentor"
      element={
        <ProtectedRoute allowedRole="mentor">
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<MentorDashboard />} />
      <Route path="sessions"   element={<ComingSoon icon={<BookOpen size={32} />}    title="Sessions"          description="Manage and schedule your mentoring sessions."                          backPath="/mentor" backLabel="Back to Dashboard" />} />
      <Route path="candidates" element={<ComingSoon icon={<Users size={32} />}       title="My Mentees"        description="Track your mentees' progress and goals."                               backPath="/mentor" backLabel="Back to Dashboard" />} />
      <Route path="reviews"    element={<ComingSoon icon={<BarChart3 size={32} />}   title="Reviews"           description="See feedback from your mentees."                                       backPath="/mentor" backLabel="Back to Dashboard" />} />
      <Route path="messages"   element={<Messages />} />
      <Route path="settings"   element={<ComingSoon icon={<Settings size={32} />}    title="Settings"          description="Manage your mentor profile and availability."                          backPath="/mentor" backLabel="Back to Dashboard" />} />
      <Route path="notifications" element={<Notifications />} />
    </Route>

    {/* ---- Admin Dashboard ---- */}
    <Route
      path="admin"
      element={
        <ProtectedRoute allowedRole="admin">
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<AdminDashboard />} />
      <Route path="users"      element={<ComingSoon icon={<Users size={32} />}       title="User Management"   description="View, manage, and moderate platform users."                            backPath="/admin" backLabel="Back to Dashboard" />} />
      <Route path="jobs"       element={<ComingSoon icon={<Briefcase size={32} />}   title="Job Oversight"     description="Review and moderate all active job postings."                          backPath="/admin" backLabel="Back to Dashboard" />} />
      <Route path="analytics"  element={<ComingSoon icon={<BarChart3 size={32} />}   title="Analytics"         description="Deep dive into platform metrics and trends."                           backPath="/admin" backLabel="Back to Dashboard" />} />
      <Route path="moderation" element={<ComingSoon icon={<Shield size={32} />}      title="Moderation"        description="Handle reports, flags, and community standards."                       backPath="/admin" backLabel="Back to Dashboard" />} />
      <Route path="settings"   element={<ComingSoon icon={<Settings size={32} />}    title="Admin Settings"    description="Configure platform-wide settings."                                    backPath="/admin" backLabel="Back to Dashboard" />} />
    </Route>

    {/* ---- Fallback ---- */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
