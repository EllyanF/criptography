import 'reflect-metadata';
import dotenv from 'dotenv';
import { InversifyExpressServer } from 'inversify-express-utils';
import { urlencoded } from 'express';

import './controllers/transaction-record.controller';
import container from './modules/inversify.config';
import mongoConnection from './middlewares/connection.middleware';

export class App {
    constructor() {
        this.createServer();
    }

    createServer(): void {
        let server: InversifyExpressServer = new InversifyExpressServer(container);
        server.setConfig((app) => {
            app.use(urlencoded({ extended: true }));
            app.use(mongoConnection);
        });

        dotenv.config();
        let app = server.build();
        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`Server listening on port ${port}`)
        })
    }
}

export default new App()