import { create } from "zustand";
import { persist } from "zustand/middleware";

type Player = 1 | 2;

type GameStatus = "idle" | "running" | "paused";

interface GameState {
  initialTimeSeconds: number;
  byoyomiSeconds: number;

  player1Time: number;
  player2Time: number;
  player1Byoyomi: number;
  player2Byoyomi: number;
  activePlayer: Player | null;
  turnCount: number;
  gameStatus: GameStatus;

  switchTurn: (player: Player) => void;
  tick: () => void;
  pause: () => void;
  resume: () => void;
  initialize: () => void;
  setInitialTime: (seconds: number) => void;
  setByoyomi: (seconds: number) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      initialTimeSeconds: 300,
      byoyomiSeconds: 30,

      player1Time: 300,
      player2Time: 300,
      player1Byoyomi: 30,
      player2Byoyomi: 30,
      activePlayer: null,
      turnCount: 0,
      gameStatus: "idle" as GameStatus,

      switchTurn: (player: Player) => {
        const state = get();
        if (state.gameStatus === "paused") return;

        if (state.gameStatus === "idle") {
          // First move: the tapped player ends their turn, opponent becomes active
          const nextPlayer: Player = player === 1 ? 2 : 1;
          set({
            gameStatus: "running",
            activePlayer: nextPlayer,
            turnCount: 1,
          });
          return;
        }

        // Only the active player can switch
        if (state.activePlayer !== player) return;

        const nextPlayer: Player = player === 1 ? 2 : 1;

        // Reset byoyomi for the player who just moved (if they were in byoyomi)
        const byoyomiKey =
          player === 1 ? "player1Byoyomi" : "player2Byoyomi";
        const timeKey = player === 1 ? "player1Time" : "player2Time";
        const updates: Partial<GameState> = {
          activePlayer: nextPlayer,
          turnCount: state.turnCount + 1,
        };

        // If player's main time is 0, reset their byoyomi for next turn
        if (state[timeKey] <= 0) {
          updates[byoyomiKey] = state.byoyomiSeconds;
        }

        set(updates);
      },

      tick: () => {
        const state = get();
        if (state.gameStatus !== "running" || state.activePlayer === null)
          return;

        const timeKey =
          state.activePlayer === 1 ? "player1Time" : "player2Time";
        const byoyomiKey =
          state.activePlayer === 1 ? "player1Byoyomi" : "player2Byoyomi";

        if (state[timeKey] > 0) {
          set({ [timeKey]: state[timeKey] - 1 });
        } else if (state[byoyomiKey] > 0) {
          set({ [byoyomiKey]: state[byoyomiKey] - 1 });
        }
        // When byoyomi reaches 0, time is up (player loses on time)
      },

      pause: () => {
        if (get().gameStatus === "running") {
          set({ gameStatus: "paused" });
        }
      },

      resume: () => {
        if (get().gameStatus === "paused") {
          set({ gameStatus: "running" });
        }
      },

      initialize: () => {
        const state = get();
        set({
          player1Time: state.initialTimeSeconds,
          player2Time: state.initialTimeSeconds,
          player1Byoyomi: state.byoyomiSeconds,
          player2Byoyomi: state.byoyomiSeconds,
          activePlayer: null,
          turnCount: 0,
          gameStatus: "idle",
        });
      },

      setInitialTime: (seconds: number) => {
        set({
          initialTimeSeconds: seconds,
          player1Time: seconds,
          player2Time: seconds,
        });
      },

      setByoyomi: (seconds: number) => {
        set({
          byoyomiSeconds: seconds,
          player1Byoyomi: seconds,
          player2Byoyomi: seconds,
        });
      },
    }),
    {
      name: "shogi-timer-storage",
      partialize: (state) => ({
        initialTimeSeconds: state.initialTimeSeconds,
        byoyomiSeconds: state.byoyomiSeconds,
        player1Time: state.player1Time,
        player2Time: state.player2Time,
        player1Byoyomi: state.player1Byoyomi,
        player2Byoyomi: state.player2Byoyomi,
        activePlayer: state.activePlayer,
        turnCount: state.turnCount,
        gameStatus: state.gameStatus,
      }),
    },
  ),
);
