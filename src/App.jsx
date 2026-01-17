import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import CreateProfile from './pages/CreateProfile'
import ImportProfile from './pages/ImportProfile'
import JobMatches from './pages/JobMatches'
import JobDetails from './pages/JobDetails'
import CombinedAuth from './pages/CombinedAuth'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import UserDashboard from './pages/UserDashboard'
import Onboarding from './pages/Onboarding'
import Assessment from './pages/Assessment'
import GoogleCallback from './pages/GoogleCallback'
import AnalysisStatus from './pages/AnalysisStatus'
import UploadResume from './pages/UploadResume'
import UploadVideo from './pages/UploadVideo'
import EmployerOnboarding from './pages/EmployerOnboarding'
import EmployerDashboard from './pages/EmployerDashboard'
import EmployerAuth from './pages/EmployerAuth'
import EmployerJobDetails from './pages/EmployerJobDetails'
import ProtectedRoute from './components/common/ProtectedRoute'
import PublicRoute from './components/common/PublicRoute'

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Navigate to="/signin" replace />} />
        <Route path="/signin" element={<PublicRoute><CombinedAuth /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><CombinedAuth /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />
            <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
            <Route path="/analysis/:id" element={<ProtectedRoute><AnalysisStatus /></ProtectedRoute>} />
            <Route path="/user-dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
        <Route path="/upload-resume" element={<ProtectedRoute><UploadResume /></ProtectedRoute>} />
        <Route path="/upload-video" element={<ProtectedRoute><UploadVideo /></ProtectedRoute>} />
        <Route path="/employer-onboarding" element={<ProtectedRoute><EmployerOnboarding /></ProtectedRoute>} />
        <Route path="/employer-dashboard" element={<ProtectedRoute><EmployerDashboard /></ProtectedRoute>} />
        <Route path="/employer-jobs/:jobId" element={<ProtectedRoute><EmployerJobDetails /></ProtectedRoute>} />
        <Route path="/employer-signin" element={<PublicRoute><EmployerAuth /></PublicRoute>} />
        <Route path="/employer-signup" element={<PublicRoute><EmployerAuth /></PublicRoute>} />
        <Route path="/assessments/:id?" element={<ProtectedRoute><Assessment /></ProtectedRoute>} />
        <Route path="/create-profile" element={<ProtectedRoute><CreateProfile /></ProtectedRoute>} />
        <Route path="/import-profile" element={<ProtectedRoute><ImportProfile /></ProtectedRoute>} />
        <Route path="/job-matches" element={<ProtectedRoute><JobMatches /></ProtectedRoute>} />
        <Route path="/job-details/:jobId" element={<ProtectedRoute><JobDetails /></ProtectedRoute>} />
      </Routes>
    </Router>
  )
}

export default App
