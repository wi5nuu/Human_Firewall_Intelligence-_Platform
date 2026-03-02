// ============================================
// EXHIBITION MODE
// Human Firewall Intelligence Platform v3.0
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Minimize2, Volume2, VolumeX, RotateCcw, Zap } from 'lucide-react';

interface ExhibitionModeProps {
  isActive: boolean;
  onToggle: () => void;
  onReset?: () => void;
  children?: React.ReactNode;
}

// Sound effect hooks
function useAmbientSound() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  const toggleSound = useCallback(() => {
    if (!audioContext) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(ctx);
    }
    setIsPlaying(prev => !prev);
  }, [audioContext]);

  useEffect(() => {
    if (!audioContext || !isPlaying) return;

    // Create ambient cyber sound (low frequency drone)
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(60, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();

    return () => {
      oscillator.stop();
      oscillator.disconnect();
    };
  }, [audioContext, isPlaying]);

  return { isPlaying, toggleSound };
}

export function ExhibitionMode({ isActive, onToggle, onReset, children }: ExhibitionModeProps) {
  const { isPlaying, toggleSound } = useAmbientSound();
  const [showControls, setShowControls] = useState(true);
  const [autoResetTimer, setAutoResetTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  // Handle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  // Auto-hide controls
  useEffect(() => {
    if (!isActive) return;

    const timer = setTimeout(() => {
      setShowControls(false);
    }, 5000);

    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timer);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timer);
    };
  }, [isActive]);

  // Auto-reset after 30 seconds on results page
  useEffect(() => {
    if (!isActive) return;

    // Check if we're on results page (contains score display)
    const isResultsPage = document.querySelector('[data-results-page]');
    if (isResultsPage) {
      const timer = setTimeout(() => {
        onReset?.();
      }, 30000); // 30 seconds
      setAutoResetTimer(timer);
    }

    return () => {
      if (autoResetTimer) {
        clearTimeout(autoResetTimer);
      }
    };
  }, [isActive, onReset, autoResetTimer]);

  if (!isActive) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-4 right-4 z-50 w-12 h-12 rounded-full bg-slate-800/80 backdrop-blur border border-slate-700 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all"
        title="Enter Exhibition Mode"
      >
        <Maximize2 className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="relative">
      {/* Exhibition Mode Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-500/30"
      >
        <Zap className="w-4 h-4 text-cyan-400" />
        <span className="text-xs text-cyan-400 font-medium">Exhibition Mode</span>
      </motion.div>

      {/* Floating Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 right-4 z-50 flex items-center gap-2"
          >
            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className={`w-10 h-10 rounded-full backdrop-blur border flex items-center justify-center transition-all ${
                isPlaying 
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' 
                  : 'bg-slate-800/80 border-slate-700 text-slate-400'
              }`}
              title={isPlaying ? 'Mute Sound' : 'Play Ambient Sound'}
            >
              {isPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Reset */}
            {onReset && (
              <button
                onClick={onReset}
                className="w-10 h-10 rounded-full bg-slate-800/80 backdrop-blur border border-slate-700 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all"
                title="Reset to Landing"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="w-10 h-10 rounded-full bg-slate-800/80 backdrop-blur border border-slate-700 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all"
              title="Toggle Fullscreen"
            >
              {document.fullscreenElement ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Exit Exhibition Mode */}
            <button
              onClick={onToggle}
              className="px-4 h-10 rounded-full bg-slate-800/80 backdrop-blur border border-slate-700 flex items-center gap-2 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all"
            >
              <Minimize2 className="w-4 h-4" />
              <span className="text-sm">Exit</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auto-reset Warning */}
      <AnimatePresence>
        {autoResetTimer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-sm"
          >
            Auto-reset in 30 seconds
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      {children}
    </div>
  );
}

// Exhibition Mode Hook
export function useExhibitionMode() {
  const [isExhibitionMode, setIsExhibitionMode] = useState(false);

  const toggleExhibitionMode = useCallback(() => {
    setIsExhibitionMode(prev => !prev);
  }, []);

  const enableExhibitionMode = useCallback(() => {
    setIsExhibitionMode(true);
  }, []);

  const disableExhibitionMode = useCallback(() => {
    setIsExhibitionMode(false);
  }, []);

  return {
    isExhibitionMode,
    toggleExhibitionMode,
    enableExhibitionMode,
    disableExhibitionMode,
  };
}
