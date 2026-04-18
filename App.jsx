import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw, Heart, Layers, SwatchBook, Maximize2 } from 'lucide-react';

const BACKGROUNDS = {
  white: '#FFFFFF',
  zinc900: '#18181b', 
  zinc950: '#09090b', 
  black: '#000000'
};

const BUBBLE_SIZE = 180; 
const FONT_SIZE = '1.8rem'; 

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
      
      {/* HUD: Controls */}
      <div className="mb-6 flex gap-12 bg-zinc-950/90 backdrop-blur-2xl p-6 rounded-[2rem] border border-zinc-700/50 shadow-[0_0_40px_rgba(0,0,0,0.7)] z-50">
        <div className="flex flex-col items-center gap-2">
          <span className="text-[12px] font-black uppercase tracking-widest text-zinc-400">Canvas Background</span>
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
          <span className="text-[12px] font-black uppercase tracking-widest text-zinc-400">Interaction Mode</span>
          <div className="flex gap-3 bg-black/40 p-2 rounded-xl border border-zinc-700/50">
            {[
              { id: 'stack', icon: <Layers size={24}/>, label: 'Stack' },
              { id: 'blend', icon: <SwatchBook size={24}/>, label: 'Blend' },
              { id: 'snap', icon: <Maximize2 size={24}/>, label: 'Snap' }
            ].map(mode => (
              <button 
                key={mode.id}
                onClick={() => setInteractMode(mode.id)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${interactMode === mode.id ? 'bg-zinc-800 text-green-400 shadow-lg shadow-green-400/30' : 'text-zinc-500 hover:text-cyan-400'}`}
              >
                {mode.icon}
                <span className="text-[9px] font-bold uppercase tracking-tight">{mode.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <motion.div 
        animate={{ backgroundColor: BACKGROUNDS[bgColor] }}
        className="relative w-[96vw] h-[78vh] rounded-[4rem] shadow-[0_0_100px_rgba(0,0,0,0.9)] overflow-hidden border-2 border-zinc-700/50 flex items-center justify-center cursor-crosshair"
      >
        <AnimatePresence>
          {bubbles.map((bubble) => (
            <motion.div
              key={bubble.id}
              drag
              dragMomentum={false}
              initial={{ scale: 0 }}
              animate={{ scale: 1, x: bubble.x, y: bubble.y }}
              whileDrag={{ scale: 1.1, zIndex: 100 }}
              style={{ 
                backgroundColor: bubble.color,
                mixBlendMode: interactMode === 'blend' ? 'difference' : 'normal',
                width: `${BUBBLE_SIZE}px`,
                height: `${BUBBLE_SIZE}px`
              }}
              className="absolute rounded-full flex flex-col items-center justify-center shadow-2xl border-4 border-black/20 group transition-colors"
            >
              <span 
                style={{ fontSize: FONT_SIZE }}
                className="font-mono font-black mix-blend-difference text-white select-none uppercase"
              >
                {bubble.color}
              </span>
              
              <div className="flex gap-4 mt-8 opacity-0 group-hover:opacity-100 transition-all">
                <button onClick={(e) => { e.stopPropagation(); updateSingle(bubble.id); }} className="bg-black/60 p-4 rounded-full text-white border border-white/20"><RefreshCcw size={28}/></button>
                <button className="bg-black/60 p-4 rounded-full text-white border border-white/20"><Heart size={28}/></button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <button 
        onClick={shuffleAll}
        className="mt-8 px-24 py-7 bg-zinc-950 text-cyan-400 rounded-3xl font-black text-4xl tracking-tighter hover:bg-green-400 hover:text-black hover:shadow-[0_0_40px_rgba(0,255,0,0.6)] transition-all border-4 border-cyan-400/20 shadow-2xl"
      >
        CHAOS SHUFFLE
      </button>
    </div>
  );
}