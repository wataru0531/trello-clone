
// ✅　Node.jsでのサーバー
// → Node.js +  Express + TypeScript

import express, { Express, Request, Response } from 'express'; // { Express, Request, Response } → 型（type）
import cors from 'cors';
import { createServer } from 'http'; // Node.js 標準のHTTPサーバー
import datasource from './datasource'; // DB接続
import authController from './module/auth/auth.controller';
import setCurrentUser from './middleware/set-current-user';
import accountController from './module/account/account.controller';
import cardController from './module/cards/card.controller';
import boardController from './module/boards/baord.controller';
import listController from './module/lists/list.controller';

require('dotenv').config(); // 環境変数が使えるようにする。process.env.〜
const port = 8888;
const app: Express = express();
const httpServer = createServer(app); // ⭐️ Expressだけではなく、httpServerを作るのか？
                                      // → WebSocket、Socket.IO、HTTP/HTTPSの切り替えなど拡張するため。

// JSONミドルウェアの設定
app.use(express.json()); // JSONリクエストをreq.bodyに変換
app.use(cors()); 
app.use(setCurrentUser); // JWTなどを解析 ... 認証の下準備

// 静的ファイル配信の設定
app.use('/uploads', express.static('uploads'));

// ルートの設定 ... ルーティング
app.use('/auth', authController);
app.use('/account', accountController);
app.use('/cards', cardController);
app.use('/boards', boardController);
app.use('/lists', listController);

datasource.initialize().then(async (connection) => {
    httpServer.listen(port, () =>
      console.log(`Server listening on port ${port}!`)
    );
  })
  .catch((error) => console.error(error));

app.get('/', (req: Request, res: Response) => {
  res.send('hello world');
});
