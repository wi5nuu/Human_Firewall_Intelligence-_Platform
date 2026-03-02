import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, 
  Video, 
  MoreVertical, 
  ArrowLeft, 
  Send,
  CheckCheck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Shield,
  Camera,
  Paperclip
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Scenario, UserAction } from '@/types';

interface WhatsAppSimulatorProps {
  scenario: Scenario;
  onDecision: (action: UserAction) => void;
  onTimeUpdate?: (time: number) => void;
}

export function WhatsAppSimulator({ scenario, onDecision, onTimeUpdate }: WhatsAppSimulatorProps) {
  const [startTime] = useState(Date.now());
  const [showDecision, setShowDecision] = useState(false);
  const [visibleMessages, setVisibleMessages] = useState<number>(0);
  const [showTyping, setShowTyping] = useState(false);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const content = scenario.content;
  const senderName = content.sender_name!;
  const profilePic = content.profile_pic;
  const messages = content.messages || [];

  // Progressive message reveal
  useEffect(() => {
    if (visibleMessages < messages.length) {
      const delay = visibleMessages === 0 ? 500 : 2000;
      const timer = setTimeout(() => {
        setShowTyping(true);
        setTimeout(() => {
          setShowTyping(false);
          setVisibleMessages(prev => prev + 1);
        }, 1500);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [visibleMessages, messages.length]);

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [visibleMessages, showTyping]);

  return (
    <div className="w-full max-w-md mx-auto">
      {/* WhatsApp-style Container */}
      <div className="bg-[#0b141a] rounded-xl overflow-hidden shadow-2xl border border-slate-700">
        {/* Header */}
        <div className="bg-[#1f2c34] px-4 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white p-1"
            onClick={() => setShowDecision(true)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center overflow-hidden">
            {profilePic ? (
              <img src={profilePic} alt={senderName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-white font-semibold">{senderName.charAt(0)}</span>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-white truncate">{senderName}</div>
            <div className="text-xs text-slate-400">
              {showTyping ? 'typing...' : 'online'}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white p-1">
              <Video className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white p-1">
              <Phone className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white p-1">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Chat Background */}
        <div 
          className="relative min-h-[400px] max-h-[500px] overflow-y-auto p-4"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%231f2c34' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundColor: '#0b141a',
          }}
        >
          {/* Date Divider */}
          <div className="flex justify-center mb-4">
            <span className="bg-[#1f2c34] text-slate-400 text-xs px-3 py-1 rounded-lg">
              Today
            </span>
          </div>

          {/* Messages */}
          <AnimatePresence>
            {messages.slice(0, visibleMessages).map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`flex mb-2 ${message.is_sender ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-lg relative ${
                    message.is_sender
                      ? 'bg-white text-slate-800 rounded-tl-none'
                      : 'bg-[#005c4b] text-white rounded-tr-none'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <div className={`flex items-center justify-end gap-1 mt-1 ${message.is_sender ? 'text-slate-400' : 'text-slate-300'}`}>
                    <span className="text-[10px]">{message.timestamp}</span>
                    {!message.is_sender && (
                      <CheckCheck className="w-3 h-3 text-blue-400" />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          <AnimatePresence>
            {showTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex mb-2 justify-start"
              >
                <div className="bg-white px-4 py-3 rounded-lg rounded-tl-none">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-typing" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-typing" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-typing" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-[#1f2c34] px-3 py-2 flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white p-2">
            <Paperclip className="w-5 h-5" />
          </Button>
          <div className="flex-1 bg-[#2a3942] rounded-full px-4 py-2 flex items-center">
            <input
              type="text"
              placeholder="Type a message"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onFocus={() => setShowDecision(true)}
              className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-slate-500"
            />
          </div>
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white p-2">
            <Camera className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-slate-400 hover:text-white p-2"
            onClick={() => setShowDecision(true)}
          >
            <Send className="w-5 h-5" />
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
                  Analyze this conversation and choose your action
                </p>
              </div>

              <div className="grid gap-3">
                <Button
                  onClick={() => handleDecision('trust')}
                  className="w-full py-6 justify-start px-6 bg-green-600 hover:bg-green-700 text-white rounded-xl"
                >
                  <CheckCircle className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">Trust & Reply</div>
                    <div className="text-xs opacity-80">This conversation seems normal</div>
                  </div>
                </Button>

                <Button
                  onClick={() => handleDecision('suspicious')}
                  className="w-full py-6 justify-start px-6 bg-amber-600 hover:bg-amber-700 text-white rounded-xl"
                >
                  <AlertTriangle className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">Mark as Suspicious</div>
                    <div className="text-xs opacity-80">Something doesn't feel right</div>
                  </div>
                </Button>

                <Button
                  onClick={() => handleDecision('report')}
                  className="w-full py-6 justify-start px-6 bg-red-600 hover:bg-red-700 text-white rounded-xl"
                >
                  <XCircle className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">Block & Report</div>
                    <div className="text-xs opacity-80">This is a scam attempt</div>
                  </div>
                </Button>
              </div>

              <Button
                variant="ghost"
                onClick={() => setShowDecision(false)}
                className="w-full mt-4 text-slate-400 hover:text-white"
              >
                Go back to chat
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
