// ============================================
// SUPABASE CLIENT - Database Integration
// Human Firewall Intelligence Platform v3.0
// ============================================

import { createClient } from '@supabase/supabase-js';
import {
  allScenarios,
  getRandomScenarios,
  getMixedScenarios,
  getScenariosByType,
  scenarioStats
} from './scenariosDatabase';
import type {
  Participant,
  Scenario,
  ScenarioAttempt,
  DailyAnalytics
} from '@/types';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create client only if credentials are available
export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Flag to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return supabase !== null;
};

// Export scenario stats
export { scenarioStats };

// ============================================
// PARTICIPANT OPERATIONS
// ============================================

export async function createParticipant(
  name: string,
  email?: string,
  user_id?: string
): Promise<Participant | null> {
  if (!supabase) {
    // Fallback: Return mock participant
    return {
      id: `local_${Date.now()}`,
      name,
      email,
      final_score: 0,
      category: 'High Risk',
      total_time: 0,
      created_at: new Date().toISOString(),
    };
  }

  try {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Supabase insert timeout')), 5000);
    });

    const { data, error } = await Promise.race([
      supabase
        .from('participants')
        .insert([{ name, email, final_score: 0, category: 'High Risk', total_time_ms: 0, user_id }])
        .select()
        .single(),
      timeoutPromise
    ]) as any;

    if (error) {
      console.error('Supabase error detail:', JSON.stringify(error));
      throw error;
    }
    // Map DB column names back to frontend type
    const row = data as any;
    return {
      ...row,
      total_time: row.total_time_ms ?? row.total_time ?? 0,
    } as Participant;
  } catch (error) {
    console.warn('Error creating participant (falling back to mock):', error);
    return {
      id: `local_fallback_${Date.now()}`,
      name,
      email,
      final_score: 0,
      category: 'High Risk',
      total_time: 0,
      created_at: new Date().toISOString(),
    };
  }
}

export async function updateParticipantScore(
  participantId: string,
  score: number,
  category: string,
  totalTime: number
): Promise<boolean> {
  if (!supabase) return true; // Fallback success

  try {
    const { error } = await supabase
      .from('participants')
      .update({ final_score: score, category, total_time_ms: totalTime })
      .eq('id', participantId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating participant:', error);
    return false;
  }
}

export async function getTopBySpeed(limit: number = 10): Promise<Participant[]> {
  if (!supabase) return generateMockParticipants(limit);
  try {
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .gt('final_score', 0)
      .order('total_time_ms', { ascending: true })
      .limit(limit);
    if (error) throw error;
    return (data ?? []).map((r: any) => ({ ...r, total_time: r.total_time_ms ?? r.total_time ?? 0 })) as Participant[];
  } catch (e) {
    console.error('getTopBySpeed error:', e);
    return generateMockParticipants(limit);
  }
}

export async function getTopByAccuracy(limit: number = 10): Promise<Participant[]> {
  if (!supabase) return generateMockParticipants(limit);
  try {
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .gte('final_score', 90)
      .order('final_score', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []).map((r: any) => ({ ...r, total_time: r.total_time_ms ?? r.total_time ?? 0 })) as Participant[];
  } catch (e) {
    console.error('getTopByAccuracy error:', e);
    return generateMockParticipants(limit);
  }
}

export async function getTodayTopParticipants(limit: number = 10): Promise<Participant[]> {
  if (!supabase) return generateMockParticipants(limit);
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .gte('created_at', todayStart.toISOString())
      .order('final_score', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []).map((r: any) => ({ ...r, total_time: r.total_time_ms ?? r.total_time ?? 0 })) as Participant[];
  } catch (e) {
    console.error('getTodayTopParticipants error:', e);
    return generateMockParticipants(limit);
  }
}

