// src/app/core/services/content.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

// Interfaces
export interface Content {
  id: number;
  title: string;
  description: string;
  mediaTypeId: number;
  mediaTypeName: string;
  mediaTypeNameEn: string;
  contentSourceId: number;
  sourceName: string;
  sourceType: string;
  websiteUrl?: string;
  fileUrl: string;
  fileType?: string;
  fileSize?: number;
  thumbnailUrl?: string;
  duration?: number;
  language: string;
  difficultyLevel: string;
  tags: string[];
  metadata?: any;
  viewCount: number;
  likeCount?: number;
  averageRating: number;
  isPublished: boolean;
  publishedAt?: Date;
  createdBy?: number;
  createdAt: Date;
  updatedAt: Date;
  competencies: Competency[];
  creator?: {
    id: number;
    fullName: string;
  };
}

export interface Competency {
  id: number;
  name: string;
  nameEn: string;
  category: string;
  description?: string;
}

export interface MediaType {
  id: number;
  name: string;
  nameEn: string;
  icon?: string;
}

export interface ContentSource {
  id: number;
  name: string;
  nameEn: string;
  type: string;
  websiteUrl?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ContentListParams {
  page?: number;
  limit?: number;
  mediaTypeId?: number;
  difficulty?: string;
  language?: string;
}

export interface ContentSearchParams extends ContentListParams {
  q: string;
}

export interface CreateContentDto {
  title: string;
  description?: string;
  mediaTypeId: number;
  contentSourceId?: number;
  fileUrl?: string;
  duration?: number;
  language?: string;
  difficultyLevel?: string;
  tags?: string[];
  competencyIds?: number[];
  file?: File;
}

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private readonly apiUrl = `${environment.apiUrl}/content`;

  constructor(private http: HttpClient) {}

  /**
   * دریافت لیست محتواها با صفحه‌بندی و فیلتر
   */
  getContents(params?: ContentListParams): Observable<{ contents: Content[]; pagination: any }> {
    let httpParams = new HttpParams();
    
    if (params) {
      if (params.page) httpParams = httpParams.set('page', params.page.toString());
      if (params.limit) httpParams = httpParams.set('limit', params.limit.toString());
      if (params.mediaTypeId) httpParams = httpParams.set('mediaTypeId', params.mediaTypeId.toString());
      if (params.difficulty) httpParams = httpParams.set('difficulty', params.difficulty);
      if (params.language) httpParams = httpParams.set('language', params.language);
    }

    return this.http.get<ApiResponse>(this.apiUrl, { params: httpParams, observe: 'response' }).pipe(
      map((response) => ({
        contents: response.body?.data.map((item: any) => this.mapContent(item)) || [],
        pagination: response.body?.pagination || {}
      }))
    );
  }

  /**
   * جستجو در محتواها
   */
  searchContents(params: ContentSearchParams): Observable<{ contents: Content[]; pagination: any }> {
    let httpParams = new HttpParams().set('q', params.q);
    
    if (params.page) httpParams = httpParams.set('page', params.page.toString());
    if (params.limit) httpParams = httpParams.set('limit', params.limit.toString());
    if (params.mediaTypeId) httpParams = httpParams.set('mediaTypeId', params.mediaTypeId.toString());
    if (params.difficulty) httpParams = httpParams.set('difficulty', params.difficulty);
    if (params.language) httpParams = httpParams.set('language', params.language);

    return this.http.get<ApiResponse>(`${this.apiUrl}/search`, { params: httpParams }).pipe(
      map((response) => ({
        contents: response.data.map((item: any) => this.mapContent(item)),
        pagination: response.pagination || {}
      }))
    );
  }

  /**
   * دریافت محتواهای مرتبط با یک شایستگی
   */
  getContentsByCompetency(competencyId: number, params?: ContentListParams): Observable<{ contents: Content[]; pagination: any }> {
    let httpParams = new HttpParams();
    
    if (params) {
      if (params.page) httpParams = httpParams.set('page', params.page.toString());
      if (params.limit) httpParams = httpParams.set('limit', params.limit.toString());
    }

    return this.http.get<ApiResponse>(`${this.apiUrl}/competency/${competencyId}`, { params: httpParams }).pipe(
      map((response) => ({
        contents: response.data.map((item: any) => this.mapContent(item)),
        pagination: response.pagination || {}
      }))
    );
  }

