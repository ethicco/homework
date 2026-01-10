import { Schema, model } from 'mongoose';
import { IUserDocument } from '../interfaces/user.interface';

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  }
});

export default model<IUserDocument>('User', userSchema);
