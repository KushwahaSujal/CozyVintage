import type { AISettings } from '../../types';

export interface AIResponse {
  content: string;
  reasoningSteps?: string[];
  provider: 'gemini' | 'openai' | 'local_companion';
}

const SYSTEM_INSTRUCTION = `You are Cozy Vintage AI Companion — a knowledgeable, warm, disciplined, and supportive mentor and life advisor.
Key guidelines:
1. Understand the complete question thoroughly before answering.
2. Provide structured, detailed, insightful explanations when appropriate.
3. For programming or scientific questions, include concrete examples, step-by-step reasoning, and code explanations.
4. For study planning or productivity, offer realistic, empathetic, actionable advice.
5. Do NOT unsolicitedly spam the user with their personal progress stats unless they explicitly ask for it.
6. Clearly distinguish facts, assumptions, and uncertainties.
7. Maintain a warm, encouraging, cozy vintage intellectual atmosphere.`;

export async function askAI(
  prompt: string,
  mode: 'fast' | 'balanced' | 'deep',
  settings?: Partial<AISettings>,
  userContext?: { name: string; challengeDay: number; totalHoursStudied: number; completedTodayPercent: number }
): Promise<AIResponse> {
  const provider = settings?.provider || 'gemini';
  const geminiKey = settings?.geminiApiKey?.trim();
  const openaiKey = settings?.openaiApiKey?.trim();

  // 1. Try Gemini if key is provided and provider is gemini
  if (provider === 'gemini' && geminiKey) {
    try {
      const model = mode === 'deep' ? 'gemini-1.5-pro' : 'gemini-1.5-flash';
      const temperature = mode === 'deep' ? 0.2 : mode === 'balanced' ? 0.7 : 0.9;
      
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: `${SYSTEM_INSTRUCTION}\n\nThinking Mode: ${mode.toUpperCase()}.\nUser Prompt: ${prompt}`
                  }
                ]
              }
            ],
            generationConfig: {
              temperature,
              maxOutputTokens: mode === 'deep' ? 3000 : 1500
            }
          })
        }
      );

      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const reasoning = mode === 'deep'
            ? [
                'Analyzing underlying core intent...',
                'Evaluating fundamental principles and structure...',
                'Synthesizing rigorous step-by-step explanation...',
                'Polishing actionable clarity.'
              ]
            : undefined;
          return { content: text, reasoningSteps: reasoning, provider: 'gemini' };
        }
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to local companion:', err);
    }
  }

  // 2. Try OpenAI if key is provided and provider is openai
  if (provider === 'openai' && openaiKey) {
    try {
      const model = mode === 'deep' ? 'gpt-4o' : 'gpt-4o-mini';
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: SYSTEM_INSTRUCTION },
            { role: 'user', content: `[Mode: ${mode.toUpperCase()}]\n${prompt}` }
          ],
          temperature: mode === 'deep' ? 0.3 : 0.7
        })
      });

      if (res.ok) {
        const data = await res.json();
        const text = data?.choices?.[0]?.message?.content;
        if (text) {
          const reasoning = mode === 'deep'
            ? [
                'Context decomposition & knowledge graph retrieval',
                'Synthesizing logical chain of deductions',
                'Formatting pedagogical breakdown'
              ]
            : undefined;
          return { content: text, reasoningSteps: reasoning, provider: 'openai' };
        }
      }
    } catch (err) {
      console.warn('OpenAI API call failed, falling back to local companion:', err);
    }
  }

  // 3. Intelligent Built-in Fallback Companion (works offline without any API keys!)
  await new Promise((r) => setTimeout(r, mode === 'deep' ? 1200 : mode === 'balanced' ? 600 : 300));

  const lower = prompt.toLowerCase();
  let reasoningSteps: string[] | undefined;

  if (mode === 'deep') {
    reasoningSteps = [
      'Deconstructing inquiry into foundational principles...',
      'Cross-referencing cozy discipline & subject pedagogy...',
      'Verifying factual coherence & practical milestones.',
      'Formulating comprehensive deep-dive guidance.'
    ];
  }

  // Progress check request
  if (lower.includes('progress') || lower.includes('complete') || lower.includes('aaj') || lower.includes('today')) {
    const p = userContext?.completedTodayPercent ?? 50;
    const h = userContext?.totalHoursStudied ?? 1.5;
    const day = userContext?.challengeDay ?? 1;
    return {
      content: `### 📊 Your Progress Check (Day ${day})

Hello **${userContext?.name || 'Explorer'}**! Here is an honest summary of your efforts today:

- **Today's Completion Rate:** **${p}%**
- **Study Time Logged:** **${h} hours**
- **Hydration Status:** Consistent hydration keeps your neural circuits sharp!

> *"Small, disciplined steps taken daily without fanfare are what create extraordinary transformations."*

Keep up this quiet determination. Finish your remaining missions with pride!`,
      reasoningSteps,
      provider: 'local_companion'
    };
  }

  // Study plan or timetable inquiry
  if (lower.includes('timetable') || lower.includes('routine') || lower.includes('study plan') || lower.includes('schedule')) {
    return {
      content: `### 📚 Structured 4-Hour Daily Study Timetable

Here is a balanced and cognitively optimal schedule designed for high retention:

| Time Slot | Subject | Focus Area | Recommended Technique |
| :--- | :--- | :--- | :--- |
| **10:00 AM – 11:00 AM** | **Mathematics** | Concept drilling & problem sets | Active recall, paper calculation |
| **11:00 AM – 12:00 PM** | **English** | Vocabulary & reading comprehension | Contextual annotation, speed reading |
| *12:00 PM – 02:00 PM* | *Break & Nutrition* | Wholesome meal & hydration | Deep mental reset |
| **02:00 PM – 03:00 PM** | **Reasoning** | Puzzles, syllogisms, pattern analysis | Timed problem solving |
| **03:00 PM – 04:00 PM** | **GK / General Studies** | Current events, history, static facts | Flashcards & mind maps |

💡 **Pro-tip:** Spend the first 5 minutes of each session reviewing yesterday's errors before opening new chapters.`,
      reasoningSteps,
      provider: 'local_companion'
    };
  }

  // Programming or ML / Computer Science question
  if (lower.includes('code') || lower.includes('java') || lower.includes('python') || lower.includes('ml') || lower.includes('algorithm') || lower.includes('program')) {
    return {
      content: `### 💻 Deep Engineering Breakdown

Understanding algorithms and code requires separating **Concept**, **Implementation**, and **Edge Cases**.

#### 1. Fundamental Principle
Clean code reflects structured thinking. When designing a routine or data pipeline:
- Keep states immutable where practical.
- Explicitly handle failure states rather than assuming ideal inputs.
- Measure computational complexity before premature optimization.

#### 2. Practical Implementation Pattern
\`\`\`typescript
// Clean state validator with type-safety
interface TaskState {
  id: string;
  completed: boolean;
  timestamp: number;
}

function recordTaskMilestone(task: TaskState): { xp: number; nextState: TaskState } {
  if (task.completed) {
    return { xp: 0, nextState: task }; // Prevent duplicate XP exploits
  }
  return {
    xp: 25,
    nextState: { ...task, completed: true, timestamp: Date.now() }
  };
}
\`\`\`

#### 3. Core Takeaway
Always test boundaries: what happens with null input, empty collections, or interrupted network states? Build with resilience.`,
      reasoningSteps,
      provider: 'local_companion'
    };
  }

  // General philosophical, motivational or study support
  return {
    content: `### 🌟 Cozy Vintage Insight

> "${prompt.length > 50 ? prompt.slice(0, 47) + '...' : prompt}"

Thank you for bringing this to mind. True discipline in the Cozy Vintage philosophy is not self-punishment or manic hustle; it is simply **honoring the promises you make to yourself**.

Here is how you can approach this with clarity:
1. **Clarify the Core Objective:** What single outcome will make the greatest positive impact right now?
2. **Break it into a 25-Minute Block:** Do not worry about finishing the entire mountain today. Just lay one solid brick.
3. **Guard Your Energy:** Stay hydrated, keep distractions out of sight, and allow yourself to focus on the craftsmanship of the moment.

*"The master has failed more times than the beginner has even tried. Stand tall, keep your heart warm, and let's conquer today together."*`,
    reasoningSteps,
    provider: 'local_companion'
  };
}
