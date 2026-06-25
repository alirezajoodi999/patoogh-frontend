import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container" dir="rtl">
      <div class="auth-background">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
      </div>
      
      <div class="auth-card">
        <div class="auth-header">
          <div class="logo-container">
            <svg class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h1 class="brand-title">پاتوق</h1>
          </div>
          <h2 class="auth-title">ایجاد حساب کاربری</h2>
          <p class="auth-subtitle">برای شروع، اطلاعات خود را وارد کنید</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="alert alert-error" *ngIf="errorMessage">
            <svg class="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ errorMessage }}</span>
          </div>

          <div class="form-row">
            <div class="form-group" [class.has-error]="isFieldInvalid('firstName')">
              <label class="form-label">
                <svg class="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                نام
              </label>
              <div class="input-wrapper">
                <input 
                  type="text" 
                  formControlName="firstName" 
                  class="form-control"
                  placeholder="نام خود را وارد کنید"
                  [class.error]="isFieldInvalid('firstName')"
                  autocomplete="given-name">
              </div>
              <span class="error-message" *ngIf="isFieldInvalid('firstName')">
                نام الزامی است
              </span>
            </div>

            <div class="form-group" [class.has-error]="isFieldInvalid('lastName')">
              <label class="form-label">
                <svg class="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                نام خانوادگی
              </label>
              <div class="input-wrapper">
                <input 
                  type="text" 
                  formControlName="lastName" 
                  class="form-control"
                  placeholder="نام خانوادگی خود را وارد کنید"
                  [class.error]="isFieldInvalid('lastName')"
                  autocomplete="family-name">
              </div>
              <span class="error-message" *ngIf="isFieldInvalid('lastName')">
                نام خانوادگی الزامی است
              </span>
            </div>
          </div>

          <div class="form-group" [class.has-error]="isFieldInvalid('username')">
            <label class="form-label">
              <svg class="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              نام کاربری
            </label>
            <div class="input-wrapper">
              <input 
                type="text" 
                formControlName="username" 
                class="form-control"
                placeholder="نام کاربری منحصر به فرد"
                [class.error]="isFieldInvalid('username')"
                autocomplete="username">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <span class="error-message" *ngIf="isFieldInvalid('username')">
              نام کاربری الزامی است
            </span>
          </div>

          <div class="form-group" [class.has-error]="isFieldInvalid('email')">
            <label class="form-label">
              <svg class="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              ایمیل
            </label>
            <div class="input-wrapper">
              <input 
                type="email" 
                formControlName="email" 
                class="form-control"
                placeholder="example@domain.com"
                [class.error]="isFieldInvalid('email')"
                autocomplete="email">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>
            <span class="error-message" *ngIf="isFieldInvalid('email')">
              {{ getEmailError() }}
            </span>
          </div>

          <div class="form-row">
            <div class="form-group" [class.has-error]="isFieldInvalid('password')">
              <label class="form-label">
                <svg class="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                رمز عبور
              </label>
              <div class="input-wrapper">
                <input 
                  [type]="showPassword ? 'text' : 'password'" 
                  formControlName="password" 
                  class="form-control"
                  placeholder="حداقل 6 کاراکتر"
                  [class.error]="isFieldInvalid('password')"
                  autocomplete="new-password">
                <button type="button" class="toggle-password" (click)="togglePassword()" [attr.aria-label]="showPassword ? 'مخفی کردن رمز عبور' : 'نمایش رمز عبور'">
                  <svg *ngIf="!showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg *ngIf="showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
              </div>
              <span class="error-message" *ngIf="isFieldInvalid('password')">
                رمز عبور باید حداقل 6 کاراکتر باشد
              </span>
            </div>

            <div class="form-group" [class.has-error]="isFieldInvalid('confirmPassword') || passwordMismatch()">
              <label class="form-label">
                <svg class="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                تکرار رمز عبور
              </label>
              <div class="input-wrapper">
                <input 
                  [type]="showConfirmPassword ? 'text' : 'password'" 
                  formControlName="confirmPassword" 
                  class="form-control"
                  placeholder="رمز عبور را تکرار کنید"
                  [class.error]="isFieldInvalid('confirmPassword') || passwordMismatch()"
                  autocomplete="new-password">
                <button type="button" class="toggle-password" (click)="toggleConfirmPassword()" [attr.aria-label]="showConfirmPassword ? 'مخفی کردن رمز عبور' : 'نمایش رمز عبور'">
                  <svg *ngIf="!showConfirmPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg *ngIf="showConfirmPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
              </div>
              <span class="error-message" *ngIf="isFieldInvalid('confirmPassword')">
                تکرار رمز عبور الزامی است
              </span>
              <span class="error-message" *ngIf="passwordMismatch() && registerForm.get('confirmPassword')?.touched">
                رمز عبور و تکرار آن یکسان نیستند
              </span>
            </div>
          </div>

          <div class="terms-agreement">
            <label class="checkbox-label">
              <input type="checkbox" class="checkbox" [(ngModel)]="agreedToTerms" [ngModelOptions]="{standalone: true}">
              <span>
                با <a routerLink="/terms" class="link">قوانین و مقررات</a> و 
                <a routerLink="/privacy" class="link">حریم خصوصی</a> موافقم
              </span>
            </label>
          </div>

          <button type="submit" class="submit-btn" [disabled]="registerForm.invalid || loading || !agreedToTerms">
            <span *ngIf="!loading" class="btn-content">
              <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              ثبت‌نام
            </span>
            <span *ngIf="loading" class="btn-loading">
              <svg class="spinner" viewBox="0 0 24 24">
                <circle class="spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
              </svg>
              در حال ثبت‌نام...
            </span>
          </button>
        </form>

        <div class="auth-footer">
          <p class="footer-text">
            قبلاً ثبت‌نام کرده‌اید؟
            <a routerLink="/auth/login" class="login-link">وارد شوید</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    * {
      box-sizing: border-box;
    }

    .auth-container {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #C8102E 0%, #8B0A1F 50%, #5A0614 100%);
      padding: 2rem;
      overflow: hidden;
    }

    .auth-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      z-index: 0;
    }

    .shape {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.05);
      animation: float 20s infinite ease-in-out;
    }

    .shape-1 {
      width: 400px;
      height: 400px;
      top: -200px;
      right: -100px;
      animation-delay: 0s;
    }

    .shape-2 {
      width: 300px;
      height: 300px;
      bottom: -150px;
      left: -50px;
      animation-delay: 5s;
    }

    .shape-3 {
      width: 250px;
      height: 250px;
      top: 50%;
      left: 50%;
      animation-delay: 10s;
    }

    @keyframes float {
      0%, 100% {
        transform: translate(0, 0) scale(1);
      }
      33% {
        transform: translate(30px, -30px) scale(1.1);
      }
      66% {
        transform: translate(-20px, 20px) scale(0.9);
      }
    }

    .auth-card {
      position: relative;
      z-index: 1;
      background: white;
      padding: 3rem;
      border-radius: 24px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      width: 100%;
      max-width: 600px;
      animation: slideUp 0.6s ease-out;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .auth-header {
      text-align: center;
      margin-bottom: 2.5rem;
    }

    .logo-container {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .logo-icon {
      width: 48px;
      height: 48px;
      color: #C8102E;
      filter: drop-shadow(0 2px 4px rgba(200, 16, 46, 0.2));
    }

    .brand-title {
      font-size: 2.5rem;
      font-weight: 800;
      color: #C8102E;
      margin: 0;
      letter-spacing: 1px;
    }

    .auth-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: #1F2937;
      margin: 0 0 0.5rem 0;
    }

    .auth-subtitle {
      font-size: 0.95rem;
      color: #6B7280;
      margin: 0;
    }

    .auth-form {
      margin-bottom: 2rem;
    }

    .alert {
      padding: 1rem;
      border-radius: 12px;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      animation: slideDown 0.3s ease-out;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .alert-error {
      background: #FEF2F2;
      border: 1px solid #FCA5A5;
      color: #991B1B;
    }

    .alert-icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group.has-error .form-control {
      border-color: #EF4444;
    }

    .form-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
      font-weight: 600;
      color: #374151;
      font-size: 0.95rem;
    }

    .label-icon {
      width: 18px;
      height: 18px;
      color: #C8102E;
    }

    .input-wrapper {
      position: relative;
      width: 100%;
    }

    .form-control {
      width: 100%;
      padding: 0.875rem 2.75rem 0.875rem 0.875rem;
      border: 2px solid #E5E7EB;
      border-radius: 12px;
      font-size: 0.95rem;
      transition: all 0.3s ease;
      background: #F9FAFB;
      font-family: inherit;
      direction: rtl;
      text-align: right;
      display: block;
    }

    .form-control:focus {
      outline: none;
      border-color: #C8102E;
      background: white;
      box-shadow: 0 0 0 4px rgba(200, 16, 46, 0.1);
    }

    .form-control.error {
      border-color: #EF4444;
      background: #FEF2F2;
    }

    .form-control::placeholder {
      color: #9CA3AF;
      text-align: right;
    }

    .input-icon {
      position: absolute;
      right: 0.875rem;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
      color: #9CA3AF;
      pointer-events: none;
    }

    .toggle-password {
      position: absolute;
      right: 0.875rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.25rem;
      color: #6B7280;
      transition: color 0.2s ease;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .toggle-password:hover {
      color: #C8102E;
    }

    .toggle-password:focus {
      outline: 2px solid #C8102E;
      outline-offset: 2px;
      border-radius: 4px;
    }

    .toggle-password svg {
      width: 20px;
      height: 20px;
    }

    .error-message {
      display: block;
      margin-top: 0.5rem;
      font-size: 0.85rem;
      color: #EF4444;
      font-weight: 500;
    }

    .terms-agreement {
      margin-bottom: 2rem;
      padding: 1rem;
      background: #F9FAFB;
      border-radius: 12px;
      border: 2px solid #E5E7EB;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      font-size: 0.9rem;
      color: #6B7280;
      user-select: none;
    }

    .checkbox {
      width: 18px;
      height: 18px;
      cursor: pointer;
      accent-color: #C8102E;
      flex-shrink: 0;
    }

    .link {
      color: #C8102E;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.2s ease;
      margin: 0 0.25rem;
    }

    .link:hover {
      color: #A00D25;
      text-decoration: underline;
    }

    .link:focus {
      outline: 2px solid #C8102E;
      outline-offset: 2px;
      border-radius: 4px;
    }

    .submit-btn {
      width: 100%;
      padding: 1rem;
      background: linear-gradient(135deg, #C8102E 0%, #A00D25 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(200, 16, 46, 0.3);
    }

    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(200, 16, 46, 0.4);
    }

    .submit-btn:active:not(:disabled) {
      transform: translateY(0);
    }

    .submit-btn:disabled {
      background: linear-gradient(135deg, #D1D5DB 0%, #9CA3AF 100%);
      cursor: not-allowed;
      box-shadow: none;
      opacity: 0.6;
    }

    .submit-btn:focus {
      outline: 2px solid #C8102E;
      outline-offset: 2px;
    }

    .btn-content, .btn-loading {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .btn-icon {
      width: 20px;
      height: 20px;
    }

    .spinner {
      width: 20px;
      height: 20px;
      animation: spin 1s linear infinite;
    }

    .spinner-circle {
      stroke-dasharray: 60;
      stroke-dashoffset: 0;
      animation: dash 1.5s ease-in-out infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    @keyframes dash {
      0% {
        stroke-dashoffset: 60;
      }
      50% {
        stroke-dashoffset: 15;
      }
      100% {
        stroke-dashoffset: 60;
      }
    }

    .auth-footer {
      text-align: center;
      padding-top: 2rem;
      border-top: 2px solid #F3F4F6;
    }

    .footer-text {
      margin: 0;
      color: #6B7280;
      font-size: 0.95rem;
    }

    .login-link {
      color: #C8102E;
      text-decoration: none;
      font-weight: 700;
      margin-right: 0.5rem;
      transition: all 0.2s ease;
    }

    .login-link:hover {
      color: #A00D25;
      text-decoration: underline;
    }

    .login-link:focus {
      outline: 2px solid #C8102E;
      outline-offset: 2px;
      border-radius: 4px;
    }

    @media (max-width: 768px) {
      .auth-container {
        padding: 1rem;
      }

      .auth-card {
        padding: 2rem 1.5rem;
      }

      .brand-title {
        font-size: 2rem;
      }

      .auth-title {
        font-size: 1.5rem;
      }

      .form-row {
        grid-template-columns: 1fr;
        gap: 0;
      }

      .shape-1 {
        width: 300px;
        height: 300px;
        top: -150px;
        right: -75px;
      }

      .shape-2, .shape-3 {
        display: none;
      }
    }

    @media (max-width: 480px) {
      .auth-card {
        padding: 1.5rem;
      }

      .brand-title {
        font-size: 1.75rem;
      }

      .auth-title {
        font-size: 1.25rem;
      }

      .auth-subtitle {
        font-size: 0.9rem;
      }
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  loading = false;
  errorMessage: string = '';
  agreedToTerms = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern(/^[\u0600-\u06FF\s]+$/)]],
      lastName: ['', [Validators.required, Validators.pattern(/^[\u0600-\u06FF\s]+$/)]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9_.-]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!field && field.invalid && field.touched;
  }

  getEmailError(): string {
    const emailControl = this.registerForm.get('email');
    if (!emailControl?.errors) return '';
    
    if (emailControl.errors['required']) {
      return 'ایمیل الزامی است';
    }
    if (emailControl.errors['email']) {
      return 'ایمیل معتبر نیست';
    }
    return '';
  }

  passwordMismatch(): boolean {
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;
    return password !== confirmPassword && confirmPassword !== '';
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    if (this.registerForm.invalid || !this.agreedToTerms) {
      this.markAllAsTouched();
      return;
    }

    if (this.passwordMismatch()) {
      this.errorMessage = 'رمز عبور و تکرار آن یکسان نیستند';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const formValue = this.registerForm.value;
    const userData = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      fullName: `${formValue.firstName} ${formValue.lastName}`,
      username: formValue.username,
      email: formValue.email,
      password: formValue.password
    };

    this.authService.register(userData).subscribe({
      next: (response) => {
        this.loading = false;
        this.router.navigate(['/auth/login'], {
          queryParams: { registered: 'true' }
        });
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = this.getErrorMessage(error);
      }
    });
  }

  private markAllAsTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }

  private getErrorMessage(error: any): string {
    if (error.status === 409) {
      if (error.error?.message?.includes('email')) {
        return 'این ایمیل قبلاً ثبت شده است';
      }
      if (error.error?.message?.includes('username')) {
        return 'این نام کاربری قبلاً ثبت شده است';
      }
      return 'اطلاعات وارد شده تکراری است';
    }
    
    if (error.status === 400) {
      return 'اطلاعات وارد شده معتبر نیست';
    }
    
    if (error.status === 0 || error.status >= 500) {
      return 'خطایی در سرور رخ داده است. لطفاً دوباره تلاش کنید';
    }
    
    return 'خطایی در ثبت‌نام رخ داد. لطفاً دوباره تلاش کنید';
  }
}
