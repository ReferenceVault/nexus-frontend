import React from 'react'
import { useNavigate } from 'react-router-dom'

const FeaturedTalent = () => {
  const navigate = useNavigate()

  const featuredCandidates = [
    {
      id: 1,
      name: 'Sarah Chen',
      title: 'Senior React Developer',
      location: 'San Francisco, CA',
      experience: '6+ yrs',
      level: 'Senior',
      skills: ['React', 'TypeScript', 'Next.js'],
      additionalSkills: 3,
      videoThumbnail: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=300&fit=crop',
      profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 2,
      name: 'Marcus Johnson',
      title: 'Full Stack Engineer',
      location: 'Austin, TX',
      experience: '4+ yrs',
      level: 'Mid',
      skills: ['Node.js', 'React', 'PostgreSQL'],
      additionalSkills: 3,
      videoThumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
      profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 3,
      name: 'Elena Rodriguez',
      title: 'DevOps Engineer',
      location: 'Denver, CO',
      experience: '5+ yrs',
      level: 'Senior',
      skills: ['AWS', 'Kubernetes', 'Terraform'],
      additionalSkills: 3,
      videoThumbnail: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop',
      profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 4,
      name: 'Alex Kim',
      title: 'Junior Frontend Developer',
      location: 'Seattle, WA',
      experience: '1+ yrs',
      level: 'Junior',
      skills: ['React', 'JavaScript', 'CSS'],
      additionalSkills: 2,
      videoThumbnail: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=300&fit=crop',
      profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
    }
  ]

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          {/* Badge */}
          <div className="inline-flex items-center bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
            <i className="fa-solid fa-play mr-2"></i>
            Video Resumes
          </div>

          {/* Title */}
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            Featured IT Talent
          </h2>

          {/* Description */}
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Watch video resumes from skilled developers, engineers, and tech professionals ready to join your team.
          </p>
        </div>

        {/* Talent Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {featuredCandidates.map((candidate) => (
            <div
              key={candidate.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden cursor-pointer"
              onClick={() => navigate(`/candidate/${candidate.id}`)}
            >
              {/* Video Thumbnail */}
              <div className="relative aspect-video bg-slate-200 overflow-hidden">
                <img
                  src={candidate.videoThumbnail}
                  alt={candidate.name}
                  className="w-full h-full object-cover"
                />
                {/* Experience Badge */}
                <div className="absolute top-3 left-3">
                  <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-md text-xs font-medium">
                    {candidate.level}
                  </span>
                </div>
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                    <i className="fa-solid fa-play text-purple-600 text-lg ml-1"></i>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={candidate.profilePicture}
                    alt={candidate.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 text-lg">{candidate.name}</h3>
                    <p className="text-purple-600 text-sm font-medium">{candidate.title}</p>
                  </div>
                </div>

                {/* Location & Experience */}
                <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                  <span className="flex items-center">
                    <i className="fa-solid fa-map-marker-alt mr-1.5"></i>
                    {candidate.location}
                  </span>
                  <span className="flex items-center">
                    <i className="fa-solid fa-briefcase mr-1.5"></i>
                    {candidate.experience}
                  </span>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-slate-100 text-slate-700 px-3 py-1 rounded-md text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                  <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-md text-xs font-medium">
                    +{candidate.additionalSkills}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Candidates Button */}
        <div className="text-center">
          <button
            className="inline-flex items-center border-2 border-purple-600 text-purple-600 px-6 py-2.5 rounded-lg font-medium hover:bg-purple-50 transition"
            onClick={() => navigate('/candidates')}
          >
            View All Candidates
            <i className="fa-solid fa-arrow-right ml-2"></i>
          </button>
        </div>
      </div>
    </section>
  )
}

export default FeaturedTalent

