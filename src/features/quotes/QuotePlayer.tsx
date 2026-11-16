import React, { useState, useEffect } from 'react';
import { Volume2, Square, Heart, Share2, Sparkles, BookOpen } from 'lucide-react';
import { speechService } from '../../services/speech/speechService';
import { sounds } from '../../services/audio/soundEffects';
import { haptic } from '../../services/haptic/hapticFeedback';
import type { DailyWisdomQuote } from '../../types';

interface QuotePlayerProps {
  quote: DailyWisdomQuote;
  onToggleFavorite?: (id: string) => void;
  onNextQuote?: () => void;
}

export const QuotePlayer: React.FC<QuotePlayerProps> = ({
  quote,
  onToggleFavorite,
  onNextQuote,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  useEffect(() => {
    // Stop speech when quote changes
    return () => {
      speechService.stop();
    };
  }, [quote.id]);

  const handleToggleAudio = () => {
    sounds.playClick();
    haptic.light();

    if (isPlayingAudio) {
      speechService.stop();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      const textToRead = `${quote.text}. By ${quote.author}. ${quote.source}.`;
      speechService.speak(
        textToRead,
        () => setIsPlayingAudio(false),
        () => setIsPlayingAudio(false)
      );
    }
  };

  const handleShare = () => {
    sounds.playClick();
    haptic.light();
    const shareText = `"${quote.text}" — ${quote.author} (${quote.source})\n\nDiscovered on Cozy Vintage ✨`;

    if (navigator.share) {
      navigator.share({
        title: 'Daily Wisdom — Cozy Vintage',
        text: shareText,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-cozy-parchment/90 via-cozy-ivory/95 to-cozy-parchment/80 dark:from-darkSurface-card dark:to-darkSurface-bg border border-cozy-gold/40 dark:border-darkSurface-border rounded-3xl p-5 shadow-cozy overflow-hidden">
      {/* Decorative Vintage Corner Accent */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-cozy-gold/10 rounded-bl-full pointer-events-none" />

      {/* Header Slot & Category */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-xs bg-cozy-gold/20 text-cozy-brownDark dark:text-cozy-goldLight font-semibold px-2.5 py-0.5 rounded-full font-serif flex items-center gap-1">
            <Sparkles size={11} /> {quote.timeSlot} Wisdom
          </span>
          <span className="text-[10px] text-cozy-brown/80 dark:text-darkSurface-textMuted uppercase tracking-wider font-semibold">
            {quote.category}
          </span>
        </div>

        {/* Favorite & Share Buttons */}
        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            onClick={() => onToggleFavorite && onToggleFavorite(quote.id)}
            title="Favorite"
            className="p-1.5 rounded-xl hover:bg-cozy-gold/15 transition-colors text-cozy-brown dark:text-darkSurface-textMuted"
          >
            <Heart
              size={15}
              className={quote.isFavorite ? 'fill-red-500 text-red-500' : ''}
            />
          </button>

          <button
            type="button"
            onClick={handleShare}
            title="Share"
            className="p-1.5 rounded-xl hover:bg-cozy-gold/15 transition-colors text-cozy-brown dark:text-darkSurface-textMuted"
          >
            <Share2 size={15} />
          </button>
        </div>
      </div>

      {/* Quote Body */}
      <div className="my-2">
        <p className="font-serif italic text-base leading-relaxed text-cozy-forestDark dark:text-cozy-ivory">
          "{quote.text}"
        </p>

        {quote.translation && (
          <p className="text-xs font-serif text-cozy-brown dark:text-darkSurface-textMuted mt-1.5 opacity-90">
            {quote.translation}
          </p>
        )}
      </div>

      {/* Author & Audio Controls Bar */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-cozy-gold/20 dark:border-darkSurface-border">
        <div>
          <div className="font-serif font-bold text-xs text-cozy-forest dark:text-cozy-ivory">
            — {quote.author}
          </div>
          <div className="text-[10px] text-cozy-brown dark:text-darkSurface-textMuted">
            {quote.source}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Read Aloud Button */}
          <button
            type="button"
            onClick={handleToggleAudio}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold font-serif border transition-all ${
              isPlayingAudio
                ? 'bg-amber-600 text-white border-amber-600 animate-pulse'
                : 'bg-cozy-ivory dark:bg-darkSurface-card text-cozy-forest dark:text-cozy-ivory border-cozy-gold/40 hover:bg-cozy-gold/15'
            }`}
          >
            {isPlayingAudio ? (
              <>
                <Square size={13} className="fill-white" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Volume2 size={14} />
                <span>Listen</span>
              </>
            )}
          </button>

          {/* Next Quote */}
          {onNextQuote && (
            <button
              type="button"
              onClick={onNextQuote}
              className="text-[11px] text-cozy-brown dark:text-darkSurface-textMuted hover:text-cozy-forest px-2 py-1"
            >
              Next →
            </button>
          )}
        </div>
      </div>

      {isCopied && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-cozy-forest text-white text-[10px] px-3 py-1 rounded-full shadow-md">
          Copied to clipboard!
        </div>
      )}
    </div>
  );
};
