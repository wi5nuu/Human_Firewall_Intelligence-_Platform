import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Paperclip, 
  Reply, 
  Forward, 
  MoreVertical, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Scenario, UserAction } from '@/types';

interface EmailSimulatorProps {
  scenario: Scenario;
  onDecision: (action: UserAction) => void;
  onTimeUpdate?: (time: number) => void;
}

export function EmailSimulator({ scenario, onDecision, onTimeUpdate }: EmailSimulatorProps) {
  const [startTime] = useState(Date.now());
  const [showDecision, setShowDecision] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  const content = scenario.content;
  const sender = content.sender!;
  const subject = content.subject!;
  const body = content.body!;
  const attachments = content.attachments || [];

  // Parse body to highlight suspicious elements
  const renderBody = () => {
    let renderedBody = body;
    
    // Highlight suspicious links
    renderedBody = renderedBody.replace(
      /\[([^\]]+)\]/g,
      '<span class="text-cyan-400 underline cursor-pointer hover:text-cyan-300 transition-colors" data-link="$1">[$1]</span>'
    );
    
    // Highlight urgency words
    const urgencyWords = ['URGENT', 'IMMEDIATELY', 'ASAP', 'NOW', 'HURRY', 'EXPIRES', 'SUSPENDED'];
    urgencyWords.forEach(word => {
      const regex = new RegExp(`\\b(${word})\\b`, 'gi');
      renderedBody = renderedBody.replace(regex, '<span class="text-amber-400 font-semibold">$1</span>');
    });
    
    return renderedBody;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Gmail-style Header */}
      <div className="bg-slate-900 rounded-t-xl border border-slate-700 overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700 bg-slate-800/50">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white"
              onClick={() => setShowDecision(true)}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                <Mail className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <Clock className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Email Subject */}
        <div className="px-6 py-4">
          <h2 className="text-xl font-semibold text-white">{subject}</h2>
        </div>

        {/* Sender Info */}
        <div className="px-6 pb-4 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold">
            {sender.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-white">{sender.name}</span>
              <span className="text-slate-400 text-sm">&lt;{sender.email}&gt;</span>
            </div>
            <div className="text-slate-500 text-sm">to me</div>
          </div>
          <div className="text-slate-500 text-sm">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      {/* Email Body */}
      <div className="bg-white rounded-b-xl border-x border-b border-slate-700 min-h-[300px]">
        <div className="p-6">
          <div 
            className="text-slate-800 whitespace-pre-wrap leading-relaxed"
            dangerouslySetInnerHTML={{ __html: renderBody() }}
          />
        </div>

        {/* Attachments */}
        {attachments.length > 0 && (
          <div className="px-6 pb-6">
            <div className="flex flex-wrap gap-3">
              {attachments.map((attachment, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg border border-slate-200 hover:border-cyan-400 hover:bg-cyan-50 cursor-pointer transition-colors"
                >
                  <Paperclip className="w-5 h-5 text-slate-400" />
                  <div>
                    <div className="text-sm font-medium text-slate-700">{attachment.name}</div>
                    <div className="text-xs text-slate-500">{attachment.size}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Reply Actions */}
        <div className="px-6 pb-6 flex items-center gap-3">
          <Button 
            variant="outline" 
            className="rounded-full px-6 border-slate-300 text-slate-700 hover:bg-slate-100"
            onClick={() => setShowDecision(true)}
          >
            <Reply className="w-4 h-4 mr-2" />
            Reply
          </Button>
          <Button 
            variant="outline" 
            className="rounded-full px-6 border-slate-300 text-slate-700 hover:bg-slate-100"
            onClick={() => setShowDecision(true)}
          >
            <Forward className="w-4 h-4 mr-2" />
            Forward
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
                <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  How would you respond?
                </h3>
                <p className="text-slate-400">
                  Analyze this email and choose your action
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
                    <div className="text-xs opacity-80">This looks legitimate</div>
                  </div>
                </Button>

                <Button
                  onClick={() => handleDecision('suspicious')}
                  className="w-full py-6 justify-start px-6 bg-amber-600 hover:bg-amber-700 text-white rounded-xl"
                >
                  <AlertTriangle className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">Mark as Suspicious</div>
                    <div className="text-xs opacity-80">Something feels off</div>
                  </div>
                </Button>

                <Button
                  onClick={() => handleDecision('report')}
                  className="w-full py-6 justify-start px-6 bg-red-600 hover:bg-red-700 text-white rounded-xl"
                >
                  <XCircle className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">Report as Scam</div>
                    <div className="text-xs opacity-80">This is definitely malicious</div>
                  </div>
                </Button>
              </div>

              <Button
                variant="ghost"
                onClick={() => setShowDecision(false)}
                className="w-full mt-4 text-slate-400 hover:text-white"
              >
                Go back to email
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
