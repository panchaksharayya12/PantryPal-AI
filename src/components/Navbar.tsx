import React, { useState, useRef, useEffect } from 'react';
import {
  UtensilsCrossed,
  Sparkles,
  Heart,
  ShoppingBag,
  Menu,
  X,
  Refrigerator,
  Sun,
  Moon,
  Globe,
  ChevronDown,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from '../utils/soundEffects.ts';
import { useLanguage, SUPPORTED_LANGUAGES, SupportedLanguage } from '../context/LanguageContext.tsx';

interface NavbarProps {
  activeTab: 'discover' | 'pantry' | 'shopping' | 'favorites';
  setActiveTab: (tab: 'discover' | 'pantry' | 'shopping' | 'favorites') => void;
  onOpenAi: () => void;
  onFindRecipeClick: () => void;
  shoppingCount: number;
  favoritesCount: number;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAi,
  onFindRecipeClick,
  shoppingCount,
  favoritesCount,
  theme = 'dark',
  onToggleTheme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const isDark = theme === 'dark';

  const { language, setLanguage, t, currentOption } = useLanguage();

  // Close language menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNav = (tab: 'discover' | 'pantry' | 'shopping' | 'favorites') => {
    sounds.playPop();
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'discover', label: t('navDiscover', 'Discover Recipes'), icon: null },
    { id: 'pantry', label: t('navPantry', 'My Pantry'), icon: Refrigerator },
    { id: 'shopping', label: t('navShopping', 'Shopping List'), icon: ShoppingBag, badge: shoppingCount },
    { id: 'favorites', label: t('navFavorites', 'Favorites'), icon: Heart, badge: favoritesCount, badgeColor: 'bg-rose-500' },
  ] as const;

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors duration-300 ${
      isDark
        ? 'bg-[#0B0F0D]/90 border-[#233328]'
        : 'bg-[#FAF8F2]/90 border-[#E8E5DC]/80'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo with Spring Hover */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleNav('discover')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:rotate-6 transition-all duration-300">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight block leading-tight font-sans">
                PantryPal <span className="text-emerald-500">AI</span>
              </span>
              <span className="text-[11px] font-bold text-[#737B72] dark:text-[#9CA3AF] tracking-wider uppercase hidden sm:block">
                {t('smartKitchenAssistant', 'Smart Kitchen Assistant')}
              </span>
            </div>
          </motion.div>

          {/* Desktop Navigation Links */}
          <nav className={`hidden lg:flex items-center gap-1.5 p-1.5 rounded-2xl border shadow-xs ${
            isDark
              ? 'bg-[#141A16] border-[#233328]'
              : 'bg-white/70 border-[#E8E5DC]/80'
          }`}>
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`relative px-4 py-2 rounded-xl text-sm font-bold transition-colors duration-200 flex items-center gap-2 z-10 ${
                    isActive
                      ? 'text-white'
                      : isDark
                        ? 'text-[#9CA3AF] hover:text-white'
                        : 'text-[#202820] hover:text-[#315C43]'
                  }`}
                >
                  {/* Sliding active pill indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-emerald-600 rounded-xl shadow-sm -z-10"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}

                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{item.label}</span>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-black ${
                        isActive
                          ? 'bg-white text-emerald-700'
                          : (item.badgeColor || 'bg-emerald-600') + ' text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Indian Language Switcher Dropdown */}
            <div ref={langMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 shadow-2xs ${
                  isDark
                    ? 'bg-[#18201B] hover:bg-[#202B24] text-white border-white/10'
                    : 'bg-white hover:bg-gray-50 text-[#202820] border-[#E8E5DC]'
                }`}
                title="Change Website Language / ಭಾಷೆಯನ್ನು ಬದಲಾಯಿಸಿ"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-extrabold">{currentOption.nativeName}</span>
                <ChevronDown className={`w-3 h-3 text-[#9CA3AF] transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {langMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute right-0 mt-2 w-48 rounded-2xl border shadow-2xl py-2 z-50 ${
                      isDark ? 'bg-[#18201B] border-[#2E4235] text-white' : 'bg-white border-[#E8E5DC] text-[#202820]'
                    }`}
                  >
                    <div className="px-3 py-1.5 border-b border-white/5 text-[10px] uppercase font-black tracking-wider text-[#737B72] dark:text-[#9CA3AF]">
                      Select Language (ಭಾಷೆ)
                    </div>
                    <div className="max-h-64 overflow-y-auto py-1">
                      {SUPPORTED_LANGUAGES.map((lang) => {
                        const isSelected = language === lang.code;
                        return (
                          <button
                            key={lang.code}
                            type="button"
                            onClick={() => {
                              sounds.playPop();
                              setLanguage(lang.code);
                              setLangMenuOpen(false);
                            }}
                            className={`w-full px-3.5 py-2 text-xs font-bold text-left flex items-center justify-between transition-colors ${
                              isSelected
                                ? isDark ? 'bg-emerald-950/60 text-emerald-400' : 'bg-emerald-50 text-[#315C43]'
                                : isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'
                            }`}
                          >
                            <div>
                              <span className="font-black block">{lang.nativeName}</span>
                              <span className="text-[10px] text-[#737B72] dark:text-[#9CA3AF]">{lang.name}</span>
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle (Dark / Light) */}
            {onToggleTheme && (
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => {
                  sounds.playPop();
                  onToggleTheme();
                }}
                className={`p-2.5 rounded-xl border transition-all ${
                  isDark
                    ? 'bg-[#18201B] hover:bg-[#222E26] text-amber-400 border-white/10'
                    : 'bg-white hover:bg-gray-100 text-[#737B72] border-[#E8E5DC]'
                }`}
                title={isDark ? 'Switch to Warm Light Theme' : 'Switch to Luxury Dark Theme'}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-emerald-600" />}
              </motion.button>
            )}

            {/* Ask AI Assistant */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                sounds.playChime();
                onOpenAi();
              }}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 border shadow-xs ${
                isDark
                  ? 'bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border-emerald-500/30'
                  : 'text-[#315C43] bg-[#E6F0E6] hover:bg-[#d8ebd8] border-[#cee2ce]'
              }`}
              title="Ask culinary questions to AI"
            >
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>{t('navAskAi', 'Ask AI')}</span>
            </motion.button>

            {/* Primary Action Find Recipe */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                sounds.playPop();
                onFindRecipeClick();
              }}
              className="px-5 py-2.5 rounded-xl text-sm font-black text-white bg-emerald-600 hover:bg-emerald-500 shadow-md transition-all duration-200"
            >
              {t('navFindRecipe', 'Find My Recipe')}
            </motion.button>
          </div>

          {/* Mobile Menu & Controls */}
          <div className="flex sm:hidden items-center gap-2">
            {/* Mobile Language Switcher */}
            <button
              onClick={() => {
                // Cycle through languages or toggle
                const idx = SUPPORTED_LANGUAGES.findIndex((l) => l.code === language);
                const next = SUPPORTED_LANGUAGES[(idx + 1) % SUPPORTED_LANGUAGES.length];
                setLanguage(next.code);
              }}
              className={`px-2 py-1.5 rounded-xl border text-xs font-bold ${
                isDark ? 'bg-[#18201B] text-emerald-400 border-white/10' : 'bg-white text-gray-700 border-gray-200'
              }`}
            >
              🌐 {currentOption.nativeName}
            </button>

            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className={`p-2 rounded-xl border ${
                  isDark ? 'bg-[#18201B] text-amber-400 border-white/10' : 'bg-white text-gray-700 border-gray-200'
                }`}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2.5 rounded-2xl border transition-colors ${
                isDark ? 'bg-[#18201B] border-white/10 text-white' : 'bg-white border-[#E8E5DC] text-[#202820]'
              }`}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`sm:hidden border-b px-4 py-6 space-y-4 shadow-xl ${
              isDark ? 'bg-[#0E1310] border-[#233328]' : 'bg-[#FAF8F2] border-[#E8E5DC]'
            }`}
          >
            <div className="space-y-1.5">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`w-full px-4 py-3 rounded-2xl text-base font-bold flex items-center justify-between transition-colors ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : isDark
                          ? 'text-[#9CA3AF] hover:bg-white/5'
                          : 'text-[#202820] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {Icon && <Icon className="w-5 h-5" />}
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && item.badge > 0 && (
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-white text-emerald-700' : 'bg-emerald-600 text-white'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-black/10 dark:border-white/10 space-y-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAi();
                }}
                className={`w-full py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 border text-sm ${
                  isDark
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                    : 'bg-[#E6F0E6] text-[#315C43] border-[#cee2ce]'
                }`}
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>{t('navAskAi', 'Ask AI Assistant')}</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onFindRecipeClick();
                }}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 text-white font-black text-sm shadow-md"
              >
                {t('navFindRecipe', 'Find My Recipe')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
