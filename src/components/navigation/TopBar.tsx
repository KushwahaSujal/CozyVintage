import React from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { LiveClock } from '../common/LiveClock';
import { sounds } from '../../services/audio/soundEffects';
import { haptic } from '../../services/haptic/hapticFeedback';

interface TopBarProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightElement?: React.ReactNode;
}

export const TopBar: React.FC<TopBarProps> = ({
  title,
  showBack = false,
  onBack,
  rightElement,
}) => {
  const handleBack = () => {
    sounds.playClick();
    haptic.light();
    if (onBack) onBack();
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F6F0E5]/90 dark:bg-[#141C16]/90 backdrop-blur-md border-b border-cozy-parchmentDark/40 dark:border-darkSurface-border/60 px-4 py-2.5 transition-colors">
      <div className="max-w-lg mx-auto flex items-center justify-between">
        {/* Left: Back Button or App Logo */}
        <div className="flex items-center space-x-2">
          {showBack ? (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-cozy-parchment dark:bg-darkSurface-card border border-cozy-gold/30 hover:border-cozy-gold text-cozy-forest dark:text-cozy-ivory text-xs font-serif font-semibold shadow-xs transition-transform active:scale-95 cursor-pointer"
            >
              <ArrowLeft size={13} className="text-cozy-gold" />
              <span>Back</span>
            </button>
          ) : (
            <div className="flex items-center space-x-1.5 select-none">
              <span className="text-base">🌿</span>
              <span className="font-serif font-bold text-sm tracking-wide text-cozy-forest dark:text-cozy-ivory">
                {title || 'Cozy Vintage'}
              </span>
            </div>
          )}
        </div>

        {/* Right: Live Clock & Optional Right Action */}
        <div className="flex items-center space-x-2">
          {rightElement}
          <LiveClock />
        </div>
      </div>
    </header>
  );
};
