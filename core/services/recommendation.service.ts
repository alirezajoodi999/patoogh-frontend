import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recommendation, LearningPathItem } from '../../models/recommendation.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
  private apiUrl = `${environment.apiUrl}/recommendations`;

  constructor(private http: HttpClient) {}

  getRecommendations(limit = 10): Observable<Recommendation[]> {
    return this.http.get<Recommendation[]>(this.apiUrl, {
      params: { limit: limit.toString() }
    });
  }

  getLearningPath(): Observable<LearningPathItem[]> {
    return this.http.get<LearningPathItem[]>(`${this.apiUrl}/learning-path`);
  }
}