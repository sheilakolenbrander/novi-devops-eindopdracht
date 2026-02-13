import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookComponent } from './book.component';
import { BookService } from '../services/book.service';
import { Book } from '../models/book';
import { BookStatus } from '../models/book-status.enum';
import { of, throwError } from 'rxjs';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('BookComponent', () => {
  let component: BookComponent;
  let fixture: ComponentFixture<BookComponent>;
  let bookService: jasmine.SpyObj<BookService>;

  const mockBooks: Book[] = [
    { id: 1, title: 'Test Book 1', author: 'Author 1', status: BookStatus.ToRead },
    { id: 2, title: 'Test Book 2', author: 'Author 2', status: BookStatus.Reading },
    { id: 3, title: 'Test Book 3', author: 'Author 3', status: BookStatus.Read },
    { id: 4, title: 'Test Book 4', author: 'Author 4', status: BookStatus.ToRead }
  ];

  beforeEach(async () => {
    const bookServiceSpy = jasmine.createSpyObj('BookService', [
      'getAll',
      'add',
      'updateStatus',
      'getById',
      'getByStatus'
    ]);

    await TestBed.configureTestingModule({
      declarations: [BookComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        BrowserAnimationsModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatCardModule,
        MatTabsModule,
        MatIconModule,
        MatButtonToggleModule,
        MatChipsModule,
        MatTooltipModule
      ],
      providers: [
        { provide: BookService, useValue: bookServiceSpy }
      ]
    }).compileComponents();

    bookService = TestBed.inject(BookService) as jasmine.SpyObj<BookService>;
    fixture = TestBed.createComponent(BookComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load books on initialization', () => {
      bookService.getAll.and.returnValue(of(mockBooks));

      component.ngOnInit();

      expect(bookService.getAll).toHaveBeenCalled();
      expect(component.books).toEqual(mockBooks);
    });
  });

  describe('loadBooks', () => {
    it('should load books successfully', () => {
      bookService.getAll.and.returnValue(of(mockBooks));

      component.loadBooks();

      expect(bookService.getAll).toHaveBeenCalled();
      expect(component.books).toEqual(mockBooks);
      expect(component.books.length).toBe(4);
    });

    it('should handle error when loading books fails', () => {
      const errorResponse = { status: 500, message: 'Server error' };
      spyOn(console, 'error');
      bookService.getAll.and.returnValue(throwError(() => errorResponse));

      component.loadBooks();

      expect(bookService.getAll).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith('Error loading books:', errorResponse);
    });
  });

  describe('addBook', () => {
    let titleInput: jasmine.SpyObj<NgModel>;
    let authorInput: jasmine.SpyObj<NgModel>;

    beforeEach(() => {
      titleInput = jasmine.createSpyObj('NgModel', ['reset']);
      authorInput = jasmine.createSpyObj('NgModel', ['reset']);
      bookService.getAll.and.returnValue(of(mockBooks));
    });

    it('should add a new book successfully', () => {
      component.newBook = {
        id: 0,
        title: 'New Book',
        author: 'New Author',
        status: BookStatus.ToRead
      };
      bookService.add.and.returnValue(of({}));

      component.addBook(titleInput, authorInput);

      expect(bookService.add).toHaveBeenCalledWith({
        id: 0,
        title: 'New Book',
        author: 'New Author',
        status: BookStatus.ToRead
      });
      expect(bookService.getAll).toHaveBeenCalled();
      expect(titleInput.reset).toHaveBeenCalled();
      expect(authorInput.reset).toHaveBeenCalled();
    });

    it('should reset newBook after adding', () => {
      component.newBook = {
        id: 0,
        title: 'New Book',
        author: 'New Author',
        status: BookStatus.Reading
      };
      bookService.add.and.returnValue(of({}));

      component.addBook(titleInput, authorInput);

      expect(component.newBook).toEqual({
        id: 0,
        title: '',
        author: '',
        genre: '',
        status: BookStatus.ToRead
      });
    });

    it('should not add book when title is empty', () => {
      component.newBook = {
        id: 0,
        title: '',
        author: 'New Author',
        status: BookStatus.ToRead
      };

      component.addBook(titleInput, authorInput);

      expect(bookService.add).not.toHaveBeenCalled();
      expect(titleInput.reset).not.toHaveBeenCalled();
      expect(authorInput.reset).not.toHaveBeenCalled();
    });

    it('should not add book when author is empty', () => {
      component.newBook = {
        id: 0,
        title: 'New Book',
        author: '',
        status: BookStatus.ToRead
      };

      component.addBook(titleInput, authorInput);

      expect(bookService.add).not.toHaveBeenCalled();
      expect(titleInput.reset).not.toHaveBeenCalled();
      expect(authorInput.reset).not.toHaveBeenCalled();
    });

    it('should not add book when both title and author are empty', () => {
      component.newBook = {
        id: 0,
        title: '',
        author: '',
        status: BookStatus.ToRead
      };

      component.addBook(titleInput, authorInput);

      expect(bookService.add).not.toHaveBeenCalled();
    });
  });

  describe('setStatus', () => {
    it('should update book status to Reading', () => {
      const book = mockBooks[0];
      bookService.updateStatus.and.returnValue(of({}));

      component.setStatus(book, BookStatus.Reading);

      expect(book.status).toBe(BookStatus.Reading);
      expect(bookService.updateStatus).toHaveBeenCalledWith(1, BookStatus.Reading);
    });

    it('should update book status to Read', () => {
      const book = mockBooks[1];
      bookService.updateStatus.and.returnValue(of({}));

      component.setStatus(book, BookStatus.Read);

      expect(book.status).toBe(BookStatus.Read);
      expect(bookService.updateStatus).toHaveBeenCalledWith(2, BookStatus.Read);
    });

    it('should update book status to ToRead', () => {
      const book = mockBooks[2];
      bookService.updateStatus.and.returnValue(of({}));

      component.setStatus(book, BookStatus.ToRead);

      expect(book.status).toBe(BookStatus.ToRead);
      expect(bookService.updateStatus).toHaveBeenCalledWith(3, BookStatus.ToRead);
    });
  });

  describe('filteredBooks', () => {
    beforeEach(() => { component.books = mockBooks; });

    it('should return all books when filter is "all"', () => {
      component.selectedFilter = 'all';

      const result = component.filteredBooks;

      expect(result.length).toBe(4);
      expect(result).toEqual(mockBooks);
    });

    it('should return only ToRead books when filter is "toread"', () => {
      component.selectedFilter = 'toread';

      const result = component.filteredBooks;

      expect(result.length).toBe(2);
      expect(result.every(b => b.status === BookStatus.ToRead)).toBe(true);
    });

    it('should return only Reading books when filter is "reading"', () => {
      component.selectedFilter = 'reading';

      const result = component.filteredBooks;

      expect(result.length).toBe(1);
      expect(result[0].status).toBe(BookStatus.Reading);
    });

    it('should return only Read books when filter is "read"', () => {
      component.selectedFilter = 'read';

      const result = component.filteredBooks;

      expect(result.length).toBe(1);
      expect(result[0].status).toBe(BookStatus.Read);
    });
  });

  describe('getCount', () => {
    beforeEach(() => {
      component.books = mockBooks;
    });

    it('should return correct count for ToRead status', () => {
      const count = component.getCount(BookStatus.ToRead);
      expect(count).toBe(2);
    });

    it('should return correct count for Reading status', () => {
      const count = component.getCount(BookStatus.Reading);
      expect(count).toBe(1);
    });

    it('should return correct count for Read status', () => {
      const count = component.getCount(BookStatus.Read);
      expect(count).toBe(1);
    });

    it('should return 0 when no books match the status', () => {
      component.books = [];
      const count = component.getCount(BookStatus.ToRead);
      expect(count).toBe(0);
    });
  });

  describe('getStatusLabel', () => {
    it('should return "Wil lezen" for ToRead status', () => {
      const label = component.getStatusLabel(BookStatus.ToRead);
      expect(label).toBe('Wil lezen');
    });

    it('should return "Bezig" for Reading status', () => {
      const label = component.getStatusLabel(BookStatus.Reading);
      expect(label).toBe('Bezig');
    });

    it('should return "Gelezen" for Read status', () => {
      const label = component.getStatusLabel(BookStatus.Read);
      expect(label).toBe('Gelezen');
    });

    it('should return empty string for unknown status', () => {
      const label = component.getStatusLabel(999 as BookStatus);
      expect(label).toBe('');
    });
  });

  describe('Component initialization', () => {
    it('should initialize with empty books array', () => {
      expect(component.books).toEqual([]);
    });

    it('should initialize with "all" as selected filter', () => {
      expect(component.selectedFilter).toBe('all');
    });

    it('should initialize newBook with default values', () => {
      expect(component.newBook).toEqual({
        id: 0,
        title: '',
        author: '',
        genre: '',
        status: BookStatus.ToRead
      });
    });

    it('should have BookStatus enum accessible', () => {
      expect(component.BookStatus).toBe(BookStatus);
    });
  });
});
