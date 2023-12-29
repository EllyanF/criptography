import mongoose from 'mongoose';
import { TransactionRecord } from '../interfaces/transaction-record.interface';
import counterModel from './counter.model';

const transactionRecordSchema = new mongoose.Schema<TransactionRecord>({
    id: {
        type: Number
    },
    userDocument: {
        type: String,
        required: true
    },
    creditCardToken: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: true
    }
});

transactionRecordSchema.pre('save', async function (next) {
    const document = this;
    const counter = await counterModel.findByIdAndUpdate(
        { _id: 'transactionRecordId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );

    document.id = counter.seq;
    next();
});

const transactionRecord = mongoose.model(
    'TransactionRecord', transactionRecordSchema
)

export default transactionRecord;