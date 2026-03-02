# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server:** `pnpm dev`
- **Build (typecheck + bundle):** `pnpm build`
- **Typecheck only:** `pnpm tsc --noEmit`
- **Preview production build:** `pnpm preview`

No test framework is configured.

## Architecture

Shogi (Japanese chess) timer web app built with React 19 + Vite + TypeScript (strict mode).

### State Management

Single Zustand store (`src/store.ts`) manages all game state: player times, byoyomi, turn count, game status (idle/running/paused). Persisted to localStorage via `zustand/middleware/persist` under key `"shogi-timer-storage"`. Sound side-effects (`src/sound.ts`) are called directly from the store's `tick()` action.

### Game Flow

1. **Idle** → tap a panel to start (tapped player passes turn, opponent becomes active)
2. **Running** → active player's time decrements each second via `setInterval` in `App.tsx`; tapping the active panel switches turns
3. When main time hits 0, byoyomi begins; byoyomi resets each turn
4. Pause/resume controls in top bar; settings menu has initialize (with confirmation)

### Sound System

`src/sound.ts` uses Web Audio API (AudioContext + OscillatorNode). Beeps trigger at: main time < 1 minute, every 10s in byoyomi, every second under 10s. Errors are surfaced via `alert()`.

### Styling

Plain CSS in `src/index.css`. Touch-optimized (no user-select, manipulation touch-action). `clsx` for conditional class composition in components.
