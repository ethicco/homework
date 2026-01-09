import type { IBook } from '../interfaces/book.interface';


abstract class BooksRepository {
  abstract createBook(book: IBook):void;

  abstract getBook(id: number): IBook | null;

  abstract getBooks(): Array<IBook>;

  abstract updateBook(id: number, updateBook: IBook): void;

  abstract deleteBook(id: number): void;
}