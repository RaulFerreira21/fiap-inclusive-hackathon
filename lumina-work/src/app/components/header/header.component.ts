import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PomodoroService } from '../../services/pomodoro.service';
import { AppStateService } from '../../services/app-state.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Output() onOpenSettings = new EventEmitter<void>();

  private pomodoroService = inject(PomodoroService);
  private appStateService = inject(AppStateService);

  get pomodoroTime(): string {
    return this.pomodoroService.formatTime();
  }

  get isPomodoroRunning(): boolean {
    return this.pomodoroService.isRunning();
  }

  get pomodoroTimerEnabled(): boolean {
    return this.appStateService.pomodoroTimerEnabled();
  }

  get pomodoroEnabled(): boolean {
    return this.appStateService.pomodoroEnabled();
  }

  get focusModeEnabled(): boolean {
    return this.appStateService.focusModeEnabled();
  }

  get focusMode(): boolean {
    return this.appStateService.focusMode();
  }

  get canToggleFocus(): boolean {
    return this.appStateService.hasOpenLists();
  }

  togglePomodoro(): void {
    this.pomodoroService.toggleTimer();
  }

  toggleFocusMode(): void {
    this.appStateService.toggleFocusMode();
  }

  openSettings(): void {
    this.onOpenSettings.emit();
  }
}
