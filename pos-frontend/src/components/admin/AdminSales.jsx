import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../../services/api';
import { generateInvoice } from '../../utils/invoice';
import Sidebar from './Sidebar';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container
} from '@mui/material';

const STORE_IDS = {
  gaudi: 5,
  paralel: 1,
  mallorca: 3,
  hospital: 7,
};

function AdminSales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('all');
  const [todayRevenue, setTodayRevenue] = useState(0);
  const navigate = useNavigate();
  const { store } = useParams();

  const fetchSales = async () => {
    try {
      // Get today's sales specifically
      const todayResponse = await API.get('/api/sales', {
        params: {
          'filters[Time][$gte]': new Date().toISOString().split('T')[0],
          'populate': '*',
          ...(store && STORE_IDS[store] ? {
            'filters[store][id][$eq]': STORE_IDS[store]
          } : {})
        }
      });

      // Calculate today's revenue
      const todayTotal = todayResponse.data.data.reduce((sum, sale) => 
        sum + parseFloat(sale.Price || 0), 0
      );
      setTodayRevenue(todayTotal);

      // Get filtered sales as before...
      let url = '/api/sales?populate=*';
      if (store && STORE_IDS[store]) {
        url += `&filters[store][id][$eq]=${STORE_IDS[store]}`;
      }
      const response = await API.get(url);
      let filteredSales = response.data.data;

      // Apply time filter
      const currentDate = new Date(); // Create a base date
      filteredSales = filteredSales.filter(sale => {
        const saleDate = new Date(sale.Time);
        
        switch (timeFilter) {
          case 'day':
            const today = new Date(currentDate);
            today.setHours(0, 0, 0, 0);
            return saleDate >= today;
            
          case 'week':
            const weekAgo = new Date(currentDate);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return saleDate >= weekAgo;
            
          case 'month':
            const monthAgo = new Date(currentDate);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return saleDate >= monthAgo;
            
          case '3months':
            const threeMonthsAgo = new Date(currentDate);
            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
            return saleDate >= threeMonthsAgo;
            
          case '12months':
            const yearAgo = new Date(currentDate);
            yearAgo.setFullYear(yearAgo.getFullYear() - 1);
            return saleDate >= yearAgo;
            
          default:
            return true;
        }
      });

      // Sort by date (newest first)
      const sortedSales = filteredSales.sort((a, b) => 
        new Date(b.Time).getTime() - new Date(a.Time).getTime()
      );
      
      setSales(sortedSales);
    } catch (error) {
      console.error('Error fetching sales:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [store, timeFilter]);

  const handleDownloadInvoice = (sale) => {
    const items = [{
      product: { Product: sale.product.Product },
      price: sale.Price
    }];
    generateInvoice(items, sale.Price);
  };

  if (loading) return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box sx={{ 
        flexGrow: 1,
        p: 3,
      }}>
        <Typography>Loading sales data...</Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box sx={{ 
        flexGrow: 1,
        p: 3,
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Box sx={{ 
          backgroundColor: '#fff',
          borderRadius: 1,
          p: 3,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 4,
          }}>
            <Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  mb: 1,
                  fontWeight: 600,
                  color: '#0f172a',
                  letterSpacing: '-0.02em',
                  fontSize: '1.75rem',
                }}
              >
                {store ? `${store.charAt(0).toUpperCase() + store.slice(1)} Sales` : 'All Stores Sales'}
              </Typography>
              <Select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                size="small"
                sx={{ 
                  minWidth: 200,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgb(226, 232, 240)',
                    borderRadius: '8px',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgb(148, 163, 184)',
                  },
                }}
              >
                <MenuItem value="all">All Time</MenuItem>
                <MenuItem value="day">Today</MenuItem>
                <MenuItem value="week">Last 7 Days</MenuItem>
                <MenuItem value="month">Last 30 Days</MenuItem>
                <MenuItem value="3months">Last 3 Months</MenuItem>
                <MenuItem value="12months">Last 12 Months</MenuItem>
              </Select>
            </Box>
            <Button 
              variant="contained" 
              color="error"
              onClick={() => navigate('/admin')}
              sx={{
                bgcolor: '#ef4444',
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 500,
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: '#dc2626',
                  boxShadow: 'none',
                },
              }}
            >
              Logout
            </Button>
          </Box>

          <Box sx={{ 
            mb: 4, 
            p: 3, 
            bgcolor: '#2563eb',
            borderRadius: '12px',
            color: 'white',
            boxShadow: '0 4px 6px -1px rgb(37 99 235 / 0.1)',
          }}>
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              Today's Revenue: €{todayRevenue.toFixed(2)}
            </Typography>
          </Box>

          <TableContainer sx={{ 
            flexGrow: 1,
            overflow: 'auto',
            border: '1px solid rgb(226, 232, 240)',
            borderRadius: '12px',
          }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f8fafc' }}>
                  <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Store</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Time</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Product</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Price</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sales && sales.length > 0 ? (
                  sales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>{sale.store?.Name || 'Unknown Store'}</TableCell>
                      <TableCell>{sale.Time ? new Date(sale.Time).toLocaleDateString('es-ES') : 'N/A'}</TableCell>
                      <TableCell>{sale.Time ? new Date(sale.Time).toLocaleTimeString('es-ES') : 'N/A'}</TableCell>
                      <TableCell>{sale.product?.Product || 'N/A'}</TableCell>
                      <TableCell>€{sale.Price?.toFixed(2) || '0.00'}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          onClick={() => handleDownloadInvoice(sale)}
                          size="small"
                        >
                          Download Invoice
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No sales records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
}

export default AdminSales; 