import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import {
  Users,
  TrendingUp,
  Activity,
  Target,
  Shield,
  RefreshCw,
  Eye,
  Brain
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDashboardStore } from '@/store';
import { getTopParticipants, computeRealAnalytics, getLast7DaysTrends, getVulnerabilityAnalysis, getRecentAssessments } from '@/lib/supabase';
import type { Participant, DailyAnalytics } from '@/types';

// Heatmap and Trend data now fetched from Supabase via setTrendData and setHeatmapData

const COLORS = {
  high: '#ef4444',
  moderate: '#f59e0b',
  low: '#22c55e',
  firewall: '#06b6d4',
};

export function LiveDashboard() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [analytics, setAnalytics] = useState<DailyAnalytics | null>(null);
  const [, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const [trendData, setTrendData] = useState<any[]>([]);
  const [heatmapData, setHeatmapData] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const { liveStats, updateLiveStats } = useDashboardStore();

  useEffect(() => {
    loadData();

    // Simulate live updates
    const interval = setInterval(() => {
      setLastUpdated(new Date());
      updateLiveStats({
        activeNow: Math.floor(Math.random() * 10) + 1,
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const [topParticipants, dailyAnalytics, sevenDayTrends, vulnAnalysis, recent] = await Promise.all([
      getTopParticipants(10),
      computeRealAnalytics(),
      getLast7DaysTrends(),
      getVulnerabilityAnalysis(),
      getRecentAssessments(6)
    ]);

    setParticipants(topParticipants);
    setAnalytics(dailyAnalytics);
    setTrendData(sevenDayTrends);
    setHeatmapData(vulnAnalysis);
    setRecentActivity(recent);

    if (dailyAnalytics) {
      updateLiveStats({
        totalParticipants: dailyAnalytics.total_participants,
        avgScore: dailyAnalytics.avg_score,
        topTrigger: dailyAnalytics.most_exploited_trigger,
      });
    }

    setIsLoading(false);
  };

  // Risk distribution data for pie chart
  const riskDistribution = analytics ? [
    { name: 'High Risk', value: analytics.risk_distribution.high_risk, color: COLORS.high },
    { name: 'Moderate Risk', value: analytics.risk_distribution.moderate_risk, color: COLORS.moderate },
    { name: 'Low Risk', value: analytics.risk_distribution.low_risk, color: COLORS.low },
    { name: 'Human Firewall', value: analytics.risk_distribution.human_firewall, color: COLORS.firewall },
  ] : [];

  return (
    <section className="relative min-h-screen py-12">
      {/* Background */}
      <div className="absolute inset-0 cyber-gradient cyber-grid-bg" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Live Intelligence <span className="heading-gradient">Dashboard</span>
            </h2>
            <p className="text-slate-400">
              Real-time cybersecurity resilience metrics
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Live
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              icon: Users,
              value: liveStats.totalParticipants.toString(),
              label: 'Total Participants',
              color: 'cyan'
            },
            {
              icon: TrendingUp,
              value: `${liveStats.avgScore}%`,
              label: 'Avg. Resilience',
              color: 'green'
            },
            {
              icon: Activity,
              value: liveStats.activeNow.toString(),
              label: 'Active Now',
              color: 'purple'
            },
            {
              icon: Target,
              value: liveStats.topTrigger.charAt(0).toUpperCase() + liveStats.topTrigger.slice(1),
              label: 'Top Exploit',
              color: 'amber'
            },
          ].map((stat, index) => {
            const colorClasses: Record<string, { bg: string; text: string }> = {
              cyan: { bg: 'bg-cyan-500/20', text: 'text-cyan-400' },
              green: { bg: 'bg-green-500/20', text: 'text-green-400' },
              purple: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
              amber: { bg: 'bg-amber-500/20', text: 'text-amber-400' },
            };
            const theme = colorClasses[stat.color] || colorClasses.cyan;

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-2xl p-5 hover-lift"
              >
                <div className={`w-10 h-10 rounded-xl ${theme.bg} flex items-center justify-center mb-3`}>
                  <stat.icon className={`w-5 h-5 ${theme.text}`} />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-xs text-slate-400">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Score Trend */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                Campus Resilience Trend
              </h3>
              <span className="text-xs text-slate-500">Last 7 days</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 15%)" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(220, 15%, 20%)' }}
                  />
                  <YAxis
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(220, 15%, 20%)' }}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(220, 18%, 6%)',
                      border: '1px solid hsl(220, 15%, 20%)',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    dot={{ fill: '#06b6d4', strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Risk Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-400" />
                Risk Distribution
              </h3>
              <span className="text-xs text-slate-500">Today</span>
            </div>
            <div className="h-64 flex items-center justify-center">
              {riskDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {riskDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(220, 18%, 6%)',
                        border: '1px solid hsl(220, 15%, 20%)',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-slate-500">No data available</div>
              )}
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              {riskDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-slate-400">{item.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Heatmap & Leaderboard Row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Scenario Heatmap */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Eye className="w-5 h-5 text-cyan-400" />
              Vulnerability by Scenario Type
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={heatmapData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 15%)" />
                  <XAxis
                    type="number"
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(220, 15%, 20%)' }}
                  />
                  <YAxis
                    dataKey="type"
                    type="category"
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(220, 15%, 20%)' }}
                    width={80}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(220, 18%, 6%)',
                      border: '1px solid hsl(220, 15%, 20%)',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="urgency" stackId="a" fill="#ef4444" />
                  <Bar dataKey="authority" stackId="a" fill="#f59e0b" />
                  <Bar dataKey="reward" stackId="a" fill="#22c55e" />
                  <Bar dataKey="fear" stackId="a" fill="#8b5cf6" />
                  <Bar dataKey="curiosity" stackId="a" fill="#06b6d4" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              {[
                { label: 'Urgency', color: '#ef4444' },
                { label: 'Authority', color: '#f59e0b' },
                { label: 'Reward', color: '#22c55e' },
                { label: 'Fear', color: '#8b5cf6' },
                { label: 'Curiosity', color: '#06b6d4' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-slate-400">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity Feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              Live Activity Feed
            </h3>
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <div className="text-slate-500 text-sm italic py-4 text-center">Waiting for new activity...</div>
              ) : recentActivity.map((act, index) => (
                <motion.div
                  key={act.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-start gap-4 p-3 rounded-xl bg-slate-800/30 border border-slate-700/30"
                >
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 \${
                    act.final_score >= 90 ? 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]' :
                    act.final_score >= 70 ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-white truncate">{act.name}</span>
                      <span className="text-[10px] font-mono text-slate-500 uppercase">
                        {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Scored <span className="text-cyan-400 font-bold">{act.final_score}%</span> ({act.category})
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/50">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Security Pulse</span>
                <span className="text-cyan-500 font-mono animate-pulse">● ACTIVE</span>
              </div>
            </div>
          </motion.div>

          {/* Top Performers (previously occupied this column) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Brain className="w-5 h-5 text-cyan-400" />
              Global Hall of Fame
            </h3>
            <div className="space-y-3">
              {participants.slice(0, 5).map((participant, index) => (
                <motion.div
                  key={participant.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-center gap-4 p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm \${index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                    index === 1 ? 'bg-slate-400/20 text-slate-300' :
                    index === 2 ? 'bg-amber-600/20 text-amber-500' :
                    'bg-slate-700 text-slate-400'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-white">{participant.name}</div>
                    <div className="text-xs text-slate-400">{participant.category}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-cyan-400">{participant.final_score}%</div>
                    <div className="text-xs text-slate-500">
                      {Math.round(participant.total_time / 1000)}s
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Last Updated */}
        <div className="text-center text-xs text-slate-500">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      </div>
    </section>
  );
}
