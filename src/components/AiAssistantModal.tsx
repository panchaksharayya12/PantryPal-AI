import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  RefreshCw,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Globe,
  Radio
} from 'lucide-react';
import { ChatMessage } from '../types/ai.ts';
import { sendAiChat, getAiStatus } from '../api/client.ts';
import { useLanguage } from '../context/LanguageContext.tsx';
import { voiceRecognizer, speakText } from '../utils/multilingualVoice.ts';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  pantryItems?: string[];
  currentRecipeName?: string;
  isDark?: boolean;
}

const QUICK_PROMPTS_BY_LANG: Record<string, string[]> = {
  kn: [
    'ಮೊಟ್ಟೆ, ಟೊಮೇಟೊ, ಈರುಳ್ಳಿಯಿಂದ ಏನು ಮಾಡಬಹುದು?',
    'ಪನ್ನೀರ್ ಬದಲು ಏನು ಬಳಸಬಹುದು?',
    'ಉಳಿದ ಅನ್ನದಿಂದ 15 ನಿಮಿಷಗಳಲ್ಲಿ ಏನು ಮಾಡಬಹುದು?',
    'ಈ ರೆಸಿಪಿಯನ್ನು ಹೆಚ್ಚು ಆರೋಗ್ಯಕರವಾಗಿ ಹೇಗೆ ಮಾಡುವುದು?',
    'ದಾಲ್ ತಡ್ಕಾ ಮಾಡುವುದು ಹೇಗೆ?'
  ],
  hi: [
    'अंडे, टमाटर और प्याज से क्या बना सकते हैं?',
    'पनीर का क्या विकल्प है?',
    'बचे हुए चावल से 15 मिनट में क्या बनाएं?',
    'इस रेसिपी को और पौष्टिक कैसे बनाएं?',
    'स्वादिष्ट दाल तड़का कैसे बनाएं?'
  ],
  ta: [
    'முட்டை, தக்காளி, வெங்காயம் வைத்து என்ன சமைக்கலாம்?',
    'பன்னீருக்கு மாற்று என்ன?',
    'மீதமுள்ள சாதத்தை வைத்து 15 நிமிட சமையல்',
    'உடலுக்கு ஆரோக்கியமான உணவு யோசனை'
  ],
  te: [
    'గుడ్లు, టమోటా, ఉల్లిపాయలతో ఏమి వండవచ్చు?',
    'పనీర్ బదులుగా ఏమి వాడవచ్చు?',
    'మిగిలిన అన్నంతో 15 నిమిషాల వంటకాలు'
  ],
  ml: [
    'മുട്ട, തക്കാളി, ഉള്ളി എന്നിവ കൊണ്ട് എന്തുണ്ടാക്കാം?',
    'പനീറിന് പകരം എന്ത് ഉപയോഗിക്കാം?',
    '15 മിനിറ്റിൽ തയാറാക്കാവുന്ന വിഭവങ്ങൾ'
  ],
  mr: [
    'अंडी, टोमॅटो आणि कांद्यापासून काय बनवू?',
    'पनीरला पर्याय काय आहे?',
    'उरलेल्या भातापासून १५ मिनिटांत काय बनवायचे?'
  ],
  bn: [
    'ডিম, টমেটো ও পেঁয়াজ দিয়ে কী রান্না করা যায়?',
    'ছানার বদলে কী ব্যবহার করা যায়?',
    '১৫ মিনিটে চটজলদি রান্নার রেসিপি'
  ],
  gu: [
    'ઈંડા, ટામેટા અને ડુંગળીથી શું બનાવી શકાય?',
    'પનીરની જગ્યાએ શું વાપરી શકાય?',
    '૧૫ મિનિટમાં બનતી વાનગી'
  ],
  en: [
    'What can I cook with eggs, tomato, and onion?',
    'What can I substitute for paneer?',
    'Give me a 15-minute dinner idea.',
    'How can I use leftover rice?',
    'How can I make this recipe healthier?'
  ]
};

