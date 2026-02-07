import { Component, OnInit } from '@angular/core';
import { Book } from '../models/book';
import { BookService } from '../services/book.service';
import { BookStatus } from '../models/book-status.enum';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {
  constructor(private bookService: BookService) { }

  books: Book[] = [];
  BookStatus = BookStatus;
  selectedFilter: string = 'all';

  newBook: Book = {
    id: 0,
    title: '',
    author: '',
    status: BookStatus.ToRead
  };

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks() {
    this.bookService.getAll().subscribe(
      data => {
        this.books = data;
      },
      error => {
        console.error('Error loading books:', error);
      }
    );
  }

  addBook(titleInput: NgModel, authorInput: NgModel) {
    if (this.newBook.title && this.newBook.author) {
      this.bookService.add(this.newBook).subscribe(() => {
        this.loadBooks();
        this.newBook = { id: 0, title: '', author: '', status: BookStatus.ToRead };

        // Reset de form state zodat de rode omlijning verdwijnt
        titleInput.reset();
        authorInput.reset();
      });
    }
  }

  setStatus(book: Book, status: BookStatus) {
    book.status = status;
    this.bookService.updateStatus(book.id, status).subscribe();
  }

  get filteredBooks(): Book[] {
    if (this.selectedFilter === 'all') {
      return this.books;
    }
    const statusMap: { [key: string]: BookStatus } = {
      'toread': BookStatus.ToRead,
      'reading': BookStatus.Reading,
      'read': BookStatus.Read
    };
    return this.books.filter(b => b.status === statusMap[this.selectedFilter]);
  }

  getCount(status: BookStatus): number {
    return this.books.filter(b => b.status === status).length;
  }

  getStatusLabel(status: BookStatus): string {
    const labels: { [key: number]: string } = {
      [BookStatus.ToRead]: 'Wil lezen',
      [BookStatus.Reading]: 'Bezig',
      [BookStatus.Read]: 'Gelezen'
    };
    return labels[status] || '';
  }

  getStatusClass(status: BookStatus): string {
    const classes: { [key: number]: string } = {
      [BookStatus.ToRead]: 'status-toread',
      [BookStatus.Reading]: 'status-reading',
      [BookStatus.Read]: 'status-read'
    };
    return classes[status] || '';
  }
}
