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
      const response = await API.post('/api/auth/local', {
        identifier: identifier,
        password: password
      });

      // Make sure this is being set
      localStorage.setItem('jwtToken', response.data.jwt);
      
      // Configure API for future requests
      API.defaults.headers.common['Authorization'] = `Bearer ${response.data.jwt}`;
      
      // Get user data with store info
      const userResponse = await API.get('/api/users/me?populate=*', {
        headers: {
          Authorization: `Bearer ${response.data.jwt}`
        }
      });
      
      const userData = userResponse.data;
      
      // Store user and store IDs
      localStorage.setItem('userId', userData.id);
      if (userData.store) {
        localStorage.setItem('storeId', userData.store.id);
        navigate('/pos');  // Navigate to POS if store exists
      } else {
        setError('User is not associated with a store');
        localStorage.clear();
        return;
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.error?.message || 'Login failed. Please try again.');
      localStorage.clear();
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