const WELCOME_MESSAGES: Record<string, string> = {
  kn: `ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ **ಪ್ಯಾಂಟ್ರಿಪಾಲ್ ಎಐ ಅಡುಗೆ ಸಹಾಯಕ** (PantryPal AI).\n\nನಿಮ್ಮ ಅಡುಗೆಮನೆಯಲ್ಲಿರುವ ಸಾಮಗ್ರಿಗಳು, ತರಕಾರಿಗಳು, ಪರ್ಯಾಯ ಪದಾರ್ಥಗಳು ಅಥವಾ 15 ನಿಮಿಷಗಳ ತ್ವರಿತ ಅಡುಗೆ ಬಗ್ಗೆ ಯಾವುದೇ ಪ್ರಶ್ನೆಗಳನ್ನು ಕನ್ನಡದಲ್ಲಿ ಕೇಳಿ ಅಥವಾ ಮಾತನಾಡಿ!`,
  hi: `नमस्ते! मैं आपका **पेंट्रीपाल एआई शेफ असिस्टेंट** हूँ (PantryPal AI).\n\nअपनी रसोई की सामग्री, झटपट रेसिपी, या सामग्री के विकल्प के बारे में मुझसे हिन्दी में कोई भी सवाल पूछें या बोलें!`,
  ta: `வணக்கம்! நான் உங்கள் **PantryPal AI சமையல் உதவியாளர்**.\n\nஉங்கள் சமையலறையில் உள்ள பொருட்கள், மாற்றுகள் அல்லது 15 நிமிட சமையல் யோசனைகள் பற்றி என்னிடம் கேளுங்கள்!`,
  te: `నమస్కారం! నేను మీ **PantryPal AI వంటల సహాయకుడిని**.\n\nమీ వంటగదిలోని పదార్థాలు, 15 నిమిషాల వంటల ఆలోచనల గురించి నన్ను అడగండి!`,
  ml: `നമസ്കാരം! ഞാൻ നിങ്ങളുടെ **PantryPal AI പാചക സഹായി**.\n\nനിങ്ങളുടെ അടുക്കളയിലെ ചേരുവകൾ, 15 മിനിറ്റ് പാചകക്കുറിപ്പുകൾ എന്നിവയെക്കുറിച്ച് ചോദിക്കൂ!`,
  mr: `नमस्कार! मी तुमचा **PantryPal AI स्वयंपाक सहाय्यक** आहे.\n\nतुमच्या स्वयंपाकघरातील साहित्य, जलद पाककृती किंवा पर्यायी साहित्याबद्दल काहीही विचारा!`,
  bn: `নমস্কার! আমি আপনার **PantryPal AI রান্নার সহকারী**।\n\nআপনার রান্নাঘরের উপকরণ, ১৫ মিনিটের রেসিপি বা বিকল্প খাবার সম্পর্কে জিজ্ঞাসা করুন!`,
  gu: `નમસ્તે! હું તમારો **PantryPal AI રસોઈ સહાયક** છું.\n\nતમારી રસોઈની સામગ્રી, ૧૫ મિનિટની રેસિપી વિશે મને પૂછો!`,
  en: `Hello! I am your **PantryPal AI Culinary Assistant**.\n\nAsk me anything about ingredient substitutions, dinner ideas in 15 minutes, healthy swaps, or how to cook with the items currently sitting in your kitchen!`
};

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  pantryItems = [],
  currentRecipeName,
  isDark = true,
}) => {
  const { language, t, currentOption } = useLanguage();

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome',
      sender: 'assistant',
      text: WELCOME_MESSAGES[language] || WELCOME_MESSAGES['en'],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState<{ hasAiKey: boolean; model: string }>({
    hasAiKey: false,
    model: 'gpt-4o-mini'
  });

  // Multilingual Voice Recognition & TTS State
  const [isListening, setIsListening] = useState(false);
  const [spokenTranscript, setSpokenTranscript] = useState('');
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Update welcome message if language changes and chat is fresh
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 'welcome') {
        return [
          {
            id: 'welcome',
            sender: 'assistant',
            text: WELCOME_MESSAGES[language] || WELCOME_MESSAGES['en'],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ];
      }
      return prev;
    });
  }, [language]);

  useEffect(() => {
    if (isOpen) {
      getAiStatus().then(setAiStatus).catch(() => {});
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, spokenTranscript]);

  // Clean up listening and speaking on unmount or close
  useEffect(() => {
    if (!isOpen) {
      if (isListening) {
        voiceRecognizer.stopListening();
        setIsListening(false);
      }
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setCurrentlySpeakingId(null);
    }
  }, [isOpen, isListening]);

  if (!isOpen) return null;

  const quickPrompts = QUICK_PROMPTS_BY_LANG[language] || QUICK_PROMPTS_BY_LANG['en'];

  // Toggle Voice Recognition in the User's Active Indian Language
  const handleToggleVoice = () => {
    if (isListening) {
      voiceRecognizer.stopListening();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    setSpokenTranscript('');

    voiceRecognizer.startListening(
      currentOption.speechCode,
      (transcript, isFinal) => {
        setSpokenTranscript(transcript);
        setInput(transcript);

        if (isFinal) {
          setIsListening(false);
        }
      },
      (error) => {
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );
  };

  // Speak AI message using SpeechSynthesis
  const handleToggleSpeak = (messageId: string, text: string) => {
    if (currentlySpeakingId === messageId) {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setCurrentlySpeakingId(null);
      return;
    }

    setCurrentlySpeakingId(messageId);
    speakText(text, currentOption.speechCode);

    // Reset speaking indicator when synthesis finishes
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const checkEndInterval = setInterval(() => {
        if (!window.speechSynthesis.speaking) {
          setCurrentlySpeakingId(null);
          clearInterval(checkEndInterval);
        }
      }, 300);
    }
  };

  const handleSend = async (messageText: string) => {
    const text = messageText.trim();
    if (!text || isLoading) return;

    if (isListening) {
      voiceRecognizer.stopListening();
      setIsListening(false);
    }

    const userMsg: ChatMessage = {
      id: 'u-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setSpokenTranscript('');
    setIsLoading(true);

    try {
      const result = await sendAiChat(text, {
        pantryItems,
        currentRecipe: currentRecipeName
      });

      const assistantMsg: ChatMessage = {
        id: 'a-' + Date.now(),
        sender: 'assistant',
        text: result.response,
        source: result.source,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          sender: 'assistant',
          text: language === 'kn'
            ? 'ಕ್ಷಮಿಸಿ, ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಸಂಸ್ಕರಿಸುವಾಗ ದೋಷ ಸಂಭವಿಸಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ!'
            : language === 'hi'
            ? 'क्षमा करें, उत्तर प्राप्त करने में समस्या हुई। कृपया पुनः प्रयास करें!'
            : 'Sorry, I encountered an error while processing your culinary question. Please try again!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const renderedLine = parts.map((part, idx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong
              key={idx}
              className={`font-black ${isDark ? 'text-emerald-400' : 'text-[#202820]'}`}
            >
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        return (
          <p key={i} className="pl-4 py-0.5 text-sm leading-relaxed flex items-start gap-1.5">
            <span className="text-emerald-500 font-bold">•</span>
            <span>{renderedLine}</span>
          </p>
        );
      }
      if (line.trim() === '') {
        return <div key={i} className="h-2" />;
      }
      return (
        <p key={i} className="text-sm leading-relaxed">
          {renderedLine}
        </p>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 lg:p-6 animate-fadeIn">
      <div
        className={`w-full max-w-2xl rounded-3xl shadow-2xl border flex flex-col h-[85vh] max-h-[720px] overflow-hidden transition-colors ${
          isDark
            ? 'bg-[#111713] border-[#243328] text-[#F3F4F6]'
            : 'bg-[#FAF8F2] border-[#E8E5DC] text-[#202820]'
        }`}
      >
        {/* Header */}
        <div
          className={`p-4 sm:p-5 border-b flex items-center justify-between ${
            isDark ? 'bg-[#151D17] border-[#243328]' : 'bg-white border-[#E8E5DC]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs ${
                isDark ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30' : 'bg-[#E6F0E6] text-[#315C43]'
              }`}
            >
              <Sparkles className="w-5 h-5 animate-pulse text-emerald-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base tracking-tight">
                  {t('chatTitle', 'PantryPal AI Assistant')}
                </h3>
                {/* Language Badge */}
                <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Globe className="w-3 h-3" />
                  {currentOption.nativeName} ({currentOption.code.toUpperCase()})
                </span>
                <span
                  className={`hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    aiStatus.hasAiKey
                      ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/30'
                      : isDark
                      ? 'bg-white/10 text-[#9CA3AF]'
                      : 'bg-black/5 text-[#737B72]'
                  }`}
                >
                  {aiStatus.hasAiKey ? 'GPT-4o-mini' : 'Chef Engine'}
                </span>
              </div>
              <p className="text-xs text-[#737B72] dark:text-[#9CA3AF]">
                {language === 'kn'
                  ? 'ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ • ರೆಸಿಪಿ, ಸಾಮಗ್ರಿ ಸಲಹೆಗಳು'
                  : language === 'hi'
                  ? 'हिन्दी में बोलें या टाइप करें • रेसिपी और सामग्री समाधान'
                  : 'Speak or type in any Indian language • Recipes & substitutions'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${
              isDark ? 'hover:bg-white/10 text-[#9CA3AF] hover:text-white' : 'hover:bg-black/5 text-[#737B72]'
            }`}
            aria-label="Close Assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            const isCurrentlySpeaking = currentlySpeakingId === m.id;

            return (
              <div
                key={m.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[80%] p-4 rounded-3xl text-sm shadow-sm transition-colors ${
                    isUser
                      ? 'bg-emerald-600 text-white rounded-tr-xs'
                      : isDark
                      ? 'bg-[#18221B] text-[#E5E7EB] border border-[#27382B] rounded-tl-xs'
                      : 'bg-white text-[#202820] border border-[#E8E5DC] rounded-tl-xs'
                  }`}
                >
                  <div className="space-y-1">
                    {formatText(m.text)}
                  </div>

                  <div
                    className={`flex items-center justify-between gap-3 mt-3 pt-2 border-t text-[10px] ${
                      isDark ? 'border-white/10 text-white/50' : 'border-black/5 text-black/40'
                    }`}
                  >
                    {!isUser && (
                      <button
                        type="button"
                        onClick={() => handleToggleSpeak(m.id, m.text)}
                        className={`flex items-center gap-1 px-2 py-0.5 rounded-lg font-bold transition-all ${
                          isCurrentlySpeaking
                            ? 'bg-emerald-500 text-black shadow-xs'
                            : isDark
                            ? 'bg-white/5 hover:bg-white/10 text-emerald-400'
                            : 'bg-black/5 hover:bg-black/10 text-emerald-700'
                        }`}
                        title="Listen to response spoken aloud"
                      >
                        {isCurrentlySpeaking ? (
                          <>
                            <VolumeX className="w-3 h-3 animate-pulse" />
                            <span>Stop Audio</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3" />
                            <span>{t('listenResponse', 'Listen')} ({currentOption.nativeName})</span>
                          </>
                        )}
                      </button>
                    )}

                    <div className="ml-auto flex items-center gap-2">
                      {m.source && (
                        <span className="font-semibold text-emerald-400">
                          {m.source === 'openai' ? '✨ OpenAI' : '⚡ Local Chef'}
                        </span>
                      )}
                      <span>{m.timestamp}</span>
                    </div>
                  </div>
                </div>

                {isUser && (
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-1 border ${
                      isDark
                        ? 'bg-[#18221B] border-[#27382B] text-emerald-400'
                        : 'bg-[#FAF8F2] border-[#E8E5DC] text-[#315C43]'
                    }`}
                  >
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div
                className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-center gap-2 ${
                  isDark
                    ? 'bg-[#18221B] border-[#27382B] text-[#9CA3AF]'
                    : 'bg-white border-[#E8E5DC] text-[#737B72]'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                <span>
                  {language === 'kn'
                    ? 'ಪ್ಯಾಂಟ್ರಿಪಾಲ್ ಉತ್ತರವನ್ನು ಸಿದ್ಧಪಡಿಸುತ್ತಿದೆ...'
                    : language === 'hi'
                    ? 'पेंट्रीपाल उत्तर तैयार कर रहा है...'
                    : 'PantryPal is preparing an answer...'}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div
          className={`px-4 py-2 border-t overflow-x-auto flex gap-1.5 no-scrollbar ${
            isDark ? 'bg-[#141A16]/90 border-[#243328]' : 'bg-white/80 border-[#E8E5DC]'
          }`}
        >
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              disabled={isLoading}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all border ${
                isDark
                  ? 'bg-[#1A241D] hover:bg-emerald-950/80 text-emerald-300 border-[#2A3B2E]'
                  : 'bg-[#FAF8F2] hover:bg-[#E6F0E6] text-[#315C43] border-[#E8E5DC]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Active Speech Recognition Visualizer */}
        {isListening && (
          <div
            className={`px-4 py-2 flex items-center justify-between border-t text-xs font-bold animate-pulse ${
              isDark
                ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/30'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span>
                {language === 'kn'
                  ? `🎙️ ಕನ್ನಡದಲ್ಲಿ ಆಲಿಸುತ್ತಿದೆ... ಮಾತನಾಡಿ`
                  : language === 'hi'
                  ? `🎙️ हिन्दी में सुन रहे हैं... बोलिए`
                  : `🎙️ Listening in ${currentOption.name}... Speak now`}
              </span>
              {spokenTranscript && (
                <span className="italic opacity-80 max-w-xs truncate">
                  "{spokenTranscript}"
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={handleToggleVoice}
              className="text-[11px] underline font-black text-emerald-400 hover:text-white"
            >
              Done
            </button>
          </div>
        )}

        {/* Input Bar with Voice Microphone and Send */}
        <div
          className={`p-4 border-t ${
            isDark ? 'bg-[#151D17] border-[#243328]' : 'bg-white border-[#E8E5DC]'
          }`}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="flex gap-2 items-center"
          >
            {/* Indian Language Microphone Button */}
            <button
              type="button"
              onClick={handleToggleVoice}
              className={`p-3 rounded-2xl transition-all shadow-xs flex items-center justify-center shrink-0 ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/30'
                  : isDark
                  ? 'bg-[#1D2820] hover:bg-[#25352A] text-emerald-400 border border-[#2D3E31]'
                  : 'bg-[#E6F0E6] hover:bg-[#D5E5D5] text-[#315C43] border border-[#CCD8CC]'
              }`}
              title={`Speak in ${currentOption.nativeName} (${currentOption.speechCode})`}
              aria-label="Toggle Voice Input"
            >
              {isListening ? (
                <MicOff className="w-4 h-4 text-white" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                isListening
                  ? t('voiceListening', 'Listening to your voice...')
                  : t('chatPlaceholder', 'Ask anything about cooking, substitutions, leftover tips...')
              }
              className={`flex-1 px-4 py-3 rounded-2xl border text-sm font-medium outline-none transition-colors ${
                isDark
                  ? 'bg-[#0E1310] border-[#243328] text-white focus:border-emerald-500 placeholder-[#6B7280]'
                  : 'bg-[#FAF8F2] border-[#E8E5DC] text-[#202820] focus:border-[#315C43] placeholder-[#737B72]'
              }`}
            />

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold transition-all shadow-xs flex items-center justify-center active:scale-95 shrink-0"
              aria-label="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
