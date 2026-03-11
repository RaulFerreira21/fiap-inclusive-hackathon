import { Component, effect, ElementRef, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStateService } from '../../../services/app-state.service';
import { BoardService } from '../../../services/board.service';
import { PomodoroService } from '../../../services/pomodoro.service';
import { GuidedStepsService } from '../../../services/guided-steps.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Output() settingsOpened = new EventEmitter<void>();
  @Output() guidedStepAdvanced = new EventEmitter<void>();
  @ViewChild('settingsButton') settingsButton?: ElementRef<HTMLButtonElement>;

  private pomodoroService = inject(PomodoroService);
  private appStateService = inject(AppStateService);
  private boardService = inject(BoardService);
  private guidedStepsService = inject(GuidedStepsService);

  private focusSettingsStepEffect = effect(() => {
    if (this.guidedStepsActive && this.currentGuidedStep === 3) {
      queueMicrotask(() => this.settingsButton?.nativeElement.focus());
    }
  });

  get currentGuidedStep(): number {
    return this.guidedStepsService.currentStep();
  }

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
    return this.boardService.hasExpandedColumnsWithPendingTasks();
  }

  get guidedStepsActive(): boolean {
    return this.appStateService.guidedSteps();
  }

  togglePomodoro(): void {
    this.pomodoroService.toggleTimer();
  }

  toggleFocusMode(): void {
    if (!this.canToggleFocus) {
      this.showToast('expanda uma lista com tarefas não realizadas para entrar em modo foco');
      return;
    }
    
    this.appStateService.toggleFocusMode();
  }

  openSettings(): void {
    this.settingsOpened.emit();
  }

  nextGuidedStep(): void {
    this.guidedStepsService.nextStep();
    this.guidedStepAdvanced.emit();
  }

  private showToast(message: string): void {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    
   
    document.body.appendChild(toast);
    
   
    void toast.offsetHeight;
    
   
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }
}
