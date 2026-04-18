import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Layers, Maximize2, RefreshCcw, SwatchBook } from 'lucide-react';

const BACKGROUNDS = {
  white: '#FFFFFF',
  gray: '#6B7280',
  black: '#000000',
};

const BACKGROUND_OPTIONS = [
  { id: 'white', label: 'White', textClass: 'text-black' },
  { id: 'gray', label: 'Gray', textClass: 'text-white' },
  { id: 'black', label: 'Black', textClass: 'text-white' },
];

const MODE_OPTIONS = [
  {
    id: 'stack',
    icon: <Layers size={18} />,
    label: 'Stack',
    helper: 'Normal color layers',
  },
  {
    id: 'blend',
    icon: <SwatchBook size={18} />,
    label: 'Blend',
    helper: 'Calculated color mix',
  },
  {
    id: 'snap',
    icon: <Maximize2 size={18} />,
    label: 'Snap',
    helper: 'Drag and compare',
  },
];

const BUBBLE_SIZE = 176;
const BUBBLE_RADIUS = BUBBLE_SIZE / 2;

const generateHex = () => `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase()}`;

const hexToRgb = (hex) => ({
  r: parseInt(hex.slice(1, 3), 16),
  g: parseInt(hex.slice(3, 5), 16),
  b: parseInt(hex.slice(5, 7), 16),
});

const rgbToHex = ({ r, g, b }) => `#${
  [r, g, b].map((value) => Math.round(value).toString(16).padStart(2, '0')).join('').toUpperCase()
}`;

const mixColors = (firstColor, secondColor) => {
  const first = hexToRgb(firstColor);
  const second = hexToRgb(secondColor);

  return rgbToHex({
    r: (first.r + second.r) / 2,
    g: (first.g + second.g) / 2,
    b: (first.b + second.b) / 2,
  });
};

const getBlendPatches = (colors) => {
  const patches = [];

  for (let firstIndex = 0; firstIndex < colors.length; firstIndex += 1) {
    for (let secondIndex = firstIndex + 1; secondIndex < colors.length; secondIndex += 1) {
      const first = colors[firstIndex];
      const second = colors[secondIndex];
      const distance = Math.hypot(first.x - second.x, first.y - second.y);

      if (distance < BUBBLE_SIZE) {
        patches.push({
          id: `${first.id}-${second.id}`,
          first,
          second,
          color: mixColors(first.color, second.color),
          x: (first.x + second.x) / 2,
          y: (first.y + second.y) / 2,
        });
      }
    }
  }

  return patches;
};

const makeBubbles = () => Array.from({ length: 5 }).map((_, index) => ({
  id: Date.now() + index,
  color: generateHex(),
  x: Math.floor(Math.random() * 620) - 310,
  y: Math.floor(Math.random() * 330) - 165,
}));

