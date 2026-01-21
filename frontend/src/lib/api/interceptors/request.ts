
// TODO
// ローカルストレージに保存する期間


// ✅ リクエストの際に毎回実行される
// → axiosのinterceptorにかませる。
// API通信のたびに、ログインのトークンをヘッダーにつける処理

// Axiosが内部で使っている リクエスト設定の型
import type { InternalAxiosRequestConfig } from "axios";


export const addAuthorizationHeader = (config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if(token === null) return config;

  // ⭐️ リクエストを送る直前にAuthorizationヘッダーを付与
  // → サーバーはこのヘッダーを見て「誰がリクエストを送ってきたか」を判断する
  config.headers.Authorization = `Bearer ${token}`; // Bearerトークン認証
  return config;
}





