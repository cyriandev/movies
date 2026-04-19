import React, { useMemo, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { RiArrowRightUpLine, RiKey2Line, RiMailLine } from 'react-icons/ri';
import { missingSupabaseEnv } from '../lib/supabase';
import { useAuth } from '../context/auth/AuthContext';
import Seo from './Seo';

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, authLoading, isSupabaseConfigured, sendEmailOtp, verifyEmailOtp } = useAuth();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const search = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const nextPath =
    search.get('next') || location.state?.from?.pathname || location.state?.from || '/watchlist';

  if (!authLoading && user) {
    return <Navigate to={nextPath} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');

    const response = otpSent
      ? await verifyEmailOtp({ email, token: otp.trim() })
      : await sendEmailOtp({ email, nextPath });

    setSubmitting(false);

    if (response.error) {
      setMessage(response.error.message);
      return;
    }

    if (!otpSent) {
      setOtpSent(true);
      setMessage('We sent a one-time code to your email. Enter it below to continue.');
      return;
    }

    navigate(nextPath, { replace: true });
  };

  const handleBackToEmail = () => {
    setOtp('');
    setOtpSent(false);
    setMessage('');
  };

  return (
    <div className="w-full space-y-6">
      <Seo
        title="Continue with email - moviesntv"
        description="Access your watchlist and personal tracking with a personal account."
      />

      <div className="double-shell">
        <div className="double-core px-5 py-6 sm:px-6 sm:py-7">
          <div className="mx-auto max-w-xl">
            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#7c8197]">Account</p>
            <h1 className="headline-gradient mt-3 text-[2.4rem] leading-[0.92] sm:text-[3.2rem]">
              Continue with email.
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-7 text-[#9ca1b7]">
              Save films, mark watched movies, and keep your series episode progress synced with a one-time email code.
            </p>
          </div>
        </div>
      </div>

      <div className="double-shell">
        <div className="double-core px-5 py-5 sm:px-6 sm:py-6">
          <div className="mx-auto max-w-xl space-y-4">
            {!isSupabaseConfigured && (
              <div className="rounded-[1rem] border border-[rgba(255,204,53,0.18)] bg-[rgba(255,204,53,0.08)] px-4 py-4 text-sm leading-6 text-[#f5f6fb]">
                Supabase is not configured yet. Add {missingSupabaseEnv.join(' and ')} to your local
                environment to enable auth and tracking.
              </div>
            )}

            {message && (
              <div className="rounded-[1rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-[#f5f6fb]">
                {message}
              </div>
            )}

            <form className="space-y-3" onSubmit={handleSubmit}>
              <label className="block">
                <span className="mb-2 block text-[0.68rem] uppercase tracking-[0.2em] text-[#7c8197]">
                  Email
                </span>
                <span className="input-shell flex items-center gap-3 px-4 py-3">
                  <RiMailLine className="text-[var(--text-warm)]" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full bg-transparent text-sm text-[#f4f7fb] placeholder:text-[var(--muted-warm-soft)] focus:outline-none"
                    required
                  />
                </span>
              </label>

              {otpSent && (
                <label className="block">
                  <span className="mb-2 block text-[0.68rem] uppercase tracking-[0.2em] text-[#7c8197]">
                    One-time code
                  </span>
                  <span className="input-shell flex items-center gap-3 px-4 py-3">
                    <RiKey2Line className="text-[var(--text-warm)]" size={18} />
                    <input
                      type="text"
                      value={otp}
                      onChange={(event) => setOtp(event.target.value.replace(/\s/g, ''))}
                      placeholder="Enter the 6-digit code"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      className="w-full bg-transparent text-sm text-[#f4f7fb] placeholder:text-[var(--muted-warm-soft)] focus:outline-none"
                      required
                    />
                  </span>
                </label>
              )}

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <button
                  type="submit"
                  className="action-pill action-pill-active w-full justify-center sm:w-auto"
                  disabled={submitting}
                >
                  {submitting
                    ? 'Please wait...'
                    : otpSent
                      ? 'Verify code'
                      : 'Continue with email'}
                  <RiArrowRightUpLine size={16} />
                </button>

                {otpSent && (
                  <button
                    type="button"
                    onClick={handleBackToEmail}
                    className="action-pill w-full justify-center sm:w-auto"
                    disabled={submitting}
                  >
                    Change email
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
