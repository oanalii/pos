import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import Sidebar from './Sidebar';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Chip,
} from '@mui/material';

const AdminCajaClosures = () => {
  const [closures, setClosures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClosures = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      try {
        setLoading(true);
        const response = await API.get('/api/cajas', {
          params: {
            'populate': ['store'],
            'sort': 'createdAt:desc',
          },
        });
        setClosures(response.data.data);
      } catch (err) {
        setError('Failed to fetch caja closures.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClosures();
  }, [navigate]);
  
  const formatExpenses = (items) => {
    if (!items || items.length === 0) return 'N/A';
    return items.map(item => `${item.concept} (${item.price}€)`).join(', ');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'hsl(0 0% 98%)' }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'hsl(0 0% 98%)' }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', bgcolor: 'hsl(0 0% 98%)', minHeight: '100vh' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 4, overflow: 'auto' }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: 'hsl(222.2 47.4% 11.2%)' }}>
            Caja Closures
          </Typography>
          <Typography sx={{ color: 'hsl(215.4 16.3% 46.9%)' }}>
            Daily counter closure history from all stores.
          </Typography>
        </Box>
        
        <Paper sx={{
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          border: '1px solid hsl(240 5.9% 90%)',
          overflow: 'hidden'
        }}>
          <TableContainer>
            <Table sx={{ minWidth: 1200 }}>
              <TableHead sx={{ bgcolor: 'hsl(0 0% 98%)' }}>
                <TableRow>
                  <TableCell sx={headerCellStyle}>Date</TableCell>
                  <TableCell sx={headerCellStyle}>Store</TableCell>
                  <TableCell sx={headerCellStyle} align="right">Total Sales</TableCell>
                  <TableCell sx={headerCellStyle} align="center">Card Sales</TableCell>
                  <TableCell sx={headerCellStyle} align="center">Cash Sales</TableCell>
                  <TableCell sx={headerCellStyle} align="right">Total Expenses</TableCell>
                  <TableCell sx={headerCellStyle}>Expense Items</TableCell>
                  <TableCell sx={headerCellStyle} align="right">Total Expected</TableCell>
                  <TableCell sx={headerCellStyle} align="right">Total in Caja</TableCell>
                  <TableCell sx={headerCellStyle}>Notes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {closures.map(closure => (
                  <TableRow key={closure.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={cellStyle}>{new Date(closure.createdAt).toLocaleDateString('es-ES')}</TableCell>
                    <TableCell sx={cellStyle}>{closure.store?.Name || 'N/A'}</TableCell>
                    <TableCell sx={cellStyle} align="right">€{closure.totalSales.toFixed(2)}</TableCell>
                    <TableCell sx={cellStyle} align="center">
                      <Chip 
                        label={`€${closure.cardSales.toFixed(2)}`}
                        color={closure.cardSalesVerified ? 'success' : 'error'}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell sx={cellStyle} align="center">
                      <Chip 
                        label={`€${closure.cashSales.toFixed(2)}`}
                        color={closure.drawerAmountVerified ? 'success' : 'error'}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell sx={cellStyle} align="right">€{closure.totalExpenses.toFixed(2)}</TableCell>
                    <TableCell sx={{...cellStyle, maxWidth: '200px', whiteSpace: 'normal' }}>{formatExpenses(closure.expenses)}</TableCell>
                    <TableCell sx={cellStyle} align="right">€{closure.totalExpectedInDrawer.toFixed(2)}</TableCell>
                    <TableCell sx={{...cellStyle, color: !closure.drawerAmountVerified ? 'error.main' : 'inherit', fontWeight: !closure.drawerAmountVerified ? '600' : 'normal'}} align="right">
                      €{closure.actualAmountInDrawer.toFixed(2)}
                    </TableCell>
                    <TableCell sx={{...cellStyle, maxWidth: '200px', whiteSpace: 'normal'}}>{closure.notes || 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Box>
  );
};

const headerCellStyle = {
  padding: '12px 16px',
  fontSize: '12px',
  fontWeight: '600',
  color: 'hsl(215.4 16.3% 46.9%)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  borderBottom: '1px solid hsl(240 5.9% 90%)',
};

const cellStyle = {
  padding: '12px 16px',
  fontSize: '14px',
  color: 'hsl(222.2 47.4% 11.2%)',
  verticalAlign: 'middle',
  whiteSpace: 'nowrap',
  borderBottom: '1px solid hsl(240 5.9% 90%)',
};

export default AdminCajaClosures; 