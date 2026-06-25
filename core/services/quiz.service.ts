import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContentQuiz, QuizSubmitDto, QuizResult } from '../../models/quiz.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private apiUrl = `${environment.apiUrl}/quiz`;

  constructor(private http: HttpClient) {}

  getQuizByContent(contentId: string): Observable<ContentQuiz> {
    return this.http.get<ContentQuiz>(`${this.apiUrl}/content/${contentId}`);
  }

  submitQuiz(contentId: string, data: QuizSubmitDto): Observable<QuizResult> {
    return this.http.post<QuizResult>(`${this.apiUrl}/content/${contentId}/submit`, data);
  }
}