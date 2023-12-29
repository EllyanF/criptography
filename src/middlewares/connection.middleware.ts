import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

const mongoConnection = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const mongo_url = process.env.MONGO_URL as string;

        await mongoose.connect(mongo_url);

        next();
    } catch (error) {
        console.error('MongoDB connection error', error);
        res.status(500).json(error);
    }
}

export default mongoConnection;