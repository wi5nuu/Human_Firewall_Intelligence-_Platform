// ============================================
// MEMBER DASHBOARD — Score History
// Human Firewall Intelligence Platform
// ============================================

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Shield, Trophy, Clock, Target, TrendingUp,
    RefreshCw, LogOut, Award, ChevronRight, Loader2,
    AlertTriangle, CheckCircle, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import type { RiskCategory } from '@/types';

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

    return (
        <section className="relative min-h-screen overflow-hidden">
            <div className="absolute inset-0 cyber-gradient cyber-grid-bg" />

            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-8 flex-wrap gap-4"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                            {profile?.name?.[0]?.toUpperCase() ?? '?'}
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">{profile?.name ?? 'Member'}</h1>
                            <p className="text-sm text-slate-400">{user?.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button onClick={onPlayAgain} className="btn-cyber px-6 py-2 rounded-xl flex items-center gap-2 text-sm">
                            <RefreshCw className="w-4 h-4" /> Mulai Challenge
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleSignOut}
                            className="border-slate-700 text-slate-400 hover:bg-slate-800 px-4 py-2 rounded-xl flex items-center gap-2 text-sm"
                        >
                            <LogOut className="w-4 h-4" /> Keluar
                        </Button>
                    </div>
                </motion.div>

                {/* Stats Overview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                >
                    {[
                        { label: 'Total Main', value: totalPlays, icon: Target, suffix: 'x' },
                        { label: 'Skor Terbaik', value: bestScore, icon: Trophy, suffix: '/100' },
                        { label: 'Rata-rata', value: avgScore, icon: TrendingUp, suffix: '/100' },
                        { label: 'Level', value: bestScore >= 91 ? 'Pro' : bestScore >= 71 ? 'Aman' : bestScore >= 41 ? 'Waspada' : 'Risiko', icon: Star, suffix: '' },
                    ].map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 + i * 0.05 }}
                                className="glass-card rounded-xl p-4 text-center"
                            >
                                <Icon className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-white">
                                    {stat.value}{stat.suffix}
                                </div>
                                <div className="text-xs text-slate-400">{stat.label}</div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* History */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card rounded-2xl p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Clock className="w-5 h-5 text-cyan-400" /> Riwayat Challenge
                        </h2>
                        <span className="text-xs text-slate-500">{totalPlays} sesi</span>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                        </div>
                    ) : history.length === 0 ? (
                        <div className="text-center py-12">
                            <Shield className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                            <p className="text-slate-400">Kamu belum pernah ikut challenge.</p>
                            <Button onClick={onPlayAgain} className="btn-cyber mt-4 px-6 py-2 rounded-xl">
                                Mulai Sekarang <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {history.map((item, i) => {
                                const cfg = categoryConfig[item.category] ?? categoryConfig['High Risk'];
                                const Icon = cfg.icon;
                                const isTop = item.final_score === bestScore && i === 0;
                                return (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.04 }}
                                        className={`flex items-center gap-4 p-4 rounded-xl border ${cfg.color} ${isTop ? 'ring-1 ring-cyan-500/40' : ''
                                            }`}
                                    >
                                        {isTop && (
                                            <Trophy className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                                        )}
                                        <Icon className={`w-5 h-5 flex-shrink-0 ${!isTop ? '' : 'hidden'}`} />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-white text-lg">{Math.round(item.final_score)}/100</span>
                                                <span className={`text-xs px-2 py-0.5 rounded-full border ${cfg.color}`}>{item.category}</span>
                                                {isTop && <span className="text-xs text-yellow-400">Best!</span>}
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                                                <span><Clock className="w-3 h-3 inline mr-0.5" />{formatTime(item.total_time_ms)}</span>
                                                <span>{formatDate(item.created_at)}</span>
                                            </div>
                                        </div>
                                        <Award className="w-6 h-6 text-slate-600" />
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
