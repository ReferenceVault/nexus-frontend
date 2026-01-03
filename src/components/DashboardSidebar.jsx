import React from 'react'

const DashboardSidebar = ({
  title,
  collapsed,
  onToggleCollapse,
  menuItems,
  activeView,
  quickFilters,
  ctaSection,
  collapsedCtaButton
}) => {
  return (
    <aside className={`${collapsed ? 'w-20' : 'w-72'} min-h-screen bg-white/80 backdrop-blur-md border-r border-indigo-200/50 sticky top-16 shadow-sm transition-all duration-300`}>
      <div className={`p-6 ${collapsed ? 'px-3' : ''}`}>
        <div className="mb-8">
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} mb-4`}>
            {!collapsed && (
              <h3 className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">{title}</h3>
            )}
            <button 
              onClick={onToggleCollapse}
              className={`text-neutral-500 hover:text-primary transition-colors duration-300 p-2 rounded-lg hover:bg-indigo-50 ${collapsed ? '' : 'ml-auto'}`}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <i className="fa-solid fa-bars text-lg"></i>
            </button>
          </div>
          
          <div className="space-y-1.5">
            {menuItems.map((item) => {
              const isActive = activeView === item.id
              
              return (
                <button 
                  key={item.id}
                  onClick={item.onClick}
                  className={`w-full flex items-center ${collapsed ? 'justify-center px-0' : 'px-4'} py-3 rounded-xl text-sm font-semibold transition-all duration-300 group relative ${
                    isActive
                      ? 'text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/30'
                      : 'text-neutral-600 hover:text-primary hover:bg-indigo-50/50'
                  }`}
                  title={collapsed ? item.label : ''}
                >
                  <i className={`${item.icon} ${collapsed ? '' : 'mr-3'} ${isActive ? 'text-white' : 'text-neutral-500 group-hover:text-primary'}`}></i>
                  {!collapsed && <span>{item.label}</span>}
                  {!collapsed && item.badge !== undefined && item.badge > 0 && (
                    <span className={`ml-auto text-xs px-2 py-1 rounded-full ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-indigo-100 text-primary'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {collapsed && item.badge !== undefined && item.badge > 0 && (
                    <span className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold ${
                      isActive 
                        ? 'bg-white/30 text-white' 
                        : 'bg-primary text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
        
        {!collapsed && quickFilters && quickFilters.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-4">Quick Actions</h3>
            <div className="space-y-1.5">
              {quickFilters.map((filter, index) => (
                <button 
                  key={index}
                  onClick={filter.onClick}
                  className="w-full flex items-center px-4 py-2.5 rounded-lg text-sm text-neutral-600 hover:text-primary hover:bg-indigo-50/50 transition-all duration-300 group"
                >
                  <i className={`${filter.icon} w-4 h-4 mr-3 text-neutral-500 group-hover:text-primary`}></i>
                  <span>{filter.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {!collapsed && ctaSection && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50/50 p-5 border border-indigo-200/50 shadow-lg hover:shadow-xl transition-all duration-300 group">
            {ctaSection}
          </div>
        )}
        
        {collapsed && collapsedCtaButton && (
          <div className="mt-8">
            <button 
              onClick={collapsedCtaButton.onClick}
              className="w-full flex items-center justify-center p-3 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
              title={collapsedCtaButton.title}
            >
              <i className={`${collapsedCtaButton.icon} group-hover:scale-110 transition-transform`}></i>
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}

export default DashboardSidebar

