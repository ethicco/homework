import type { IBook } from '../interfaces/book.interface';

import { BookModel } from '../models'
import { injectable } from 'inversify';

@injectable()
class BooksRepository {
  createBook(book: IBook): Promise<IBook>{
    return BookModel.create(book);
  };

  getBook(id: string): Promise<IBook | null> {
    return BookModel.findById(id).exec();
  };

  getBooks(): Promise<Array<IBook>> {
    return BookModel.find().exec();
  };

  async updateBook(id: string, updateBook: Partial<IBook>): Promise<void> {
    await BookModel.updateOne({
      id
    }, 
    { $set: updateBook});
  };

  async deleteBook(id: string): Promise<void> {
    await BookModel.deleteOne({ id }) ;
  };
}

export default BooksRepository;
