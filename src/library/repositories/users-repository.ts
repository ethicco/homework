import { IUser, IUserDocument } from '../interfaces/user.interface';

import { UserModel } from '../models'
import { injectable } from 'inversify';

@injectable()
class UsersRepository {
  createUser(user: IUser): Promise<IUserDocument>{
    return UserModel.create(user);
  };

  getUser(username: string): Promise<IUserDocument | null> {
    return UserModel.findOne({ username }).exec()
  };

  getUserById(id: string): Promise<IUserDocument> {
    return UserModel.findById(id).exec()
  };
}



export default UsersRepository;
