import mongoose from 'mongoose';
import { Counter } from '../interfaces/counter.interface';

const counterSchema = new mongoose.Schema<Counter>({
    _id: {
        type: String,
        required: true
    },
    seq: {
        type: Number,
        default: 0
    }
});

const counterModel = mongoose.model('Counter', counterSchema);

export default counterModel;