import React, { useState } from 'react';
import { CozyMascot } from '../../components/mascot/CozyMascot';
import { DailyProgressClaim } from '../../features/xp/DailyProgressClaim';
import { HydrationGarden } from '../../features/hydration/HydrationGarden';
import { StudyRoom } from '../../features/study/StudyRoom';
import { DailyHabitsList } from '../../features/habits/DailyHabitsList';
import { QuotePlayer } from '../../features/quotes/QuotePlayer';
import { sounds } from '../../services/audio/soundEffects';
import { haptic } from '../../services/haptic/hapticFeedback';
import { Sparkles, Bell, Calendar, Flame, Trophy } from 'lucide-react';
import type {
  UserProfile,
  ChallengeCommitment,
  HydrationGlass,
  StudySubject,
  HabitItem,
  DailyWisdomQuote,
  RankInfo,
  MascotMood,
} from '../../types';

interface HomePageProps {
  user: UserProfile;
  challenge: ChallengeCommitment;
  currentRank: RankInfo;
  hydration: HydrationGlass[];
  subjects: StudySubject[];
  habits: HabitItem[];
  quotes: DailyWisdomQuote[];
  pendingXp: number;
  claimedTodayXp: number;
  lifetimeXp: number;
  streak: number;
  onToggleHydration: (id: number) => void;
  onUpdateSubjectTime: (id: string, seconds: number, isCompleted: boolean) => void;
  onToggleHabit: (id: string) => void;
  onAddHabit: (habit: HabitItem) => void;
  onDeleteHabit: (id: string) => void;
  onClaimXp: () => void;
  onNavigateTab: (tab: 'home' | 'journey' | 'growth' | 'ai' | 'profile') => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  user,
  challenge,
  currentRank,
  hydration,
  subjects,
  habits,
  quotes,
  pendingXp,
  claimedTodayXp,
  lifetimeXp,
  streak,
  onToggleHydration,
  onUpdateSubjectTime,
  onToggleHabit,
  onAddHabit,
  onDeleteHabit,
  onClaimXp,
  onNavigateTab,
}) => {
  const [activeQuoteIndex, setActiveQuoteIndex] = useState<number>(0);
  const [mascotClickCount, setMascotClickCount] = useState<number>(0);

  // Time based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    if (hour < 21) return 'Good evening';
    return 'Peaceful night';
  };

  // Rotating greetings
  const rotatingPhrases = [
    'A fresh day, a fresh opportunity. Chalo boss, aaj kuch achha karte hain!',
    'Small steps today lead to grand transformations tomorrow.',
    'Your future self will thank you for the focus you bring today.',
    'Consistency is your quiet superpower. Let’s make today count!',
  ];
  const selectedPhrase = rotatingPhrases[challenge.currentDay % rotatingPhrases.length];

  // Calculate overall day completion percentage
  const totalHydrationFilled = hydration.filter((h) => h.isFilled).length;
  const totalSubjectsCompleted = subjects.filter((s) => s.isCompleted).length;
  const totalHabitsCompleted = habits.filter((h) => h.isCompleted).length;

  const totalTasks = hydration.length + subjects.length + habits.length;
  const completedTasks = totalHydrationFilled + totalSubjectsCompleted + totalHabitsCompleted;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Determine Mascot mood adaptively
  const getMascotMood = (): MascotMood => {
    if (completionRate === 100) return 'celebrating';
    if (pendingXp > 50) return 'proud';
    if (totalHydrationFilled < 2 && new Date().getHours() > 14) return 'thirsty';
    if (totalSubjectsCompleted === 0 && new Date().getHours() > 18) return 'disappointed';
    if (streak >= 7) return 'heroic';
    if (new Date().getHours() >= 23) return 'sleepy';
    return 'warm_smile';
  };

  const handleMascotClick = () => {
    sounds.playClick();
    haptic.light();
    setMascotClickCount((c) => c + 1);
  };

  const currentQuote = quotes[activeQuoteIndex % quotes.length] || quotes[0];

  return (
    <div className="pb-24 pt-4 px-4 max-w-lg mx-auto space-y-5 animate-fadeIn">
      {/* 1. Personalized Greeting Top Bar */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-1.5 text-xs text-cozy-brown dark:text-darkSurface-textMuted font-medium">
            <Calendar size={13} />
            <span>
              Day {challenge.currentDay} of {challenge.durationDays} • {challenge.title}
            </span>
          </div>
          <h1 className="font-serif font-bold text-2xl text-cozy-forest dark:text-cozy-ivory mt-0.5">
            {getGreeting()}, {user.name}! ☀️
          </h1>
          <p className="text-xs text-cozy-brown/85 dark:text-darkSurface-textMuted italic mt-0.5">
            "{selectedPhrase}"
          </p>
        </div>

        {/* User Sigil / Avatar button */}
        <button
          type="button"
          onClick={() => onNavigateTab('profile')}
          className="w-11 h-11 rounded-2xl bg-cozy-parchment dark:bg-darkSurface-card border border-cozy-gold/40 flex items-center justify-center text-xl shadow-sm hover:scale-105 transition-transform"
        >
          {user.avatarId || '🌿'}
        </button>
      </div>

      {/* 2. Interactive Mascot Display */}
      <div className="flex justify-center my-1">
        <CozyMascot
          mood={getMascotMood()}
          size="md"
          showDialogue={true}
          onClick={handleMascotClick}
        />
      </div>

      {/* 3. Daily Progress & XP Claim Section */}
      <DailyProgressClaim
        completionRate={completionRate}
        pendingXp={pendingXp}
        claimedTodayXp={claimedTodayXp}
        lifetimeXp={lifetimeXp}
        currentRank={currentRank}
        currentStreak={streak}
        onClaimXp={onClaimXp}
      />

      {/* 4. Hydration Garden (10 Glasses × 300ml) */}
      <HydrationGarden
        glasses={hydration}
        onToggleGlass={onToggleHydration}
      />

      {/* 5. Study Room (4 Subjects × 1 Hour = 4 Hours) */}
      <StudyRoom
        subjects={subjects}
        onUpdateSubjectTime={onUpdateSubjectTime}
      />

      {/* 6. Custom Daily Habits & Missions */}
      <DailyHabitsList
        habits={habits}
        onToggleHabit={onToggleHabit}
        onAddHabit={onAddHabit}
        onDeleteHabit={onDeleteHabit}
      />

      {/* 7. Daily Wisdom & Audio Quote */}
      {currentQuote && (
        <QuotePlayer
          quote={currentQuote}
          onNextQuote={() => setActiveQuoteIndex((i) => i + 1)}
        />
      )}

      {/* 8. Streak Reward Teaser Bar */}
      <div
        onClick={() => onNavigateTab('journey')}
        className="cursor-pointer bg-gradient-to-r from-amber-600/10 via-cozy-gold/20 to-amber-600/10 border border-cozy-gold/40 rounded-2xl p-3.5 flex items-center justify-between shadow-sm hover:border-cozy-gold transition-all"
      >
        <div className="flex items-center space-x-3">
          <span className="text-2xl">🍗</span>
          <div>
            <div className="font-serif font-bold text-xs text-cozy-forest dark:text-cozy-ivory">
              Real-Life Reward Vault
            </div>
            <div className="text-[10px] text-cozy-brown dark:text-darkSurface-textMuted">
              Streak active: <strong>{streak} days</strong>. Check what treats you've unlocked!
            </div>
          </div>
        </div>
        <span className="text-xs font-serif text-cozy-gold font-bold">Open Vault →</span>
      </div>
    </div>
  );
};
