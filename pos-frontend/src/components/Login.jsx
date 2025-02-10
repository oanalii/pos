import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';

function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // First API call - login
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:1337'}/api/auth/local`,
        {
          identifier,
          password,
        }
      );
      
      const jwt = response.data.jwt;
      if (!jwt) {
        throw new Error('No JWT received');
      }
      
      localStorage.setItem('jwtToken', jwt);
      
      // Second API call - get user data
      const userResponse = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:1337'}/api/users/me?populate=store`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`
          }
        }
      );
      
      console.log('User data with store:', userResponse.data);
      
      if (!userResponse.data.store?.id) {
        throw new Error('No store ID in user data');
      }

      localStorage.setItem('storeId', userResponse.data.store.id);
      
      // Force a small delay to ensure localStorage is set
      setTimeout(() => {
        navigate('/pos');
      }, 100);

    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.error?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default'
      }}
    >
      <Card sx={{ maxWidth: 400, width: '90%', boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" component="h1" gutterBottom align="center">
            Login to POS System
          </Typography>
          
          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              margin="normal"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              disabled={loading}
            />
            
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Login; 