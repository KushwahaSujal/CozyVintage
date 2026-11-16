import Dexie, { type Table } from 'dexie';
import type {
  UserProfile,
  ChallengeCommitment,
  HydrationGlass,
  StudySubject,
  HabitItem,
  RewardVaultItem,
  DailyWisdomQuote,
  ChatMessage,
  DailySnapshot,
  AISettings,
  RankInfo,
} from '../../types';

export class CozyVintageDatabase extends Dexie {
  user!: Table<UserProfile, string>;
  challenges!: Table<ChallengeCommitment, string>;
  hydration!: Table<HydrationGlass, number>;
  subjects!: Table<StudySubject, string>;
  habits!: Table<HabitItem, string>;
  rewards!: Table<RewardVaultItem, string>;
  quotes!: Table<DailyWisdomQuote, string>;
  chatMessages!: Table<ChatMessage, string>;
  dailyReports!: Table<DailySnapshot, string>;
  aiSettings!: Table<AISettings, string>;

  constructor() {
    super('CozyVintageDB');
    this.version(1).stores({
      user: 'name',
      challenges: 'id, status',
      hydration: 'id',
      subjects: 'id',
      habits: 'id, category',
      rewards: 'id, status, streakRequirement',
      quotes: 'id, timeSlot, category, isFavorite',
      chatMessages: 'id, role, timestamp',
      dailyReports: 'date',
      aiSettings: 'provider',
    });
  }
}

export const db = new CozyVintageDatabase();

// Default Hydration Glasses (10 × 300ml = 3,000ml)
export const DEFAULT_HYDRATION_SCHEDULE: HydrationGlass[] = [
  { id: 1, time: '7:00 AM', amountMl: 300, isFilled: false, xp: 5 },
  { id: 2, time: '8:30 AM', amountMl: 300, isFilled: false, xp: 5 },
  { id: 3, time: '10:00 AM', amountMl: 300, isFilled: false, xp: 5 },
  { id: 4, time: '11:30 AM', amountMl: 300, isFilled: false, xp: 5 },
  { id: 5, time: '1:00 PM', amountMl: 300, isFilled: false, xp: 5 },
  { id: 6, time: '2:30 PM', amountMl: 300, isFilled: false, xp: 5 },
  { id: 7, time: '4:00 PM', amountMl: 300, isFilled: false, xp: 5 },
  { id: 8, time: '5:30 PM', amountMl: 300, isFilled: false, xp: 5 },
  { id: 9, time: '7:00 PM', amountMl: 300, isFilled: false, xp: 5 },
  { id: 10, time: '8:30 PM', amountMl: 300, isFilled: false, xp: 5 },
];

// Default Four Study Subjects (1 hour each = 4 hours)
export const DEFAULT_STUDY_SUBJECTS: StudySubject[] = [
  {
    id: 'maths',
    name: 'Mathematics',
    targetMinutes: 60,
    actualSecondsStudied: 0,
    scheduledTime: '10:00 AM – 11:00 AM',
    isCompleted: false,
    xp: 25,
    icon: 'Calculator',
    category: 'Analytical',
  },
  {
    id: 'english',
    name: 'English Language',
    targetMinutes: 60,
    actualSecondsStudied: 0,
    scheduledTime: '11:00 AM – 12:00 PM',
    isCompleted: false,
    xp: 25,
    icon: 'BookOpen',
    category: 'Language',
  },
  {
    id: 'reasoning',
    name: 'Logical Reasoning',
    targetMinutes: 60,
    actualSecondsStudied: 0,
    scheduledTime: '2:00 PM – 3:00 PM',
    isCompleted: false,
    xp: 25,
    icon: 'Brain',
    category: 'Cognitive',
  },
  {
    id: 'gk_gs',
    name: 'General Knowledge & Studies',
    targetMinutes: 60,
    actualSecondsStudied: 0,
    scheduledTime: '3:00 PM – 4:00 PM',
    isCompleted: false,
    xp: 25,
    icon: 'Compass',
    category: 'Awareness',
  },
];

// Default Habits
export const DEFAULT_HABITS: HabitItem[] = [
  {
    id: 'prayer',
    name: 'Morning Prayer & Gratitude',
    category: 'mindset',
    description: 'Start the day in peace and quiet mindfulness',
    frequency: 'daily',
    targetValue: '10 mins',
    isCompleted: false,
    streak: 3,
    xp: 10,
    icon: 'Sparkles',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'gym',
    name: 'Gym / Workout Session',
    category: 'fitness',
    description: 'Physical strength and cardiovascular training',
    frequency: 'daily',
    targetValue: '45 mins',
    isCompleted: false,
    streak: 5,
    xp: 20,
    icon: 'Dumbbell',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'reading',
    name: 'Reading Novels / Books',
    category: 'lifestyle',
    description: 'Immerse in literature, fiction, or non-fiction',
    frequency: 'daily',
    targetValue: '30 mins',
    isCompleted: false,
    streak: 4,
    xp: 10,
    icon: 'BookMarked',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'family_time',
    name: 'Quality Family & Friends Time',
    category: 'lifestyle',
    description: 'Put devices aside and connect with loved ones',
    frequency: 'daily',
    targetValue: '30 mins',
    isCompleted: false,
    streak: 7,
    xp: 10,
    icon: 'Users',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'phone_discipline',
    name: 'Phone & Screen Discipline',
    category: 'discipline',
    description: 'Limit non-essential scrolling and stay intentional',
    frequency: 'daily',
    targetValue: '< 2 hrs screen time',
    isCompleted: false,
    streak: 2,
    xp: 15,
    icon: 'SmartphoneOff',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'controlled_gaming',
    name: 'Relaxed Controlled Gaming',
    category: 'lifestyle',
    description: 'Guilt-free, controlled recreation without overdoing',
    frequency: 'daily',
    targetValue: '45 mins max',
    isCompleted: false,
    streak: 3,
    xp: 10,
    icon: 'Gamepad2',
    createdAt: new Date().toISOString(),
  },
];

// Real-Life Reward Vault Items
export const DEFAULT_REWARDS: RewardVaultItem[] = [
  {
    id: 'rew_3d',
    title: '₹10 KitKat Treat',
    subtitle: 'Crispy wafer sweet reward for unbroken discipline',
    streakRequirement: 3,
    icon: '🍫',
    status: 'unlocked',
    category: 'treat',
  },
  {
    id: 'rew_5d',
    title: 'Puchka / Pani Puri Feast',
    subtitle: 'Spicy, tangy street food celebration after 5 solid days',
    streakRequirement: 5,
    icon: '🥣',
    status: 'locked',
    category: 'food',
  },
  {
    id: 'rew_7d',
    title: 'Chicken Biryani Special',
    subtitle: 'A full week conquered! "Boss, aaj biryani banti hai!"',
    streakRequirement: 7,
    icon: '🍗',
    status: 'locked',
    category: 'food',
  },
  {
    id: 'rew_10d',
    title: 'Crispy Papdi Chaat',
    subtitle: 'Sweet curd, crunchy papdi, and flavorful chutneys',
    streakRequirement: 10,
    icon: '🥗',
    status: 'locked',
    category: 'food',
  },
  {
    id: 'rew_14d',
    title: 'Warm Ghugni & Kulcha',
    subtitle: 'Two straight weeks of warrior-level consistency!',
    streakRequirement: 14,
    icon: '🍲',
    status: 'locked',
    category: 'food',
  },
  {
    id: 'rew_30d',
    title: 'Grand Personal Milestone',
    subtitle: 'Favorite restaurant dinner or custom wishlist gift',
    streakRequirement: 30,
    icon: '🎁',
    status: 'locked',
    category: 'leisure',
  },
];

// Daily Wisdom Quotes (5 time slots)
export const DEFAULT_QUOTES: DailyWisdomQuote[] = [
  {
    id: 'q_morning_1',
    text: 'You have a right to perform your prescribed duty, but you are not entitled to the fruits of action.',
    translation: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन',
    author: 'Bhagavad Gita 2.47',
    source: 'Gita Philosophy',
    category: 'gita',
    timeSlot: 'Morning',
  },
  {
    id: 'q_noon_1',
    text: 'A person can rise through the efforts of their own mind; or draw themselves down, in the same manner. Because each person is his own friend or enemy.',
    author: 'Bhagavad Gita 6.5',
    source: 'Indian Philosophy',
    category: 'philosophy',
    timeSlot: '12:00 PM',
  },
  {
    id: 'q_afternoon_1',
    text: 'If you do not like your destiny, do not accept it. Instead, have the courage to change it the way you want it to be.',
    author: 'Naruto Uzumaki',
    source: 'Anime Wisdom',
    category: 'anime',
    timeSlot: '3:00 PM',
  },
  {
    id: 'q_evening_1',
    text: 'Even the longest and darkest night will yield to the dawn. Courage is not the absence of fear, but the triumph over it.',
    author: 'Mahabharata Teachings',
    source: 'Ancient Epics',
    category: 'mythology',
    timeSlot: 'Evening',
  },
  {
    id: 'q_night_1',
    text: 'Peace comes from within. Do not seek it without. Rest your mind tonight knowing you gave today your honest effort.',
    author: 'Ancient Wisdom',
    source: 'Reflections',
    category: 'peace',
    timeSlot: 'Before Bed',
  },
];

// Ranks Progression Definition (Free Fire inspired progression with Cozy Vintage branding)
export const RANKS: RankInfo[] = [
  {
    tier: 'Bronze',
    minXp: 0,
    badge: '🥉',
    badgeColor: '#CD7F32',
    borderStyle: 'border-amber-700/40',
    perk: 'Humble Novice — The journey of thousand miles begins.',
    quote: 'Every master was once a beginner.',
  },
  {
    tier: 'Silver',
    minXp: 300,
    badge: '🥈',
    badgeColor: '#C0C0C0',
    borderStyle: 'border-slate-400',
    perk: 'Disciplined Seeker — First habits taking deep root.',
    quote: 'Consistency is beginning to show its quiet power.',
  },
  {
    tier: 'Gold',
    minXp: 800,
    badge: '🥇',
    badgeColor: '#FFD700',
    borderStyle: 'border-amber-400',
    perk: 'Resilient Scholar — Unlocking intermediate reward vault.',
    quote: 'Day by day, what seemed difficult becomes natural.',
  },
  {
    tier: 'Platinum',
    minXp: 1800,
    badge: '💎',
    badgeColor: '#00CED1',
    borderStyle: 'border-cyan-400',
    perk: 'Focused Vanguard — Study momentum multiplier active.',
    quote: 'Your focus is an impenetrable shield.',
  },
  {
    tier: 'Diamond',
    minXp: 3500,
    badge: '✨',
    badgeColor: '#B9F2FF',
    borderStyle: 'border-sky-300 shadow-glow-sage',
    perk: 'Pillar of Will — 20% bonus daily streak multiplier.',
    quote: 'Discipline is doing what must be done even when feelings waver.',
  },
  {
    tier: 'Elite',
    minXp: 6000,
    badge: '👑',
    badgeColor: '#9D8DF1',
    borderStyle: 'border-purple-400',
    perk: 'Master of Routine — Unlocks deep AI analysis insights.',
    quote: 'Habits have become an effortless second nature.',
  },
  {
    tier: 'Heroic',
    minXp: 10000,
    badge: '🛡️',
    badgeColor: '#E65100',
    borderStyle: 'border-orange-500 shadow-glow-gold',
    perk: 'Heroic Achiever — Legendary Golden companion badge.',
    quote: 'You inspire those who quietly watch your journey.',
  },
  {
    tier: 'Master',
    minXp: 16000,
    badge: '⚔️',
    badgeColor: '#D81B60',
    borderStyle: 'border-rose-500 shadow-cozy-lg',
    perk: 'Grand Architect — Complete mastery over daily hours.',
    quote: 'A life crafted with pure intentionality.',
  },
  {
    tier: 'Grandmaster',
    minXp: 25000,
    badge: '🌟',
    badgeColor: '#B68B58',
    borderStyle: 'border-amber-300 ring-2 ring-cozy-gold shadow-glow-gold',
    perk: 'Cosmic Ascendant — Legendary 120-day hall of fame badge.',
    quote: 'Transformation complete. You have rebuilt your life.',
  },
];
