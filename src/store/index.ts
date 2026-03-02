import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  Participant, 
  Scenario, 
  ScenarioAttempt, 
  ScoreResult, 
  UserAction,
  RiskCategory,
  BehavioralMetrics,
  VulnerabilityBreakdown
} from '@/types';

// ============================================
// HUMAN FIREWALL STORE - Zustand State Management
// ============================================

interface SimulationState {
  // Participant
  currentParticipant: Participant | null;
  setCurrentParticipant: (participant: Participant | null) => void;
  
  // Simulation Flow
  currentScenarioIndex: number;
  scenarioQueue: Scenario[];
  attempts: ScenarioAttempt[];
  simulationStartTime: number;
  scenarioStartTime: number;
  
  // Current State
  currentScenario: Scenario | null;
  simulationPhase: 'intro' | 'scenario' | 'decision' | 'feedback' | 'completed';
  lastDecision: UserAction | null;
  lastDecisionTime: number;
  
  // Results
  scoreResult: ScoreResult | null;
  
  // Actions
  startSimulation: (participant: Participant, scenarios: Scenario[]) => void;
  nextScenario: () => void;
  submitDecision: (action: UserAction) => void;
  completeSimulation: () => void;
  resetSimulation: () => void;
  skipToResults: (result: ScoreResult) => void;
}

