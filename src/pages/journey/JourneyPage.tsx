import React, { useState } from 'react';
import {
  Trophy,
  Gift,
  Calendar,
  Flame,
  CheckCircle,
  Clock,
  Sparkles,
  Plus,
  ShieldAlert,
  ChevronRight,
} from 'lucide-react';
import { sounds } from '../../services/audio/soundEffects';
import { haptic } from '../../services/haptic/hapticFeedback';
import { fireCelebrationConfetti, fireGoldenSparkles } from '../../utils/confetti';
import { RANKS } from '../../services/database/db';
import type { ChallengeCommitment, RewardVaultItem, RankInfo } from '../../types';

interface JourneyPageProps {
  challenge: ChallengeCommitment;
  rewards: RewardVaultItem[];
  lifetimeXp: number;
  currentStreak: number;
  currentRank: RankInfo;
  onClaimReward: (id: string) => void;
  onAddCustomReward?: (reward: RewardVaultItem) => void;
}

export const JourneyPage: React.FC<JourneyPageProps> = ({
  challenge,
  rewards,
  lifetimeXp,
  currentStreak,
  currentRank,
  onClaimReward,
  onAddCustomReward,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'rewards' | 'ranks' | 'calendar'>('rewards');
  const [showAddRewardModal, setShowAddRewardModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newSubtitle, setNewSubtitle] = useState<string>('');
  const [newStreakReq, setNewStreakReq] = useState<number>(15);

  const handleClaim = (reward: RewardVaultItem) => {
    sounds.playFanfare();
    haptic.celebrate();
    fireCelebrationConfetti();
    onClaimReward(reward.id);
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const item: RewardVaultItem = {
      id: `rew_custom_${Date.now()}`,
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || 'Custom personal discipline treat',
      streakRequirement: newStreakReq,
      icon: '🎁',
      status: currentStreak >= newStreakReq ? 'unlocked' : 'locked',
      category: 'treat',
      isCustom: true,
    };

    if (onAddCustomReward) onAddCustomReward(item);
    setNewTitle('');
    setNewSubtitle('');
    setShowAddRewardModal(false);
    sounds.playFanfare();
  };

  const progressPercent = Math.min(
    100,
    Math.round((challenge.currentDay / challenge.durationDays) * 100)
  );

  return (
    <div className="pb-24 pt-4 px-4 max-w-lg mx-auto space-y-5 animate-fadeIn">
      {/* 1. Header & Challenge Banner */}
      <div className="bg-gradient-to-br from-cozy-forest to-cozy-forestDark text-cozy-ivory rounded-3xl p-5 shadow-cozy-lg relative overflow-hidden">
        {/* Background Decorative Rings */}
        <div className="absolute -right-8 -bottom-8 w-36 h-36 border-4 border-white/10 rounded-full pointer-events-none" />
        <div className="absolute -right-2 -bottom-2 w-24 h-24 border-2 border-cozy-gold/20 rounded-full pointer-events-none" />

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xl">⚔️</span>
            <div>
              <div className="text-xs uppercase tracking-wider text-cozy-sageLight font-bold">
                Active Commitment
              </div>
              <h2 className="font-serif font-bold text-xl text-white">
                {challenge.title}
              </h2>
            </div>
          </div>

          <div className="text-right">
            <div className="font-serif font-bold text-lg text-cozy-softGold">
              Day {challenge.currentDay}{' '}
              <span className="text-xs font-sans font-normal opacity-80">
                / {challenge.durationDays}
              </span>
            </div>
            <div className="text-[10px] text-cozy-sageLight font-semibold">
              {challenge.durationDays - challenge.currentDay} days remaining
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden mb-3">
          <div
            className="bg-cozy-softGold h-full rounded-full transition-all duration-700"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-cozy-ivory/80 pt-1 border-t border-white/15">
          <span>Started on {challenge.startDate}</span>
          <span className="font-semibold text-cozy-softGold">
            {progressPercent}% Journey Complete
          </span>
        </div>
      </div>

      {/* 2. Sub-Navigation Tabs */}
      <div className="flex p-1 bg-cozy-parchment/60 dark:bg-darkSurface-card rounded-2xl border border-cozy-gold/30">
        {[
          { id: 'rewards' as const, label: 'Reward Vault', icon: Gift },
          { id: 'ranks' as const, label: 'Ranks & Perks', icon: Trophy },
          { id: 'calendar' as const, label: 'Calendar', icon: Calendar },
        ].map((tab) => {
          const isActive = activeSubTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                sounds.playClick();
                haptic.light();
                setActiveSubTab(tab.id);
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-serif font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                isActive
                  ? 'bg-cozy-forest text-white shadow-sm'
                  : 'text-cozy-brown dark:text-darkSurface-textMuted hover:text-cozy-forest'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. SUBTAB: REWARD VAULT */}
      {activeSubTab === 'rewards' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-base text-cozy-forest dark:text-cozy-ivory">
                Real-Life Reward Vault
              </h3>
              <p className="text-xs text-cozy-brown dark:text-darkSurface-textMuted">
                Celebrate your discipline streaks with real guilt-free treats!
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setShowAddRewardModal(true);
              }}
              className="text-xs font-serif font-semibold bg-cozy-gold hover:bg-cozy-goldLight text-white px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-1"
            >
              <Plus size={13} /> Custom Treat
            </button>
          </div>

          {/* Current streak banner dialogue */}
          <div className="bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 rounded-2xl p-3 flex items-center gap-3">
            <span className="text-2xl">🔥</span>
            <div>
              <div className="font-serif font-bold text-xs text-amber-900 dark:text-amber-200">
                {currentStreak >= 7
                  ? 'Boss! Seven days without giving up? Aap toh kamaal kar rahe ho! Aaj biryani banti hai! 🍗'
                  : `Current Streak: ${currentStreak} Days. Keep pushing to unlock the next feast!`}
              </div>
              <div className="text-[10px] text-amber-800/80 dark:text-amber-300/80">
                Discipline should never feel like self-punishment. Reward yourself when earned.
              </div>
            </div>
          </div>

          {/* Rewards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {rewards.map((rew) => {
              const isUnlocked = currentStreak >= rew.streakRequirement || rew.status === 'unlocked' || rew.status === 'claimed';
              const isClaimed = rew.status === 'claimed';

              return (
                <div
                  key={rew.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isClaimed
                      ? 'bg-cozy-sage/15 dark:bg-cozy-sage/20 border-cozy-sage'
                      : isUnlocked
                      ? 'bg-gradient-to-br from-amber-50/80 to-cozy-parchment/90 dark:from-darkSurface-card dark:to-darkSurface-bg border-cozy-gold shadow-cozy ring-1 ring-cozy-gold/40'
                      : 'bg-cozy-ivory/60 dark:bg-darkSurface-bg/50 border-cozy-parchmentDark/40 dark:border-darkSurface-border opacity-70'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-3xl p-1 bg-white/70 dark:bg-darkSurface-card rounded-xl border border-cozy-gold/20 shadow-sm">
                      {rew.icon}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isClaimed
                          ? 'bg-cozy-sage text-white'
                          : isUnlocked
                          ? 'bg-amber-600 text-white animate-pulse'
                          : 'bg-gray-200 dark:bg-darkSurface-border text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      {isClaimed ? 'Claimed ✓' : isUnlocked ? 'Unlocked!' : `Requires ${rew.streakRequirement}d Streak`}
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-sm text-cozy-forestDark dark:text-cozy-ivory">
                    {rew.title}
                  </h4>
                  <p className="text-[11px] text-cozy-brown dark:text-darkSurface-textMuted mt-0.5 leading-snug">
                    {rew.subtitle}
                  </p>

                  <div className="mt-3 pt-2 border-t border-cozy-gold/20 flex items-center justify-between">
                    <span className="text-[10px] text-cozy-brown dark:text-darkSurface-textMuted font-medium">
                      {isClaimed ? 'Enjoy your treat!' : `Streak: ${currentStreak}/${rew.streakRequirement}d`}
                    </span>

                    {isUnlocked && !isClaimed && (
                      <button
                        type="button"
                        onClick={() => handleClaim(rew)}
                        className="bg-cozy-forest hover:bg-cozy-forestDark text-white text-[11px] font-serif font-bold px-3 py-1 rounded-xl shadow-sm transition-transform active:scale-95"
                      >
                        Claim Reward
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. SUBTAB: RANKS & PERKS */}
      {activeSubTab === 'ranks' && (
        <div className="space-y-4">
          <div>
            <h3 className="font-serif font-bold text-base text-cozy-forest dark:text-cozy-ivory">
              Rank Ladder & Mastery Progression
            </h3>
            <p className="text-xs text-cozy-brown dark:text-darkSurface-textMuted">
              Competitive Free Fire-style ranking infused with warm vintage aesthetics. Earn XP through honest effort.
            </p>
          </div>

          {/* Current Rank Banner */}
          <div className="bg-gradient-to-r from-cozy-parchment to-cozy-parchmentDark dark:from-darkSurface-card dark:to-darkSurface-bg p-4 rounded-2xl border border-cozy-gold flex items-center justify-between shadow-cozy">
            <div className="flex items-center space-x-3">
              <span className="text-4xl">{currentRank.badge}</span>
              <div>
                <div className="text-[10px] uppercase font-bold text-cozy-gold tracking-wider">
                  Current Tier
                </div>
                <div className="font-serif font-bold text-lg text-cozy-forest dark:text-cozy-ivory">
                  {currentRank.tier} Scholar
                </div>
                <div className="text-xs text-cozy-brown dark:text-darkSurface-textMuted">
                  {lifetimeXp.toLocaleString()} Lifetime Claimed XP
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-serif italic text-cozy-forestDark dark:text-cozy-sageLight font-semibold">
                "{currentRank.quote}"
              </span>
            </div>
          </div>

          {/* Ranks Ladder List */}
          <div className="space-y-2.5">
            {RANKS.map((rk, idx) => {
              const isCurrent = rk.tier === currentRank.tier;
              const isPassed = lifetimeXp >= rk.minXp;

              return (
                <div
                  key={rk.tier}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                    isCurrent
                      ? 'bg-cozy-gold/15 dark:bg-cozy-gold/20 border-cozy-gold ring-2 ring-cozy-gold/50 shadow-cozy'
                      : isPassed
                      ? 'bg-cozy-parchment/60 dark:bg-darkSurface-card/60 border-cozy-sage/40'
                      : 'bg-cozy-ivory/40 dark:bg-darkSurface-bg/40 border-cozy-parchmentDark/30 opacity-65'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{rk.badge}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-sm text-cozy-forestDark dark:text-cozy-ivory">
                          {rk.tier}
                        </span>
                        {isCurrent && (
                          <span className="text-[9px] bg-cozy-gold text-white px-2 py-0.2 rounded-full font-bold">
                            Current Tier
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-cozy-brown dark:text-darkSurface-textMuted">
                        {rk.perk}
                      </div>
                    </div>
                  </div>

                  <div className="text-right text-xs font-serif font-bold text-cozy-forest dark:text-cozy-ivory">
                    {rk.minXp.toLocaleString()} XP
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. SUBTAB: CHALLENGE CALENDAR */}
      {activeSubTab === 'calendar' && (
        <div className="space-y-4">
          <div>
            <h3 className="font-serif font-bold text-base text-cozy-forest dark:text-cozy-ivory">
              Challenge Calendar
            </h3>
            <p className="text-xs text-cozy-brown dark:text-darkSurface-textMuted">
              Visualizing every day of your {challenge.durationDays}-day commitment.
            </p>
          </div>

          <div className="bg-cozy-parchment/70 dark:bg-darkSurface-card border border-cozy-gold/30 rounded-3xl p-5 shadow-cozy">
            {/* Legend */}
            <div className="flex items-center justify-around text-[10px] font-semibold text-cozy-brown dark:text-darkSurface-textMuted pb-3 mb-3 border-b border-cozy-gold/20">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-cozy-forest" /> Completed
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-amber-500" /> Partial
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-cozy-parchmentDark/70 dark:bg-darkSurface-border" /> Upcoming
              </span>
            </div>

            {/* Matrix of Days (up to 30 or 60 visible slots) */}
            <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
              {Array.from({ length: Math.min(60, challenge.durationDays) }).map((_, idx) => {
                const dayNum = idx + 1;
                const isPast = dayNum < challenge.currentDay;
                const isToday = dayNum === challenge.currentDay;

                return (
                  <div
                    key={dayNum}
                    className={`h-11 rounded-xl flex flex-col items-center justify-center border text-xs font-medium transition-all ${
                      isToday
                        ? 'border-cozy-gold bg-cozy-gold/25 ring-2 ring-cozy-gold font-bold scale-105 shadow-sm'
                        : isPast
                        ? 'bg-cozy-sage/30 border-cozy-sage/50 text-cozy-forestDark dark:text-cozy-ivory'
                        : 'bg-cozy-ivory/50 dark:bg-darkSurface-bg/50 border-cozy-parchmentDark/30 text-cozy-brown/60 dark:text-darkSurface-textMuted/60'
                    }`}
                  >
                    <span className="text-[11px]">D{dayNum}</span>
                    <span className="text-[9px]">
                      {isToday ? 'Today' : isPast ? '✓' : '—'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Reward Modal */}
      {showAddRewardModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAddCustom}
            className="bg-cozy-ivory dark:bg-darkSurface-card border border-cozy-gold rounded-3xl p-6 max-w-sm w-full shadow-cozy-lg animate-fadeIn"
          >
            <h4 className="font-serif font-bold text-lg text-cozy-forest dark:text-cozy-ivory mb-2">
              Add Personal Wishlist Reward
            </h4>

            <div className="space-y-3 mb-4">
              <div>
                <label className="text-xs font-semibold">Treat / Reward Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Favorite Pizza Feast / Movie Night"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-cozy-gold/40 bg-white dark:bg-darkSurface-bg text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold">Description / Details</label>
                <input
                  type="text"
                  placeholder="e.g. Delicious cheese burst pizza after 15 solid days"
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-cozy-gold/40 bg-white dark:bg-darkSurface-bg text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold">Streak Days Required</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={newStreakReq}
                  onChange={(e) => setNewStreakReq(parseInt(e.target.value, 10) || 10)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-cozy-gold/40 bg-white dark:bg-darkSurface-bg text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowAddRewardModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-cozy-brown dark:text-darkSurface-textMuted"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-cozy-forest hover:bg-cozy-forestDark text-white px-5 py-2 rounded-xl text-xs font-semibold font-serif shadow-sm"
              >
                Add to Vault
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
