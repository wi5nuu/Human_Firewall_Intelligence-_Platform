// ============================================
// useAuth Hook — Supabase Auth State Manager
// Human Firewall Intelligence Platform
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

// ─── Types ───────────────────────────────────────────────
export interface UserProfile {
    id: string;
    name: string;
    role: 'member' | 'admin';
    created_at: string;
}

export interface AuthState {
    user: User | null;
    session: Session | null;
    profile: UserProfile | null;
    isLoading: boolean;
    isAdmin: boolean;
    isAuthenticated: boolean;
}

// ─── Security: Rate limiting for login attempts ───────────
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

function isRateLimited(email: string): boolean {
    const now = Date.now();
    const record = loginAttempts.get(email);

    if (!record) return false;

    // Reset after 15 minutes
    if (now - record.lastAttempt > 15 * 60 * 1000) {
        loginAttempts.delete(email);
        return false;
    }
    // Block after 5 failed attempts
    return record.count >= 5;
}

function recordFailedAttempt(email: string): void {
    const now = Date.now();
    const record = loginAttempts.get(email);
    loginAttempts.set(email, {
        count: (record?.count ?? 0) + 1,
        lastAttempt: now,
    });
}

function clearAttempts(email: string): void {
    loginAttempts.delete(email);
}

// ─── Input Sanitization ───────────────────────────────────
function sanitizeInput(input: string): string {
    return input
        .trim()
        .replace(/[<>'"`;]/g, '') // Strip dangerous chars
        .slice(0, 300); // Limit length
}

function validatePassword(password: string): string | null {
    if (password.length < 8) return 'Password harus minimal 8 karakter';
    if (!/[A-Z]/.test(password)) return 'Password harus mengandung huruf kapital';
    if (!/[0-9]/.test(password)) return 'Password harus mengandung angka';
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
        return 'Password harus mengandung karakter spesial (!@#$%^&*)';
    }
    return null;
}

function validateStudentEmail(email: string): string | null {
    const clean = email.trim().toLowerCase();
    if (!clean) return 'Email wajib diisi';
    if (!clean.includes('@')) return 'Format email tidak valid';
    if (!clean.endsWith('@student.president.ac.id')) {
        return 'Hanya email @student.president.ac.id yang diperbolehkan';
    }
    return null;
}

// ─── Hook ─────────────────────────────────────────────────
export function useAuth() {
    const [state, setState] = useState<AuthState>({
        user: null,
        session: null,
        profile: null,
        isLoading: true,
        isAdmin: false,
        isAuthenticated: false,
    });

    // Fetch user profile from DB
    const fetchProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
        if (!supabase) return null;
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();
            if (error) throw error;
            return data as UserProfile;
        } catch {
            return null;
        }
    }, []);

    useEffect(() => {
        if (!supabase) {
            setState(prev => ({ ...prev, isLoading: false }));
            return;
        }

        // Get initial session
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            let profile: UserProfile | null = null;
            if (session?.user) {
                profile = await fetchProfile(session.user.id);
            }
            setState({
                user: session?.user ?? null,
                session,
                profile,
                isLoading: false,
                isAdmin: profile?.role === 'admin',
                isAuthenticated: !!session?.user,
            });
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                let profile: UserProfile | null = null;
                if (session?.user) {
                    profile = await fetchProfile(session.user.id);
                }
                setState({
                    user: session?.user ?? null,
                    session,
                    profile,
                    isLoading: false,
                    isAdmin: profile?.role === 'admin',
                    isAuthenticated: !!session?.user,
                });
            }
        );

        return () => subscription.unsubscribe();
    }, [fetchProfile]);

    // ─── Sign In ─────────────────────────────────────
    const signIn = useCallback(async (emailRaw: string, password: string): Promise<string | null> => {
        const email = sanitizeInput(emailRaw).toLowerCase();

        if (isRateLimited(email)) {
            return 'Terlalu banyak percobaan login. Coba lagi dalam 15 menit.';
        }

        if (!supabase) return 'Supabase tidak tersambung';

        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
                recordFailedAttempt(email);
                if (error.message.includes('Invalid login credentials')) {
                    return 'Email atau password salah';
                }
                if (error.message.includes('Email not confirmed')) {
                    return 'Silakan verifikasi email Anda terlebih dahulu';
                }
                return 'Login gagal. Silakan coba lagi.';
            }
            clearAttempts(email); // Reset on success
            return null;
        } catch {
            return 'Terjadi kesalahan. Silakan coba lagi.';
        }
    }, []);

    // ─── Sign Up ─────────────────────────────────────
    const signUp = useCallback(async (
        nameRaw: string,
        emailRaw: string,
        password: string,
        confirmPassword: string
    ): Promise<string | null> => {
        const name = sanitizeInput(nameRaw);
        const email = sanitizeInput(emailRaw).toLowerCase();

        // Validate
        if (!name || name.length < 2) return 'Nama harus minimal 2 karakter';
        const emailErr = validateStudentEmail(email);
        if (emailErr) return emailErr;
        const passErr = validatePassword(password);
        if (passErr) return passErr;
        if (password !== confirmPassword) return 'Konfirmasi password tidak cocok';

        if (!supabase) return 'Supabase tidak tersambung';

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { name, role: 'member' },
                },
            });

            if (error) {
                if (error.message.includes('already registered')) {
                    return 'Email ini sudah terdaftar. Silakan login.';
                }
                return 'Registrasi gagal: ' + error.message;
            }

            return null;
        } catch {
            return 'Terjadi kesalahan. Silakan coba lagi.';
        }
    }, []);

    // ─── Sign Out ────────────────────────────────────
    const signOut = useCallback(async (): Promise<void> => {
        if (supabase) await supabase.auth.signOut();
    }, []);

    return {
        ...state,
        signIn,
        signUp,
        signOut,
        validateStudentEmail,
        validatePassword,
    };
}
