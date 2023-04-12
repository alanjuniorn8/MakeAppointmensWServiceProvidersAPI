import 'reflect-metadata';
import 'dotenv/config';

import createConnections from '@shared/infra/typeorm/index'
import express, { Request, Response, NextFunction} from 'express';
import 'express-async-errors';
import cors from 'cors';

import { errors } from 'celebrate';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import rateLimiter from '@shared/infra/http/middlewares/rateLimiter'
import routes from '@shared/infra/http/routes';

import '@shared/infra/typeorm';
import '@shared/container'

createConnections();
const app = express();

app.use(rateLimiter);
app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(routes);

app.use(errors());

app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
    if(err instanceof AppError) {
        return response.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }

    console.error(err);

    return response.status(500).json({
        status: 'error',
        message: 'Internal server error',
    });
});

app.listen(3333, () => {   
    console.log('Server started on port 3333!');
}); 