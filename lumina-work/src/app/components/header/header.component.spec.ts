import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from '../header/header.component';
import { PomodoroService } from '../../services/pomodoro.service';
import { AppStateService } from '../../services/app-state.service';

describe('Header', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  const pomodoroServiceMock = {
    formatTime: vi.fn(),
    isRunning: vi.fn(),
    toggleTimer: vi.fn(),
  };

  const appStateServiceMock = {
    pomodoroTimerEnabled: vi.fn(),
    pomodoroEnabled: vi.fn(),
    focusModeEnabled: vi.fn(),
    focusMode: vi.fn(),
    hasOpenLists: vi.fn(),
    toggleFocusMode: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        { provide: PomodoroService, useValue: pomodoroServiceMock },
        { provide: AppStateService, useValue: appStateServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should return formatted pomodoro time', () => {
    pomodoroServiceMock.formatTime.mockReturnValue('25:00');

    expect(component.pomodoroTime).toBe('25:00');
  });

  it('should return if pomodoro is running', () => {
    pomodoroServiceMock.isRunning.mockReturnValue(true);

    expect(component.isPomodoroRunning).toBe(true);
  });

  it('should return focusMode state', () => {
    appStateServiceMock.focusMode.mockReturnValue(true);

    expect(component.focusMode).toBe(true);
  });

  it('should return canToggleFocus', () => {
    appStateServiceMock.hasOpenLists.mockReturnValue(false);

    expect(component.canToggleFocus).toBe(false);
  });

  it('should call toggleTimer when togglePomodoro is called', () => {
    component.togglePomodoro();

    expect(pomodoroServiceMock.toggleTimer).toHaveBeenCalled();
  });

  it('should call toggleFocusMode when toggleFocusMode is called', () => {
    component.toggleFocusMode();

    expect(appStateServiceMock.toggleFocusMode).toHaveBeenCalled();
  });

  it('should emit onOpenSettings event', () => {
    const emitSpy = vi.spyOn(component.onOpenSettings, 'emit');

    component.openSettings();

    expect(emitSpy).toHaveBeenCalled();
  });
});
