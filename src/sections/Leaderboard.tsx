import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Medal,
  Crown,
  Star,
  Zap,
  TrendingUp,
  Target,
  Flame
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getTopParticipants, getTopBySpeed, getTopByAccuracy, getTodayTopParticipants } from '@/lib/supabase';
import type { Participant } from '@/types';

interface LeaderboardCategory {
  id: string;
  name: string;
  icon: typeof Trophy;
  description: string;
}

const categories: LeaderboardCategory[] = [
  {
    id: 'overall',
    name: 'Overall Score',
    icon: Trophy,
    description: 'Highest total resilience scores',
  },
  {
    id: 'speed',
    name: 'Fastest Response',
    icon: Zap,
    description: 'Quickest correct decisions',
  },
  {
    id: 'accuracy',
    name: 'Perfect Accuracy',
    icon: Target,
    description: '100% correct responses',
  },
  {
    id: 'streak',
    name: 'Daily Champion',
    icon: Flame,
    description: 'Top performer today',
  },
];

interface LeaderboardProps {
  onStartChallenge?: () => void;
}

export function Leaderboard({ onStartChallenge }: LeaderboardProps) {
  const [participants, setParticipants] = useState<Record<string, Participant[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [, setActiveCategory] = useState('overall');

  useEffect(() => {
    loadLeaderboardData();
  }, []);

  const loadLeaderboardData = async () => {
    setIsLoading(true);
    // Load all categories from real Supabase data
    const [overallData, speedData, accuracyData, todayData] = await Promise.all([
      getTopParticipants(15),
      getTopBySpeed(15),
      getTopByAccuracy(15),
      getTodayTopParticipants(15),
    ]);
    const data: Record<string, Participant[]> = {
      overall: overallData,
      speed: speedData,
      accuracy: accuracyData,
      streak: todayData,
    };

    setParticipants(data);
    setIsLoading(false);
  };

  const getRankIcon = (rank: number) => {
    if (rank === 0) return <Crown className="w-5 h-5 text-yellow-400" />;
    if (rank === 1) return <Medal className="w-5 h-5 text-slate-300" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="w-5 h-5 flex items-center justify-center text-slate-500 font-bold">{rank + 1}</span>;
  };

  const getRankStyle = (rank: number) => {
    if (rank === 0) return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30';
    if (rank === 1) return 'bg-gradient-to-r from-slate-400/20 to-slate-500/20 border-slate-400/30';
    if (rank === 2) return 'bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-amber-600/30';
    return 'bg-slate-800/50 border-slate-700';
  };

  return (
    <section className="relative min-h-screen py-12">
      {/* Background */}
      <div className="absolute inset-0 cyber-gradient" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-6">
            <Trophy className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-cyan-100/80">Global Rankings</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Human Firewall <span className="heading-gradient">Leaderboard</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Recognizing the most cyber-resilient individuals across the campus
          </p>
        </motion.div>

        {/* Leaderboard Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="overall" className="w-full" onValueChange={setActiveCategory}>
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-slate-800/50 p-2 rounded-2xl mb-8 h-auto">
              {categories.map((cat) => (
                <TabsTrigger
                  key={cat.id}
                  value={cat.id}
                  className="data-[state=active]:bg-cyan-500 data-[state=active]:text-slate-900 rounded-xl py-2 md:py-3 px-2 md:px-4 text-slate-400 hover:text-white transition-all flex flex-col md:flex-row items-center justify-center text-xs md:text-sm h-full min-h-[60px] md:min-h-0 text-center"
                >
                  <cat.icon className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="inline">{cat.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <div className="glass-card rounded-3xl p-6 md:p-8">
                  {/* Category Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                        <category.icon className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{category.name}</h3>
                        <p className="text-sm text-slate-400">{category.description}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={loadLeaderboardData}
                      className="border-slate-700 text-slate-300 hover:bg-slate-800"
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                  </div>

                  {/* Leaderboard List */}
                  {isLoading ? (
                    <div className="space-y-3">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-16 bg-slate-800/50 rounded-xl animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {participants[category.id]?.map((participant, index) => (
                        <motion.div
                          key={participant.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`flex items-center gap-4 p-4 rounded-xl border transition-all hover:scale-[1.02] ${getRankStyle(index)}`}
                        >
                          {/* Rank */}
                          <div className="w-10 h-10 flex items-center justify-center">
                            {getRankIcon(index)}
                          </div>

                          {/* Avatar */}
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                            {participant.name.charAt(0).toUpperCase()}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-white truncate">
                              {participant.name}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                              <span className={`px-2 py-0.5 rounded-full ${participant.category === 'Human Firewall' ? 'bg-cyan-500/20 text-cyan-400' :
                                participant.category === 'Low Risk' ? 'bg-green-500/20 text-green-400' :
                                  participant.category === 'Moderate Risk' ? 'bg-amber-500/20 text-amber-400' :
                                    'bg-red-500/20 text-red-400'
                                }`}>
                                {participant.category}
                              </span>
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="text-right">
                            <div className="font-bold text-cyan-400">
                              {category.id === 'speed'
                                ? `${Math.round(participant.total_time / 1000)}s`
                                : `${participant.final_score}%`
                              }
                            </div>
                            <div className="text-xs text-slate-500">
                              {category.id === 'speed' ? 'Response Time' : 'Score'}
                            </div>
                          </div>
                        </motion.div>
                      ))}

                      {participants[category.id]?.length === 0 && (
                        <div className="text-center py-12">
                          <Star className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                          <p className="text-slate-400">No data available for this category yet</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-10 text-center"
        >
          <p className="text-slate-400 mb-4">
            Think you can make it to the top?
          </p>
          <Button
            onClick={onStartChallenge || (() => window.scrollTo({ top: 0, behavior: 'smooth' }))}
            className="btn-cyber px-8 py-6 text-base rounded-xl"
          >
            <Zap className="w-5 h-5 mr-2" />
            Take the Challenge
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
