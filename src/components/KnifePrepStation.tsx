import React, { useState } from 'react';
import { Sparkles, Utensils, CheckCircle2, RefreshCw, Flame, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from '../utils/soundEffects.ts';
import { useLanguage } from '../context/LanguageContext.tsx';

interface VegetableItem {
  id: string;
  name: string;
  emoji: string;
  color: string;
  names: Record<string, string>;
  cutDetail: string;
  prepAction: string;
}

const VEGETABLES: VegetableItem[] = [
  {
    id: 'tomato',
    name: 'Tomato',
    emoji: '🍅',
    color: '#EF4444',
    names: {
      en: 'Tomato',
      kn: 'ಟೊಮೇಟೊ',
      hi: 'टमाटर',
      ta: 'தக்காளி',
      te: 'టమాటో',
      ml: 'തക്കാളി',
      mr: 'टोमॅटो',
      bn: 'টমেটো',
      gu: 'ટામેટા'
    },
    cutDetail: 'Juicy seeds & firm red skin',
    prepAction: 'Sliced into wheels'
  },
  {
    id: 'onion',
    name: 'Onion',
    emoji: '🧅',
    color: '#D97706',
    names: {
      en: 'Onion',
      kn: 'ಈರುಳ್ಳಿ (Onion)',
      hi: 'प्याज (Onion)',
      ta: 'வெங்காயம்',
      te: 'ఉల్లిపಾಯ',
      ml: 'ഉള്ളി',
      mr: 'कांदा',
      bn: 'পেঁয়াজ',
      gu: 'ડુંગળી'
    },
    cutDetail: 'Crisp concentric rings',
    prepAction: 'Finely julienned'
  },
  {
    id: 'capsicum',
    name: 'Capsicum',
    emoji: '🫑',
    color: '#10B981',
    names: {
      en: 'Capsicum',
      kn: 'ಕ್ಯಾಪ್ಸಿಕಂ (ದಪ್ಪ ಮೆಣಸು)',
      hi: 'शिमला मिर्च',
      ta: 'குடைமிளகாய்',
      te: 'క్యాప్సికమ్',
      ml: 'ക്യാപ്സിക്കം',
      mr: 'ढोबळी मिरची',
      bn: 'ক্যাপসিকাম',
      gu: 'કેપ્સિકમ'
    },
    cutDetail: 'Hollow ribbed crisp wall',
    prepAction: 'Diced crunch cubes'
  },
  {
    id: 'carrot',
    name: 'Carrot',
    emoji: '🥕',
    color: '#F97316',
    names: {
      en: 'Carrot',
      kn: 'ಕ್ಯಾರೆಟ್',
      hi: 'गाजर',
      ta: 'கேரட்',
      te: 'క్యారెట్',
      ml: 'കാരറ്റ്',
      mr: 'गाजर',
      bn: 'গাজর',
      gu: 'ગાજર'
    },
    cutDetail: 'Sweet orange core',
    prepAction: 'Batonnet matchsticks'
  },
  {
    id: 'potato',
    name: 'Potato',
    emoji: '🥔',
    color: '#B45309',
    names: {
      en: 'Potato',
      kn: 'ಆಲೂಗಡ್ಡೆ (Potato)',
      hi: 'आलू (Potato)',
      ta: 'உருளைக்கிழங்கு',
      te: 'బంగాళాదుంప',
      ml: 'ഉരുളക്കിഴങ്ങ്',
      mr: 'बटाटा',
      bn: 'আলু',
      gu: 'બટાટા'
    },
    cutDetail: 'Creamy starchy flesh',
    prepAction: 'Wedge sliced'
  },
  {
    id: 'garlic',
    name: 'Garlic',
    emoji: '🧄',
    color: '#A8A29E',
    names: {
      en: 'Garlic',
      kn: 'ಬೆಳ್ಳುಳ್ಳಿ (Garlic)',
      hi: 'लहसुन (Garlic)',
      ta: 'பூண்டு',
      te: 'వెల్లుల్లి',
      ml: 'വെളുത്തുള്ളി',
      mr: 'लसूण',
      bn: 'রসুন',
      gu: 'લસણ'
    },
    cutDetail: 'Crushed pungent cloves',
    prepAction: 'Mince pressed'
  },
  {
    id: 'avocado',
    name: 'Avocado',
    emoji: '🥑',
    color: '#84CC16',
    names: {
      en: 'Avocado',
      kn: 'ಆವಕಾಡೊ (ಬೆಣ್ಣೆ ಹಣ್ಣು)',
      hi: 'एवोकाडो',
      ta: 'வெண்ணெய் பழம்',
      te: 'ఆవకాడో',
      ml: 'വെണ്ണപ്പഴം',
      mr: 'अवोकॅडो',
      bn: 'অ্যাভোকাডো',
      gu: 'એવોકાડો'
    },
    cutDetail: 'Buttery green center with pit',
    prepAction: 'Fan sliced'
  },
  {
    id: 'spinach',
    name: 'Spinach',
    emoji: '🥬',
    color: '#059669',
    names: {
      en: 'Spinach',
      kn: 'ಪಾಲಕ್ ಸೊಪ್ಪು (Spinach)',
      hi: 'पालक (Spinach)',
      ta: 'பசலைக்கீரை',
      te: 'పాలకూర',
      ml: 'ചീര',
      mr: 'पालक',
      bn: 'পালং শাক',
      gu: 'પાલક'
    },
    cutDetail: 'Tender chlorophyll leaves',
    prepAction: 'Chiffonade cut'
  },
];

interface KnifePrepStationProps {
  onAddIngredient: (name: string) => void;
  activeIngredients: string[];
  isDark?: boolean;
}

export const KnifePrepStation: React.FC<KnifePrepStationProps> = ({
  onAddIngredient,
  activeIngredients,
  isDark = true,
}) => {
  const { t, language } = useLanguage();
  const [slicedVeggies, setSlicedVeggies] = useState<Record<string, number>>({}); // slice count
  const [slashingId, setSlashingId] = useState<string | null>(null);
  const [comboCount, setComboCount] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSlice = (veg: VegetableItem) => {
    sounds.playKnifeChop();
    setSlashingId(veg.id);

    const currentCount = slicedVeggies[veg.id] || 0;
    const newCount = currentCount + 1;

    setTimeout(() => {
      setSlicedVeggies((prev) => ({ ...prev, [veg.id]: newCount }));
      setSlashingId(null);
      setComboCount((prev) => prev + 1);
      onAddIngredient(veg.name);
      const displayName = (veg.names && veg.names[language]) || veg.name;
      setToastMessage(`🔪 Chef Blade: ${displayName} ${veg.prepAction}! Sliced fresh into your kitchen.`);
      setTimeout(() => setToastMessage(null), 3000);
    }, 240);
  };

  const handleResetBoard = () => {
    sounds.playPop();
    setSlicedVeggies({});
    setComboCount(0);
  };

  const totalSlicedCount = Object.keys(slicedVeggies).length;

  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className={`rounded-3xl p-6 sm:p-8 border shadow-xl relative overflow-hidden transition-all ${
        isDark
          ? 'bg-[#15120E] border-[#382C1E] text-white'
          : 'bg-[#FAF8F2] border-[#E8E5DC] text-[#202820]'
      }`}>
        
        {/* Realistic Butcher Block Wood Grain Overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: `repeating-linear-gradient(90deg, rgba(255,180,100,0.03) 0px, rgba(255,180,100,0.03) 40px, rgba(0,0,0,0.08) 40px, rgba(0,0,0,0.08) 80px)`,
          }}
        />

        {/* Section Header */}
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-5 border-b border-black/10 dark:border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide mb-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('prepBadge', 'Cinematic Prep Station')}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              {t('prepTitle', 'Slice & Prep Fresh Vegetables')} ({totalSlicedCount}/8)
            </h3>
            <p className="text-xs sm:text-sm text-[#737B72] dark:text-[#9CA3AF] mt-1">
              {t('prepSubtitle', 'Tap or click any vegetable to trigger a chef blade slash. Sliced produce is automatically added to your recipe finder.')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {comboCount > 1 && (
              <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-black flex items-center gap-1.5 animate-pulse">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>{comboCount}x {t('comboActive', 'Slicing Combo!')}</span>
              </span>
            )}

            <button
              type="button"
              onClick={handleResetBoard}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 border ${
                isDark
                  ? 'bg-[#221C16] hover:bg-[#2D251D] text-[#C0B4A6] border-[#382C1E]'
                  : 'bg-white hover:bg-gray-100 text-[#737B72] border-[#E8E5DC]'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t('resetBoard', 'Reset Board')}</span>
            </button>
          </div>
        </div>

        {/* Toast Feedback */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="relative z-20 mb-6 p-3 rounded-2xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg backdrop-blur-md"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cutting Board Veggies Grid */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {VEGETABLES.map((veg) => {
            const sliceCount = slicedVeggies[veg.id] || 0;
            const isSliced = sliceCount > 0;
            const isSlashing = slashingId === veg.id;
            const isAlreadyInKitchen = activeIngredients.some(
              (i) => i.toLowerCase() === veg.name.toLowerCase()
            );

            return (
              <motion.div
                key={veg.id}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => handleSlice(veg)}
                className={`relative p-4 rounded-2xl border transition-all cursor-pointer flex flex-col items-center justify-between text-center select-none min-h-40 group overflow-hidden ${
                  isSliced
                    ? isDark
                      ? 'bg-emerald-950/30 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/40'
                      : 'bg-emerald-50/70 border-emerald-300 shadow-sm ring-1 ring-emerald-300'
                    : isDark
                      ? 'bg-[#1E1812] hover:bg-[#251E17] border-[#382C1E] hover:border-amber-500/50'
                      : 'bg-white hover:bg-white/95 border-[#E8E5DC] hover:border-[#315C43]/50 shadow-xs hover:shadow-lg'
                }`}
              >
                {/* Glowing Laser Blade Slash Effect */}
                {isSlashing && (
                  <>
                    <motion.div
                      initial={{ scaleX: 0, opacity: 1, rotate: -40 }}
                      animate={{ scaleX: 1.8, opacity: 0 }}
                      transition={{ duration: 0.26, ease: 'easeOut' }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-1 bg-white shadow-[0_0_20px_#fff,0_0_30px_#10B981] z-30 pointer-events-none"
                    />
                    <motion.div
                      initial={{ scale: 0.4, opacity: 1 }}
                      animate={{ scale: 2.2, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-emerald-400/40 blur-md pointer-events-none z-20"
                    />
                  </>
                )}

                {/* Sliced Vegetable Visual Animation */}
                <div className="relative w-16 h-16 flex items-center justify-center my-2">
                  {!isSliced ? (
                    <motion.div
                      animate={isSlashing ? { rotate: [-12, 12, 0], scale: 1.2 } : {}}
                      className="text-4xl drop-shadow-md group-hover:scale-115 transition-transform duration-200"
                    >
                      {veg.emoji}
                    </motion.div>
                  ) : (
                    /* Sliced Two Halves Separating with Angular Tilt */
                    <div className="flex items-center justify-center gap-1.5">
                      <motion.div
                        initial={{ x: 0, rotate: 0 }}
                        animate={{ x: -8, rotate: -22, y: 2 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                        className="text-3xl drop-shadow-sm"
                      >
                        {veg.emoji}
                      </motion.div>
                      <motion.div
                        initial={{ x: 0, rotate: 0 }}
                        animate={{ x: 8, rotate: 22, y: -2 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                        className="text-3xl drop-shadow-sm"
                      >
                        {veg.emoji}
                      </motion.div>
                    </div>
                  )}
                </div>

                {/* Vegetable Name & Cut Type */}
                <div>
                  <p className="text-xs font-black truncate max-w-full">
                    {(veg.names && veg.names[language]) || veg.name}
                  </p>
                  <p className="text-[9px] text-[#737B72] dark:text-[#9CA3AF] line-clamp-1 mt-0.5">
                    {veg.prepAction}
                  </p>
                </div>

                {/* Status Badge */}
                <div className="mt-2 w-full">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full block truncate ${
                    isSliced
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : isAlreadyInKitchen
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : isDark
                          ? 'bg-white/5 text-[#9CA3AF] border border-white/5 group-hover:border-white/20'
                          : 'bg-[#FAF8F2] text-[#737B72]'
                  }`}>
                    {isSliced ? `${t('sliced', '✓ Sliced')} ${sliceCount > 1 ? `(${sliceCount}x)` : ''}` : isAlreadyInKitchen ? t('inKitchen', 'In Kitchen') : t('tapToSlice', 'Tap to Slice')}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
