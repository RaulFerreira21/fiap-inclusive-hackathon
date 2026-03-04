import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppStateService } from '../../../services/app-state.service';

@Component({
  selector: 'app-settings-panel',
  imports: [CommonModule, FormsModule],
  templateUrl: './settings-panel.html',
  styleUrl: './settings-panel.scss',
})
export class SettingsPanel {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<SettingsForm>();

  private appState = inject(AppStateService);

  settingsForm = signal<SettingsForm>({
    clearReading: false,
    lowAttention: false,
    fontSize: 'medium',
    guidedSteps: false,
    darkMode: false,
    highContrast: false,
    focusModeEnabled: true,
    pomodoroTimerEnabled: true,
    hideAnimations: false,
  });

  constructor() {
    // Carrega os valores atuais do serviço quando o painel abre
    effect(() => {
      if (this.isOpen) {
        this.settingsForm.set({
          clearReading: this.appState.clearReading(),
          lowAttention: this.appState.lowAttention(),
          fontSize: this.appState.fontSize(),
          guidedSteps: this.appState.guidedSteps(),
          darkMode: this.appState.darkMode(),
          highContrast: this.appState.highContrast(),
          focusModeEnabled: this.appState.focusModeEnabled(),
          pomodoroTimerEnabled: this.appState.pomodoroTimerEnabled(),
          hideAnimations: this.appState.hideAnimations()
        });
      }
    });

    // Atualiza o serviço em tempo real conforme o form muda
    effect(() => {
      this.appState.updateSettings(this.settingsForm());
    });
  }

  updateField<K extends keyof SettingsForm>(field: K, value: SettingsForm[K]): void {
    this.settingsForm.update(form => ({
      ...form,
      [field]: value
    }));
  }

  onClose(): void {
    this.save.emit(this.settingsForm());
    this.close.emit();
  }
}
