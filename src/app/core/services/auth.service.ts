import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  LoginResponse,
  RegisterResponse,
} from '../../shared/models/user.model';
import { ApiResponse } from '../../shared/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly API_URL =
    'https://36sde0kxka.execute-api.us-east-1.amazonaws.com/dev';
  private readonly TOKEN_KEY = 'utec_diagram_token';
  private readonly USER_KEY = 'utec_diagram_user';

  // Signals para estado reactivo
  currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);
  isLoading = signal<boolean>(false);

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const userData = localStorage.getItem(this.USER_KEY);

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
      } catch (error) {
        this.logout();
      }
    }
  }

  login(credentials: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    this.isLoading.set(true);

    return this.http
      .post<LoginResponse>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        map((response) => {
          // Convertir respuesta de la API al formato interno
          const authResponse: AuthResponse = {
            user: response.user,
            token: response.token,
            expires_in: response.expires_in,
          };
          return {
            success: true,
            data: authResponse,
            message: 'Login exitoso',
          } as ApiResponse<AuthResponse>;
        }),
        tap((response) => {
          this.isLoading.set(false);
          if (response.success && response.data) {
            this.setSession(response.data);
          }
        }),
        catchError((error) => {
          this.isLoading.set(false);
          return of({
            success: false,
            error: error.error?.message || 'Error en el login',
            data: undefined,
          } as ApiResponse<AuthResponse>);
        })
      );
  }

  register(userData: RegisterRequest): Observable<ApiResponse<User>> {
    this.isLoading.set(true);

    return this.http
      .post<RegisterResponse>(`${this.API_URL}/auth/signup`, userData)
      .pipe(
        map((response) => {
          return {
            success: true,
            data: response.user,
            message: response.message,
          } as ApiResponse<User>;
        }),
        tap(() => {
          this.isLoading.set(false);
        }),
        catchError((error) => {
          this.isLoading.set(false);
          return of({
            success: false,
            error: error.error?.message || 'Error en el registro',
            data: undefined,
          } as ApiResponse<User>);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/auth/login']);
  }

  private setSession(authResult: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, authResult.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(authResult.user));
    this.currentUser.set(authResult.user);
    this.isAuthenticated.set(true);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  refreshToken(): Observable<ApiResponse<AuthResponse>> {
    const refreshToken = localStorage.getItem('refresh_token');
    return this.http.post<ApiResponse<AuthResponse>>(
      `${this.API_URL}/auth/refresh`,
      {
        refreshToken,
      }
    );
  }

  // Método para login de prueba (desarrollo)
  loginAsDemo(): void {
    const demoUser: User = {
      user_id: 'demo-user-123',
      name: 'Usuario Demo',
      email: 'demo@utec.edu.pe',
    };

    const demoAuth: AuthResponse = {
      user: demoUser,
      token: 'demo-jwt-token-12345',
    };

    this.setSession(demoAuth);
  }
}
