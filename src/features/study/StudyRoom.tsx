import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
  Sparkles,
  Calculator,
  BookOpen,
  Brain,
  Compass,
  Lightbulb,
  Edit2,
  Plus,
} from 'lucide-react';
import { sounds } from '../../services/audio/soundEffects';
import { haptic } from '../../services/haptic/hapticFeedback';
import { fireGoldenSparkles } from '../../utils/confetti';
import type { StudySubject } from '../../types';

interface StudyRoomProps {
  subjects: StudySubject[];
  onUpdateSubjectTime: (id: string, seconds: number, isCompleted: boolean) => void;
}

export const StudyRoom: React.FC<StudyRoomProps> = ({
  subjects,
  onUpdateSubjectTime,
}) => {
  const [activeSubjectId, setActiveSubjectId] = useState<string>('maths');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [showManualModal, setShowManualModal] = useState<boolean>(false);
  const [manualMinutesInput, setManualMinutesInput] = useState<string>('30');

  const currentSubject = subjects.find((s) => s.id === activeSubjectId) || subjects[0];

  // Timer interval handling
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && currentSubject) {
      interval = setInterval(() => {
        const newSec = currentSubject.actualSecondsStudied + 1;
        const targetSec = currentSubject.targetMinutes * 60;
        const shouldComplete = newSec >= targetSec && !currentSubject.isCompleted;

        if (shouldComplete) {
          sounds.playBulbIllumination();
          haptic.celebrate();
          fireGoldenSparkles();
        }

        onUpdateSubjectTime(
          currentSubject.id,
          newSec,
          newSec >= targetSec || currentSubject.isCompleted
        );
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, currentSubject, onUpdateSubjectTime]);

  const handleStartTimer = () => {
    sounds.playClick();
    haptic.medium();
    setIsRunning(true);
  };

  const handlePauseTimer = () => {
    sounds.playClick();
    haptic.light();
    setIsRunning(false);
  };

  const handleResetSession = () => {
    sounds.playClick();
    setIsRunning(false);
    onUpdateSubjectTime(currentSubject.id, 0, false);
  };

  const handleManualAdd = (minutes: number) => {
    sounds.playClick();
    haptic.light();
    const newSec = currentSubject.actualSecondsStudied + minutes * 60;
    const targetSec = currentSubject.targetMinutes * 60;
    const isCompleted = newSec >= targetSec;
    if (isCompleted && !currentSubject.isCompleted) {
      sounds.playBulbIllumination();
      haptic.celebrate();
      fireGoldenSparkles();
    }
    onUpdateSubjectTime(currentSubject.id, newSec, isCompleted);
    setShowManualModal(false);
  };

  // Helper icon mapper
  const getSubjectIcon = (id: string) => {
    switch (id) {
      case 'maths':
        return <Calculator size={18} />;
      case 'english':
        return <BookOpen size={18} />;
      case 'reasoning':
        return <Brain size={18} />;
      case 'gk_gs':
        return <Compass size={18} />;
      default:
        return <BookOpen size={18} />;
    }
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const targetSeconds = currentSubject.targetMinutes * 60;
  const progressPercent = Math.min(
    100,
    Math.round((currentSubject.actualSecondsStudied / targetSeconds) * 100)
  );

  const totalStudiedMinutesAll = Math.round(
    subjects.reduce((sum, s) => sum + s.actualSecondsStudied, 0) / 60
  );
  const totalTargetMinutesAll = subjects.reduce((sum, s) => sum + s.targetMinutes, 0);

  return (
    <div className="bg-cozy-parchment/65 dark:bg-darkSurface-card border border-cozy-gold/30 dark:border-darkSurface-border rounded-3xl p-5 shadow-cozy transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-2xl bg-cozy-gold/20 flex items-center justify-center text-cozy-gold">
            <Lightbulb size={20} className={currentSubject.isCompleted ? 'fill-cozy-gold text-cozy-gold' : ''} />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-cozy-forest dark:text-cozy-ivory flex items-center gap-1.5">
              Study Room
              <span className="text-[11px] font-sans bg-cozy-gold/20 text-cozy-brownDark dark:text-cozy-goldLight px-2 py-0.5 rounded-full font-semibold">
                4 Hours Target
              </span>
            </h3>
            <p className="text-[11px] text-cozy-brown dark:text-darkSurface-textMuted">
              {totalStudiedMinutesAll}m logged of {Math.round(totalTargetMinutesAll / 60)}h total
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowManualModal(true)}
          className="text-xs text-cozy-brown dark:text-darkSurface-textMuted hover:text-cozy-forest flex items-center gap-1 bg-cozy-ivory dark:bg-darkSurface-bg px-2.5 py-1.5 rounded-xl border border-cozy-gold/30"
        >
          <Edit2 size={12} /> Log Manual
        </button>
      </div>

      {/* 4 Subjects Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        {subjects.map((sub) => {
          const isSelected = sub.id === activeSubjectId;
          const subProgress = Math.min(100, Math.round((sub.actualSecondsStudied / (sub.targetMinutes * 60)) * 100));

          return (
            <button
              key={sub.id}
              type="button"
              onClick={() => {
                sounds.playClick();
                setActiveSubjectId(sub.id);
                setIsRunning(false);
              }}
              className={`p-2.5 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'border-cozy-gold bg-cozy-ivory dark:bg-darkSurface-bg ring-2 ring-cozy-gold/40 shadow-sm'
                  : 'border-cozy-parchmentDark/40 dark:border-darkSurface-border bg-cozy-ivory/60 dark:bg-darkSurface-bg/40 opacity-80'
              }`}
            >
              <div className="flex items-center justify-between text-cozy-forest dark:text-cozy-ivory">
                <span className="text-cozy-gold">{getSubjectIcon(sub.id)}</span>
                {sub.isCompleted ? (
                  <span className="text-cozy-sageDark dark:text-cozy-sage">
                    <CheckCircle2 size={14} />
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-cozy-brown dark:text-darkSurface-textMuted">
                    {subProgress}%
                  </span>
                )}
              </div>
              <div className="text-xs font-semibold mt-1 truncate text-cozy-forestDark dark:text-cozy-ivory">
                {sub.name}
              </div>
              <div className="text-[10px] text-cozy-brown dark:text-darkSurface-textMuted truncate">
                {Math.round(sub.actualSecondsStudied / 60)} / {sub.targetMinutes} min
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Study Desk Box */}
      <div className="relative bg-cozy-ivory dark:bg-darkSurface-bg rounded-2xl p-5 border border-cozy-gold/30 dark:border-darkSurface-border flex flex-col items-center justify-center overflow-hidden">
        {/* Glow backdrop when illuminated */}
        {currentSubject.isCompleted && (
          <div className="absolute inset-0 bg-gradient-to-b from-amber-300/15 via-transparent to-amber-300/5 pointer-events-none" />
        )}

        {/* Vintage Desk Bulb SVG (Illuminates when goal achieved) */}
        <div className="relative mb-2">
          <svg
            viewBox="0 0 100 100"
            className={`w-20 h-20 transition-all duration-700 ${
              currentSubject.isCompleted
                ? 'drop-shadow-glow-gold filter scale-105'
                : 'opacity-70 grayscale-[30%]'
            }`}
          >
            <defs>
              <radialGradient id="lampGlow" cx="50%" cy="40%" r="50%">
                <stop offset="0%" stopColor="#FFF2A3" />
                <stop offset="60%" stopColor="#E5C378" />
                <stop offset="100%" stopColor="#B68B58" />
              </radialGradient>
            </defs>

            {/* Ceiling fixture line */}
            <line x1="50" y1="0" x2="50" y2="28" stroke="#735943" strokeWidth="3" />
            {/* Vintage Brass Cap */}
            <path d="M 42 28 L 58 28 L 55 38 L 45 38 Z" fill="#B68B58" stroke="#735943" strokeWidth="1.5" />
            {/* Filament */}
            <path
              d="M 47 48 Q 50 42 53 48"
              fill="none"
              stroke={currentSubject.isCompleted ? '#E65100' : '#888'}
              strokeWidth="2"
            />
            {/* Glass Bulb Dome */}
            <path
              d="M 45 38 C 30 40, 26 62, 38 76 C 44 82, 56 82, 62 76 C 74 62, 70 40, 55 38 Z"
              fill={currentSubject.isCompleted ? 'url(#lampGlow)' : '#E7DDCA'}
              stroke="#B68B58"
              strokeWidth="2.5"
              opacity={currentSubject.isCompleted ? 1 : 0.6}
            />

            {/* Radiant light rays when completed */}
            {currentSubject.isCompleted && (
              <g stroke="#CF9E65" strokeWidth="2.5" strokeLinecap="round" className="animate-sparkle">
                <line x1="16" y1="56" x2="6" y2="56" />
                <line x1="84" y1="56" x2="94" y2="56" />
                <line x1="24" y1="36" x2="16" y2="28" />
                <line x1="76" y1="36" x2="84" y2="28" />
                <line x1="28" y1="78" x2="20" y2="86" />
                <line x1="72" y1="78" x2="80" y2="86" />
              </g>
            )}
          </svg>
        </div>

        {/* Current Active Subject Info */}
        <div className="text-center mb-3">
          <div className="font-serif font-bold text-lg text-cozy-forest dark:text-cozy-ivory">
            {currentSubject.name}
          </div>
          <div className="text-xs text-cozy-brown dark:text-darkSurface-textMuted flex items-center justify-center gap-1.5 mt-0.5">
            <Clock size={12} /> Scheduled: {currentSubject.scheduledTime}
          </div>
        </div>

        {/* Big Stopwatch Display */}
        <div className="font-mono text-4xl font-bold tracking-wider text-cozy-forest dark:text-cozy-ivory my-1">
          {formatTimer(currentSubject.actualSecondsStudied)}
        </div>

        <div className="text-[11px] font-semibold text-cozy-brown dark:text-darkSurface-textMuted mb-4">
          Target: {currentSubject.targetMinutes} minutes (25 XP reward)
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          {!isRunning ? (
            <button
              type="button"
              onClick={handleStartTimer}
              className="bg-cozy-forest hover:bg-cozy-forestDark text-white px-5 py-2.5 rounded-2xl shadow-cozy flex items-center space-x-2 text-xs font-semibold font-serif transition-transform active:scale-95"
            >
              <Play size={15} className="fill-white" />
              <span>{currentSubject.actualSecondsStudied > 0 ? 'Resume Study' : 'Start Session'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePauseTimer}
              className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-2xl shadow-cozy flex items-center space-x-2 text-xs font-semibold font-serif transition-transform active:scale-95"
            >
              <Pause size={15} className="fill-white" />
              <span>Pause Focus</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleResetSession}
            title="Reset timer"
            className="p-2.5 rounded-2xl border border-cozy-gold/30 hover:bg-cozy-parchment dark:hover:bg-darkSurface-card text-cozy-brown dark:text-darkSurface-textMuted transition-all"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      {/* Manual Quick Add Modal */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-cozy-ivory dark:bg-darkSurface-card border border-cozy-gold rounded-3xl p-6 max-w-sm w-full shadow-cozy-lg animate-fadeIn">
            <h4 className="font-serif font-bold text-lg text-cozy-forest dark:text-cozy-ivory mb-2">
              Log Offline Study Time
            </h4>
            <p className="text-xs text-cozy-brown dark:text-darkSurface-textMuted mb-4">
              Add study duration already completed away from the screen for{' '}
              <strong>{currentSubject.name}</strong>.
            </p>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {[15, 30, 60].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => handleManualAdd(m)}
                  className="py-2.5 px-3 rounded-xl border border-cozy-gold/40 text-xs font-semibold text-cozy-forest dark:text-cozy-ivory hover:bg-cozy-sage/20"
                >
                  +{m} min
                </button>
              ))}
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowManualModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-cozy-brown dark:text-darkSurface-textMuted"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
