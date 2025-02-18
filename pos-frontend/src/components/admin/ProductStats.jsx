import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import Sidebar from './Sidebar';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

function ProductStats() {
  const [productStats, setProductStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revenueStats, setRevenueStats] = useState([]);
  const [todayRevenue, setTodayRevenue] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get today's sales first for the revenue widget
        const todayResponse = await API.get('/api/sales', {
          params: {
            'filters[Time][$gte]': new Date().toISOString().split('T')[0],
            'populate': '*'
          }
        });
        
        // Calculate today's revenue
        const todayTotal = todayResponse.data.data.reduce((sum, sale) => 
          sum + parseFloat(sale.Price || 0), 0
        );
        setTodayRevenue(todayTotal);

        // Get all sales for product stats
        const allSalesResponse = await API.get('/api/sales', {
          params: {
            'populate': ['product', 'store']
          }
        });
        const allSales = allSalesResponse.data.data;

        // Map products to their stats (expanded list)
        const stats = [
          { id: 1, name: "Phone", count: 0, totalRevenue: 0 },
          { id: 3, name: "Laptop", count: 0, totalRevenue: 0 },
          { id: 5, name: "Funda", count: 0, totalRevenue: 0 },
          { id: 7, name: "Charger", count: 0, totalRevenue: 0 },
          { id: 9, name: "Figura", count: 0, totalRevenue: 0 },
          { id: 11, name: "Custom", count: 0, totalRevenue: 0 }
        ];

        // Process each sale
        allSales.forEach(sale => {
          const productId = sale.product?.id;
          const price = parseFloat(sale.Price || 0);

          const productStat = stats.find(s => s.id === productId);
          if (productStat) {
            productStat.count += 1;
            productStat.totalRevenue += price;
          }
        });

        setProductStats(stats);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box sx={{ ml: '280px', p: 3 }}>
        <Typography>Loading stats...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box sx={{ 
        flexGrow: 1, 
        ml: '280px', 
        backgroundColor: '#f5f5f5', 
        minHeight: '100vh', 
        p: 2 
      }}>
        <Box sx={{ 
          backgroundColor: '#fff',
          borderRadius: 1,
          p: 3,
        }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
            Product Statistics
          </Typography>

          {/* Add Today's Revenue Widget */}
          <Box sx={{ mb: 3, p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
            <Typography variant="h6" sx={{ color: 'white' }}>
              Today's Revenue: €{todayRevenue.toFixed(2)}
            </Typography>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product Name</TableCell>
                  <TableCell align="right">Total Sales</TableCell>
                  <TableCell align="right">Total Revenue</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productStats.length > 0 ? (
                  productStats.map((stat) => (
                    <TableRow key={stat.id}>
                      <TableCell>{stat.name}</TableCell>
                      <TableCell align="right">{stat.count}</TableCell>
                      <TableCell align="right">€{stat.totalRevenue.toFixed(2)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No sales data found
                    </TableCell>
                  </TableRow>
                )}
                
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell colSpan={2}>
                    <strong>Today's Total Revenue</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>€{todayRevenue.toFixed(2)}</strong>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
}

export default ProductStats; 