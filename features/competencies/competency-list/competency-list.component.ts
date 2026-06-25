// src/app/features/competencies/competency-list/competency-list.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CompetencyService, Competency } from '../../../core/services/competency.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'app-competency-list',
  templateUrl: './competency-list.component.html',
  styleUrls: ['./competency-list.component.scss']
})
export class CompetencyListComponent implements OnInit, OnDestroy {
  competencies: Competency[] = [];
  filteredCompetencies: Competency[] = [];
  loading = false;
  error: string | null = null;
  searchQuery = '';
  showActiveOnly = false;
  isAdmin = false;

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  constructor(
    private competencyService: CompetencyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkAdminRole();
    this.loadCompetencies();
    this.setupSearch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private checkAdminRole(): void {
    const userRole = localStorage.getItem('userRole');
    this.isAdmin = userRole === 'admin';
  }

  loadCompetencies(): void {
    this.loading = true;
    this.error = null;

    this.competencyService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: Competency[]) => {
          this.competencies = data.sort((a: Competency, b: Competency) => 
            (a.displayOrder || 0) - (b.displayOrder || 0)
          );
          this.applyFilters();
          this.loading = false;
        },
        error: (err: any) => {
          this.error = err.message || 'خطا در بارگذاری شایستگی‌ها';
          this.loading = false;
          console.error('Error loading competencies:', err);
        }
      });
  }

  private setupSearch(): void {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((query: string) => {
        this.searchQuery = query;
        this.applyFilters();
      });
  }

  onSearchChange(query: string): void {
    this.searchSubject.next(query);
  }

  onActiveFilterChange(): void {
    this.showActiveOnly = !this.showActiveOnly;
    this.applyFilters();
  }

  private applyFilters(): void {
    let result = [...this.competencies];

    if (this.showActiveOnly) {
      result = result.filter((c: Competency) => c.isActive);
    }

    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter((c: Competency) =>
        c.nameFa.toLowerCase().includes(query) ||
        (c.nameEn && c.nameEn.toLowerCase().includes(query)) ||
        (c.description && c.description.toLowerCase().includes(query))
      );
    }

    this.filteredCompetencies = result;
  }

  viewDetails(id: string): void {
    this.router.navigate(['/competencies', id]);
  }

  editCompetency(id: string, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/competencies', id, 'edit']);
  }

  deleteCompetency(competency: Competency, event: Event): void {
    event.stopPropagation();
    
    if (!confirm(`آیا از حذف شایستگی "${competency.nameFa}" اطمینان دارید؟`)) {
      return;
    }

    this.loading = true;
    this.competencyService.delete(competency.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.competencies = this.competencies.filter((c: Competency) => c.id !== competency.id);
          this.applyFilters();
          this.loading = false;
        },
        error: (err: any) => {
          this.error = err.message || 'خطا در حذف شایستگی';
          this.loading = false;
          console.error('Error deleting competency:', err);
        }
      });
  }

  createNew(): void {
    this.router.navigate(['/competencies/new']);
  }

  toggleActive(event: Event, competency: Competency): void {
    event.stopPropagation();
    
    const payload = { is_active: !competency.isActive };
    
    this.competencyService.update(competency.id, payload).subscribe({
      next: (updated) => {
        const index = this.competencies.findIndex(c => c.id === competency.id);
        if (index !== -1) {
          this.competencies[index] = updated;
        }
        this.applyFilters();
      },
      error: (err) => {
        this.error = err.message || 'خطا در تغییر وضعیت شایستگی';
      }
    });
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.showActiveOnly = false;
    this.searchSubject.next('');
    this.applyFilters();
  }

  retry(): void {
    this.loadCompetencies();
  }

  getStatusBadgeClass(isActive: boolean): string {
    return isActive ? 'badge-success' : 'badge-secondary';
  }

  getStatusText(isActive: boolean): string {
    return isActive ? 'فعال' : 'غیرفعال';
  }
}
