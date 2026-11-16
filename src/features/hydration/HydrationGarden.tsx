import React, { useState } from 'react';
import { Droplet, Plus, Check, Clock, Sparkles } from 'lucide-react';
import { sounds } from '../../services/audio/soundEffects';
import { haptic } from '../../services/haptic/hapticFeedback';
import { fireWaterSplashParticles } from '../../utils/confetti';
import type { HydrationGlass } from '../../types';

interface HydrationGardenProps {
  glasses: HydrationGlass[];
  onToggleGlass: (id: number) => void;
  onEditSchedule?: () => void;
}

export const HydrationGarden: React.FC<HydrationGardenProps> = ({
  glasses,
  onToggleGlass,
}) => {
  const filledCount = glasses.filter((g) => g.isFilled).length;
  const currentTotalMl = filledCount * 300;
  const targetTotalMl = glasses.length * 300;
  const percent = Math.round((currentTotalMl / targetTotalMl) * 100);

  const handleGlassClick = (glass: HydrationGlass) => {
    if (!glass.isFilled) {
      sounds.playWaterDrop();
      haptic.medium();
      fireWaterSplashParticles();
    } else {
      sounds.playClick();
      haptic.light();
    }
    onToggleGlass(glass.id);
  };

  return (
    <div className="bg-cozy-parchment/65 dark:bg-darkSurface-card border border-cozy-gold/30 dark:border-darkSurface-border rounded-3xl p-5 shadow-cozy transition-all">
      {/* Garden Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-2xl bg-cozy-water/20 flex items-center justify-center text-cozy-waterDark dark:text-cozy-waterLight">
            <Droplet size={20} className="fill-cozy-water/40" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-cozy-forest dark:text-cozy-ivory flex items-center gap-1.5">
              Hydration Garden
              {filledCount === 10 && (
                <span className="text-xs bg-cozy-water text-white px-2 py-0.5 rounded-full font-sans">
                  Target Met! 🏆
                </span>
              )}
            </h3>
            <p className="text-[11px] text-cozy-brown dark:text-darkSurface-textMuted">
              10 Servings × 300 ml • Daily Goal: 3,000 ml
            </p>
          </div>
        </div>

        {/* Total volume badge */}
        <div className="text-right">
          <div className="font-serif font-bold text-lg text-cozy-waterDark dark:text-cozy-waterLight">
            {currentTotalMl.toLocaleString()}{' '}
            <span className="text-xs font-sans font-normal text-cozy-brown dark:text-darkSurface-textMuted">
              / {targetTotalMl.toLocaleString()} ml
            </span>
          </div>
          <span className="text-[10px] text-cozy-sageDark dark:text-cozy-sage font-medium">
            {filledCount} of 10 glasses ({percent}%)
          </span>
        </div>
      </div>

      {/* Progress Bar with Water Wave look */}
      <div className="w-full bg-cozy-parchmentDark/50 dark:bg-darkSurface-border h-2 rounded-full overflow-hidden mb-4">
        <div
          className="bg-gradient-to-r from-cozy-water to-cozy-waterLight h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Interactive 10 Glasses Grid (2 rows of 5) */}
      <div className="grid grid-cols-5 gap-2 pt-1">
        {glasses.map((glass) => {
          return (
            <button
              key={glass.id}
              type="button"
              onClick={() => handleGlassClick(glass)}
              className={`relative flex flex-col items-center p-2 rounded-2xl border transition-all duration-300 group ${
                glass.isFilled
                  ? 'bg-gradient-to-b from-cozy-water/20 to-cozy-water/30 border-cozy-water/60 shadow-sm scale-102'
                  : 'bg-cozy-ivory/80 dark:bg-darkSurface-bg/60 border-cozy-gold/25 dark:border-darkSurface-border hover:border-cozy-water/50'
              }`}
            >
              {/* Glass SVG Icon with animated water fill */}
              <div className="relative w-9 h-12 flex items-center justify-center my-0.5">
                <svg
                  viewBox="0 0 40 54"
                  className="w-full h-full drop-shadow-sm overflow-visible"
                >
                  <defs>
                    <linearGradient id={`waterGrad_${glass.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#75C2C2" />
                      <stop offset="100%" stopColor="#3B7A7A" />
                    </linearGradient>
                    <clipPath id={`glassClip_${glass.id}`}>
                      <path d="M 6 4 L 34 4 L 30 50 L 10 50 Z" />
                    </clipPath>
                  </defs>

                  {/* Water inside (clipped) */}
                  {glass.isFilled ? (
                    <g clipPath={`url(#glassClip_${glass.id})`}>
                      <rect
                        x="4"
                        y="10"
                        width="32"
                        height="44"
                        fill={`url(#waterGrad_${glass.id})`}
                        className="animate-water-wave origin-bottom"
                      />
                      {/* Water reflection bubbles */}
                      <circle cx="16" cy="24" r="1.5" fill="#FFFFFF" opacity="0.6" />
                      <circle cx="24" cy="34" r="2" fill="#FFFFFF" opacity="0.5" />
                    </g>
                  ) : (
                    // Empty glass interior preview
                    <g clipPath={`url(#glassClip_${glass.id})`}>
                      <rect x="4" y="4" width="32" height="50" fill="transparent" />
                    </g>
                  )}

                  {/* Glass Outline Contour */}
                  <path
                    d="M 6 4 L 34 4 L 30 50 L 10 50 Z"
                    fill="none"
                    stroke={glass.isFilled ? '#3B7A7A' : '#A0ACA2'}
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                  {/* Glass Lip */}
                  <line
                    x1="4"
                    y1="4"
                    x2="36"
                    y2="4"
                    stroke={glass.isFilled ? '#3B7A7A' : '#A0ACA2'}
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>

                {/* Check badge when filled */}
                {glass.isFilled && (
                  <span className="absolute -top-1 -right-1 bg-cozy-forest text-white rounded-full p-0.5 shadow-sm">
                    <Check size={9} strokeWidth={3} />
                  </span>
                )}
              </div>

              {/* Time Slot */}
              <span className="text-[10px] font-medium font-sans text-cozy-forestDark dark:text-darkSurface-text mt-1">
                {glass.time}
              </span>

              {/* XP Pill */}
              <span
                className={`text-[9px] font-bold mt-0.5 px-1.5 py-0.2 rounded-md ${
                  glass.isFilled
                    ? 'text-cozy-waterDark dark:text-cozy-waterLight'
                    : 'text-cozy-gold/80'
                }`}
              >
                {glass.isFilled ? '+5 XP' : '5 XP'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Helpful Hint */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-cozy-brown/85 dark:text-darkSurface-textMuted px-1">
        <span>Tap any glass to record water or claim later</span>
        <span className="flex items-center gap-1 text-cozy-sageDark dark:text-cozy-sage font-medium">
          <Sparkles size={12} /> Earn up to 50 XP daily
        </span>
      </div>
    </div>
  );
};
