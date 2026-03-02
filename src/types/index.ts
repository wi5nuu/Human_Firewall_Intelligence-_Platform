// ============================================
// HUMAN FIREWALL INTELLIGENCE PLATFORM
// Type Definitions - Enterprise Grade
// ============================================

// User & Participant Types
export interface Participant {
  id: string;
  name: string;
  email?: string;
  final_score: number;
  category: RiskCategory;
  total_time: number;
  created_at: string;
  avatar_url?: string;
}

export interface ParticipantInput {
  name: string;
  email?: string;
}

// Risk Categories
export type RiskCategory = 
  | 'High Risk' 
  | 'Moderate Risk' 
  | 'Low Risk' 
  | 'Human Firewall';

// Scenario Types
export type ScenarioType = 'email' | 'whatsapp' | 'instagram';

export type ManipulationTag = 
  | 'urgency' 
  | 'authority' 
  | 'reward' 
  | 'fear' 
  | 'curiosity' 
  | 'social_proof';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Advanced' | 'Adaptive';

export interface Scenario {
  id: string;
  type: ScenarioType;
  difficulty: DifficultyLevel;
  manipulation_tags: ManipulationTag[];
  content: ScenarioContent;
  is_scam: boolean;
  correct_action: 'trust' | 'suspicious' | 'report';
  explanation: string;
  points: number;
}

export interface ScenarioContent {
  // Email specific
  sender?: {
    name: string;
    email: string;
    avatar?: string;
  };
  subject?: string;
  body?: string;
  attachments?: Attachment[];
  
  // WhatsApp specific
  sender_name?: string;
  sender_number?: string;
  profile_pic?: string;
  messages?: Message[];
  
  // Instagram specific
  username?: string;
  display_name?: string;
  profile_image?: string;
  verified?: boolean;
  dm_content?: string;
  link_preview?: LinkPreview;
}

export interface Attachment {
  name: string;
  type: string;
  size: string;
  icon: string;
}

export interface Message {
  id: string;
  text: string;
  timestamp: string;
  is_sender: boolean;
  status?: 'sent' | 'delivered' | 'read';
}

export interface LinkPreview {
  title: string;
  description: string;
  image: string;
  url: string;
}

// Attempt & Scoring Types
export interface ScenarioAttempt {
  id: string;
  participant_id: string;
  scenario_id: string;
  scenario_type: ScenarioType;
  manipulation_type: ManipulationTag;
  user_action: UserAction;
  correct: boolean;
  response_time: number;
  hesitation_time?: number;
  created_at: string;
}

export type UserAction = 'trust' | 'suspicious' | 'report' | 'ignore';

export interface BehavioralMetrics {
  decision_accuracy: number;
  avg_response_time: number;
  hesitation_patterns: number;
  difficulty_multiplier: number;
  total_time: number;
  vulnerability_breakdown: VulnerabilityBreakdown;
}

export interface VulnerabilityBreakdown {
  urgency_manipulation: number;
  authority_bias: number;
  reward_bait: number;
  emotional_trigger: number;
  curiosity_trap: number;
}

export interface ScoreResult {
  total_score: number;
  category: RiskCategory;
  metrics: BehavioralMetrics;
  attempts: ScenarioAttempt[];
  recommendations: string[];
}

// Dashboard & Analytics Types
export interface DailyAnalytics {
  date: string;
  avg_score: number;
  total_participants: number;
  most_exploited_trigger: ManipulationTag;
  risk_distribution: RiskDistribution;
}

export interface RiskDistribution {
  high_risk: number;
  moderate_risk: number;
  low_risk: number;
  human_firewall: number;
}

export interface LiveStats {
  total_participants_today: number;
  campus_avg_score: number;
  current_active: number;
  most_common_trigger: ManipulationTag;
  score_trend: TrendPoint[];
  scenario_heatmap: HeatmapData[];
}

export interface TrendPoint {
  date: string;
  score: number;
  participants: number;
}

export interface HeatmapData {
  scenario_type: ScenarioType;
  manipulation_tag: ManipulationTag;
  success_rate: number;
  attempts: number;
}

// Leaderboard Types
export interface LeaderboardEntry {
  rank: number;
  participant: Participant;
  score: number;
  category: string;
  completed_at: string;
}

export interface LeaderboardCategory {
  id: string;
  name: string;
  description: string;
  entries: LeaderboardEntry[];
}

// App State Types
export interface AppState {
  // Participant
  currentParticipant: Participant | null;
  setCurrentParticipant: (participant: Participant | null) => void;
  
  // Simulation
  currentScenario: Scenario | null;
  scenarioQueue: Scenario[];
  currentAttempt: ScenarioAttempt | null;
  simulationPhase: 'intro' | 'scenario' | 'decision' | 'feedback' | 'completed';
  
  // Scoring
  scoreResult: ScoreResult | null;
  
  // Actions
  startSimulation: (participant: Participant, scenarios: Scenario[]) => void;
  nextScenario: () => void;
  submitDecision: (action: UserAction, responseTime: number) => void;
  completeSimulation: () => void;
  resetSimulation: () => void;
}

// Component Props Types
export interface SimulatorProps {
  scenario: Scenario;
  onDecision: (action: UserAction) => void;
  onTimeUpdate?: (time: number) => void;
}

export interface ScoreDisplayProps {
  result: ScoreResult;
  onGeneratePDF?: () => void;
  onRetry?: () => void;
  onShare?: () => void;
}

export interface DashboardProps {
  stats: LiveStats;
  isLive?: boolean;
}

// PDF Report Types
export interface PDFReportData {
  participant: Participant;
  scoreResult: ScoreResult;
  generated_at: string;
  verification_code: string;
}

// API Response Types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Theme Types
export interface ThemeColors {
  background: string;
  foreground: string;
  primary: string;
  secondary: string;
  accent: string;
  muted: string;
  border: string;
}
