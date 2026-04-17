import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw, Heart, Layers, SwatchBook, Maximize2 } from 'lucide-react';

const BACKGROUNDS = {
  white: '#FFFFFF',
  gray: '#404040',
  black: '#000000'
};

export default function App() {
  const [bgColor, setBgColor] = useState('gray');
  const [interactMode, setInteractMode] = useState('stack');
  const [bubbles, setBubbles] = useState([]);

  const generateHex = () => `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;

  const shuffleAll = () => {
    setBubbles(Array.from({ length: 4 }).map((_, i) => ({
      id: Date.now() + i,
      color: generateHex(),
      // Larger scatter range for the bigger canvas
      x: Math.floor(Math.random() * 600) - 300,
      y: Math.floor(Math.random() * 400) - 200,
    })));
  };

  useEffect(() => { shuffleAll(); }, []);

  const updateSingle = (id) => {
    setBubbles(prev => prev.map(b => b.id === id ? { ...b, color: generateHex() } : b));
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#050505] text-white font-sans overflow-hidden">
      
      {/* Top Controls: Better Contrast */}
      <div className="mb-6 flex gap-8 bg-zinc-900/80 backdrop-blur-2xl p-5 rounded-[2rem] border border-white/20 shadow-2xl z-50">
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Canvas</span>
          <div className="flex gap-3">
            {Object.keys(BACKGROUNDS).map(key => (
              <button 
                key={key}
                onClick={() => setBgColor(key)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${bgColor === key ? 'border-blue-500 scale-125 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'border-white/10 opacity-40 hover:opacity-100'}`}
                style={{ backgroundColor: BACKGROUNDS[key] }}
              />
            ))}
          </div>
        </div>

        <div className="w-[1px] bg-white/10 my-2" />

        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Mode</span>
          <div className="flex gap-2 bg-black/40 p-1 rounded-xl border border-white/5">
            {[
              { id: 'stack', icon: <Layers size={20}/> },
              { id: 'blend', icon: <SwatchBook size={20}/> },
              { id: 'snap', icon: <Maximize2 size={20}/> }
            ].map(mode => (
              <button 
                key={mode.id}
                onClick={() => setInteractMode(mode.id)}
                className={`p-2.5 rounded-lg transition-all ${interactMode === mode.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40' : 'text-zinc-500 hover:text-white'}`}
              >
                {mode.icon}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* The Workspace: Much Larger */}
      <motion.div 
        animate={{ backgroundColor: BACKGROUNDS[bgColor] }}
        className="relative w-[95vw] h-[75vh] rounded-[3rem] shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden border border-white/10 flex items-center justify-center"
      >
        <AnimatePresence>
          {bubbles.map((bubble) => (
            <motion.div
              key={bubble.id}
              drag
              dragMomentum={false}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, x: bubble.x, y: bubble.y }}
              whileDrag={{ scale: 1.05, zIndex: 100 }}
              style={{ 
                backgroundColor: bubble.color,
                mixBlendMode: interactMode === 'blend' ? 'difference' : 'normal',
              }}
              className="absolute w-64 h-64 rounded-full flex flex-col items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 cursor-grab active:cursor-grabbing group transition-colors duration-500"
            >
              <span className="font-mono font-black text-2xl mix-blend-difference text-white drop-shadow-md select-none">
                {bubble.color.toUpperCase()}
              </span>
              
              <div className="flex gap-3 mt-6 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                <button 
                  onClick={(e) => { e.stopPropagation(); updateSingle(bubble.id); }} 
                  className="bg-black/30 hover:bg-black/60 backdrop-blur-md p-3 rounded-full text-white border border-white/10 transition-all active:scale-90"
                >
                  <RefreshCcw size={22}/>
                </button>
                <button className="bg-black/30 hover:bg-black/60 backdrop-blur-md p-3 rounded-full text-white border border-white/10 transition-all active:scale-90">
                  <Heart size={22}/>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Shuffle Button: High Contrast */}
      <button 
        onClick={shuffleAll}
        className="mt-8 px-16 py-5 bg-white text-black rounded-2xl font-black text-2xl tracking-tighter hover:bg-blue-500 hover:text-white transition-all shadow-xl active:scale-95 uppercase border-4 border-white/10"
      >
        Chaos Shuffle
      </button>
    </div>
  );
}