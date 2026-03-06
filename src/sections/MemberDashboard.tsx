import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Shield, Trophy, Clock, Target, TrendingUp,
    RefreshCw, LogOut, ChevronRight, Loader2,
    AlertTriangle, CheckCircle, Sparkles, Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useDeviceType } from '@/hooks/useDeviceType';
import { supabase } from '@/lib/supabase';
import { generateCertificate, generateVerificationCode } from '@/lib/pdfGenerator';
import type { RiskCategory, Participant, ScoreResult } from '@/types';

interface ParticipantHistory {
    id: string;
    final_score: number;
    category: RiskCategory;
    total_time_ms: number;
    created_at: string;
}

interface MemberDashboardProps {
    onPlayAgain: () => void;
    onNavigate: (view: string) => void;
}

const categoryConfig: Record<RiskCategory, { color: string; icon: typeof Shield; label: string }> = {
    'Human Firewall': { color: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30', icon: Shield, label: 'Human Firewall' },
    'Low Risk': { color: 'text-green-400 bg-green-400/10 border-green-400/30', icon: CheckCircle, label: 'Low Risk' },
    'Moderate Risk': { color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30', icon: AlertTriangle, label: 'Moderate Risk' },
    'High Risk': { color: 'text-red-400 bg-red-400/10 border-red-400/30', icon: AlertTriangle, label: 'High Risk' },
};

function formatTime(ms: number): string {
    const sec = Math.floor(ms / 1000);
    const min = Math.floor(sec / 60);
    return `${min}m ${sec % 60}s`;
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
}

export function MemberDashboard({ onPlayAgain, onNavigate }: MemberDashboardProps) {
    const { user, profile, signOut } = useAuth();
    const [history, setHistory] = useState<ParticipantHistory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { isDesktop, isMobile } = useDeviceType();

    useEffect(() => {
        if (!user || !supabase) { setIsLoading(false); return; }
        supabase
            .from('participants')
            .select('id, final_score, category, total_time_ms, created_at')
            .eq('user_id', user.id)
            .gt('final_score', 0)
            .order('created_at', { ascending: false })
            .limit(20)
            .then(({ data }) => {
                setHistory((data as ParticipantHistory[]) ?? []);
                setIsLoading(false);
            });
    }, [user]);

    const bestScore = history.length ? Math.max(...history.map(h => h.final_score)) : 0;
    const avgScore = history.length
        ? Math.round(history.reduce((s, h) => s + h.final_score, 0) / history.length)
        : 0;
    const totalPlays = history.length;

    const handleSignOut = async () => {
        await signOut();
        onNavigate('home');
    };

    const handleDownloadCertificate = async (item: ParticipantHistory) => {
        if (!profile) return;
        const participant: Participant = {
            id: item.id,
            name: profile.name,
            final_score: item.final_score,
            category: item.category,
            total_time: item.total_time_ms,
            created_at: item.created_at
        };
        const scoreResult: ScoreResult = {
            total_score: item.final_score,
            category: item.category,
            metrics: {
                decision_accuracy: item.final_score,
                avg_response_time: item.total_time_ms / 10,
                hesitation_patterns: 0,
                difficulty_multiplier: 1,
                total_time: item.total_time_ms,
                vulnerability_breakdown: { urgency_manipulation: 0, authority_bias: 0, reward_bait: 0, emotional_trigger: 0, curiosity_trap: 0 }
            },
            attempts: [],
            recommendations: ["Keep maintaining your cybersecurity awareness!"]
        };
        await generateCertificate({
            participant, scoreResult, generated_at: new Date().toISOString(), verification_code: generateVerificationCode()
        });
    };

    return (
        <section className={`relative min-h-screen overflow-hidden ${isDesktop ? 'py-20' : 'pt-28 pb-32 px-4'}`}>
            <div className={`absolute inset-0 ${isDesktop ? 'cyber-gradient cyber-grid-bg' : 'bg-slate-950'}`} />

            <div className="relative z-10 container mx-auto max-w-6xl">
                {/* Adaptive Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center justify-between mb-10 flex-wrap gap-6 ${isMobile ? 'flex-col items-start' : ''}`}
                >
                    <div className="flex items-center gap-5">
                        <div className={`rounded-${isDesktop ? '2xl' : 'full'} bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black shadow-xl shadow-indigo-600/20 ${isDesktop ? 'w-16 h-16 text-2xl' : 'w-14 h-14 text-xl'}`}>
                            {profile?.name?.[0]?.toUpperCase() ?? '?'}
                        </div>
                        <div>
                            <h1 className={`${isDesktop ? 'text-4xl' : 'text-3xl'} font-black text-white tracking-tight`}>{profile?.name || 'Pilot'}</h1>
                            <p className="text-slate-500 font-mono text-sm tracking-tighter">Human Firewall Intelligence Unit</p>
                        </div>
                    </div>

                    <div className={`flex items-center gap-4 ${isMobile ? 'w-full' : ''}`}>
                        <Button onClick={onPlayAgain} className={`${isDesktop ? 'rounded-2xl px-8 flex-1' : 'rounded-full px-6 flex-1'} bg-cyan-500 hover:bg-cyan-400 text-black font-black h-12 flex items-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all`}>
                            <RefreshCw className="w-4 h-4" /> RETAKE SIMULATION
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleSignOut}
                            className={`${isDesktop ? 'rounded-2xl' : 'rounded-full'} border-white/10 text-slate-400 hover:bg-white/5 h-12 px-6 flex items-center gap-2 transition-all`}
                        >
                            <LogOut className="w-4 h-4" />
                        </Button>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <div className={`grid ${isDesktop ? 'grid-cols-4 gap-6' : 'grid-cols-2 gap-4'} mb-10`}>
                    {[
                        { label: 'SIMULATIONS', value: totalPlays, icon: Target, suffix: '', color: 'text-cyan-400' },
                        { label: 'BEST SCORE', value: bestScore, icon: Trophy, suffix: '', color: 'text-yellow-400' },
                        { label: 'AVG SCORE', value: avgScore, icon: TrendingUp, suffix: '', color: 'text-emerald-400' },
                        { label: 'PROFICIENCY', value: bestScore >= 91 ? 'PRO' : bestScore >= 71 ? 'SECURE' : 'WEAK', icon: Sparkles, suffix: '', color: 'text-indigo-400' },
                    ].map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 + i * 0.05 }}
                                className={`glass-card p-6 border-white/5 bg-white/[0.02] flex flex-col items-center text-center transition-all hover:bg-white/[0.05] ${isDesktop ? 'rounded-[2.5rem]' : 'rounded-[2rem]'}`}
                            >
                                <Icon className={`w-6 h-6 ${stat.color} mb-3`} />
                                <div className="text-3xl font-black text-white">{stat.value}{stat.suffix}</div>
                                <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1">{stat.label}</div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Performance History */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className={`glass-card p-8 bg-white/[0.01] border-white/5 shadow-2xl relative overflow-hidden ${isDesktop ? 'rounded-[3rem]' : 'rounded-[2.5rem]'}`}
                >
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[80px] pointer-events-none" />

                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-black text-white flex items-center gap-3">
                            <Clock className="w-6 h-6 text-cyan-400" /> TIMELINE HISTORY
                        </h2>
                        <div className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-black text-slate-500 tracking-widest uppercase">
                            {totalPlays} SESSIONS
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-4">
                            <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
                            <p className="text-slate-500 font-mono text-xs tracking-tighter">Synchronizing Intelligence Data...</p>
                        </div>
                    ) : history.length === 0 ? (
                        <div className="text-center py-20 flex flex-col items-center">
                            <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center mb-6">
                                <Shield className="w-10 h-10 text-slate-700" />
                            </div>
                            <h3 className="text-white font-bold text-lg mb-2">No Intelligence Logs Found</h3>
                            <p className="text-slate-500 max-w-xs mb-8">Participate in your first simulation challenge to begin building your human firewall history.</p>
                            <Button onClick={onPlayAgain} className="btn-cyber px-8 h-14 rounded-full font-black text-sm">
                                START CHALLENGE <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {history.map((item, i) => {
                                const cfg = categoryConfig[item.category] ?? categoryConfig['High Risk'];
                                const Icon = cfg.icon;
                                const isTop = item.final_score === bestScore && i === 0;
                                return (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className={`group relative flex items-center gap-6 p-6 transition-all border ${isDesktop ? 'rounded-[2.5rem]' : 'rounded-[2rem]'} ${isTop ? 'bg-cyan-500/5 border-cyan-500/20' : 'bg-white/[0.02] border-white/5 hover:bg-white/5'}`}
                                    >
                                        <div className={`w-14 h-14 rounded-3xl flex items-center justify-center ${isTop ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'bg-slate-900 text-slate-500'}`}>
                                            {isTop ? <Trophy className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="font-black text-2xl text-white">{Math.round(item.final_score)}%</span>
                                                <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${cfg.color}`}>{item.category}</span>
                                                {isTop && <span className="text-[10px] font-bold text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-md">NEW BEST!</span>}
                                            </div>
                                            <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                                                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {formatTime(item.total_time_ms)}</span>
                                                <span className="flex items-center gap-1.5 uppercase font-mono tracking-tighter opacity-60">{formatDate(item.created_at)}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                onClick={() => handleDownloadCertificate(item)}
                                                className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isTop ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                                            >
                                                <Download className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </motion.div>
            </div>
        </section>
    );
}
