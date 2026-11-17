import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import {
  signInWithEmail,
  signUpWithEmail,
} from '../../services/supabase/supabaseClient';
import { sounds } from '../../services/audio/soundEffects';
import { haptic } from '../../services/haptic/hapticFeedback';

interface AuthPageProps {
  onAuthSuccess: (userEmail: string, userName?: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [name, setName] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    sounds.playClick();
    haptic.light();

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify.');
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        const { user, session, error, confirmationRequired } = await signUpWithEmail(
          email.trim(),
          password,
          name.trim()
        );
        if (error) {
          setErrorMsg(error);
          setIsLoading(false);
          return;
        }
        sounds.playFanfare();
        haptic.celebrate();

        if (confirmationRequired) {
          setSuccessMsg(
            'Account registered! Please check your email to confirm your account, then sign in.'
          );
          setIsLoading(false);
          setTimeout(() => {
            setIsSignUp(false);
          }, 2500);
          return;
        }

        setSuccessMsg('Account created successfully!');
        setTimeout(() => {
          onAuthSuccess(email.trim(), name.trim() || email.split('@')[0]);
        }, 500);
      } else {
        const { user, error } = await signInWithEmail(email.trim(), password);
        if (error) {
          setErrorMsg(error);
          setIsLoading(false);
          return;
        }
        sounds.playClick();
        haptic.medium();
        onAuthSuccess(
          email.trim(),
          (user?.user_metadata?.name as string) || email.split('@')[0]
        );
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'An error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F0E5] dark:bg-[#141C16] text-[#496354] dark:text-[#F2EDE4] flex flex-col justify-center items-center px-4 py-8 animate-fadeIn">
      {/* Brand & Emblem Header */}
      <div className="text-center mb-6 max-w-sm w-full">
        <div className="w-14 h-14 rounded-2xl bg-cozy-parchment dark:bg-darkSurface-card border border-cozy-gold/40 flex items-center justify-center text-2xl mx-auto mb-3 shadow-xs">
          🌿
        </div>
        <h1 className="font-serif font-bold text-2xl text-cozy-forest dark:text-cozy-ivory">
          Cozy Vintage
        </h1>
        <p className="text-xs text-cozy-brown dark:text-darkSurface-textMuted mt-1 font-serif italic">
          Build your life. One day at a time.
        </p>
      </div>

      {/* Main Clean Card */}
      <div className="bg-cozy-ivory dark:bg-darkSurface-card border border-cozy-gold/35 rounded-3xl p-6 shadow-cozy max-w-sm w-full transition-all">
        {/* Toggle Mode: Sign In / Create Account */}
        <div className="flex p-1 bg-cozy-parchment dark:bg-darkSurface-bg rounded-2xl border border-cozy-gold/25 mb-5">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setIsSignUp(false);
              setErrorMsg(null);
            }}
            className={`flex-1 py-1.5 rounded-xl text-xs font-serif font-semibold transition-all cursor-pointer ${
              !isSignUp
                ? 'bg-cozy-forest text-white shadow-xs'
                : 'text-cozy-brown dark:text-darkSurface-textMuted hover:text-cozy-forest'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setIsSignUp(true);
              setErrorMsg(null);
            }}
            className={`flex-1 py-1.5 rounded-xl text-xs font-serif font-semibold transition-all cursor-pointer ${
              isSignUp
                ? 'bg-cozy-forest text-white shadow-xs'
                : 'text-cozy-brown dark:text-darkSurface-textMuted hover:text-cozy-forest'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Alerts / Error feedback */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs flex items-center space-x-2 animate-fadeIn">
            <AlertCircle size={15} className="flex-shrink-0" />
            <span className="leading-snug">{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-900/60 text-green-700 dark:text-green-300 text-xs flex items-center space-x-2 animate-fadeIn">
            <CheckCircle size={15} className="flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Clean Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Name Field (Sign Up only) */}
          {isSignUp && (
            <div>
              <label className="text-xs font-semibold text-cozy-forestDark dark:text-cozy-ivory block mb-1">
                Your Name
              </label>
              <div className="relative">
                <UserIcon size={14} className="absolute left-3.5 top-3 text-cozy-brown/60" />
                <input
                  type="text"
                  required={isSignUp}
                  placeholder="e.g. Deep"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-cozy-gold/30 bg-cozy-parchment/40 dark:bg-darkSurface-bg text-xs focus:ring-2 focus:ring-cozy-sage focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="text-xs font-semibold text-cozy-forestDark dark:text-cozy-ivory block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail size={14} className="absolute left-3.5 top-3 text-cozy-brown/60" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-cozy-gold/30 bg-cozy-parchment/40 dark:bg-darkSurface-bg text-xs focus:ring-2 focus:ring-cozy-sage focus:outline-none"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="text-xs font-semibold text-cozy-forestDark dark:text-cozy-ivory block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock size={14} className="absolute left-3.5 top-3 text-cozy-brown/60" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-cozy-gold/30 bg-cozy-parchment/40 dark:bg-darkSurface-bg text-xs focus:ring-2 focus:ring-cozy-sage focus:outline-none"
              />
            </div>
          </div>

          {/* Confirm Password (Sign Up only) */}
          {isSignUp && (
            <div>
              <label className="text-xs font-semibold text-cozy-forestDark dark:text-cozy-ivory block mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-3 text-cozy-brown/60" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-cozy-gold/30 bg-cozy-parchment/40 dark:bg-darkSurface-bg text-xs focus:ring-2 focus:ring-cozy-sage focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-cozy-forest hover:bg-cozy-forestDark disabled:opacity-50 text-white font-serif font-bold py-2.5 px-4 rounded-xl shadow-xs flex items-center justify-center space-x-2 text-xs transition-transform active:scale-98 cursor-pointer"
          >
            <span>{isLoading ? 'Verifying...' : isSignUp ? 'Create My Account' : 'Sign In'}</span>
            <ArrowRight size={14} />
          </button>
        </form>
      </div>
    </div>
  );
};
