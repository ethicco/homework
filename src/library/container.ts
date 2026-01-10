import { Container } from 'inversify';
import BooksRepository from './repositories/books-repository';
import { UsersRepository } from './repositories';

const container: Container = new Container();

container.bind(BooksRepository).toSelf().inSingletonScope();
container.bind(UsersRepository).toSelf().inSingletonScope();

export default container;
