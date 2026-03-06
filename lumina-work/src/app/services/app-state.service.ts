import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  focusMode = signal(false);
  pomodoroEnabled = signal(true);
  openLists = signal(0);

  clearReading = signal(false);
  lowAttention = signal(false);
  guidedSteps = signal(false);

  fontSize = signal<'small' | 'medium' | 'large'>('medium');
  darkMode = signal(false);
  highContrast = signal(false);

  focusModeEnabled = signal(true);
  pomodoroTimerEnabled = signal(true);

  constructor() {
    effect(() => {
      this.applyAccessibilityClasses();
    });

    this.loadSettings();
  }

  toggleFocusMode(): void {
    this.focusMode.update((value) => !value);
  }

  togglePomodoro(): void {
    this.pomodoroEnabled.update((value) => !value);
  }

  setOpenLists(count: number): void {
    this.openLists.set(count);
  }

  hasOpenLists(): boolean {
    return this.openLists() > 0;
  }

  updateSettings(settings: {
    clearReading: boolean;
    lowAttention: boolean;
    fontSize: 'small' | 'medium' | 'large';
    guidedSteps: boolean;
    darkMode: boolean;
    highContrast: boolean;
    focusModeEnabled: boolean;
    pomodoroTimerEnabled: boolean;
  }): void {
    this.clearReading.set(settings.clearReading);
    this.lowAttention.set(settings.lowAttention);
    this.fontSize.set(settings.fontSize);
    this.guidedSteps.set(settings.guidedSteps);
    this.darkMode.set(settings.darkMode);
    this.highContrast.set(settings.highContrast);
    this.focusModeEnabled.set(settings.focusModeEnabled);
    this.pomodoroTimerEnabled.set(settings.pomodoroTimerEnabled);

    this.saveSettings();

    console.log('[AppState] Configurações atualizadas:', settings);
  }

  private applyAccessibilityClasses(): void {
    const body = document.body;

    body.classList.toggle('clear-reading', this.clearReading());
    body.classList.toggle('low-attention', this.lowAttention());
    body.classList.toggle('guided-steps', this.guidedSteps());

    body.classList.toggle('dark-mode', this.darkMode());
    body.classList.toggle('high-contrast', this.highContrast());

    body.classList.remove('font-small', 'font-medium', 'font-large');
    body.classList.add(`font-${this.fontSize()}`);
  }

  private saveSettings(): void {
    const settings = {
      clearReading: this.clearReading(),
      lowAttention: this.lowAttention(),
      fontSize: this.fontSize(),
      guidedSteps: this.guidedSteps(),
      darkMode: this.darkMode(),
      highContrast: this.highContrast(),
      focusModeEnabled: this.focusModeEnabled(),
      pomodoroTimerEnabled: this.pomodoroTimerEnabled(),
    };
    localStorage.setItem('lumina_settings', JSON.stringify(settings));
  }

  private loadSettings(): void {
    const saved = localStorage.getItem('lumina_settings');
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        this.updateSettings(settings);
      } catch (e) {
        console.error('[AppState] Erro ao carregar configurações:', e);
      }
    }
  }
}
