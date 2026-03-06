import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Shield, Zap, TrendingUp } from 'lucide-react';
import { getTopParticipants } from '@/lib/supabase';
import type { Participant } from '@/types';

export function HallOfFame() {
    const [topUsers, setTopUsers] = useState<Participant[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadTopUsers() {
            const data = await getTopParticipants(5);
            setTopUsers(data);
            setIsLoading(false);
        }
        loadTopUsers();
    }, []);

    if (isLoading || topUsers.length === 0) return null;

    return (
        <section className="py-24 bg-slate-950/50 relative overflow-hidden">
            {/* Decorative glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-4"
                    >
                        <Award className="w-3 h-3" />
                        ELITE RESILIENCE ROSTER
                    </motion.div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        The Hall of <span className="heading-gradient">Firewalls</span>
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Showcasing the top-tier cybersecurity champions who have demonstrated
                        exceptional resilience against advanced social engineering tactics.
                    </p>
                </div>

                <div className="grid md:grid-cols-5 gap-6">
                    {topUsers.map((user, index) => (
                        <motion.div
                            key={user.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative group ${index === 0 ? 'md:-translate-y-4' : ''}`}
                        >
                            <div className="glass-card rounded-2xl p-6 h-full flex flex-col items-center text-center border-slate-800 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]">
                                {/* Ranking Badge */}
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-6 shadow-lg ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-amber-600 text-slate-950 scale-110' :
                                        index === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-500 text-slate-950' :
                                            index === 2 ? 'bg-gradient-to-br from-amber-600 to-orange-800 text-slate-950' :
                                                'bg-slate-800 text-slate-400 border border-slate-700'
                                    }`}>
                                    <span className="text-xl font-bold">{index + 1}</span>
                                </div>

                                <div className="mb-4">
                                    <h3 className="text-lg font-bold text-white truncate w-full max-w-[150px]">{user.name}</h3>
                                    <div className="flex items-center justify-center gap-1 mt-1 text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                                        <Shield className="w-3 h-3" />
                                        {user.category}
                                    </div>
                                </div>

                                <div className="mt-auto w-full pt-4 border-t border-slate-800/50">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-slate-500">Resilience</span>
                                        <span className="text-sm font-bold text-white">{user.final_score}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${user.final_score}%` }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                            className={`h-full ${index === 0 ? 'bg-cyan-500' : 'bg-slate-400'
                                                }`}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between mt-3 text-[10px] text-slate-500">
                                        <div className="flex items-center gap-1">
                                            <Zap className="w-3 h-3 text-amber-500" />
                                            {Math.round(user.total_time / 1000)}s
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3 text-green-500" />
                                            VERIFIED
                                        </div>
                                    </div>
                                </div>

                                {index === 0 && (
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center animate-bounce shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                                        <Award className="w-5 h-5 text-slate-950" />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-slate-500 text-sm flex items-center justify-center gap-2">
                        <Shield className="w-4 h-4 text-cyan-500/50" />
                        Live Leaderboard data synchronized via Supabase Real-time Engine
                    </p>
                </div>
            </div>
        </section>
    );
}
