import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProgressReport, OrganizationalInsights, ContentEffectivenessReport } from '../../models/report.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = `${environment.apiUrl}/reports`;

  constructor(private http: HttpClient) {}

  getUserProgress(userId?: string): Observable<UserProgressReport> {
    const url = userId ? `${this.apiUrl}/user-progress/${userId}` : `${this.apiUrl}/user-progress`;
    return this.http.get<UserProgressReport>(url);
  }

  getOrganizationalInsights(): Observable<OrganizationalInsights> {
    return this.http.get<OrganizationalInsights>(`${this.apiUrl}/organizational-insights`);
  }

  getContentEffectiveness(contentId: string): Observable<ContentEffectivenessReport> {
    return this.http.get<ContentEffectivenessReport>(`${this.apiUrl}/content-effectiveness/${contentId}`);
  }
}