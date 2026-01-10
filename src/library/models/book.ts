import { Schema, model } from 'mongoose';
import { IBookDocument } from '../interfaces/book.interface';

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  authors:{
    type: String,
  },
  favorite: {
    type: String,
  },
  fileCover: {
    type: String,
  },
  fileName: {
    type: String,
  },
  fileBook: {
    type: String
  }
});

export default model<IBookDocument>('Book', bookSchema);
