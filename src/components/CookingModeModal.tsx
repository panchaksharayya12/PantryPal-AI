import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  ChefHat,
  Sparkles,
  Volume2,
  VolumeX,
  RotateCcw,
  Clock,
  Play,
  Pause
} from 'lucide-react';
import { RecipeRecord } from '../types/recipe.ts';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from '../utils/soundEffects.ts';
import { useLanguage } from '../context/LanguageContext.tsx';
import {
  getLocalizedRecipeInstructions,
  getLocalizedRecipeName
} from '../utils/localizedRecipes.ts';

interface CookingModeModalProps {
  recipe: RecipeRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CookingModeModal: React.FC<CookingModeModalProps> = ({
  recipe,
  isOpen,
  onClose,
}) => {
  const { t, language, currentOption } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [direction, setDirection] = useState(1);

  // Kitchen step timer
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (timerActive && timerSeconds !== null && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (timerSeconds === 0 && timerActive) {
      sounds.playChime();
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  if (!isOpen || !recipe) return null;

  const localizedInstructions = getLocalizedRecipeInstructions(recipe, language);
  const localizedName = getLocalizedRecipeName(recipe, language);
  const totalSteps = localizedInstructions.length || recipe.instructions.length;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  const progressPercent = Math.round(((currentStep + 1) / totalSteps) * 100);

  const handleNext = () => {
    stopSpeech();
    if (!isLastStep) {
      sounds.playPop();
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    } else {
      // Finished cooking! Celebratory multi-burst fireworks & fanfare
      sounds.playVictory();
      triggerGrandConfetti();
    }
  };

  const handlePrev = () => {
    stopSpeech();
    if (!isFirstStep) {
      sounds.playPop();
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    stopSpeech();
    sounds.playPop();
    setDirection(-1);
    setCurrentStep(0);
  };

  const triggerGrandConfetti = () => {
    try {
      const end = Date.now() + 2 * 1000;
      const colors = ['#10B981', '#34D399', '#FAF8F2', '#F59E0B', '#E07A5F'];

      (function frame() {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    } catch (e) {}
  };

  // Text-to-speech voice read aloud
  const handleReadAloud = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const stepText = localizedInstructions[currentStep] || recipe.instructions[currentStep];
    const text = `${t('step', 'Step')} ${currentStep + 1}. ${stepText}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentOption?.speechCode || 'en-IN';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const startTimer = (mins: number) => {
    sounds.playPop();
    setTimerSeconds(mins * 60);
    setTimerActive(true);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#141A15]/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-8 text-white"
    >
      {/* Top Bar */}
      <div className="max-w-5xl w-full mx-auto flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#315C43] text-white flex items-center justify-center shadow-lg border border-white/10">
            <ChefHat className="w-6 h-6 text-[#A7F3D0]" />
          </div>
          <div>
            <h2 className="text-lg font-black truncate max-w-xs sm:max-w-md">
              {localizedName || recipe.name}
            </h2>
            <p className="text-xs text-white/60 font-medium">
              {t('cinemaFocusMode', 'Cinema Focus Cooking Mode')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Read Aloud Button */}
          <button
            onClick={handleReadAloud}
            className={`p-3 rounded-full transition-all border cursor-pointer ${
              isSpeaking
                ? 'bg-emerald-500 text-white border-emerald-400 animate-pulse'
                : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
            }`}
            title={isSpeaking ? 'Stop voice readout' : 'Read step aloud'}
          >
            {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          {/* Close Modal */}
          <button
            onClick={() => {
              stopSpeech();
              onClose();
            }}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10 cursor-pointer"
            aria-label="Exit cooking mode"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Focus Instruction Area */}
      <div className="max-w-4xl w-full mx-auto my-auto py-6 text-center space-y-6">
        
        {/* Step Indicator & Timer Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-sm font-extrabold tracking-wide shadow-sm">
            <Sparkles className="w-4 h-4 text-[#A7F3D0]" />
            <span>{t('step', 'Step')} {currentStep + 1} {t('of', 'of')} {totalSteps}</span>
          </div>

          {/* Quick Kitchen Timer */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5 text-[#F59E0B]" />
            {timerSeconds !== null ? (
              <span className="font-mono font-bold text-amber-300">
                {formatTimer(timerSeconds)}
              </span>
            ) : (
              <span>{t('timerLabel', 'Timer:')}</span>
            )}
            <button
              onClick={() => startTimer(1)}
              className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-[11px] cursor-pointer"
            >
              1m
            </button>
            <button
              onClick={() => startTimer(3)}
              className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-[11px] cursor-pointer"
            >
              3m
            </button>
            <button
              onClick={() => startTimer(5)}
              className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-[11px] cursor-pointer"
            >
              5m
            </button>
            {timerSeconds !== null && (
              <button
                onClick={() => setTimerActive(!timerActive)}
                className="p-1 hover:text-amber-300 cursor-pointer"
              >
                {timerActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar with Ambient Glow */}
        <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden max-w-lg mx-auto shadow-inner relative">
          <motion.div
            className="bg-gradient-to-r from-emerald-500 to-[#A7F3D0] h-full rounded-full shadow-lg"
            initial={false}
            animate={{ width: `${progressPercent}%` }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          />
        </div>

        {/* Slide Animated Instruction Card */}
        <div className="min-h-72 flex items-center justify-center relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              initial={{ opacity: 0, x: direction * 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -50 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white/5 border border-white/15 rounded-3xl p-8 sm:p-12 shadow-2xl backdrop-blur-md max-w-3xl w-full"
            >
              <p className="text-2xl sm:text-3xl lg:text-4xl font-black leading-snug tracking-tight text-white select-none">
                "{localizedInstructions[currentStep] || recipe.instructions[currentStep]}"
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {isLastStep && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-4 rounded-2xl bg-emerald-500/25 border border-emerald-400/50 text-emerald-200 text-sm font-extrabold inline-flex items-center gap-2 shadow-lg"
          >
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span>{t('finalStepReached', 'Final step reached! Click complete to finish!')}</span>
          </motion.div>
        )}
      </div>

      {/* Bottom Controls Bar */}
      <div className="max-w-4xl w-full mx-auto pt-6 border-t border-white/10 flex items-center justify-between gap-4">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={handlePrev}
          disabled={isFirstStep}
          className="px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 disabled:opacity-25 disabled:cursor-not-allowed text-white font-bold text-base transition-all flex items-center gap-2 border border-white/10 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>{t('previousStep', 'Previous Step')}</span>
        </motion.button>

        <button
          onClick={handleRestart}
          className="p-4 rounded-2xl bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-all text-sm font-semibold flex items-center gap-1.5 cursor-pointer"
          title="Restart from Step 1"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">{t('restartStep', 'Restart')}</span>
        </button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          className={`px-8 py-4 rounded-2xl font-black text-base transition-all flex items-center gap-2 shadow-xl cursor-pointer ${
            isLastStep
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
              : 'bg-[#315C43] hover:bg-[#264935] text-white border border-white/15'
          }`}
        >
          <span>{isLastStep ? t('completeRecipe', 'Complete Recipe!') : t('nextStep', 'Next Step')}</span>
          {!isLastStep && <ChevronRight className="w-5 h-5" />}
        </motion.button>
      </div>

    </motion.div>
  );
};
