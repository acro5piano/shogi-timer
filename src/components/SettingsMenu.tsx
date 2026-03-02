import { useState } from "react";
import { useGameStore } from "../store";

function TimeInput({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: number;
  onChange: (seconds: number) => void;
  disabled: boolean;
}) {
  const minutes = Math.floor(value / 60);
  const seconds = value % 60;

  return (
    <div className="time-input-group">
      <label>{label}</label>
      <div className="time-inputs">
        <input
          type="number"
          min={0}
          max={180}
          value={minutes}
          disabled={disabled}
          onChange={(e) =>
            onChange(Math.max(0, Number(e.target.value)) * 60 + seconds)
          }
        />
        <span>分</span>
        <input
          type="number"
          min={0}
          max={59}
          value={seconds}
          disabled={disabled}
          onChange={(e) =>
            onChange(minutes * 60 + Math.max(0, Math.min(59, Number(e.target.value))))
          }
        />
        <span>秒</span>
      </div>
    </div>
  );
}

export function SettingsMenu({ onClose }: { onClose: () => void }) {
  const gameStatus = useGameStore((s) => s.gameStatus);
  const initialTimeSeconds = useGameStore((s) => s.initialTimeSeconds);
  const byoyomiSeconds = useGameStore((s) => s.byoyomiSeconds);
  const turnCount = useGameStore((s) => s.turnCount);
  const initialize = useGameStore((s) => s.initialize);
  const setInitialTime = useGameStore((s) => s.setInitialTime);
  const setByoyomi = useGameStore((s) => s.setByoyomi);

  const [showConfirm, setShowConfirm] = useState(false);

  const isGameInProgress = gameStatus !== "idle";

  const handleInitialize = () => {
    if (isGameInProgress) {
      setShowConfirm(true);
    } else {
      initialize();
      onClose();
    }
  };

  const confirmInitialize = () => {
    initialize();
    setShowConfirm(false);
    onClose();
  };

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-menu" onClick={(e) => e.stopPropagation()}>
        <h2>設定</h2>

        <div className="turn-info">手数: {turnCount}</div>

        <TimeInput
          label="持ち時間"
          value={initialTimeSeconds}
          onChange={setInitialTime}
          disabled={isGameInProgress}
        />

        <TimeInput
          label="秒読み"
          value={byoyomiSeconds}
          onChange={setByoyomi}
          disabled={isGameInProgress}
        />

        <div className="settings-actions">
          <button
            type="button"
            className="settings-btn danger"
            onClick={handleInitialize}
          >
            初期化
          </button>
          <button type="button" className="settings-btn" onClick={onClose}>
            閉じる
          </button>
        </div>

        {showConfirm && (
          <div className="confirm-dialog">
            <p>対局をリセットしますか？</p>
            <div className="confirm-actions">
              <button
                type="button"
                className="settings-btn danger"
                onClick={confirmInitialize}
              >
                リセット
              </button>
              <button
                type="button"
                className="settings-btn"
                onClick={() => setShowConfirm(false)}
              >
                キャンセル
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
