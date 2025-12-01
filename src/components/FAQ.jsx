import React, { useState } from 'react'

const FAQ = () => {
  const [openFAQ, setOpenFAQ] = useState(null)

  const toggleFAQ = (faqId) => {
    setOpenFAQ(openFAQ === faqId ? null : faqId)
  }

  const faqs = [
    {
      id: 'faq1',
      question: 'How does the matching algorithm work?',
      answer: 'Our AI-powered matching system analyzes multiple factors including your skills, experience, preferences, assessment scores, and career goals. It then compares these with job requirements, company culture, and compensation to provide highly accurate matches with explanation scores.'
    },
    {
      id: 'faq2',
      question: 'Are the assessments really bias-free?',
      answer: 'Yes, our assessments are designed to be completely skills-based and blind to personal information like name, photo, university, or previous companies. We regularly audit our assessment tools with diversity experts to ensure fairness and eliminate unconscious bias.'
    },
    {
      id: 'faq3',
      question: 'What kind of relocation support do you provide?',
      answer: 'We offer comprehensive relocation support including visa assistance, documentation help, cultural integration programs, housing assistance, tax guidance, and connections to local communities. Our partners include immigration lawyers and relocation specialists worldwide.'
    },
    {
      id: 'faq4',
      question: 'How do you verify companies?',
      answer: 'Every company goes through a multi-step verification process including business registration checks, financial stability assessment, employee reviews, and compliance with fair hiring practices. We also regularly audit companies for continued compliance.'
    },
    {
      id: 'faq5',
      question: 'Can I control who sees my profile?',
      answer: 'Absolutely. You have complete control over your profile visibility. You can choose to be visible to all verified companies, specific industries, or remain completely private while still accessing job listings and assessments.'
    }
  ]

  return (
    <section id="faq" className="py-20 bg-gradient-to-br from-neutral-50 to-blue-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-neutral-900 mb-6">Frequently Asked Questions</h2>
          <p className="text-xl text-neutral-900/70 max-w-3xl mx-auto">Everything you need to know about Nexus Recruitment.</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {faqs.map((faq) => (
            <div key={faq.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
              <div 
                className="flex justify-between items-center cursor-pointer" 
                onClick={() => toggleFAQ(faq.id)}
              >
                <h3 className="text-lg font-semibold text-neutral-900">{faq.question}</h3>
                <i 
                  className={`fa-solid fa-chevron-down text-neutral-900 transform transition-transform ${
                    openFAQ === faq.id ? 'rotate-180' : ''
                  }`}
                ></i>
              </div>
              {openFAQ === faq.id && (
                <div className="mt-4 text-neutral-900/70">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQ



