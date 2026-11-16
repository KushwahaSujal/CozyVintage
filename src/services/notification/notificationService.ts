// Cozy Vintage Personality Notification & Reminder System

export interface InAppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'reminder' | 'celebration' | 'wisdom' | 'alert';
  actionLabel?: string;
  actionRoute?: string;
}

export const PERSONALITY_DIALOGUES = {
  waterDelayed: [
    'Boss, paani peena bhi bhool gaye? Ek glass ho jaaye! 💧',
    'Thoda pause lijiye aur ek glass fresh water pee lijiye. Your brain will thank you!',
    'Hydration check, boss! Stay energized and sharp.',
  ],
  studyDelayed: [
    'Books aapka intezaar kar rahi hain. Chaliye, 25 minutes se start karte hain. 📖',
    'A fresh page awaits! Start with just 1 problem set or 1 paragraph.',
    'Focus hour is calling! Silence notifications and let’s dive into knowledge.',
  ],
  gymMissed: [
    'Muscles ko bhi aaj thoda pyaar de dijiye! 🏋️‍♂️',
    'Even 20 minutes of movement will reset your energy today. Let’s do it!',
  ],
  readingMissed: [
    'Aaj novel ka ek page bhi nahi? Story aage badhani hai boss! 📚',
    'A quiet cup of tea and 10 pages of your book — perfect evening reset.',
  ],
  familyTime: [
    'Screen se thoda break. Ghar walon ke saath waqt bita lijiye. ❤️',
    'Put the phone face down. Real moments happen across the table.',
  ],
  studyCompleted: [
    'Aaj dimaag ki achhi exercise ho gayi! 💡 Great dedication!',
    'Subject finished! Your knowledge vault grew stronger today.',
  ],
  hydrationCompleted: [
    'Hydration champion! Saare 10 glasses complete! 🌊🏆',
    '3,000 ml achieved! Clean energy and glowing focus for today.',
  ],
  streakMilestone: (days: number) => [
    `${days} days without giving up! Consistency is becoming your superpower. 🌟`,
    `Boss! ${days} days streak? Aap toh kamaal kar rahe ho!`,
  ],
};

class NotificationService {
  private inAppQueue: InAppNotification[] = [];
  private listeners: ((notifications: InAppNotification[]) => void)[] = [];

  constructor() {
    this.initDefaultNotification();
  }

  private initDefaultNotification() {
    this.inAppQueue = [
      {
        id: 'welcome_note',
        title: 'Cozy Vintage Companion',
        message: 'Welcome to your mindful sanctuary. Tap any glass or habit to begin today’s journey!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'wisdom',
      },
    ];
  }

  public subscribe(cb: (list: InAppNotification[]) => void) {
    this.listeners.push(cb);
    cb(this.inAppQueue);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((l) => l([...this.inAppQueue]));
  }

  public async requestBrowserPermission(): Promise<boolean> {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const perm = await Notification.requestPermission();
      return perm === 'granted';
    }
    return false;
  }

  public pushReminder(title: string, message: string, type: 'reminder' | 'celebration' | 'wisdom' = 'reminder') {
    const item: InAppNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type,
    };

    this.inAppQueue.unshift(item);
    if (this.inAppQueue.length > 8) this.inAppQueue.pop();
    this.notifyListeners();

    // Trigger system notification if permitted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body: message,
          icon: '/icons/icon-192.png',
          badge: '/icons/icon.svg',
        });
      } catch {
        // Fallback to in-app notification handled
      }
    }
  }

  public dismiss(id: string) {
    this.inAppQueue = this.inAppQueue.filter((n) => n.id !== id);
    this.notifyListeners();
  }

  public getRandomDialogue(category: keyof typeof PERSONALITY_DIALOGUES): string {
    const val = PERSONALITY_DIALOGUES[category];
    if (Array.isArray(val)) {
      return val[Math.floor(Math.random() * val.length)];
    }
    return 'Chalo boss, aaj kuch achha karte hain!';
  }
}

export const notificationService = new NotificationService();