export async function computeRealAnalytics(): Promise<DailyAnalytics | null> {
  if (!supabase) return generateMockAnalytics();
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const { data, error } = await supabase
      .from('participants')
      .select('final_score, category, created_at')
      .gte('created_at', todayStart.toISOString());
    if (error || !data || data.length === 0) return generateMockAnalytics();
    const total_participants = data.length;
    const avg_score = Math.round(data.reduce((s: number, p: any) => s + (p.final_score || 0), 0) / total_participants);
    const dist: Record<string, number> = { high_risk: 0, moderate_risk: 0, low_risk: 0, human_firewall: 0 };
    data.forEach((p: any) => {
      if (p.category === 'High Risk') dist.high_risk++;
      else if (p.category === 'Moderate Risk') dist.moderate_risk++;
      else if (p.category === 'Low Risk') dist.low_risk++;
      else if (p.category === 'Human Firewall') dist.human_firewall++;
    });
    return {
      date: todayStart.toISOString().split('T')[0],
      avg_score,
      total_participants,
      most_exploited_trigger: 'urgency',
      risk_distribution: dist as any,
    };
  } catch (e) {
    console.error('computeRealAnalytics error:', e);
    return generateMockAnalytics();
  }
}

export async function getTopParticipants(limit: number = 10): Promise<Participant[]> {
  if (!supabase) {
    // Return mock data
    return generateMockParticipants(limit);
  }

  try {
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .order('final_score', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data ?? []).map((r: any) => ({ ...r, total_time: r.total_time_ms ?? r.total_time ?? 0 })) as Participant[];
  } catch (error) {
    console.error('Error fetching participants:', error);
    return generateMockParticipants(limit);
  }
}

// ============================================
// SCENARIO OPERATIONS
// ============================================

export function getScenarios(
  type?: 'email' | 'whatsapp' | 'instagram',
  difficulty?: 'Easy' | 'Medium' | 'Advanced' | 'Adaptive'
): Scenario[] {
  let scenarios = [...allScenarios];

  if (type) {
    scenarios = scenarios.filter(s => s.type === type);
  }

  if (difficulty) {
    scenarios = scenarios.filter(s => s.difficulty === difficulty);
  }

  return scenarios;
}

export function getScenariosForSimulation(count: number = 5): Scenario[] {
  // Get mixed scenarios ensuring variety
  return getMixedScenarios(count);
}

// ============================================
// ATTEMPT OPERATIONS
// ============================================

export async function saveAttempt(attempt: ScenarioAttempt): Promise<boolean> {
  if (!supabase) return true; // Fallback success

  try {
    // Map frontend field names to DB column names
    const dbAttempt = {
      participant_id: attempt.participant_id,
      scenario_id: attempt.scenario_id,
      scenario_type: attempt.scenario_type,
      manipulation_type: attempt.manipulation_type,
      user_action: attempt.user_action,
      is_correct: attempt.correct,
      response_time_ms: attempt.response_time,
      hesitation_time_ms: attempt.hesitation_time ?? 0,
    };
    const { error } = await supabase
      .from('scenario_attempts')
      .insert([dbAttempt]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error saving attempt:', error);
    return false;
  }
}

// ============================================
// ANALYTICS OPERATIONS
// ============================================

export async function getDailyAnalytics(): Promise<DailyAnalytics | null> {
  if (!supabase) {
    return generateMockAnalytics();
  }

  try {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('analytics_daily')
      .select('*')
      .eq('date', today)
      .single();

    if (error) throw error;
    return data as DailyAnalytics;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return generateMockAnalytics();
  }
}
// --- RECENT ACTIVITY FEED ---
export async function getRecentAssessments(limit = 10) {
  if (!supabase) return generateMockParticipants(limit);
  try {
    const { data, error } = await supabase
      .from('participants')
      .select('id, name, final_score, category, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data ?? [];
  } catch (error) {
    console.error('Error fetching recent assessments:', error);
    return generateMockParticipants(limit);
  }
}

// --- HISTORICAL TRENDS (Last 7 Days) ---
export async function getLast7DaysTrends() {
  if (!supabase) return [
    { date: 'Mon', score: 62, participants: 45 },
    { date: 'Tue', score: 65, participants: 52 },
    { date: 'Wed', score: 63, participants: 48 },
    { date: 'Thu', score: 68, participants: 61 },
    { date: 'Fri', score: 70, participants: 58 },
    { date: 'Sat', score: 67, participants: 42 },
    { date: 'Sun', score: 72, participants: 38 },
  ];

  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data, error } = await supabase
      .from('participants')
      .select('created_at, final_score')
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: true });

    if (error) throw error;
    if (!data) return [];

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const grouped: Record<string, { totalScore: number; count: number; date: string }> = {};

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayLabel = days[d.getDay()];
      grouped[dayLabel] = { totalScore: 0, count: 0, date: dayLabel };
    }

    data.forEach(p => {
      const dayLabel = days[new Date(p.created_at).getDay()];
      if (grouped[dayLabel]) {
        grouped[dayLabel].totalScore += p.final_score;
        grouped[dayLabel].count += 1;
      }
    });

    return Object.values(grouped);
  } catch (error) {
    console.error('Error fetching 7-day trends:', error);
    return [];
  }
}

