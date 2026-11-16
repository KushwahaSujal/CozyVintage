import React, { useState } from 'react';
import {
  Check,
  Plus,
  Trash2,
  Sparkles,
  Dumbbell,
  BookMarked,
  Users,
  Smartphone,
  Gamepad2,
  Flame,
  Award,
} from 'lucide-react';
import { sounds } from '../../services/audio/soundEffects';
import { haptic } from '../../services/haptic/hapticFeedback';
import { fireGoldenSparkles } from '../../utils/confetti';
import type { HabitItem } from '../../types';

interface DailyHabitsListProps {
  habits: HabitItem[];
  onToggleHabit: (id: string) => void;
  onAddHabit: (habit: HabitItem) => void;
  onDeleteHabit: (id: string) => void;
}

export const DailyHabitsList: React.FC<DailyHabitsListProps> = ({
  habits,
  onToggleHabit,
  onAddHabit,
  onDeleteHabit,
}) => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newHabitName, setNewHabitName] = useState<string>('');
  const [newHabitCategory, setNewHabitCategory] = useState<HabitItem['category']>('lifestyle');
  const [newHabitTarget, setNewHabitTarget] = useState<string>('20 mins');
  const [newHabitXp, setNewHabitXp] = useState<number>(15);

  const completedCount = habits.filter((h) => h.isCompleted).length;

  const handleToggle = (habit: HabitItem) => {
    if (!habit.isCompleted) {
      sounds.playClick();
      haptic.medium();
      fireGoldenSparkles();
    } else {
      sounds.playClick();
      haptic.light();
    }
    onToggleHabit(habit.id);
  };

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    const item: HabitItem = {
      id: `h_${Date.now()}`,
      name: newHabitName.trim(),
      category: newHabitCategory,
      frequency: 'daily',
      targetValue: newHabitTarget,
      isCompleted: false,
      streak: 1,
      xp: newHabitXp,
      icon: 'Sparkles',
      createdAt: new Date().toISOString(),
    };

    onAddHabit(item);
    setNewHabitName('');
    setShowAddModal(false);
    sounds.playFanfare();
    haptic.celebrate();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fitness':
        return <Dumbbell size={16} />;
      case 'lifestyle':
        return <BookMarked size={16} />;
      case 'mindset':
        return <Sparkles size={16} />;
      case 'discipline':
        return <Smartphone size={16} />;
      default:
        return <Award size={16} />;
    }
  };

  return (
    <div className="bg-cozy-parchment/65 dark:bg-darkSurface-card border border-cozy-gold/30 dark:border-darkSurface-border rounded-3xl p-5 shadow-cozy transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-serif font-bold text-base text-cozy-forest dark:text-cozy-ivory flex items-center gap-1.5">
            Daily Missions & Habits
            <span className="text-[11px] font-sans bg-cozy-sage/20 text-cozy-sageDark dark:text-cozy-sage px-2 py-0.5 rounded-full font-semibold">
              {completedCount} / {habits.length} Done
            </span>
          </h3>
          <p className="text-[11px] text-cozy-brown dark:text-darkSurface-textMuted">
            Custom disciplines to cultivate your lifestyle
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            setShowAddModal(true);
          }}
          className="bg-cozy-forest hover:bg-cozy-forestDark text-white p-2 rounded-xl shadow-sm flex items-center gap-1 text-xs font-semibold"
        >
          <Plus size={15} />
          <span className="hidden sm:inline">Add Habit</span>
        </button>
      </div>

      {/* Habit Items Grid / List */}
      <div className="space-y-2.5">
        {habits.map((habit) => (
          <div
            key={habit.id}
            className={`group p-3 rounded-2xl border transition-all duration-200 flex items-center justify-between ${
              habit.isCompleted
                ? 'bg-cozy-sage/15 dark:bg-cozy-sage/20 border-cozy-sage/60 dark:border-cozy-sage/40'
                : 'bg-cozy-ivory/80 dark:bg-darkSurface-bg/70 border-cozy-gold/25 dark:border-darkSurface-border hover:border-cozy-gold/50'
            }`}
          >
            {/* Left toggle & info */}
            <div
              className="flex items-center space-x-3 cursor-pointer flex-1"
              onClick={() => handleToggle(habit)}
            >
              <div
                className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                  habit.isCompleted
                    ? 'bg-cozy-forest text-white border-cozy-forest'
                    : 'border-cozy-gold/50 bg-white/70 dark:bg-darkSurface-card'
                }`}
              >
                {habit.isCompleted && <Check size={14} strokeWidth={3} />}
              </div>

              <div>
                <div
                  className={`text-xs font-semibold font-serif transition-colors ${
                    habit.isCompleted
                      ? 'line-through text-cozy-brown/70 dark:text-darkSurface-textMuted'
                      : 'text-cozy-forestDark dark:text-cozy-ivory'
                  }`}
                >
                  {habit.name}
                </div>
                <div className="text-[10px] text-cozy-brown/80 dark:text-darkSurface-textMuted flex items-center gap-2">
                  <span className="flex items-center gap-0.5 text-cozy-gold">
                    {getCategoryIcon(habit.category)} {habit.targetValue || 'Daily'}
                  </span>
                  {habit.streak > 0 && (
                    <span className="flex items-center gap-0.5 text-amber-600 dark:text-amber-400 font-medium">
                      <Flame size={10} className="fill-amber-600" /> {habit.streak}d streak
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right side: XP badge & delete */}
            <div className="flex items-center space-x-2">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  habit.isCompleted
                    ? 'bg-cozy-sage/30 text-cozy-sageDark dark:text-cozy-sage'
                    : 'bg-cozy-gold/15 text-cozy-gold'
                }`}
              >
                +{habit.xp} XP
              </span>

              <button
                type="button"
                onClick={() => onDeleteHabit(habit.id)}
                title="Remove habit"
                className="opacity-0 group-hover:opacity-100 text-cozy-brown/40 hover:text-red-500 transition-opacity p-1"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Habit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateHabit}
            className="bg-cozy-ivory dark:bg-darkSurface-card border border-cozy-gold rounded-3xl p-6 max-w-sm w-full shadow-cozy-lg animate-fadeIn"
          >
            <h4 className="font-serif font-bold text-lg text-cozy-forest dark:text-cozy-ivory mb-2">
              Add New Custom Habit
            </h4>

            <div className="space-y-3 mb-4">
              <div>
                <label className="text-xs font-semibold">Habit Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Read 10 Pages of Novel"
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-cozy-gold/40 bg-white dark:bg-darkSurface-bg text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold">Category</label>
                <select
                  value={newHabitCategory}
                  onChange={(e) => setNewHabitCategory(e.target.value as HabitItem['category'])}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-cozy-gold/40 bg-white dark:bg-darkSurface-bg text-xs"
                >
                  <option value="mindset">Mindset & Prayer</option>
                  <option value="fitness">Fitness & Health</option>
                  <option value="lifestyle">Lifestyle & Reading</option>
                  <option value="discipline">Discipline & Screen Time</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold">Target / Unit</label>
                  <input
                    type="text"
                    placeholder="e.g. 30 mins"
                    value={newHabitTarget}
                    onChange={(e) => setNewHabitTarget(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-cozy-gold/40 bg-white dark:bg-darkSurface-bg text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold">XP Reward</label>
                  <input
                    type="number"
                    value={newHabitXp}
                    onChange={(e) => setNewHabitXp(parseInt(e.target.value, 10) || 10)}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-cozy-gold/40 bg-white dark:bg-darkSurface-bg text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-cozy-brown dark:text-darkSurface-textMuted"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-cozy-forest hover:bg-cozy-forestDark text-white px-5 py-2 rounded-xl text-xs font-semibold font-serif shadow-sm"
              >
                Create Habit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
