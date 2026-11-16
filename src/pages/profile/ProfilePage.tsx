import React, { useState } from 'react';
import {
  User,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Vibrate,
  Shield,
  Download,
  Upload,
  RotateCcw,
  Smartphone,
  Sparkles,
  Lock,
  Check,
  Heart,
  Save,
} from 'lucide-react';
import { sounds } from '../../services/audio/soundEffects';
import { haptic } from '../../services/haptic/hapticFeedback';
import type { UserProfile, ChallengeCommitment } from '../../types';

interface ProfilePageProps {
  user: UserProfile;
  challenge: ChallengeCommitment;
  onUpdateUser: (updated: UserProfile) => void;
  onResetAllData: () => void;
  onExportBackup: () => void;
  onImportBackup: (jsonString: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  challenge,
  onUpdateUser,
  onResetAllData,
  onExportBackup,
  onImportBackup,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [name, setName] = useState<string>(user.name);
  const [avatar, setAvatar] = useState<string>(user.avatarId || '🌿');
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [installPromptEvent, setInstallPromptEvent] = useState<unknown>(null);

  // Check if PWA install prompt is available
  React.useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPromptEvent(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallPWA = async () => {
    if (installPromptEvent) {
      const promptEvent = installPromptEvent as { prompt: () => void; userChoice: Promise<{ outcome: string }> };
      promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      if (choice.outcome === 'accepted') {
        setInstallPromptEvent(null);
      }
    } else {
      alert('To install Cozy Vintage as an app on your phone:\n\n1. In Chrome: Tap the ⋮ menu at top-right -> select "Add to Home screen" or "Install App".\n2. In Safari: Tap Share -> "Add to Home Screen".');
    }
  };

  const handleToggleTheme = () => {
    sounds.playClick();
    haptic.light();
    const newTheme: 'vintage' | 'dark_forest' = user.theme === 'vintage' ? 'dark_forest' : 'vintage';
    const updated: UserProfile = { ...user, theme: newTheme };
    if (newTheme === 'dark_forest') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    onUpdateUser(updated);
  };

  const handleToggleSound = () => {
    const enabled = !user.soundEnabled;
    sounds.setEnabled(enabled);
    if (enabled) sounds.playClick();
    onUpdateUser({ ...user, soundEnabled: enabled });
  };

  const handleToggleVibration = () => {
    const enabled = !user.vibrationEnabled;
    haptic.setEnabled(enabled);
    if (enabled) haptic.medium();
    onUpdateUser({ ...user, vibrationEnabled: enabled });
  };

  const handleToggleBiometric = async () => {
    sounds.playClick();
    haptic.light();

    // Check WebAuthn support
    if (typeof window !== 'undefined' && window.PublicKeyCredential) {
      try {
        const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        if (available || !user.biometricLockEnabled) {
          onUpdateUser({ ...user, biometricLockEnabled: !user.biometricLockEnabled });
          return;
        }
      } catch {
        // Fallback
      }
    }
    onUpdateUser({ ...user, biometricLockEnabled: !user.biometricLockEnabled });
  };

  const handleSaveProfile = () => {
    sounds.playClick();
    haptic.light();
    onUpdateUser({ ...user, name, avatarId: avatar });
    setIsEditing(false);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          onImportBackup(text);
          sounds.playFanfare();
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-lg mx-auto space-y-5 animate-fadeIn">
      {/* 1. Profile Top Card */}
      <div className="bg-gradient-to-br from-cozy-parchment to-cozy-parchmentDark/50 dark:from-darkSurface-card dark:to-darkSurface-bg border border-cozy-gold/40 rounded-3xl p-5 shadow-cozy flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-16 h-16 rounded-2xl bg-cozy-ivory dark:bg-darkSurface-card border-2 border-cozy-gold flex items-center justify-center text-3xl shadow-sm">
            {user.avatarId || '🌿'}
          </div>
          <div>
            <h2 className="font-serif font-bold text-xl text-cozy-forest dark:text-cozy-ivory">
              {user.name}
            </h2>
            <div className="text-xs text-cozy-brown dark:text-darkSurface-textMuted mt-0.5">
              Age {user.age} • {user.highestQualification}
            </div>
            <div className="text-[10px] text-cozy-sageDark dark:text-cozy-sage font-medium">
              Committed to {challenge.durationDays}-Day Transformation
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className="text-xs bg-cozy-ivory dark:bg-darkSurface-card border border-cozy-gold/30 hover:border-cozy-gold px-3 py-1.5 rounded-xl font-semibold text-cozy-forestDark dark:text-cozy-ivory shadow-sm"
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {/* Profile Edit Drawer / Form */}
      {isEditing && (
        <div className="p-4 bg-cozy-ivory dark:bg-darkSurface-card border border-cozy-gold rounded-3xl shadow-cozy space-y-3 animate-fadeIn">
          <div>
            <label className="text-xs font-semibold">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-xl border border-cozy-gold/40 bg-white dark:bg-darkSurface-bg text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-semibold">Companion Sigil</label>
            <div className="flex gap-2 mt-1">
              {['🌿', '🦊', '🦉', '🧙‍♂️', '⚔️', '✨', '📖'].map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => setAvatar(av)}
                  className={`text-xl p-2 rounded-xl border ${
                    avatar === av ? 'border-cozy-sage bg-cozy-sage/20' : 'border-cozy-parchmentDark'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleSaveProfile}
              className="bg-cozy-forest text-white text-xs font-serif font-bold px-4 py-2 rounded-xl shadow-sm flex items-center gap-1.5"
            >
              <Save size={13} /> Save Changes
            </button>
          </div>
        </div>
      )}

      {/* 2. PWA Install Banner */}
      <div className="bg-cozy-sage/15 dark:bg-cozy-sage/20 border border-cozy-sage/40 rounded-3xl p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-cozy-sage text-white flex items-center justify-center">
            <Smartphone size={20} />
          </div>
          <div>
            <div className="font-serif font-bold text-sm text-cozy-forest dark:text-cozy-ivory">
              Install Cozy Vintage App
            </div>
            <div className="text-[10px] text-cozy-brown dark:text-darkSurface-textMuted">
              Add to your home screen for standalone offline experience
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleInstallPWA}
          className="bg-cozy-forest hover:bg-cozy-forestDark text-white text-xs font-serif font-bold px-3.5 py-2 rounded-xl shadow-sm"
        >
          Install
        </button>
      </div>

      {/* 3. Settings & Preferences Card */}
      <div className="bg-cozy-parchment/60 dark:bg-darkSurface-card border border-cozy-gold/30 rounded-3xl p-5 shadow-cozy space-y-3.5">
        <h3 className="font-serif font-bold text-base text-cozy-forest dark:text-cozy-ivory">
          Application Preferences
        </h3>

        {/* Theme Toggle */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center space-x-2.5">
            {user.theme === 'vintage' ? (
              <Sun size={18} className="text-cozy-gold" />
            ) : (
              <Moon size={18} className="text-cozy-sageLight" />
            )}
            <div>
              <div className="text-xs font-semibold text-cozy-forestDark dark:text-cozy-ivory">
                Color Palette & Theme
              </div>
              <div className="text-[10px] text-cozy-brown dark:text-darkSurface-textMuted">
                {user.theme === 'vintage' ? 'Warm Parchment & Sage' : 'Dark Academia Forest'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleTheme}
            className="text-xs font-serif font-semibold bg-cozy-ivory dark:bg-darkSurface-bg border border-cozy-gold/40 px-3 py-1.5 rounded-xl shadow-sm text-cozy-forestDark dark:text-cozy-ivory"
          >
            {user.theme === 'vintage' ? 'Switch to Dark' : 'Switch to Warm'}
          </button>
        </div>

        {/* Sound Effects Toggle */}
        <div className="flex items-center justify-between py-1 border-t border-cozy-gold/20">
          <div className="flex items-center space-x-2.5">
            {user.soundEnabled ? (
              <Volume2 size={18} className="text-cozy-forest dark:text-cozy-sage" />
            ) : (
              <VolumeX size={18} className="text-cozy-brown/60" />
            )}
            <div>
              <div className="text-xs font-semibold text-cozy-forestDark dark:text-cozy-ivory">
                Synthesized Audio & Chimes
              </div>
              <div className="text-[10px] text-cozy-brown dark:text-darkSurface-textMuted">
                Water drops, study bulb chimes & XP claims
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleSound}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              user.soundEnabled ? 'bg-cozy-sage' : 'bg-cozy-parchmentDark'
            }`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                user.soundEnabled ? 'left-5' : 'left-0.5'
              }`}
            />
          </button>
        </div>

        {/* Haptic Vibration Toggle */}
        <div className="flex items-center justify-between py-1 border-t border-cozy-gold/20">
          <div className="flex items-center space-x-2.5">
            <Vibrate size={18} className="text-cozy-gold" />
            <div>
              <div className="text-xs font-semibold text-cozy-forestDark dark:text-cozy-ivory">
                Haptic Vibration
              </div>
              <div className="text-[10px] text-cozy-brown dark:text-darkSurface-textMuted">
                Tactile feedback on button taps and completions
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleVibration}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              user.vibrationEnabled ? 'bg-cozy-sage' : 'bg-cozy-parchmentDark'
            }`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                user.vibrationEnabled ? 'left-5' : 'left-0.5'
              }`}
            />
          </button>
        </div>

        {/* Biometric / Passkey Privacy Lock */}
        <div className="flex items-center justify-between py-1 border-t border-cozy-gold/20">
          <div className="flex items-center space-x-2.5">
            <Shield size={18} className="text-cozy-sageDark dark:text-cozy-sage" />
            <div>
              <div className="text-xs font-semibold text-cozy-forestDark dark:text-cozy-ivory">
                Device Authentication / Lock
              </div>
              <div className="text-[10px] text-cozy-brown dark:text-darkSurface-textMuted">
                WebAuthn platform biometric check on launch
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleBiometric}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              user.biometricLockEnabled ? 'bg-cozy-sage' : 'bg-cozy-parchmentDark'
            }`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                user.biometricLockEnabled ? 'left-5' : 'left-0.5'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 4. Backup & Data Integrity Card */}
      <div className="bg-cozy-parchment/60 dark:bg-darkSurface-card border border-cozy-gold/30 rounded-3xl p-5 shadow-cozy space-y-3">
        <h3 className="font-serif font-bold text-base text-cozy-forest dark:text-cozy-ivory">
          Backup & Privacy
        </h3>
        <p className="text-[11px] text-cozy-brown dark:text-darkSurface-textMuted">
          100% offline-first. Your habits, logs, and XP remain exclusively in your browser's IndexedDB.
        </p>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={onExportBackup}
            className="p-3 rounded-2xl bg-cozy-ivory dark:bg-darkSurface-bg border border-cozy-gold/30 hover:border-cozy-gold flex flex-col items-center justify-center text-xs font-semibold text-cozy-forestDark dark:text-cozy-ivory shadow-sm transition-all"
          >
            <Download size={18} className="text-cozy-gold mb-1" />
            <span>Export JSON Backup</span>
          </button>

          <label className="cursor-pointer p-3 rounded-2xl bg-cozy-ivory dark:bg-darkSurface-bg border border-cozy-gold/30 hover:border-cozy-gold flex flex-col items-center justify-center text-xs font-semibold text-cozy-forestDark dark:text-cozy-ivory shadow-sm transition-all">
            <Upload size={18} className="text-cozy-sage mb-1" />
            <span>Import Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="hidden"
            />
          </label>
        </div>

        {/* Reset Confirmation Button */}
        <div className="pt-2">
          {!showResetConfirm ? (
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="text-xs text-red-600/70 hover:text-red-600 flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw size={13} /> Reset All Data & Start Fresh
            </button>
          ) : (
            <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-2xl space-y-2">
              <div className="text-xs text-red-700 dark:text-red-300 font-semibold">
                Are you sure you want to erase all local data?
              </div>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={onResetAllData}
                  className="bg-red-600 text-white text-xs px-3 py-1 rounded-xl font-semibold"
                >
                  Yes, Erase
                </button>
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="bg-gray-200 dark:bg-darkSurface-border text-xs px-3 py-1 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
