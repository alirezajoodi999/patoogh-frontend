// src/app/models/user.model.ts
// نقش‌های سیستم پاتوق (بر اساس مستندات صفحه ۱۵)

/**
 * نقش‌های سیستم:
 * admin    → ادمین فنی: مدیریت کامل سیستم، کاربران، امنیت
 * hr_admin → ادمین آموزش و توسعه: مدیریت محتوا، شایستگی‌ها، گزارش‌ها
 * manager  → مدیران سازمان: مشاهده محتوا، ارزیابی، پروفایل
 */
export enum UserRole {
  ADMIN = 'admin',      // ادمین فنی
  HR_ADMIN = 'hr_admin', // ادمین آموزش و توسعه
  MANAGER = 'manager'   // مدیران سازمان
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  department?: string;
  position?: string;
  avatarUrl?: string;
  isActive: boolean;
  emailVerified?: boolean;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  department?: string;
  position?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data: {
    user: User;
    token: string;
    refreshToken?: string;
  };
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

// برچسب‌های نمایشی نقش‌ها (برای UI)
export const UserRoleLabels: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'ادمین فنی',
  [UserRole.HR_ADMIN]: 'ادمین آموزش و توسعه',
  [UserRole.MANAGER]: 'مدیر سازمان'
};

// بررسی اینکه آیا کاربر ادمین است
export const isAdminRole = (role: UserRole): boolean =>
  role === UserRole.ADMIN;

// بررسی اینکه آیا کاربر می‌تواند محتوا مدیریت کند
export const canManageContent = (role: UserRole): boolean =>
  role === UserRole.ADMIN || role === UserRole.HR_ADMIN;
