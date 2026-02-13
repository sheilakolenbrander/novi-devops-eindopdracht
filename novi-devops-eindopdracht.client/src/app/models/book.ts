import { BookStatus } from "./book-status.enum";

export interface Book {
  id: number;
  title: string;
  author: string;
  status: BookStatus;
  genre?: string;
}
