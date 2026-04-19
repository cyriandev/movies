import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';

const defaultAuthContext = {
  session: null,
  user: null,
  authLoading: false,
  isSupabaseConfigured,
  sendEmailOtp: async () => ({ error: new Error('Auth provider is unavailable.') }),
  verifyEmailOtp: async () => ({ error: new Error('Auth provider is unavailable.') }),
  signInWithGoogle: async () => ({ error: new Error('Auth provider is unavailable.') }),
  signOut: async () => ({ error: null }),
};

const AuthContext = createContext(defaultAuthContext);

const isSameSession = (currentSession, nextSession) =>
  currentSession?.access_token === nextSession?.access_token &&
  currentSession?.refresh_token === nextSession?.refresh_token &&
  currentSession?.user?.id === nextSession?.user?.id;

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false);
      return undefined;
    }

    let active = true;

    const applySession = (nextSession) => {
      if (!active) {
        return;
      }

      setSession((currentSession) =>
        isSameSession(currentSession, nextSession) ? currentSession : nextSession
      );
      setAuthLoading(false);
    };

    const initialize = async () => {
      const { data } = await supabase.auth.getSession();
      applySession(data.session);
    };

    initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      applySession(nextSession);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const user = session?.user || null;

  const sendEmailOtp = async ({ email, nextPath = '/watchlist' }) => {
    if (!supabase) {
      return { error: new Error('Supabase is not configured.') };
    }

    const emailRedirectTo =
      typeof window !== 'undefined'
        ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`
        : undefined;

    return supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo,
      },
    });
  };

  const verifyEmailOtp = async ({ email, token }) => {
    if (!supabase) {
      return { error: new Error('Supabase is not configured.') };
    }

    return supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });
  };

  const signInWithGoogle = async (nextPath = '/watchlist') => {
    if (!supabase) {
      return { error: new Error('Supabase is not configured.') };
    }

    const redirectTo =
      typeof window !== 'undefined'
        ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`
        : undefined;

    return supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });
  };

  const signOut = async () => {
    if (!supabase) {
      return { error: null };
    }

    return supabase.auth.signOut();
  };

  const value = useMemo(
    () => ({
      session,
      user,
      authLoading,
      isSupabaseConfigured,
      sendEmailOtp,
      verifyEmailOtp,
      signInWithGoogle,
      signOut,
    }),
    [session, user, authLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext) || defaultAuthContext;
