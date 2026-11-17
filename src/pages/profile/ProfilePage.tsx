import React, { useState, useRef } from 'react';
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
  Camera,
  Trash2,
  Save,
  Play,
} from 'lucide-react';
import { sounds, type SoundStyle } from '../../services/audio/soundEffects';
import { haptic } from '../../services/haptic/hapticFeedback';
import { resizeImageToDataUrl } from '../../utils/imageUtils';
import type { UserProfile, ChallengeCommitment } from '../../types';

interface ProfilePageProps {
  user: UserProfile;
  challenge: ChallengeCommitment;
  onUpdateUser: (updated: UserProfile) => void;
  onResetAllData: () => void;
  onExportBackup: () => void;
  onImportBackup: (jsonString: string) => void;
  onBack?: () => void;
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
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(user.photoUrl);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(user.soundEnabled ?? true);
  const [soundStyle, setSoundStyle] = useState<SoundStyle>(
    (user.soundStyle as SoundStyle) || sounds.getStyle()
  );
  const [vibrationEnabled, setVibrationEnabled] = useState<boolean>(
    user.vibrationEnabled ?? true
  );
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [installPromptEvent, setInstallPromptEvent] = useState<unknown>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      const promptEvent = installPromptEvent as {
        prompt: () => void;
        userChoice: Promise<{ outcome: string }>;
      };
      promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      if (choice.outcome === 'accepted') {
        setInstallPromptEvent(null);
      }
    } else {
      alert(
        'To install Cozy Vintage on your phone:\n\n1. In Chrome: Tap the ⋮ menu at top-right -> select "Add to Home screen" or "Install App".\n2. In Safari: Tap Share -> "Add to Home Screen".'
      );
    }
  };

  const handleToggleTheme = () => {
    sounds.playClick();
    haptic.light();
    const newTheme: 'vintage' | 'dark_forest' =
      user.theme === 'vintage' ? 'dark_forest' : 'vintage';
    const updated: UserProfile = { ...user, theme: newTheme };
    if (newTheme === 'dark_forest') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    onUpdateUser(updated);
  };

  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    sounds.setEnabled(nextState);
    if (nextState) {
      sounds.playClick();
    }
    onUpdateUser({ ...user, soundEnabled: nextState });
  };

  const handleChangeSoundStyle = (style: SoundStyle) => {
    setSoundStyle(style);
    sounds.setStyle(style);
    sounds.testSound(style);
    onUpdateUser({ ...user, soundStyle: style });
  };

  const handleToggleVibration = () => {
    const nextState = !vibrationEnabled;
    setVibrationEnabled(nextState);
    haptic.setEnabled(nextState);
    if (nextState) {
      haptic.testVibrate();
    }
    onUpdateUser({ ...user, vibrationEnabled: nextState });
  };

  const handleToggleBiometric = async () => {
    sounds.playClick();
    haptic.light();

    if (typeof window !== 'undefined' && window.PublicKeyCredential) {
      try {
        const available =
          await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
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

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const resizedData = await resizeImageToDataUrl(file, 360);
        setPhotoUrl(resizedData);
        sounds.playClick();
        haptic.medium();
        onUpdateUser({ ...user, photoUrl: resizedData });
      } catch (err) {
        console.error('Failed to process image:', err);
      }
    }
  };

  const handleRemovePhoto = () => {
    sounds.playClick();
    setPhotoUrl(undefined);
    onUpdateUser({ ...user, photoUrl: undefined });
  };

  const handleSaveProfile = () => {
    sounds.playClick();
    haptic.light();
    onUpdateUser({ ...user, name, avatarId: avatar, photoUrl });
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
    <div className="pb-24 pt-3 px-4 max-w-lg mx-auto space-y-4 animate-fadeIn">
      {/* 1. Profile Top Card with Device Photo Upload */}
      <div className="bg-gradient-to-br from-cozy-parchment to-cozy-parchmentDark/40 dark:from-darkSurface-card dark:to-darkSurface-bg border border-cozy-gold/40 rounded-3xl p-4.5 shadow-cozy flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          {/* Avatar with Photo or Emoji */}
          <div className="relative group">
            <div className="w-16 h-16 rounded-2xl bg-cozy-ivory dark:bg-darkSurface-card border-2 border-cozy-gold overflow-hidden flex items-center justify-center text-3xl shadow-sm">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                user.avatarId || '🌿'
              )}
            </div>

            {/* Camera Overlay Icon */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Upload photo from device"
              className="absolute -bottom-1 -right-1 bg-cozy-forest hover:bg-cozy-forestDark text-white p-1.5 rounded-full shadow-md border border-cozy-ivory transition-transform active:scale-90 cursor-pointer"
            >
              <Camera size={12} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoSelect}
              className="hidden"
            />
          </div>

          <div>
            <h2 className="font-serif font-bold text-lg text-cozy-forest dark:text-cozy-ivory leading-tight">
              {user.name}
            </h2>
            <div className="text-xs text-cozy-brown dark:text-darkSurface-textMuted mt-0.5">
              Age {user.age} • {user.highestQualification}
            </div>
            <div className="text-[10px] text-cozy-sageDark dark:text-cozy-sage font-medium">
              Committed to {challenge.durationDays}-Day Journey
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className="text-xs bg-cozy-ivory dark:bg-darkSurface-card border border-cozy-gold/30 hover:border-cozy-gold px-3 py-1.5 rounded-xl font-semibold text-cozy-forestDark dark:text-cozy-ivory shadow-xs cursor-pointer"
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {/* Profile Edit Drawer / Form */}
      {isEditing && (
        <div className="p-4 bg-cozy-ivory dark:bg-darkSurface-card border border-cozy-gold rounded-3xl shadow-cozy space-y-3 animate-fadeIn">
          <div>
            <label className="text-xs font-semibold text-cozy-forestDark dark:text-cozy-ivory">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-xl border border-cozy-gold/40 bg-white dark:bg-darkSurface-bg text-xs focus:ring-2 focus:ring-cozy-sage"
            />
          </div>

          {/* Photo Management */}
          <div>
            <label className="text-xs font-semibold text-cozy-forestDark dark:text-cozy-ivory block mb-1">
              Profile Photo
            </label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-cozy-parchment dark:bg-darkSurface-bg border border-cozy-gold/40 hover:border-cozy-gold px-3 py-1.5 rounded-xl text-xs font-medium text-cozy-forest dark:text-cozy-ivory flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Camera size={13} className="text-cozy-gold" />
                <span>Upload From Device</span>
              </button>
              {photoUrl && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="text-xs text-red-600/80 hover:text-red-600 px-2 py-1 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 size={12} /> Remove
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-cozy-forestDark dark:text-cozy-ivory">
              Or Choose Companion Sigil
            </label>
            <div className="flex gap-2 mt-1">
              {['🌿', '🦊', '🦉', '🧙‍♂️', '⚔️', '✨', '📖'].map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => {
                    setAvatar(av);
                    sounds.playClick();
                  }}
                  className={`text-xl p-2 rounded-xl border transition-transform cursor-pointer ${
                    avatar === av
                      ? 'border-cozy-sage bg-cozy-sage/20 scale-105'
                      : 'border-cozy-parchmentDark'
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
              className="bg-cozy-forest hover:bg-cozy-forestDark text-white text-xs font-serif font-bold px-4 py-2 rounded-xl shadow-xs flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
            >
              <Save size={13} /> Save Changes
            </button>
          </div>
        </div>
      )}

      {/* 2. PWA Install Banner */}
      <div className="bg-cozy-sage/15 dark:bg-cozy-sage/20 border border-cozy-sage/40 rounded-3xl p-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-2xl bg-cozy-sage text-white flex items-center justify-center">
            <Smartphone size={18} />
          </div>
          <div>
            <div className="font-serif font-bold text-xs text-cozy-forest dark:text-cozy-ivory">
              Install App on Phone
            </div>
            <div className="text-[10px] text-cozy-brown dark:text-darkSurface-textMuted">
              Add Cozy Vintage to your home screen for quick daily access
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleInstallPWA}
          className="bg-cozy-forest hover:bg-cozy-forestDark text-white text-xs font-serif font-bold px-3 py-1.5 rounded-xl shadow-xs cursor-pointer"
        >
          Install
        </button>
      </div>

      {/* 3. Settings & Preferences Card */}
      <div className="bg-cozy-parchment/60 dark:bg-darkSurface-card border border-cozy-gold/30 rounded-3xl p-4 shadow-cozy space-y-3">
        <h3 className="font-serif font-bold text-sm text-cozy-forest dark:text-cozy-ivory">
          Comfort & Preferences
        </h3>

        {/* Theme Toggle */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center space-x-2.5">
            {user.theme === 'vintage' ? (
              <Sun size={17} className="text-cozy-gold" />
            ) : (
              <Moon size={17} className="text-cozy-sageLight" />
            )}
            <div>
              <div className="text-xs font-semibold text-cozy-forestDark dark:text-cozy-ivory">
                Appearance
              </div>
              <div className="text-[10px] text-cozy-brown dark:text-darkSurface-textMuted">
                {user.theme === 'vintage' ? 'Warm Parchment & Sage' : 'Dark Academia Forest'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleTheme}
            className="text-xs font-serif font-semibold bg-cozy-ivory dark:bg-darkSurface-bg border border-cozy-gold/40 px-3 py-1 rounded-xl shadow-xs text-cozy-forestDark dark:text-cozy-ivory cursor-pointer"
          >
            {user.theme === 'vintage' ? 'Dark Mode' : 'Warm Mode'}
          </button>
        </div>

        {/* Sound Effects Section with Multiple Themes */}
        <div className="py-2 border-t border-cozy-gold/20 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              {soundEnabled ? (
                <Volume2 size={17} className="text-cozy-forest dark:text-cozy-sage" />
              ) : (
                <VolumeX size={17} className="text-cozy-brown/60" />
              )}
              <div>
                <div className="text-xs font-semibold text-cozy-forestDark dark:text-cozy-ivory">
                  Sound Effects
                </div>
                <div className="text-[10px] text-cozy-brown dark:text-darkSurface-textMuted">
                  {soundEnabled ? 'Enabled • Choose your favorite style below' : 'Muted'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggleSound}
              className={`px-3 py-1 rounded-xl text-xs font-serif font-bold transition-all shadow-xs cursor-pointer ${
                soundEnabled
                  ? 'bg-cozy-forest text-white'
                  : 'bg-cozy-parchmentDark/70 dark:bg-darkSurface-border text-cozy-brown/80'
              }`}
            >
              {soundEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Sound Themes Selector (Available when Sound is ON) */}
          {soundEnabled && (
            <div className="pt-1.5 space-y-2">
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'vintage_bell' as const, label: '🔔 Bells', desc: 'Brass & Chimes' },
                  { id: 'cozy_nature' as const, label: '🍃 Nature', desc: 'Wood & Rain' },
                  { id: 'retro_arcade' as const, label: '🎮 Retro', desc: '8-Bit Pixel' },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => handleChangeSoundStyle(st.id)}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      soundStyle === st.id
                        ? 'border-cozy-gold bg-cozy-gold/25 dark:bg-cozy-gold/30 font-bold shadow-xs scale-102'
                        : 'border-cozy-gold/30 bg-cozy-ivory dark:bg-darkSurface-bg opacity-75'
                    }`}
                  >
                    <div className="text-xs text-cozy-forestDark dark:text-cozy-ivory">{st.label}</div>
                    <div className="text-[9px] text-cozy-brown dark:text-darkSurface-textMuted">{st.desc}</div>
                  </button>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => sounds.testSound(soundStyle)}
                  className="text-[11px] font-serif font-semibold text-cozy-gold hover:text-cozy-goldDark flex items-center gap-1 cursor-pointer"
                >
                  <Play size={10} className="fill-cozy-gold" />
                  <span>Play Sample Audio</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Haptic Vibration Toggle (Clean ON / OFF switch) */}
        <div className="flex items-center justify-between py-2 border-t border-cozy-gold/20">
          <div className="flex items-center space-x-2.5">
            <Vibrate size={17} className={vibrationEnabled ? 'text-cozy-gold' : 'text-cozy-brown/60'} />
            <div>
              <div className="text-xs font-semibold text-cozy-forestDark dark:text-cozy-ivory">
                Haptic Vibration
              </div>
              <div className="text-[10px] text-cozy-brown dark:text-darkSurface-textMuted">
                Tactile device vibration on buttons and mission completions
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleVibration}
            className={`px-3 py-1 rounded-xl text-xs font-serif font-bold transition-all shadow-xs cursor-pointer ${
              vibrationEnabled
                ? 'bg-cozy-forest text-white'
                : 'bg-cozy-parchmentDark/70 dark:bg-darkSurface-border text-cozy-brown/80'
            }`}
          >
            {vibrationEnabled ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* Biometric / Screen Lock */}
        <div className="flex items-center justify-between py-2 border-t border-cozy-gold/20">
          <div className="flex items-center space-x-2.5">
            <Shield size={17} className="text-cozy-sageDark dark:text-cozy-sage" />
            <div>
              <div className="text-xs font-semibold text-cozy-forestDark dark:text-cozy-ivory">
                App Lock
              </div>
              <div className="text-[10px] text-cozy-brown dark:text-darkSurface-textMuted">
                Unlock with device fingerprint or screen lock
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleBiometric}
            className={`px-3 py-1 rounded-xl text-xs font-serif font-bold transition-all shadow-xs cursor-pointer ${
              user.biometricLockEnabled
                ? 'bg-cozy-forest text-white'
                : 'bg-cozy-parchmentDark/70 dark:bg-darkSurface-border text-cozy-brown/80'
            }`}
          >
            {user.biometricLockEnabled ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* 4. Backup & Privacy Card */}
      <div className="bg-cozy-parchment/60 dark:bg-darkSurface-card border border-cozy-gold/30 rounded-3xl p-4 shadow-cozy space-y-2.5">
        <h3 className="font-serif font-bold text-sm text-cozy-forest dark:text-cozy-ivory">
          Data & Privacy
        </h3>
        <p className="text-[11px] text-cozy-brown dark:text-darkSurface-textMuted">
          Your records are stored privately on this device. You can download a backup anytime.
        </p>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={onExportBackup}
            className="p-2.5 rounded-2xl bg-cozy-ivory dark:bg-darkSurface-bg border border-cozy-gold/30 hover:border-cozy-gold flex flex-col items-center justify-center text-xs font-semibold text-cozy-forestDark dark:text-cozy-ivory shadow-xs transition-all cursor-pointer"
          >
            <Download size={16} className="text-cozy-gold mb-1" />
            <span>Download Backup</span>
          </button>

          <label className="cursor-pointer p-2.5 rounded-2xl bg-cozy-ivory dark:bg-darkSurface-bg border border-cozy-gold/30 hover:border-cozy-gold flex flex-col items-center justify-center text-xs font-semibold text-cozy-forestDark dark:text-cozy-ivory shadow-xs transition-all">
            <Upload size={16} className="text-cozy-sage mb-1" />
            <span>Restore Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="hidden"
            />
          </label>
        </div>

        {/* Reset Confirmation Button */}
        <div className="pt-1 text-center">
          {!showResetConfirm ? (
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="text-[11px] text-red-600/70 hover:text-red-600 inline-flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw size={11} /> Reset App & Start Fresh
            </button>
          ) : (
            <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-2xl space-y-2">
              <div className="text-xs text-red-700 dark:text-red-300 font-semibold">
                Reset all daily tracking and start over?
              </div>
              <div className="flex justify-center space-x-2">
                <button
                  type="button"
                  onClick={onResetAllData}
                  className="bg-red-600 text-white text-xs px-3 py-1 rounded-xl font-semibold cursor-pointer"
                >
                  Yes, Reset
                </button>
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="bg-gray-200 dark:bg-darkSurface-border text-xs px-3 py-1 rounded-xl cursor-pointer"
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
