import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { ThemeToggle } from '../ui/ThemeToggle'

const Topbar = () => {
  const { user } = useContext(AuthContext)

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur shrink-0 flex items-center justify-between px-6 sticky top-0 z-10 transition-colors duration-300">
      <div className="flex items-center">
        {/* Mobile menu toggle could go here */}
        <h2 className="text-lg font-semibold md:hidden">BGRemover</h2>
      </div>
      
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-medium border border-primary/30">
          {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
        </div>
        <div className="hidden md:flex flex-col">
          <span className="text-sm font-medium leading-none">{user?.username || 'User'}</span>
          <span className="text-xs text-muted-foreground mt-1">{user?.email || ''}</span>
        </div>
      </div>
    </header>
  )
}

export default Topbar
