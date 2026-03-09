import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from '../header/header.component';
import { PomodoroService } from '../../../services/pomodoro.service';
import { AppStateService } from '../../../services/app-state.service';
import { BoardService } from '../../../services/board.service';
import { GuidedStepsService } from '../../../services/guided-steps.service';

describe('Header', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  const pomodoroServiceMock = {
    formatTime: vi.fn(),
    isRunning: vi.fn(),
    toggleTimer: vi.fn(),
  };

  const appStateServiceMock = {
    pomodoroTimerEnabled: vi.fn(() => true),
    pomodoroEnabled: vi.fn(() => true),
    focusModeEnabled: vi.fn(() => true),
    focusMode: vi.fn(() => false),
    guidedSteps: vi.fn(() => false),
    toggleFocusMode: vi.fn(),
  };

  const boardServiceMock = {
    hasExpandedColumnsWithPendingTasks: vi.fn(() => true),
  };

  const guidedStepsServiceMock = {
    currentStep: vi.fn(() => 0),
    nextStep: vi.fn(),
    resetSteps: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        { provide: PomodoroService, useValue: pomodoroServiceMock },
        { provide: AppStateService, useValue: appStateServiceMock },
        { provide: BoardService, useValue: boardServiceMock },
        { provide: GuidedStepsService, useValue: guidedStepsServiceMock },
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
    boardServiceMock.hasExpandedColumnsWithPendingTasks.mockReturnValue(false);

    expect(component.canToggleFocus).toBe(false);
  });

  it('should call toggleTimer when togglePomodoro is called', () => {
    component.togglePomodoro();

    expect(pomodoroServiceMock.toggleTimer).toHaveBeenCalled();
  });

  it('should call toggleFocusMode when toggleFocusMode is called', () => {
    boardServiceMock.hasExpandedColumnsWithPendingTasks.mockReturnValue(true);
    component.toggleFocusMode();

    expect(appStateServiceMock.toggleFocusMode).toHaveBeenCalled();
  });

  it('should emit settingsOpened when openSettings is called', () => {
    const emitSpy = vi.spyOn(component.settingsOpened, 'emit');
    component.openSettings();

    expect(emitSpy).toHaveBeenCalled();
  });
});
