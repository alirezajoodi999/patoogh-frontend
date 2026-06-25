// src/app/features/competencies/competency-detail/competency-detail.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CompetencyService, Competency } from '../../../core/services/competency.service';
import { CommonModule } from '@angular/common';
import { RouterModule} from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'app-competency-detail',
  templateUrl: './competency-detail.component.html',
  styleUrls: ['./competency-detail.component.scss']
})
export class CompetencyDetailComponent implements OnInit, OnDestroy {
  competency: Competency | null = null;
  loading = false;
  error: string | null = null;
  isAdmin = false;

  private destroy$ = new Subject<void>();

  constructor(
    private competencyService: CompetencyService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkAdminRole();
    this.loadCompetency();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private checkAdminRole(): void {
    const userRole = localStorage.getItem('userRole');
    this.isAdmin = userRole === 'admin';
  }

  private loadCompetency(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (!id) {
      this.error = 'شناسه شایستگی یافت نشد';
      return;
    }

    this.loading = true;
    this.error = null;

    this.competencyService.getById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: Competency) => {
          this.competency = data;
          this.loading = false;
        },
        error: (err: any) => {
          this.error = err.message || 'خطا در بارگذاری شایستگی';
          this.loading = false;
          console.error('Error loading competency:', err);
        }
      });
  }

  editCompetency(): void {
    if (this.competency) {
      this.router.navigate(['/competencies', this.competency.id, 'edit']);
    }
  }

  deleteCompetency(): void {
    if (!this.competency) return;

    if (!confirm(`آیا از حذف شایستگی "${this.competency.nameFa}" اطمینان دارید؟`)) {
      return;
    }

    this.loading = true;
    this.competencyService.delete(this.competency.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigate(['/competencies']);
        },
        error: (err: any) => {
          this.error = err.message || 'خطا در حذف شایستگی';
          this.loading = false;
          console.error('Error deleting competency:', err);
        }
      });
  }

  toggleActive(): void {
    if (!this.competency) return;

    // استفاده از متد toSnakeCase برای تبدیل
    const payload = this.competencyService.toSnakeCase({
      isActive: !this.competency.isActive
    });

    this.loading = true;
    this.competencyService.update(this.competency.id, payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updated: Competency) => {
          this.competency = updated;
          this.loading = false;
        },
        error: (err: any) => {
          this.error = err.message || 'خطا در تغییر وضعیت شایستگی';
          this.loading = false;
          console.error('Error toggling competency:', err);
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/competencies']);
  }

  retry(): void {
    this.loadCompetency();
  }

  closeError(): void {
    this.error = null;
  }

  getStatusBadgeClass(): string {
    return this.competency?.isActive ? 'badge-success' : 'badge-secondary';
  }

  getStatusText(): string {
    return this.competency?.isActive ? 'فعال' : 'غیرفعال';
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return '-';
    
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (e) {
      return dateString;
    }
  }

  getMediaIcon(mediaType: string): string {
    const icons: { [key: string]: string } = {
      'video': 'icon-video',
      'audio': 'icon-audio',
      'text': 'icon-text',
      'image': 'icon-image',
      'pdf': 'icon-pdf',
      'presentation': 'icon-presentation'
    };
    return icons[mediaType] || 'icon-file';
  }

  getMediaLabel(mediaType: string): string {
    const labels: { [key: string]: string } = {
      'video': 'ویدیو',
      'audio': 'صوت',
      'text': 'متن',
      'image': 'تصویر',
      'pdf': 'PDF',
      'presentation': 'ارائه'
    };
    return labels[mediaType] || mediaType;
  }

  viewRelatedContent(): void {
    if (this.competency) {
      this.router.navigate(['/contents'], { 
        queryParams: { competencyId: this.competency.id } 
      });
    }
  }
}
