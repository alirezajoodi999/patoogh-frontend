import { HttpInterceptorFn, HttpErrorResponse, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const storageService = inject(StorageService);
  const router = inject(Router);

  // به endpointهای احراز هویت توکن اضافه نکن
  const isAuthEndpoint =
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/register') ||
    req.url.includes('/auth/refresh-token');

  // افزودن توکن به هدر (فقط برای درخواست‌های غیر-auth)
  const token = storageService.getToken();
  if (token && !isAuthEndpoint) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        return handle401Error(req, next, authService, storageService, router);
      }
      return throwError(() => error);
    })
  );
};

function handle401Error(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService,
  storageService: StorageService,
  router: Router
) {
  // برای خود درخواست‌های auth، تلاش برای refresh نکن
  if (request.url.includes('/auth/')) {
    return throwError(() => new HttpErrorResponse({ status: 401 }));
  }

  const refreshToken = storageService.getRefreshToken();

  // اگر refresh token وجود ندارد، خروج از حساب
  if (!refreshToken) {
    storageService.clearTokens();
    router.navigate(['/auth/login']);
    return throwError(() => new HttpErrorResponse({ status: 401 }));
  }

  // تلاش برای دریافت توکن جدید و تکرار درخواست اصلی
  return authService.refreshToken().pipe(
    switchMap(() => {
      const newToken = storageService.getToken();
      const retryReq = request.clone({
        setHeaders: {
          Authorization: `Bearer ${newToken}`
        }
      });
      return next(retryReq);
    }),
    catchError((refreshError) => {
      storageService.clearTokens();
      router.navigate(['/auth/login']);
      return throwError(() => refreshError);
    })
  );
}
