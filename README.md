# shogi-timer

A web-based Shogi (Japanese chess) timer with sound alerts and byoyomi support.

<img width="1316" height="891" alt="image" src="https://github.com/user-attachments/assets/b1f8686d-452f-446c-8ee3-550610c62285" />

<img width="1323" height="878" alt="image" src="https://github.com/user-attachments/assets/0ce1bab3-f31c-4905-bf5a-c540f375926d" />

## Features

- **Main time + Byoyomi** — configurable initial time and byoyomi per player
- **Touch-optimized UI** — tap your panel to end your turn; designed for mobile and tablet use
- **Turn counter** — displays the current move number
- **Sound alerts** — beeps when main time drops below 1 minute, every 10 seconds in byoyomi, and every second under 10 seconds (Web Audio API)
- **Sound test** — verify audio works on your device from the settings menu
- **Pause / Resume** — pause and resume the game at any time
- **Initialize with confirmation** — reset the game from settings, with a confirmation dialog when a game is in progress
- **State persistence** — game state is saved to localStorage and restored on reload

## Tech Stack

- React 19 + TypeScript (strict mode)
- Vite
- Zustand (state management with localStorage persistence)

## Getting Started

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
pnpm preview
```

