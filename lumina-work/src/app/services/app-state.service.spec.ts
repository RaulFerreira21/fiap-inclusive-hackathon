import { fakeAsync, flush, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AppStateService } from '../services/app-state.service';

describe('AppStateService', () => {
  let service: AppStateService;

  beforeEach(() => {
    document.body.className = '';
    localStorage.clear();

    vi.restoreAllMocks();
    localStorage.clear();
    document.body.className = '';

    TestBed.resetTestingModule();

    TestBed.configureTestingModule({
      providers: [AppStateService],
    });

    service = TestBed.inject(AppStateService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    document.body.className = '';
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should toggle focusMode', () => {
    service.toggleFocusMode();
    expect(service.focusMode()).toBe(true);
  });

  it('should toggle pomodoroEnabled', () => {
    service.togglePomodoro();
    expect(service.pomodoroEnabled()).toBe(false);
  });

  it('should set openLists and validate hasOpenLists()', () => {
    service.setOpenLists(2);
    expect(service.hasOpenLists()).toBe(true);

    service.setOpenLists(0);
    expect(service.hasOpenLists()).toBe(false);
  });

  it('should update settings and persist to localStorage', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

    service.updateSettings({
      clearReading: true,
      lowAttention: true,
      fontSize: 'large',
      guidedSteps: true,
      darkMode: true,
      highContrast: true,
      focusModeEnabled: true,
      pomodoroTimerEnabled: true,
      hideAnimations: false,
    });

    expect(service.clearReading()).toBe(true);
    expect(service.fontSize()).toBe('large');

    expect(setItemSpy).toHaveBeenCalledWith('lumina_settings', expect.any(String));
  });

  it('should apply accessibility classes to body', async () => {
    service.updateSettings({
      clearReading: true,
      lowAttention: true,
      fontSize: 'large',
      guidedSteps: true,
      darkMode: true,
      highContrast: true,
      focusModeEnabled: true,
      pomodoroTimerEnabled: true,
      hideAnimations: false,
    });

    await new Promise((r) => setTimeout(r));

    expect(document.body.classList).toContain('font-large');
  });

  it('should load saved settings from localStorage', () => {
    const savedSettings = {
      clearReading: true,
      lowAttention: true,
      fontSize: 'large',
      guidedSteps: true,
      darkMode: true,
      highContrast: true,
      focusModeEnabled: false,
      pomodoroTimerEnabled: false,
    };

    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(JSON.stringify(savedSettings));

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [AppStateService],
    });

    const newService = TestBed.inject(AppStateService);

    expect(newService.clearReading()).toBe(true);
    expect(newService.fontSize()).toBe('large');
  });

  it('should handle invalid JSON in loadSettings()', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('invalid-json');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [AppStateService],
    });

    TestBed.inject(AppStateService);

    expect(consoleSpy).toHaveBeenCalled();
  });
});
