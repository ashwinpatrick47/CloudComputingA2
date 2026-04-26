import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API_BASE = 'https://API_URL'; // replace later

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
        const res = await fetch(`${API_BASE}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

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
    };

    return (
      <div>
        <h2>Login</h2>
        <form onSumbit={handleLogin}>
          <div>
            <label>Email:</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label>Password:</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} required />
          </div>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
            </button>
        </form>
        <p>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    )
  }