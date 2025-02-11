import React, { useState, useEffect, useCallback } from 'react';
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
  Paper
} from '@mui/material';

const STORE_IDS = {
  gaudi: 7,
  paralel: 1,
  mallorca: 5,
  consell: 10,
  hospital: 9
};

function AdminSales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('all');
  const navigate = useNavigate();
  const { store } = useParams();

  const fetchSales = useCallback(async () => {
    try {
      let url = '/api/sales?populate=*';
      
      // Add store filter if we're not on the general page
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
  }, [store, timeFilter]);

  useEffect(() => {
    fetchSales();
  }, [store, timeFilter, fetchSales]);

  const handleDownloadInvoice = (sale) => {
    const items = [{
      product: { Product: sale.product.Product },
      price: sale.Price
    }];
    generateInvoice(items, sale.Price);
  };

  if (loading) return (
    <Box sx={{ ml: '240px', p: 3 }}>
      <Typography>Loading sales data...</Typography>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box sx={{ 
        flexGrow: 1, 
        ml: '280px',  // Match sidebar width
        backgroundColor: '#f5f5f5',  // Moved bgcolor here
        minHeight: '100vh',
        p: 2,
      }}>
        <Box sx={{ 
          backgroundColor: '#fff',
          borderRadius: 1,
          p: 3,
        }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 3,
          }}>
            <Box>
              <Typography variant="h4" sx={{ 
                mb: 1,
                fontWeight: 600,
                color: '#333'  // Dark text for better contrast
              }}>
                {store ? `${store.charAt(0).toUpperCase() + store.slice(1)} Sales` : 'All Stores Sales'}
              </Typography>
              <Select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                size="small"
                sx={{ minWidth: 200 }}
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
            >
              Logout
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Store</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Actions</TableCell>
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