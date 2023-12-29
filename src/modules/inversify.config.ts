import { Container } from 'inversify';
import TransactionRecordController from '../controllers/transaction-record.controller';
import CriptographyService from '../services/criptography.service';

const container = new Container();

container.bind<TransactionRecordController>(TransactionRecordController).toSelf();
container.bind<CriptographyService>(CriptographyService).toSelf();

export default container;