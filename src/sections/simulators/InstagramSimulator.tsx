import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Phone, 
  Video, 
  Info,
  Heart,
  Image as ImageIcon,
  Mic,
  Send,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Shield,
  BadgeCheck,
  Link as LinkIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Scenario, UserAction } from '@/types';

interface InstagramSimulatorProps {
  scenario: Scenario;
  onDecision: (action: UserAction) => void;
  onTimeUpdate?: (time: number) => void;
}

export function InstagramSimulator({ scenario, onDecision, onTimeUpdate }: InstagramSimulatorProps) {
  const [startTime] = useState(Date.now());
  const [showDecision, setShowDecision] = useState(false);
  const [inputText, setInputText] = useState('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const content = scenario.content;
  const username = content.username!;
  const displayName = content.display_name!;
  const profileImage = content.profile_image;
  const verified = content.verified || false;
  const dmContent = content.dm_content!;
  const linkPreview = content.link_preview;

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      onTimeUpdate?.(elapsed);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTime, onTimeUpdate]);

  const handleDecision = (action: UserAction) => {
    if (timerRef.current) clearInterval(timerRef.current);
    onDecision(action);
  };

  // Parse DM content for links
  const renderDMContent = () => {
    return dmContent.split('\n').map((line, i) => (
      <p key={i} className="mb-1">
        {line.split(/(\[.*?\])/).map((part, j) => {
          if (part.startsWith('[') && part.endsWith(']')) {
            return (
              <span 
                key={j} 
                className="text-blue-400 underline cursor-pointer hover:text-blue-300"
              >
                {part}
              </span>
            );
          }
          return part;
        })}
      </p>
    ));
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Instagram-style Container */}
      <div className="bg-black rounded-xl overflow-hidden shadow-2xl border border-slate-800">
        {/* Header */}
        <div className="bg-black border-b border-slate-800 px-4 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:text-slate-300 p-1"
            onClick={() => setShowDecision(true)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-[2px]">
            <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
              {profileImage ? (
                <img src={profileImage} alt={username} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-sm font-semibold">{displayName.charAt(0)}</span>
              )}
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-white text-sm">{displayName}</span>
              {verified && (
                <BadgeCheck className="w-4 h-4 text-blue-500 fill-blue-500" />
              )}
            </div>
            <div className="text-xs text-slate-400">{username}</div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-white hover:text-slate-300 p-1">
              <Phone className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:text-slate-300 p-1">
              <Video className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:text-slate-300 p-1">
              <Info className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="min-h-[400px] max-h-[500px] overflow-y-auto p-4 bg-black">
          {/* Date Divider */}
          <div className="flex justify-center mb-6">
            <span className="text-slate-500 text-xs">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>

          {/* Received Message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex mb-4"
          >
            <div className="max-w-[85%]">
              <div className="bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="text-white text-sm leading-relaxed">
                  {renderDMContent()}
                </div>
              </div>
              
              {/* Link Preview */}
              {linkPreview && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-2 rounded-xl overflow-hidden border border-slate-700 cursor-pointer hover:border-slate-600 transition-colors"
                >
                  <div className="h-32 bg-slate-800 flex items-center justify-center">
                    <ImageIcon className="w-10 h-10 text-slate-600" />
                  </div>
                  <div className="p-3 bg-slate-900">
                    <div className="text-white text-sm font-medium mb-1">{linkPreview.title}</div>
                    <div className="text-slate-400 text-xs mb-1">{linkPreview.description}</div>
                    <div className="flex items-center gap-1 text-slate-500 text-xs">
                      <LinkIcon className="w-3 h-3" />
                      {linkPreview.url}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Quick Reactions */}
          <div className="flex justify-center gap-2 mb-4">
            {['❤️', '👍', '😂', '😮', '😢', '👏'].map((emoji) => (
              <button
                key={emoji}
                onClick={() => setShowDecision(true)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-lg transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-black border-t border-slate-800 px-3 py-3 flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300 p-2">
            <ImageIcon className="w-6 h-6" />
          </Button>
          <div className="flex-1 bg-slate-900 rounded-full px-4 py-2 flex items-center">
            <input
              type="text"
              placeholder="Message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onFocus={() => setShowDecision(true)}
              className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-slate-500"
            />
            <Button variant="ghost" size="sm" className="text-white hover:text-slate-300 p-1">
              <Heart className="w-5 h-5" />
            </Button>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-cyan-400 hover:text-cyan-300 p-2"
            onClick={() => setShowDecision(true)}
          >
            {inputText ? <Send className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Decision Overlay */}
      <AnimatePresence>
        {showDecision && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card rounded-2xl p-8 max-w-lg w-full"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  How would you respond?
                </h3>
                <p className="text-slate-400">
                  Analyze this direct message and choose your action
                </p>
              </div>

              <div className="grid gap-3">
                <Button
                  onClick={() => handleDecision('trust')}
                  className="w-full py-6 justify-start px-6 bg-green-600 hover:bg-green-700 text-white rounded-xl"
                >
                  <CheckCircle className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">Trust & Respond</div>
                    <div className="text-xs opacity-80">This seems like a legitimate message</div>
                  </div>
                </Button>

                <Button
                  onClick={() => handleDecision('suspicious')}
                  className="w-full py-6 justify-start px-6 bg-amber-600 hover:bg-amber-700 text-white rounded-xl"
                >
                  <AlertTriangle className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">Mark as Suspicious</div>
                    <div className="text-xs opacity-80">This message raises red flags</div>
                  </div>
                </Button>

                <Button
                  onClick={() => handleDecision('report')}
                  className="w-full py-6 justify-start px-6 bg-red-600 hover:bg-red-700 text-white rounded-xl"
                >
                  <XCircle className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">Report & Block</div>
                    <div className="text-xs opacity-80">This is a scam or spam</div>
                  </div>
                </Button>
              </div>

              <Button
                variant="ghost"
                onClick={() => setShowDecision(false)}
                className="w-full mt-4 text-slate-400 hover:text-white"
              >
                Go back to message
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
