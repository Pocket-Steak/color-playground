import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw, Heart, Layers, SwatchBook, Maximize2 } from 'lucide-react';

const BACKGROUNDS = {
  white: '#FFFFFF',
  zinc900: '#18181b', 
  zinc950: '#09090b', 
  black: '#000000'
};

const BUBBLE_SIZE = 144; 
const FONT_SIZE = '1.75rem'; 

export default function App() {
  const [bgColor, setBgColor] = useState('zinc900');
  const [interactMode, setInteractMode] = useState('stack');
  const [bubbles, setBubbles] = useState([]);

  const generateHex = () => `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;

  const shuffleAll = () => {
    setBubbles(Array.from({ length: 4 }).map((_, i) => ({
      id: Date.now() + i,
      color: generateHex(),
      x: Math.floor(Math.random() * 800) - 400,
      y: Math.floor(Math.random() * 500) - 250,
    })));
  };

  useEffect(() => { shuffleAll(); }, []);

  const updateSingle = (id) => {
    setBubbles(prev => prev.map(b => b.id === id ? { ...b, color: generateHex() } : b));
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#000000] text-zinc-100 font-mono overflow-hidden">
      
      <div className="mb-6 flex gap-12 bg-zinc-950/80 backdrop-blur-2xl p-6 rounded-[2rem] border border-zinc-700/50 shadow-2xl z-50">
        <div className="flex flex-col items-center gap-2">
          <span className="text-[12px] font-black uppercase tracking-widest text-zinc-400 px-1">Canvas Background</span>
          <div className="flex gap-4">
            {Object.keys(BACKGROUNDS).map(key => (
              <button 
                key={key}
                onClick={() => setBgColor(key)}
                className={`w-10 h-10 rounded-full border-2 transition-all ${bgColor === key ? 'border-cyan-400 scale-125 shadow-[0_0_20px_rgba(34,211,238,0.7)]' : 'border-zinc-700'}`}
                style={{ backgroundColor: BACKGROUNDS[key] }}
              />
            ))}
          </div>
        </div>

        <div className="w-[2px] bg-zinc-700/50 my-2" />

        <div className="flex flex-col items-center gap-2">
          <span className="text-[12px] font-black uppercase tracking-widest text-zinc-400 px-1">Interaction Mode</span>
          <div className="flex gap-3 bg-black/40 p-2 rounded-xl border border-zinc-700/50">
            {[
              { id: 'stack', icon: <Layers size={24}/>, label: 'Standard Stack' },
              { id: 'blend', icon: <SwatchBook size={24}/>, label: 'Color Blend' },
              { id: 'snap', icon: <Maximize2 size={24}/>, label: 'Grid Snap' }
            ].map(mode => (
              <button 
                key={mode.id}
                onClick={() => setInteractMode(mode.id)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all ${interactMode === mode.id ? 'bg-zinc-800 text-green-400 shadow-lg shadow-green-400/30' : 'text-zinc-500 hover:text-cyan-400'}`}
              >
                {mode.icon}
                <span className="text-[10px] font-bold uppercase tracking-tight text-center">{mode.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <motion.div 
        animate={{ backgroundColor: BACKGROUNDS[bgColor] }}
        className="relative w-[95vw] h-[80vh] rounded-[3.5rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden border-2 border-zinc-700/50 flex items-center justify-center"
      >
        <AnimatePresence>
          {bubbles.map((bubble) => (
            <motion.div
              key={bubble.id}
              drag
              dragMomentum={false}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, x: bubble.x, y: bubble.y }}
              exit={{ scale: 0, opacity: 0 }}
              whileDrag={{ scale: 1.05, zIndex: 100 }}
              style={{ 
                backgroundColor: bubble.color,
                mixBlendMode: interactMode === 'blend' ? 'difference' : 'normal',
                width: `${BUBBLE_SIZE}px`,
                height: `${BUBBLE_SIZE}px`
              }}
              className="absolute rounded-full flex flex-col items-center justify-center shadow-[0_25px_60px_rgba(0,0,0,0.4)] border-4 border-zinc-800/80 cursor-grab active:cursor-grabbing group transition-colors duration-500"
            >
              <span 
                style={{ fontSize: FONT_SIZE }}
                className="font-mono font-black text-center mix-blend-difference text-zinc-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] select-none uppercase tracking-tighter"
              >
                {bubble.color}
              </span>
              
              <div className="flex gap-4 mt-8 opacity-0 group-hover:opacity-100 transition-all translate-y-3 group-hover:translate-y-0">
                <button 
                  onClick={(e) => { e.stopPropagation(); updateSingle(bubble.id); }} 
                  className="bg-black/40 hover:bg-cyan-400/20 backdrop-blur-md p-4 rounded-full text-zinc-200 border border-zinc-700/50 transition-all active:scale-90"
                >
                  <RefreshCcw size={28}/>
                </button>
                <button className="bg-black/40 hover:bg-green-400/20 backdrop-blur-md p-4 rounded-full text-zinc-200 border border-zinc-700/50 transition-all active:scale-90">
                  <Heart size={28}/>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <button 
        onClick={shuffleAll}
        className="mt-8 px-20 py-6 bg-zinc-950 text-cyan-400 rounded-2xl font-black text-3xl tracking-tighter hover:bg-green-400 hover:text-black hover:shadow-[0_0_30px_rgba(0,255,0,0.8)] transition-all shadow-xl active:scale-95 uppercase border-4 border-cyan-400/30"
      >
        Chaos Shuffle [RTRN]
      </button>
    </div>
  );
}