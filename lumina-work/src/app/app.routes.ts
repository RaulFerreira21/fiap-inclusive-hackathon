import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

const onboardingGuard = () => {
  const router = inject(Router);
  const onboardingComplete = localStorage.getItem('onboardingComplete');

  if (onboardingComplete === 'true') {
    router.navigate(['/dashboard']);
    return false;
  }
  return true;
};

const dashboardGuard = () => {
  const router = inject(Router);
  const onboardingComplete = localStorage.getItem('onboardingComplete');

  if (onboardingComplete !== 'true') {
    router.navigate(['/onboarding']);
    return false;
  }
  return true;
};

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'onboarding',
    pathMatch: 'full',
  },
  {
    path: 'onboarding',
    loadComponent: () =>
      import('./features/onboarding/onboarding.component').then((m) => m.OnboardingComponent),
    canActivate: [onboardingGuard],
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    canActivate: [dashboardGuard],
  },
  {
    path: '**',
    redirectTo: 'onboarding',
  },
];
