
// main.tsx
// TODO 404ページ追加

import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useSetAtom } from "jotai";

import { currentUserAtom } from "./modules/auth/current-user";
import { authRepository } from './modules/auth/auth.repository';
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";


function App() {
  const [ isLoading, setIsLoading ] = useState(true);
  // useSetAtom → 状態をセットする専用のフック
  // setCurrentUser → 値を変更することができる関数
  const setCurrentUser = useSetAtom(currentUserAtom);

  // ✅ 現在のユーザーをグローバルに保存
  // → AtomはProviderが不要
  const fetchCurrentUser = async () => {
    try {
      // setIsLoading(true);
      const user = await authRepository.getCurrentUser();
      setCurrentUser(user);
    } catch(e) {
      console.error("ユーザー登録に失敗しました。", e);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  if(isLoading) return <div>...isLoading</div>;

  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={ <Home /> } />
          <Route path="signin" element={ <Signin /> } />
          <Route path="signup" element={ <Signup /> } />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App;