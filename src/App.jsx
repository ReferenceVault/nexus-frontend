import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CreateProfile from './pages/CreateProfile'
import ImportProfile from './pages/ImportProfile'
import JobMatches from './pages/JobMatches'
import JobDetails from './pages/JobDetails'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-profile" element={<CreateProfile />} />
        <Route path="/import-profile" element={<ImportProfile />} />
        <Route path="/job-matches" element={<JobMatches />} />
        <Route path="/job-details/:jobId" element={<JobDetails />} />
      </Routes>
    </Router>
  )
}

export default App
