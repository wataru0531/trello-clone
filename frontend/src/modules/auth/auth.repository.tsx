

import api from "../../lib/api"
import { User } from "../users/user.entity";

✅ 

// api > index.tsの記述
// const baseURL = import.meta.env.VITE_API_URL;
// const api = axios.create({ baseURL: baseURL })
// api.defaults.headers.common["Content-Type"] = "application/json";

// 
export const authRepository = {
  async signup(
    name: string, 
    email: string, 
    password: string
  ): Promise<{ user: User, token: string }>{ // Promise<T> → ジェネリクスインターフェース
    const result = await api.post(
      "/auth/signup",
      { name, email, password }
    )

    const { user, token } = result.data; // ユーザ情報、アクセストークン
    return { 
      user: new User(user), 
      token: token
    }
  },

}