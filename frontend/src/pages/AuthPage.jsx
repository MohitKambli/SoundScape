import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthPage.css';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate(); // Initialize the navigate function

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Here, you would handle authentication (e.g., verify login/signup)
    // Assuming authentication is successful, redirect to HomePage:
    navigate('/home'); // Redirect to HomePage after successful login/signup
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? 'Login to SoundScape' : 'Create an Account'}</h2>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && <input type="text" placeholder="Username" required />}
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
        </form>
        
        <p className="toggle-text" onClick={toggleAuthMode}>
          {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
