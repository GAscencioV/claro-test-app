import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Author, CreateAuthor, UpdateAuthor } from '../../models/author.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/authors`;

  getAll(): Observable<Author[]> {
    return this.http.get<Author[]>(this.baseUrl);
  }

  getById(id: number): Observable<Author> {
    return this.http.get<Author>(`${this.baseUrl}/${id}`);
  }

  create(dto: CreateAuthor): Observable<Author> {
    return this.http.post<Author>(this.baseUrl, dto);
  }

  update(id: number, dto: UpdateAuthor): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
