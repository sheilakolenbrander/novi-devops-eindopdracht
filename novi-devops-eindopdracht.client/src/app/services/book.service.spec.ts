import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BookService } from './book.service';
import { Book } from '../models/book';
import { BookStatus } from '../models/book-status.enum';
import { environment } from '../../environments/environment';

describe('BookService', () => {
  let service: BookService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl + '/api/books';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BookService]
    });
    service = TestBed.inject(BookService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all books', () => {
    const mockBooks: Book[] = [
      { id: 1, title: 'Test Book 1', author: 'Author 1', status: BookStatus.ToRead },
      { id: 2, title: 'Test Book 2', author: 'Author 2', status: BookStatus.Reading }
    ];

    service.getAll().subscribe(books => {
      expect(books.length).toBe(2);
      expect(books).toEqual(mockBooks);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockBooks);
  });

  it('should add a book', () => {
    const newBook: Book = { id: 0, title: 'New Book', author: 'New Author', status: BookStatus.ToRead };
    const savedBook: Book = { ...newBook, id: 1 };

    service.add(newBook).subscribe(book => {
      expect(book).toEqual(savedBook);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newBook);
    req.flush(savedBook);
  });

  it('should update book status', () => {
    const bookId = 1;
    const newStatus = BookStatus.Reading;

    service.updateStatus(bookId, newStatus).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/${bookId}/status?status=${newStatus}`);
    expect(req.request.method).toBe('PUT');
    req.flush(null);
  });

  it('should handle HTTP error on getAll', () => {
    service.getAll().subscribe({
      next: () => fail('should have failed'),
      error: (error) => {
        expect(error.status).toBe(500);
      }
    });

    const req = httpMock.expectOne(apiUrl);
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });
});
