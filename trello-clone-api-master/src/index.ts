import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { createServer } from 'http';
import datasource from './datasource';
import authController from './module/auth/auth.controller';
import setCurrentUser from './middleware/set-current-user';
import accountController from './module/account/account.controller';
import cardController from './module/cards/card.controller';
import boardController from './module/boards/baord.controller';
import listController from './module/lists/list.controller';

require('dotenv').config();
const port = 8888;
const app: Express = express();
const httpServer = createServer(app);

// JSONミドルウェアの設定
app.use(express.json());
app.use(cors());
app.use(setCurrentUser);

// 静的ファイル配信の設定
app.use('/uploads', express.static('uploads'));

// ルートの設定
app.use('/auth', authController);
app.use('/account', accountController);
app.use('/cards', cardController);
app.use('/boards', boardController);
app.use('/lists', listController);

datasource
  .initialize()
  .then(async (connection) => {
    httpServer.listen(port, () =>
      console.log(`Server listening on port ${port}!`)
    );
  })
  .catch((error) => console.error(error));

app.get('/', (req: Request, res: Response) => {
  res.send('hello world');
});
