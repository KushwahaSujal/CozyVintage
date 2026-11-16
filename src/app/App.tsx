import React, { useState, useEffect } from 'react';
import {
  db,
  DEFAULT_HYDRATION_SCHEDULE,
  DEFAULT_STUDY_SUBJECTS,
  DEFAULT_HABITS,
  DEFAULT_REWARDS,
  DEFAULT_QUOTES,
  RANKS,
} from '../services/database/db';
import { sounds } from '../services/audio/soundEffects';
import { haptic } from '../services/haptic/hapticFeedback';
import { notificationService, type InAppNotification } from '../services/notification/notificationService';
import { BottomNavigation, type NavigationTab } from '../components/navigation/BottomNavigation';
import { OnboardingWizard } from '../features/onboarding/OnboardingWizard';
import { HomePage } from '../pages/home/HomePage';
import { JourneyPage } from '../pages/journey/JourneyPage';
import { GrowthPage } from '../pages/growth/GrowthPage';
import { AICompanionPage } from '../pages/ai-companion/AICompanionPage';
import { ProfilePage } from '../pages/profile/ProfilePage';
import { Shield, Sparkles, X, Lock } from 'lucide-react';
import type {
  UserProfile,
  ChallengeCommitment,
  HydrationGlass,
  StudySubject,
  HabitItem,
  RewardVaultItem,
  DailyWisdomQuote,
  RankInfo,
} from '../types';

