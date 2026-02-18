import { Component, signal, effect } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('lumina-work');
  showLayout = signal(false);

  constructor(private router: Router) {
    // Ocultar header/footer no onboarding
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.showLayout.set(!event.url.includes('onboarding'));
      });
  }

  handleOpenSettings(): void {
    console.log('Abrir configurações');
    // TODO: Implementar modal ou rota de configurações
  }
}
