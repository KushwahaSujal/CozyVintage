import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, Loader2, ShieldCheck, X } from 'lucide-react';
import { signInWithGoogle } from '../../services/supabase/supabaseClient';
import { sounds } from '../../services/audio/soundEffects';
import { haptic } from '../../services/haptic/hapticFeedback';

interface AuthPageProps {
  initialError?: string | null;
  onClearError?: () => void;
}

const GoogleLogo: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
    />
    <path
      fill="#34A853"
      d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.565 24 12.255 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 0 0 0 10.76l3.98-3.09z"
    />
    <path
      fill="#EA4335"
      d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.69 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
    />
  </svg>
);

export const AuthPage: React.FC<AuthPageProps> = ({ initialError = null, onClearError }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(initialError);
  const isSubmittingRef = useRef<boolean>(false);

  // Sync callback or session initialization errors passed from App
  useEffect(() => {
    if (initialError) {
      setErrorMsg(initialError);
    }
  }, [initialError]);

  // Reset button state if user navigates back from the OAuth screen (bfcache restore)
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        isSubmittingRef.current = false;
        setIsLoading(false);
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  const handleDismissError = () => {
    setErrorMsg(null);
    onClearError?.();
  };

  const handleGoogleSignIn = async () => {
    // Prevent duplicate clicks during OAuth handoff
    if (isSubmittingRef.current || isLoading) return;

    isSubmittingRef.current = true;
    setIsLoading(true);
    setErrorMsg(null);
    onClearError?.();

    sounds.playClick();
    haptic.light();

    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setErrorMsg(error);
        isSubmittingRef.current = false;
        setIsLoading(false);
      }
      // On success, the browser redirects to Google OAuth and returns to window.location.origin
    } catch {
      setErrorMsg('Google sign-in could not be started. Please try again.');
      isSubmittingRef.current = false;
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F0E5] dark:bg-[#141C16] text-[#496354] dark:text-[#F2EDE4] flex flex-col justify-center items-center px-4 py-10 sm:px-6 animate-fadeIn">
      {/* Brand & Logo Header */}
      <div className="text-center mb-7 max-w-sm w-full">
        <img
          src="/icons/icon-192.png"
          alt="Cozy Vintage Logo"
          className="w-20 h-20 rounded-3xl mx-auto mb-3.5 shadow-cozy object-cover border border-cozy-gold/40"
        />
        <h1 className="font-serif font-bold text-2xl sm:text-3xl tracking-wide text-cozy-forest dark:text-cozy-ivory">
          Cozy Vintage
        </h1>
        <p className="text-xs sm:text-sm text-cozy-brown dark:text-darkSurface-textMuted mt-1 font-serif italic">
          Build your life. One day at a time.
        </p>
      </div>

      {/* Clean Google Authentication Card */}
      <div className="bg-cozy-ivory dark:bg-darkSurface-card border border-cozy-gold/35 rounded-3xl p-6 sm:p-8 shadow-cozy max-w-sm sm:max-w-md w-full transition-all">
        <div className="text-center mb-6">
          <h2 className="font-serif font-bold text-lg sm:text-xl text-cozy-forestDark dark:text-cozy-ivory">
            Welcome to Your Sanctuary
          </h2>
          <p className="text-xs sm:text-sm text-cozy-brown dark:text-darkSurface-textMuted mt-2 leading-relaxed">
            Your personal discipline tracker for focused study, daily hydration, mindful habits, and long-term growth.
          </p>
        </div>

        {/* OAuth / Session Error Banner */}
        {errorMsg && (
          <div
            role="alert"
            className="mb-5 p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs flex items-start justify-between gap-2.5 animate-fadeIn"
          >
            <div className="flex items-start gap-2">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <span className="leading-snug">{errorMsg}</span>
            </div>
            <button
              type="button"
              onClick={handleDismissError}
              aria-label="Dismiss error"
              className="text-red-500/80 hover:text-red-700 dark:hover:text-red-200 p-0.5 flex-shrink-0 cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Continue with Google Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          aria-busy={isLoading}
          className="w-full py-3 px-4 rounded-2xl bg-white dark:bg-darkSurface-bg hover:bg-cozy-parchment/60 dark:hover:bg-darkSurface-border/40 border border-cozy-gold/45 hover:border-cozy-gold text-cozy-forestDark dark:text-cozy-ivory font-medium text-sm shadow-sm hover:shadow-cozy flex items-center justify-center gap-3 transition-all duration-150 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-cozy-sage focus:ring-offset-2 focus:ring-offset-cozy-ivory dark:focus:ring-offset-darkSurface-card"
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin text-cozy-forest dark:text-cozy-gold" />
              <span className="font-serif font-semibold">Connecting to Google...</span>
            </>
          ) : (
            <>
              <GoogleLogo className="w-5 h-5 flex-shrink-0" />
              <span className="font-serif font-semibold">Continue with Google</span>
            </>
          )}
        </button>

        {/* Privacy Notice */}
        <div className="mt-6 pt-4 border-t border-cozy-gold/20 flex items-start gap-2 text-[11px] text-cozy-brown/85 dark:text-darkSurface-textMuted leading-relaxed">
          <ShieldCheck size={14} className="text-cozy-sage flex-shrink-0 mt-0.5" />
          <p>
            We use Google solely to verify your account securely. Your daily routines, study logs, and personal progress remain private.
          </p>
        </div>
      </div>
    </div>
  );
};
