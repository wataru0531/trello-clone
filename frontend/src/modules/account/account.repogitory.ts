
// account.repository.tsx


import api from "../../lib/api";
import { User } from "../users/user.entity";


export const accountRepository = {
  // 名前を更新
  async updateProfile(name: string): Promise<User> {
    const result = await api.put("/account/profile", { name: name });
    // → req.bodyにnameがはいる

    return new User(result.data);
  },


}