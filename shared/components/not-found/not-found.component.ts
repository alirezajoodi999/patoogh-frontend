// src/app/shared/components/not-found/not-found.component.ts
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule],
  template: `
    <div class="not-found-container">
      <mat-icon class="not-found-icon">error_outline</mat-icon>
      <h1>۴۰۴</h1>
      <h2>صفحه مورد نظر یافت نشد</h2>
      <p>متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد.</p>
      <button mat-raised-button color="primary" routerLink="/dashboard">
        <mat-icon>home</mat-icon>
        بازگشت به داشبورد
      </button>
    </div>
  `,
  styles: [`
    .not-found-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      text-align: center;
      padding: 2rem;
    }

    .not-found-icon {
      font-size: 120px;
      width: 120px;
      height: 120px;
      color: #f44336;
      margin-bottom: 1rem;
    }

    h1 {
      font-size: 6rem;
      margin: 0;
      color: #333;
    }

    h2 {
      font-size: 2rem;
      margin: 1rem 0;
      color: #666;
    }

    p {
      font-size: 1.2rem;
      color: #999;
      margin-bottom: 2rem;
    }

    button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  `]
})
export class NotFoundComponent {}
