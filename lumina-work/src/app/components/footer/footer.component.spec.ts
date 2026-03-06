import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from '../footer/footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize currentYear with the current system year', () => {
    const expectedYear = new Date().getFullYear();
    expect(component.currentYear).toBe(expectedYear);
  });

  it('should render currentYear in the template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const expectedYear = new Date().getFullYear().toString();

    expect(compiled.textContent).toContain(expectedYear);
  });
});
