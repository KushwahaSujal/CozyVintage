import React from 'react';
import { Home, Compass, TrendingUp, Sparkles, User } from 'lucide-react';

export type NavigationTab = 'home' | 'journey' | 'growth' | 'ai' | 'profile';

interface BottomNavigationProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  pendingXp?: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentTab,
  onSelectTab,
  pendingXp = 0,
}) => {
  const tabs = [
    { id: 'home' as const, label: 'Home', icon: Home, badge: pendingXp > 0 ? `+${pendingXp}` : undefined },
    { id: 'journey' as const, label: 'Journey', icon: Compass },
    { id: 'growth' as const, label: 'Growth', icon: TrendingUp },
    { id: 'ai' as const, label: 'AI Companion', icon: Sparkles },
    { id: 'profile' as const, label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#F6F0E5]/95 dark:bg-[#141C16]/95 backdrop-blur-md border-t border-cozy-parchmentDark dark:border-darkSurface-border px-3 py-2 transition-colors">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'text-cozy-forest dark:text-cozy-ivory font-semibold scale-105'
                  : 'text-cozy-brown/70 dark:text-darkSurface-textMuted hover:text-cozy-forest'
              }`}
            >
              {/* Active ambient glow pill */}
              {isActive && (
                <span className="absolute inset-0 bg-cozy-sage/15 dark:bg-cozy-sage/20 rounded-2xl -z-10" />
              )}

              <div className="relative">
                <Icon
                  size={21}
                  strokeWidth={isActive ? 2.4 : 1.8}
                  className={isActive ? 'text-cozy-sageDark dark:text-cozy-sage' : ''}
                />
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-3.5 bg-cozy-gold text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full shadow-sm animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span className="text-[10px] mt-0.5 tracking-tight font-sans">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
