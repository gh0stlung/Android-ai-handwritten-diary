import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Calendar, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  PenTool, 
  MoreHorizontal,
  X,
  Save,
  Moon
} from 'lucide-react';

/**
 * ANDROID AI HANDWRITTEN DIARY - PROTOTYPE
 * * Core Features implemented:
 * 1. Invisible Text Input: Captures keystrokes.
 * 2. Procedural Handwriting Engine: Renders text to Canvas with 'human' noise.
 * 3. Paper Texture Generation: Digital noise + CSS gradients.
 * 4. UI/UX: Dark mode launch, minimal toolbar, FAB menu.
 */

// --- Constants & Config ---
const APP_CONFIG = {
  PAGE_MARGIN_TOP: 60,
  PAGE_MARGIN_LEFT: 24, // Red line position
  PAGE_MARGIN_RIGHT: 20,
  LINE_HEIGHT: 32,
  FONT_SIZE: 24,
  INK_COLORS: [
    { name: 'Midnight Blue', value: '#1a237e' },
    { name: 'Charcoal Black', value: '#212121' },
    { name: 'Vintage Brown', value: '#3e2723' },
    { name: 'Forest Green', value: '#1b5e20' },
  ],
  FONTS: [
    { name: 'Casual', family: 'Indie Flower' },
    { name: 'Cursive', family: 'Cedarville Cursive' },
    { name: 'Rushed', family: 'Reenie Beanie' },
  ]
};

// --- Helper: Generate Paper Noise ---
// Creates a subtle noise texture for realism
const createNoiseTexture = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  const iData = ctx.createImageData(width, height);
  const buffer32 = new Uint32Array(iData.data.buffer);
  const len = buffer32.length;
  for (let i = 0; i < len; i++) {
    if (Math.random() < 0.1) {
      buffer32[i] = 0x10000000; // Slight noise
    }
  }
  ctx.putImageData(iData, 0, 0);
};

