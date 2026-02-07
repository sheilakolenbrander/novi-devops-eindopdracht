import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BookService } from './book.service';

describe('BookService', () => {
  let service: BookService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(BookService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should fetch books', () => {
    const mockBooks = [{ id: 1, title: 'Test', author: 'Me' }];

    service.getAll().subscribe(books => {
      expect(books.length).toBe(1);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/books');
    req.flush(mockBooks);
  });
});
