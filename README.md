# 🧠 Memory Matrix Challenge

A production-grade, cyberpunk-themed pattern memory game built with React + Vite. Test your short-term memory by reproducing increasingly complex grid patterns before the timer runs out.

![Memory Matrix Challenge](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react) ![Vite](https://img.shields.io/badge/Vite-5.2-646CFF?style=flat-square&logo=vite) ![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss) ![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-FF0055?style=flat-square)

---

## 📸 Overview

The game flashes a pattern of highlighted cells on a grid for a few seconds. Your job: memorize every lit cell and click them back in any order. One wrong click ends the game. Survive long enough and the grid grows from 3×3 all the way to 6×6 with progressively longer patterns.

---

## ✨ Features

- **Difficulty Progression** — Grid scales from 3×3 → 4×4 → 5×5 → 6×6 as you level up, with pattern length growing alongside
- **Dual Timer System** — A circular countdown during memorization, plus a 15-second recall timer with audio ticks
- **Streak System** — Consecutive correct rounds build a streak multiplier displayed in the navbar
- **Speed-Based Scoring** — Faster answers earn bonus points; score formula: `(100 × level) + max(0, (15 − elapsed) × 10)`
- **Mistake Heatmap** — Game Over screen renders a 6×6 heatmap where cell color intensity reflects how many times you clicked it incorrectly
- **Dark / Light Mode** — Toggle persisted to `localStorage`; cyberpunk dark theme ships by default
- **Framer Motion Animations** — Cell reveals, grid transitions, level-up burst, page transitions, staggered cell entry
- **Web Audio Sounds** — Procedurally generated tones (no audio files); click, reveal, correct, wrong, level-up, and tick sounds
- **Responsive UI** — Fluid cell sizing works on any screen from 320 px mobile to 4K desktop
- **Persistent Records** — High score and best streak survive page refresh via `localStorage`

---

## 🗂️ Project Structure

```
memory-matrix/
├── index.html                  # App shell + Google Fonts
├── package.json
├── vite.config.js
├── tailwind.config.js          # Custom fonts, neon colors, keyframes
├── postcss.config.js
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx                # ReactDOM entry point
    ├── App.jsx                 # Root — providers + page routing by phase
    ├── index.css               # Tailwind layers + CSS variables + cell states
    │
    ├── context/
    │   ├── GameContext.jsx     # useReducer store — all game state & timers
    │   └── ThemeContext.jsx    # Dark/light toggle with localStorage sync
    │
    ├── components/
    │   ├── Navbar.jsx          # Fixed top bar: logo, live stats, theme toggle
    │   ├── Cell.jsx            # Individual grid cell with ripple + sound
    │   ├── Grid.jsx            # Responsive N×N grid with scan-line overlay
    │   ├── Timer.jsx           # Circular SVG arc countdown (memorize + recall)
    │   ├── ProgressBar.jsx     # Tier progress bar with streak & score labels
    │   ├── StatusBanner.jsx    # Phase announcement pill (Study / Recall / ✅)
    │   ├── GameOver.jsx        # Overlay with score cards, heatmap, restart
    │   ├── Heatmap.jsx         # 6×6 mistake-frequency color grid + legend
    │   └── ParticlesBg.jsx     # CSS-animated ambient floating particles
    │
    ├── hooks/
    │   └── useSound.js         # Web Audio API procedural SFX hook
    │
    ├── pages/
    │   ├── Home.jsx            # Title screen with animated live mini-grid preview
    │   └── Game.jsx            # Main gameplay layout composing all game components
    │
    └── utils/
        └── gameUtils.js        # Pure helpers: grid size, pattern gen, scoring, heatmap color, localStorage
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher (ships with Node 18)

### Installation

```bash
# 1. Extract the downloaded zip
unzip memory-matrix-challenge.zip
cd memory-matrix

# 2. Install all dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Other Commands

```bash
# Production build (outputs to /dist)
npm run build

# Preview the production build locally
npm run preview
```

---

## 🎮 How to Play

1. Press **START GAME** on the home screen
2. Watch the grid — cyan cells will light up for 2–3 seconds
3. When the grid goes dark, click every cell that was highlighted
4. Click them all correctly → **Level Up** with a larger grid and longer pattern
5. Click a wrong cell → **Game Over**
6. Beat your high score and longest streak!

### Controls

| Action | Input |
|---|---|
| Select a cell | Click / Tap |
| Keyboard select | `Tab` to focus, `Enter` to select |
| Toggle dark mode | Sun/Moon button in navbar |
| View rules | "HOW TO PLAY" button on home screen |

---

## 🏗️ Architecture

### State Machine (GameContext)

The game runs through a strict phase sequence managed by `useReducer`:

```
IDLE → MEMORIZE → RECALL → VALIDATING → LEVEL_UP → MEMORIZE → ...
                                                          ↓
                                                      GAME_OVER
```

| Phase | Duration | Description |
|---|---|---|
| `IDLE` | Until player starts | Home screen |
| `MEMORIZE` | 2–3 seconds (shrinks with level) | Pattern is shown |
| `RECALL` | Up to 15 seconds | Player clicks cells |
| `VALIDATING` | 0.8 seconds | Flash correct result |
| `LEVEL_UP` | 0.9 seconds | Burst animation, load next level |
| `GAME_OVER` | Until restart | Final screen |

### Scoring Formula

```js
score = (100 × level) + max(0, floor((15 − elapsedSeconds) × 10))
```

A level-1 answer in 2 seconds earns `100 + 130 = 230` points. A level-5 answer at the buzzer earns exactly `500`.

### Grid & Pattern Scaling

| Levels | Grid | Max Pattern |
|---|---|---|
| 1–3 | 3×3 (9 cells) | up to ~5 cells |
| 4–6 | 4×4 (16 cells) | up to ~9 cells |
| 7–9 | 5×5 (25 cells) | up to ~14 cells |
| 10+ | 6×6 (36 cells) | up to ~20 cells |

---

## 🎨 Design System

The app uses **CSS custom properties** for full dark/light theming with zero flickering:

```css
/* Core neon palette */
--neon-cyan:   #00f5ff
--neon-purple: #bf00ff
--neon-green:  #00ff88
--neon-red:    #ff3366
--neon-yellow: #ffee00
```

**Typography:**
- Display / headings: `Orbitron` (Google Fonts)
- Body: `DM Sans`
- Monospace / stats: `JetBrains Mono`

**Cell visual states:** `idle → revealed (cyan) → selected → correct (green) / wrong (red)`

---

## 🔊 Sound System

All sounds are generated via the **Web Audio API** — no `.mp3` or `.ogg` files required. The `useSound` hook lazily creates an `AudioContext` on first user gesture (browser policy compliant) and exposes:

| Function | Trigger | Character |
|---|---|---|
| `playClick` | Correct cell selected | Soft 880 Hz sine tick |
| `playReveal` | Pattern shown | Ascending 4-note arpeggio |
| `playCorrect` | All cells matched | Triumphant major chord |
| `playWrong` | Wrong cell clicked | Low sawtooth buzzer |
| `playLevelUp` | Level transition | 5-note fanfare |
| `playTick` | Last 5 seconds of timer | High square-wave click |

---

## 🧩 Key Dependencies

| Package | Version | Purpose |
|---|---|---|
| `react` | ^18.3 | UI framework |
| `react-dom` | ^18.3 | DOM renderer |
| `framer-motion` | ^11.0 | Animations & transitions |
| `vite` | ^5.2 | Build tool & dev server |
| `tailwindcss` | ^3.4 | Utility CSS framework |
| `autoprefixer` | ^10.4 | CSS vendor prefixes |
| `postcss` | ^8.4 | CSS processing pipeline |

---

## 🛠️ Customisation

### Change answer timer duration
In `src/context/GameContext.jsx`, update the constant:
```js
const ANSWER_TIMEOUT = 15  // seconds; set to 0 to disable
```

### Adjust difficulty curve
In `src/utils/gameUtils.js`:
```js
// Grid size thresholds
export function getGridSize(level) {
  if (level <= 3)  return 3   // ← change thresholds here
  if (level <= 6)  return 4
  if (level <= 9)  return 5
  return 6
}

// Pattern length per level
export function getPatternLength(level) {
  const base  = 3   // ← minimum cells to memorize
  const extra = level - 1  // ← +1 cell per level
  ...
}
```

### Disable sounds
Simply don't call the sound functions in `Game.jsx` and `Cell.jsx`, or add a mute toggle to `ThemeContext`.

---

## 📱 Browser Support

| Browser | Support |
|---|---|
| Chrome 90+ | ✅ Full |
| Firefox 88+ | ✅ Full |
| Safari 14+ | ✅ Full |
| Edge 90+ | ✅ Full |
| Mobile Chrome/Safari | ✅ Full |

> Web Audio API requires a user gesture before playing sounds — the first click on the game grid satisfies this requirement automatically.

---

## 📄 License

MIT — free to use, modify, and distribute.

---

*Built with React 18 + Framer Motion + Tailwind CSS + Web Audio API*
