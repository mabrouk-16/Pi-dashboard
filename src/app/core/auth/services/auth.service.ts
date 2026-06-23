import { computed, Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, AuthResponse, LoginCredentials } from '../models/auth.model';

const AUTH_STORAGE_KEY = 'pi_user';
const HARDCODED_USERNAME = 'admin';
const HARDCODED_PASSWORD = '123456';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public user = signal<User | null>(this.loadUserFromStorage());
  public isAuthenticated = computed<boolean>(() => this.user() !== null);

  private loadUserFromStorage(): User | null {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        return null;
      }
    }
    return null;
  }

  /**
   * Login user with credentials
   */
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return new Observable((observer) => {
      // Simulate API call delay
      setTimeout(() => {
        // Validate credentials
        if (
          credentials.username === HARDCODED_USERNAME &&
          credentials.password === HARDCODED_PASSWORD
        ) {
          const user: User = {
            username: credentials.username,
            loginTime: new Date(),
          };

          // Save to localStorage
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));

          // Update subjects
          this.user.set(structuredClone(user));
          observer.next({
            success: true,
            message: 'Login successful',
            user,
          });
        } else {
          // Clear localStorage on failed login
          localStorage.removeItem(AUTH_STORAGE_KEY);
          this.user.set(null);
          observer.next({
            success: false,
            message: 'Invalid username or password',
          });
        }
        observer.complete();
      }, 500);
    });
  }

  /**
   * Logout user
   */
  logout(): Observable<void> {
    return new Observable((observer) => {
      setTimeout(() => {
        // Clear localStorage
        localStorage.removeItem(AUTH_STORAGE_KEY);

        // Update subjects
        this.user.set(null);
        observer.next();
        observer.complete();
      }, 300);
    });
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.user();
  }

}
