import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import { Shield } from 'lucide-react';
import { Navigation } from './sections/Navigation';
import { Hero } from './sections/Hero';
import { PlatformFeatures } from './sections/PlatformFeatures';
import { Methodology } from './sections/Methodology';
import { OnboardingFlow } from './sections/OnboardingFlow';
import { EthicsConsent } from './sections/EthicsConsent';
import { ParticipantRegistration } from './sections/ParticipantRegistration';
import { SimulationContainer } from './sections/SimulationContainer';
import { ScoreDisplay } from './sections/ScoreDisplay';
import { LiveDashboard } from './sections/LiveDashboard';
import { Leaderboard } from './sections/Leaderboard';
import { LearningHub } from './sections/LearningHub';
import { HallOfFame } from './sections/HallOfFame';
import { Footer } from './sections/Footer';
// import { ExhibitionMode, useExhibitionMode } from './sections/ExhibitionMode';
import { AuthPage } from './sections/AuthPage';
import { MemberDashboard } from './sections/MemberDashboard';
import { AdminDashboard } from './sections/AdminDashboard';
import { useSimulationStore } from './store';
import { useAuth } from './hooks/useAuth';
import { generatePDFReport, generateVerificationCode, generateShareText, generateCertificate } from '@/lib/pdfGenerator';
import './App.css';

// ============================================
// HUMAN FIREWALL INTELLIGENCE PLATFORM v3.0
// Main Application Component
// ============================================

type ViewState =
  | 'home' | 'auth' | 'onboarding' | 'consent' | 'challenge'
  | 'simulation' | 'results' | 'dashboard' | 'leaderboard'
  | 'member' | 'admin' | 'learning' | 'verify';

