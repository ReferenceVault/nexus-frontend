export const getCandidateMenuItems = ({ navigate, resumeCount, videoCount }) => [
  {
    id: 'overview',
    label: 'Overview',
    icon: 'fa-solid fa-grid-2',
    onClick: () => navigate('/user-dashboard'),
  },
  {
    id: 'resumes',
    label: 'My Resumes',
    icon: 'fa-solid fa-file-pdf',
    badge: resumeCount > 0 ? resumeCount : undefined,
    onClick: () => navigate('/user-dashboard?tab=resumes'),
  },
  {
    id: 'resume-optimizer',
    label: 'Resume Optimizer',
    icon: 'fa-solid fa-wand-magic-sparkles',
    onClick: () => navigate('/user-dashboard?tab=resume-optimizer'),
  },
  {
    id: 'videos',
    label: 'Video Introductions',
    icon: 'fa-solid fa-video',
    badge: videoCount > 0 ? videoCount : undefined,
    onClick: () => navigate('/user-dashboard?tab=videos'),
  },
  {
    id: 'assessments',
    label: 'Assessments',
    icon: 'fa-solid fa-clipboard-check',
    onClick: () => navigate('/assessments'),
  },
  {
    id: 'job-matches',
    label: 'Job Matches',
    icon: 'fa-solid fa-briefcase',
    onClick: () => navigate('/job-matches'),
  },
]

export const getCandidateQuickActions = (navigate) => [
  { label: 'Upload Resume', icon: 'fa-solid fa-upload', onClick: () => navigate('/upload-resume') },
  { label: 'Upload Video', icon: 'fa-solid fa-video', onClick: () => navigate('/upload-video') },
  { label: 'Take Assessment', icon: 'fa-solid fa-clipboard-question', onClick: () => navigate('/assessments') },
  { label: 'Browse Jobs', icon: 'fa-solid fa-search', onClick: () => navigate('/job-matches') },
]
