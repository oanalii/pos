import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // First, authenticate
      const authResponse = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:1337'}/api/auth/local`,
        {
          identifier,
          password,
        }
      );
      
      // Store JWT token
      localStorage.setItem('jwtToken', authResponse.data.jwt);
      
      // Then fetch user data with store information
      const userResponse = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:1337'}/api/users/me?populate=store`,
        {
          headers: {
            Authorization: `Bearer ${authResponse.data.jwt}`
          }
        }
      );
      
      console.log('User data with store:', userResponse.data);
      
      if (userResponse.data.store) {
        localStorage.setItem('storeId', userResponse.data.store.id);
      } else {
        console.error('No store found for user:', userResponse.data);
      }
      
      navigate('/pos');
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div style={{ margin: '50px auto', maxWidth: '400px', textAlign: 'center' }}>
      <h2>Employee Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <input
            type="text"
            placeholder="Username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            style={{ width: '100%', padding: '12px', margin: '10px 0' }}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '12px', margin: '10px 0' }}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ padding: '12px 20px', fontSize: '16px' }}>
          Login
        </button>
      </form>
    </div>
  );
}

export default Login; 