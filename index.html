<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>ONYX — AI Handwritten Diary</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;500&family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
    <style>
        :root {
            --onyx-bg: #0a0a0a;
            --onyx-paper: #111111;
            --onyx-ink: #e0e0ff;
            --onyx-ink-wet: #ffffff;
            --onyx-accent: #4f46e5;
            --onyx-line: rgba(255, 255, 255, 0.04);
            --onyx-margin: rgba(255, 100, 100, 0.08);
            --font-ui: 'Inter', sans-serif;
            --font-hand: 'Caveat', cursive;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            -webkit-tap-highlight-color: transparent;
        }

        body {
            background-color: var(--onyx-bg);
            color: #ffffff;
            font-family: var(--font-ui);
            overflow: hidden;
            height: 100vh;
            width: 100vw;
            display: flex;
            flex-direction: column;
        }

        /* Paper Texture Overlay */
        .noise {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            opacity: 0.03;
            z-index: 100;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3BaseFilter id='filter'%3BfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23filter)'/%3E%3C/svg%3E");
        }

        /* Header UI */
        header {
            padding: 1.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: 50;
            background: linear-gradient(to bottom, var(--onyx-bg), transparent);
        }

        .logo {
            font-weight: 600;
            letter-spacing: 0.1em;
            font-size: 0.8rem;
            text-transform: uppercase;
            color: rgba(255, 255, 255, 0.9);
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .logo::before {
            content: '';
            width: 8px;
            height: 8px;
            background: var(--onyx-accent);
            border-radius: 50%;
            box-shadow: 0 0 10px var(--onyx-accent);
        }

        .status-badge {
            font-size: 0.7rem;
            background: rgba(255, 255, 255, 0.05);
            padding: 0.3rem 0.6rem;
            border-radius: 100px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.6);
        }

        /* Diary Container */
        main {
            flex: 1;
            position: relative;
            overflow: hidden;
            cursor: text;
        }

        #notebook-container {
            width: 100%;
            height: 100%;
            position: relative;
            overflow-y: auto;
            scroll-behavior: smooth;
        }

        canvas {
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            pointer-events: none;
        }

        /* Invisible Input */
        #hidden-input {
            position: fixed;
            top: -100px;
            left: -100px;
            opacity: 0;
            pointer-events: none;
        }

        /* Footer UI */
        footer {
            padding: 1rem 1.5rem;
            font-size: 0.65rem;
            color: rgba(255, 255, 255, 0.3);
            text-align: center;
            letter-spacing: 0.05em;
            background: linear-gradient(to top, var(--onyx-bg), transparent);
            z-index: 50;
        }

        /* Interactive Elements */
        .controls {
            position: fixed;
            bottom: 3rem;
            right: 1.5rem;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            z-index: 60;
        }

        .btn-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: rgba(30, 30, 30, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            backdrop-filter: blur(10px);
            transition: all 0.2s ease;
        }

        .btn-icon:hover {
            background: rgba(50, 50, 50, 0.9);
            transform: translateY(-2px);
        }

        .btn-icon svg {
            width: 18px;
            height: 18px;
            opacity: 0.7;
        }

        /* Floating Pen Tip indicator */
        #pen-tip {
            position: fixed;
            width: 4px;
            height: 4px;
            background: var(--onyx-ink-wet);
            border-radius: 50%;
            box-shadow: 0 0 12px 2px var(--onyx-accent);
            pointer-events: none;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        /* Typing Hint */
        #hint {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: rgba(255, 255, 255, 0.15);
            font-size: 0.9rem;
            pointer-events: none;
            transition: opacity 0.5s ease;
            text-align: center;
            width: 100%;
        }

        @media (max-width: 600px) {
            .logo span { display: none; }
        }
    </style>
