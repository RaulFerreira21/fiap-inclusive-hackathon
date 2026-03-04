import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  focusMode = signal(false);
  pomodoroEnabled = signal(true);
  openLists = signal(0);

  // Settings signals - Acessibilidade Cognitiva
  clearReading = signal(false);
  lowAttention = signal(false);
  guidedSteps = signal(false);
  
  // Settings signals - Personalização Visual
  fontSize = signal<'small' | 'medium' | 'large'>('medium');
  darkMode = signal(false);
  highContrast = signal(false);
  
  // Settings signals - Foco e Produtividade
  focusModeEnabled = signal(true); // controla se o botão aparece no header
  pomodoroTimerEnabled = signal(true); // controla se o timer pomodoro aparece
  hideAnimations = signal(false);

  constructor() {
    // Aplica classes ao body conforme as configurações mudam
    effect(() => {
      this.applyAccessibilityClasses();
    });

    // Carrega as configurações salvas do localStorage
    this.loadSettings();
  }

  // ============ MÉTODOS DE CONTROLE ============

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

  // ============ ATUALIZAÇÃO DE CONFIGURAÇÕES ============

  updateSettings(settings: {
    clearReading: boolean;
    lowAttention: boolean;
    fontSize: 'small' | 'medium' | 'large';
    guidedSteps: boolean;
    darkMode: boolean;
    highContrast: boolean;
    focusModeEnabled: boolean;
    pomodoroTimerEnabled: boolean;
    hideAnimations: boolean;
  }): void {
    this.clearReading.set(settings.clearReading);
    this.lowAttention.set(settings.lowAttention);
    this.fontSize.set(settings.fontSize);
    this.guidedSteps.set(settings.guidedSteps);
    this.darkMode.set(settings.darkMode);
    this.highContrast.set(settings.highContrast);
    this.focusModeEnabled.set(settings.focusModeEnabled);
    this.pomodoroTimerEnabled.set(settings.pomodoroTimerEnabled);
    this.hideAnimations.set(settings.hideAnimations);
    // Salva as configurações no localStorage
    this.saveSettings();

    console.log('[AppState] Configurações atualizadas:', settings);
  }

  // ============ APLICAR CLASSES DE ACESSIBILIDADE ============

  private applyAccessibilityClasses(): void {
    const body = document.body;

    // Acessibilidade Cognitiva
    body.classList.toggle('mode-clear-reading', this.clearReading());
    body.classList.toggle('mode-low-attention', this.lowAttention());
    body.classList.toggle('mode-guided-steps', this.guidedSteps());

    // Personalização Visual
    body.classList.toggle('dark-mode', this.darkMode());
    body.classList.toggle('high-contrast', this.highContrast());

    // Aplicar classe de tamanho de fonte
    body.classList.remove('font-small', 'font-medium', 'font-large');
    body.classList.add(`font-${this.fontSize()}`);
  }

  // ============ PERSISTÊNCIA ============

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
      hideAnimations: this.hideAnimations()
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
