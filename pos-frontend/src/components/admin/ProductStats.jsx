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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await API.get('/api/sales');
        const sales = response.data.data;

        // Create stats object
        const stats = {};
        
        sales.forEach(sale => {
          // Skip sales with no product
          if (!sale.product) return;

          const productId = sale.product;

          // Initialize if not exists
          if (!stats[productId]) {
            stats[productId] = {
              name: getProductName(productId),
              count: 0,
              totalRevenue: 0
            };
          }

          stats[productId].count += 1;
          stats[productId].totalRevenue += parseFloat(sale.Price || 0);
        });

        const statsArray = Object.entries(stats)
          .map(([id, data]) => ({
            id: parseInt(id),
            ...data
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setProductStats(statsArray);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Helper function to get product name based on ID
  const getProductName = (id) => {
    const idNum = parseInt(id);
    switch (idNum) {
      case 1:
        return 'Phone';
      case 3:
        return 'Laptop';
      case 5:
        return 'Funda';
      case 7:
        return 'Charger';
      case 9:
        return 'Figura';
      case 11:
        return 'Custom';
      default:
        return `Product ${id}`;
    }
  };

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
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
}

export default ProductStats; 