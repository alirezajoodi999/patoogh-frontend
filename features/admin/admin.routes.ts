// src/app/features/admin/admin.routes.ts
import { Routes } from '@angular/router';
import { RoleGuard } from '../../core/guards/role-guard';
import { UserRole } from '../../models/user.model';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full'
  },
  {
    // مدیریت کاربران - فقط ادمین فنی
    path: 'users',
    canActivate: [RoleGuard],
    data: { roles: [UserRole.ADMIN] },
    loadComponent: () =>
      import('./user-managemen/user-management.component').then(m => m.UserManagementComponent)
  },
  {
    // تأیید محتوا - ادمین فنی و ادمین آموزش
    path: 'content',
    canActivate: [RoleGuard],
    data: { roles: [UserRole.ADMIN, UserRole.HR_ADMIN] },
    loadComponent: () =>
      import('./content-moderation/content-moderation.component').then(m => m.ContentModerationComponent)
  },
  {
    // گزارش‌های تحلیلی - ادمین فنی و ادمین آموزش (صفحه ۲۶ مستندات)
    path: 'reports',
    canActivate: [RoleGuard],
    data: { roles: [UserRole.ADMIN, UserRole.HR_ADMIN] },
    loadComponent: () =>
      import('./reports/reports.component').then(m => m.ReportsComponent)
  }
];