  /**
   * دریافت جزئیات یک محتوا
   */
  getContentById(id: number): Observable<Content> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/${id}`).pipe(
      map((response) => this.mapContent(response.data))
    );
  }

  /**
   * ایجاد محتوای جدید
   */
  createContent(data: CreateContentDto): Observable<Content> {
    const formData = this.buildFormData(data);

    return this.http.post<ApiResponse>(this.apiUrl, formData).pipe(
      map((response) => this.mapContent(response.data))
    );
  }

  /**
   * ویرایش محتوا
   */
  updateContent(id: number, data: Partial<CreateContentDto>): Observable<Content> {
    const formData = this.buildFormData(data);

    return this.http.put<ApiResponse>(`${this.apiUrl}/${id}`, formData).pipe(
      map((response) => this.mapContent(response.data))
    );
  }

  /**
   * حذف محتوا (فقط Admin)
   */
  deleteContent(id: number): Observable<void> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${id}`).pipe(
      map(() => undefined)
    );
  }

  /**
   * ساخت FormData برای ارسال به بک‌اند
   */
  private buildFormData(data: Partial<CreateContentDto>): FormData {
    const formData = new FormData();

    if (data.title) formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.mediaTypeId) formData.append('mediaTypeId', data.mediaTypeId.toString());
    if (data.contentSourceId) formData.append('contentSourceId', data.contentSourceId.toString());
    if (data.fileUrl) formData.append('fileUrl', data.fileUrl);
    if (data.duration) formData.append('duration', data.duration.toString());
    if (data.language) formData.append('language', data.language);
    if (data.difficultyLevel) formData.append('difficultyLevel', data.difficultyLevel);
    
    if (data.tags && data.tags.length > 0) {
      formData.append('tags', JSON.stringify(data.tags));
    }
    
    if (data.competencyIds && data.competencyIds.length > 0) {
      formData.append('competencyIds', JSON.stringify(data.competencyIds));
    }
    
    if (data.file) {
      formData.append('file', data.file);
    }

    return formData;
  }

  /**
   * تبدیل داده خام API به مدل Content
   */
  private mapContent(data: any): Content {
    return {
      id: data.id,
      title: data.title,
      description: data.description || '',
      mediaTypeId: data.mediaTypeId || data.media_type_id,
      mediaTypeName: data.mediaType?.name || data.media_type_name || '',
      mediaTypeNameEn: data.mediaType?.nameEn || data.media_type_name_en || '',
      contentSourceId: data.contentSourceId || data.content_source_id,
      sourceName: data.contentSource?.name || data.source_name || '',
      sourceType: data.contentSource?.type || data.source_type || '',
      websiteUrl: data.contentSource?.websiteUrl || data.website_url,
      fileUrl: data.fileUrl || data.file_url || '',
      fileType: data.fileType || data.file_type,
      fileSize: data.fileSize || data.file_size,
      thumbnailUrl: data.thumbnailUrl || data.thumbnail_url,
      duration: data.duration,
      language: data.language || 'fa',
      difficultyLevel: data.difficultyLevel || data.difficulty_level || 'beginner',
      tags: data.tags || [],
      metadata: data.metadata,
      viewCount: data.viewCount || data.view_count || 0,
      likeCount: data.likeCount || data.like_count || 0,
      averageRating: data.averageRating || data.average_rating || 0,
      isPublished: data.isPublished ?? data.is_published ?? false,
      publishedAt: data.publishedAt || data.published_at ? new Date(data.publishedAt || data.published_at) : undefined,
      createdBy: data.createdBy || data.created_by,
      createdAt: new Date(data.createdAt || data.created_at),
      updatedAt: new Date(data.updatedAt || data.updated_at),
      competencies: (data.competencies || []).map((comp: any) => ({
        id: comp.id,
        name: comp.name,
        nameEn: comp.nameEn || comp.name_en || '',
        category: comp.category || '',
        description: comp.description
      })),
      creator: data.creator ? {
        id: data.creator.id,
        fullName: data.creator.fullName || data.creator.full_name || ''
      } : undefined
    };
  }
}
