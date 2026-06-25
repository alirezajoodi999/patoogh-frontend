import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface UserData {
  id: number;
  email: string;
  fullName: string;
  role: string;
  emailVerified: boolean;
  department?: string;
  position?: string;
  avatarUrl?: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="app-header" dir="rtl">
      <div class="header-container">
        <!-- User Actions - Right Side -->
        <div class="header-actions">
          <!-- User Menu -->
          <div class="user-menu-container">
            <button class="user-menu-btn" (click)="toggleUserMenu()">
              <img *ngIf="userData?.avatarUrl" 
                   [src]="userData?.avatarUrl" 
                   [alt]="userData?.fullName || 'کاربر'"
                   class="user-avatar">
              <div *ngIf="!userData?.avatarUrl" class="user-avatar-placeholder">
                {{ getInitials(userData?.fullName) }}
              </div>
              <span class="user-name">{{ userData?.fullName || 'کاربر' }}</span>
              <svg class="dropdown-icon" [class.rotate]="showUserMenu" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>

            <!-- Dropdown Menu -->
            <div class="user-dropdown" *ngIf="showUserMenu && userData">
              <div class="dropdown-header">
                <div class="dropdown-user-info">
                  <div class="dropdown-user-name">{{ userData.fullName }}</div>
                  <div class="dropdown-user-email">{{ userData.email }}</div>
                  <div class="dropdown-user-role" *ngIf="userData.role">
                    {{ getRoleLabel(userData.role) }}
                  </div>
                </div>
              </div>
              <div class="dropdown-divider"></div>
              <a routerLink="/profile" class="dropdown-item" (click)="closeUserMenu()">
                <svg class="dropdown-icon-item" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                پروفایل من
              </a>
              <a routerLink="/settings" class="dropdown-item" (click)="closeUserMenu()">
                <svg class="dropdown-icon-item" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                تنظیمات
              </a>
              <a routerLink="/help" class="dropdown-item" (click)="closeUserMenu()">
                <svg class="dropdown-icon-item" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                راهنما
              </a>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item logout-item" (click)="logout()">
                <svg class="dropdown-icon-item" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                خروج
              </button>
            </div>
          </div>

          <!-- Notifications -->
          <button class="action-btn notification-btn" (click)="toggleNotifications()">
            <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span class="notification-badge" *ngIf="unreadCount > 0">{{ unreadCount }}</span>
          </button>
        </div>

        <!-- Navigation - Center -->
        <nav class="header-nav">
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            داشبورد
          </a>
          <a routerLink="/competencies" routerLinkActive="active" class="nav-link">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            شایستگی‌ها
          </a>
        </nav>

        <!-- Logo and Brand - Left Side -->
        <div class="header-brand" (click)="navigateHome()">
          <svg class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span class="brand-name">پاتوق</span>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .app-header {
      background: linear-gradient(135deg, #C8102E 0%, #A00D25 100%);
      box-shadow: 0 4px 12px rgba(200, 16, 46, 0.2);
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .header-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 70px;
    }

    /* Logo - Left Side */
    .header-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      transition: all 0.3s ease;
      order: 3;
    }

    .header-brand:hover {
      transform: translateY(-2px);
    }

    .logo-icon {
      width: 36px;
      height: 36px;
      color: white;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
    }

    .brand-name {
      font-size: 1.75rem;
      font-weight: 800;
      color: white;
      text-shadow: 0 2px 4px rgba(0,0,0,0.1);
      letter-spacing: 0.5px;
    }

    /* Navigation - Center */
    .header-nav {
      display: flex;
      gap: 0.5rem;
      order: 2;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1.25rem;
      color: rgba(255,255,255,0.9);
      text-decoration: none;
      border-radius: 10px;
      transition: all 0.3s ease;
      font-weight: 600;
      font-size: 0.95rem;
      border: 2px solid transparent;
    }

    .nav-link:hover {
      background: rgba(255,255,255,0.15);
      color: white;
      border-color: rgba(255,255,255,0.3);
      transform: translateY(-1px);
    }

    .nav-link.active {
      background: white;
      color: #C8102E;
      border-color: white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .nav-icon {
      width: 20px;
      height: 20px;
    }

    /* User Actions - Right Side */
    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
      order: 1;
    }

    .action-btn {
      position: relative;
      background: rgba(255,255,255,0.15);
      border: 2px solid rgba(255,255,255,0.2);
      border-radius: 10px;
      padding: 0.625rem;
      cursor: pointer;
      transition: all 0.3s ease;
      color: white;
    }

    .action-btn:hover {
      background: rgba(255,255,255,0.25);
      border-color: rgba(255,255,255,0.4);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .action-icon {
      width: 24px;
      height: 24px;
    }

    .notification-badge {
      position: absolute;
      top: -6px;
      right: -6px;
      background: #FFFFFF;
      color: #C8102E;
      font-size: 0.7rem;
      font-weight: 700;
      padding: 0.15rem 0.4rem;
      border-radius: 12px;
      min-width: 22px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { 
        transform: scale(1);
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      }
      50% { 
        transform: scale(1.1);
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      }
    }

    .user-menu-container {
      position: relative;
    }

    .user-menu-btn {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: rgba(255,255,255,0.15);
      border: 2px solid rgba(255,255,255,0.2);
      border-radius: 12px;
      padding: 0.5rem 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      color: white;
    }

    .user-menu-btn:hover {
      background: rgba(255,255,255,0.25);
      border-color: rgba(255,255,255,0.4);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .user-avatar, .user-avatar-placeholder {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid rgba(255,255,255,0.3);
    }

    .user-avatar-placeholder {
      background: rgba(255,255,255,0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.9rem;
    }

    .user-name {
      font-weight: 600;
      max-width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 0.95rem;
    }

    .dropdown-icon {
      width: 20px;
      height: 20px;
      transition: transform 0.3s ease;
    }

    .dropdown-icon.rotate {
      transform: rotate(180deg);
    }

    .user-dropdown {
      position: absolute;
      top: calc(100% + 0.75rem);
      right: 0;
      background: white;
      border-radius: 14px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.15);
      min-width: 300px;
      overflow: hidden;
      animation: slideDown 0.3s ease-out;
      border: 2px solid rgba(200, 16, 46, 0.1);
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-15px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .dropdown-header {
      padding: 1.5rem;
      background: linear-gradient(135deg, #C8102E 0%, #A00D25 100%);
      color: white;
    }

    .dropdown-user-name {
      font-weight: 700;
      font-size: 1.15rem;
      margin-bottom: 0.35rem;
    }

    .dropdown-user-email {
      font-size: 0.875rem;
      opacity: 0.95;
      margin-bottom: 0.75rem;
    }

    .dropdown-user-role {
      display: inline-block;
      background: rgba(255,255,255,0.25);
      padding: 0.35rem 0.85rem;
      border-radius: 14px;
      font-size: 0.75rem;
      font-weight: 600;
      border: 1px solid rgba(255,255,255,0.3);
    }

    .dropdown-divider {
      height: 1px;
      background: linear-gradient(to left, transparent, #E5E7EB, transparent);
      margin: 0.5rem 0;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding: 0.875rem 1.5rem;
      color: #374151;
      text-decoration: none;
      transition: all 0.2s ease;
      cursor: pointer;
      border: none;
      background: none;
      width: 100%;
      text-align: right;
      font-size: 0.95rem;
      font-weight: 500;
    }

    .dropdown-item:hover {
      background: linear-gradient(to left, rgba(200, 16, 46, 0.05), transparent);
      color: #C8102E;
    }

    .dropdown-icon-item {
      width: 20px;
      height: 20px;
      color: #6B7280;
      transition: color 0.2s ease;
    }

    .dropdown-item:hover .dropdown-icon-item {
      color: #C8102E;
    }

    .logout-item {
      color: #C8102E;
      font-weight: 600;
    }

    .logout-item .dropdown-icon-item {
      color: #C8102E;
    }

    .logout-item:hover {
      background: linear-gradient(to left, rgba(200, 16, 46, 0.1), transparent);
    }

    @media (max-width: 768px) {
      .header-container {
        padding: 0 1rem;
      }

      .header-nav {
        display: none;
      }

      .user-name {
        display: none;
      }

      .brand-name {
        font-size: 1.5rem;
      }
    }
  `]
})
export class HeaderComponent implements OnInit {
  userData: UserData | null = null;
  showUserMenu = false;
  showNotifications = false;
  unreadCount = 3;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  private loadUserData(): void {
    const userDataStr = localStorage.getItem('userData');
    if (userDataStr) {
      try {
        this.userData = JSON.parse(userDataStr);
      } catch (e) {
        console.error('خطا در خواندن اطلاعات کاربر:', e);
      }
    }
  }

  getInitials(fullName?: string): string {
    if (!fullName) return 'ک';
    const parts = fullName.trim().split(' ');
    if (parts.length >= 2) {
      return parts[0][0] + parts[1][0];
    }
    return fullName[0] || 'ک';
  }

  getRoleLabel(role: string): string {
    const roleMap: { [key: string]: string } = {
      'admin': 'ادمین فنی',
      'hr_admin': 'ادمین آموزش و توسعه',
      'manager': 'مدیر سازمان'
    };
    return roleMap[role] || role;
  }

  navigateHome(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/auth/login']);
    }
    this.showUserMenu = false;
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
    this.showNotifications = false;
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    this.showUserMenu = false;
  }

  closeUserMenu(): void {
    this.showUserMenu = false;
  }

  logout(): void {
    this.showUserMenu = false;
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    this.router.navigate(['/auth/login']);
  }
}
