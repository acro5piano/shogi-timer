let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

export function beep(frequency = 800, duration = 100): void {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = "square";
    gain.gain.value = 0.3;

    oscillator.start(ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);
    oscillator.stop(ctx.currentTime + duration / 1000);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    alert(`音声の再生に失敗しました: ${message}`);
  }
}

export function testSound(): void {
  try {
    getAudioContext();
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    alert(`AudioContextの作成に失敗しました: ${message}`);
    return;
  }
  beepShort();
  setTimeout(() => beepLastCount(), 300);
}

export function beepShort(): void {
  beep(800, 80);
}

export function beepLastCount(): void {
  beep(1000, 150);
}