export default function App() {
  const [bgColor, setBgColor] = useState('white');
  const [interactMode, setInteractMode] = useState('stack');
  const [bubbles, setBubbles] = useState(() => makeBubbles());
  const dragStart = useRef({});

  const shuffleAll = () => setBubbles(makeBubbles());
  const blendPatches = interactMode === 'blend' ? getBlendPatches(bubbles) : [];

  const updateSingle = (id) => {
    setBubbles((prev) => prev.map((bubble) => (
      bubble.id === id ? { ...bubble, color: generateHex() } : bubble
    )));
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden bg-black px-5 py-4 font-mono text-[#eafffb]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,163,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(0,245,255,0.07)_1px,transparent_1px)] bg-[size:42px_42px]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.18),rgba(0,0,0,0.72))]" />

      <div className="relative z-50 mb-5 flex flex-wrap items-start justify-center gap-5 border border-[#00f5ff]/70 bg-black/90 px-5 py-4 shadow-[0_0_32px_rgba(0,245,255,0.28),inset_0_0_22px_rgba(0,255,163,0.08)]">
        <div className="flex flex-col items-center gap-2">
          <span className="px-1 text-xs font-black uppercase text-[#00ffa3]">
            Tile Background
          </span>
          <div className="flex gap-2">
            {BACKGROUND_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setBgColor(option.id)}
                className={`min-w-20 border px-3 py-2 text-xs font-black uppercase transition-all ${
                  option.textClass
                } ${
                  bgColor === option.id
                    ? 'border-[#00ffa3] shadow-[0_0_18px_rgba(0,255,163,0.78)]'
                    : 'border-[#00f5ff]/30 opacity-70 hover:opacity-100'
                }`}
                style={{ backgroundColor: BACKGROUNDS[option.id] }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-20 w-px bg-[#00f5ff]/40" />

        <div className="flex flex-col items-center gap-2">
          <span className="px-1 text-xs font-black uppercase text-[#00ffa3]">
            Color Behavior
          </span>
          <div className="flex gap-2 border border-[#00f5ff]/30 bg-[#020403] p-1">
            {MODE_OPTIONS.map((mode) => (
              <button
                key={mode.id}
                type="button"
                title={mode.helper}
                onClick={() => setInteractMode(mode.id)}
                className={`flex min-w-28 flex-col items-center justify-center gap-1 border px-3 py-2 text-xs font-black uppercase transition-all ${
                  interactMode === mode.id
                    ? 'border-[#39ff14] bg-[#06120b] text-[#39ff14] shadow-[0_0_18px_rgba(57,255,20,0.55)]'
                    : 'border-transparent text-[#00f5ff]/70 hover:border-[#00f5ff]/50 hover:text-[#00f5ff]'
                }`}
              >
                <span className="flex items-center gap-2">
                  {mode.icon}
                  {mode.label}
                </span>
                <span className="text-[9px] font-bold normal-case text-[#eafffb]/60">
                  {mode.helper}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <motion.div
        animate={{ backgroundColor: BACKGROUNDS[bgColor] }}
        style={{ backgroundColor: BACKGROUNDS[bgColor] }}
        className="relative z-10 flex h-[76vh] w-[96vw] items-center justify-center overflow-hidden border border-[#00f5ff]/70 shadow-[0_0_55px_rgba(0,245,255,0.22),0_0_95px_rgba(57,255,20,0.12),inset_0_0_45px_rgba(0,255,163,0.08)]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_11px,rgba(0,245,255,0.08)_12px)] bg-[size:100%_12px]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[#39ff14] shadow-[0_0_22px_#39ff14]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[#00f5ff] shadow-[0_0_22px_#00f5ff]" />

        <AnimatePresence>
          {bubbles.map((bubble) => (
            <motion.div
              key={bubble.id}
              drag
              dragMomentum={false}
              onDragStart={() => {
                dragStart.current[bubble.id] = { x: bubble.x, y: bubble.y };
              }}
              onDragEnd={(_, info) => {
                const start = dragStart.current[bubble.id] ?? { x: bubble.x, y: bubble.y };
                const nextX = start.x + info.offset.x;
                const nextY = start.y + info.offset.y;

                setBubbles((prev) => prev.map((item) => (
                  item.id === bubble.id ? { ...item, x: nextX, y: nextY } : item
                )));
              }}
              initial={{ scale: 1, opacity: 1, x: bubble.x, y: bubble.y }}
              animate={{ scale: 1, opacity: 1, x: bubble.x, y: bubble.y }}
              whileDrag={{ scale: 1.06, zIndex: 100 }}
              style={{
                backgroundColor: bubble.color,
                color: bubble.color,
                width: BUBBLE_SIZE,
                height: BUBBLE_SIZE,
              }}
              className="group absolute flex cursor-grab flex-col items-center justify-center rounded-full border-2 border-black/70 active:cursor-grabbing"
            >
              <span className="select-none bg-black/90 px-3 py-1 text-xl font-black uppercase text-[#eafffb]">
                {bubble.color}
              </span>

              <div className="mt-5 flex translate-y-1 gap-3 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    updateSingle(bubble.id);
                  }}
                  className="border border-[#00f5ff]/60 bg-black/80 p-3 text-[#00f5ff] shadow-[0_0_14px_rgba(0,245,255,0.35)] transition-all hover:border-[#39ff14] hover:text-[#39ff14]"
                  aria-label="Refresh color"
                >
                  <RefreshCcw size={20} />
                </button>
                <button
                  type="button"
                  className="border border-[#00f5ff]/60 bg-black/80 p-3 text-[#00f5ff] shadow-[0_0_14px_rgba(0,245,255,0.35)] transition-all hover:border-[#39ff14] hover:text-[#39ff14]"
                  aria-label="Save color"
                >
                  <Heart size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {blendPatches.map((patch) => (
          <div
            key={patch.id}
            className="pointer-events-none absolute inset-0 z-40"
            style={{
              clipPath: `circle(${BUBBLE_RADIUS}px at calc(50% + ${patch.first.x}px) calc(50% + ${patch.first.y}px))`,
            }}
          >
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                backgroundColor: patch.color,
                clipPath: `circle(${BUBBLE_RADIUS}px at calc(50% + ${patch.second.x}px) calc(50% + ${patch.second.y}px))`,
              }}
            >
              <span
                className="absolute bg-black/90 px-2 py-1 text-sm font-black uppercase text-[#eafffb]"
                style={{
                  left: `calc(50% + ${patch.x}px)`,
                  top: `calc(50% + ${patch.y}px)`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {patch.color}
              </span>
            </div>
          </div>
        ))}
      </motion.div>

      <button
        type="button"
        onClick={shuffleAll}
        className="relative z-20 mt-5 border border-[#39ff14] bg-black px-14 py-4 text-xl font-black uppercase text-[#39ff14] shadow-[0_0_24px_rgba(57,255,20,0.42),inset_0_0_20px_rgba(57,255,20,0.1)] transition-all hover:border-[#00f5ff] hover:text-[#00f5ff] hover:shadow-[0_0_30px_rgba(0,245,255,0.5),inset_0_0_22px_rgba(0,245,255,0.12)] active:scale-95"
      >
        Chaos Shuffle
      </button>
    </div>
  );
}
