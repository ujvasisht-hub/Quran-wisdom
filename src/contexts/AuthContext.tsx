import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface Profile {
  id: string;
  email: string | null;
  is_premium: boolean;
  created_at: string;
  notification_time?: string;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  trialDaysLeft: number;
  isTrialExpired: boolean;
}

interface AuthContextType extends AuthState {
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateNotificationTime: (time: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const TRIAL_DAYS = 21;

function calculateTrialDays(createdAt: string): { daysLeft: number; isExpired: boolean } {
  const created = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const daysLeft = Math.max(0, TRIAL_DAYS - diffDays);
  return { daysLeft, isExpired: diffDays >= TRIAL_DAYS };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    loading: true,
    trialDaysLeft: TRIAL_DAYS,
    isTrialExpired: false,
  });

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    return data as Profile | null;
  };

  const refreshProfile = async () => {
    if (!state.user) return;
    const profile = await fetchProfile(state.user.id);
    if (profile) {
      const { daysLeft, isExpired } = calculateTrialDays(profile.created_at);
      setState((prev) => ({
        ...prev,
        profile,
        trialDaysLeft: daysLeft,
        isTrialExpired: isExpired && !profile.is_premium,
      }));
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id).then((profile) => {
          const trial = profile
            ? calculateTrialDays(profile.created_at)
            : { daysLeft: TRIAL_DAYS, isExpired: false };
          setState({
            user: session.user,
            session,
            profile,
            loading: false,
            trialDaysLeft: trial.daysLeft,
            isTrialExpired: trial.isExpired && !(profile?.is_premium ?? false),
          });
        });
      } else {
        setState((prev) => ({ ...prev, loading: false }));
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setState({
          user: null,
          session: null,
          profile: null,
          loading: false,
          trialDaysLeft: TRIAL_DAYS,
          isTrialExpired: false,
        });
        return;
      }

      if (session?.user) {
        (async () => {
          const profile = await fetchProfile(session.user.id);
          const trial = profile
            ? calculateTrialDays(profile.created_at)
            : { daysLeft: TRIAL_DAYS, isExpired: false };
          setState({
            user: session.user,
            session,
            profile,
            loading: false,
            trialDaysLeft: trial.daysLeft,
            isTrialExpired: trial.isExpired && !(profile?.is_premium ?? false),
          });
        })();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };
    if (data.user) {
      await supabase
        .from('profiles')
        .upsert(
          { id: data.user.id, email: data.user.email ?? email },
          { onConflict: 'id' }
        );
    }
    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const updateNotificationTime = async (time: string) => {
    if (!state.user) return;
    await supabase
      .from('profiles')
      .update({ notification_time: time })
      .eq('id', state.user.id);
    setState((prev) => ({
      ...prev,
      profile: prev.profile ? { ...prev.profile, notification_time: time } : prev.profile,
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signUp,
        signIn,
        signOut,
        refreshProfile,
        updateNotificationTime,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
