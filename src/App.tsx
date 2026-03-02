import { useEffect, useState } from "react";
import { TimerPanel } from "./components/TimerPanel";
import { SettingsMenu } from "./components/SettingsMenu";
import { useGameStore } from "./store";

export function App() {
  const [showSettings, setShowSettings] = useState(false);
  const tick = useGameStore((s) => s.tick);
  const gameStatus = useGameStore((s) => s.gameStatus);
  const turnCount = useGameStore((s) => s.turnCount);
  const pause = useGameStore((s) => s.pause);
  const resume = useGameStore((s) => s.resume);

  useEffect(() => {
    if (gameStatus !== "running") return;
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [gameStatus, tick]);

  return (
    <div className="app">
      <div className="top-bar">
        <button
          type="button"
          className="settings-toggle"
          onClick={() => setShowSettings(true)}
        >
          設定
        </button>
        {gameStatus === "running" && (
          <button type="button" className="pause-btn" onClick={pause}>
            一時停止
          </button>
        )}
        {gameStatus === "paused" && (
          <button type="button" className="pause-btn" onClick={resume}>
            再開
          </button>
        )}
        <span className="turn-count">手数: {turnCount}</span>
      </div>

      <div className="timer-container">
        <TimerPanel player={1} />
        <div className="divider" />
        <TimerPanel player={2} />
      </div>

      {showSettings && (
        <SettingsMenu onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}
