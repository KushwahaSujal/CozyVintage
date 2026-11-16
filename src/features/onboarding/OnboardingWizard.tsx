import React, { useState } from 'react';
import { CozyMascot } from '../../components/mascot/CozyMascot';
import { sounds } from '../../services/audio/soundEffects';
import { haptic } from '../../services/haptic/hapticFeedback';
import { Sparkles, ArrowRight, Check, Heart, Shield } from 'lucide-react';
import type { UserProfile, ChallengeCommitment } from '../../types';

interface OnboardingWizardProps {
  onComplete: (user: UserProfile, challenge: ChallengeCommitment) => void;
}

const INTEREST_TAGS = [
  '💻 Coding & Tech',
  '🌸 Anime & Manga',
  '📜 Ancient Mythology',
  '🏋️ Fitness & Gym',
  '📚 Book Reading',
  '🧠 Reasoning Puzzles',
  '🎯 Civil / Gov Exams',
  '🎮 Casual Gaming',
  '🌱 Self Discipline',
  '🧘 Meditation & Prayer',
];

const GOAL_TAGS = [
  'Crack 4 Hours Daily Study',
  'Drink 3 Litres Water Daily',
  'Quit Mindless Social Media',
  'Build Athletic Fitness',
  'Develop Calm Mindset',
  'Build 120-Day Streak',
];

