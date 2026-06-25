import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface ContentSuggestion {
  id: number;
  title: string;
  description: string;
  url: string;
  media_type_id: number;
  media_type_name: string;
  competency_id: number;
  competency_name: string;
  suggested_by_user_id: number;
  suggested_by_name: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  created_at: string;
  reviewed_at?: string;
  reviewed_by_name?: string;
}

interface ModerationResponse {
  suggestions: ContentSuggestion[];
  total: number;
  page: number;
  limit: number;
  stats: {
    pending: number;
    approved: number;
    rejected: number;
  };
}

@Component({
  selector: 'app-content-moderation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './content-moderation.component.html',
  styleUrls: ['./content-moderation.component.css']
})
export class ContentModerationComponent implements OnInit {
  suggestions: ContentSuggestion[] = [];
  loading = false;
  error: string | null = null;
  
  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalSuggestions = 0;
  totalPages = 0;
  
  // Stats
  stats = {
    pending: 0,
    approved: 0,
    rejected: 0
  };
  
  // Filters
  statusFilter: string = 'pending';
  mediaTypeFilter: string = 'all';
  competencyFilter: string = 'all';
  searchTerm = '';
  
  // Modal
  showModal = false;
  selectedSuggestion: ContentSuggestion | null = null;
  adminNotes = '';
  
  // Available options (loaded from backend)
  mediaTypes: any[] = [];
  competencies: any[] = [];

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // اجرای ایمن بارگذاری اولیه در چرخه مایکروتسکی متمایز جهت برطرف کردن کامل تداخل ngOnInit
    Promise.resolve().then(() => {
      this.loadMediaTypes();
      this.loadCompetencies();
      this.loadSuggestions();
    });
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  loadMediaTypes(): void {
    this.http.get<any[]>(`${environment.apiUrl}/content/media-types`, {
      headers: this.getHeaders()
    }).subscribe({
      next: (types) => {
        Promise.resolve().then(() => {
          this.mediaTypes = types;
          this.cdr.markForCheck();
        });
      },
      error: (err) => {
        console.error('Error loading media types:', err);
      }
    });
  }

  loadCompetencies(): void {
    this.http.get<any[]>(`${environment.apiUrl}/competencies`, {
      headers: this.getHeaders()
    }).subscribe({
      next: (comps) => {
        Promise.resolve().then(() => {
          this.competencies = comps;
          this.cdr.markForCheck();
        });
      },
      error: (err) => {
        console.error('Error loading competencies:', err);
      }
    });
  }

  loadSuggestions(): void {
    // تغییر وضعیت شروع کار با استفاده از Promise.resolve برای فرار از خطای همزمانی رندر
    Promise.resolve().then(() => {
      this.loading = true;
      this.error = null;
      this.cdr.markForCheck();
    });
    
    const params: any = {
      page: this.currentPage,
      limit: this.pageSize,
      status: this.statusFilter
    };
    
    if (this.mediaTypeFilter !== 'all') {
      params.media_type_id = this.mediaTypeFilter;
    }
    
    if (this.competencyFilter !== 'all') {
      params.competency_id = this.competencyFilter;
    }
    
    if (this.searchTerm) {
      params.search = this.searchTerm;
    }

    this.http.get<ModerationResponse>(`${environment.apiUrl}/admin/content-suggestions`, {
      headers: this.getHeaders(),
      params
    }).subscribe({
      next: (response) => {
        Promise.resolve().then(() => {
          this.suggestions = response.suggestions || [];
          this.totalSuggestions = response.total || 0;
          this.totalPages = Math.ceil(this.totalSuggestions / this.pageSize);
          this.stats = response.stats || { pending: 0, approved: 0, rejected: 0 };
          this.loading = false;
          this.cdr.detectChanges(); // تثبیت رندر پس از به‌روزرسانی نهایی
        });
      },
      error: (err) => {
        Promise.resolve().then(() => {
          this.error = 'خطا در بارگذاری پیشنهادات محتوا';
          this.loading = false;
          this.cdr.detectChanges();
        });
        console.error('Error loading suggestions:', err);
      }
    });
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadSuggestions();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.statusFilter = 'pending';
    this.mediaTypeFilter = 'all';
    this.competencyFilter = 'all';
    this.currentPage = 1;
    this.loadSuggestions();
  }

  openReviewModal(suggestion: ContentSuggestion): void {
    this.selectedSuggestion = suggestion;
    this.adminNotes = suggestion.admin_notes || '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedSuggestion = null;
    this.adminNotes = '';
  }

  approveSuggestion(): void {
    if (!this.selectedSuggestion) return;
    
    this.moderateSuggestion(this.selectedSuggestion.id, 'approved');
  }

  rejectSuggestion(): void {
    if (!this.selectedSuggestion) return;
    
    if (!this.adminNotes.trim()) {
      alert('لطفاً دلیل رد پیشنهاد را وارد کنید');
      return;
    }
    
    this.moderateSuggestion(this.selectedSuggestion.id, 'rejected');
  }

  private moderateSuggestion(suggestionId: number, status: 'approved' | 'rejected'): void {
    this.loading = true;
    
    this.http.patch(`${environment.apiUrl}/admin/content-suggestions/${suggestionId}`, {
      status,
      admin_notes: this.adminNotes
    }, {
      headers: this.getHeaders()
    }).subscribe({
      next: () => {
        Promise.resolve().then(() => {
          this.closeModal();
          this.loadSuggestions();
          this.loading = false;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        Promise.resolve().then(() => {
          this.error = `خطا در ${status === 'approved' ? 'تأیید' : 'رد'} پیشنهاد`;
          this.loading = false;
          this.cdr.detectChanges();
        });
        console.error('Error moderating suggestion:', err);
      }
    });
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadSuggestions();
  }

  getStatusLabel(status: string): string {
    const labels: any = {
      'pending': 'در انتظار بررسی',
      'approved': 'تأیید شده',
      'rejected': 'رد شده'
    };
    return labels[status] || status;
  }

  getStatusClass(status: string): string {
    const classes: any = {
      'pending': 'badge-warning',
      'approved': 'badge-success',
      'rejected': 'badge-danger'
    };
    return classes[status] || '';
  }

  formatDate(dateString: string): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  openUrl(url: string): void {
    window.open(url, '_blank');
  }
}
