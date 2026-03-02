import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Menu, X, BarChart3, Trophy, User, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

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
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
];

export function Navigation({
  currentView, onNavigate, isAuthenticated, isAdmin, onAuthClick, onProfileClick
}: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { profile, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
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

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
            ? 'bg-slate-900/95 backdrop-blur-lg border-b border-slate-800 shadow-lg'
            : 'bg-transparent'
          }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <motion.button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-3 group"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-cyan-500/30 transition-shadow">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <div className="text-white font-bold text-sm leading-tight">Human Firewall</div>
                <div className="text-cyan-400 text-xs">Intelligence Platform</div>
              </div>
            </motion.button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() => onNavigate(item.id)}
                    className={`relative px-4 py-2 rounded-lg transition-all ${isActive ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="navIndicator"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400"
                      />
                    )}
                  </Button>
                );
              })}
            </div>

            {/* Right Side: Auth/User */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <div className="relative" onClick={e => e.stopPropagation()}>
                  <motion.button
                    onClick={() => setShowUserMenu(v => !v)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700 hover:border-cyan-500/50 transition-all"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                      {profile?.name?.[0]?.toUpperCase() ?? '?'}
                    </div>
                    <span className="text-white text-sm font-medium max-w-24 truncate">{profile?.name ?? 'Member'}</span>
                    {isAdmin && (
                      <span className="text-xs bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded-md border border-yellow-500/30">Admin</span>
                    )}
                  </motion.button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute right-0 top-12 w-48 glass-card rounded-xl border border-slate-700 shadow-xl overflow-hidden"
                      >
                        <div className="p-3 border-b border-slate-700">
                          <p className="text-white text-sm font-medium truncate">{profile?.name}</p>
                          <p className="text-slate-400 text-xs truncate">{profile?.role}</p>
                        </div>
                        <div className="p-1">
                          <button
                            onClick={() => { onProfileClick(); setShowUserMenu(false); }}
                            className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 text-sm flex items-center gap-2 transition-colors"
                          >
                            <Settings className="w-4 h-4" />
                            {isAdmin ? 'Admin Dashboard' : 'Profil & Riwayat'}
                          </button>
                          <button
                            onClick={handleSignOut}
                            className="w-full text-left px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 text-sm flex items-center gap-2 transition-colors"
                          >
                            <LogOut className="w-4 h-4" /> Keluar
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Button onClick={onAuthClick} className="btn-cyber px-5 py-2 rounded-lg text-sm flex items-center gap-2">
                  <User className="w-4 h-4" /> Login / Daftar
                </Button>
              )}

              {/* Take Challenge CTA (only when not in challenge already) */}
              {!['simulation', 'results', 'member', 'admin', 'auth'].includes(currentView) && (
                <Button
                  onClick={() => onNavigate('challenge')}
                  variant="outline"
                  className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 px-4 py-2 rounded-lg text-sm"
                >
                  Take Challenge
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-16 z-40 md:hidden"
          >
            <div className="bg-slate-900/98 backdrop-blur-lg border-b border-slate-800 p-4">
              <div className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <Button
                      key={item.id}
                      variant="ghost"
                      onClick={() => { onNavigate(item.id); setIsMobileMenuOpen(false); }}
                      className={`w-full justify-start px-4 py-3 rounded-lg ${isActive ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                    >
                      <Icon className="w-5 h-5 mr-3" /> {item.label}
                    </Button>
                  );
                })}
                <div className="pt-2 border-t border-slate-800 space-y-2">
                  {isAuthenticated ? (
                    <>
                      <Button
                        onClick={() => { onProfileClick(); setIsMobileMenuOpen(false); }}
                        variant="ghost"
                        className="w-full justify-start text-slate-300 hover:bg-slate-800 py-3"
                      >
                        <User className="w-5 h-5 mr-3" />
                        {isAdmin ? 'Admin Panel' : `Halo, ${profile?.name ?? 'Member'}`}
                      </Button>
                      <Button
                        onClick={async () => { await signOut(); onNavigate('home'); setIsMobileMenuOpen(false); }}
                        variant="ghost"
                        className="w-full justify-start text-red-400 hover:bg-red-500/10 py-3"
                      >
                        <LogOut className="w-5 h-5 mr-3" /> Keluar
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => { onAuthClick(); setIsMobileMenuOpen(false); }}
                      className="w-full btn-cyber py-3 rounded-lg"
                    >
                      <User className="w-5 h-5 mr-2" /> Login / Daftar
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