const AVATAR_OPTIONS = ['🌿', '🦊', '🦉', '🧙‍♂️', '⚔️', '✨', '📖', '🌟'];

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(1);

  // Step 1: About You
  const [name, setName] = useState<string>('');
  const [avatar, setAvatar] = useState<string>('🌿');
  const [dob, setDob] = useState<string>('');

  // Step 2: Interests
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    '💻 Coding & Tech',
    '📜 Ancient Mythology',
    '🌱 Self Discipline',
  ]);

  // Step 3: Background
  const [qualification, setQualification] = useState<string>('Graduate');
  const [currentEducation, setCurrentEducation] = useState<string>('Exam Prep & Self-study');

  // Step 4: Goals
  const [selectedGoals, setSelectedGoals] = useState<string[]>([
    'Crack 4 Hours Daily Study',
    'Drink 3 Litres Water Daily',
    'Build 120-Day Streak',
  ]);

  // Step 5: Challenge Selection
  const [challengeDays, setChallengeDays] = useState<number>(120);
  const [customDays, setCustomDays] = useState<string>('90');
  const [discoverySource, setDiscoverySource] = useState<string>('Friend');

  // Auto-calculate age from DOB
  const calculateAge = (dobString: string): number => {
    if (!dobString) return 21;
    const diffMs = Date.now() - new Date(dobString).getTime();
    const ageDate = new Date(diffMs);
    const calculated = Math.abs(ageDate.getUTCFullYear() - 1970);
    return isNaN(calculated) ? 21 : calculated;
  };

  const handleNext = () => {
    sounds.playClick();
    haptic.light();
    if (step < 5) {
      setStep(step + 1);
    } else {
      finishOnboarding();
    }
  };

  const finishOnboarding = () => {
    sounds.playFanfare();
    haptic.celebrate();

    const duration = challengeDays === 0 ? parseInt(customDays, 10) || 45 : challengeDays;
    const profile: UserProfile = {
      name: name.trim() || 'Explorer Deep',
      avatarId: avatar,
      dob,
      age: calculateAge(dob),
      interests: selectedInterests,
      highestQualification: qualification,
      currentEducation,
      goals: selectedGoals,
      discoverySource,
      createdAt: new Date().toISOString(),
      biometricLockEnabled: false,
      soundEnabled: true,
      vibrationEnabled: true,
      theme: 'vintage',
    };

    const commitment: ChallengeCommitment = {
      id: `chal_${Date.now()}`,
      title:
        duration === 30
          ? 'The Beginning'
          : duration === 60
          ? 'Build Momentum'
          : duration === 120
          ? 'Complete Transformation'
          : 'Personal Journey',
      durationDays: duration,
      startDate: new Date().toISOString().split('T')[0],
      currentDay: 1,
      status: 'active',
    };

    onComplete(profile, commitment);
  };

  const toggleInterest = (item: string) => {
    sounds.playClick();
    if (selectedInterests.includes(item)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== item));
    } else {
      setSelectedInterests([...selectedInterests, item]);
    }
  };

  const toggleGoal = (item: string) => {
    sounds.playClick();
    if (selectedGoals.includes(item)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== item));
    } else {
      setSelectedGoals([...selectedGoals, item]);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F0E5] dark:bg-[#141C16] text-[#496354] dark:text-[#F2EDE4] flex flex-col justify-between p-5 max-w-lg mx-auto">
      {/* Top Header & Step Indicator */}
      <div>
        <div className="flex items-center justify-between mb-4 pt-2">
          <div className="flex items-center space-x-2">
            <span className="text-xl">✨</span>
            <span className="font-serif font-bold text-lg tracking-wide text-cozy-forest dark:text-cozy-ivory">
              Cozy Vintage
            </span>
          </div>
          <span className="text-xs font-serif italic text-cozy-brown/80 dark:text-darkSurface-textMuted bg-cozy-parchment dark:bg-darkSurface-card px-2.5 py-1 rounded-full border border-cozy-gold/30">
            Step {step} of 5
          </span>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full bg-cozy-parchmentDark/40 dark:bg-darkSurface-border h-1.5 rounded-full overflow-hidden mb-6">
          <div
            className="bg-cozy-sage dark:bg-cozy-sageLight h-full rounded-full transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Step Contents */}
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-center my-2">
              <CozyMascot mood="warm_smile" size="md" showDialogue customDialogue="Namaste! What shall I call you?" />
            </div>

            <div className="text-center">
              <h2 className="font-serif text-2xl font-bold text-cozy-forest dark:text-cozy-ivory">
                Welcome to Cozy Vintage
              </h2>
              <p className="text-xs text-cozy-brown dark:text-darkSurface-textMuted mt-1">
                Your quiet sanctuary for personal discipline & growth.
              </p>
            </div>

            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-cozy-forestDark dark:text-cozy-ivory uppercase tracking-wider">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Deep"
                className="w-full px-4 py-3 rounded-xl border border-cozy-gold/40 dark:border-darkSurface-border bg-cozy-ivory dark:bg-darkSurface-card focus:outline-none focus:ring-2 focus:ring-cozy-sage text-sm"
              />
            </div>

            {/* Avatar Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-cozy-forestDark dark:text-cozy-ivory uppercase tracking-wider">
                Choose Your Companion Sigil
              </label>
              <div className="grid grid-cols-4 gap-2">
                {AVATAR_OPTIONS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => {
                      setAvatar(av);
                      sounds.playClick();
                    }}
                    className={`text-2xl p-2.5 rounded-xl border transition-all ${
                      avatar === av
                        ? 'border-cozy-sage bg-cozy-sage/20 dark:bg-cozy-sage/30 scale-105 shadow-sm'
                        : 'border-cozy-parchmentDark dark:border-darkSurface-border bg-cozy-ivory dark:bg-darkSurface-card'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            {/* Date of Birth */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-cozy-forestDark dark:text-cozy-ivory uppercase tracking-wider">
                  Date of Birth (Optional)
                </label>
                {dob && (
                  <span className="text-[11px] text-cozy-sageDark font-semibold">
                    Age: {calculateAge(dob)} years
                  </span>
                )}
              </div>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-cozy-gold/40 dark:border-darkSurface-border bg-cozy-ivory dark:bg-darkSurface-card text-xs focus:outline-none focus:ring-2 focus:ring-cozy-sage"
              />
              <p className="text-[10px] text-cozy-brown/80 dark:text-darkSurface-textMuted flex items-center gap-1">
                <Shield size={11} /> Kept strictly offline on your device.
              </p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="text-center">
              <h2 className="font-serif text-2xl font-bold text-cozy-forest dark:text-cozy-ivory">
                What sparks your curiosity?
              </h2>
              <p className="text-xs text-cozy-brown dark:text-darkSurface-textMuted mt-1">
                Select your core interests to personalize quotes & wisdom reminders.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {INTEREST_TAGS.map((tag) => {
                const isSelected = selectedInterests.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleInterest(tag)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-cozy-forest dark:bg-cozy-sage text-white border-cozy-forest dark:border-cozy-sage shadow-sm scale-102'
                        : 'bg-cozy-ivory dark:bg-darkSurface-card text-cozy-forestDark dark:text-darkSurface-text border-cozy-gold/40 dark:border-darkSurface-border'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="text-center">
              <h2 className="font-serif text-2xl font-bold text-cozy-forest dark:text-cozy-ivory">
                Your Academic & Learning Background
              </h2>
              <p className="text-xs text-cozy-brown dark:text-darkSurface-textMuted mt-1">
                Helps tailor the 4-subject study planner to your needs.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-cozy-forestDark dark:text-cozy-ivory">
                  Highest Qualification
                </label>
                <select
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-cozy-gold/40 dark:border-darkSurface-border bg-cozy-ivory dark:bg-darkSurface-card text-xs focus:ring-2 focus:ring-cozy-sage"
                >
                  <option value="High School / 12th">High School / 12th</option>
                  <option value="Undergraduate">Undergraduate Degree (B.Sc / B.Tech / B.Com / BA)</option>
                  <option value="Graduate">Post Graduate / Master's</option>
                  <option value="Professional">Working Professional / Self-taught</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-cozy-forestDark dark:text-cozy-ivory">
                  Current Educational Focus
                </label>
                <input
                  type="text"
                  value={currentEducation}
                  onChange={(e) => setCurrentEducation(e.target.value)}
                  placeholder="e.g. Competitive Exams, Maths & Coding"
                  className="w-full px-4 py-2.5 rounded-xl border border-cozy-gold/40 dark:border-darkSurface-border bg-cozy-ivory dark:bg-darkSurface-card text-xs focus:ring-2 focus:ring-cozy-sage"
                />
              </div>

              <div className="p-3 bg-cozy-parchment/60 dark:bg-darkSurface-card/60 border border-cozy-gold/30 rounded-xl text-xs text-cozy-forest dark:text-darkSurface-text">
                💡 <strong>Pre-configured 4-Subject Routine:</strong>
                <ul className="list-disc list-inside mt-1.5 space-y-0.5 text-[11px] opacity-90">
                  <li>Mathematics (1 Hour — 10:00 AM)</li>
                  <li>English Language (1 Hour — 11:00 AM)</li>
                  <li>Logical Reasoning (1 Hour — 2:00 PM)</li>
                  <li>General Studies / GK (1 Hour — 3:00 PM)</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="text-center">
              <h2 className="font-serif text-2xl font-bold text-cozy-forest dark:text-cozy-ivory">
                What are your main ambitions?
              </h2>
              <p className="text-xs text-cozy-brown dark:text-darkSurface-textMuted mt-1">
                Select the goals you want to conquer during this challenge.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              {GOAL_TAGS.map((goal) => {
                const isSelected = selectedGoals.includes(goal);
                return (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => toggleGoal(goal)}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between text-xs font-medium transition-all ${
                      isSelected
                        ? 'border-cozy-sage bg-cozy-sage/15 dark:bg-cozy-sage/20 font-semibold'
                        : 'border-cozy-parchmentDark dark:border-darkSurface-border bg-cozy-ivory dark:bg-darkSurface-card'
                    }`}
                  >
                    <span>{goal}</span>
                    {isSelected && <Check size={16} className="text-cozy-forest dark:text-cozy-sage" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="text-center">
              <h2 className="font-serif text-2xl font-bold text-cozy-forest dark:text-cozy-ivory">
                Choose Your Commitment
              </h2>
              <p className="text-xs text-cozy-brown dark:text-darkSurface-textMuted mt-1">
                Select the duration of your transformational journey.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                { days: 30, title: 'The Beginning', sub: 'Popular for habit building' },
                { days: 60, title: 'Build Momentum', sub: 'Solidify your lifestyle' },
                { days: 120, title: 'Transformation', sub: 'Mastery & complete report', badge: '⭐ Recommended' },
                { days: 0, title: 'Custom Target', sub: 'Choose your own duration' },
              ].map((c) => (
                <button
                  key={c.days}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setChallengeDays(c.days);
                  }}
                  className={`relative p-3.5 rounded-xl border text-left transition-all ${
                    challengeDays === c.days
                      ? 'border-cozy-gold bg-cozy-parchment dark:bg-darkSurface-card ring-2 ring-cozy-gold/50 shadow-cozy'
                      : 'border-cozy-parchmentDark dark:border-darkSurface-border bg-cozy-ivory dark:bg-darkSurface-card opacity-80'
                  }`}
                >
                  {c.badge && (
                    <span className="absolute -top-2 right-2 bg-cozy-gold text-white text-[9px] px-2 py-0.5 rounded-full font-bold">
                      {c.badge}
                    </span>
                  )}
                  <div className="font-serif font-bold text-xl text-cozy-forest dark:text-cozy-ivory">
                    {c.days === 0 ? 'Custom' : `${c.days} Days`}
                  </div>
                  <div className="text-xs font-semibold mt-0.5 text-cozy-forestDark dark:text-darkSurface-text">
                    {c.title}
                  </div>
                  <div className="text-[10px] text-cozy-brown dark:text-darkSurface-textMuted mt-1 leading-tight">
                    {c.sub}
                  </div>
                </button>
              ))}
            </div>

            {challengeDays === 0 && (
              <div className="space-y-1">
                <label className="text-xs font-semibold">Custom Number of Days</label>
                <input
                  type="number"
                  value={customDays}
                  onChange={(e) => setCustomDays(e.target.value)}
                  placeholder="e.g. 90"
                  className="w-full px-4 py-2.5 rounded-xl border border-cozy-gold/40 bg-cozy-ivory dark:bg-darkSurface-card text-xs"
                />
              </div>
            )}

            {/* Optional discovery source */}
            <div className="pt-2">
              <label className="text-[11px] text-cozy-brown dark:text-darkSurface-textMuted">
                Where did you discover Cozy Vintage?
              </label>
              <select
                value={discoverySource}
                onChange={(e) => setDiscoverySource(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-xl border border-cozy-gold/30 bg-cozy-ivory dark:bg-darkSurface-card text-xs"
              >
                <option value="Friend">Recommended by a Friend</option>
                <option value="Instagram">Instagram</option>
                <option value="YouTube">YouTube</option>
                <option value="Google">Google Search</option>
                <option value="Other">Other Community</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Button Actions */}
      <div className="pt-6">
        <button
          type="button"
          onClick={handleNext}
          className="w-full bg-cozy-forest hover:bg-cozy-forestDark text-cozy-ivory font-serif font-semibold py-3.5 px-6 rounded-2xl shadow-cozy-lg flex items-center justify-center space-x-2 transition-all active:scale-98"
        >
          <span>{step === 5 ? "Begin Today's Journey" : 'Continue'}</span>
          {step === 5 ? <Sparkles size={18} /> : <ArrowRight size={18} />}
        </button>
      </div>
    </div>
  );
};
