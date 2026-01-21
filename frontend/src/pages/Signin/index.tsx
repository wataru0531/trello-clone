
// ✅ ログイン

import { useState } from "react";
import { Link, Navigate } from 'react-router-dom';
import  { useAtom } from "jotai";

import '../Signup/auth.css';
import { authRepository } from "../../modules/auth/auth.repository";
import { currentUserAtom } from "../../modules/auth/current-user";


function Signin() {
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ errorMessage, setErrorMessage ] = useState<string | null>(null);
  const [ isSubmitting, setIsSubmitting ] = useState(false);

  const [ currentUser, setCurrentUser ] = useAtom(currentUserAtom); // ⭐️

  // email
  const onChangeSetEmail = (e:React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }

  // パスワード
  const onChangeSetPassword = (e:React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }

  // 送信処理
  const onSubmitSignin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);
    setErrorMessage(null);

    try{
      // console.log(e);
      if(email === "" || password === "") return;
      const { user, token } = await authRepository.signin(email, password);
      // console.log(user, token); // User {id: '9f122c2a-6d50-4ec5-9801-9a988cd39d4a', name: 'wataru', email: 'obito0531@gmail.com', boardId: '92b5ef2c-31d0-403c-8645-7e43a15e69d8', thumbnailUrl: null, …} 
                                // 'eyJhbGciOiJIUzI1NiJ9.OWYxMjJjMmEtNmQ1MC00ZWM1LTk4MDEtOWE5ODhjZDM5ZDRh.kSz52pHmSN51vjMlcapDY-CC88lEL0XRrO70jfgkaog'
      
      localStorage.setItem("token", token); // 👉 ローカルストレージにトークンを保存

      setCurrentUser(user);
      
    }catch(e){
      console.error(e);
      setErrorMessage("メールアドレスまたはパスワードが正しくありません。");
    }finally{ 
      setEmail("");
      setPassword("");

      setIsSubmitting(false);
    }
  }

  if(currentUser != null) return <Navigate to="/" replace={ true } /> // true ... 遷移時に履歴(history)を置き換える

  return (
    <div className="signup-container">
      <form 
        className="signup-form-container"
        onSubmit={ onSubmitSignin }
      >
        <h1 className="signup-title">Sign in</h1>
        <p className="signup-subtitle">メールアドレスでログインしてください</p>

        <div>
          <div className="form-group">
            <input 
              type="email"
              placeholder="Email" 
              required
              value={ email }
              onChange={ onChangeSetEmail }
            />
          </div>

          <div className="form-group">
            <input 
              type="password" 
              placeholder="Password"
              required 
              value={  password }
              onChange={ onChangeSetPassword }
            />
          </div>
          { errorMessage && <p className="error-message">{ errorMessage }</p> }

          <button 
            type="submit" 
            className="continue-button"
            disabled={ email === "" || password === "" }
          >
            { isSubmitting ? "Submitting..." : "Signin" }
          </button>
        </div>
        <p className="signin-link">
          ユーザー登録は<Link to="/signup">こちら</Link>
        </p>
      </form>
    </div>
  );
}

export default Signin;
