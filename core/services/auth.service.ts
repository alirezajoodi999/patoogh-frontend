import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { ApiService } from './api.service';
import { StorageService } from './storage.service';
import {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  TokenPayload,
  UserRole
} from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;
  private isAuthenticatedSubject: BehaviorSubject<boolean>;
  public isAuthenticated$: Observable<boolean>;

  constructor(
    private apiService: ApiService,
    private storageService: StorageService,
    private router: Router
  ) {
    const user = this.storageService.getUser();
    this.currentUserSubject = new BehaviorSubject<User | null>(user);
    this.currentUser$ = this.currentUserSubject.asObservable();

    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(
      !!user && !!this.storageService.getToken()
    );
    this.isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  }

  
  // ─── Getters عمومی ──────────────────────────
  public getToken(): string | null {
    return this.storageService.getToken();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get currentUserRole(): UserRole | null {
    return this.currentUserValue?.role || null;
  }

  public get isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  // ─── احراز هویت ─────────────────────────────
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('/auth/login', credentials).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.setAuthData(response.data);
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => error);
      })
    );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('/auth/register', userData).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.setAuthData(response.data);
        }
      }),
      catchError(error => {
        console.error('Register error:', error);
        return throwError(() => error);
      })
    );
  }

  logout(): Observable<any> {
    return this.apiService.post('/auth/logout', {}).pipe(
      tap(() => {
        this.clearAuthData();
        this.router.navigate(['/auth/login']);
      }),
      catchError(error => {
        // حتی اگر API خطا داد، داده‌های محلی را پاک کن
        this.clearAuthData();
        this.router.navigate(['/auth/login']);
        return throwError(() => error);
      })
    );
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.storageService.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.apiService
      .post<AuthResponse>('/auth/refresh-token', { refreshToken })
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.storageService.setToken(response.data.token);
            if (response.data.refreshToken) {
              this.storageService.setRefreshToken(response.data.refreshToken);
            }
          }
        }),
        catchError(error => {
          this.clearAuthData();
          this.router.navigate(['/auth/login']);
          return throwError(() => error);
        })
      );
  }

  // ─── متدهای کمکی ────────────────────────────
  decodeToken(token: string): TokenPayload | null {
    try {
      return jwtDecode<TokenPayload>(token);
    } catch (error) {
      return null;
    }
  }

  isTokenExpired(token: string): boolean {
    if (!token) {
      return true;
    }
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) {
      return true;
    }
    const expirationDate = new Date(0);
    expirationDate.setUTCSeconds(decoded.exp);
    return expirationDate.valueOf() < new Date().valueOf();
  }

  loadAuthState(): void {
    const token = this.storageService.getToken();
    const user = this.storageService.getUser();

    if (token && user && !this.isTokenExpired(token)) {
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
    } else {
      this.clearAuthData();
    }
  }

  // ─── متدهای خصوصی ───────────────────────────
  private setAuthData(data: {
    token: string;
    refreshToken?: string;
    user: User;
  }): void {
    this.storageService.setToken(data.token);
    if (data.refreshToken) {
      this.storageService.setRefreshToken(data.refreshToken);
    }
    this.storageService.setUser(data.user);
    this.currentUserSubject.next(data.user);
    this.isAuthenticatedSubject.next(true);
  }

  private clearAuthData(): void {
    this.storageService.clearAll();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }
}
