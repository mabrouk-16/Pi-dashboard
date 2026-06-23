import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from './core/auth/services/auth.service';
import { User } from './core/auth/models/auth.model';
import { UrlsNames } from './shared/models/urlsNames';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'Course Management Dashboard';
  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser = signal<User | null>(this.authService.user());

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/', UrlsNames.LOGIN]);
    });
  }
}
