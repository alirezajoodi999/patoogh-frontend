// src/app/core/interceptors/error.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastr = inject(ToastrService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'خطای ناشناخته رخ داده است';

      if (error.error instanceof ErrorEvent) {
        // خطای سمت کلاینت
        errorMessage = `خطا: ${error.error.message}`;
      } else {
        // خطای سمت سرور
        switch (error.status) {
          case 400:
            errorMessage = error.error?.message || 'درخواست نامعتبر است';
            break;
          case 401:
            errorMessage = 'دسترسی غیرمجاز - لطفاً وارد شوید';
            // AuthInterceptor این مورد را مدیریت می‌کند
            break;
          case 403:
            errorMessage = error.error?.message || 'دسترسی ممنوع - شما مجوز دسترسی به این بخش را ندارید';
            break;
          case 404:
            errorMessage = 'منبع مورد نظر یافت نشد';
            break;
          case 500:
            errorMessage = error.error?.message || 'خطای سرور - لطفاً بعداً تلاش کنید';
            break;
          case 503:
            errorMessage = 'سرویس در دسترس نیست';
            break;
          default:
            errorMessage = error.error?.message || `خطای سرور: ${error.status}`;
        }
      }

      console.error('HTTP Error:', {
        status: error.status,
        message: errorMessage,
        url: req.url,
        error: error.error
      });

      // نمایش پیام خطا به کاربر
      toastr.error(errorMessage, 'خطا', {
        timeOut: 5000,
        progressBar: true,
        closeButton: true
      });

      // بازگشت خطا با پیام فارسی
      return throwError(() => ({
        status: error.status,
        message: errorMessage,
        originalError: error
      }));
    })
  );
};
