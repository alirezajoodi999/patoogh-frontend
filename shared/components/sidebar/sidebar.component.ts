import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar">
      <div class="logo">
        <div class="logo-container">
          <h2>پاتوق</h2>
          <span class="logo-subtitle">مدیریت توکا</span>
          
          <!-- نمایش نشان نقش (Badge) برای ادمین یا مدیر سیستم/محتوا -->
          <span *ngIf="userRole === 'admin' || userRole === 'manager'" 
                class="user-role-badge" 
                [ngClass]="userRole">
            {{ getRoleLabel() }}
          </span>
        </div>
      </div>
      
      <nav class="nav-menu">
        <!-- داشبورد: دسترسی برای همه کاربران -->
        <a routerLink="/home" routerLinkActive="active" class="nav-item" aria-label="خانه">
          <span class="icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9,22 9,12 15,12 15,22"/>
            </svg>
          </span>
          <span class="nav-label">خانه</span>
        </a>

        <!-- شایستگی‌ها: دسترسی برای همه کاربران -->
        <a routerLink="/competencies" routerLinkActive="active" class="nav-item" aria-label="شایستگی‌ها">
          <span class="icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
            </svg>
          </span>
          <span class="nav-label">شایستگی‌ها</span>
        </a>

        <!-- محتواها: دسترسی برای همه کاربران جهت مشاهده -->
        <a routerLink="/content" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-item" aria-label="محتواها">
          <span class="icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
          </span>
          <span class="nav-label">بانک محتوا</span>
        </a>

        <!-- مدیریت و آپلود محتوا: هدایت مستقیم به فرم ثبت محتوا بدون بروز ۴۰۴ -->
        <a *ngIf="userRole === 'admin' || userRole === 'manager'" 
          routerLink="/content/create" routerLinkActive="active" class="nav-item special-item" aria-label="مدیریت محتوا">
          <span class="icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M12 5v14M5 12h14" stroke-linecap="round"/>
            </svg>
          </span>
          <span class="nav-label">مدیریت و آپلود محتوا</span>
        </a>

        <!-- پیشرفت: دسترسی برای همه کاربران -->
        <a routerLink="/progress" routerLinkActive="active" class="nav-item" aria-label="پیشرفت">
          <span class="icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <line x1="18" y1="20" x2="18" y2="10"/>
              <line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
          </span>
          <span class="nav-label">پیشرفت من</span>
        </a>

        <!-- یادآورها: دسترسی برای همه کاربران -->
        <a routerLink="/reminders" routerLinkActive="active" class="nav-item" aria-label="یادآورها">
          <span class="icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </span>
          <span class="nav-label">یادآورها</span>
        </a>

        <!-- بخش مدیریت کاربران و گزارشات: مخصوص ADMIN ارشد -->
        <ng-container *ngIf="userRole === 'admin'">
          <div class="menu-divider">بخش مدیریت سیستم</div>
          
          <a routerLink="/admin/users" routerLinkActive="active" class="nav-item admin-item" aria-label="مدیریت کاربران">
            <span class="icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </span>
            <span class="nav-label">مدیریت کاربران</span>
          </a>

          <a routerLink="/admin/content-moderation" routerLinkActive="active" class="nav-item admin-item" aria-label="بررسی پیشنهادات">
            <span class="icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </span>
            <span class="nav-label">بررسی پیشنهادات</span>
          </a>

          <a routerLink="/admin/reports" routerLinkActive="active" class="nav-item admin-item" aria-label="گزارشات آماری">
            <span class="icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/>
                <path d="M22 12A10 10 0 0 0 12 2v10z"/>
              </svg>
            </span>
            <span class="nav-label">گزارشات و آمار کلی</span>
          </a>
        </ng-container>

      </nav>

      <div class="sidebar-footer">
        <button (click)="logout()" class="logout-btn" aria-label="خروج از حساب">
          <span class="icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16,17 21,12 16,7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </span>
          <span class="nav-label">خروج</span>
        </button>
      </div>
    </aside>
  `,
  styles: [`
    :host {
      direction: rtl;
    }

    .sidebar {
      width: 260px;
      background: #FFFFFF;
      border-right: 3px solid #C8102E;
      display: flex;
      flex-direction: column;
      height: 100vh;
      position: sticky;
      top: 0;
      box-shadow: 4px 0 20px rgba(200, 16, 46, 0.08);
    }

    .logo {
      background: #FFFFFF;
      border-bottom: 3px solid #C8102E;
    }

    .logo-container {
      padding: 1.5rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .logo h2 {
      margin: 0 0 0.2rem 0;
      font-size: 2.2rem;
      color: #C8102E;
      font-weight: 800;
    }

    .logo-subtitle {
      display: block;
      font-size: 0.95rem;
      color: #6D6E71;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .user-role-badge {
      font-size: 0.75rem;
      padding: 0.35rem 0.95rem;
      border-radius: 20px;
      font-weight: 700;
      color: #FFF;
      text-align: center;
      margin-top: 0.35rem;
      letter-spacing: 0.2px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      display: inline-block;
    }

    .user-role-badge.admin {
      background: linear-gradient(135deg, #C8102E 0%, #A00D25 100%);
    }

    .user-role-badge.manager {
      background: linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%);
    }

    .nav-menu {
      flex: 1;
      padding: 1rem 0;
      overflow-y: auto;
      background: #FFFFFF;
    }

    .nav-item {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex-direction: row;
      padding: 0.85rem 1.1rem;
      margin: 0.4rem 0.75rem;
      color: #6D6E71;
      text-decoration: none;
      border-radius: 12px;
      transition: all 0.3s ease;
      font-weight: 700;
      font-size: 0.95rem;
      position: relative;
      border: 1.5px solid #E0E0E0;
      background: #FFFFFF;
    }

    .special-item {
      border-color: rgba(46, 125, 50, 0.3);
      color: #2E7D32;
    }

    .special-item:hover {
      background: rgba(46, 125, 50, 0.05) !important;
      color: #2E7D32 !important;
      border-color: #2E7D32 !important;
    }

    .admin-item {
      border-color: rgba(200, 16, 46, 0.15);
    }

    .menu-divider {
      padding: 0.8rem 1.25rem 0.3rem;
      font-size: 0.8rem;
      font-weight: 800;
      color: #A00D25;
      text-transform: uppercase;
      border-top: 1px dashed #E0E0E0;
      margin-top: 0.8rem;
    }

    .nav-label {
      flex: 1;
      text-align: right;
    }

    .icon {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-inline-end: 0.75rem;
    }

    .icon svg {
      width: 20px;
      height: 20px;
    }

    .nav-item:hover {
      background: rgba(200, 16, 46, 0.04);
      color: #C8102E;
      border-color: rgba(200, 16, 46, 0.25);
    }

    .nav-item.active {
      background: linear-gradient(135deg, #C8102E 0%, #A00D25 100%);
      color: #FFFFFF;
      border-color: #C8102E;
      box-shadow: 0 4px 18px rgba(200, 16, 46, 0.3);
    }

    .nav-item.active .icon svg {
      stroke: #FFFFFF;
    }

    .sidebar-footer {
      padding: 1rem 1.5rem 1.5rem;
      border-top: 2px solid #E0E0E0;
      background: #FFFFFF;
    }

    .logout-btn {
      width: 100%;
      padding: 1rem 1.25rem;
      background: #FFFFFF;
      color: #6D6E71;
      border: 1.5px solid #E0E0E0;
      border-radius: 12px;
      cursor: pointer;
      font-weight: 700;
      font-size: 1rem;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex-direction: row;
      transition: all 0.3s ease;
      direction: rtl;
    }

    .logout-btn .icon {
      margin-inline-end: 0.75rem;
    }

    .logout-btn:hover {
      background: linear-gradient(135deg, #C8102E 0%, #A00D25 100%);
      color: #FFFFFF;
      border-color: #C8102E;
      box-shadow: 0 4px 15px rgba(200, 16, 46, 0.3);
    }

    /* Scrollbar */
    .nav-menu::-webkit-scrollbar { width: 4px; }
    .nav-menu::-webkit-scrollbar-track { background: transparent; }
    .nav-menu::-webkit-scrollbar-thumb { background: #C8102E; border-radius: 3px; }
  `]
})
export class SidebarComponent implements OnInit {
  userRole: string = 'employee'; 

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUserRole();
    
    // اجرای مجدد با تاخیرهای کوتاه جهت اطمینان از همگام‌سازی لحظه‌ای با حافظه مرورگر
    setTimeout(() => this.loadUserRole(), 200);
    setTimeout(() => this.loadUserRole(), 800);
  }

  loadUserRole(): void {
    try {
      // ۱. بررسی کلید auth_user (بالاترین اولویت برای ادمین پاتوق)
      const authUser = localStorage.getItem('auth_user');
      
      // ۲. بررسی کلیدهای مستقیم
      const directRole = localStorage.getItem('user_role');
      const roleOnly = localStorage.getItem('role');
      
      // ۳. بررسی کلیدهای جایگزین
      const userData = localStorage.getItem('user_data');
      const user = localStorage.getItem('user');
      
      let detectedRole = '';

      if (authUser) {
        const parsedAuth = JSON.parse(authUser);
        detectedRole = parsedAuth.role || parsedAuth.user_role || '';
      } else if (directRole) {
        detectedRole = directRole;
      } else if (roleOnly) {
        detectedRole = roleOnly;
      } else if (userData) {
        const parsedUserData = JSON.parse(userData);
        detectedRole = parsedUserData.role || '';
      } else if (user) {
        const parsedUser = JSON.parse(user);
        detectedRole = parsedUser.role || '';
      }

      if (detectedRole) {
        this.userRole = detectedRole.trim().toLowerCase();
        this.userRole = this.userRole.replace('role_', '');
      } else {
        this.userRole = 'employee';
      }

      this.cdr.detectChanges();
    } catch (e) {
      console.error('خطا در خواندن نقش:', e);
      this.userRole = 'employee';
    }
  }

  getRoleLabel(): string {
    switch (this.userRole) {
      case 'admin': return 'مدیر ارشد سیستم';
      case 'manager': return 'مدیر محتوا';
      default: return 'کاربر سیستم';
    }
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
