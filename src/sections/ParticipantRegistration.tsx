import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSimulationStore } from '@/store';
import { createParticipant } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useExhibitionMode } from './ExhibitionMode';

interface ParticipantRegistrationProps {
  onComplete: () => void;
}

export function ParticipantRegistration({ onComplete }: ParticipantRegistrationProps) {
  const { user, profile } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Easy' | 'Medium' | 'Enterprise'>('Easy');

  const setCurrentParticipant = useSimulationStore((state) => state.setCurrentParticipant);
  const setDifficulty = useSimulationStore((state) => state.setDifficulty);

  const { isExhibitionMode } = useExhibitionMode();

  useEffect(() => {
    if (profile?.name) setName(profile.name);
    if (user?.email) setEmail(user.email);

    // Auto-fill for exhibition mode if empty
    if (isExhibitionMode && !user) {
      setName('Exhibition Judge');
      setEmail('judge@exhibition.local');
    }
  }, [profile, user, isExhibitionMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      setError('Please complete all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const participant = await createParticipant(name.trim(), email.trim(), user?.id);

      if (participant) {
        setDifficulty(selectedDifficulty);
        setCurrentParticipant(participant);
        onComplete();
      } else {
        setError('Failed to start. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    '3 Realistic Scenarios (Email, WhatsApp, Instagram)',
    'AI-Powered Behavioral Analytics',
    'Personal Vulnerability Report',
    'Encrypted & Protected Data',
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center py-20">
      <div className="absolute inset-0 cyber-gradient" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Side */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-cyan-300">Ready to Begin</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Start
                <span className="heading-gradient block">Security Assessment</span>
              </h2>

              <p className="text-slate-400 mb-8">
                Test your ability to identify real-world social engineering attacks in a campus environment.
              </p>

              <div className="space-y-3">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                    </div>
                    <span className="text-sm text-slate-300">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Side */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="glass-card rounded-2xl p-6 md:p-8">
                <h3 className="text-xl font-semibold text-white mb-6">
                  Participant Profile
                </h3>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-300 flex items-center gap-2">
                      <User className="w-4 h-4 text-cyan-400" /> Full Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      readOnly={!!profile?.name}
                      className={`bg-slate-900/80 border-slate-700 text-slate-400 ${!!profile?.name ? 'cursor-not-allowed' : ''}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-300 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-cyan-400" /> Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      readOnly={!!user?.email}
                      className={`bg-slate-900/80 border-slate-700 text-slate-400 ${!!user?.email ? 'cursor-not-allowed' : ''}`}
                    />
                  </div>

                  {/* Difficulty Selection */}
                  <div className="space-y-3 pt-2">
                    <Label className="text-slate-300">Select Difficulty Level</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['Easy', 'Medium', 'Enterprise'] as const).map((diff) => (
                        <button
                          key={diff}
                          type="button"
                          onClick={() => setSelectedDifficulty(diff)}
                          className={`py-2 px-3 rounded-lg text-sm transition-all border ${selectedDifficulty === diff
                            ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400 font-medium'
                            : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:bg-slate-800'
                            }`}
                        >
                          {diff}
                        </button>
                      ))}
                    </div>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                    >
                      {error}
                    </motion.div>
                  )}

                  <Button
                    type="submit"
                    className="w-full btn-cyber py-6 text-base rounded-xl group mt-4"
                    disabled={isLoading || !name || !email}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin mr-2" />
                        Starting...
                      </>
                    ) : (
                      <>
                        Start Assessment
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>

                <p className="text-center text-xs text-slate-500 mt-4">
                  Assessment takes 5-7 minutes
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
