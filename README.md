# ✍️ ONYX — AI Handwritten Diary

![Status](https://img.shields.io/badge/status-active-brightgreen)
![WIP](https://img.shields.io/badge/work_in_progress-yes-orange)
![Offline](https://img.shields.io/badge/offline-first-blue)
![Privacy](https://img.shields.io/badge/privacy-zero_tracking-success)
![License](https://img.shields.io/badge/license-MIT-lightgrey)
![Platform](https://img.shields.io/badge/platform-mobile--first-black)
![Tech](https://img.shields.io/badge/tech-Canvas%20%7C%20JS-purple)

**ONYX** is a **dark-mode, offline-first AI handwritten diary engine** that converts typed text into **realistic handwriting** using a high-performance **HTML5 Canvas renderer**.

Built for **mobile**, **privacy**, and **zero backend** usage.

> No cloud. No accounts. No tracking.

---

## 🎬 Live Engine Preview (Placeholder)

> Current GIFs represent developer reaction after making this shit. 

### ✏️ Typing → Handwriting
![Typing Preview](https://media.giphy.com/media/l3q2K5jinAlChoCLS/giphy.gif) 

### 🖋️ Stroke & Ink Effect
![Ink Preview](https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif)

### 🎯 Cursor Physics
![Cursor Preview](https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif)

---

## ✨ Why ONYX?
- Looks like **real handwriting**, not a font
- Runs **entirely offline**
- Feels like a **physical notebook**
- Built with **pure Canvas**, no heavy frameworks
- Designed for **journaling, notes, and diaries**

---

## ✨ Highlights
- Realistic handwritten text rendering
- Physics-based pen & cursor motion
- Ink jitter, stroke variation & drying
- Premium notebook UI (dark paper)
- Android-optimized, mobile-first
- 100% offline — no servers, no tracking

---

## 🧠 Core Features
- **Typed → Handwritten simulation**
- **Dual-layer Canvas engine**
  - Static layer → dried ink
  - Active layer → wet ink & cursor
- Deterministic handwriting (stable redraws)
- High-DPI (Retina) support
- Invisible input trap (native keyboard feel)
- Smooth 60 FPS animation loop

---

## 🧱 System Architecture

USER ↓ ONYX Diary Engine ↓ Canvas Renderer (Static + Active) ↓ Local Memory (No Cloud)

**No servers. No accounts. No analytics.**

---

## ⚙️ Tech Stack

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-323330?logo=javascript&logoColor=F7DF1E)
![Canvas](https://img.shields.io/badge/Canvas-000000)

**Fonts**
- ✍️ Caveat — handwriting
- 🧠 Inter — UI

---

## 🚧 Work in Progress
The engine is **actively evolving**. Planned work:

 - [ ] Improve stroke randomness realism
- [ ] Page save / load system
- [ ] Export pages as images / PDF
- [ ] Mobile gesture refinements
- [ ] Performance tuning on low-end devices

Expect **frequent updates**.

---

## 📂 Project Structure

/ ├── index.html              # App entry point (bootstraps ONYX engine) ├── assets/ │   ├── gifs/               # Preview / reaction GIFs │   ├── fonts/              # Handwriting + UI fonts │   └── textures/           # Paper grain, ink noise (planned) ├── engine/ │   ├── core/ │   │   ├── canvas.js       # Canvas setup & DPI handling │   │   ├── loop.js         # 60 FPS render loop │   │   └── state.js        # Engine state management │   ├── handwriting/ │   │   ├── strokes.js      # Stroke generation logic │   │   ├── jitter.js       # Ink randomness & variation │   │   └── physics.js      # Pen pressure & motion physics │   ├── layers/ │   │   ├── static.js       # Dried ink layer │   │   └── active.js       # Wet ink & cursor layer │   └── utils/ │       ├── math.js         # Noise, interpolation helpers │       └── constants.js    # Engine constants ├── ui/ │   ├── notebook.css        # Dark paper styling │   ├── toolbar.js          # UI controls (planned) │   └── input.js            # Invisible input trap ├── docs/ │   └── architecture.md     # Engine design notes ├── README.md └── LICENSE

---

## 🌐 Live Demo
🔗 https://gh0stlung.github.io/Android-ai-handwritten-diary/
_No build step required._

---

## 🔒 Privacy & Security
- Fully offline
- No cloud sync
- No tracking
- No telemetry

---

⭐ **If you find this interesting, consider starring the repo.**  
It helps visibility and motivates further development.


