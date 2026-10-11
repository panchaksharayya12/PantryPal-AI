import React, { useEffect, useRef, useState } from 'react';
import { RecipeRecord, MatchedRecipe } from '../types/recipe.ts';
import { ChefHat, Clock, Sparkles, CheckCircle2, Rotate3d, LayoutGrid } from 'lucide-react';
import { sounds } from '../utils/soundEffects.ts';
import { useLanguage } from '../context/LanguageContext.tsx';
import { getLocalizedRecipeName } from '../utils/localizedRecipes.ts';

interface CulinarySphereProps {
  recipes: (MatchedRecipe | RecipeRecord)[];
  onSelectRecipe: (recipe: MatchedRecipe | RecipeRecord) => void;
  onSwitchToGrid: () => void;
  isDark?: boolean;
}

export const CulinarySphere: React.FC<CulinarySphereProps> = ({
  recipes,
  onSelectRecipe,
  onSwitchToGrid,
  isDark = true,
}) => {
  const { t, language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);

  const [sphereRadius, setSphereRadius] = useState(320);
  const [cardWidth, setCardWidth] = useState(160);

  // Drag physics states
  const isDraggingRef = useRef(false);
  const dragXRef = useRef(0);
  const dragYRef = useRef(0);
  const velXRef = useRef(0);
  const velYRef = useRef(0);
  const lastPointerRef = useRef({ x: 0, y: 0 });
  const startPointerRef = useRef({ x: 0, y: 0 });
  const totalMoveRef = useRef(0);
  const touchDecidedRef = useRef(false);
  const downTargetRef = useRef<HTMLElement | null>(null);

  // Cards state tracking
  const cardsRef = useRef<Array<{
    el: HTMLDivElement | null;
    x: number;
    y: number;
    z: number;
    lat: number;
    lon: number;
    lastDim: number;
    lastFade: number;
  }>>([]);

  const N = Math.min(21, recipes.length);
  const GA = Math.PI * (3 - Math.sqrt(5));

  // Compute unit vectors for Fibonacci distribution
  const fibonacciPoints = useRef(
    Array.from({ length: 21 }).map((_, i) => {
      const y = 1 - (i / 20) * 2;
      const rad = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = i * GA;
      const x = Math.cos(theta) * rad;
      const z = Math.sin(theta) * rad;
      const lat = (Math.asin(y) * 180) / Math.PI;
      const lon = (Math.atan2(x, z) * 180) / Math.PI;
      return { x, y, z, lat, lon };
    })
  ).current;

  // Responsive Layout
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      const hr = w <= 380 ? 0.38 : (w <= 640 ? 0.42 : 0.46);
      const wr = w <= 380 ? 0.48 : (w <= 640 ? 0.52 : 0.58);
      const floor = w <= 380 ? 110 : (w <= 640 ? 130 : 160);

      const R = Math.max(floor, Math.min(460, h * hr, w * wr));
      const scale = w <= 380 ? 0.44 : (w <= 640 ? 0.46 : 0.48);
      const cw = Math.round(Math.max(80, R * scale));

      setSphereRadius(R);
      setCardWidth(cw);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animation Camera Loop
  useEffect(() => {
    let animId: number;
    const tilt = -4;
    const spin = 0;

    const loop = () => {
      if (!isDraggingRef.current) {
        dragXRef.current += velXRef.current;
        dragYRef.current += velYRef.current;
        velXRef.current *= 0.94;
        velYRef.current *= 0.94;
        if (Math.abs(velXRef.current) < 0.002) velXRef.current = 0;
        if (Math.abs(velYRef.current) < 0.002) velYRef.current = 0;
      }

      // Clamp pitch between -32 and 32
      const rawPitch = tilt + dragYRef.current;
      if (rawPitch > 32) dragYRef.current = 32 - tilt;
      else if (rawPitch < -32) dragYRef.current = -32 - tilt;

      const sx = tilt + dragYRef.current;
      const sy = spin + dragXRef.current;

      if (worldRef.current) {
        worldRef.current.style.transform = `translateZ(0px) rotateY(${sy.toFixed(3)}deg) rotateX(${sx.toFixed(3)}deg)`;
      }

      if (headlineRef.current) {
        headlineRef.current.style.transform = `rotateX(${(-sx).toFixed(3)}deg) rotateY(${(-sy).toFixed(3)}deg) translateZ(${(sphereRadius * 0.62).toFixed(2)}px)`;
      }

      // Depth shading per card
      const sxRad = (sx * Math.PI) / 180;
      const syRad = (sy * Math.PI) / 180;
      const cosX = Math.cos(sxRad), sinX = Math.sin(sxRad);
      const cosY = Math.cos(syRad), sinY = Math.sin(syRad);
      const near = 1150 * 0.66;

      cardsRef.current.forEach((card) => {
        if (!card || !card.el) return;
        const y1 = card.y * cosX - card.z * sinX;
        const z1 = card.y * sinX + card.z * cosX;
        const zf = -card.x * sinY + z1 * cosY;

        const base = 0.14 + 0.86 * Math.pow((zf + 1) / 2, 0.85);
        const dim = 1 - base;
        const cardDist = zf * sphereRadius;
        let fade = 1;
        if (cardDist > near) {
          fade = Math.max(0, 1 - (cardDist - near) / 190);
        }

        const dimRounded = parseFloat(dim.toFixed(3));
        const fadeRounded = parseFloat(fade.toFixed(3));

        if (card.lastDim !== dimRounded) {
          card.el.style.setProperty('--d', String(dimRounded));
          card.lastDim = dimRounded;
        }
        if (card.lastFade !== fadeRounded) {
          card.el.style.opacity = String(fadeRounded);
          card.lastFade = fadeRounded;
        }
      });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [sphereRadius]);

  const [isDraggingState, setIsDraggingState] = useState(false);

  // Pointer & Touch Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = false;
    touchDecidedRef.current = false;
    startPointerRef.current = { x: e.clientX, y: e.clientY };
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
    totalMoveRef.current = 0;
    downTargetRef.current = (e.target as HTMLElement).closest('[data-recipe-idx]');
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const dx = e.clientX - lastPointerRef.current.x;
    const dy = e.clientY - lastPointerRef.current.y;
    const dist = Math.hypot(e.clientX - startPointerRef.current.x, e.clientY - startPointerRef.current.y);
    totalMoveRef.current = Math.max(totalMoveRef.current, dist);

    // Only engage drag if pointer moved past threshold
    if (!isDraggingRef.current && dist > 4) {
      if (e.pointerType === 'touch' && !touchDecidedRef.current) {
        touchDecidedRef.current = true;
        if (Math.abs(e.clientY - startPointerRef.current.y) > Math.abs(e.clientX - startPointerRef.current.x) * 1.15) {
          return; // Let vertical page scroll pass
        }
      }

      isDraggingRef.current = true;
      setIsDraggingState(true);
      try {
        containerRef.current?.setPointerCapture(e.pointerId);
      } catch (err) {}
    }

    if (isDraggingRef.current) {
      dragXRef.current += dx * 0.16;
      dragYRef.current -= dy * 0.16;
      velXRef.current = dx * 0.16;
      velYRef.current = -dy * 0.16;
      lastPointerRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      containerRef.current?.releasePointerCapture(e.pointerId);
    } catch (err) {}

    const slop = e.pointerType === 'touch' ? 14 : 6;
    const wasClick = totalMoveRef.current < slop;
    isDraggingRef.current = false;
    setIsDraggingState(false);

    // Direct card click resolution
    if (wasClick) {
      const targetCard = downTargetRef.current || document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-recipe-idx]');
      if (targetCard) {
        const idx = parseInt(targetCard.getAttribute('data-recipe-idx') || '-1', 10);
        if (idx >= 0 && idx < recipes.length) {
          onSelectRecipe(recipes[idx]);
        }
      }
    }
  };

  return (
    <div className={`relative w-full h-[580px] sm:h-[660px] lg:h-[720px] overflow-hidden select-none transition-colors ${
      isDark
        ? 'bg-radial from-emerald-950/20 via-[#0B0F0D] to-[#0B0F0D]'
        : 'bg-radial from-[#E6F0E6]/30 via-transparent to-transparent'
    }`}>
      
      {/* 3D Orbit Stage */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`w-full h-full relative flex items-center justify-center select-none ${
          isDraggingState ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{
          perspective: '1150px',
          perspectiveOrigin: '50% 50%',
          touchAction: 'none',
          userSelect: 'none',
        }}
      >
        {/* The 3D World Origin */}
        <div
          ref={worldRef}
          className="absolute top-1/2 left-1/2 w-0 h-0"
          style={{
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
        >
          {/* Centered Optical Title */}
          <div
            ref={headlineRef}
            className="absolute top-0 left-0 pointer-events-none text-center"
            style={{
              width: 'min(70vw, 560px)',
              marginLeft: 'calc(min(70vw, 560px) / -2)',
              transformStyle: 'preserve-3d',
              willChange: 'transform',
            }}
          >
            <div className="absolute top-0 left-0 w-full -translate-y-1/2">
              <span className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-widest border shadow-xs mb-3 backdrop-blur-md ${
                isDark
                  ? 'bg-[#18201B]/90 text-emerald-400 border-emerald-500/30'
                  : 'bg-[#FAF8F2]/90 text-[#315C43] border-[#315C43]/20'
              }`}>
                <Sparkles className="w-3.5 h-3.5" /> 3D Culinary Archive
              </span>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] drop-shadow-sm font-sans">
                {t('orbitCenterTitle1', 'Your Kitchen.')} <br />
                <span className="text-emerald-500 italic font-serif">{t('orbitCenterTitle2', 'Endless Possibilities.')}</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#737B72] dark:text-[#9CA3AF] font-semibold mt-3 max-w-sm mx-auto">
                {t('orbitCenterSubtitle', 'Drag to explore 28+ authentic dishes in 3D orbit. Click any dish to view full recipe & cooking steps.')}
              </p>
            </div>
          </div>

          {/* 3D Orbiting Cards */}
          <div className="absolute top-0 left-0 w-0 h-0" style={{ transformStyle: 'preserve-3d' }}>
            {fibonacciPoints.slice(0, recipes.length).map((pt, i) => {
              const recipe = recipes[i];
              const localizedName = getLocalizedRecipeName(recipe, language);
              const matched = recipe as Partial<MatchedRecipe>;
              const matchPct = matched.matchPercentage ?? 0;
              const isReady = matched.isReadyToCook ?? false;

              return (
                <div
                  key={recipe.id}
                  ref={(el) => {
                    cardsRef.current[i] = {
                      el,
                      x: pt.x,
                      y: pt.y,
                      z: pt.z,
                      lat: pt.lat,
                      lon: pt.lon,
                      lastDim: 0,
                      lastFade: 1,
                    };
                  }}
                  data-recipe-idx={i}
                  onClick={(e) => {
                    if (totalMoveRef.current < 6) {
                      e.stopPropagation();
                      onSelectRecipe(recipe);
                    }
                  }}
                  className={`absolute top-0 left-0 group select-none ${isDraggingState ? 'pointer-events-none' : 'cursor-pointer'}`}
                  style={{
                    width: `${cardWidth}px`,
                    height: `${cardWidth / 1.45}px`,
                    marginLeft: `${-cardWidth / 2}px`,
                    marginTop: `${-cardWidth / 2.9}px`,
                    transformStyle: 'preserve-3d',
                    willChange: 'transform, opacity',
                    transform: `translate3d(${(pt.x * sphereRadius).toFixed(2)}px, ${(-pt.y * sphereRadius).toFixed(2)}px, ${(pt.z * sphereRadius).toFixed(2)}px) rotateY(${pt.lon.toFixed(2)}deg) rotateX(${pt.lat.toFixed(2)}deg)`,
                    pointerEvents: isDraggingState ? 'none' : 'auto',
                  }}
                >
                  <div className={`w-full h-full rounded-2xl overflow-hidden shadow-xl border transition-all duration-300 relative group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(16,185,129,0.35)] ${
                    isDark
                      ? 'border-white/10 group-hover:border-emerald-400 bg-[#141A16]'
                      : 'border-white/80 group-hover:border-[#315C43] bg-[#E6F0E6]'
                  }`}>
                    <img
                      src={recipe.imageUrl}
                      alt={localizedName || recipe.name}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Dark gradient vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                    {/* Depth wash */}
                    <div
                      className="absolute inset-0 pointer-events-none transition-colors"
                      style={{
                        background: 'rgba(0, 0, 0, calc(var(--d, 0) * 0.75))',
                      }}
                    />

                    {/* Badge */}
                    <div className="absolute top-2 left-2 z-10 pointer-events-none">
                      {matchPct > 0 ? (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black shadow-xs ${
                          isReady ? 'bg-emerald-500 text-white' : 'bg-white/95 text-emerald-800'
                        }`}>
                          {isReady ? t('readyToCook', 'Ready') : `${matchPct}%`}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-black/60 text-white text-[9px] font-bold backdrop-blur-xs">
                          {recipe.cuisine}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <div className="absolute bottom-2 left-2 right-2 z-10 text-white pointer-events-none">
                      <p className="text-xs font-black line-clamp-1 drop-shadow-sm">
                        {localizedName || recipe.name}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-white/80 font-semibold mt-0.5">
                        <span className="flex items-center gap-0.5 text-emerald-300">
                          <Clock className="w-3 h-3 text-emerald-300" />
                          {recipe.prepTime + recipe.cookTime}m
                        </span>
                        <span>•</span>
                        <span>{recipe.difficulty}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Floating Bottom Bar: Controls & Drag Cue */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none z-20">
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border shadow-xs backdrop-blur-md ${
          isDark
            ? 'bg-[#141A16]/90 text-[#9CA3AF] border-white/10'
            : 'bg-white/85 text-[#737B72] border-[#E8E5DC]'
        }`}>
          <Rotate3d className="w-4 h-4 text-emerald-400 animate-spin-slow" />
          <span>{t('orbitDragPrompt', 'Drag in 3D • Tap dish to open')}</span>
        </div>

        <button
          type="button"
          onClick={onSwitchToGrid}
          className={`pointer-events-auto px-4 py-2 rounded-xl text-xs font-extrabold border shadow-xs transition-all flex items-center gap-1.5 hover:shadow-md active:scale-95 ${
            isDark
              ? 'bg-[#18201B] hover:bg-[#222E26] text-white border-white/10'
              : 'bg-white hover:bg-[#FAF8F2] text-[#202820] border-[#E8E5DC]'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5 text-emerald-400" />
          <span>{t('switchToGrid', 'Switch to Card Grid')}</span>
        </button>
      </div>

    </div>
  );
};
