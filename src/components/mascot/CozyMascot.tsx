import React from 'react';
import type { MascotMood } from '../../types';

interface CozyMascotProps {
  mood?: MascotMood;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showDialogue?: boolean;
  customDialogue?: string;
  onClick?: () => void;
  className?: string;
}

export const CozyMascot: React.FC<CozyMascotProps> = ({
  mood = 'warm_smile',
  size = 'md',
  showDialogue = false,
  customDialogue,
  onClick,
  className = '',
}) => {
  // Dimensions
  const dim = {
    sm: { w: 56, h: 56 },
    md: { w: 92, h: 92 },
    lg: { w: 140, h: 140 },
    xl: { w: 180, h: 180 },
  }[size];

  // Default dialogue per mood
  const moodDialogues: Record<MascotMood, string> = {
    warm_smile: 'Ready to build something beautiful today?',
    happy: 'Boss! You are doing fantastic today!',
    thirsty: 'Thoda paani pee lo na boss? Just 1 glass!',
    disappointed: 'Kitabon ko chhod ke kahan chal diye? Chalo focus karein!',
    motivated: 'Dimaag ki muscle strong ho rahi hai. Keep pushing!',
    celebrating: 'Kamaal kar diya! Saare missions complete! 🎉',
    proud: 'Proud of your discipline. You are unstoppable!',
    heroic: 'Rank upgraded! A legendary warrior of consistency! ⚔️',
    sleepy: 'Shh... Rest well tonight. Great effort today! 🌙',
    thinking: 'Hmm... analyzing your growth pattern and deep insights...',
  };

  const currentDialogue = customDialogue || moodDialogues[mood];

  return (
    <div
      className={`relative inline-flex flex-col items-center select-none ${
        onClick ? 'cursor-pointer group' : ''
      } ${className}`}
      onClick={onClick}
    >
      {/* Interactive Speech Bubble */}
      {showDialogue && (
        <div className="mb-2 max-w-[220px] bg-cozy-parchment/95 dark:bg-darkSurface-card/95 border border-cozy-gold/40 dark:border-darkSurface-border px-3.5 py-2 rounded-2xl shadow-cozy text-xs text-cozy-forest dark:text-darkSurface-text font-serif italic text-center animate-bounce-subtle relative backdrop-blur-sm">
          "{currentDialogue}"
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-cozy-parchment dark:bg-darkSurface-card border-r border-b border-cozy-gold/40 dark:border-darkSurface-border rotate-45" />
        </div>
      )}

      {/* Mascot Animated Vector SVG */}
      <div
        className={`relative transition-transform duration-300 ${
          onClick ? 'group-hover:scale-105 active:scale-95' : ''
        }`}
        style={{ width: dim.w, height: dim.h }}
      >
        {/* Glow Aura for heroic or celebrating states */}
        {(mood === 'heroic' || mood === 'celebrating') && (
          <div className="absolute inset-0 rounded-full bg-amber-400/25 blur-xl animate-pulse" />
        )}
        {mood === 'thirsty' && (
          <div className="absolute inset-0 rounded-full bg-sky-400/20 blur-lg animate-pulse" />
        )}

        <svg
          viewBox="0 0 200 200"
          width="100%"
          height="100%"
          className="overflow-visible drop-shadow-md"
        >
          <defs>
            <radialGradient id="bodyGrad" cx="50%" cy="38%" r="60%">
              <stop offset="0%" stop-color="#9BB29D" />
              <stop offset="65%" stop-color="#78927A" />
              <stop offset="100%" stop-color="#496354" />
            </radialGradient>
            <radialGradient id="bellyGrad" cx="50%" cy="45%" r="55%">
              <stop offset="0%" stop-color="#FFFFFF" />
              <stop offset="60%" stop-color="#F6F0E5" />
              <stop offset="100%" stop-color="#E7DDCA" />
            </radialGradient>
            <linearGradient id="leafGrad" x1="0%" y1="100%" x2="50%" y2="0%">
              <stop offset="0%" stop-color="#78927A" />
              <stop offset="100%" stop-color="#CF9E65" />
            </linearGradient>
            <linearGradient id="heroicAura" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#FFD700" />
              <stop offset="100%" stop-color="#B68B58" />
            </linearGradient>
          </defs>

          {/* Shadow */}
          <ellipse cx="100" cy="180" rx="60" ry="14" fill="#35483D" opacity="0.16" />

          {/* Magical Star sparkles for Heroic / Celebrating */}
          {(mood === 'heroic' || mood === 'celebrating' || mood === 'proud') && (
            <g className="animate-sparkle">
              <path
                d="M 160 40 Q 170 40 170 30 Q 170 40 180 40 Q 170 40 170 50 Q 170 40 160 40 Z"
                fill="#FFD700"
              />
              <path
                d="M 30 65 Q 38 65 38 57 Q 38 65 46 65 Q 38 65 38 73 Q 38 65 30 65 Z"
                fill="#FFD700"
              />
            </g>
          )}

          {/* Cute Forest Body */}
          <path
            d="M 52 145 C 44 95, 60 55, 100 48 C 140 55, 156 95, 148 145 C 140 175, 60 175, 52 145 Z"
            fill="url(#bodyGrad)"
            className="transition-all duration-300"
          />

          {/* Cream Belly */}
          <ellipse cx="100" cy="125" rx="36" ry="38" fill="url(#bellyGrad)" />

          {/* Sprout on Head */}
          <g className="animate-float origin-bottom">
            <path
              d="M 100 48 C 100 24, 122 12, 128 6 C 130 22, 114 38, 100 48 Z"
              fill="url(#leafGrad)"
            />
            <path
              d="M 100 48 C 96 26, 78 18, 72 14 C 74 28, 88 40, 100 48 Z"
              fill="#9BB29D"
              opacity="0.9"
            />
            <circle cx="100" cy="46" r="3" fill="#CF9E65" />
          </g>

          {/* Little Arms */}
          {mood === 'celebrating' ? (
            // Arms raised up in victory!
            <g fill="#5E7860">
              <path d="M 54 110 C 35 90, 40 70, 48 72 C 54 75, 58 95, 62 115 Z" />
              <path d="M 146 110 C 165 90, 160 70, 152 72 C 146 75, 142 95, 138 115 Z" />
            </g>
          ) : mood === 'thirsty' ? (
            // Holding empty cup
            <g fill="#5E7860">
              <ellipse cx="80" cy="130" rx="9" ry="6" />
              <ellipse cx="120" cy="130" rx="9" ry="6" />
              <path
                d="M 94 135 L 106 135 L 104 150 L 96 150 Z"
                fill="none"
                stroke="#5EA3A3"
                strokeWidth="2.5"
              />
            </g>
          ) : (
            // Cozy little resting arms
            <g fill="#5E7860">
              <ellipse cx="62" cy="120" rx="7" ry="10" transform="rotate(-15 62 120)" />
              <ellipse cx="138" cy="120" rx="7" ry="10" transform="rotate(15 138 120)" />
            </g>
          )}

          {/* Rosy Cheeks */}
          <ellipse cx="78" cy="112" rx="7" ry="4.5" fill="#D48C9A" opacity="0.75" />
          <ellipse cx="122" cy="112" rx="7" ry="4.5" fill="#D48C9A" opacity="0.75" />

          {/* EYES & EXPRESSIONS */}
          {mood === 'sleepy' ? (
            // Sleeping closed curved eyes with Zzz
            <g stroke="#35483D" strokeWidth="2.5" strokeLinecap="round" fill="none">
              <path d="M 80 102 Q 88 108 96 102" />
              <path d="M 104 102 Q 112 108 120 102" />
              <text x="142" y="80" fill="#9D8DF1" fontSize="14" fontFamily="serif" fontWeight="bold">
                Z
              </text>
              <text x="154" y="68" fill="#9D8DF1" fontSize="11" fontFamily="serif">
                z
              </text>
            </g>
          ) : mood === 'disappointed' ? (
            // Sad / concerned eyes with sweat drop
            <g>
              <ellipse cx="86" cy="102" rx="4.5" ry="6" fill="#35483D" />
              <ellipse cx="114" cy="102" rx="4.5" ry="6" fill="#35483D" />
              {/* Drooping eyebrows */}
              <path
                d="M 80 92 Q 86 96 92 94"
                stroke="#35483D"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 108 94 Q 114 96 120 92"
                stroke="#35483D"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              {/* Little tear or sweat drop */}
              <ellipse cx="127" cy="106" rx="2.5" ry="4" fill="#5EA3A3" />
            </g>
          ) : mood === 'thirsty' ? (
            // Thirsty blinking eyes + sweat drop
            <g>
              <ellipse cx="86" cy="102" rx="5" ry="6.5" fill="#35483D" />
              <circle cx="85" cy="100" r="2" fill="#FFFFFF" />
              <ellipse cx="114" cy="102" rx="5" ry="6.5" fill="#35483D" />
              <circle cx="113" cy="100" r="2" fill="#FFFFFF" />
              {/* Sweat drop on forehead */}
              <path
                d="M 118 78 C 118 72, 124 66, 124 66 C 124 66, 130 72, 130 78 C 130 82, 125 84, 124 84 C 122 84, 118 82, 118 78 Z"
                fill="#5EA3A3"
                opacity="0.85"
              />
            </g>
          ) : mood === 'heroic' || mood === 'celebrating' || mood === 'proud' ? (
            // Starry / joyous eyes
            <g>
              <ellipse cx="86" cy="100" rx="5.5" ry="7.5" fill="#35483D" />
              <circle cx="84" cy="98" r="2.5" fill="#FFFFFF" />
              <circle cx="88" cy="103" r="1.2" fill="#FFD700" />
              <ellipse cx="114" cy="100" rx="5.5" ry="7.5" fill="#35483D" />
              <circle cx="112" cy="98" r="2.5" fill="#FFFFFF" />
              <circle cx="116" cy="103" r="1.2" fill="#FFD700" />
            </g>
          ) : (
            // Standard warm friendly smiling eyes
            <g>
              <ellipse cx="87" cy="102" rx="4.5" ry="7" fill="#35483D" />
              <circle cx="85" cy="100" r="2.2" fill="#FFFFFF" />
              <ellipse cx="113" cy="102" rx="4.5" ry="7" fill="#35483D" />
              <circle cx="111" cy="100" r="2.2" fill="#FFFFFF" />
            </g>
          )}

          {/* MOUTH */}
          {mood === 'celebrating' || mood === 'heroic' ? (
            // Big joyful open smile :D
            <path
              d="M 92 113 Q 100 124 108 113 Z"
              fill="#D48C9A"
              stroke="#35483D"
              strokeWidth="2"
            />
          ) : mood === 'disappointed' ? (
            // Small downturned mouth :(
            <path
              d="M 95 116 Q 100 112 105 116"
              fill="none"
              stroke="#35483D"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          ) : mood === 'thirsty' ? (
            // Small 'o' mouth longing for water
            <ellipse
              cx="100"
              cy="115"
              rx="4"
              ry="5"
              fill="#D48C9A"
              stroke="#35483D"
              strokeWidth="1.5"
            />
          ) : (
            // Warm gentle curved smile :)
            <path
              d="M 95 112 Q 100 117 105 112"
              fill="none"
              stroke="#35483D"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}

          {/* Heroic Badge for Heroic / Grandmaster */}
          {mood === 'heroic' && (
            <g transform="translate(90, 142) scale(0.6)">
              <polygon
                points="16,0 21,11 32,13 24,21 26,32 16,27 6,32 8,21 0,13 11,11"
                fill="url(#heroicAura)"
                stroke="#735943"
                strokeWidth="1.5"
              />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};
