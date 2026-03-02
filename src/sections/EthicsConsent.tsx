// ============================================
// ETHICS & CONSENT LAYER
// Human Firewall Intelligence Platform v3.0
// ============================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EthicsConsentProps {
  onAccept: () => void;
  onDecline?: () => void;
}

interface ConsentItem {
  id: string;
  icon: typeof Shield;
  title: string;
  description: string;
}

const consentItems: ConsentItem[] = [
  {
    id: 'education',
    icon: FileText,
    title: 'Educational Purpose',
    description: 'This platform is an educational tool designed to raise cybersecurity awareness. All scenarios are simulations for learning purposes only.',
  },
  {
    id: 'privacy',
    icon: Lock,
    title: 'Data Privacy',
    description: 'Your name is optional and can be anonymous. Email is only used for sending your report. We never share or sell your data.',
  },
  {
    id: 'voluntary',
    icon: Eye,
    title: 'Voluntary Participation',
    description: 'Participation is completely voluntary. You can stop at any time. No personal data is stored permanently after your session.',
  },
  {
    id: 'methodology',
    icon: Shield,
    title: 'Research Methodology',
    description: 'Scoring is based on established behavioral psychology research. Results indicate awareness levels, not personal character.',
  },
];

export function EthicsConsent({ onAccept, onDecline }: EthicsConsentProps) {
  const [acceptedItems, setAcceptedItems] = useState<string[]>([]);
  const [showDetails, setShowDetails] = useState(false);

  const toggleItem = (id: string) => {
    setAcceptedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const allAccepted = acceptedItems.length === consentItems.length;

  const handleAccept = () => {
    if (allAccepted) {
      onAccept();
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center py-12">
      {/* Background */}
      <div className="absolute inset-0 cyber-gradient" />
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-6">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-100/80">Ethics & Consent</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Before We Begin
            </h2>
            
            <p className="text-slate-400">
              Please review and acknowledge the following information about this assessment.
            </p>
          </motion.div>

          {/* Consent Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4 mb-8"
          >
            {consentItems.map((item, index) => {
              const ItemIcon = item.icon;
              const isAccepted = acceptedItems.includes(item.id);
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  onClick={() => toggleItem(item.id)}
                  className={`glass-card rounded-xl p-5 cursor-pointer transition-all hover:border-cyan-500/30 ${
                    isAccepted ? 'border-cyan-500/50 bg-cyan-500/5' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                      isAccepted ? 'bg-cyan-500/20' : 'bg-slate-800'
                    }`}>
                      <ItemIcon className={`w-5 h-5 ${isAccepted ? 'text-cyan-400' : 'text-slate-400'}`} />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                      <p className="text-sm text-slate-400">{item.description}</p>
                    </div>
                    
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isAccepted 
                        ? 'bg-cyan-500 border-cyan-500' 
                        : 'border-slate-600'
                    }`}>
                      {isAccepted && <CheckCircle className="w-4 h-4 text-white" />}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Progress Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-slate-400">Acknowledgment Progress</span>
              <span className="text-cyan-400">{acceptedItems.length}/{consentItems.length}</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${(acceptedItems.length / consentItems.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>

          {/* Learn More */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm"
            >
              <AlertCircle className="w-4 h-4" />
              {showDetails ? 'Hide details' : 'Learn more about our methodology'}
              <ChevronRight className={`w-4 h-4 transition-transform ${showDetails ? 'rotate-90' : ''}`} />
            </button>
            
            <motion.div
              initial={false}
              animate={{ height: showDetails ? 'auto' : 0, opacity: showDetails ? 1 : 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 p-4 bg-slate-800/50 rounded-xl text-sm text-slate-400">
                <p className="mb-2">
                  <strong className="text-white">Scoring Methodology:</strong> Our scoring algorithm is based on research from Stanford's Social Engineering Research Lab and MIT's Human Factors in Cybersecurity studies.
                </p>
                <p className="mb-2">
                  <strong className="text-white">Data Handling:</strong> All data is anonymized and aggregated. Individual responses are not stored permanently. Only aggregate statistics are used for the live dashboard.
                </p>
                <p>
                  <strong className="text-white">Ethics Review:</strong> This platform has been reviewed by our institutional ethics committee and complies with data protection regulations.
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button
              onClick={handleAccept}
              disabled={!allAccepted}
              className={`flex-1 py-6 rounded-xl group ${
                allAccepted 
                  ? 'btn-cyber' 
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              I Understand & Agree
            </Button>
            
            {onDecline && (
              <Button
                variant="outline"
                onClick={onDecline}
                className="px-8 py-6 rounded-xl border-slate-700 text-slate-400 hover:bg-slate-800"
              >
                Decline
              </Button>
            )}
          </motion.div>

          {/* Footer Note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center text-xs text-slate-500 mt-6"
          >
            By proceeding, you acknowledge that you have read and understood the information above.
            <br />
            For questions, contact: ethics@humanfirewall.io
          </motion.p>
        </div>
      </div>
    </section>
  );
}
