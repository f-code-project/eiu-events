import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import http from 'http';

import { env } from '~/configs/env';
import { initSocket } from '~/configs/socket';
import { defaultErrorHandler } from '~/middlewares/error.middlewares';
import rootRouter from '~/routes/root.routes';

const app = express();
const server = http.createServer(app);

initSocket(server);

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: env.NODE_ENV === 'development' ? 'http://localhost:5173' : env.CLIENT_URL,
    credentials: true,
  }),
);

app.use('/api/v1', rootRouter);

app.use(defaultErrorHandler);

server.listen(env.PORT, () => {
  console.log(`✓ Server running on http://localhost:${env.PORT}`);
});
