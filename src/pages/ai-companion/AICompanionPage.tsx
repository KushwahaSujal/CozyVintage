import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Search,
  Send,
  Volume2,
  Copy,
  RotateCcw,
  Key,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  MessageSquare,
  Bot,
  Brain,
  Zap,
  Scale,
  ShieldCheck,
  Download,
} from 'lucide-react';
import { askAI } from '../../services/ai/aiService';
import { searchImages } from '../../services/image-search/imageSearchService';
import { speechService } from '../../services/speech/speechService';
import { sounds } from '../../services/audio/soundEffects';
import { haptic } from '../../services/haptic/hapticFeedback';
import type { ChatMessage, ImageSearchResult, AISettings } from '../../types';

interface AICompanionPageProps {
  userName: string;
  challengeDay: number;
  totalStudyMinutes: number;
  completionRate: number;
}

export const AICompanionPage: React.FC<AICompanionPageProps> = ({
  userName,
  challengeDay,
  totalStudyMinutes,
  completionRate,
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'images'>('chat');
  const [thinkingMode, setThinkingMode] = useState<'fast' | 'balanced' | 'deep'>('balanced');
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [expandedReasoningId, setExpandedReasoningId] = useState<string | null>(null);

  // Settings Modal
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [aiSettings, setAiSettings] = useState<AISettings>(() => {
    const saved = localStorage.getItem('cozy_vintage_ai_settings');
    return saved
      ? JSON.parse(saved)
      : {
          provider: 'gemini',
          geminiApiKey: '',
          openaiApiKey: '',
          defaultMode: 'balanced',
          selectedModel: 'gemini-1.5-flash',
        };
  });

  // Chat Messages
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_msg',
      role: 'assistant',
      content: `Namaste **${userName}**! I am your Cozy Vintage Companion. 

I can explain complex concepts step-by-step, review programming algorithms, help you craft a 4-hour study strategy, or discuss ancient philosophies.

*(You can ask freely in Fast, Balanced, or Deep Thinking mode. When you're ready, you can also link your personal Google Gemini or OpenAI API key in the top settings!)*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      thinkingMode: 'balanced',
      provider: 'local_companion',
    },
  ]);

  // Image Search State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [imageResults, setImageResults] = useState<ImageSearchResult[]>([]);
  const [isSearchingImages, setIsSearchingImages] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<ImageSearchResult | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initial load of sample images
  useEffect(() => {
    searchImages('').then(setImageResults);
  }, []);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const prompt = inputPrompt.trim();
    if (!prompt || isLoading) return;

    sounds.playClick();
    haptic.light();

    const userMsg: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      role: 'user',
      content: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      thinkingMode,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const resp = await askAI(
        prompt,
        thinkingMode,
        aiSettings,
        {
          name: userName,
          challengeDay,
          totalHoursStudied: parseFloat((totalStudyMinutes / 60).toFixed(1)),
          completedTodayPercent: completionRate,
        }
      );

      const assistantMsg: ChatMessage = {
        id: `msg_a_${Date.now()}`,
        role: 'assistant',
        content: resp.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        thinkingMode,
        reasoningSteps: resp.reasoningSteps,
        provider: resp.provider,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      sounds.playClick();
    } catch {
      // Error fallback
      setMessages((prev) => [
        ...prev,
        {
          id: `msg_err_${Date.now()}`,
          role: 'assistant',
          content: 'I encountered a connection interruption. Please try again or switch thinking mode.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = (newSettings: AISettings) => {
    setAiSettings(newSettings);
    localStorage.setItem('cozy_vintage_ai_settings', JSON.stringify(newSettings));
    setShowSettingsModal(false);
    sounds.playFanfare();
  };

  const handleImageSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    sounds.playClick();
    setIsSearchingImages(true);
    const results = await searchImages(searchQuery);
    setImageResults(results);
    setIsSearchingImages(false);
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-lg mx-auto flex flex-col h-[90vh]">
      {/* Header & Subtabs */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-cozy-gold/20 flex items-center justify-center text-cozy-gold">
            <Sparkles size={18} />
          </div>
          <div>
            <h2 className="font-serif font-bold text-lg text-cozy-forest dark:text-cozy-ivory leading-tight">
              AI Companion
            </h2>
            <p className="text-[10px] text-cozy-brown dark:text-darkSurface-textMuted">
              {aiSettings.provider === 'gemini' && aiSettings.geminiApiKey
                ? 'Connected to Gemini API'
                : aiSettings.provider === 'openai' && aiSettings.openaiApiKey
                ? 'Connected to OpenAI'
                : 'Cozy Vintage Intellect Engine'}
            </p>
          </div>
        </div>

        {/* Settings / API Key Button */}
        <button
          type="button"
          onClick={() => setShowSettingsModal(true)}
          className="text-xs bg-cozy-parchment dark:bg-darkSurface-card border border-cozy-gold/30 hover:border-cozy-gold px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 text-cozy-forestDark dark:text-cozy-ivory"
        >
          <Key size={13} className="text-cozy-gold" />
          <span>Config AI</span>
        </button>
      </div>

      {/* Segment Control: Chat vs Image Search */}
      <div className="flex p-1 bg-cozy-parchment/70 dark:bg-darkSurface-card rounded-2xl border border-cozy-gold/30 mb-3">
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            setActiveTab('chat');
          }}
          className={`flex-1 py-1.5 rounded-xl text-xs font-serif font-semibold flex items-center justify-center space-x-1.5 transition-all ${
            activeTab === 'chat'
              ? 'bg-cozy-forest text-white shadow-sm'
              : 'text-cozy-brown dark:text-darkSurface-textMuted'
          }`}
        >
          <MessageSquare size={13} />
          <span>Study Mentor Chat</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            setActiveTab('images');
          }}
          className={`flex-1 py-1.5 rounded-xl text-xs font-serif font-semibold flex items-center justify-center space-x-1.5 transition-all ${
            activeTab === 'images'
              ? 'bg-cozy-forest text-white shadow-sm'
              : 'text-cozy-brown dark:text-darkSurface-textMuted'
          }`}
        >
          <ImageIcon size={13} />
          <span>Visual & Diagram Discovery</span>
        </button>
      </div>

      {/* 1. CHAT MENTOR SECTION */}
      {activeTab === 'chat' && (
        <div className="flex-1 flex flex-col min-h-0 bg-cozy-parchment/40 dark:bg-darkSurface-card/50 border border-cozy-gold/30 rounded-3xl p-3 shadow-cozy overflow-hidden">
          {/* Thinking Mode Switcher Bar */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-cozy-gold/20 text-xs">
            <span className="text-[11px] text-cozy-brown dark:text-darkSurface-textMuted font-medium">
              Thinking Depth:
            </span>
            <div className="flex space-x-1">
              {[
                { id: 'fast' as const, label: 'Fast', icon: Zap },
                { id: 'balanced' as const, label: 'Balanced', icon: Scale },
                { id: 'deep' as const, label: 'Deep Thinking', icon: Brain },
              ].map((m) => {
                const isActive = thinkingMode === m.id;
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setThinkingMode(m.id);
                    }}
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-semibold flex items-center space-x-1 transition-all ${
                      isActive
                        ? 'bg-cozy-forest text-white shadow-sm'
                        : 'bg-cozy-ivory dark:bg-darkSurface-bg text-cozy-brown dark:text-darkSurface-textMuted border border-cozy-gold/20'
                    }`}
                  >
                    <Icon size={11} />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto space-y-3 p-1 text-xs">
            {messages.map((msg) => {
              const isAssistant = msg.role === 'assistant';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[88%] p-3.5 rounded-2xl relative shadow-sm leading-relaxed ${
                      isAssistant
                        ? 'bg-cozy-ivory dark:bg-darkSurface-card text-cozy-forestDark dark:text-cozy-ivory border border-cozy-gold/30 rounded-tl-sm'
                        : 'bg-cozy-forest text-white rounded-tr-sm'
                    }`}
                  >
                    {/* Deep Reasoning Steps Dropdown */}
                    {isAssistant && msg.reasoningSteps && msg.reasoningSteps.length > 0 && (
                      <div className="mb-2.5 pb-2 border-b border-cozy-gold/20">
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedReasoningId(
                              expandedReasoningId === msg.id ? null : msg.id
                            )
                          }
                          className="flex items-center justify-between w-full text-[10px] text-cozy-gold font-serif font-bold uppercase tracking-wider"
                        >
                          <span className="flex items-center gap-1">
                            <Brain size={12} /> Thinking Process ({msg.reasoningSteps.length} steps)
                          </span>
                          {expandedReasoningId === msg.id ? (
                            <ChevronUp size={12} />
                          ) : (
                            <ChevronDown size={12} />
                          )}
                        </button>

                        {expandedReasoningId === msg.id && (
                          <div className="mt-2 space-y-1 pl-2 border-l-2 border-cozy-gold/40 text-[10px] text-cozy-brown dark:text-darkSurface-textMuted font-mono">
                            {msg.reasoningSteps.map((step, idx) => (
                              <div key={idx}>• {step}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Markdown / Text formatted content */}
                    <div className="whitespace-pre-wrap font-sans text-xs">
                      {msg.content}
                    </div>

                    {/* Audio read-aloud and copy buttons */}
                    {isAssistant && (
                      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-cozy-gold/15 text-[10px] text-cozy-brown dark:text-darkSurface-textMuted">
                        <span>{msg.timestamp}</span>
                        <div className="flex items-center space-x-1.5">
                          <button
                            type="button"
                            onClick={() => speechService.speak(msg.content)}
                            title="Read aloud"
                            className="p-1 hover:text-cozy-forest"
                          >
                            <Volume2 size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => navigator.clipboard.writeText(msg.content)}
                            title="Copy response"
                            className="p-1 hover:text-cozy-forest"
                          >
                            <Copy size={12} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center space-x-2 text-xs text-cozy-brown dark:text-darkSurface-textMuted p-2 animate-pulse">
                <Bot size={15} className="text-cozy-gold" />
                <span>Thinking carefully and synthesizing structured guidance...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSendMessage} className="mt-2 pt-2 border-t border-cozy-gold/20 flex items-center space-x-2">
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Ask anything: Maths proof, ML concepts, 4-hour timetable..."
              className="flex-1 px-3.5 py-2.5 rounded-2xl border border-cozy-gold/40 bg-cozy-ivory dark:bg-darkSurface-card text-xs focus:outline-none focus:ring-2 focus:ring-cozy-sage text-cozy-forestDark dark:text-cozy-ivory"
            />
            <button
              type="submit"
              disabled={isLoading || !inputPrompt.trim()}
              className="bg-cozy-forest hover:bg-cozy-forestDark disabled:opacity-50 text-white p-2.5 rounded-2xl shadow-sm transition-transform active:scale-95"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}

      {/* 2. NATURAL LANGUAGE IMAGE SEARCH SECTION */}
      {activeTab === 'images' && (
        <div className="flex-1 flex flex-col min-h-0 bg-cozy-parchment/40 dark:bg-darkSurface-card/50 border border-cozy-gold/30 rounded-3xl p-3 shadow-cozy overflow-hidden">
          {/* Search Form */}
          <form onSubmit={handleImageSearchSubmit} className="flex gap-2 mb-3">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-3 text-cozy-brown" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. human heart diagram, milky way, vintage study room"
                className="w-full pl-9 pr-3 py-2 rounded-2xl border border-cozy-gold/40 bg-cozy-ivory dark:bg-darkSurface-card text-xs focus:ring-2 focus:ring-cozy-sage"
              />
            </div>
            <button
              type="submit"
              className="bg-cozy-forest hover:bg-cozy-forestDark text-white px-4 py-2 rounded-2xl text-xs font-semibold font-serif shadow-sm"
            >
              Search
            </button>
          </form>

          {/* Quick Prompts */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-2 mb-2 text-[10px]">
            {['Human Heart Diagram', 'Milky Way Galaxy', 'Vintage Study Room', 'Cell Mitosis', 'Sacred Geometry'].map(
              (q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => {
                    setSearchQuery(q);
                    searchImages(q).then(setImageResults);
                  }}
                  className="px-2.5 py-1 rounded-xl bg-cozy-ivory dark:bg-darkSurface-card border border-cozy-gold/30 text-cozy-brown dark:text-darkSurface-textMuted whitespace-nowrap hover:border-cozy-gold"
                >
                  {q}
                </button>
              )
            )}
          </div>

          {/* Results Grid */}
          <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-2.5 p-1">
            {imageResults.map((img) => (
              <div
                key={img.id}
                onClick={() => setSelectedImage(img)}
                className="cursor-pointer group relative bg-cozy-ivory dark:bg-darkSurface-card rounded-2xl border border-cozy-gold/30 overflow-hidden shadow-sm hover:shadow-cozy transition-all"
              >
                <div className="h-28 w-full bg-cozy-parchmentDark/30 overflow-hidden">
                  <img
                    src={img.thumbUrl}
                    alt={img.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-2">
                  <div className="text-[11px] font-bold font-serif text-cozy-forestDark dark:text-cozy-ivory truncate">
                    {img.title}
                  </div>
                  <div className="text-[9px] text-cozy-brown dark:text-darkSurface-textMuted flex items-center justify-between mt-0.5">
                    <span className="capitalize">{img.category}</span>
                    <span className="text-cozy-gold">View →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Image Detail Lightbox Modal */}
          {selectedImage && (
            <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-cozy-ivory dark:bg-darkSurface-card border border-cozy-gold rounded-3xl p-5 max-w-md w-full shadow-cozy-lg animate-fadeIn max-h-[90vh] overflow-y-auto">
                <div className="relative rounded-2xl overflow-hidden mb-3 bg-black/10">
                  <img
                    src={selectedImage.url}
                    alt={selectedImage.title}
                    className="w-full max-h-72 object-contain mx-auto"
                  />
                </div>

                <h4 className="font-serif font-bold text-base text-cozy-forest dark:text-cozy-ivory">
                  {selectedImage.title}
                </h4>

                <div className="space-y-1 my-2 text-xs text-cozy-brown dark:text-darkSurface-textMuted">
                  <div>• Source: <strong>{selectedImage.source}</strong></div>
                  <div>• Author: {selectedImage.author}</div>
                  <div>• License: {selectedImage.license}</div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-cozy-gold/20">
                  <a
                    href={selectedImage.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-cozy-gold font-semibold flex items-center gap-1"
                  >
                    <ExternalLink size={13} /> Open High-Res
                  </a>

                  <button
                    type="button"
                    onClick={() => setSelectedImage(null)}
                    className="bg-cozy-forest text-white px-4 py-1.5 rounded-xl text-xs font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* AI Settings / BYOK Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-cozy-ivory dark:bg-darkSurface-card border border-cozy-gold rounded-3xl p-6 max-w-sm w-full shadow-cozy-lg animate-fadeIn">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-serif font-bold text-lg text-cozy-forest dark:text-cozy-ivory">
                Configure AI Companion
              </h4>
              <ShieldCheck size={20} className="text-cozy-sage" />
            </div>

            <p className="text-xs text-cozy-brown dark:text-darkSurface-textMuted mb-4">
              Bring your own free API key (stored safely in your local browser only) or use our built-in offline mentor.
            </p>

            <div className="space-y-3 mb-4">
              <div>
                <label className="text-xs font-semibold">Active AI Provider</label>
                <select
                  value={aiSettings.provider}
                  onChange={(e) =>
                    setAiSettings({
                      ...aiSettings,
                      provider: e.target.value as AISettings['provider'],
                    })
                  }
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-cozy-gold/40 bg-white dark:bg-darkSurface-bg text-xs"
                >
                  <option value="gemini">Google Gemini (Recommended)</option>
                  <option value="openai">OpenAI (ChatGPT / GPT-4o)</option>
                </select>
              </div>

              {aiSettings.provider === 'gemini' ? (
                <div>
                  <label className="text-xs font-semibold">Google Gemini API Key</label>
                  <input
                    type="password"
                    placeholder="AIzaSy..."
                    value={aiSettings.geminiApiKey}
                    onChange={(e) =>
                      setAiSettings({ ...aiSettings, geminiApiKey: e.target.value })
                    }
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-cozy-gold/40 bg-white dark:bg-darkSurface-bg text-xs"
                  />
                  <span className="text-[10px] text-cozy-brown/80 mt-1 block">
                    Get a free key from Google AI Studio (aistudio.google.com).
                  </span>
                </div>
              ) : (
                <div>
                  <label className="text-xs font-semibold">OpenAI API Key</label>
                  <input
                    type="password"
                    placeholder="sk-proj-..."
                    value={aiSettings.openaiApiKey}
                    onChange={(e) =>
                      setAiSettings({ ...aiSettings, openaiApiKey: e.target.value })
                    }
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-cozy-gold/40 bg-white dark:bg-darkSurface-bg text-xs"
                  />
                  <span className="text-[10px] text-cozy-brown/80 mt-1 block">
                    Obtain your API key from platform.openai.com.
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-cozy-gold/20">
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-cozy-brown dark:text-darkSurface-textMuted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSaveSettings(aiSettings)}
                className="bg-cozy-forest hover:bg-cozy-forestDark text-white px-5 py-2 rounded-xl text-xs font-semibold font-serif shadow-sm"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
