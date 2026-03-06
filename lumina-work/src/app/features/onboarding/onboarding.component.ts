import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.scss',
})
export class OnboardingComponent {
  currentStep = signal(0);
  focusActivity = signal('');

  constructor(private router: Router) {}

  nextStep(): void {
    if (this.currentStep() < 2) {
      this.currentStep.set(this.currentStep() + 1);
    } else {
      this.finish();
    }
  }

  skipStep(): void {
    if (this.currentStep() === 1) {
      this.focusActivity.set('');
      this.nextStep();
    }
  }

  finish(): void {
    if (this.focusActivity()) {
      localStorage.setItem('focusActivity', this.focusActivity());
    }

    localStorage.setItem('onboardingComplete', 'true');

    this.router.navigate(['/dashboard']);
  }

  get stepMessage(): string {
    switch (this.currentStep()) {
      case 0:
        return 'Apenas o começo!';
      case 1:
        return 'Falta pouco!';
      case 2:
        return 'Seu progresso começa agora!';
      default:
        return '';
    }
  }

  get canProceed(): boolean {
    if (this.currentStep() === 1) {
      return this.focusActivity().trim().length > 0;
    }
    return true;
  }
}
