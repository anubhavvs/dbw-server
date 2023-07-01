import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import connectDB from './config/db.js';
import userRouter from './routes/userRoute.js';
import adminRoute from './routes/adminRoute.js';
import companyRoute from './routes/companyRoute.js';
import systemRoute from './routes/systemRoute.js';
import projectRoute from './routes/projectRoute.js';
import productRoute from './routes/productRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import logger from './middleware/loggerMiddleware.js';
import cron from './utils/cron.js';

dotenv.config();

connectDB();

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'production') {
  app.use(logger);
}

app.use('/api/users', userRouter);
app.use('/api/admin', adminRoute);
app.use('/api/company', companyRoute);
app.use('/api/system', systemRoute);
app.use('/api/project', projectRoute);
app.use('/api/product', productRoute);

app.use(notFound);
app.use(errorHandler);

cron();

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`)
);
