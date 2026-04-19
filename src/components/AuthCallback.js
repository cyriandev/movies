import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/auth/AuthContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { authLoading, user, isSupabaseConfigured } = useAuth();
  const nextPath = searchParams.get('next') || '/watchlist';

  useEffect(() => {
    if (!isSupabaseConfigured) {
      navigate('/login', { replace: true });
      return;
    }

    if (!authLoading) {
      navigate(user ? nextPath : '/login', { replace: true });
    }
  }, [authLoading, isSupabaseConfigured, navigate, nextPath, user]);

  return (
    <div className="double-shell w-full">
      <div className="double-core flex h-64 flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="spinner" />
        <p className="text-sm text-[#9ca1b7]">Finishing your sign-in session...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