export default function App() {
  const [appState, setAppState] = useState<'LAUNCH' | 'NOTEBOOK'>('LAUNCH');
  const [text, setText] = useState<string>("Dear Diary,\n\nToday I started working on the new Android project. The goal is to make digital writing feel distinctively analog. \n\nIt's fascinating how much character is lost in standard typography. I want to bring that back.");
  const [inkColor, setInkColor] = useState(APP_CONFIG.INK_COLORS[0].value);
  const [fontStyle, setFontStyle] = useState(APP_CONFIG.FONTS[0].family);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [date, setDate] = useState(new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }));

  // --- Launch Screen Animation ---
  useEffect(() => {
    if (appState === 'LAUNCH') {
      const timer = setTimeout(() => {
        setAppState('NOTEBOOK');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [appState]);

  if (appState === 'LAUNCH') {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full bg-neutral-900 text-neutral-100 animate-in fade-in duration-1000">
        <div className="mb-6 opacity-80">
          <PenTool size={64} strokeWidth={1} />
        </div>
        <h1 className="text-2xl font-serif tracking-widest uppercase letter-spacing-4">Nostalgia</h1>
        <p className="text-xs text-neutral-500 mt-4 tracking-widest">AI HANDWRITING ENGINE</p>
        <div className="mt-12 w-12 h-1 bg-neutral-800 rounded-full overflow-hidden">
          <div className="h-full bg-neutral-600 animate-pulse w-full origin-left"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col bg-stone-100 overflow-hidden font-sans text-neutral-800 relative">
      {/* Hidden Fonts Loader */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cedarville+Cursive&family=Indie+Flower&family=Reenie+Beanie&display=swap');
          ::selection { background: rgba(0,0,0,0.1); }
        `}
      </style>

      {/* --- Top Toolbar --- */}
      <header className="flex items-center justify-between px-4 py-3 bg-stone-100 border-b border-stone-200 z-20 shadow-sm relative">
        <div className="flex items-center gap-4 text-stone-600">
          <Calendar size={20} className="hover:text-stone-900 cursor-pointer transition-colors" />
          <span className="text-sm font-medium tracking-wide text-stone-500 uppercase">{date}</span>
        </div>
        <div className="flex items-center gap-4 text-stone-600">
          <ChevronLeft size={20} className="hover:text-stone-900 cursor-pointer" />
          <span className="text-xs font-semibold">PG 14</span>
          <ChevronRight size={20} className="hover:text-stone-900 cursor-pointer" />
          <Settings size={20} className="ml-2 hover:text-stone-900 cursor-pointer" />
        </div>
      </header>

      {/* --- Main Writing Surface --- */}
      <main className="flex-1 relative overflow-hidden bg-stone-200 flex justify-center">
        {/* The "Physical" Notebook Page */}
        <div className="w-full max-w-3xl h-full bg-[#fdfbf7] shadow-2xl relative overflow-hidden animate-in slide-in-from-bottom-4 duration-700">
          
          {/* Paper Texture Layers */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}></div>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_80px_rgba(0,0,0,0.05)]"></div>

          {/* Canvas Renderer */}
          <HandwritingCanvas 
            text={text} 
            setText={setText}
            inkColor={inkColor}
            fontStyle={fontStyle}
          />
        </div>
      </main>

      {/* --- Floating Action Button (FAB) --- */}
      <div className="absolute bottom-8 right-8 z-30">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${isMenuOpen ? 'bg-stone-800 text-white rotate-45' : 'bg-white text-stone-800 hover:scale-105'}`}
        >
          {isMenuOpen ? <X size={24} /> : <PenTool size={24} />}
        </button>

        {/* Radial Menu Options */}
        <div className={`absolute bottom-16 right-0 transition-all duration-300 origin-bottom-right ${isMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}>
          <div className="flex flex-col gap-3 items-end mb-4">
            
            {/* Color Picker */}
            <div className="bg-white p-3 rounded-xl shadow-lg border border-stone-100">
              <span className="text-xs text-stone-400 font-bold uppercase mb-2 block tracking-wider">Ink</span>
              <div className="flex gap-2">
                {APP_CONFIG.INK_COLORS.map(c => (
                  <button 
                    key={c.value}
                    onClick={() => setInkColor(c.value)}
                    className={`w-6 h-6 rounded-full border-2 ${inkColor === c.value ? 'border-stone-400 scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: c.value }}
                  />
                ))}
              </div>
            </div>

            {/* Style Picker */}
            <div className="bg-white p-3 rounded-xl shadow-lg border border-stone-100">
              <span className="text-xs text-stone-400 font-bold uppercase mb-2 block tracking-wider">Style</span>
              <div className="flex flex-col gap-1">
                {APP_CONFIG.FONTS.map(f => (
                  <button
                    key={f.name}
                    onClick={() => setFontStyle(f.family)}
                    className={`text-left px-2 py-1 rounded text-sm ${fontStyle === f.family ? 'bg-stone-100 text-stone-900 font-bold' : 'text-stone-500'}`}
                    style={{ fontFamily: f.family }}
                  >
                    {f.name} Style
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}

// --- Handwriting Engine Component ---
function HandwritingCanvas({ text, setText, inkColor, fontStyle }: { 
  text: string, 
  setText: (s: string) => void,
  inkColor: string,
  fontStyle: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize canvas and redraw on window resize
  useEffect(() => {
    const handleResize = () => requestAnimationFrame(render);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Redraw whenever inputs change
  useEffect(() => {
    render();
  }, [text, inkColor, fontStyle]);

  const render = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Set canvas resolution to device pixel ratio for sharpness
    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);

    // 1. Draw Page Layout (Lines & Margins)
    drawPageStructure(ctx, rect.width, rect.height);

    // 2. Render Text (The "AI" Engine)
    renderHandwriting(ctx, text, rect.width);
  };

  const drawPageStructure = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Background Lines
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.2)'; // Light blue/grey lines
    ctx.lineWidth = 1;

    let y = APP_CONFIG.PAGE_MARGIN_TOP;
    while (y < height) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      y += APP_CONFIG.LINE_HEIGHT;
    }
    ctx.stroke();

    // Margin Line (Red)
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.15)'; // Faint red
    ctx.lineWidth = 1.5;
    ctx.moveTo(APP_CONFIG.PAGE_MARGIN_LEFT + 40, 0); // 40px padding for visual margin
    ctx.lineTo(APP_CONFIG.PAGE_MARGIN_LEFT + 40, height);
    ctx.stroke();
  };

  const renderHandwriting = (ctx: CanvasRenderingContext2D, textContent: string, width: number) => {
    ctx.fillStyle = inkColor;
    ctx.font = `${APP_CONFIG.FONT_SIZE}px "${fontStyle}"`;
    ctx.textBaseline = 'alphabetic'; // Align to the line bottom

    const marginLeft = APP_CONFIG.PAGE_MARGIN_LEFT + 50; // Start after margin line
    const maxWidth = width - marginLeft - APP_CONFIG.PAGE_MARGIN_RIGHT;
    
    let cursorX = marginLeft;
    let cursorY = APP_CONFIG.PAGE_MARGIN_TOP - (APP_CONFIG.LINE_HEIGHT * 0.3); // Adjust to sit on line

    // Split into paragraphs to handle newlines
    const paragraphs = textContent.split('\n');
    
    // Seeded random for consistency during re-renders (simple approximation)
    // We use index-based pseudo-randomness to keep jitter consistent per character position
    let charIndex = 0;

    paragraphs.forEach((paragraph, pIndex) => {
      // If it's not the first paragraph, move down a line for the newline char
      if (pIndex > 0) {
        cursorY += APP_CONFIG.LINE_HEIGHT;
        cursorX = marginLeft;
      }

      const words = paragraph.split(' ');

      words.forEach((word, wIndex) => {
        const wordWidth = ctx.measureText(word).width;

        // Wrap word if it exceeds line
        if (cursorX + wordWidth > marginLeft + maxWidth) {
          cursorY += APP_CONFIG.LINE_HEIGHT;
          cursorX = marginLeft;
        }

        // Draw character by character for "Human" Jitter
        for (let i = 0; i < word.length; i++) {
          const char = word[i];
          
          // AI Logic: Procedural Jitter
          // Based on charIndex to ensure the same letter always looks the same in this session 
          // (prevents 'shaking' while typing elsewhere)
          const jitterX = Math.sin(charIndex * 12.3) * 0.5; 
          const jitterY = Math.cos(charIndex * 45.6) * 1.5; // Baseline jitter
          const rotate = Math.sin(charIndex * 7.8) * 0.05; // Slight rotation
          const sizeVar = 1 + (Math.sin(charIndex * 99) * 0.05); // Slight size variation

          ctx.save();
          ctx.translate(cursorX + jitterX, cursorY + jitterY);
          ctx.rotate(rotate);
          ctx.scale(sizeVar, sizeVar);
          
          ctx.globalAlpha = 0.85 + (Math.cos(charIndex) * 0.1); // Ink flow variation
          
          ctx.fillText(char, 0, 0);
          ctx.restore();

          // Advance cursor
          const charWidth = ctx.measureText(char).width;
          cursorX += charWidth;
          charIndex++;
        }

        // Add space after word
        cursorX += ctx.measureText(' ').width;
        charIndex++; // Increment for the space
      });
    });
    
    // Draw "Cursor" (Pen Tip)
    // We only draw this if the textarea is focused (simulated here by always drawing it at end)
    ctx.beginPath();
    ctx.fillStyle = inkColor;
    ctx.arc(cursorX, cursorY - 5, 2, 0, Math.PI * 2);
    ctx.fill();
  };

  const focusInput = () => {
    textAreaRef.current?.focus();
  };

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full relative cursor-text group" 
      onClick={focusInput}
    >
      <canvas 
        ref={canvasRef} 
        className="block w-full h-full touch-none"
      />
      {/* Invisible Text Area to capture mobile/desktop input */}
      <textarea
        ref={textAreaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="absolute top-0 left-0 w-full h-full opacity-0 resize-none z-10 text-base"
        style={{ fontSize: '16px' }} // Prevent iOS zoom
        spellCheck={false}
      />
    </div>
  );
}

