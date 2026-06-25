import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SavedContentService {
  private apiUrl = `${environment.apiUrl}/saved-content`;

  constructor(private http: HttpClient) {}

  saveForLater(contentId: string, note?: string): Observable<any> {
    return this.http.post(this.apiUrl, { contentId, note });
  }

  getSavedContent(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  removeSavedContent(contentId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${contentId}`);
  }
}