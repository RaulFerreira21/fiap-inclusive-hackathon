import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsPanel } from '../settings-panel/settings-panel';
import { AppStateService } from '../../services/app-state.service';

describe('SettingsPanel', () => {
  let component: SettingsPanel;
  let fixture: ComponentFixture<SettingsPanel>;

  const appStateMock = {
    clearReading: () => true,
    lowAttention: () => false,
    fontSize: (): 'small' | 'medium' | 'large' => 'large',
    guidedSteps: () => true,
    darkMode: () => true,
    highContrast: () => false,
    focusModeEnabled: () => true,
    pomodoroTimerEnabled: () => false,
    updateSettings: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsPanel],
      providers: [{ provide: AppStateService, useValue: appStateMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsPanel);
    component = fixture.componentInstance;
    (component as any).appState = appStateMock;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load values from AppStateService when isOpen becomes true', () => {
    component.isOpen = true;
    component.updateField('clearReading', appStateMock.clearReading());
    component.updateField('lowAttention', appStateMock.lowAttention());
    component.updateField('fontSize', appStateMock.fontSize());
    component.updateField('guidedSteps', appStateMock.guidedSteps());
    component.updateField('darkMode', appStateMock.darkMode());
    component.updateField('highContrast', appStateMock.highContrast());
    component.updateField('focusModeEnabled', appStateMock.focusModeEnabled());
    component.updateField('pomodoroTimerEnabled', appStateMock.pomodoroTimerEnabled());

    const form = component.settingsForm();

    expect(form.clearReading).toBe(true);
    expect(form.lowAttention).toBe(false);
    expect(form.fontSize).toBe('large');
    expect(form.guidedSteps).toBe(true);
    expect(form.darkMode).toBe(true);
    expect(form.highContrast).toBe(false);
    expect(form.focusModeEnabled).toBe(true);
    expect(form.pomodoroTimerEnabled).toBe(false);
  });

  it('should update a field using updateField()', () => {
    component.updateField('darkMode', true);

    expect(component.settingsForm().darkMode).toBe(true);
  });

  it('should call updateSettings when settingsForm changes', () => {
    component.updateField('highContrast', true);

    expect(appStateMock.updateSettings).toHaveBeenCalled();
  });

  it('should emit save and close events on onClose()', () => {
    const saveSpy = vi.spyOn(component.save, 'emit');
    const closeSpy = vi.spyOn(component.close, 'emit');

    component.onClose();

    expect(saveSpy).toHaveBeenCalledWith(component.settingsForm());
    expect(closeSpy).toHaveBeenCalled();
  });
});
