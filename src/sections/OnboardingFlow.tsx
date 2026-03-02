// ============================================
// ONBOARDING FLOW - Storytelling Experience
// Human Firewall Intelligence Platform v3.0
// ============================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, Users, ChevronRight, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OnboardingFlowProps {
  onComplete: () => void;
  onSkip?: () => void;
}

interface OnboardingFrame {
  id: number;
  icon: typeof Shield;
  title: string;
  subtitle: string;
  description: string;
  stat?: string;
  statLabel?: string;
}

const onboardingFrames: OnboardingFrame[] = [
  {
    id: 1,
    icon: AlertTriangle,
    title: 'The Hidden Threat',
    subtitle: 'Every day, 3.4 billion phishing emails are sent worldwide',
    description: 'Social engineering attacks are the #1 cause of data breaches. Unlike technical vulnerabilities, they target the human element — the hardest part of security to patch.',
    stat: '3.4B',
    statLabel: 'Phishing emails daily',
  },
  {
    id: 2,
    icon: Users,
    title: 'The Human Factor',
    subtitle: '90% of successful breaches involve human error',
    description: 'Firewalls, antivirus, and encryption can\'t protect against a convincing message from a "friend" or an "urgent" request from your "bank". Your awareness is your first line of defense.',
    stat: '90%',
    statLabel: 'Breaches involve humans',
  },
  {
    id: 3,
    icon: Brain,
    title: 'Know Your Weakness',
    subtitle: 'Can you recognize an attack before it\'s too late?',
    description: 'This assessment will test your ability to identify social engineering across email, WhatsApp, and Instagram. You\'ll receive a personalized security profile with actionable insights.',
    stat: '5 min',
    statLabel: 'To complete',
  },
];

export function OnboardingFlow({ onComplete, onSkip }: OnboardingFlowProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance frames
  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setTimeout(() => {
      if (currentFrame < onboardingFrames.length - 1) {
        setCurrentFrame(prev => prev + 1);
      } else {
        setIsAutoPlaying(false);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentFrame, isAutoPlaying]);

  const handleNext = () => {
    if (currentFrame < onboardingFrames.length - 1) {
      setCurrentFrame(prev => prev + 1);
      setIsAutoPlaying(false);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentFrame > 0) {
      setCurrentFrame(prev => prev - 1);
      setIsAutoPlaying(false);
    }
  };

  const handleSkip = () => {
    onSkip?.();
    onComplete();
  };

  const frame = onboardingFrames[currentFrame];
  const FrameIcon = frame.icon;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 cyber-gradient cyber-grid-bg" />

      {/* Floating Orbs */}
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{ top: '10%', left: '10%' }}
      />
      <motion.div
        className="absolute w-80 h-80 rounded-full bg-cyan-400/5 blur-3xl"
        animate={{
          x: [0, -80, 0],
          y: [0, 80, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{ bottom: '20%', right: '15%' }}
      />

      {/* Progress Indicators */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-2">
        {onboardingFrames.map((_, index) => (
          <motion.div
            key={index}
            className={`h-1 rounded-full transition-all duration-500 ${index === currentFrame
                ? 'w-8 bg-cyan-400'
                : index < currentFrame
                  ? 'w-4 bg-cyan-400/50'
                  : 'w-4 bg-slate-700'
              }`}
            initial={false}
            animate={{
              scale: index === currentFrame ? 1 : 0.9,
            }}
          />
        ))}
      </div>

      {/* Skip Button */}
      <button
        onClick={handleSkip}
        className="absolute top-24 right-6 text-slate-500 hover:text-slate-300 text-sm transition-colors"
      >
        Skip intro
      </button>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentFrame}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center mx-auto mb-8"
              >
                <FrameIcon className="w-10 h-10 text-cyan-400" />
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl md:text-4xl font-bold text-white mb-4"
              >
                {frame.title}
              </motion.h2>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-cyan-400 mb-6"
              >
                {frame.subtitle}
              </motion.p>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-slate-400 text-lg leading-relaxed mb-8"
              >
                {frame.description}
              </motion.p>

              {/* Stat */}
              {frame.stat && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="inline-flex flex-col items-center"
                >
                  <span className="text-5xl font-bold heading-gradient cyber-glow-text">
                    {frame.stat}
                  </span>
                  <span className="text-slate-500 text-sm mt-1">
                    {frame.statLabel}
                  </span>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-center gap-4 mt-12"
          >
            {currentFrame > 0 && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="px-6 py-3 rounded-xl border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                Previous
              </Button>
            )}

            <Button
              onClick={handleNext}
              className="btn-cyber px-8 py-3 rounded-xl group"
            >
              {currentFrame === onboardingFrames.length - 1 ? (
                <>Start Assessment</>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </motion.div>

          {/* Frame Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {onboardingFrames.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentFrame(index);
                  setIsAutoPlaying(false);
                }}
                className={`w-2 h-2 rounded-full transition-all ${index === currentFrame
                    ? 'bg-cyan-400 w-6'
                    : 'bg-slate-700 hover:bg-slate-600'
                  }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[hsl(220,20%,4%)] to-transparent" />
    </section>
  );
}