</head>
<body>
    <div class="noise"></div>
    <div id="pen-tip"></div>

    <header>
        <div class="logo">Onyx <span>&mdash; Private Journal</span></div>
        <div class="status-badge">E2E Encrypted • Offline</div>
    </header>

    <main id="capture-zone">
        <div id="hint">Tap anywhere to write your thoughts...</div>
        <div id="notebook-container">
            <!-- Layers: 1. Static/Dried 2. Active/Wet -->
            <canvas id="static-canvas"></canvas>
            <canvas id="active-canvas"></canvas>
        </div>
        <textarea id="hidden-input" autocomplete="off" spellcheck="false"></textarea>
    </main>

    <div class="controls">
        <button class="btn-icon" id="btn-clear" title="Clear Page">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6"/></svg>
        </button>
        <button class="btn-icon" id="btn-sound" title="Toggle Sound">
            <svg id="sound-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
        </button>
    </div>

    <footer>
        ONYX — Offline. Private. No Cloud.
    </footer>

    <script>
        /**
         * ONYX — Core Engine
         */
        const config = {
            lineHeight: 42,
            leftPadding: 60,
            rightPadding: 40,
            topPadding: 80,
            fontSize: 28,
            inkColor: 'rgba(224, 224, 255, 0.85)',
            wetInkColor: 'rgba(255, 255, 255, 1)',
            handwritingSpeed: 120, // ms per char
            jitterScale: 0.6,
            rotationScale: 0.02,
        };

        const state = {
            text: localStorage.getItem('onyx_journal') || "",
            renderedCount: 0,
            lastRenderedTime: 0,
            cursor: { x: config.leftPadding, y: config.topPadding },
            queue: [],
            isTyping: false,
            soundEnabled: false,
            canvasWidth: 0,
            canvasHeight: 0,
            pixelRatio: window.devicePixelRatio || 1
        };

        const staticCanvas = document.getElementById('static-canvas');
        const activeCanvas = document.getElementById('active-canvas');
        const sCtx = staticCanvas.getContext('2d');
        const aCtx = activeCanvas.getContext('2d');
        const hiddenInput = document.getElementById('hidden-input');
        const container = document.getElementById('notebook-container');
        const penTip = document.getElementById('pen-tip');
        const hint = document.getElementById('hint');

        // Layout Calculation
        function calculateLayout(text) {
            const words = text.split('');
            let x = config.leftPadding;
            let y = config.topPadding;
            const maxWidth = state.canvasWidth - config.rightPadding;
            
            return words.map((char, i) => {
                const metrics = sCtx.measureText(char);
                const charWidth = metrics.width + (Math.random() * 2 - 1);

                if (char === '\n' || x + charWidth > maxWidth) {
                    x = config.leftPadding;
                    y += config.lineHeight;
                }

                const res = {
                    char,
                    x,
                    y,
                    width: charWidth,
                    // Deterministic randomness based on index and character code
                    rotation: (Math.sin(i * 13 + char.charCodeAt(0)) * config.rotationScale),
                    jitterX: (Math.cos(i * 7) * config.jitterScale),
                    jitterY: (Math.sin(i * 11) * config.jitterScale)
                };

                if (char !== '\n') x += charWidth;
                return res;
            });
        }

        function resize() {
            state.canvasWidth = window.innerWidth;
            state.canvasHeight = Math.max(window.innerHeight, (calculateLayout(state.text).pop()?.y || 0) + 200);
            
            [staticCanvas, activeCanvas].forEach(canvas => {
                canvas.width = state.canvasWidth * state.pixelRatio;
                canvas.height = state.canvasHeight * state.pixelRatio;
                canvas.style.width = `${state.canvasWidth}px`;
                canvas.style.height = `${state.canvasHeight}px`;
            });

            sCtx.scale(state.pixelRatio, state.pixelRatio);
            aCtx.scale(state.pixelRatio, state.pixelRatio);
            
            sCtx.font = `${config.fontSize}px ${getComputedStyle(document.body).getPropertyValue('--font-hand')}`;
            aCtx.font = sCtx.font;

            drawPaperDecorations();
            redrawStatic();
        }

        function drawPaperDecorations() {
            sCtx.save();
            // Vertical Margin Line
            sCtx.beginPath();
            sCtx.strokeStyle = 'rgba(255, 100, 100, 0.08)';
            sCtx.moveTo(45, 0);
            sCtx.lineTo(45, state.canvasHeight);
            sCtx.stroke();

            // Horizontal Rule Lines
            sCtx.beginPath();
            sCtx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
            for (let y = config.topPadding + 8; y < state.canvasHeight; y += config.lineHeight) {
                sCtx.moveTo(0, y);
                sCtx.lineTo(state.canvasWidth, y);
            }
            sCtx.stroke();
            sCtx.restore();
        }

        function drawChar(ctx, item, color, opacity = 1) {
            if (item.char === '\n') return;
            ctx.save();
            ctx.globalAlpha = opacity;
            ctx.fillStyle = color;
            ctx.translate(item.x + item.jitterX, item.y + item.jitterY);
            ctx.rotate(item.rotation);
            ctx.fillText(item.char, 0, 0);
            ctx.restore();
        }

        function redrawStatic() {
            sCtx.clearRect(0, 0, state.canvasWidth, state.canvasHeight);
            drawPaperDecorations();
            const layout = calculateLayout(state.text);
            // Only draw characters that are already "dried"
            layout.slice(0, state.renderedCount).forEach(item => {
                drawChar(sCtx, item, config.inkColor);
            });
        }

        function update() {
            const now = Date.now();
            const layout = calculateLayout(state.text);

            if (state.renderedCount < layout.length) {
                if (now - state.lastRenderedTime > config.handwritingSpeed) {
                    const item = layout[state.renderedCount];
                    
                    // Trigger sound if enabled
                    if (state.soundEnabled && item.char !== ' ' && item.char !== '\n') {
                        playPenSound();
                    }

                    // Move virtual pen tip
                    state.cursor = { x: item.x, y: item.y };
                    penTip.style.transform = `translate(${item.x}px, ${item.y - 15}px)`;
                    penTip.style.opacity = '1';

                    // Animate "wet ink" logic
                    state.renderedCount++;
                    state.lastRenderedTime = now;

                    // Ensure we scroll to the bottom if typing
                    if (state.isTyping) {
                        const targetScroll = Math.max(0, item.y - window.innerHeight / 2);
                        if (Math.abs(container.scrollTop - targetScroll) > 50) {
                            container.scrollTop = targetScroll;
                        }
                    }

                    // If it was the last character, draw to static eventually
                    // To keep it performant, we only redraw static when we add a char
                    redrawStatic();
                }
            } else {
                penTip.style.opacity = '0';
            }

            // Active Layer Animation (Wet Ink pulse / cursor)
            aCtx.clearRect(0, 0, state.canvasWidth, state.canvasHeight);
            if (state.renderedCount > 0 && state.renderedCount <= layout.length) {
                const lastItem = layout[state.renderedCount - 1];
                // Pulsing wet ink effect for the newest character
                const pulse = (Math.sin(now / 150) * 0.2) + 0.8;
                drawChar(aCtx, lastItem, config.wetInkColor, pulse);
            }

            requestAnimationFrame(update);
        }

        // Sound Engine (Subtle synthesized scratch)
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        function playPenSound() {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(Math.random() * 200 + 400, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.05);
            gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
            gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.05);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.05);
        }

        // Event Listeners
        window.addEventListener('resize', resize);
        
        document.getElementById('capture-zone').addEventListener('click', () => {
            hiddenInput.focus();
            hint.style.opacity = '0';
        });

        hiddenInput.addEventListener('input', (e) => {
            const oldLength = state.text.length;
            state.text = e.target.value;
            localStorage.setItem('onyx_journal', state.text);
            state.isTyping = true;

            // Handle backspace or deletions
            if (state.text.length < oldLength) {
                state.renderedCount = Math.min(state.renderedCount, state.text.length);
                redrawStatic();
            }

            // Adjust height if needed
            const layout = calculateLayout(state.text);
            const lastY = layout.pop()?.y || 0;
            if (lastY + 300 > state.canvasHeight) {
                resize();
            }
        });

        document.getElementById('btn-clear').addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm('Burn these pages? This cannot be undone.')) {
                state.text = "";
                state.renderedCount = 0;
                hiddenInput.value = "";
                localStorage.removeItem('onyx_journal');
                redrawStatic();
                hint.style.opacity = '1';
                container.scrollTop = 0;
            }
        });

        document.getElementById('btn-sound').addEventListener('click', (e) => {
            e.stopPropagation();
            state.soundEnabled = !state.soundEnabled;
            const icon = document.getElementById('sound-icon');
            if (state.soundEnabled) {
                icon.innerHTML = '<path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>';
                if (audioCtx.state === 'suspended') audioCtx.resume();
            } else {
                icon.innerHTML = '<path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6"/>';
            }
        });

        // Initialize
        function init() {
            hiddenInput.value = state.text;
            if (state.text.length > 0) {
                hint.style.opacity = '0';
                // Initially show existing text instantly or fast
                state.renderedCount = state.text.length;
            }
            resize();
            update();
        }

        // Handle font loading before starting
        document.fonts.ready.then(init);

    </script>
</body>
</html>
