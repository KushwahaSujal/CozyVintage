import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface LiveClockProps {
  className?: string;
  showSeconds?: boolean;
}

export const LiveClock: React.FC<LiveClockProps> = ({
  className = '',
  showSeconds = true,
}) => {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = time.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: showSeconds ? '2-digit' : undefined,
    hour12: true,
  });

  const dateString = time.toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-cozy-parchment/80 dark:bg-darkSurface-card/90 border border-cozy-gold/30 shadow-xs backdrop-blur-xs select-none ${className}`}
      title={`Current time: ${time.toLocaleDateString()} ${timeString}`}
    >
      <Clock size={12} className="text-cozy-gold animate-pulse-subtle flex-shrink-0" />
      <span className="font-mono text-[11px] font-semibold text-cozy-forestDark dark:text-cozy-ivory tracking-tight">
        {timeString}
      </span>
      <span className="hidden sm:inline text-[10px] text-cozy-brown/70 dark:text-darkSurface-textMuted border-l border-cozy-gold/25 pl-1.5 font-serif italic">
        {dateString}
      </span>
    </div>
  );
};
