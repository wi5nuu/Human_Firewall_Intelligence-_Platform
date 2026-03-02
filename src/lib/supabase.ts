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
    const { data, error } = await supabase
      .from('participants')
      .insert([{ name, email, final_score: 0, category: 'High Risk', total_time_ms: 0, user_id }])
      .select()
      .single();

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
    console.error('Error creating participant:', error);
    return null;
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
    return data as Participant[];
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
