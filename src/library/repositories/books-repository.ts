import type { IBook } from '../interfaces/book.interface';


abstract class BooksRepository {
  abstract createBook(book: IBook): Promise<void>;

  abstract getBook(id: string): Promise<IBook | null>;

  abstract getBooks(): Promise<Array<IBook>>;

  abstract updateBook(id: string, updateBook: IBook): Promise<void>;

  abstract deleteBook(id: string): Promise<void>;
}



export default BooksRepository