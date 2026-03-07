import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GuidedStepsService {
  // Estado atual do step (0 = logo, 1 = dashboard, etc)
  currentStep = signal<number>(0);

  nextStep(): void {
    this.currentStep.set(this.currentStep() + 1);
  }

  previousStep(): void {
    if (this.currentStep() > 0) {
      this.currentStep.set(this.currentStep() - 1);
    }
  }

  goToStep(step: number): void {
    this.currentStep.set(step);
  }

  resetSteps(): void {
    this.currentStep.set(0);
  }
}