// --- VULNERABILITY ANALYSIS ---
export async function getVulnerabilityAnalysis() {
  if (!supabase) return [
    { type: 'Email', urgency: 35, authority: 45, reward: 60, fear: 40, curiosity: 55 },
    { type: 'WhatsApp', urgency: 50, authority: 30, reward: 70, fear: 55, curiosity: 45 },
    { type: 'Instagram', urgency: 40, authority: 25, reward: 80, fear: 35, curiosity: 65 },
  ];

  try {
    const { data, error } = await supabase
      .from('scenario_attempts')
      .select('scenario_type, is_correct, manipulation_type');

    if (error) throw error;
    if (!data) return [];

    const analysis: Record<string, any> = {
      'email': { urgency: 0, authority: 0, reward: 0, fear: 0, curiosity: 0, total: 0 },
      'whatsapp': { urgency: 0, authority: 0, reward: 0, fear: 0, curiosity: 0, total: 0 },
      'instagram': { urgency: 0, authority: 0, reward: 0, fear: 0, curiosity: 0, total: 0 }
    };

    data.forEach(attempt => {
      const type = attempt.scenario_type.toLowerCase();
      if (analysis[type]) {
        analysis[type].total += 1;
        if (!attempt.is_correct) {
          const mType = (attempt.manipulation_type || '').toLowerCase();
          if (mType.includes('urgency')) analysis[type].urgency += 1;
          if (mType.includes('authority')) analysis[type].authority += 1;
          if (mType.includes('reward') || mType.includes('prize')) analysis[type].reward += 1;
          if (mType.includes('fear') || mType.includes('alert')) analysis[type].fear += 1;
          if (mType.includes('curiosity')) analysis[type].curiosity += 1;
        }
      }
    });

    return Object.entries(analysis).map(([type, stats]: [string, any]) => ({
      type: type.charAt(0).toUpperCase() + type.slice(1),
      urgency: stats.total ? Math.round((stats.urgency / stats.total) * 100) : 0,
      authority: stats.total ? Math.round((stats.authority / stats.total) * 100) : 0,
      reward: stats.total ? Math.round((stats.reward / stats.total) * 100) : 0,
      fear: stats.total ? Math.round((stats.fear / stats.total) * 100) : 0,
      curiosity: stats.total ? Math.round((stats.curiosity / stats.total) * 100) : 0,
    }));
  } catch (error) {
    console.error('Error fetching vulnerability analysis:', error);
    return [];
  }
}

// ============================================
// MOCK DATA GENERATORS (Fallback)
// ============================================

function generateMockParticipants(count: number): Participant[] {
  const names = [
    'Alex Chen', 'Sarah Johnson', 'Michael Park', 'Emma Wilson',
    'David Kim', 'Lisa Anderson', 'James Brown', 'Maria Garcia',
    'Robert Lee', 'Jennifer Martinez', 'William Taylor', 'Amanda White',
    'Christopher Davis', 'Jessica Thompson', 'Daniel Moore'
  ];

  const categories = ['High Risk', 'Moderate Risk', 'Low Risk', 'Human Firewall'];

  return names.slice(0, count).map((name, i) => ({
    id: `mock_${i}`,
    name,
    final_score: Math.floor(Math.random() * 40) + 60,
    category: categories[Math.floor(Math.random() * categories.length)] as any,
    total_time: Math.floor(Math.random() * 300000),
    created_at: new Date(Date.now() - Math.random() * 86400000).toISOString(),
  }));
}

function generateMockAnalytics(): DailyAnalytics {
  return {
    date: new Date().toISOString().split('T')[0],
    avg_score: 68,
    total_participants: 156,
    most_exploited_trigger: 'urgency',
    risk_distribution: {
      high_risk: 45,
      moderate_risk: 52,
      low_risk: 38,
      human_firewall: 21,
    },
  };
}

// ============================================
// PRE-GENERATED SCENARIOS (Re-export for compatibility)
// ============================================

export { allScenarios as getPreGeneratedScenarios };
export { getScenariosByType, getRandomScenarios, getMixedScenarios };
