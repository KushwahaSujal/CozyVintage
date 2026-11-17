import React from 'react';
import { ArrowLeft } from 'lucide-react';
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
    <header className="sticky top-0 z-40 bg-[#F6F0E5]/95 dark:bg-[#141C16]/95 backdrop-blur-md border-b border-cozy-parchmentDark/40 dark:border-darkSurface-border/60 px-4 py-2.5 transition-colors">
      <div className="max-w-lg mx-auto flex items-center justify-between">
        {/* Left: ONE Single Back Button or Cozy Emblem */}
        <div className="flex items-center space-x-2.5">
          {showBack ? (
            <button
              type="button"
              onClick={handleBack}
              aria-label="Go back to Home"
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-cozy-parchment dark:bg-darkSurface-card border border-cozy-gold/35 hover:border-cozy-gold text-cozy-forest dark:text-cozy-ivory text-xs font-serif font-semibold shadow-xs transition-transform active:scale-95 cursor-pointer"
            >
              <ArrowLeft size={14} className="text-cozy-gold" />
              <span>Back</span>
            </button>
          ) : (
            <div className="flex items-center space-x-1.5 select-none">
              <span className="text-base">🌿</span>
              <span className="font-serif font-bold text-sm tracking-wide text-cozy-forest dark:text-cozy-ivory">
                Cozy Vintage
              </span>
            </div>
          )}

          {showBack && title && (
            <span className="font-serif font-bold text-xs sm:text-sm text-cozy-forestDark dark:text-cozy-ivory tracking-wide truncate max-w-[150px] sm:max-w-xs">
              {title}
            </span>
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
