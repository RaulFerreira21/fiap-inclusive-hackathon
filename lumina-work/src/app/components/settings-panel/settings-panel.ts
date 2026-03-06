import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppStateService } from '../../services/app-state.service';

interface SettingsForm {
  clearReading: boolean;
  lowAttention: boolean;
  fontSize: 'small' | 'medium' | 'large';
  guidedSteps: boolean;
  darkMode: boolean;
  highContrast: boolean;
  focusModeEnabled: boolean;
  pomodoroTimerEnabled: boolean;
}

@Component({
  selector: 'app-settings-panel',
  standalone: true,
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
  });

  constructor() {
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
        });
      }
    });

    effect(() => {
      this.appState.updateSettings(this.settingsForm());
    });
  }

  updateField<K extends keyof SettingsForm>(field: K, value: SettingsForm[K]): void {
    this.settingsForm.update((form) => ({
      ...form,
      [field]: value,
    }));
  }

  onClose(): void {
    this.save.emit(this.settingsForm());
    this.close.emit();
  }
}
