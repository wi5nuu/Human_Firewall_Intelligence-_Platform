import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import {
  Trophy,
  Shield,
  AlertTriangle,
  CheckCircle,
  Download,
  RefreshCw,
  Share2,
  Clock,
  Target,
  Brain,
  TrendingUp,
  Zap,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
// Store hooks available for future use
import type { ScoreResult, RiskCategory } from '@/types';

interface ScoreDisplayProps {
  result: ScoreResult;
  onGeneratePDF?: () => void;
  onGenerateCertificate?: () => void;
  onRetry?: () => void;
  onShare?: () => void;
}

const categoryConfig: Record<RiskCategory, {
  color: string;
  bgColor: string;
  icon: typeof Shield;
  description: string;
}> = {
  'High Risk': {
    color: '#ef4444',
    bgColor: 'bg-red-500/20',
    icon: AlertTriangle,
    description: 'You are highly vulnerable to social engineering attacks. Immediate awareness training recommended.',
  },
  'Moderate Risk': {
    color: '#f59e0b',
    bgColor: 'bg-amber-500/20',
    icon: AlertTriangle,
    description: 'You have some awareness but need improvement in key areas.',
  },
  'Low Risk': {
    color: '#22c55e',
    bgColor: 'bg-green-500/20',
    icon: CheckCircle,
    description: 'You demonstrate good security awareness with minor vulnerabilities.',
  },
  'Human Firewall': {
    color: '#06b6d4',
    bgColor: 'bg-cyan-500/20',
    icon: Shield,
    description: 'Excellent! You are a Human Firewall with strong security instincts.',
  },
};

export function ScoreDisplay({ result, onGeneratePDF, onGenerateCertificate, onRetry, onShare }: ScoreDisplayProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const circleRef = useRef<SVGCircleElement>(null);

  const { total_score, category, metrics, recommendations } = result;
  const config = categoryConfig[category];
  const CategoryIcon = config.icon;

  // Animate score
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = total_score / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= total_score) {
        setAnimatedScore(total_score);
        clearInterval(timer);
        setTimeout(() => setShowDetails(true), 500);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [total_score]);

  // Radar chart data
  const radarData = [
    { subject: 'Urgency', A: metrics.vulnerability_breakdown.urgency_manipulation, fullMark: 100 },
    { subject: 'Authority', A: metrics.vulnerability_breakdown.authority_bias, fullMark: 100 },
    { subject: 'Reward', A: metrics.vulnerability_breakdown.reward_bait, fullMark: 100 },
    { subject: 'Emotion', A: metrics.vulnerability_breakdown.emotional_trigger, fullMark: 100 },
    { subject: 'Curiosity', A: metrics.vulnerability_breakdown.curiosity_trap, fullMark: 100 },
  ];

  // Time breakdown data
  const timeData = result.attempts.map((attempt, i) => ({
    name: `Q${i + 1}`,
    time: Math.round(attempt.response_time / 1000),
    correct: attempt.correct,
  }));

  // Calculate circumference for progress ring
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <section className="relative min-h-screen py-12">
      {/* Background */}
      <div className="absolute inset-0 cyber-gradient" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-6">
              <Trophy className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-100/80">Assessment Complete</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Your Security Profile
            </h2>
            <p className="text-slate-400">
              Based on your responses across {result.attempts.length} scenarios
            </p>
          </motion.div>

          {/* Main Score Card */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Score Circle */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-3xl p-8 flex flex-col items-center justify-center"
            >
              <div className="relative">
                {/* Progress Ring */}
                <svg width="200" height="200" className="transform -rotate-90">
                  {/* Background circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r={radius}
                    fill="none"
                    stroke="hsl(220, 15%, 15%)"
                    strokeWidth="12"
                  />
                  {/* Progress circle */}
                  <circle
                    ref={circleRef}
                    cx="100"
                    cy="100"
                    r={radius}
                    fill="none"
                    stroke={config.color}
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-100"
                    style={{
                      filter: `drop-shadow(0 0 10px ${config.color}50)`,
                    }}
                  />
                </svg>

                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold text-white">{animatedScore}%</span>
                  <span className="text-sm text-slate-400 mt-1">Score</span>
                </div>
              </div>

              {/* Category Badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className={`mt-6 px-6 py-3 rounded-full ${config.bgColor} flex items-center gap-2`}
              >
                <CategoryIcon className="w-5 h-5" style={{ color: config.color }} />
                <span className="font-semibold" style={{ color: config.color }}>
                  {category}
                </span>
              </motion.div>

              <p className="text-center text-slate-400 mt-4 max-w-sm">
                {config.description}
              </p>
            </motion.div>

            {/* Radar Chart */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="glass-card rounded-3xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-cyan-400" />
                Vulnerability Analysis
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="hsl(220, 15%, 20%)" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                    />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 100]}
                      tick={false}
                      axisLine={false}
                    />
                    <Radar
                      name="Your Score"
                      dataKey="A"
                      stroke={config.color}
                      strokeWidth={2}
                      fill={config.color}
                      fillOpacity={0.3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-slate-500 text-center mt-2">
                Higher values indicate better resistance to manipulation techniques
              </p>
            </motion.div>
          </div>

          {/* Metrics Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showDetails ? 1 : 0, y: showDetails ? 0 : 20 }}
            className="grid md:grid-cols-3 gap-4 mb-8"
          >
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                  <Target className="w-5 h-5 text-cyan-400" />
                </div>
                <span className="text-slate-400 text-sm">Accuracy</span>
              </div>
              <div className="text-3xl font-bold text-white">{metrics.decision_accuracy}%</div>
              <div className="text-xs text-slate-500 mt-1">
                {result.attempts.filter(a => a.correct).length}/{result.attempts.length} correct
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-purple-400" />
                </div>
                <span className="text-slate-400 text-sm">Avg Response</span>
              </div>
              <div className="text-3xl font-bold text-white">
                {Math.round(metrics.avg_response_time / 1000)}s
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Per scenario
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-amber-400" />
                </div>
                <span className="text-slate-400 text-sm">Hesitations</span>
              </div>
              <div className="text-3xl font-bold text-white">{metrics.hesitation_patterns}</div>
              <div className="text-xs text-slate-500 mt-1">
                Slow responses (&gt;10s)
              </div>
            </div>
          </motion.div>

          {/* Time Breakdown Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showDetails ? 1 : 0, y: showDetails ? 0 : 20 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-3xl p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              Response Time Breakdown
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeData}>
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(220, 15%, 20%)' }}
                  />
                  <YAxis
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(220, 15%, 20%)' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(220, 18%, 6%)',
                      border: '1px solid hsl(220, 15%, 20%)',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="time" radius={[4, 4, 0, 0]}>
                    {timeData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.correct ? '#22c55e' : '#ef4444'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-500" />
                <span className="text-xs text-slate-400">Correct</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-red-500" />
                <span className="text-xs text-slate-400">Incorrect</span>
              </div>
            </div>
          </motion.div>

          {/* Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showDetails ? 1 : 0, y: showDetails ? 0 : 20 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-3xl p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              Security Recommendations
            </h3>
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/50"
                >
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ChevronRight className="w-3 h-3 text-cyan-400" />
                  </div>
                  <span className="text-slate-300 text-sm">{rec}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showDetails ? 1 : 0, y: showDetails ? 0 : 20 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              onClick={onGeneratePDF}
              className="btn-cyber px-8 py-6 text-base rounded-xl"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Report
            </Button>
            {onGenerateCertificate && (result.category === 'Human Firewall' || result.category === 'Low Risk') && (
              <Button
                variant="outline"
                onClick={onGenerateCertificate}
                className="btn-cyber px-8 py-6 text-base rounded-xl border-cyan-500/30 text-cyan-100 bg-cyan-900/50 hover:bg-cyan-500/30"
              >
                <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                Get Certificate
              </Button>
            )}
            <Button
              variant="outline"
              onClick={onShare}
              className="px-8 py-6 text-base rounded-xl border-cyan-500/30 text-cyan-100 hover:bg-cyan-500/10"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share Results
            </Button>
            <Button
              variant="outline"
              onClick={onRetry}
              className="px-8 py-6 text-base rounded-xl border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Try Again
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
