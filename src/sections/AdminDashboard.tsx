// ============================================
// ADMIN DASHBOARD
// Human Firewall Intelligence Platform
// ============================================

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Shield, Users, TrendingUp, Award, Download,
    Loader2, LogOut, Search, ChevronUp, ChevronDown,
    AlertTriangle, CheckCircle, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import type { RiskCategory } from '@/types';

interface ParticipantRow {
    id: string;
    name: string;
    email: string;
    final_score: number;
    category: RiskCategory;
    total_time_ms: number;
    created_at: string;
    user_id: string | null;
}

type SortKey = 'name' | 'final_score' | 'created_at';
type SortDir = 'asc' | 'desc';

function formatTime(ms: number): string {
    const sec = Math.floor(ms / 1000);
    const min = Math.floor(sec / 60);
    return `${min}m ${sec % 60}s`;
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('id-ID', {
        day: '2-digit', month: 'short', year: 'numeric',
    });
}

const categoryColors: Record<RiskCategory, string> = {
    'Human Firewall': 'text-cyan-400 bg-cyan-400/10',
    'Low Risk': 'text-green-400 bg-green-400/10',
    'Moderate Risk': 'text-yellow-400 bg-yellow-400/10',
    'High Risk': 'text-red-400 bg-red-400/10',
};

interface AdminDashboardProps {
    onNavigate: (view: string) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
    const { profile, signOut } = useAuth();
    const [participants, setParticipants] = useState<ParticipantRow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState<SortKey>('created_at');
    const [sortDir, setSortDir] = useState<SortDir>('desc');
    const [categoryFilter, setCategoryFilter] = useState<RiskCategory | 'all'>('all');

    const fetchData = () => {
        if (!supabase) { setIsLoading(false); return; }
        setIsLoading(true);
        supabase
            .from('participants')
            .select('id, name, email, final_score, category, total_time_ms, created_at, user_id')
            .order('created_at', { ascending: false })
            .then(({ data }) => {
                setParticipants((data as ParticipantRow[]) ?? []);
                setIsLoading(false);
            });
    };

    useEffect(() => { fetchData(); }, []);

    // Filtered & sorted
    const filtered = participants
        .filter(p => {
            const matchSearch = !search ||
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.email?.toLowerCase().includes(search.toLowerCase());
            const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
            return matchSearch && matchCat;
        })
        .sort((a, b) => {
            let va: string | number = a[sortKey];
            let vb: string | number = b[sortKey];
            if (typeof va === 'string') va = va.toLowerCase();
            if (typeof vb === 'string') vb = vb.toLowerCase();
            if (va < vb) return sortDir === 'asc' ? -1 : 1;
            if (va > vb) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });

