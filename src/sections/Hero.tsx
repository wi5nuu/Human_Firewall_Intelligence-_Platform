import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Brain, Users, ChevronRight, Lock, Eye, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDeviceType } from '@/hooks/useDeviceType';

interface HeroProps {
  onStartChallenge: () => void;
  onViewDashboard: () => void;
  onViewLearning?: () => void;
}

export function Hero({ onStartChallenge, onViewDashboard, onViewLearning }: HeroProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { isDesktop } = useDeviceType();

  useEffect(() => {
    if (!isDesktop) return;
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 20 - 10,
        y: (e.clientY / window.innerHeight) * 20 - 10,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isDesktop]);

  const stats = [
    { icon: Users, value: '2,847', label: 'Participants Tested' },
    { icon: Brain, value: '68%', label: 'Avg. Resilience Score' },
    { icon: Eye, value: '42%', label: 'Fall for Phishing' },
    { icon: Lock, value: '156', label: 'Human Firewalls' },
  ];

  // ============================================
  // DESKTOP UI (Premium Web)
  // ============================================
  if (isDesktop) {
    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-24">
        <div className="absolute inset-0 cyber-gradient cyber-grid-bg" />

        <div className="relative z-10 container mx-auto px-12">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-10"
            >
              <Shield className="w-5 h-5 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
              <span className="text-sm font-bold text-white tracking-wide uppercase">Enterprise-Grade Security Assessment</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-7xl lg:text-8xl font-black mb-8 leading-tight tracking-tighter"
              style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)` }}
            >
              <span className="text-white drop-shadow-2xl">HUMAN FIREWALL</span>
              <br />
              <span className="heading-gradient cyber-glow-text">Intelligence Platform</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl text-slate-400 mb-12 max-w-3xl mx-auto font-medium"
            >
              Measuring the Human Layer of Cybersecurity with AI-powered behavioral analytics and immersive simulations.
            </motion.p>

            <div className="flex items-center justify-center gap-6 mb-20">
              <Button onClick={onStartChallenge} className="bg-cyan-500 hover:bg-cyan-400 text-black font-black px-10 py-8 rounded-2xl text-xl shadow-xl shadow-cyan-500/20 active:scale-95 transition-all">
                TAKE THE CHALLENGE <ChevronRight className="w-6 h-6 ml-2" />
              </Button>
              <Button onClick={onViewDashboard} variant="outline" className="border-white/10 hover:bg-white/5 text-white font-bold px-10 py-8 rounded-2xl text-xl transition-all">
                Live Dashboard
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="glass-card rounded-[2.5rem] p-8 border-white/5 bg-white/[0.03] hover:bg-white/[0.06] transition-all group">
                  <stat.icon className="w-8 h-8 text-cyan-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <div className="text-4xl font-black text-white mb-2">{stat.value}</div>
                  <div className="text-sm text-slate-500 uppercase tracking-widest font-bold">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ============================================
  // ANDROID UI (Extreme Mobile M3)
  // ============================================
  return (
    <section className="relative min-h-screen pt-32 pb-24 px-6 overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(6,182,212,0.1),transparent_40%)]" />

      <div className="relative z-10 max-w-lg mx-auto flex flex-col items-start text-left">
        {/* Android Style Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-900/20 border border-cyan-800/30 mb-8"
        >
          <Zap className="w-4 h-4 text-cyan-400" />
          <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Active Analysis</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          className="text-5xl font-black text-white leading-[1.05] tracking-tighter mb-6"
        >
          Securing the <br />
          <span className="text-cyan-400">Human Layer</span> <br />
          of Intelligence.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-slate-400 font-medium leading-relaxed mb-10 max-w-[90%]"
        >
          Strengthen your digital defenses with flagship-grade behavioral analytics.
        </motion.p>

        {/* Android Pill Buttons */}
        <div className="flex flex-col w-full gap-4 mb-16">
          <Button
            onClick={onStartChallenge}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black h-16 rounded-full text-lg shadow-2xl shadow-cyan-500/20"
          >
            Mulai Assessment
          </Button>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onViewDashboard}
              className="flex-1 border-white/10 hover:bg-white/5 text-white font-bold h-14 rounded-full text-sm"
            >
              Dashboard
            </Button>
            {onViewLearning && (
              <Button
                variant="outline"
                onClick={onViewLearning}
                className="flex-1 border-white/10 hover:bg-white/5 text-white font-bold h-14 rounded-full text-sm"
              >
                Learning Hub
              </Button>
            )}
          </div>
        </div>

        {/* Material 3 Stats Group */}
        <div className="w-full space-y-4">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Platform Overview</h3>
          <div className="grid grid-cols-2 gap-4">
            {stats.slice(0, 4).map((stat, i) => (
              <div key={i} className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-6 flex flex-col items-center text-center">
                <stat.icon className="w-6 h-6 text-cyan-500 mb-3" />
                <div className="text-2xl font-black text-white leading-tight">{stat.value}</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tight mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subtle Android Bottom Glow */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-screen h-64 bg-cyan-500/5 blur-[120px] pointer-events-none -z-10" />
    </section>
  );
}
