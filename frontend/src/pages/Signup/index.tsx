
// ✅ 登録

import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAtom } from "jotai";
import { currentUserAtom } from '../../modules/auth/current-user';

import './auth.css';
import { authRepository } from '../../modules/auth/auth.repository';


function Signup(){
  const [ name, setName ] = useState<string>("");
  const [ email, setEmail ] = useState<string>("");
  const [ password, setPassword ] = useState<string>("");
  const [ errorMessage, setErrorMessage ] = useState<string | null>(null);
  const [ isSubmitting, setIsSubmitting ] = useState(false);

  const [ currentUser, setCurrentUser ] = useAtom(currentUserAtom); // ⭐️ 現在のUserの状態を取得

  // 名前
  const onChangeSetName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }

  // e-mail
  const onChangeSetEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }

  // パスワード
  const onChangeSetPassword = (e:React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }

  // 送信処理
  const onSubmitSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);
    setErrorMessage(null)

    try {
      if(name == "" || email == "" || password == "") return;

      const { user, token } = await authRepository.signup(name, email, password);
      // console.log(user, token);
      // User {id: '9f122c2a-6d50-4ec5-9801-9a988cd39d4a', name: 'wataru', email: 'obito0531@gmail.com', boardId: '92b5ef2c-31d0-403c-8645-7e43a15e69d8', thumbnailUrl: null, …}
      
      setCurrentUser(user);
    } catch(e) {
      console.error(e);
      setErrorMessage("名前またはメールアドレスまたはパスワードが正しくありません。")
    } finally {
      setName("");
      setEmail("");
      setPassword("");

      setIsSubmitting(false);
    }
  }

  if(currentUser != null) return <Navigate to="/" replace={ true } />

  return(
    <div className="signup-container">
      <div className="signup-form-container">

        <form  
          className="signup-form-container"
          onSubmit={ onSubmitSignup }
        >
          <h1 className="signup-title">Sign up to continue</h1>
          <p className="signup-subtitle">
            Use your email or another service to continue
          </p>

          <div className="form-group">
            <input 
              type="text"
              onChange={ onChangeSetName }
              placeholder="Full Name" 
              required
            />
          </div>
          <div className="form-group">
            <input 
              type="email"
              onChange={ onChangeSetEmail }
              placeholder="Email" 
              required
            />
          </div>
          <div className="form-group">
            <input 
              type="password"
              onChange={ onChangeSetPassword }
              placeholder="Password" 
              required
            />
          </div>
          { errorMessage && <div className="error-message">{ errorMessage }</div> }

          <button 
            type="submit"
            disabled={ name == "" || email == "" || password == "" }
            className="continue-button"
          >
            { isSubmitting ? "...isSubmitting" : "Signup" }
          </button>
        </form>
        <p className="signin-link">
          ログインは、<Link to="/signin">こちら</Link>
        </p>
      </div>
    </div>
  )
}

export default Signup;