    const handleSort = (key: SortKey) => {
        if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortKey(key); setSortDir('desc'); }
    };

    // Stats
    const total = participants.length;
    const avg = total ? Math.round(participants.reduce((s, p) => s + p.final_score, 0) / total) : 0;
    const topCategory = (cat: RiskCategory) => participants.filter(p => p.category === cat).length;
    const registered = participants.filter(p => p.user_id).length;

    // CSV Export
    const exportCSV = () => {
        const headers = ['Nama', 'Email', 'Skor', 'Kategori', 'Waktu', 'Tanggal'];
        const rows = filtered.map(p => [
            `"${p.name}"`, `"${p.email ?? ''}"`, p.final_score, `"${p.category}"`,
            `"${formatTime(p.total_time_ms)}"`, `"${formatDate(p.created_at)}"`,
        ]);
        const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `hfip-results-${Date.now()}.csv`; a.click();
        URL.revokeObjectURL(url);
    };

    const SortIcon = ({ col }: { col: SortKey }) =>
        sortKey === col
            ? sortDir === 'asc' ? <ChevronUp className="w-3 h-3 inline" /> : <ChevronDown className="w-3 h-3 inline" />
            : null;

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
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Shield className="w-6 h-6 text-cyan-400" /> Admin Dashboard
                        </h1>
                        <p className="text-xs text-slate-400 mt-1">Selamat datang, {profile?.name} — akun admin terverifikasi</p>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={fetchData} variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 px-3 py-2 rounded-xl text-sm flex items-center gap-2">
                            <RefreshCw className="w-4 h-4" /> Refresh
                        </Button>
                        <Button onClick={exportCSV} variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 px-3 py-2 rounded-xl text-sm flex items-center gap-2">
                            <Download className="w-4 h-4" /> Export CSV
                        </Button>
                        <Button
                            variant="outline"
                            onClick={async () => { await signOut(); onNavigate('home'); }}
                            className="border-slate-700 text-slate-400 hover:bg-slate-800 px-3 py-2 rounded-xl text-sm flex items-center gap-2"
                        >
                            <LogOut className="w-4 h-4" /> Keluar
                        </Button>
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8"
                >
                    {[
                        { label: 'Total Peserta', value: total, icon: Users, color: 'text-blue-400' },
                        { label: 'Sudah Login', value: registered, icon: Shield, color: 'text-cyan-400' },
                        { label: 'Rata-rata Skor', value: `${avg}/100`, icon: TrendingUp, color: 'text-purple-400' },
                        { label: 'Human Firewall', value: topCategory('Human Firewall'), icon: Award, color: 'text-cyan-400' },
                        { label: 'High Risk', value: topCategory('High Risk'), icon: AlertTriangle, color: 'text-red-400' },
                    ].map((s, i) => {
                        const Icon = s.icon;
                        return (
                            <motion.div
                                key={s.label}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 + i * 0.05 }}
                                className="glass-card rounded-xl p-4 text-center"
                            >
                                <Icon className={`w-5 h-5 ${s.color} mx-auto mb-2`} />
                                <div className="text-2xl font-bold text-white">{s.value}</div>
                                <div className="text-xs text-slate-400">{s.label}</div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Category Distribution */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card rounded-2xl p-6 mb-6"
                >
                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-cyan-400" /> Distribusi Kategori
                    </h3>
                    <div className="grid grid-cols-4 gap-3">
                        {(['Human Firewall', 'Low Risk', 'Moderate Risk', 'High Risk'] as RiskCategory[]).map(cat => {
                            const count = topCategory(cat);
                            const pct = total ? Math.round((count / total) * 100) : 0;
                            return (
                                <div key={cat} className="text-center">
                                    <div className={`text-lg font-bold ${categoryColors[cat].split(' ')[0]}`}>{pct}%</div>
                                    <div className="text-xs text-slate-400 mt-0.5">{cat}</div>
                                    <div className={`mt-1 h-1 rounded-full ${categoryColors[cat].split(' ')[1]}`} style={{ width: `${pct}%` }} />
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Filter & Search */}
                <div className="flex flex-wrap gap-3 mb-4">
                    <div className="relative flex-1 min-w-48">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Cari nama atau email..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="pl-10 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 rounded-xl"
                        />
                    </div>
                    <div className="flex gap-2">
                        {(['all', 'Human Firewall', 'Low Risk', 'Moderate Risk', 'High Risk'] as const).map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCategoryFilter(cat)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border
                  ${categoryFilter === cat
                                        ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                                        : 'border-slate-700 text-slate-400 hover:border-slate-600'
                                    }`}
                            >
                                {cat === 'all' ? 'Semua' : cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card rounded-2xl overflow-hidden"
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-800 bg-slate-900/50">
                                        <th className="px-4 py-3 text-left text-slate-400 font-medium">
                                            <button onClick={() => handleSort('name')} className="flex items-center gap-1 hover:text-white">
                                                Nama <SortIcon col="name" />
                                            </button>
                                        </th>
                                        <th className="px-4 py-3 text-left text-slate-400 font-medium">Email</th>
                                        <th className="px-4 py-3 text-left text-slate-400 font-medium">
                                            <button onClick={() => handleSort('final_score')} className="flex items-center gap-1 hover:text-white">
                                                Skor <SortIcon col="final_score" />
                                            </button>
                                        </th>
                                        <th className="px-4 py-3 text-left text-slate-400 font-medium">Kategori</th>
                                        <th className="px-4 py-3 text-left text-slate-400 font-medium">Waktu</th>
                                        <th className="px-4 py-3 text-left text-slate-400 font-medium">
                                            <button onClick={() => handleSort('created_at')} className="flex items-center gap-1 hover:text-white">
                                                Tanggal <SortIcon col="created_at" />
                                            </button>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="text-center py-10 text-slate-500">
                                                Tidak ada data
                                            </td>
                                        </tr>
                                    ) : filtered.map((p, i) => (
                                        <motion.tr
                                            key={p.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: i * 0.02 }}
                                            className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                                        >
                                            <td className="px-4 py-3 text-white font-medium">{p.name}</td>
                                            <td className="px-4 py-3 text-slate-400">{p.email ?? '—'}</td>
                                            <td className="px-4 py-3">
                                                <span className="text-white font-bold">{Math.round(p.final_score)}</span>
                                                <span className="text-slate-500">/100</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`text-xs px-2 py-1 rounded-full ${categoryColors[p.category]}`}>
                                                    {p.category}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-slate-400">{formatTime(p.total_time_ms)}</td>
                                            <td className="px-4 py-3 text-slate-400">{formatDate(p.created_at)}</td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    <div className="px-4 py-3 border-t border-slate-800 text-xs text-slate-500 flex items-center justify-between">
                        <span>Menampilkan {filtered.length} dari {total} peserta</span>
                        <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-cyan-400" /> Data dilindungi RLS</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
