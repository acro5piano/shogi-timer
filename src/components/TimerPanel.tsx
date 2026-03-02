import { useGameStore } from "../store";

function formatTime(seconds: number): string {
  const m = Math.max(0, Math.floor(seconds / 60));
  const s = Math.max(0, seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function TimerPanel({ player }: { player: 1 | 2 }) {
  const mainTime = useGameStore((s) =>
    player === 1 ? s.player1Time : s.player2Time,
  );
  const byoyomi = useGameStore((s) =>
    player === 1 ? s.player1Byoyomi : s.player2Byoyomi,
  );
  const activePlayer = useGameStore((s) => s.activePlayer);
  const gameStatus = useGameStore((s) => s.gameStatus);
  const switchTurn = useGameStore((s) => s.switchTurn);

  const isActive = activePlayer === player && gameStatus === "running";
  const isTimeUp = mainTime <= 0 && byoyomi <= 0;

  const handleClick = () => {
    switchTurn(player);
  };

  return (
    <button
      type="button"
      className={`timer-panel player-${player} ${isActive ? "active" : ""} ${isTimeUp ? "time-up" : ""}`}
      onClick={handleClick}
    >
      <div className="time-display">
        <span className="main-time">{formatTime(mainTime)}</span>
        <span className="byoyomi-time">{formatTime(byoyomi)}</span>
      </div>
    </button>
  );
}
