// src/app/core/services/competency.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Competency {
  id: string;
  nameFa: string;
  nameEn?: string;
  description?: string;
  icon?: string;
  color?: string;
  displayOrder?: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  mediaTypes?: string[];
}

export interface CompetencyCreatePayload {
  name_fa: string;
  name_en?: string;
  description?: string;
  icon?: string;
  color?: string;
  display_order?: number;
}

export interface CompetencyUpdatePayload {
  name_fa?: string;
  name_en?: string;
  description?: string;
  icon?: string;
  color?: string;
  display_order?: number;
  is_active?: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class CompetencyService {
  private apiUrl = `${environment.apiUrl}/competencies`;

  constructor(private http: HttpClient) {}

  /**
   * دریافت لیست تمام شایستگی‌ها
   */
  getAll(): Observable<Competency[]> {
    return this.http.get<ApiResponse<{ competencies: any[]; total: number }>>(this.apiUrl)
      .pipe(
        map(response => this.mapCompetencies(response.data.competencies)),
        catchError(this.handleError)
      );
  }

  /**
   * دریافت جزئیات یک شایستگی
   */
  getById(id: string): Observable<Competency> {
    return this.http.get<ApiResponse<{ competency: any }>>(`${this.apiUrl}/${id}`)
      .pipe(
        map(response => this.mapCompetency(response.data.competency)),
        catchError(this.handleError)
      );
  }

  /**
   * ایجاد شایستگی جدید (Admin only)
   */
  create(payload: CompetencyCreatePayload): Observable<Competency> {
    return this.http.post<ApiResponse<{ competency: any }>>(this.apiUrl, payload, {
      headers: this.getHeaders()
    }).pipe(
      map(response => this.mapCompetency(response.data.competency)),
      catchError(this.handleError)
    );
  }

  /**
   * ویرایش شایستگی موجود (Admin only)
   */
  update(id: string, payload: CompetencyUpdatePayload): Observable<Competency> {
    return this.http.put<ApiResponse<{ competency: any }>>(`${this.apiUrl}/${id}`, payload, {
      headers: this.getHeaders()
    }).pipe(
      map(response => this.mapCompetency(response.data.competency)),
      catchError(this.handleError)
    );
  }

  /**
   * حذف شایستگی (Admin only)
   */
  delete(id: string): Observable<void> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      map(() => undefined),
      catchError(this.handleError)
    );
  }

  /**
   * تبدیل snake_case به camelCase
   */
  private mapCompetency(data: any): Competency {
    return {
      id: data.id,
      nameFa: data.name_fa,
      nameEn: data.name_en,
      description: data.description,
      icon: data.icon,
      color: data.color,
      displayOrder: data.display_order,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      mediaTypes: data.media_types || []
    };
  }

  private mapCompetencies(data: any[]): Competency[] {
    return data.map(item => this.mapCompetency(item));
  }

  /**
   * تبدیل camelCase به snake_case برای ارسال به backend
   */
  toSnakeCase(competency: Partial<Competency>): any {
    const payload: any = {};
    if (competency.nameFa !== undefined) payload.name_fa = competency.nameFa;
    if (competency.nameEn !== undefined) payload.name_en = competency.nameEn;
    if (competency.description !== undefined) payload.description = competency.description;
    if (competency.icon !== undefined) payload.icon = competency.icon;
    if (competency.color !== undefined) payload.color = competency.color;
    if (competency.displayOrder !== undefined) payload.display_order = competency.displayOrder;
    if (competency.isActive !== undefined) payload.is_active = competency.isActive;
    return payload;
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'خطای ناشناخته رخ داده است';

    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.status === 404) {
      errorMessage = 'شایستگی یافت نشد';
    } else if (error.status === 409 || (error.error?.code === '23505')) {
      errorMessage = 'شایستگی با این نام قبلاً ثبت شده است';
    } else if (error.status === 401) {
      errorMessage = 'دسترسی غیرمجاز';
    } else if (error.status === 403) {
      errorMessage = 'شما مجوز انجام این عملیات را ندارید';
    } else if (error.status === 0) {
      errorMessage = 'خطا در برقراری ارتباط با سرور';
    }

    return throwError(() => ({ message: errorMessage, originalError: error }));
  }
}
