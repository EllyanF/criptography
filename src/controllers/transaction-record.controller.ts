import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpDelete, httpGet, httpPost, httpPut, request, response } from 'inversify-express-utils';
import transactionRecord from '../models/transaction-record.model';
import { TransactionRecord } from '../types/transaction-record.type';
import CriptographyService from '../services/criptography.service';

@controller('/transaction-records')
class TransactionRecordController {
    private service: CriptographyService;

    constructor(@inject(CriptographyService) service: CriptographyService) {
        this.service = service;
    }

    @httpPost('/create')
    public async create(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            await transactionRecord.init();
            const newRecord: TransactionRecord = req.body;
            const encryptedRecord = this.service.encrypt(newRecord);
            const savedRecord = await transactionRecord.create(encryptedRecord)

            return res.status(201).json(savedRecord);
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    @httpGet('/get')
    public async get(@response() res: Response): Promise<Response> {
        try {
            const getRecords = await transactionRecord.find(
                {}, { _id: 0, __v: 0 }
            ) as TransactionRecord[];

            this.service.decryptAll(getRecords);

            return res.json(getRecords);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    @httpPut('/update/:id')
    public async update(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const updateValues: TransactionRecord = req.body;
            const updatedRecord = transactionRecord.findOneAndUpdate({
                id: req.params.id
            }, updateValues)

            return res.json(updatedRecord);
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    @httpDelete('/delete/:id')
    public async delete(
        @request() req: Request,
        @response() res: Response
    ): Promise<Response> {
        try {
            await transactionRecord.findOneAndDelete({ id: req.params.id });

            return res.status(204).end();
        } catch (error) {
            return res.status(500).json(error)
        }
    }
}

export default TransactionRecordController;