export const useSimulationStore = create<SimulationState>()(
  persist(
    (set, get) => ({
      // Initial State
      currentParticipant: null,
      currentScenarioIndex: 0,
      scenarioQueue: [],
      attempts: [],
      simulationStartTime: 0,
      scenarioStartTime: 0,
      currentScenario: null,
      simulationPhase: 'intro',
      lastDecision: null,
      lastDecisionTime: 0,
      scoreResult: null,
      
      // Set Participant
      setCurrentParticipant: (participant) => {
        set({ currentParticipant: participant });
      },
      
      // Start Simulation
      startSimulation: (participant, scenarios) => {
        const now = Date.now();
        set({
          currentParticipant: participant,
          scenarioQueue: scenarios,
          currentScenarioIndex: 0,
          currentScenario: scenarios[0] || null,
          attempts: [],
          simulationStartTime: now,
          scenarioStartTime: now,
          simulationPhase: 'scenario',
          lastDecision: null,
          scoreResult: null,
        });
      },
      
      // Next Scenario
      nextScenario: () => {
        const { currentScenarioIndex, scenarioQueue } = get();
        const nextIndex = currentScenarioIndex + 1;
        
        if (nextIndex >= scenarioQueue.length) {
          // Complete simulation
          get().completeSimulation();
        } else {
          set({
            currentScenarioIndex: nextIndex,
            currentScenario: scenarioQueue[nextIndex],
            scenarioStartTime: Date.now(),
            simulationPhase: 'scenario',
            lastDecision: null,
          });
        }
      },
      
      // Submit Decision
      submitDecision: (action) => {
        const { 
          currentScenario, 
          currentParticipant, 
          attempts, 
          scenarioStartTime 
        } = get();
        
        if (!currentScenario || !currentParticipant) return;
        
        const responseTime = Date.now() - scenarioStartTime;
        const isCorrect = action === currentScenario.correct_action;
        
        const attempt: ScenarioAttempt = {
          id: `attempt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          participant_id: currentParticipant.id,
          scenario_id: currentScenario.id,
          scenario_type: currentScenario.type,
          manipulation_type: currentScenario.manipulation_tags[0] || 'urgency',
          user_action: action,
          correct: isCorrect,
          response_time: responseTime,
          created_at: new Date().toISOString(),
        };
        
        set({
          attempts: [...attempts, attempt],
          lastDecision: action,
          lastDecisionTime: responseTime,
          simulationPhase: 'feedback',
        });
      },
      
      // Complete Simulation & Calculate Score
      completeSimulation: () => {
        const { attempts, scenarioQueue, simulationStartTime } = get();
        
        if (attempts.length === 0) return;
        
        const totalTime = Date.now() - simulationStartTime;
        
        // Calculate metrics
        const correctAttempts = attempts.filter(a => a.correct);
        const decisionAccuracy = (correctAttempts.length / attempts.length) * 100;
        
        const avgResponseTime = attempts.reduce((sum, a) => sum + a.response_time, 0) / attempts.length;
        
        // Calculate hesitation patterns (responses > 10 seconds)
        const hesitationPatterns = attempts.filter(a => a.response_time > 10000).length;
        
        // Difficulty multiplier based on scenario difficulties
        const difficultyPoints = scenarioQueue.reduce((sum, s) => {
          const multiplier = s.difficulty === 'Advanced' ? 1.5 : 
                            s.difficulty === 'Medium' ? 1.25 : 1;
          return sum + multiplier;
        }, 0);
        
        // Vulnerability breakdown by manipulation type
        const manipulationTypes: Record<string, number[]> = {};
        attempts.forEach(attempt => {
          const type = attempt.manipulation_type;
          if (!manipulationTypes[type]) manipulationTypes[type] = [];
          manipulationTypes[type].push(attempt.correct ? 1 : 0);
        });
        
        const vulnerabilityBreakdown: VulnerabilityBreakdown = {
          urgency_manipulation: calculateVulnerabilityScore(manipulationTypes['urgency'] || []),
          authority_bias: calculateVulnerabilityScore(manipulationTypes['authority'] || []),
          reward_bait: calculateVulnerabilityScore(manipulationTypes['reward'] || []),
          emotional_trigger: calculateVulnerabilityScore(manipulationTypes['fear'] || []),
          curiosity_trap: calculateVulnerabilityScore(manipulationTypes['curiosity'] || []),
        };
        
        // Calculate total score (0-100)
        const accuracyWeight = 0.6;
        const speedWeight = 0.2;
        const difficultyWeight = 0.2;
        
        const speedScore = Math.max(0, 100 - (avgResponseTime / 100));
        const difficultyScore = Math.min(100, (difficultyPoints / attempts.length) * 50);
        
        const totalScore = Math.round(
          (decisionAccuracy * accuracyWeight) +
          (speedScore * speedWeight) +
          (difficultyScore * difficultyWeight)
        );
        
        // Determine category
        const category: RiskCategory = 
          totalScore >= 91 ? 'Human Firewall' :
          totalScore >= 71 ? 'Low Risk' :
          totalScore >= 41 ? 'Moderate Risk' : 'High Risk';
        
        // Generate recommendations
        const recommendations = generateRecommendations(
          vulnerabilityBreakdown,
          category
        );
        
        const metrics: BehavioralMetrics = {
          decision_accuracy: Math.round(decisionAccuracy),
          avg_response_time: Math.round(avgResponseTime),
          hesitation_patterns: hesitationPatterns,
          difficulty_multiplier: difficultyPoints / attempts.length,
          vulnerability_breakdown: vulnerabilityBreakdown,
          total_time: totalTime,
        };
        
        const scoreResult: ScoreResult = {
          total_score: totalScore,
          category,
          metrics,
          attempts,
          recommendations,
        };
        
        set({
          scoreResult,
          simulationPhase: 'completed',
        });
      },
      
      // Reset Simulation
      resetSimulation: () => {
        set({
          currentParticipant: null,
          currentScenarioIndex: 0,
          scenarioQueue: [],
          attempts: [],
          simulationStartTime: 0,
          scenarioStartTime: 0,
          currentScenario: null,
          simulationPhase: 'intro',
          lastDecision: null,
          scoreResult: null,
        });
      },
      
      // Skip to Results (for demo purposes)
      skipToResults: (result) => {
        set({
          scoreResult: result,
          simulationPhase: 'completed',
        });
      },
    }),
    {
      name: 'human-firewall-storage',
      partialize: (state) => ({
        currentParticipant: state.currentParticipant,
        scoreResult: state.scoreResult,
      }),
    }
  )
);

// Helper function to calculate vulnerability score
function calculateVulnerabilityScore(results: number[]): number {
  if (results.length === 0) return 50; // Neutral if no data
  const correctCount = results.filter(r => r === 1).length;
  return Math.round((correctCount / results.length) * 100);
}

// Helper function to generate recommendations
function generateRecommendations(
  breakdown: VulnerabilityBreakdown,
  category: RiskCategory
): string[] {
  const recommendations: string[] = [];
  
  // Find weakest areas
  const vulnerabilities = [
    { name: 'urgency_manipulation', score: breakdown.urgency_manipulation, label: 'Urgency Manipulation' },
    { name: 'authority_bias', score: breakdown.authority_bias, label: 'Authority Bias' },
    { name: 'reward_bait', score: breakdown.reward_bait, label: 'Reward Bait' },
    { name: 'emotional_trigger', score: breakdown.emotional_trigger, label: 'Emotional Triggers' },
    { name: 'curiosity_trap', score: breakdown.curiosity_trap, label: 'Curiosity Traps' },
  ];
  
  const sortedVulnerabilities = vulnerabilities.sort((a, b) => a.score - b.score);
  const weakest = sortedVulnerabilities[0];
  
  if (category === 'High Risk') {
    recommendations.push(
      'Prioritize cybersecurity awareness training immediately',
      'Enable multi-factor authentication on all accounts',
      'Verify all requests through secondary channels',
      'Take time to analyze messages before responding'
    );
  } else if (category === 'Moderate Risk') {
    recommendations.push(
      'Practice identifying social engineering techniques',
      'Be cautious with urgent requests',
      'Verify sender identities before clicking links',
      'Stay updated on latest scam tactics'
    );
  } else if (category === 'Low Risk') {
    recommendations.push(
      'Continue practicing good security habits',
      'Help educate others about social engineering',
      'Stay vigilant with unfamiliar communications',
      'Regularly review and update security settings'
    );
  } else {
    recommendations.push(
      'Excellent security awareness! Maintain your vigilance',
      'Consider mentoring others in cybersecurity',
      'Stay updated on emerging threat vectors',
      'Your behavior sets a strong example for others'
    );
  }
  
  // Add specific recommendation for weakest area
  if (weakest && weakest.score < 60) {
    recommendations.push(
      `Focus on improving recognition of ${weakest.label} techniques`
    );
  }
  
  return recommendations.slice(0, 5);
}

// Dashboard Store
interface DashboardState {
  liveStats: {
    totalParticipants: number;
    avgScore: number;
    activeNow: number;
    topTrigger: string;
  };
  recentParticipants: Participant[];
  updateLiveStats: (stats: Partial<DashboardState['liveStats']>) => void;
  addParticipant: (participant: Participant) => void;
}

export const useDashboardStore = create<DashboardState>()((set) => ({
  liveStats: {
    totalParticipants: 0,
    avgScore: 0,
    activeNow: 0,
    topTrigger: 'urgency',
  },
  recentParticipants: [],
  
  updateLiveStats: (stats) => {
    set((state) => ({
      liveStats: { ...state.liveStats, ...stats },
    }));
  },
  
  addParticipant: (participant) => {
    set((state) => ({
      recentParticipants: [participant, ...state.recentParticipants].slice(0, 10),
    }));
  },
}));

// UI Store
interface UIState {
  isLoading: boolean;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  setLoading: (loading: boolean) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  clearToast: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  isLoading: false,
  toast: null,
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  showToast: (message, type) => {
    set({ toast: { message, type } });
    setTimeout(() => set({ toast: null }), 3000);
  },
  
  clearToast: () => set({ toast: null }),
}));
