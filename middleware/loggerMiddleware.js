import asyncHandler from './asyncMiddleware.js';
import LogModel from '../models/logModel.js';

const logger = asyncHandler(async (req, res, next) => {
  res.on('finish', async () => {
    try {
      const logEntry = await LogModel.create({
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        client: req.headers['user-agent'],
      });
    } catch (error) {
      console.log('Failed to entry log to DB', error);
    }
  });

  next();
});

export default logger;
