import { Container } from 'inversify';
import BooksRepository from './repositories/books-repository';

const container: Container = new Container()

container.bind(BooksRepository).toSelf()

export default container
