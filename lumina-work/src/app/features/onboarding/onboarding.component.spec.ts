import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OnboardingComponent } from '../onboarding/onboarding.component';
import { Router } from '@angular/router';

describe('OnboardingComponent', () => {
  let component: OnboardingComponent;
  let fixture: ComponentFixture<OnboardingComponent>;

  const routerMock = {
    navigate: vi.fn(),
  };

  beforeEach(async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});

    await TestBed.configureTestingModule({
      imports: [OnboardingComponent],
      providers: [{ provide: Router, useValue: routerMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(OnboardingComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should increment step when nextStep is called', () => {
    component.nextStep();
    expect(component.currentStep()).toBe(1);
  });

  it('should call finish when on last step', () => {
    component.currentStep.set(2);

    const finishSpy = vi.spyOn(component, 'finish');

    component.nextStep();

    expect(finishSpy).toHaveBeenCalled();
  });

  it('should skip step 1 and clear focusActivity', () => {
    component.currentStep.set(1);
    component.focusActivity.set('Teste');
    component.skipStep();

    expect(component.focusActivity()).toBe('');
    expect(component.currentStep()).toBe(2);
  });

  it('should save focusActivity and mark onboarding complete', () => {
    component.focusActivity.set('Deep Work');
    component.finish();

    expect(localStorage.setItem).toHaveBeenCalledWith('focusActivity', 'Deep Work');
    expect(localStorage.setItem).toHaveBeenCalledWith('onboardingComplete', 'true');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should not save focusActivity if empty', () => {
    component.focusActivity.set('');
    component.finish();

    expect(localStorage.setItem).toHaveBeenCalledWith('onboardingComplete', 'true');
    expect(routerMock.navigate).toHaveBeenCalled();
  });

  it('should return correct stepMessage', () => {
    component.currentStep.set(0);
    expect(component.stepMessage).toBe('Apenas o começo!');

    component.currentStep.set(1);
    expect(component.stepMessage).toBe('Falta pouco!');

    component.currentStep.set(2);
    expect(component.stepMessage).toBe('Seu progresso começa agora!');
  });

  it('should validate canProceed correctly', () => {
    component.currentStep.set(1);
    component.focusActivity.set('');

    expect(component.canProceed).toBe(false);

    component.focusActivity.set('Algo');
    expect(component.canProceed).toBe(true);
  });
});
