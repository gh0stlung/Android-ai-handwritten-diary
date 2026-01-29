import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// --- Configuration ---
const CONFIG = {
  lineHeight: 48,
  leftPadding: 80,
  rightPadding: 60,
  topPadding: 120,
  fontSize: 32,
  inkColor: 'rgba(235, 235, 255, 0.9)',
  wetInkColor: '#ffffff',
  aiInkColor: 'rgba(129, 140, 248, 0.8)',
  writeSpeed: 20,
  historyKey: 'onyx_v4_store',
  paperStyles: ['lined', 'dotted', 'blank'] as const,
};

type Mood = 'Neutral' | 'Serene' | 'Intense' | 'Melancholy' | 'Radiant';
type PaperStyle = typeof CONFIG.paperStyles[number];

interface Entry {
  id: string;
  timestamp: number;
  text: string;
  reflection: string;
  mood: Mood;
  imageUrl?: string;
}

const MOOD_THEMES: Record<Mood, { accent: string; aura: string; secondary: string }> = {
  Neutral: { accent: '#6366f1', aura: 'rgba(99, 102, 241, 0.05)', secondary: '#4338ca' },
  Serene: { accent: '#10b981', aura: 'rgba(16, 185, 129, 0.05)', secondary: '#059669' },
  Intense: { accent: '#ef4444', aura: 'rgba(239, 68, 68, 0.05)', secondary: '#dc2626' },
  Melancholy: { accent: '#a855f7', aura: 'rgba(168, 85, 247, 0.05)', secondary: '#9333ea' },
  Radiant: { accent: '#f59e0b', aura: 'rgba(245, 158, 11, 0.05)', secondary: '#d97706' },
};

