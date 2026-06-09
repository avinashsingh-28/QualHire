import { Routes, Route, Navigate } from 'react-router-dom';
import { Search, FileText, Calendar, Users, Briefcase, BookOpen, BarChart3, Shield, Settings } from 'lucide-react';

// Layouts
import PublicLayout    from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Landing             from './pages/Landing';
import Login, { ForgotPassword, ResetPassword } from './pages/Login';
import Signup              from './pages/Signup';
import CandidateDashboard  from './pages/candidate/CandidateDashboard';
import RecruiterDashboard  from './pages/recruiter/RecruiterDashboard';
import MentorDashboard     from './pages/mentor/MentorDashboard';
import AdminDashboard      from './pages/admin/AdminDashboard';
import ComingSoon          from './pages/ComingSoon';

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
      <Route path="jobs"         element={<ComingSoon icon={<Search size={32} />}    title="Find Jobs"         description="Browse thousands of curated job openings matched to your skills."      backPath="/candidate" backLabel="Back to Dashboard" />} />
      <Route path="applications" element={<ComingSoon icon={<FileText size={32} />}  title="My Applications"   description="Track all your job applications and their current status."             backPath="/candidate" backLabel="Back to Dashboard" />} />
      <Route path="interviews"   element={<ComingSoon icon={<Calendar size={32} />}  title="Interviews"        description="View and prepare for your upcoming interviews."                         backPath="/candidate" backLabel="Back to Dashboard" />} />
      <Route path="profile"      element={<ComingSoon icon={<Users size={32} />}     title="My Profile"        description="Build your standout candidate profile."                                 backPath="/candidate" backLabel="Back to Dashboard" />} />
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
      <Route path="jobs"        element={<ComingSoon icon={<Briefcase size={32} />}  title="Job Postings"      description="Create and manage your job postings."                                   backPath="/recruiter" backLabel="Back to Dashboard" />} />
      <Route path="candidates"  element={<ComingSoon icon={<Users size={32} />}      title="Candidate Pipeline"description="Review and manage all candidates in your hiring pipeline."              backPath="/recruiter" backLabel="Back to Dashboard" />} />
      <Route path="interviews"  element={<ComingSoon icon={<Calendar size={32} />}   title="Interviews"        description="Schedule and manage candidate interviews."                              backPath="/recruiter" backLabel="Back to Dashboard" />} />
      <Route path="messages"    element={<ComingSoon icon={<FileText size={32} />}   title="Messages"          description="Communicate with candidates and your hiring team."                      backPath="/recruiter" backLabel="Back to Dashboard" />} />
      <Route path="settings"    element={<ComingSoon icon={<Settings size={32} />}   title="Settings"          description="Configure your recruiter account settings."                            backPath="/recruiter" backLabel="Back to Dashboard" />} />
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
      <Route path="messages"   element={<ComingSoon icon={<FileText size={32} />}    title="Messages"          description="Chat with your mentees."                                               backPath="/mentor" backLabel="Back to Dashboard" />} />
      <Route path="settings"   element={<ComingSoon icon={<Settings size={32} />}    title="Settings"          description="Manage your mentor profile and preferences."                          backPath="/mentor" backLabel="Back to Dashboard" />} />
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
