import 'dotenv/config';

import * as dbService from './services/dbService.js';
import * as redisService from './services/redisService.js';

import asyncHandler from 'express-async-handler';
import authenticateMiddleware from './middleware/authenticate.js';
import authorizeMiddleware from './middleware/authorize.js';
import cookieParser from 'cookie-parser';
import { createServer } from 'https';
import { dirname } from 'path';
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { readFileSync } from 'fs';
import redirectToHttps from 'express-redirect-to-https';
import rootRouter from './routes/root.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const server = await (async () => {
  await redisService.connect();
  console.log('Redis connection established');
  await dbService.connect();
  console.log('Database connection established');
  await dbService.ensureDefaultRolesExist();
  console.log('Default roles ensured to exist');
  await dbService.ensureDefaultOrderStatusesExist();
  console.log('Default order statuses ensured to exist');
  await dbService.ensureAdminAccountExist();
  console.log('Admin account ensured to exist');
  return createServer({
    key: readFileSync(process.env.SSL_SERVER_KEY_PATH),
    cert: readFileSync(process.env.SSL_SERVER_CRT_PATH),
  }, app);
})().catch(err => {
  console.error(err);
  console.log(`Server didn't start due to error`);
  process.exit(1);
});

app.use(redirectToHttps());
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(process.env.STATIC_DIR));

app.use(asyncHandler(authenticateMiddleware));
app.use(asyncHandler(authorizeMiddleware));

app.use('/', rootRouter);

server.listen(+process.env.SERVER_PORT, () => console.log(`Server running on port ${process.env.SERVER_PORT}`));