// --- AI Service ---
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const OnyxApp: React.FC = () => {
  // --- State ---
  const [history, setHistory] = useState<Entry[]>(() => {
    const saved = localStorage.getItem(CONFIG.historyKey);
    return saved ? JSON.parse(saved) : [];
  });
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [reflection, setReflection] = useState("");
  const [mood, setMood] = useState<Mood>('Neutral');
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [renderedCount, setRenderedCount] = useState(0);
  const [paperStyle, setPaperStyle] = useState<PaperStyle>('lined');
  
  // --- Refs ---
  const staticCanvasRef = useRef<HTMLCanvasElement>(null);
  const activeCanvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const lastRenderTime = useRef<number>(0);
  const audioCtx = useRef<AudioContext | null>(null);
  const pixelRatio = window.devicePixelRatio || 1;

  // --- Audio ---
  const playPenTick = useCallback(() => {
    if (!audioCtx.current) return;
    const osc = audioCtx.current.createOscillator();
    const gain = audioCtx.current.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(Math.random() * 100 + 300, audioCtx.current.currentTime);
    osc.frequency.exponentialRampToValueAtTime(10, audioCtx.current.currentTime + 0.02);
    gain.gain.setValueAtTime(0.005, audioCtx.current.currentTime);
    gain.gain.linearRampToValueAtTime(0, audioCtx.current.currentTime + 0.02);
    osc.connect(gain);
    gain.connect(audioCtx.current.destination);
    osc.start();
    osc.stop(audioCtx.current.currentTime + 0.02);
  }, []);

  // --- Handwriting Layout ---
  const fullContent = useMemo(() => {
    return text + (reflection ? "\n\n" + reflection : "");
  }, [text, reflection]);

  const layout = useMemo(() => {
    const chars: any[] = [];
    let x = CONFIG.leftPadding;
    let y = CONFIG.topPadding;
    const canvasWidth = window.innerWidth;
    const maxWidth = canvasWidth - CONFIG.rightPadding;

    const ctx = document.createElement('canvas').getContext('2d')!;
    ctx.font = `${CONFIG.fontSize}px 'Caveat'`;

    const letters = fullContent.split('');
    letters.forEach((char, i) => {
      const isAi = i >= text.length + 2;
      const metrics = ctx.measureText(char);
      const w = metrics.width;

      if (char === '\n' || x + w > maxWidth) {
        x = CONFIG.leftPadding;
        y += CONFIG.lineHeight;
      }

      chars.push({
        char, x, y, w, isAi,
        rotation: (Math.sin(i * 1.7) * 0.04),
        jx: Math.cos(i * 0.5) * 0.6,
        jy: Math.sin(i * 0.9) * 0.6,
        pressure: 0.8 + Math.random() * 0.4 // Fake pressure for line weight
      });

      if (char !== '\n') x += w;
    });
    return chars;
  }, [fullContent, text.length]);

  // --- Rendering ---
  const drawPaper = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.save();
    if (paperStyle === 'lined') {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let ly = CONFIG.topPadding + 10; ly < h; ly += CONFIG.lineHeight) {
        ctx.beginPath(); ctx.moveTo(0, ly); ctx.lineTo(w, ly); ctx.stroke();
      }
    } else if (paperStyle === 'dotted') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
      for (let ly = CONFIG.topPadding; ly < h; ly += CONFIG.lineHeight) {
        for (let lx = CONFIG.leftPadding; lx < w; lx += CONFIG.lineHeight) {
          ctx.beginPath(); ctx.arc(lx, ly, 1, 0, Math.PI * 2); ctx.fill();
        }
      }
    }
    // Margin line
    ctx.strokeStyle = 'rgba(255, 100, 100, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(65, 0); ctx.lineTo(65, h); ctx.stroke();
    ctx.restore();
  }, [paperStyle]);

  const redrawStatic = useCallback(() => {
    const canvas = staticCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const w = canvas.width / pixelRatio;
    const h = canvas.height / pixelRatio;

    ctx.clearRect(0, 0, w, h);
    drawPaper(ctx, w, h);

    ctx.font = `${CONFIG.fontSize}px 'Caveat'`;
    layout.slice(0, renderedCount).forEach(item => {
      if (item.char === '\n' || item.char === ' ') return;
      ctx.save();
      ctx.fillStyle = item.isAi ? CONFIG.aiInkColor : CONFIG.inkColor;
      ctx.globalAlpha = item.isAi ? 0.7 : 0.95;
      ctx.translate(item.x + item.jx, item.y + item.jy);
      ctx.rotate(item.rotation);
      ctx.fillText(item.char, 0, 0);
      // Faint double-stroke for extra "ink" feel
      if (!item.isAi) {
        ctx.fillText(item.char, 0.3, 0.3);
      }
      ctx.restore();
    });
  }, [layout, renderedCount, pixelRatio, drawPaper]);

  // --- Main Loop ---
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = Math.max(window.innerHeight, (layout[layout.length - 1]?.y || 0) + 500);
      [staticCanvasRef.current, activeCanvasRef.current].forEach(c => {
        if (!c) return;
        c.width = w * pixelRatio;
        c.height = h * pixelRatio;
        c.style.width = `${w}px`;
        c.style.height = `${h}px`;
        const ctx = c.getContext('2d')!;
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      });
      redrawStatic();
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [layout, renderedCount, redrawStatic, pixelRatio]);

  useEffect(() => {
    let frameId: number;
    const tick = () => {
      const now = Date.now();
      if (renderedCount < layout.length && now - lastRenderTime.current > CONFIG.writeSpeed) {
        setRenderedCount(c => c + 1);
        lastRenderTime.current = now;
        playPenTick();
      }

      const aCanvas = activeCanvasRef.current;
      if (aCanvas) {
        const ctx = aCanvas.getContext('2d')!;
        const w = aCanvas.width / pixelRatio;
        const h = aCanvas.height / pixelRatio;
        ctx.clearRect(0, 0, w, h);
        if (renderedCount > 0 && renderedCount <= layout.length) {
          const last = layout[renderedCount - 1];
          ctx.font = `${CONFIG.fontSize}px 'Caveat'`;
          ctx.fillStyle = CONFIG.wetInkColor;
          ctx.shadowBlur = 12;
          ctx.shadowColor = MOOD_THEMES[mood].accent;
          ctx.save();
          ctx.translate(last.x + last.jx, last.y + last.jy);
          ctx.rotate(last.rotation);
          ctx.fillText(last.char, 0, 0);
          ctx.restore();
          
          // Floating pen tip
          ctx.beginPath();
          ctx.arc(last.x + last.w, last.y - 10, 2, 0, Math.PI * 2);
          ctx.fillStyle = MOOD_THEMES[mood].accent;
          ctx.fill();
        }
      }
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [layout, renderedCount, mood, playPenTick, pixelRatio]);

  // --- Logic ---
  const saveEntry = (data: Partial<Entry>) => {
    const id = currentId || Date.now().toString();
    const entry: Entry = {
      id,
      timestamp: Date.now(),
      text,
      reflection,
      mood,
      imageUrl,
      ...data
    };
    const updated = [entry, ...history.filter(e => e.id !== id)];
    setHistory(updated);
    localStorage.setItem(CONFIG.historyKey, JSON.stringify(updated));
    setCurrentId(id);
  };

  const handleReflect = async () => {
    if (!text || isGenerating) return;
    setIsGenerating(true);
    if (!audioCtx.current) audioCtx.current = new AudioContext();

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze this diary entry: "${text}". Provide a 2-sentence poetic reflection. Categorize mood: Neutral, Serene, Intense, Melancholy, Radiant. Format JSON: {"r": "reflection", "m": "Mood"}`,
        config: { responseMimeType: "application/json" }
      });
      const res = JSON.parse(response.text || "{}");
      setReflection(res.r);
      if (res.m) setMood(res.m as Mood);
      saveEntry({ reflection: res.r, mood: res.m as Mood });
    } catch (e) {
      setReflection("The ink speaks in silence. Listen to the gaps between words.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateMemory = async () => {
    if (!text || isGeneratingImage) return;
    setIsGeneratingImage(true);
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: `A conceptual, moody, cinematic illustration of this journal entry's soul: "${text}". Style: dark, ethereal, high contrast, ink and charcoal wash, dream-like.` }] }
      });
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const b64 = part.inlineData.data;
          const url = `data:image/png;base64,${b64}`;
          setImageUrl(url);
          saveEntry({ imageUrl: url });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const deleteEntry = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm("Permanently erase this memory?")) {
      const updated = history.filter(item => item.id !== id);
      setHistory(updated);
      localStorage.setItem(CONFIG.historyKey, JSON.stringify(updated));
      if (currentId === id) createNew();
    }
  };

  const createNew = () => {
    setText(""); setReflection(""); setMood('Neutral'); setImageUrl(undefined);
    setCurrentId(null); setRenderedCount(0); setIsSidebarOpen(false);
  };

  const loadEntry = (e: Entry) => {
    setText(e.text); setReflection(e.reflection); setMood(e.mood); setImageUrl(e.imageUrl);
    setCurrentId(e.id);
    setRenderedCount(e.text.length + (e.reflection ? e.reflection.length + 2 : 0));
    setIsSidebarOpen(false);
  };

  const currentTheme = MOOD_THEMES[mood];

  return (
    <div style={{
      width: '100vw', height: '100vh', background: '#080808', color: '#fff',
      display: 'flex', position: 'relative', overflow: 'hidden', fontFamily: 'Inter, sans-serif'
    }}>
      {/* Dynamic Background */}
      <div style={{
        position: 'fixed', inset: 0, transition: 'background 2s ease', pointerEvents: 'none',
        background: `radial-gradient(circle at 50% 50%, ${currentTheme.aura} 0%, transparent 80%)`,
        zIndex: 1
      }} />
      <div style={{
        position: 'fixed', inset: 0, opacity: 0.05, pointerEvents: 'none', zIndex: 2,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3BaseFilter id='filter'%3BfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23filter)'/%3E%3C/svg%3E")`
      }} />

      {/* Sidebar */}
      <aside style={{
        width: '320px', height: '100%', background: 'rgba(12,12,12,0.95)',
        borderRight: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(30px)',
        position: 'absolute', left: isSidebarOpen ? 0 : -320, top: 0, zIndex: 100,
        transition: 'left 0.5s cubic-bezier(0.16, 1, 0.3, 1)', padding: '40px 24px',
        display: 'flex', flexDirection: 'column'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '0.7rem', opacity: 0.4, letterSpacing: '0.25em' }}>ARCHIVES</h2>
          <button onClick={() => setIsSidebarOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.5 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        
        <button onClick={createNew} style={{
          padding: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px', color: '#fff', cursor: 'pointer', marginBottom: '30px', fontWeight: 500
        }}>+ New Entry</button>

        <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none' }}>
          {history.length === 0 && <div style={{ textAlign: 'center', opacity: 0.2, fontSize: '0.8rem', marginTop: '40px' }}>No entries yet.</div>}
          {history.map(item => (
            <div key={item.id} onClick={() => loadEntry(item)} style={{
              padding: '16px', borderRadius: '14px', cursor: 'pointer', marginBottom: '10px',
              background: currentId === item.id ? 'rgba(255,255,255,0.04)' : 'transparent',
              border: `1px solid ${currentId === item.id ? MOOD_THEMES[item.mood].accent : 'transparent'}`,
              transition: 'all 0.2s', position: 'relative'
            }}>
              <div style={{ fontSize: '0.7rem', opacity: 0.4, marginBottom: '4px' }}>{new Date(item.timestamp).toLocaleDateString()}</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 400, opacity: 0.8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.text || "Untitled"}
              </div>
              <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '5px' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: MOOD_THEMES[item.mood].accent }} />
                <button onClick={(e) => deleteEntry(e, item.id)} style={{ background: 'none', border: 'none', color: '#ff4444', opacity: 0, padding: 0, cursor: 'pointer', transition: 'opacity 0.2s' }} className="delete-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Container */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', zIndex: 10 }}>
        <header style={{ padding: '30px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button onClick={() => setIsSidebarOpen(true)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.6 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            </button>
            <div style={{ fontWeight: 600, letterSpacing: '0.15em', fontSize: '0.9rem', color: '#fff' }}>ONYX V4</div>
          </div>
          
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            {CONFIG.paperStyles.map(s => (
              <button key={s} onClick={() => setPaperStyle(s)} style={{
                background: paperStyle === s ? 'rgba(255,255,255,0.1)' : 'transparent',
                border: 'none', color: '#fff', cursor: 'pointer', fontSize: '0.6rem', padding: '4px 8px', borderRadius: '4px', textTransform: 'uppercase', opacity: paperStyle === s ? 1 : 0.4
              }}>{s}</button>
            ))}
            <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.1)' }} />
            <div style={{ fontSize: '0.7rem', color: currentTheme.accent, fontWeight: 700, letterSpacing: '0.1em' }}>{mood.toUpperCase()}</div>
          </div>
        </header>

        <main 
          onClick={() => inputRef.current?.focus()}
          style={{ flex: 1, overflowY: 'auto', position: 'relative', scrollbarWidth: 'none' }}
        >
          <div style={{ position: 'relative', minHeight: '100%' }}>
            {text.length === 0 && (
              <div style={{ position: 'absolute', top: CONFIG.topPadding, left: CONFIG.leftPadding, fontSize: '1.4rem', opacity: 0.08, pointerEvents: 'none', fontStyle: 'italic' }}>
                Capture your soul's shadow...
              </div>
            )}
            <canvas ref={staticCanvasRef} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }} />
            <canvas ref={activeCanvasRef} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }} />
            
            {imageUrl && (
              <div style={{ 
                position: 'absolute', top: (layout[layout.length-1]?.y || 0) + 100, left: CONFIG.leftPadding,
                maxWidth: '400px', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '20px',
                border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', animation: 'fadeIn 2s ease'
              }}>
                <img src={imageUrl} alt="Memory Fragment" style={{ width: '100%', borderRadius: '12px' }} />
                <div style={{ fontSize: '0.6rem', opacity: 0.3, marginTop: '8px', textAlign: 'center' }}>MEMORY FRAGMENT GENERATED</div>
              </div>
            )}
          </div>
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => {
              const val = e.target.value;
              if (val.length < text.length) setRenderedCount(Math.min(renderedCount, val.length));
              setText(val); setReflection(""); setImageUrl(undefined); setMood('Neutral');
            }}
            style={{ position: 'fixed', top: -100, left: -100, opacity: 0 }}
          />
        </main>

        <footer style={{ 
          padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'linear-gradient(to top, #080808, transparent)', gap: '20px'
        }}>
          <div style={{ fontSize: '0.6rem', opacity: 0.2, letterSpacing: '0.1em' }}>
            ONYX ENGINE • PRIVATE. ENCRYPTED. IMMERSIVE.
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={handleGenerateMemory}
              disabled={!text || isGeneratingImage}
              style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                color: isGeneratingImage ? 'rgba(255,255,255,0.2)' : '#fff', borderRadius: '100px',
                padding: '10px 20px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 500
              }}
            >
              {isGeneratingImage ? 'Visualizing...' : 'Visual Memory'}
            </button>
            <button 
              onClick={handleReflect}
              disabled={!text || isGenerating}
              style={{
                background: isGenerating ? 'transparent' : currentTheme.accent,
                color: '#fff', border: isGenerating ? `1px solid ${currentTheme.accent}` : 'none',
                padding: '10px 28px', borderRadius: '100px', cursor: 'pointer',
                fontSize: '0.8rem', fontWeight: 600, boxShadow: isGenerating ? 'none' : `0 4px 20px ${currentTheme.aura}`
              }}
            >
              {isGenerating ? 'Analyzing...' : 'Reflect'}
            </button>
          </div>
        </footer>
      </div>

      <style>{`
        @font-face {
          font-family: 'Caveat';
          src: url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap');
        }
        main::-webkit-scrollbar { display: none; }
        .delete-btn { opacity: 0; }
        [key]:hover .delete-btn { opacity: 0.6; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(<OnyxApp />);
