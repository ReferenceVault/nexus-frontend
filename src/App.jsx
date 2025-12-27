import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import CreateProfile from './pages/CreateProfile'
import ImportProfile from './pages/ImportProfile'
import JobMatches from './pages/JobMatches'
import JobDetails from './pages/JobDetails'
import Signin from './pages/Auth'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import UserDashboard from './pages/UserDashboard'
import Onboarding from './pages/Onboarding'
import Assessment from './pages/Assessment'
import GoogleCallback from './pages/GoogleCallback'

// Protected Route Component
const ProtectedDashboard = () => {
  return <UserDashboard />
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Navigate to="/signin" replace />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/user-dashboard" element={<ProtectedDashboard />} />
        <Route path="/assessments" element={<Assessment />} />
        <Route path="/create-profile" element={<CreateProfile />} />
        <Route path="/import-profile" element={<ImportProfile />} />
        <Route path="/job-matches" element={<JobMatches />} />
        <Route path="/job-details/:jobId" element={<JobDetails />} />
      </Routes>
    </Router>
  )
}

export default App
