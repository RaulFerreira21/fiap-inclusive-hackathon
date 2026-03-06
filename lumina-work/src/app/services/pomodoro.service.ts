import { Injectable, signal } from '@angular/core';

const POMODORO_DURATION = 25 * 60; // 25 minutos em segundos

@Injectable({
  providedIn: 'root'
})
export class PomodoroService {
  private intervalId: ReturnType<typeof setInterval> | null = null;

  seconds = signal(POMODORO_DURATION);
  isRunning = signal(false);

  toggleTimer(): void {
    if (this.isRunning()) {
      this.pause();
    } else {
      this.start();
    }
  }

  private start(): void {
    this.isRunning.set(true);
    this.intervalId = setInterval(() => {
      const currentSeconds = this.seconds();
      if (currentSeconds <= 1) {
        this.reset();
        return;
      }
      this.seconds.set(currentSeconds - 1);
    }, 1000);
  }

  private pause(): void {
    this.isRunning.set(false);
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  reset(): void {
    this.pause();
    this.seconds.set(POMODORO_DURATION);
  }

  formatTime(): string {
    const s = this.seconds();
    const minutes = Math.floor(s / 60);
    const seconds = s % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
}
