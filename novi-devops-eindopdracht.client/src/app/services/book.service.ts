/* eslint-disable @angular-eslint/prefer-inject */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/book';
import { BookStatus } from '../models/book-status.enum';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })

export class BookService {
  private api = `${environment.apiUrl}/api/books`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Book[]> {
    return this.http.get<Book[]>(this.api);
  }

  add(book: Book) {
    return this.http.post(this.api, book);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateStatus(id: number, status: BookStatus): Observable<any> {
    return this.http.put(`${this.api}/${id}/status?status=${status}`, {});
  }

  getById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.api}/${id}`);
  }

  getByStatus(status: BookStatus): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.api}/status/${status}`);
  }
}
