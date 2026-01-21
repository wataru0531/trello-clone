

import api from "../../lib/api"
import { User } from "../users/user.entity";

// api > index.tsの記述
// const baseURL = import.meta.env.VITE_API_URL;
// const api = axios.create({ baseURL: baseURL })
// api.defaults.headers.common["Content-Type"] = "application/json";

// 
export const authRepository = {
  // ✅ ユーザー登録
  async signup(
    name: string, 
    email: string,
    password: string
  ): Promise<{ user: User, token: string }>{ // Promise<T> → ジェネリクスインターフェース
    const result = await api.post(
      "/auth/signup",
      { name, email, password } // bodyに入れる
    )

    const { user, token } = result.data; // ユーザ情報、アクセストークン
    
    return { 
      user: new User(user), 
      token: token
    }
  },

  // ✅ ログイン
  async signin(
    email: string, 
    password: string
  ): Promise<{ user: User; token: string }> {
    const result = await api.post("/auth/signin", { email, password });
    const { user, token } = result.data;

    return { user: new User(user), token: token }
  },

  // ✅ 現在のユーザー情報を取得
  async getCurrentUser(): Promise<User | undefined> {
    const result = await api.get("/auth/me");

    if(result.data == null) return;

    return new User(result.data);
  }


}