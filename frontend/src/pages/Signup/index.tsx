
// ✅ 登録

import { Link } from 'react-router-dom';
import './auth.css';

function Signup(){
  return(
    <div className="signup-container">
      <div className="signup-form-container">
        <div className="signup-form-container">
          <h1 className="signup-title">Sign up to continue</h1>
          <p className="signup-subtitle">
            Use your email or another service to continue
          </p>

          <div className="form-group">
            <input type="text" placeholder="Full Name" required/>
          </div>
          <div className="form-group">
            <input type="email" placeholder="Email" required/>
          </div>
          <div className="form-group">
            <input type="password" placeholder="Password" required/>
          </div>
          <button type="submit" className="continue-button">Continue</button>
        </div>
        <p className="signin-link">
          ログインは、<Link to="singin">こちら</Link>
        </p>
      </div>
    </div>
  )
}

export default Signup;
