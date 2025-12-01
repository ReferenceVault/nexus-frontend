import React from 'react'

const ChatWidget = () => {
  return (
    <div id="chat-widget" className="fixed bottom-6 right-6 z-50">
      <button className="bg-primary text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110">
        <i className="fa-solid fa-comments text-xl"></i>
      </button>
    </div>
  )
}

export default ChatWidget



