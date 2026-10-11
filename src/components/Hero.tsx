import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, ArrowRight, ChefHat, CheckCircle2, Clock, Play, Pause, Flame } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { sounds } from '../utils/soundEffects.ts';
import { useLanguage } from '../context/LanguageContext.tsx';

interface HeroProps {
  onFindRecipeClick: () => void;
  onExploreRecipesClick: () => void;
  isDark?: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  onFindRecipeClick,
  onExploreRecipesClick,
  isDark = true,
}) => {
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  // Mouse parallax motion for floating elements
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 20 });

  const moveX1 = useTransform(springX, [-0.5, 0.5], [-18, 18]);
  const moveY1 = useTransform(springY, [-0.5, 0.5], [-18, 18]);

  const moveX2 = useTransform(springX, [-0.5, 0.5], [22, -22]);
  const moveY2 = useTransform(springY, [-0.5, 0.5], [22, -22]);

  const cardRotate = useTransform(springX, [-0.5, 0.5], [-3, 3]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth - 0.5);
      mouseY.set(e.clientY / window.innerHeight - 0.5);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const toggleVideoPlayback = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-14 lg:pt-16 lg:pb-24">
      {/* Ambient glowing orbs */}
      <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl -z-10 pointer-events-none ${
        isDark ? 'bg-emerald-950/40' : 'bg-[#E6F0E6]/50'
      }`} />
      <div className={`absolute bottom-10 right-1/4 w-80 h-80 rounded-full blur-3xl -z-10 pointer-events-none ${
        isDark ? 'bg-amber-950/30' : 'bg-[#FDF0E2]/60'
      }`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold tracking-wide border shadow-xs ${
                isDark
                  ? 'bg-emerald-950/70 text-emerald-400 border-emerald-500/30 backdrop-blur-md'
                  : 'bg-[#E6F0E6]/90 text-[#315C43] border-[#cee2ce]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-400 animate-spin-slow" />
              <span>{t('heroBadge', 'Smart Pantry-to-Plate Assistant')}</span>
            </motion.div>

            {/* Kinetic Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12]">
              {t('heroTitle1', 'Your ingredients.')}{' '}
              <br />
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="text-emerald-500 relative inline-block font-sans"
              >
                {t('heroTitle2', 'Your next favorite meal.')}
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3.5 text-emerald-500/30"
                  viewBox="0 0 100 12"
                  preserveAspectRatio="none"
                >
                  <path d="M0,0 Q50,14 100,0" fill="none" stroke="currentColor" strokeWidth="4" />
                </svg>
              </motion.span>
            </h1>

            {/* Supporting Text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-lg sm:text-xl text-[#737B72] dark:text-[#9CA3AF] max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed"
            >
              {t('heroSubtitle', 'Discover delicious recipes using what you already have in your kitchen. Prevent food waste, save grocery trips, and cook with confidence.')}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: '0 20px 30px -10px rgba(16, 185, 129, 0.4)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  sounds.playPop();
                  onFindRecipeClick();
                }}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-base font-bold shadow-lg transition-all duration-200 flex items-center justify-center gap-3 group relative overflow-hidden"
              >
                <span>{t('findMyRecipeBtn', 'Find My Recipe')}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  sounds.playSwoosh();
                  onExploreRecipesClick();
                }}
                className={`w-full sm:w-auto px-7 py-4 rounded-2xl text-base font-semibold border shadow-sm transition-all duration-200 flex items-center justify-center gap-2 backdrop-blur-xs ${
                  isDark
                    ? 'bg-[#18201B] hover:bg-[#202B24] text-white border-white/10'
                    : 'bg-white/90 hover:bg-white text-[#202820] border-[#E8E5DC]'
                }`}
              >
                <span>{t('exploreRecipesBtn', 'Explore 28+ Dishes')}</span>
              </motion.button>
            </motion.div>

            {/* Quick Stats Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className={`pt-6 border-t grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left ${
                isDark ? 'border-white/10' : 'border-[#E8E5DC]/80'
              }`}
            >
              <div className={`p-3 rounded-2xl border backdrop-blur-xs ${
                isDark ? 'bg-[#141A16] border-white/5' : 'bg-white/60 border-[#E8E5DC]/70'
              }`}>
                <p className="text-2xl font-black text-emerald-500">28+</p>
                <p className="text-xs sm:text-sm text-[#737B72] dark:text-[#9CA3AF] font-semibold">{t('statDishes', 'Curated Dishes')}</p>
              </div>
              <div className={`p-3 rounded-2xl border backdrop-blur-xs ${
                isDark ? 'bg-[#141A16] border-white/5' : 'bg-white/60 border-[#E8E5DC]/70'
              }`}>
                <p className="text-2xl font-black text-emerald-500">12+</p>
                <p className="text-xs sm:text-sm text-[#737B72] dark:text-[#9CA3AF] font-semibold">{t('statSpices', 'Spices & Masalas')}</p>
              </div>
              <div className={`p-3 rounded-2xl border backdrop-blur-xs ${
                isDark ? 'bg-[#141A16] border-white/5' : 'bg-white/60 border-[#E8E5DC]/70'
              }`}>
                <p className="text-2xl font-black text-emerald-500">0%</p>
                <p className="text-xs sm:text-sm text-[#737B72] dark:text-[#9CA3AF] font-semibold">{t('statWaste', 'Food Waste')}</p>
              </div>
            </motion.div>
          </motion.div>

            {/* Right Hero: Animated Culinary Prep Video Reel */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              style={{ rotate: cardRotate }}
              className="relative mx-auto max-w-md lg:max-w-none"
            >
              {/* Floating Badge 1 - Top Right */}
              <motion.div
                style={{ x: moveX1, y: moveY1 }}
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4.2, ease: 'easeInOut' }}
                className="absolute -top-4 -right-3 sm:-right-5 z-30 px-3.5 py-2 rounded-2xl bg-[#141A16]/90 backdrop-blur-md border border-emerald-500/40 shadow-2xl flex items-center gap-2.5 pointer-events-none"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </div>
                <div className="text-left">
                  <p className="text-[11px] font-bold text-white leading-tight">Zero Food Waste</p>
                  <p className="text-[9px] text-emerald-400 font-semibold">100% Pantry Matched</p>
                </div>
              </motion.div>

              {/* Floating Badge 2 - Bottom Left */}
              <motion.div
                style={{ x: moveX2, y: moveY2 }}
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 3.8, ease: 'easeInOut', delay: 0.8 }}
                className="absolute -bottom-4 -left-3 sm:-left-5 z-30 px-3.5 py-2 rounded-2xl bg-[#141A16]/90 backdrop-blur-md border border-amber-500/40 shadow-2xl flex items-center gap-2.5 pointer-events-none"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-[11px] font-bold text-white leading-tight">Quick 15-Min Meals</p>
                  <p className="text-[9px] text-amber-400 font-semibold">Step-by-Step Cooking</p>
                </div>
              </motion.div>

              {/* Glowing Aura Effect */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-500/20 via-teal-500/10 to-amber-500/20 rounded-[2rem] blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse pointer-events-none" />

              {/* Cinematic Looping Video Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-emerald-500/30 aspect-4/3 sm:aspect-5/4 group bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1000&q=80"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                >
                  <source src="/videos/hero-vegetables-prep.webm" type="video/webm" />
                  <source src="/videos/cooking-prep.webm" type="video/webm" />
                </video>
                
                {/* Subtle Cinematic Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

                {/* Minimalist Live AI Culinary Badge */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-emerald-300 text-xs font-bold border border-emerald-500/30">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>AI Fresh Kitchen Prep Reel</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
