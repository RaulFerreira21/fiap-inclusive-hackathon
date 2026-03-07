import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsPanel } from '../settings-panel/settings-panel';
import { AppStateService } from '../../../services/app-state.service';
import { SettingsForm } from '../../../domain/models/settingsFrom';

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

  it('should emit save with form values and close panel when onClose is called', () => {
    const saveSpy = vi.spyOn(component.save, 'emit');
    const closeSpy = vi.spyOn(component.panelClose, 'emit');

    const mockForm: SettingsForm = {
      clearReading: true,
      lowAttention: false,
      fontSize: 'large',
      guidedSteps: true,
      darkMode: true,
      highContrast: false,
      focusModeEnabled: true,
      pomodoroTimerEnabled: false,
      hideAnimations: false,
    };

    vi.spyOn(component, 'settingsForm').mockReturnValue(mockForm);

    component.onClose();

    expect(saveSpy).toHaveBeenCalledWith(mockForm);
    expect(closeSpy).toHaveBeenCalled();
  });
});
