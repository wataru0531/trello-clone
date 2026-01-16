
// ✅ 登録

import { useState } from 'react';
import { Link } from 'react-router-dom';
import './auth.css';
import { authRepository } from '../../modules/auth/auth.repository';


function Signup(){
  const [ name, setName ] = useState<string>("");
  const [ email, setEmail ] = useState<string>("");
  const [ password, setPassword ] = useState<string>("");

  const onChangeSetName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }

  const onChangeSetEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }

  const onChangeSetPassword = (e:React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }

  const onSubmitSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(name == "" || email == "" || password == "") return;

    const { user, token } = await authRepository.signup(name, email, password);
    // console.log(user, token);
    // User {id: '9f122c2a-6d50-4ec5-9801-9a988cd39d4a', name: 'wataru', email: 'obito0531@gmail.com', boardId: '92b5ef2c-31d0-403c-8645-7e43a15e69d8', thumbnailUrl: null, …}
  }

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
          <button 
            type="submit"
            disabled={ name == "" || email == "" || password == "" }
            className="continue-button"
          >Continue</button>
        </form>
        <p className="signin-link">
          ログインは、<Link to="singin">こちら</Link>
        </p>
      </div>
    </div>
  )
}

export default Signup;