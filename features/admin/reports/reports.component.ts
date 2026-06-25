// features/admin/reports/reports.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalContent: number;
  pendingContent: number;
  totalCompetencies: number;
  totalEvaluations: number;
}

interface UserActivityData {
  date: string;
  activeUsers: number;
  newUsers: number;
}

interface ContentByType {
  mediaType: string;
  count: number;
  percentage: number;
}

interface CompetencyProgress {
  competencyName: string;
  usersCount: number;
  averageProgress: number;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  loading = false;
  error: string | null = null;

  // Date filters
  dateFrom: string = '';
  dateTo: string = '';

  // Statistics
  systemStats: SystemStats = {
    totalUsers: 0,
    activeUsers: 0,
    totalContent: 0,
    pendingContent: 0,
    totalCompetencies: 0,
    totalEvaluations: 0
  };

  userActivity: UserActivityData[] = [];
  contentByType: ContentByType[] = [];
  competencyProgress: CompetencyProgress[] = [];

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    // Set default date range (last 30 days)
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    this.dateTo = this.formatDateForInput(today);
    this.dateFrom = this.formatDateForInput(thirtyDaysAgo);
  }

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.loading = true;
    this.error = null;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const params = {
      dateFrom: this.dateFrom,
      dateTo: this.dateTo
    };

    this.http.get<any>(`${this.apiUrl}/admin/reports`, { headers, params })
      .subscribe({
        next: (response) => {
          this.systemStats = response.systemStats || this.systemStats;
          this.userActivity = response.userActivity || [];
          this.contentByType = response.contentByType || [];
          this.competencyProgress = response.competencyProgress || [];
          this.loading = false;
        },
        error: (err) => {
          this.error = err.error?.message || 'خطا در بارگذاری گزارش‌ها';
          this.loading = false;
          console.error('Error loading reports:', err);
        }
      });
  }

  refreshReports(): void {
    this.loadReports();
  }

  onDateRangeChange(): void {
    if (this.dateFrom && this.dateTo) {
      this.loadReports();
    }
  }

  exportReport(format: 'pdf' | 'excel'): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const params = {
      dateFrom: this.dateFrom,
      dateTo: this.dateTo,
      format: format
    };

    this.http.get(`${this.apiUrl}/admin/reports/export`, { 
      headers, 
      params,
      responseType: 'blob'
    }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `report-${new Date().getTime()}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        this.error = 'خطا در دانلود گزارش';
        console.error('Export error:', err);
      }
    });
  }

  closeError(): void {
    this.error = null;
  }

  getMaxActivity(): number {
    if (this.userActivity.length === 0) return 1;
    
    const maxActive = Math.max(...this.userActivity.map(d => d.activeUsers));
    const maxNew = Math.max(...this.userActivity.map(d => d.newUsers));
    
    return Math.max(maxActive, maxNew, 1);
  }

  formatChartDate(dateString: string): string {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  }

  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
