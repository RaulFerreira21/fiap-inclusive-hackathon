import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  focusMode = signal(false);
  pomodoroEnabled = signal(true);
  openLists = signal(0);

  toggleFocusMode(): void {
    this.focusMode.update(value => !value);
  }

  togglePomodoro(): void {
    this.pomodoroEnabled.update(value => !value);
  }

  setOpenLists(count: number): void {
    this.openLists.set(count);
  }

  hasOpenLists(): boolean {
    return this.openLists() > 0;
  }
}
