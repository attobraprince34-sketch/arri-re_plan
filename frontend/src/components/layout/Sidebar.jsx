import React, { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, ImagePlus, History, LogOut, Scissors } from 'lucide-react'
import { AuthContext } from '../../context/AuthContext'
import { cn } from '../../lib/utils'

const Sidebar = () => {
  const location = useLocation()
  const { logout } = useContext(AuthContext)

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Process Image', path: '/process', icon: ImagePlus },
    { name: 'History', path: '/history', icon: History },
  ]

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col h-full shrink-0 hidden md:flex transition-all duration-300">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Link to="/dashboard" className="flex items-center gap-2 font-bold text-lg text-primary tracking-tight">
          
          <span>BGRemover</span>
        </Link>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname.startsWith(item.path)
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          )
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-all duration-200"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
