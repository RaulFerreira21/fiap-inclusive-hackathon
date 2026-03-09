import { PomodoroService } from '../services/pomodoro.service';

describe('PomodoroService', () => {
  let service: PomodoroService;

  beforeEach(() => {
    service = new PomodoroService();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('deve iniciar com 25 minutos (1500 segundos)', () => {
    expect(service.seconds()).toBe(1500);
    expect(service.isRunning()).toBe(false);
  });

  it('deve iniciar o timer ao chamar toggleTimer()', () => {
    service.toggleTimer();

    expect(service.isRunning()).toBe(true);
  });

  it('deve decrementar 1 segundo após 1s', () => {
    service.toggleTimer();

    vi.advanceTimersByTime(1000);

    expect(service.seconds()).toBe(1499);
  });

  it('deve pausar o timer ao chamar toggleTimer() novamente', () => {
    service.toggleTimer();
    service.toggleTimer();

    expect(service.isRunning()).toBe(false);
  });

  it('não deve decrementar segundos quando pausado', () => {
    service.toggleTimer();
    service.toggleTimer();

    vi.advanceTimersByTime(5000);

    expect(service.seconds()).toBe(1500);
  });

  it('deve resetar automaticamente quando chegar a 0', () => {
    service.seconds.set(1);
    service.toggleTimer();

    vi.advanceTimersByTime(1000);

    expect(service.seconds()).toBe(1500);
    expect(service.isRunning()).toBe(false);
  });

  it('deve resetar manualmente', () => {
    service.toggleTimer();
    vi.advanceTimersByTime(5000);

    service.reset();

    expect(service.seconds()).toBe(1500);
    expect(service.isRunning()).toBe(false);
  });

  it('deve formatar corretamente o tempo', () => {
    service.seconds.set(65);

    expect(service.formatTime()).toBe('01:05');
  });

  it('deve formatar corretamente com zeros à esquerda', () => {
    service.seconds.set(9);

    expect(service.formatTime()).toBe('00:09');
  });
});
