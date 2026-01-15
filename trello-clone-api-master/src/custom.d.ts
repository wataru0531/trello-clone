import { Admin } from './module/admin/admin.entity';
import { User } from './module/user/user.entity';

declare global {
  namespace Express {
    interface Request {
      currentUser: User;
      file?: Express.Multer.File;
    }
  }
}
