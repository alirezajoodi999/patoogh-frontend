// src/app/features/content/content-detail/content-detail.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ContentService, Content } from '../../../core/services/content.service';

@Component({
  selector: 'app-content-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="content-detail-container" *ngIf="content">
      <div class="content-header">
        <div class="header-actions">
          <button class="btn-back" routerLink="/content">
            <i class="icon-arrow-right"></i>
            بازگشت به لیست
          </button>
          <button class="btn-edit" [routerLink]="['/content/edit', content.id]">
            <i class="icon-edit"></i>
            ویرایش
          </button>
        </div>
        <h1 class="content-title">{{ content.title }}</h1>
      </div>

      <div class="info-card">
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">نوع رسانه:</span>
            <span class="info-value badge badge-media">
              {{ content.mediaTypeName || 'نامشخص' }}
            </span>
          </div>

          <div class="info-item">
            <span class="info-label">منبع:</span>
            <span class="info-value">
              {{ content.sourceName || 'نامشخص' }}
              <span class="source-type" *ngIf="content.sourceType">
                ({{ getSourceTypeLabel(content.sourceType) }})
              </span>
            </span>
          </div>

          <div class="info-item" *ngIf="content.websiteUrl">
            <span class="info-label">وب‌سایت منبع:</span>
            <a [href]="content.websiteUrl" target="_blank" class="info-link">
              {{ content.websiteUrl }}
            </a>
          </div>

          <div class="info-item" *ngIf="content.duration">
            <span class="info-label">مدت زمان:</span>
            <span class="info-value">{{ formatDuration(content.duration) }}</span>
          </div>

          <div class="info-item">
            <span class="info-label">سطح:</span>
            <span class="info-value badge" [ngClass]="'badge-' + content.difficultyLevel">
              {{ getDifficultyLabel(content.difficultyLevel) }}
            </span>
          </div>

          <div class="info-item">
            <span class="info-label">زبان:</span>
            <span class="info-value">{{ getLanguageLabel(content.language) }}</span>
          </div>

          <div class="info-item" *ngIf="content.averageRating">
            <span class="info-label">امتیاز میانگین:</span>
            <span class="info-value rating">
              {{ content.averageRating.toFixed(1) }}/5
              <span class="rating-stars">{{ getStars(content.averageRating) }}</span>
            </span>
          </div>

          <div class="info-item" *ngIf="content.viewCount">
            <span class="info-label">تعداد بازدید:</span>
            <span class="info-value">{{ content.viewCount.toLocaleString('fa-IR') }}</span>
          </div>

          <div class="info-item" *ngIf="content.likeCount">
            <span class="info-label">تعداد پسندیدن:</span>
            <span class="info-value">{{ content.likeCount.toLocaleString('fa-IR') }}</span>
          </div>

          <div class="info-item">
            <span class="info-label">وضعیت انتشار:</span>
            <span class="info-value badge" [ngClass]="content.isPublished ? 'badge-published' : 'badge-draft'">
              {{ content.isPublished ? 'منتشر شده' : 'پیش‌نویس' }}
            </span>
          </div>

          <div class="info-item" *ngIf="content.publishedAt">
            <span class="info-label">تاریخ انتشار:</span>
            <span class="info-value">{{ formatDate(content.publishedAt) }}</span>
          </div>

          <div class="info-item" *ngIf="content.fileType">
            <span class="info-label">نوع فایل:</span>
            <span class="info-value">{{ content.fileType }}</span>
          </div>

          <div class="info-item" *ngIf="content.fileSize">
            <span class="info-label">حجم فایل:</span>
            <span class="info-value">{{ formatFileSize(content.fileSize) }}</span>
          </div>
        </div>
      </div>

      <div class="description-card" *ngIf="content.description">
        <h3>توضیحات</h3>
        <p class="description-text">{{ content.description }}</p>
      </div>

      <div class="competencies-card" *ngIf="content.competencies && content.competencies.length > 0">
        <h3>شایستگی‌های مرتبط</h3>
        <div class="competencies-list">
          <div class="competency-chip" *ngFor="let comp of content.competencies">
            <span class="competency-name">{{ comp.name }}</span>
            <span class="competency-category" *ngIf="comp.category">{{ comp.category }}</span>
          </div>
        </div>
      </div>

      <div class="tags-card" *ngIf="content.tags && content.tags.length > 0">
        <h3>برچسب‌ها</h3>
        <div class="tags-list">
          <span class="tag" *ngFor="let tag of content.tags">{{ tag }}</span>
        </div>
      </div>

      <div class="creator-card" *ngIf="content.creator">
        <h3>ایجادکننده</h3>
        <div class="creator-info">
          <span class="creator-name">{{ content.creator.fullName }}</span>
        </div>
      </div>

      <div class="thumbnail-card" *ngIf="content.thumbnailUrl">
        <h3>تصویر شاخص</h3>
        <img [src]="content.thumbnailUrl" [alt]="content.title" class="thumbnail-image">
      </div>

      <div class="access-card" *ngIf="content.fileUrl">
        <h3>دسترسی به محتوا</h3>
        <a [href]="content.fileUrl" target="_blank" class="btn-access">
          <i class="icon-link"></i>
          مشاهده محتوا
        </a>
      </div>

      <div class="meta-info">
        <span>ایجاد: {{ formatDate(content.createdAt) }}</span>
        <span>آخرین بروزرسانی: {{ formatDate(content.updatedAt) }}</span>
      </div>
    </div>

    <div class="loading-container" *ngIf="loading">
      <div class="spinner"></div>
      <p>در حال بارگذاری...</p>
    </div>

    <div class="error-container" *ngIf="error">
      <i class="icon-error"></i>
      <p>{{ error }}</p>
      <button class="btn-retry" (click)="loadContent()">تلاش مجدد</button>
    </div>
  `,
  styles: [`
    .content-detail-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      direction: rtl;
    }

    .content-header {
      margin-bottom: 2rem;
    }

    .header-actions {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    .btn-back, .btn-edit {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s;
      font-family: inherit;
    }

    .btn-back {
      background: #f5f5f5;
      color: #333;
    }

    .btn-back:hover {
      background: #e0e0e0;
    }

    .btn-edit {
      background: #4CAF50;
      color: white;
    }

    .btn-edit:hover {
      background: #45a049;
    }

    .content-title {
      font-size: 2rem;
      font-weight: bold;
      color: #1a1a1a;
      margin: 0;
    }

    .info-card, .description-card, .competencies-card, 
    .tags-card, .access-card, .creator-card, .thumbnail-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .info-label {
      font-size: 0.875rem;
      color: #666;
      font-weight: 500;
    }

    .info-value {
      font-size: 1rem;
      color: #1a1a1a;
      font-weight: 600;
    }

    .info-link {
      color: #2196F3;
      text-decoration: none;
      font-size: 0.875rem;
    }

    .info-link:hover {
      text-decoration: underline;
    }

    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .badge-media {
      background: #E3F2FD;
      color: #1976D2;
    }

    .badge-beginner {
      background: #E8F5E9;
      color: #388E3C;
    }

    .badge-intermediate {
      background: #FFF3E0;
      color: #F57C00;
    }

    .badge-advanced {
      background: #FFEBEE;
      color: #D32F2F;
    }

    .badge-expert {
      background: #F3E5F5;
      color: #7B1FA2;
    }

    .badge-published {
      background: #E8F5E9;
      color: #388E3C;
    }

    .badge-draft {
      background: #FFF3E0;
      color: #F57C00;
    }

    .source-type {
      font-size: 0.875rem;
      color: #666;
      font-weight: normal;
    }

    .rating {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .rating-stars {
      color: #FFC107;
      font-size: 1.1rem;
    }

    .description-text {
      line-height: 1.8;
      color: #333;
      white-space: pre-wrap;
      margin: 0;
    }

    .competencies-list {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .competency-chip {
      background: #F5F5F5;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .competency-name {
      font-weight: 600;
      color: #1a1a1a;
    }

    .competency-category {
      font-size: 0.875rem;
      color: #666;
    }

    .tags-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .tag {
      background: #E0E0E0;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.875rem;
      color: #333;
    }

    .creator-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .creator-name {
      font-weight: 600;
      color: #1a1a1a;
    }

    .thumbnail-image {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .btn-access {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 2rem;
      background: #2196F3;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      transition: all 0.3s;
    }

    .btn-access:hover {
      background: #1976D2;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
    }

    .meta-info {
      display: flex;
      justify-content: space-between;
      padding: 1rem;
      background: #f9f9f9;
      border-radius: 8px;
      font-size: 0.875rem;
      color: #666;
    }

    .loading-container, .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      gap: 1rem;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #2196F3;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .error-container i {
      font-size: 3rem;
      color: #f44336;
    }

    .btn-retry {
      padding: 0.75rem 1.5rem;
      background: #2196F3;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s;
    }

    .btn-retry:hover {
      background: #1976D2;
    }

    h3 {
      margin: 0 0 1rem 0;
      color: #1a1a1a;
      font-size: 1.25rem;
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .content-detail-container {
        padding: 1rem;
      }

      .info-grid {
        grid-template-columns: 1fr;
      }

      .content-title {
        font-size: 1.5rem;
      }

      .header-actions {
        flex-direction: column;
        gap: 0.5rem;
      }

      .btn-back, .btn-edit {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class ContentDetailComponent implements OnInit {
  content: Content | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contentService: ContentService
  ) {}

  ngOnInit(): void {
    this.loadContent();
  }

  loadContent(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'شناسه محتوا یافت نشد';
      return;
    }

    this.loading = true;
    this.error = null;

    this.contentService.getContentById(+id).subscribe({
      next: (data) => {
        this.content = data;
        this.loading = false;
      },
      error: (err: unknown) => {
        this.error = 'خطا در بارگذاری محتوا';
        this.loading = false;
        console.error('Error loading content:', err);
      }
    });
  }

  getSourceTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      internal: 'داخلی',
      external: 'خارجی',
      partner: 'همکار',
      purchased: 'خریداری شده'
    };
    return labels[type] || type;
  }

  getDifficultyLabel(difficulty: string): string {
    const labels: Record<string, string> = {
      beginner: 'مبتدی',
      intermediate: 'متوسط',
      advanced: 'پیشرفته',
      expert: 'خبره'
    };
    return labels[difficulty] || difficulty;
  }

  getLanguageLabel(language: string): string {
    const labels: Record<string, string> = {
      fa: 'فارسی',
      en: 'انگلیسی',
      ar: 'عربی'
    };
    return labels[language] || language;
  }

  formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} دقیقه`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours} ساعت و ${mins} دقیقه` : `${hours} ساعت`;
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) {
      return `${bytes} بایت`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} کیلوبایت`;
    } else if (bytes < 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} مگابایت`;
    } else {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} گیگابایت`;
    }
  }

  getStars(rating: number): string {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return '★'.repeat(fullStars) + 
           (hasHalfStar ? '⯨' : '') + 
           '☆'.repeat(emptyStars);
  }

  formatDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj);
  }
}
