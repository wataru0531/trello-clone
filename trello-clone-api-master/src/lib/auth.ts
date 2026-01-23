
// ✅ ミドルウェア → このルートの入る時に必ず実行される

import e, { Request, Response, NextFunction } from 'express';

// ✅　currentUserが存在するかチェック。
export const Auth = (req: Request, _: Response, next: NextFunction) => {
  if (req.currentUser == null) return next(new Error('Unauthorized user'));
  next(); // 次の処理へ
};