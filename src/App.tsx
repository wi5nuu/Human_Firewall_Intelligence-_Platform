import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import { Navigation } from './sections/Navigation';
import { Hero } from './sections/Hero';
import { OnboardingFlow } from './sections/OnboardingFlow';
import { EthicsConsent } from './sections/EthicsConsent';
import { ParticipantRegistration } from './sections/ParticipantRegistration';
import { SimulationContainer } from './sections/SimulationContainer';
import { ScoreDisplay } from './sections/ScoreDisplay';
import { LiveDashboard } from './sections/LiveDashboard';
import { Leaderboard } from './sections/Leaderboard';
import { Footer } from './sections/Footer';
import { ExhibitionMode, useExhibitionMode } from './sections/ExhibitionMode';
import { AuthPage } from './sections/AuthPage';
import { MemberDashboard } from './sections/MemberDashboard';
import { AdminDashboard } from './sections/AdminDashboard';
import { useSimulationStore } from './store';
import { useAuth } from './hooks/useAuth';
import { generatePDFReport, generateVerificationCode, generateShareText } from './lib/pdfGenerator';
import './App.css';

// ============================================
// HUMAN FIREWALL INTELLIGENCE PLATFORM v3.0
// Main Application Component
// ============================================

type ViewState =
  | 'home' | 'auth' | 'onboarding' | 'consent' | 'challenge'
  | 'simulation' | 'results' | 'dashboard' | 'leaderboard'
  | 'member' | 'admin';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [isLoading, setIsLoading] = useState(false);
  const { isExhibitionMode, toggleExhibitionMode } = useExhibitionMode();
  const { isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();

  const { currentParticipant, scoreResult, resetSimulation } = useSimulationStore();

  const navigateTo = (view: ViewState) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Start challenge — requires login
  const handleStartChallenge = () => {
    if (!isAuthenticated) {
      navigateTo('auth');
      return;
    }
    if (currentParticipant && scoreResult) {
      toast.info('Memulai assessment baru...', { duration: 2000 });
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
    toast.success('Selamat datang! Mulai assessment Anda.');
  };

  const handleRegistrationComplete = () => {
    navigateTo('simulation');
    toast.success('Assessment dimulai! Semangat!', {
      description: 'Analisis setiap skenario dengan teliti.',
    });
  };

  const handleSimulationComplete = () => {
    navigateTo('results');
    toast.success('Assessment selesai!', { description: 'Lihat profil keamanan Anda.' });
    if (isExhibitionMode) setTimeout(handleResetToHome, 30000);
  };

  const handleResetToHome = () => {
    resetSimulation();
    navigateTo('home');
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
      toast.success('Laporan berhasil diunduh!', { description: `Kode verifikasi: ${code}` });
    } catch {
      toast.error('Gagal membuat laporan');
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
    else { navigator.clipboard.writeText(text); toast.success('Disalin ke clipboard!'); }
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
        return <MemberDashboard onPlayAgain={handleStartChallenge} onNavigate={(v) => navigateTo(v as ViewState)} />;

      case 'admin':
        if (!isAdmin) { navigateTo('home'); return null; }
        return <AdminDashboard onNavigate={(v) => navigateTo(v as ViewState)} />;

      case 'home':
        return <Hero onStartChallenge={handleStartChallenge} onViewDashboard={() => navigateTo('dashboard')} />;

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
            <ScoreDisplay result={scoreResult} onGeneratePDF={handleGeneratePDF} onRetry={handleRetry} onShare={handleShare} />
            {isAuthenticated && (
              <div className="flex justify-center pb-12">
                <button onClick={() => navigateTo('member')} className="btn-cyber px-6 py-3 rounded-xl text-sm">
                  Lihat Riwayat Skor Saya
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <p className="text-slate-400 mb-4">Belum ada hasil</p>
              <button onClick={() => navigateTo('challenge')} className="btn-cyber px-6 py-3 rounded-xl">Mulai Assessment</button>
            </div>
          </div>
        );

      case 'dashboard':
        return <LiveDashboard />;

      case 'leaderboard':
        return <Leaderboard onStartChallenge={handleStartChallenge} />;

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

      {!isExhibitionMode && (
        <Navigation
          currentView={currentView}
          onNavigate={(view) => navigateTo(view as ViewState)}
          isAuthenticated={isAuthenticated}
          isAdmin={isAdmin}
          onAuthClick={() => navigateTo('auth')}
          onProfileClick={() => navigateTo(isAdmin ? 'admin' : 'member')}
        />
      )}

      <main className={`${!isExhibitionMode ? 'pt-16 md:pt-20' : ''}`}>
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

      {!isExhibitionMode && <Footer onNavigate={(view) => navigateTo(view as ViewState)} />}

      <ExhibitionMode isActive={isExhibitionMode} onToggle={toggleExhibitionMode} onReset={handleResetToHome}>
        {null}
      </ExhibitionMode>

      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-400">Membuat laporan...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
