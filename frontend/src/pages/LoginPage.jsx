import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/login.css';
import { API } from '../config';

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
      e.preventDefault();
      setError('');
      setLoading(true);
      
      try {
        const res = await fetch(API.login, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const raw = await res.json();
        const data = typeof raw.body === "string" ? JSON.parse(raw.body) : raw;

        if (res.ok && data.success) {
          sessionStorage.setItem('user_email', email);
          sessionStorage.setItem('user_name', data.user_name);
          navigate('/main');
        } else {
          setError('email or password is incorrect');
        }
      } catch (err) {
        setError('email or password is incorrect');
      } finally {
        setLoading(false);
      }

      // // Dummy credentials for testing
      // if (email === 'test@student.rmit.edu.au' && password === 'test@rmit123') {
      //   sessionStorage.setItem('user_email', email);
      //   sessionStorage.setItem('user_name', 'TestUser');
      //   navigate('/main');
      // } else {
      //   setError('email or password is invalid');
      // }
    };

    return (
      <div className="login-page">
        <div className="login-card">
          <div className="login-brand">
            <h1>Tune Vault</h1>
          </div>  
          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@student.rmit.edu.au"
              />
            </div>
  
            <div className="form-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
              />
            </div>
  
            {error && <p className="error-message">{error}</p>}
  
            <button className="submit-btn" type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
  
          <p className="register-link">
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    );
  }