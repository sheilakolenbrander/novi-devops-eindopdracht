import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { BookComponent } from './book.component';
import { BookService } from '../services/book.service';
import { Book } from '../models/book';
import { BookStatus } from '../models/book-status.enum';
import { of, throwError } from 'rxjs';
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
    { id: 1, title: '1984', author: 'Orwell', status: BookStatus.ToRead },
    { id: 2, title: 'Brave New World', author: 'Huxley', status: BookStatus.Reading },
    { id: 3, title: 'Fahrenheit 451', author: 'Bradbury', status: BookStatus.Read }
  ];

  beforeEach(async () => {
    const bookServiceSpy = jasmine.createSpyObj('BookService', [
      'getAll',
      'add',
      'updateStatus'
    ]);

    await TestBed.configureTestingModule({
      declarations: [BookComponent],
      imports: [
        HttpClientTestingModule,
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
    bookService.getAll.and.returnValue(of(mockBooks));

    fixture = TestBed.createComponent(BookComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load books on init', () => {
    bookService.getAll.and.returnValue(of(mockBooks));

    fixture.detectChanges();

    expect(bookService.getAll).toHaveBeenCalled();
    expect(component.books.length).toBe(3);
  });

  it('should handle error when loading books fails', () => {
    bookService.getAll.and.returnValue(throwError(() => new Error('API Error')));

    spyOn(console, 'error');

    component.loadBooks();

    expect(console.error).toHaveBeenCalled();
  });

  it('should add a new book with valid inputs', () => {
    const newBook: Book = { id: 0, title: 'New Book', author: 'New Author', status: BookStatus.ToRead };
    const savedBook: Book = { ...newBook, id: 4 };

    bookService.add.and.returnValue(of(savedBook));
    bookService.getAll.and.returnValue(of([...mockBooks, savedBook]));

    // Create mock NgModel objects
    const titleInput: Partial<NgModel> = {
      reset: jasmine.createSpy('reset')
    };

    const authorInput: Partial<NgModel> = {
      reset: jasmine.createSpy('reset')
    };

    component.newBook = newBook;
    component.addBook(titleInput as NgModel, authorInput as NgModel);

    expect(bookService.add).toHaveBeenCalledWith(newBook);
    expect(titleInput.reset).toHaveBeenCalled();
    expect(authorInput.reset).toHaveBeenCalled();
  });

  it('should not add book with empty title', () => {
    const titleInput: Partial<NgModel> = {
      reset: jasmine.createSpy('reset')
    };

    const authorInput: Partial<NgModel> = {
      reset: jasmine.createSpy('reset')
    };

    component.newBook = { id: 0, title: '', author: 'Author', status: BookStatus.ToRead };
    component.addBook(titleInput as NgModel, authorInput as NgModel);

    expect(bookService.add).not.toHaveBeenCalled();
  });

  it('should not add book with empty author', () => {
    const titleInput: Partial<NgModel> = {
      reset: jasmine.createSpy('reset')
    };

    const authorInput: Partial<NgModel> = {
      reset: jasmine.createSpy('reset')
    };

    component.newBook = { id: 0, title: 'Title', author: '', status: BookStatus.ToRead };
    component.addBook(titleInput as NgModel, authorInput as NgModel);

    expect(bookService.add).not.toHaveBeenCalled();
  });

  it('should update book status', () => {
    bookService.updateStatus.and.returnValue(of(void 0));
    const book: Book = mockBooks[0];

    component.setStatus(book, BookStatus.Reading);

    expect(book.status).toBe(BookStatus.Reading);
    expect(bookService.updateStatus).toHaveBeenCalledWith(book.id, BookStatus.Reading);
  });

  it('should filter books by status', () => {
    component.books = mockBooks;
    component.selectedFilter = 'toread';

    fixture.detectChanges(); 

    const filtered = component.filteredBooks;

    expect(filtered.length).toBe(1);
    expect(filtered[0].status).toBe(BookStatus.ToRead);
  });

  it('should return all books when filter is "all"', () => {
    component.books = mockBooks;
    component.selectedFilter = 'all';

    const filtered = component.filteredBooks;

    expect(filtered.length).toBe(3);
  });

  it('should count books by status', () => {
    component.books = mockBooks;

    expect(component.getCount(BookStatus.ToRead)).toBe(1);
    expect(component.getCount(BookStatus.Reading)).toBe(1);
    expect(component.getCount(BookStatus.Read)).toBe(1);
  });

  it('should return correct status labels', () => {
    expect(component.getStatusLabel(BookStatus.ToRead)).toBe('Wil lezen');
    expect(component.getStatusLabel(BookStatus.Reading)).toBe('Bezig');
    expect(component.getStatusLabel(BookStatus.Read)).toBe('Gelezen');
  });

  it('should return correct status classes', () => {
    expect(component.getStatusClass(BookStatus.ToRead)).toBe('status-toread');
    expect(component.getStatusClass(BookStatus.Reading)).toBe('status-reading');
    expect(component.getStatusClass(BookStatus.Read)).toBe('status-read');
  });

  it('should have BookStatus enum available', () => {
    expect(component.BookStatus).toBeDefined();
    expect(component.BookStatus.ToRead).toBe(BookStatus.ToRead);
  });
});
