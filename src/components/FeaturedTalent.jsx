import React from 'react'
import { useNavigate } from 'react-router-dom'

const FeaturedTalent = () => {
  const navigate = useNavigate()

  const featuredCandidates = [
    {
      id: 1,
      name: 'Sarah Chen',
      aiMatchScore: 95,
      communicationRating: 4.8,
      verifiedSkills: ['React', 'TypeScript', 'Next.js'],
      location: 'Toronto, ON',
      salaryExpectations: '$120k - $150k',
      videoThumbnail: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=300&fit=crop',
      profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 2,
      name: 'Marcus Johnson',
      aiMatchScore: 92,
      communicationRating: 4.6,
      verifiedSkills: ['Node.js', 'React', 'PostgreSQL'],
      location: 'Vancouver, BC',
      salaryExpectations: '$100k - $130k',
      videoThumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
      profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 3,
      name: 'Elena Rodriguez',
      aiMatchScore: 88,
      communicationRating: 4.9,
      verifiedSkills: ['AWS', 'Kubernetes', 'Terraform'],
      location: 'Montreal, QC',
      salaryExpectations: '$110k - $140k',
      videoThumbnail: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop',
      profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 4,
      name: 'Alex Kim',
      aiMatchScore: 85,
      communicationRating: 4.5,
      verifiedSkills: ['React', 'JavaScript', 'CSS'],
      location: 'Calgary, AB',
      salaryExpectations: '$80k - $110k',
      videoThumbnail: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=300&fit=crop',
      profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
    }
  ]

  return (
    <section className="py-10 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          {/* Badge */}
          <div className="inline-flex items-center bg-purple-100 text-purple-700 px-2.5 py-0.5 rounded-full text-xs font-medium mb-3">
            <i className="fa-solid fa-play mr-1.5"></i>
            Video Resumes
          </div>

          {/* Title */}
          <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-3">
            Featured AI‑Verified Tech Talent
          </h2>

          {/* Description */}
          <p className="text-sm text-slate-600 max-w-2xl mx-auto">
            Meet standout software engineers, data scientists, software engineers, architects, product managers and AI specialists whose skills and soft skills have been validated by our AI assessments.
          </p>
        </div>

        {/* Talent Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {featuredCandidates.map((candidate) => (
            <div
              key={candidate.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden cursor-pointer"
              onClick={() => navigate(`/candidate/${candidate.id}`)}
            >
              {/* Video Thumbnail - Personal Video */}
              <div className="relative aspect-video bg-slate-200 overflow-hidden">
                <img
                  src={candidate.videoThumbnail}
                  alt={candidate.name}
                  className="w-full h-full object-cover"
                />
                {/* AI Match Score Badge */}
                <div className="absolute top-2 left-2">
                  <span className="bg-indigo-600 text-white px-1.5 py-0.5 rounded text-xs font-semibold">
                    AI Match: {candidate.aiMatchScore}%
                  </span>
                </div>
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                    <i className="fa-solid fa-play text-purple-600 text-sm ml-0.5"></i>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <img
                    src={candidate.profilePicture}
                    alt={candidate.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 text-base">{candidate.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-indigo-600 text-xs font-semibold">
                        {candidate.aiMatchScore}% Match
                      </span>
                    </div>
                  </div>
                </div>

                {/* Communication Rating */}
                <div className="flex items-center gap-1.5 mb-2">
                  <i className="fa-solid fa-comments text-purple-600 text-xs"></i>
                  <span className="text-xs text-slate-700 font-medium">Communication:</span>
                  <div className="flex items-center">
                    <span className="text-xs font-semibold text-slate-900">{candidate.communicationRating}</span>
                    <i className="fa-solid fa-star text-yellow-400 text-[10px] ml-0.5"></i>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-1.5 mb-2 text-xs text-slate-600">
                  <i className="fa-solid fa-map-marker-alt"></i>
                  <span>{candidate.location}</span>
                </div>

                {/* Salary Expectations */}
                <div className="flex items-center gap-1.5 mb-3 text-xs">
                  <i className="fa-solid fa-dollar-sign text-green-600"></i>
                  <span className="text-slate-700 font-medium">Salary:</span>
                  <span className="text-slate-900 font-semibold">{candidate.salaryExpectations}</span>
                </div>

                {/* Verified Skills */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-semibold text-slate-700 flex items-center gap-1">
                    <i className="fa-solid fa-check-circle text-green-600 text-xs"></i>
                    Verified Skills:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {candidate.verifiedSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-medium border border-indigo-200"
                      >
                        <i className="fa-solid fa-check text-[8px] mr-0.5"></i>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Candidates Button */}
        <div className="text-center">
          <button
            className="inline-flex items-center border-2 border-purple-600 text-purple-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-50 transition"
            onClick={() => navigate('/candidates')}
          >
            View All Candidates
            <i className="fa-solid fa-arrow-right ml-1.5 text-xs"></i>
          </button>
        </div>
      </div>
    </section>
  )
}

export default FeaturedTalent

