// ============================================
// AUTH PAGE — Login & Register
// Human Firewall Intelligence Platform
// ============================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';

interface AuthPageProps {
    onSuccess: () => void;
    onBack: () => void;
}

type AuthTab = 'login' | 'register';

// Password strength indicator
function PasswordStrength({ password }: { password: string }) {
    const checks = [
        { label: '8+ karakter', ok: password.length >= 8 },
        { label: 'Huruf kapital', ok: /[A-Z]/.test(password) },
        { label: 'Angka', ok: /[0-9]/.test(password) },
        { label: 'Karakter spesial', ok: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password) },
    ];
    const strength = checks.filter(c => c.ok).length;
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-cyan-400'];
    const labels = ['Lemah', 'Sedang', 'Kuat', 'Sangat Kuat'];

    if (!password) return null;

    return (
        <div className="mt-2 space-y-2">
            <div className="flex gap-1">
                {[0, 1, 2, 3].map(i => (
                    <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < strength ? colors[strength - 1] : 'bg-slate-700'}`}
                    />
                ))}
            </div>
            <div className="flex justify-between text-xs">
                <span className="text-slate-500">{password ? labels[Math.max(0, strength - 1)] : ''}</span>
                <div className="flex gap-2">
                    {checks.map(c => (
                        <span key={c.label} className={`flex items-center gap-0.5 ${c.ok ? 'text-cyan-400' : 'text-slate-600'}`}>
                            <CheckCircle className="w-2.5 h-2.5" /> {c.label}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function AuthPage({ onSuccess, onBack }: AuthPageProps) {
    const { signIn, signUp } = useAuth();
    const [activeTab, setActiveTab] = useState<AuthTab>('login');

    // Login state
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [showLoginPass, setShowLoginPass] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);

    // Register state
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regConfirm, setRegConfirm] = useState('');
    const [showRegPass, setShowRegPass] = useState(false);
    const [regError, setRegError] = useState('');
    const [regSuccess, setRegSuccess] = useState(false);
    const [regLoading, setRegLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');
        setLoginLoading(true);
        try {
            const err = await signIn(loginEmail, loginPassword);
            if (err) {
                setLoginError(err);
            } else {
                onSuccess();
            }
        } finally {
            setLoginLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setRegError('');
        setRegLoading(true);
        try {
            const err = await signUp(regName, regEmail, regPassword, regConfirm);
            if (err) {
                setRegError(err);
            } else {
                setRegSuccess(true);
            }
        } finally {
            setRegLoading(false);
        }
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 cyber-gradient cyber-grid-bg" />
            <motion.div
                className="absolute w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl"
                animate={{ x: [0, 80, 0], y: [0, -40, 0] }}
                transition={{ duration: 18, repeat: Infinity }}
                style={{ top: '10%', left: '5%' }}
            />

            {/* Card */}
            <div className="relative z-10 w-full max-w-md mx-auto px-4 py-8">
                {/* Back Button */}
                <motion.button
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 mb-6 text-sm transition-colors"
                    whileHover={{ x: -4 }}
                >
                    <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
                </motion.button>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-8 h-8 text-cyan-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Human Firewall</h1>
                    <p className="text-slate-400 text-sm mt-1">Masuk atau buat akun untuk mulai bermain</p>
                </motion.div>

                {/* Tab Switcher */}
                <div className="flex glass-card rounded-xl p-1 mb-6">
                    {(['login', 'register'] as AuthTab[]).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab
                                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                : 'text-slate-400 hover:text-slate-300'
                                }`}
                        >
                            {tab === 'login' ? 'Login' : 'Daftar'}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {/* ─── LOGIN FORM ─── */}
                    {activeTab === 'login' && (
                        <motion.form
                            key="login"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.2 }}
                            onSubmit={handleLogin}
                            className="glass-card rounded-2xl p-6 space-y-4"
                        >
                            <div className="space-y-2">
                                <Label htmlFor="login-email" className="text-slate-300 flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-cyan-400" /> Email
                                </Label>
                                <Input
                                    id="login-email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={loginEmail}
                                    onChange={e => setLoginEmail(e.target.value)}
                                    className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
                                    required
                                    autoComplete="email"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="login-password" className="text-slate-300 flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-cyan-400" /> Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="login-password"
                                        type={showLoginPass ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={loginPassword}
                                        onChange={e => setLoginPassword(e.target.value)}
                                        className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 pr-10"
                                        required
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowLoginPass(v => !v)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                                        aria-label="Toggle password visibility"
                                    >
                                        {showLoginPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {loginError && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
                                >
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" /> {loginError}
                                </motion.div>
                            )}

                            <Button
                                type="submit"
                                disabled={loginLoading}
                                className="w-full btn-cyber py-5 rounded-xl"
                            >
                                {loginLoading ? (
                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Masuk...</>
                                ) : 'Masuk ke Platform'}
                            </Button>

                            <p className="text-center text-xs text-slate-500">
                                Belum punya akun?{' '}
                                <button type="button" onClick={() => setActiveTab('register')} className="text-cyan-400 hover:text-cyan-300">
                                    Daftar sekarang
                                </button>
                            </p>
                        </motion.form>
                    )}

                    {/* ─── REGISTER FORM ─── */}
                    {activeTab === 'register' && (
                        <motion.div
                            key="register"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            {regSuccess ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="glass-card rounded-2xl p-8 text-center"
                                >
                                    <CheckCircle className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-white mb-2">Pendaftaran Berhasil!</h3>
                                    <p className="text-slate-400 text-sm mb-6">
                                        Kami telah mengirim email verifikasi ke <strong className="text-white">{regEmail}</strong>.
                                        Silakan cek inbox dan klik link verifikasi sebelum login.
                                    </p>
                                    <Button onClick={() => { setRegSuccess(false); setActiveTab('login'); }} className="btn-cyber w-full py-4 rounded-xl">
                                        Lanjut ke Login
                                    </Button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleRegister} className="glass-card rounded-2xl p-6 space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="reg-name" className="text-slate-300 flex items-center gap-2">
                                            <User className="w-4 h-4 text-cyan-400" /> Nama Lengkap
                                        </Label>
                                        <Input
                                            id="reg-name"
                                            type="text"
                                            placeholder="Nama Anda"
                                            value={regName}
                                            onChange={e => setRegName(e.target.value)}
                                            className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
                                            required
                                            autoComplete="name"
                                            maxLength={100}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="reg-email" className="text-slate-300 flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-cyan-400" /> Email
                                        </Label>
                                        <Input
                                            id="reg-email"
                                            type="email"
                                            placeholder="you@example.com"
                                            value={regEmail}
                                            onChange={e => setRegEmail(e.target.value)}
                                            className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
                                            required
                                            autoComplete="email"
                                        />
                                        <p className="text-xs text-slate-500">Gunakan email aktif untuk verifikasi akun</p>
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="reg-password" className="text-slate-300 flex items-center gap-2">
                                            <Lock className="w-4 h-4 text-cyan-400" /> Password
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="reg-password"
                                                type={showRegPass ? 'text' : 'password'}
                                                placeholder="Min. 8 karakter"
                                                value={regPassword}
                                                onChange={e => setRegPassword(e.target.value)}
                                                className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 pr-10"
                                                required
                                                autoComplete="new-password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowRegPass(v => !v)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                                                aria-label="Toggle password visibility"
                                            >
                                                {showRegPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        <PasswordStrength password={regPassword} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="reg-confirm" className="text-slate-300 flex items-center gap-2">
                                            <Lock className="w-4 h-4 text-cyan-400" /> Konfirmasi Password
                                        </Label>
                                        <Input
                                            id="reg-confirm"
                                            type="password"
                                            placeholder="Ulangi password"
                                            value={regConfirm}
                                            onChange={e => setRegConfirm(e.target.value)}
                                            className={`bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 ${regConfirm && regConfirm !== regPassword ? 'border-red-500' : ''
                                                }`}
                                            required
                                            autoComplete="new-password"
                                        />
                                        {regConfirm && regConfirm !== regPassword && (
                                            <p className="text-xs text-red-400">Password tidak cocok</p>
                                        )}
                                    </div>

                                    {regError && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
                                        >
                                            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {regError}
                                        </motion.div>
                                    )}

                                    <Button
                                        type="submit"
                                        disabled={regLoading}
                                        className="w-full btn-cyber py-5 rounded-xl"
                                    >
                                        {regLoading ? (
                                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Mendaftar...</>
                                        ) : 'Buat Akun'}
                                    </Button>

                                    <p className="text-center text-xs text-slate-500">
                                        Sudah punya akun?{' '}
                                        <button type="button" onClick={() => setActiveTab('login')} className="text-cyan-400 hover:text-cyan-300">
                                            Masuk
                                        </button>
                                    </p>
                                </form>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Security badge */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 flex items-center justify-center gap-2 text-slate-600 text-xs"
                >
                    <Shield className="w-3 h-3" />
                    Dilindungi enkripsi end-to-end · Data hanya digunakan untuk edukasi
                </motion.div>
            </div>
        </section>
    );
}
