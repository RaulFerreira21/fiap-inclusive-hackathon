import { Component, effect, inject, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { FooterComponent } from './presentation/components/footer/footer.component';
import { HeaderComponent } from './presentation/components/header/header.component';
import { SettingsPanel } from './presentation/components/settings-panel/settings-panel';
import { SettingsForm } from './domain/models/settingsFrom';
import { AppStateService } from './services/app-state.service';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, SettingsPanel, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private appStateService = inject(AppStateService);
  private router = inject(Router);
  protected readonly title = signal('lumina-work');
  showLayout = signal(false);
  settingsOpen = false;
  darkMode = false;
  highContrast = false;

  constructor() {
    let previousGuidedStepsState = this.appStateService.guidedSteps();

    effect(() => {
      const currentGuidedStepsState = this.appStateService.guidedSteps();
      if (!previousGuidedStepsState && currentGuidedStepsState && this.settingsOpen) {
        this.handleCloseSettings();
      }
      previousGuidedStepsState = currentGuidedStepsState;
    });

    // Ocultar header/footer no onboarding
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.showLayout.set(!event.url.includes('onboarding'));
      });
  }

  handleOpenSettings(): void {
    this.settingsOpen = true;
    // TODO: Implementar modal ou rota de configurações
  }

  handleCloseSettings() {
    this.settingsOpen = false;
  }

  handleSaveSettings(settings: SettingsForm) {
    this.darkMode = settings.darkMode;
    this.highContrast = settings.highContrast;

    document.body.classList.toggle('dark-mode', this.darkMode);
    document.body.classList.toggle('high-contrast', this.highContrast);
  }
}