export const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');

  // Core State
  const [user, setUser] = useState<UserProfile | null>(null);
  const [challenge, setChallenge] = useState<ChallengeCommitment | null>(null);
  const [hydration, setHydration] = useState<HydrationGlass[]>(DEFAULT_HYDRATION_SCHEDULE);
  const [subjects, setSubjects] = useState<StudySubject[]>(DEFAULT_STUDY_SUBJECTS);
  const [habits, setHabits] = useState<HabitItem[]>(DEFAULT_HABITS);
  const [rewards, setRewards] = useState<RewardVaultItem[]>(DEFAULT_REWARDS);
  const [quotes, setQuotes] = useState<DailyWisdomQuote[]>(DEFAULT_QUOTES);

  // Gamification & XP State
  const [lifetimeXp, setLifetimeXp] = useState<number>(0);
  const [claimedTodayXp, setClaimedTodayXp] = useState<number>(0);
  const [streak, setStreak] = useState<number>(3);
  const [isLocked, setIsLocked] = useState<boolean>(false);

  // In-app notifications
  const [activeNotifications, setActiveNotifications] = useState<InAppNotification[]>([]);

  // 1. Initial Load from IndexedDB
  useEffect(() => {
    async function loadData() {
      try {
        const existingUsers = await db.user.toArray();
        if (existingUsers.length > 0) {
          const profile = existingUsers[0];
          setUser(profile);
          sounds.setEnabled(profile.soundEnabled);
          haptic.setEnabled(profile.vibrationEnabled);

          if (profile.theme === 'dark_forest') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }

          if (profile.biometricLockEnabled) {
            setIsLocked(true);
          }

          // Load challenges
          const chals = await db.challenges.toArray();
          if (chals.length > 0) {
            setChallenge(chals[0]);
          }

          // Load hydration
          const hy = await db.hydration.toArray();
          if (hy.length > 0) setHydration(hy);

          // Load subjects
          const sub = await db.subjects.toArray();
          if (sub.length > 0) setSubjects(sub);

          // Load habits
          const hb = await db.habits.toArray();
          if (hb.length > 0) setHabits(hb);

          // Load rewards
          const rw = await db.rewards.toArray();
          if (rw.length > 0) setRewards(rw);

          // Load quotes
          const qt = await db.quotes.toArray();
          if (qt.length > 0) setQuotes(qt);

          // Load lifetime XP from localStorage
          const savedLifetime = localStorage.getItem('cozy_lifetime_xp');
          if (savedLifetime) setLifetimeXp(parseInt(savedLifetime, 10) || 0);

          const savedClaimedToday = localStorage.getItem('cozy_claimed_today_xp');
          if (savedClaimedToday) setClaimedTodayXp(parseInt(savedClaimedToday, 10) || 0);

          const savedStreak = localStorage.getItem('cozy_streak');
          if (savedStreak) setStreak(parseInt(savedStreak, 10) || 3);
        }
      } catch (err) {
        console.warn('Failed loading data from IndexedDB:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();

    // Subscribe to notification reminders
    const unsub = notificationService.subscribe(setActiveNotifications);
    return () => unsub();
  }, []);

  // Compute Current Rank
  const getCurrentRank = (): RankInfo => {
    for (let i = RANKS.length - 1; i >= 0; i--) {
      if (lifetimeXp >= RANKS[i].minXp) {
        return RANKS[i];
      }
    }
    return RANKS[0];
  };

  // Compute Pending XP from completed activities today
  const calculatePendingXp = (): number => {
    let earned = 0;
    hydration.forEach((g) => {
      if (g.isFilled) earned += g.xp;
    });
    subjects.forEach((s) => {
      if (s.isCompleted) earned += s.xp;
    });
    habits.forEach((h) => {
      if (h.isCompleted) earned += h.xp;
    });
    const pending = Math.max(0, earned - claimedTodayXp);
    return pending;
  };

  const pendingXp = calculatePendingXp();

  // Handlers for Onboarding Completion
  const handleOnboardingComplete = async (profile: UserProfile, comm: ChallengeCommitment) => {
    setUser(profile);
    setChallenge(comm);
    sounds.setEnabled(profile.soundEnabled);
    haptic.setEnabled(profile.vibrationEnabled);

    try {
      await db.user.put(profile);
      await db.challenges.put(comm);
      await db.hydration.bulkPut(DEFAULT_HYDRATION_SCHEDULE);
      await db.subjects.bulkPut(DEFAULT_STUDY_SUBJECTS);
      await db.habits.bulkPut(DEFAULT_HABITS);
      await db.rewards.bulkPut(DEFAULT_REWARDS);
      await db.quotes.bulkPut(DEFAULT_QUOTES);
    } catch (err) {
      console.warn('IndexedDB write error:', err);
    }
  };

  // Handlers for Hydration
  const handleToggleHydration = async (id: number) => {
    const updated = hydration.map((g) =>
      g.id === id ? { ...g, isFilled: !g.isFilled, filledAt: !g.isFilled ? new Date().toISOString() : undefined } : g
    );
    setHydration(updated);
    try {
      await db.hydration.bulkPut(updated);
    } catch {}
  };

  // Handlers for Study
  const handleUpdateSubjectTime = async (id: string, seconds: number, isCompleted: boolean) => {
    const updated = subjects.map((s) =>
      s.id === id ? { ...s, actualSecondsStudied: seconds, isCompleted } : s
    );
    setSubjects(updated);
    try {
      await db.subjects.bulkPut(updated);
    } catch {}
  };

  // Handlers for Habits
  const handleToggleHabit = async (id: string) => {
    const updated = habits.map((h) => {
      if (h.id === id) {
        const isDone = !h.isCompleted;
        return {
          ...h,
          isCompleted: isDone,
          streak: isDone ? h.streak + 1 : Math.max(0, h.streak - 1),
        };
      }
      return h;
    });
    setHabits(updated);
    try {
      await db.habits.bulkPut(updated);
    } catch {}
  };

  const handleAddHabit = async (item: HabitItem) => {
    const updated = [...habits, item];
    setHabits(updated);
    try {
      await db.habits.put(item);
    } catch {}
  };

  const handleDeleteHabit = async (id: string) => {
    const updated = habits.filter((h) => h.id !== id);
    setHabits(updated);
    try {
      await db.habits.delete(id);
    } catch {}
  };

  // Claim XP Button Handler
  const handleClaimXp = () => {
    const newClaimedToday = claimedTodayXp + pendingXp;
    const newLifetime = lifetimeXp + pendingXp;
    setClaimedTodayXp(newClaimedToday);
    setLifetimeXp(newLifetime);
    localStorage.setItem('cozy_claimed_today_xp', String(newClaimedToday));
    localStorage.setItem('cozy_lifetime_xp', String(newLifetime));

    notificationService.pushReminder(
      'XP Successfully Claimed! 🪙',
      `You added ${pendingXp} XP to your lifetime balance. Keep building consistency!`,
      'celebration'
    );
  };

  // Claim Real-Life Reward
  const handleClaimReward = async (id: string) => {
    const updated = rewards.map((r) =>
      r.id === id ? { ...r, status: 'claimed' as const, claimedAt: new Date().toISOString() } : r
    );
    setRewards(updated);
    try {
      await db.rewards.bulkPut(updated);
    } catch {}
  };

  const handleAddCustomReward = async (rew: RewardVaultItem) => {
    const updated = [...rewards, rew];
    setRewards(updated);
    try {
      await db.rewards.put(rew);
    } catch {}
  };

  // Profile Update
  const handleUpdateUser = async (updated: UserProfile) => {
    setUser(updated);
    try {
      await db.user.put(updated);
    } catch {}
  };

  // Backup Export
  const handleExportBackup = async () => {
    sounds.playClick();
    const backupData = {
      exportDate: new Date().toISOString(),
      user,
      challenge,
      hydration,
      subjects,
      habits,
      rewards,
      lifetimeXp,
      claimedTodayXp,
      streak,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cozy_vintage_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Backup Import
  const handleImportBackup = async (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.user) {
        setUser(data.user);
        await db.user.put(data.user);
      }
      if (data.challenge) {
        setChallenge(data.challenge);
        await db.challenges.put(data.challenge);
      }
      if (data.hydration) {
        setHydration(data.hydration);
        await db.hydration.bulkPut(data.hydration);
      }
      if (data.subjects) {
        setSubjects(data.subjects);
        await db.subjects.bulkPut(data.subjects);
      }
      if (data.habits) {
        setHabits(data.habits);
        await db.habits.bulkPut(data.habits);
      }
      if (data.rewards) {
        setRewards(data.rewards);
        await db.rewards.bulkPut(data.rewards);
      }
      if (typeof data.lifetimeXp === 'number') {
        setLifetimeXp(data.lifetimeXp);
        localStorage.setItem('cozy_lifetime_xp', String(data.lifetimeXp));
      }
      alert('Backup restored successfully!');
    } catch {
      alert('Invalid backup JSON format.');
    }
  };

  // Reset Everything
  const handleResetAllData = async () => {
    localStorage.clear();
    await db.delete();
    window.location.reload();
  };

  // Unlock Screen
  const handleUnlockScreen = () => {
    sounds.playClick();
    haptic.light();
    setIsLocked(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F6F0E5] dark:bg-[#141C16] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-cozy-sage/20 flex items-center justify-center text-3xl animate-bounce-subtle mb-4">
          🌿
        </div>
        <h2 className="font-serif font-bold text-xl text-cozy-forest dark:text-cozy-ivory">
          Cozy Vintage
        </h2>
        <p className="text-xs text-cozy-brown dark:text-darkSurface-textMuted mt-1">
          Waking up your sanctuary...
        </p>
      </div>
    );
  }

  // If no user exists, display Onboarding
  if (!user || !challenge) {
    return <OnboardingWizard onComplete={handleOnboardingComplete} />;
  }

  // If Biometric Lock is Active
  if (isLocked) {
    return (
      <div className="min-h-screen bg-[#F6F0E5] dark:bg-[#141C16] flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
        <div className="w-16 h-16 rounded-3xl bg-cozy-gold/20 flex items-center justify-center text-cozy-gold mb-4 shadow-cozy">
          <Lock size={32} />
        </div>
        <h2 className="font-serif font-bold text-2xl text-cozy-forest dark:text-cozy-ivory">
          Sanctuary Locked
        </h2>
        <p className="text-xs text-cozy-brown dark:text-darkSurface-textMuted mt-1 mb-6">
          Welcome back, {user.name}. Authenticate to enter.
        </p>
        <button
          type="button"
          onClick={handleUnlockScreen}
          className="bg-cozy-forest hover:bg-cozy-forestDark text-white font-serif font-semibold px-6 py-3 rounded-2xl shadow-cozy flex items-center gap-2 text-sm transition-transform active:scale-95"
        >
          <Shield size={16} /> Unlock with Device Credential
        </button>
      </div>
    );
  }

  const totalStudyMinutes = Math.round(
    subjects.reduce((sum, s) => sum + s.actualSecondsStudied, 0) / 60
  );
  const totalTasks = hydration.length + subjects.length + habits.length;
  const completedTasks =
    hydration.filter((h) => h.isFilled).length +
    subjects.filter((s) => s.isCompleted).length +
    habits.filter((h) => h.isCompleted).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#F6F0E5] dark:bg-[#141C16] text-[#496354] dark:text-[#F2EDE4] transition-colors duration-200">
      {/* In-App Floating Notification Banner */}
      {activeNotifications.length > 0 && (
        <div className="fixed top-3 left-4 right-4 z-50 max-w-md mx-auto animate-fadeIn">
          {activeNotifications.slice(0, 1).map((notif) => (
            <div
              key={notif.id}
              className="bg-cozy-ivory dark:bg-darkSurface-card border border-cozy-gold/60 dark:border-darkSurface-border px-4 py-2.5 rounded-2xl shadow-cozy flex items-center justify-between"
            >
              <div className="flex items-center space-x-2.5">
                <span className="text-base">
                  {notif.type === 'celebration' ? '🎉' : notif.type === 'wisdom' ? '✨' : '💧'}
                </span>
                <div>
                  <div className="font-serif font-bold text-xs text-cozy-forestDark dark:text-cozy-ivory">
                    {notif.title}
                  </div>
                  <div className="text-[11px] text-cozy-brown dark:text-darkSurface-textMuted leading-tight">
                    {notif.message}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => notificationService.dismiss(notif.id)}
                className="text-cozy-brown/60 hover:text-cozy-forest p-1"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Main Pages Switcher */}
      <main className="min-h-screen">
        {currentTab === 'home' && (
          <HomePage
            user={user}
            challenge={challenge}
            currentRank={getCurrentRank()}
            hydration={hydration}
            subjects={subjects}
            habits={habits}
            quotes={quotes}
            pendingXp={pendingXp}
            claimedTodayXp={claimedTodayXp}
            lifetimeXp={lifetimeXp}
            streak={streak}
            onToggleHydration={handleToggleHydration}
            onUpdateSubjectTime={handleUpdateSubjectTime}
            onToggleHabit={handleToggleHabit}
            onAddHabit={handleAddHabit}
            onDeleteHabit={handleDeleteHabit}
            onClaimXp={handleClaimXp}
            onNavigateTab={setCurrentTab}
          />
        )}

        {currentTab === 'journey' && (
          <JourneyPage
            challenge={challenge}
            rewards={rewards}
            lifetimeXp={lifetimeXp}
            currentStreak={streak}
            currentRank={getCurrentRank()}
            onClaimReward={handleClaimReward}
            onAddCustomReward={handleAddCustomReward}
          />
        )}

        {currentTab === 'growth' && (
          <GrowthPage
            user={user}
            challenge={challenge}
            subjects={subjects}
            hydration={hydration}
            habits={habits}
            lifetimeXp={lifetimeXp}
            streak={streak}
          />
        )}

        {currentTab === 'ai' && (
          <AICompanionPage
            userName={user.name}
            challengeDay={challenge.currentDay}
            totalStudyMinutes={totalStudyMinutes}
            completionRate={completionRate}
          />
        )}

        {currentTab === 'profile' && (
          <ProfilePage
            user={user}
            challenge={challenge}
            onUpdateUser={handleUpdateUser}
            onResetAllData={handleResetAllData}
            onExportBackup={handleExportBackup}
            onImportBackup={handleImportBackup}
          />
        )}
      </main>

      {/* 5-Section Bottom Navigation */}
      <BottomNavigation
        currentTab={currentTab}
        onSelectTab={(tab) => {
          sounds.playClick();
          haptic.light();
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        pendingXp={pendingXp}
      />
    </div>
  );
};
export default App;
