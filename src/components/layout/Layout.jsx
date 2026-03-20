import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const navItems = [
  { to: '/dashboard', icon: '⬡', label: 'ARENA' },
  { to: '/leaderboard', icon: '◈', label: 'RANKS' },
  { to: '/profile', icon: '◎', label: 'PROFILE' },
  { to: '/final', icon: '✦', label: 'MANIFESTO' },
];

export default function Layout() {
  const { userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-void flex">
      {/* Background */}
      <div className="fixed inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="fixed inset-0 bg-radial-plasma opacity-20 pointer-events-none" style={{ backgroundPosition: '80% 20%' }} />

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-cosmos/90 border-r border-ion/10 backdrop-blur-xl fixed h-full z-40">
        {/* Logo */}
        <div className="p-6 border-b border-ion/10">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full border border-ion/40 border-t-ion"
              />
              <div className="absolute inset-1 rounded-full bg-ion/10 flex items-center justify-center">
                <span className="font-display text-ion text-xs font-bold">IE</span>
              </div>
            </div>
            <div>
              <div className="font-display text-sm text-gradient-ion">IEEE EPI</div>
              <div className="font-mono-tech text-ghost text-xs">CHALLENGE ARENA</div>
            </div>
          </div>
        </div>

        {/* User mini-profile */}
        <div className="p-4 border-b border-ion/10">
          <div className="glass-card rounded-lg p-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-ion/30 to-plasma/30 border border-ion/30 flex items-center justify-center">
                <span className="font-display text-ion text-sm">{userProfile?.name?.[0]?.toUpperCase() || '?'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display text-xs text-white truncate">{userProfile?.name || 'Agent'}</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-star text-xs">★</span>
                  <span className="font-mono-tech text-star text-xs">{userProfile?.totalPoints || 0} PTS</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-ion/10 border border-ion/30 text-ion shadow-ion'
                    : 'text-ghost hover:bg-ash/50 hover:text-white border border-transparent'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-display text-xs tracking-widest">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-ion/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-ghost hover:text-pulse hover:bg-pulse/10 border border-transparent hover:border-pulse/20 transition-all duration-200"
          >
            <span className="text-lg">⏻</span>
            <span className="font-display text-xs tracking-widest">DISCONNECT</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-cosmos/95 border-b border-ion/10 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-ion/20 border border-ion/40 flex items-center justify-center">
              <span className="font-display text-ion text-xs">IE</span>
            </div>
            <span className="font-display text-sm text-gradient-ion">IEEE EPI</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono-tech text-star text-xs">{userProfile?.totalPoints || 0} PTS</span>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="w-8 h-8 flex flex-col justify-center items-center gap-1.5"
            >
              <span className={`w-5 h-0.5 bg-ion transition-all ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`w-5 h-0.5 bg-ion transition-all ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`w-5 h-0.5 bg-ion transition-all ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden fixed top-14 left-0 right-0 z-40 bg-cosmos/98 border-b border-ion/10 backdrop-blur-xl"
          >
            <nav className="p-4 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive ? 'bg-ion/10 border border-ion/30 text-ion' : 'text-ghost hover:bg-ash/50 hover:text-white border border-transparent'
                    }`
                  }
                >
                  <span>{item.icon}</span>
                  <span className="font-display text-xs tracking-widest">{item.label}</span>
                </NavLink>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-ghost hover:text-pulse border border-transparent"
              >
                <span>⏻</span>
                <span className="font-display text-xs tracking-widest">DISCONNECT</span>
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 min-h-screen">
        <div className="p-4 lg:p-8 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
