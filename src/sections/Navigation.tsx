import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, BarChart3, Trophy, User, LogOut, Settings, BookOpen, Search, Bell, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useDeviceType } from '@/hooks/useDeviceType';

export interface NavigationProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  onAuthClick: () => void;
  onProfileClick: () => void;
}

const navItems = [
  { id: 'home', label: 'Home', icon: Shield },
  { id: 'learning', label: 'Explore', icon: BookOpen },
  { id: 'dashboard', label: 'Stats', icon: BarChart3 },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
];

export function Navigation({
  currentView, onNavigate, isAuthenticated, isAdmin, onAuthClick
}: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { profile, signOut } = useAuth();
  const { isDesktop } = useDeviceType();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = () => setShowUserMenu(false);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const handleSignOut = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await signOut();
    onNavigate('home');
    setShowUserMenu(false);
  };

  // ============================================
  // DESKTOP UI (Premium Web)
  // ============================================
  if (isDesktop) {
    return (
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? 'bg-slate-900/90 backdrop-blur-xl border-b border-white/5 shadow-2xl py-2'
          : 'bg-transparent py-4'
          }`}
      >
        <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => onNavigate('home')} className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <div className="text-white font-black text-lg leading-none tracking-tight">HUMAN FIREWALL</div>
              <div className="text-cyan-400 text-[10px] font-mono uppercase tracking-[0.2em] mt-1">Intelligence Platform</div>
            </div>
          </button>

          {/* Desktop Links */}
          <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md rounded-2xl p-1 border border-white/5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`relative px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 text-sm font-bold ${isActive ? 'text-white bg-white/10 shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : ''}`} />
                  {item.label}
                  {isActive && (
                    <motion.div layoutId="desktopNav" className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* User Controls */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowUserMenu(!showUserMenu); }}
                  className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xs">
                    {profile?.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm font-bold text-white">{profile?.name}</span>
                </button>
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute right-0 mt-3 w-56 rounded-2xl bg-slate-900/95 backdrop-blur-2xl border border-white/10 p-2 shadow-2xl z-[60]"
                    >
                      <button onClick={() => onNavigate('member')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-300 transition-colors">
                        <User className="w-4 h-4" /> Member Area
                      </button>
                      {isAdmin && (
                        <button onClick={() => onNavigate('admin')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-300 transition-colors">
                          <Settings className="w-4 h-4" /> Admin Console
                        </button>
                      )}
                      <div className="h-px bg-white/5 my-1" />
                      <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-400 transition-colors">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Button onClick={onAuthClick} className="bg-cyan-500 hover:bg-cyan-400 text-black font-black px-8 py-6 rounded-2xl shadow-lg shadow-cyan-500/20 transition-all active:scale-95">
                PORTAL LOGIN
              </Button>
            )}
          </div>
        </div>
      </motion.nav>
    );
  }

  // ============================================
  // ANDROID UI (Extreme Mobile M3)
  // ============================================
  return (
    <>
      {/* 1. M3 Top App Bar */}
      <motion.header
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 pt-safe px-4 py-3 flex items-center justify-between ${isScrolled ? 'bg-slate-900/95 backdrop-blur-2xl border-b border-white/5 shadow-lg' : 'bg-transparent'
          }`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('member')}
            className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-black text-sm border-2 border-white/10 active:scale-90 transition-transform"
          >
            {profile?.name?.[0]?.toUpperCase() || <Shield className="w-5 h-5" />}
          </button>
          {!isScrolled && (
            <div className="text-left scale-90 origin-left">
              <div className="text-white font-black text-xs leading-none">HUMAN FIREWALL</div>
              <div className="text-cyan-400 text-[8px] font-mono uppercase tracking-widest mt-0.5">INTEL PLATFORM</div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button className="p-2.5 rounded-full text-slate-400 active:bg-white/10 active:text-white transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2.5 rounded-full text-slate-400 active:bg-white/10 active:text-white transition-colors relative">
            <Bell className="w-5 h-5" />
            <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-cyan-500 border border-slate-900" />
          </button>
          <button onClick={() => setShowUserMenu(!showUserMenu)} className="p-2.5 rounded-full text-slate-400 active:bg-white/10 active:text-white transition-colors">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </motion.header>

      {/* 2. M3 Bottom Pill Nav */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-[100] pb-safe"
      >
        <div className="bg-slate-900/95 backdrop-blur-3xl border-t border-white/5 px-2 pb-2">
          <div className="flex items-center justify-around h-16 max-w-md mx-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className="relative flex flex-col items-center justify-center w-full group py-1"
                >
                  <div className={`relative px-5 py-1 rounded-full transition-all duration-300 overflow-hidden ${isActive ? 'bg-cyan-500/20 shadow-[inset_0_0_12px_rgba(34,211,238,0.1)]' : 'hover:bg-white/5'
                    }`}>
                    {/* The Active Pill Indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activePill"
                        className="absolute inset-x-0 inset-y-0.5 bg-cyan-500/30 rounded-full z-0"
                        transition={{ type: 'spring', bounce: 0.3, duration: 0.6 }}
                      />
                    )}
                    <Icon className={`w-6 h-6 relative z-10 transition-colors duration-300 ${isActive ? 'text-cyan-400 scale-110' : 'text-slate-500'}`} />
                  </div>
                  <span className={`text-[10px] mt-1 font-bold tracking-tight transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-500'}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}

            {/* Auth/Profile for Android */}
            <button
              onClick={() => onNavigate(isAuthenticated ? 'member' : 'auth')}
              className="relative flex flex-col items-center justify-center w-full group py-1"
            >
              <div className={`relative px-5 py-1 rounded-full transition-all duration-300 ${currentView === 'member' || currentView === 'auth' ? 'bg-indigo-500/20' : 'hover:bg-white/5'}`}>
                {(currentView === 'member' || currentView === 'auth') && (
                  <motion.div layoutId="activePill" className="absolute inset-x-0 inset-y-0.5 bg-indigo-500/30 rounded-full z-0" />
                )}
                <User className={`w-6 h-6 relative z-10 ${currentView === 'member' || currentView === 'auth' ? 'text-indigo-400' : 'text-slate-500'}`} />
              </div>
              <span className={`text-[10px] mt-1 font-bold tracking-tight ${currentView === 'member' || currentView === 'auth' ? 'text-white' : 'text-slate-500'}`}>
                {isAuthenticated ? 'Profile' : 'Sign In'}
              </span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Mobile Drawer (Android Style Content) */}
      <AnimatePresence>
        {showUserMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUserMenu(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-4/5 max-w-sm bg-slate-900 z-[120] p-6 shadow-2xl flex flex-col"
            >
              <div className="flex items-center gap-4 mb-10 pt-4">
                <div className="w-16 h-16 rounded-[2rem] bg-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-indigo-600/20">
                  {profile?.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">{profile?.name || 'Guest User'}</h3>
                  <p className="text-sm text-slate-500 font-mono tracking-tighter">Human Firewall Pilot</p>
                </div>
              </div>

              <div className="space-y-2 flex-1">
                <Button variant="ghost" className="w-full justify-start gap-4 h-14 rounded-2xl hover:bg-white/5 text-lg font-bold" onClick={() => { onNavigate('member'); setShowUserMenu(false); }}>
                  <User className="w-5 h-5 text-cyan-400" /> My Profile
                </Button>
                {isAdmin && (
                  <Button variant="ghost" className="w-full justify-start gap-4 h-14 rounded-2xl hover:bg-white/5 text-lg font-bold" onClick={() => { onNavigate('admin'); setShowUserMenu(false); }}>
                    <Settings className="w-5 h-5 text-indigo-400" /> Admin Panel
                  </Button>
                )}
                <Button variant="ghost" className="w-full justify-start gap-4 h-14 rounded-2xl hover:bg-white/5 text-lg font-bold" onClick={() => { onNavigate('learning'); setShowUserMenu(false); }}>
                  <BookOpen className="w-5 h-5 text-emerald-400" /> Learning Path
                </Button>
              </div>

              <Button
                variant="outline"
                className="w-full justify-start gap-4 h-14 rounded-full border-white/5 hover:bg-red-500/10 text-red-500 font-black mb-safe"
                onClick={handleSignOut}
              >
                <LogOut className="w-5 h-5" /> SIGN OUT
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes badgePulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(34, 211, 238, 0.4); }
          50% { transform: scale(1.1); box-shadow: 0 0 12px 2px rgba(34, 211, 238, 0.2); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(6, 182, 212, 0.4); }
        }
      `}</style>
    </>
  );
}