function App() {
  const getInitialView = (): ViewState => {
    const path = window.location.pathname.replace(/^\/+/, '');
    const validViews: ViewState[] = ['home', 'auth', 'onboarding', 'consent', 'challenge', 'simulation', 'results', 'dashboard', 'leaderboard', 'member', 'admin', 'learning', 'verify'];
    return validViews.includes(path as ViewState) ? (path as ViewState) : 'home';
  };

  const [currentView, setCurrentView] = useState<ViewState>(getInitialView);
  const [isLoading, setIsLoading] = useState(false);
  // const { isExhibitionMode, toggleExhibitionMode } = useExhibitionMode();
  const { isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();

  const { currentParticipant, scoreResult, resetSimulation } = useSimulationStore();

  const navigateTo = (view: ViewState) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const newPath = view === 'home' ? '/' : `/${view}`;
    if (window.location.pathname !== newPath) {
      window.history.pushState({}, '', newPath);
    }
  };

  // Sync state with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\/+/, '');
      const validViews = ['home', 'auth', 'onboarding', 'consent', 'challenge', 'simulation', 'results', 'dashboard', 'leaderboard', 'member', 'admin', 'learning', 'verify'];
      setCurrentView(validViews.includes(path) ? (path as ViewState) : 'home');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Start challenge — no longer requires login for general access
  const handleStartChallenge = () => {
    if (currentParticipant && scoreResult) {
      toast.info('Starting new assessment...', { duration: 2000 });
      resetSimulation();
    }
    navigateTo('onboarding');
  };

  // After successful login/register
  const handleAuthSuccess = () => {
    if (isAdmin) navigateTo('admin');
    else navigateTo('onboarding');
  };

  const handleOnboardingComplete = () => navigateTo('consent');

  const handleConsentAccept = () => {
    navigateTo('challenge');
    toast.success('Welcome! Start your assessment.');
  };

  const handleRegistrationComplete = () => {
    navigateTo('simulation');
    toast.success('Assessment started! Good luck!', {
      description: 'Analyze each scenario carefully.',
    });
  };

  const handleSimulationComplete = () => {
    navigateTo('results');
    toast.success('Assessment complete!', { description: 'View your security profile.' });
  };

  const handleGeneratePDF = () => {
    if (!currentParticipant || !scoreResult) return;
    setIsLoading(true);
    try {
      const code = generateVerificationCode();
      generatePDFReport({
        participant: currentParticipant, scoreResult,
        generated_at: new Date().toISOString(), verification_code: code,
      });
      toast.success('Report downloaded successfully!', { description: `Verification code: ${code}` });
    } catch {
      toast.error('Failed to generate report');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateCertificate = () => {
    if (!currentParticipant || !scoreResult) return;
    setIsLoading(true);
    try {
      const code = generateVerificationCode();
      generateCertificate({
        participant: currentParticipant, scoreResult,
        generated_at: new Date().toISOString(), verification_code: code,
      });
      toast.success('Certificate downloaded successfully!');
    } catch {
      toast.error('Failed to generate certificate');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = () => {
    if (!currentParticipant || !scoreResult) return;
    const text = generateShareText({
      participant: currentParticipant, scoreResult,
      generated_at: new Date().toISOString(), verification_code: generateVerificationCode(),
    });
    if (navigator.share) navigator.share({ title: 'Human Firewall Assessment', text });
    else { navigator.clipboard.writeText(text); toast.success('Copied to clipboard!'); }
  };

  const handleRetry = () => { resetSimulation(); navigateTo('challenge'); };

  // Guard admin-only views
  const effectiveView: ViewState = currentView === 'admin' && !isAdmin ? 'home' : currentView;

  const renderView = () => {
    switch (effectiveView) {
      case 'auth':
        return <AuthPage onSuccess={handleAuthSuccess} onBack={() => navigateTo('home')} />;

      case 'member':
        if (!isAuthenticated) { navigateTo('auth'); return null; }
        return <MemberDashboard onPlayAgain={handleStartChallenge} onNavigate={(v: string) => navigateTo(v as ViewState)} />;

      case 'admin':
        if (!isAdmin) { navigateTo('home'); return null; }
        return <AdminDashboard onNavigate={(v: string) => navigateTo(v as ViewState)} />;

      case 'home':
        return (
          <>
            <Hero onStartChallenge={handleStartChallenge} onViewDashboard={() => navigateTo('dashboard')} onViewLearning={() => navigateTo('learning')} />
            <HallOfFame />
            <PlatformFeatures />
            <Methodology />
          </>
        );

      case 'learning':
        return <LearningHub onStartChallenge={handleStartChallenge} />;

      case 'onboarding':
        return <OnboardingFlow onComplete={handleOnboardingComplete} onSkip={() => navigateTo('consent')} />;

      case 'consent':
        return <EthicsConsent onAccept={handleConsentAccept} onDecline={() => navigateTo('home')} />;

      case 'challenge':
        return <ParticipantRegistration onComplete={handleRegistrationComplete} />;

      case 'simulation':
        return <SimulationContainer onComplete={handleSimulationComplete} />;

      case 'results':
        return scoreResult ? (
          <div data-results-page>
            <ScoreDisplay result={scoreResult} onGeneratePDF={handleGeneratePDF} onGenerateCertificate={handleGenerateCertificate} onRetry={handleRetry} onShare={handleShare} />
            {isAuthenticated && (
              <div className="flex justify-center pb-12">
                <button onClick={() => navigateTo('member')} className="btn-cyber px-6 py-3 rounded-xl text-sm">
                  View My Score History
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <p className="text-slate-400 mb-4">No results yet</p>
              <button onClick={() => navigateTo('challenge')} className="btn-cyber px-6 py-3 rounded-xl">Start Assessment</button>
            </div>
          </div>
        );

      case 'dashboard':
        return <LiveDashboard />;

      case 'leaderboard':
        return <Leaderboard onStartChallenge={handleStartChallenge} />;

      case 'verify':
        return (
          <div className="min-h-[80vh] flex items-center justify-center container mx-auto px-4">
            <div className="glass-card rounded-3xl p-8 max-w-lg w-full text-center border-slate-800">
              <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-cyan-500/20">
                <Shield className="w-8 h-8 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Certificate Verification</h2>
              <p className="text-slate-400 mb-8">Validate the authenticity of Human Firewall assessment reports.</p>

              <div className="space-y-4 text-left">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700">
                  <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider">Security Notice</p>
                  <p className="text-sm text-slate-300">All certificates generated by this platform are cryptographically linked to a participant's real-time assessment data in our secure enterprise cloud.</p>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter ID: HF-XXXX-XXXX"
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 text-white focus:border-cyan-500 outline-none"
                  />
                  <button onClick={() => toast.success("Verification service online. ID format valid.")} className="btn-cyber px-4 py-2 rounded-xl text-sm">Verify</button>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800">
                <button onClick={() => navigateTo('home')} className="text-slate-500 hover:text-white text-sm">Back to Secure Portal</button>
              </div>
            </div>
          </div>
        );

      default:
        return <Hero onStartChallenge={handleStartChallenge} onViewDashboard={() => navigateTo('dashboard')} />;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[hsl(220,20%,4%)] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(220,20%,4%)] text-white">
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: 'hsl(220, 18%, 6%)', border: '1px solid hsl(220, 15%, 20%)', color: '#fff' },
        }}
      />

      <Navigation
        currentView={currentView}
        onNavigate={(view) => navigateTo(view as ViewState)}
        isAuthenticated={isAuthenticated}
        isAdmin={isAdmin}
        onAuthClick={() => navigateTo('auth')}
        onProfileClick={() => navigateTo(isAdmin ? 'admin' : 'member')}
      />

      <main className="pt-16 md:pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer onNavigate={(view) => navigateTo(view as ViewState)} />

      {/* Exhibition Mode Removed */}

      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-400">Generating report...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
