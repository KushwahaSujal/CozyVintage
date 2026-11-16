export type MascotMood =
  | 'warm_smile'
  | 'happy'
  | 'thirsty'
  | 'disappointed'
  | 'motivated'
  | 'celebrating'
  | 'proud'
  | 'heroic'
  | 'sleepy'
  | 'thinking';

export interface UserProfile {
  name: string;
  avatarId: string;
  dob: string;
  age: number;
  interests: string[];
  highestQualification: string;
  currentEducation: string;
  goals: string[];
  discoverySource?: string;
  createdAt: string;
  biometricLockEnabled: boolean;
  pinLock?: string;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  theme: 'vintage' | 'dark_forest';
}

export interface ChallengeCommitment {
  id: string;
  title: string;
  durationDays: number;
  startDate: string; // ISO
  currentDay: number;
  status: 'active' | 'completed' | 'paused';
}

export interface HydrationGlass {
  id: number; // 1..10
  time: string; // e.g. "7:00 AM"
  amountMl: number; // 300
  isFilled: boolean;
  filledAt?: string;
  xp: number; // 5
}

export interface StudySubject {
  id: string;
  name: string;
  targetMinutes: number; // e.g. 60
  actualSecondsStudied: number;
  scheduledTime: string; // e.g. "10:00 AM – 11:00 AM"
  isCompleted: boolean;
  xp: number; // 25
  icon: string;
  category: string;
}

export interface HabitItem {
  id: string;
  name: string;
  category: 'discipline' | 'fitness' | 'wellness' | 'mindset' | 'lifestyle';
  description?: string;
  frequency: 'daily' | 'weekdays' | 'custom';
  targetValue?: string; // e.g. "30 mins", "1 session"
  isCompleted: boolean;
  streak: number;
  xp: number;
  icon: string;
  createdAt: string;
}

export interface RankInfo {
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Elite' | 'Heroic' | 'Master' | 'Grandmaster';
  minXp: number;
  badge: string;
  badgeColor: string;
  borderStyle: string;
  perk: string;
  quote: string;
}

export interface RewardVaultItem {
  id: string;
  title: string;
  subtitle: string;
  streakRequirement: number;
  icon: string;
  status: 'locked' | 'unlocked' | 'claimed' | 'skipped';
  unlockedAt?: string;
  claimedAt?: string;
  category: 'food' | 'treat' | 'leisure';
  isCustom?: boolean;
}

export interface DailyWisdomQuote {
  id: string;
  text: string;
  translation?: string;
  author: string;
  source: string;
  category: 'gita' | 'anime' | 'philosophy' | 'mythology' | 'peace' | 'motivation';
  timeSlot: 'Morning' | '12:00 PM' | '3:00 PM' | 'Evening' | 'Before Bed';
  isFavorite?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  thinkingMode?: 'fast' | 'balanced' | 'deep';
  reasoningSteps?: string[];
  provider?: 'gemini' | 'openai' | 'local_companion';
}

export interface ImageSearchResult {
  id: string;
  title: string;
  url: string;
  thumbUrl: string;
  source: string;
  license: string;
  author: string;
  category: 'educational' | 'photograph' | 'diagram' | 'scientific';
}

export interface DailySnapshot {
  date: string; // YYYY-MM-DD
  completionRate: number; // 0 - 100
  glassesDrank: number;
  studyMinutes: number;
  habitsCompleted: number;
  habitsTotal: number;
  xpEarned: number;
  xpClaimed: number;
  streakDay: number;
  note?: string;
}

export interface AISettings {
  provider: 'gemini' | 'openai';
  geminiApiKey: string;
  openaiApiKey: string;
  defaultMode: 'fast' | 'balanced' | 'deep';
  selectedModel: string;
}
