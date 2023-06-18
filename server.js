import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import swaggerUI from 'swagger-ui-express';

import connectDB from './config/db.js';
import userRouter from './routes/userRoute.js';
import adminRoute from './routes/adminRoute.js';
import companyRoute from './routes/companyRoute.js';
import systemRoute from './routes/systemRoute.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import logger from './middleware/loggerMiddleware.js';
import swaggerSpecs from './utils/swagger.js';

dotenv.config();

connectDB();

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/v1', swaggerUI.serve, swaggerUI.setup(swaggerSpecs));
app.use(logger);

app.use('/api/users', userRouter);
app.use('/api/admin', adminRoute);
app.use('/api/company', companyRoute);
app.use('/api/system', systemRoute);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} on port ${PORT}\nSwagger Documentation: http://localhost:5000/api/v1/`
  )
);
