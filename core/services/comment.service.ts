import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment, CreateCommentDto } from '../../models/comment.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = `${environment.apiUrl}/comments`;

  constructor(private http: HttpClient) {}

  createComment(data: CreateCommentDto): Observable<Comment> {
    return this.http.post<Comment>(this.apiUrl, data);
  }

  getCommentsByContent(contentId: string, page = 1, limit = 20): Observable<{
    data: Comment[];
    pagination: { page: number; limit: number; total: number; pages: number };
  }> {
    return this.http.get<any>(`${this.apiUrl}/content/${contentId}`, {
      params: { page: page.toString(), limit: limit.toString() }
    });
  }

  updateComment(id: string, text: string): Observable<Comment> {
    return this.http.put<Comment>(`${this.apiUrl}/${id}`, { text });
  }

  deleteComment(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  likeComment(id: string): Observable<{ likes: number; isLiked: boolean }> {
    return this.http.post<any>(`${this.apiUrl}/${id}/like`, {});
  }
}