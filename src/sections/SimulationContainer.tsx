import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  MessageCircle,
  Instagram,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { EmailSimulator } from './simulators/EmailSimulator';
import { WhatsAppSimulator } from './simulators/WhatsAppSimulator';
import { InstagramSimulator } from './simulators/InstagramSimulator';
import { useSimulationStore } from '@/store';
import { getMixedScenarios } from '@/lib/scenariosDatabase';
import { updateParticipantScore } from '@/lib/supabase';
import type { Scenario, UserAction } from '@/types';

interface SimulationContainerProps {
  onComplete: () => void;
}

const scenarioIcons = {
  email: Mail,
  whatsapp: MessageCircle,
  instagram: Instagram,
};

const scenarioLabels = {
  email: 'Email Phishing',
  whatsapp: 'WhatsApp Scam',
  instagram: 'Instagram DM',
};

export function SimulationContainer({ onComplete }: SimulationContainerProps) {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackData, setFeedbackData] = useState<{
    correct: boolean;
    explanation: string;
    correctAction: string;
  } | null>(null);

  const {
    currentParticipant,
    difficulty,
    currentScenario,
    currentScenarioIndex,
    startSimulation,
    nextScenario,
    submitDecision,
    completeSimulation,
  } = useSimulationStore();

  // Load scenarios on mount
  useEffect(() => {
    const loadScenarios = async () => {
      setIsLoading(true);
      const scenarioCount = difficulty === 'Enterprise' ? 10 : difficulty === 'Medium' ? 7 : 5;
      const loadedScenarios = getMixedScenarios(scenarioCount, difficulty);
      setScenarios(loadedScenarios);

      if (currentParticipant) {
        startSimulation(currentParticipant, loadedScenarios);
      }
      setIsLoading(false);
    };

    loadScenarios();
  }, [currentParticipant]);

  // Handle decision
  const handleDecision = (action: UserAction) => {
    if (!currentScenario) return;

    submitDecision(action);

    const isCorrect = action === currentScenario.correct_action;
    setFeedbackData({
      correct: isCorrect,
      explanation: currentScenario.explanation,
      correctAction: currentScenario.correct_action,
    });
    setShowFeedback(true);
  };

  // Handle next after feedback
  const handleNext = async () => {
    setShowFeedback(false);
    setFeedbackData(null);

    if (currentScenarioIndex >= scenarios.length - 1) {
      completeSimulation();
      // Persist final score to Supabase in real-time
      const result = useSimulationStore.getState().scoreResult;
      if (currentParticipant && result) {
        await updateParticipantScore(
          currentParticipant.id,
          result.total_score,
          result.category,
          result.metrics.total_time
        );
      }
      onComplete();
    } else {
      nextScenario();
    }
  };

  // Progress calculation
  const progress = scenarios.length > 0
    ? ((currentScenarioIndex + 1) / scenarios.length) * 100
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading scenarios...</p>
        </div>
      </div>
    );
  }

  if (!currentScenario) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400">No scenario available</p>
          <Button onClick={onComplete} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const ScenarioIcon = scenarioIcons[currentScenario.type];

  return (
    <section className="relative min-h-screen py-8">
      {/* Background */}
      <div className="absolute inset-0 cyber-gradient" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto mb-6"
        >
          {/* Progress Bar */}
          <div className="glass-card rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ScenarioIcon className="w-5 h-5 text-cyan-400" />
                <span className="text-white font-medium">
                  {scenarioLabels[currentScenario.type]}
                </span>
              </div>
              <span className="text-slate-400 text-sm">
                {currentScenarioIndex + 1} of {scenarios.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Scenario Queue */}
          <div className="flex items-center gap-2 justify-center">
            {scenarios.map((s, i) => {
              const Icon = scenarioIcons[s.type];
              const isCompleted = i < currentScenarioIndex;
              const isCurrent = i === currentScenarioIndex;

              return (
                <div key={s.id} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isCompleted
                      ? 'bg-green-500/20 text-green-400'
                      : isCurrent
                        ? 'bg-cyan-500/20 text-cyan-400 ring-2 ring-cyan-400'
                        : 'bg-slate-800 text-slate-500'
                      }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  {i < scenarios.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-slate-600 mx-1" />
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Simulator */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScenario.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentScenario.type === 'email' && (
              <EmailSimulator
                scenario={currentScenario}
                onDecision={handleDecision}
              />
            )}
            {currentScenario.type === 'whatsapp' && (
              <WhatsAppSimulator
                scenario={currentScenario}
                onDecision={handleDecision}
              />
            )}
            {currentScenario.type === 'instagram' && (
              <InstagramSimulator
                scenario={currentScenario}
                onDecision={handleDecision}
              />
            )}
            {!['email', 'whatsapp', 'instagram'].includes(currentScenario.type) && (
              <div className="glass-card rounded-2xl p-8 text-center">
                <p className="text-slate-400 mb-4">Unsupported scenario type: {currentScenario.type}</p>
                <Button onClick={handleNext}>Skip Scenario</Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Feedback Modal */}
      <AnimatePresence>
        {showFeedback && feedbackData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card rounded-3xl p-8 max-w-lg w-full"
            >
              {/* Result Icon */}
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${feedbackData.correct ? 'bg-green-500/20' : 'bg-red-500/20'
                    }`}
                >
                  {feedbackData.correct ? (
                    <CheckCircle className="w-10 h-10 text-green-400" />
                  ) : (
                    <XCircle className="w-10 h-10 text-red-400" />
                  )}
                </motion.div>
                <h3 className={`text-2xl font-bold ${feedbackData.correct ? 'text-green-400' : 'text-red-400'}`}>
                  {feedbackData.correct ? 'Correct!' : 'Not Quite'}
                </h3>
              </div>

              {/* Explanation */}
              <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-white mb-2">Analysis</h4>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {feedbackData.explanation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Correct Action */}
              {!feedbackData.correct && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6">
                  <p className="text-amber-300 text-sm">
                    <span className="font-semibold">Correct action:</span>{' '}
                    {feedbackData.correctAction === 'trust' && 'This was legitimate - safe to trust'}
                    {feedbackData.correctAction === 'suspicious' && 'Mark as suspicious and verify'}
                    {feedbackData.correctAction === 'report' && 'Report and block this contact'}
                  </p>
                </div>
              )}

              {/* Next Button */}
              <Button
                onClick={handleNext}
                className="w-full btn-cyber py-6 text-base rounded-xl group"
              >
                {currentScenarioIndex >= scenarios.length - 1 ? (
                  <>
                    View Results
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                ) : (
                  <>
                    Next Scenario
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
