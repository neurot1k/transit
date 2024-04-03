import { createServer } from 'http';
import express from 'express';
import logger from './util/logger.js';
import { router } from './router.js';


function errorHandler(err, req, res, next) {
}

const port = Number(process.env.PORT) || 3000;
const options = {};
const app = express();
const server = createServer(options, app).listen(port, () => {
  logger.info('Node started', { port });
});


app.use(express.json());
app.use('/api/', router);
app.use(errorHandler);
