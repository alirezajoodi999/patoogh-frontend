import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    const token = this.authService.getToken();
    
    if (!token) {
      return of(this.router.createUrlTree(['/auth/login']));
    }

    if (this.authService.isTokenExpired(token)) {
      const refreshToken = this.storageService.getRefreshToken();
      
      if (!refreshToken) {
        this.authService.logout().subscribe();
        return of(this.router.createUrlTree(['/auth/login']));
      }

      return this.authService.refreshToken().pipe(
        map(() => true),
        catchError(() => {
          this.authService.logout().subscribe();
          return of(this.router.createUrlTree(['/auth/login']));
        })
      );
    }

    return of(true);
  }
}
