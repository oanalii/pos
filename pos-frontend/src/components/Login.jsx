import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';  // Import our API service
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
      // Use API service instead of axios directly
      const loginResponse = await API.post('/api/auth/local', {
        identifier,
        password,
      });
      
      const jwt = loginResponse.data.jwt;
      if (!jwt) {
        throw new Error('No JWT received');
      }
      
      localStorage.setItem('jwtToken', jwt);
      
      // Use API service for user data
      const userResponse = await API.get('/api/users/me?populate=store');
      console.log('User data:', userResponse.data);
      
      if (!userResponse.data.store?.id) {
        throw new Error('User has no assigned store');
      }

      // Save store ID and user ID
      localStorage.setItem('storeId', userResponse.data.store.id);
      localStorage.setItem('userId', userResponse.data.id);
      console.log('Stored storeId:', userResponse.data.store.id);
      console.log('Stored userId:', userResponse.data.id);

      // Navigate with replace
      navigate('/pos', { replace: true });

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