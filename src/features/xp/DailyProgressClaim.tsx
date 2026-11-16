import React from 'react';
import { Sparkles, Award, Flame, Coins, CheckCircle } from 'lucide-react';
import { sounds } from '../../services/audio/soundEffects';
import { haptic } from '../../services/haptic/hapticFeedback';
import { fireGoldenSparkles, fireCelebrationConfetti } from '../../utils/confetti';
import type { RankInfo } from '../../types';

interface DailyProgressClaimProps {
  completionRate: number; // 0 to 100
  pendingXp: number;
  claimedTodayXp: number;
  lifetimeXp: number;
  currentRank: RankInfo;
  currentStreak: number;
  onClaimXp: () => void;
}

export const DailyProgressClaim: React.FC<DailyProgressClaimProps> = ({
  completionRate,
  pendingXp,
  claimedTodayXp,
  lifetimeXp,
  currentRank,
  currentStreak,
  onClaimXp,
}) => {
  const handleClaim = () => {
    if (pendingXp <= 0) return;
    sounds.playXpClaim();
    haptic.celebrate();
    fireGoldenSparkles();
    if (completionRate >= 100) {
      fireCelebrationConfetti();
    }
    onClaimXp();
  };

  // Circular progress calculations
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionRate / 100) * circumference;

  return (
    <div className="bg-gradient-to-br from-cozy-parchment/80 to-cozy-parchmentDark/40 dark:from-darkSurface-card dark:to-darkSurface-bg border border-cozy-gold/40 dark:border-darkSurface-border rounded-3xl p-5 shadow-cozy">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Progress Ring */}
        <div className="relative flex items-center justify-center flex-shrink-0">
          <svg className="w-24 h-24 transform -rotate-90">
            {/* Background track */}
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="currentColor"
              strokeWidth="7"
              className="text-cozy-parchmentDark/70 dark:text-darkSurface-border"
              fill="transparent"
            />
            {/* Foreground progress */}
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="#78927A"
              strokeWidth="7"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
              fill="transparent"
            />
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-serif font-bold text-xl text-cozy-forest dark:text-cozy-ivory leading-none">
              {completionRate}%
            </span>
            <span className="text-[9px] uppercase tracking-wider text-cozy-brown dark:text-darkSurface-textMuted font-semibold mt-0.5">
              Today
            </span>
          </div>
        </div>

        {/* Center / Right: Stats & Claims */}
        <div className="flex-1 min-w-0">
          {/* Rank & Streak bar */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1.5">
              <span className="text-base">{currentRank.badge}</span>
              <span className="font-serif font-bold text-xs text-cozy-forest dark:text-cozy-ivory truncate">
                {currentRank.tier} Rank
              </span>
            </div>

            <div className="flex items-center space-x-1 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full">
              <Flame size={13} className="fill-amber-600" />
              <span>{currentStreak} Days Streak</span>
            </div>
          </div>

          {/* XP Breakdown Chips */}
          <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
            <div className="bg-cozy-ivory/80 dark:bg-darkSurface-bg p-1.5 rounded-xl border border-cozy-gold/20">
              <div className="text-cozy-brown dark:text-darkSurface-textMuted text-[10px]">Claimed Today</div>
              <div className="font-bold text-cozy-forest dark:text-cozy-sage">+{claimedTodayXp} XP</div>
            </div>
            <div className="bg-cozy-ivory/80 dark:bg-darkSurface-bg p-1.5 rounded-xl border border-cozy-gold/20">
              <div className="text-cozy-brown dark:text-darkSurface-textMuted text-[10px]">Lifetime XP</div>
              <div className="font-bold text-cozy-gold">{lifetimeXp.toLocaleString()} XP</div>
            </div>
          </div>

          {/* Manual Claim Button */}
          {pendingXp > 0 ? (
            <button
              type="button"
              onClick={handleClaim}
              className="w-full bg-gradient-to-r from-cozy-gold to-amber-600 hover:from-cozy-goldLight hover:to-amber-500 text-white font-serif font-bold py-2.5 px-3 rounded-2xl shadow-cozy flex items-center justify-center space-x-2 text-xs transition-transform active:scale-95 animate-pulse"
            >
              <Coins size={15} />
              <span>Claim {pendingXp} Pending XP</span>
              <Sparkles size={14} />
            </button>
          ) : (
            <div className="w-full bg-cozy-sage/20 dark:bg-darkSurface-card border border-cozy-sage/40 text-cozy-sageDark dark:text-cozy-sage font-medium py-2 px-3 rounded-2xl flex items-center justify-center space-x-1.5 text-xs">
              <CheckCircle size={14} />
              <span>All Earned XP Claimed!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
