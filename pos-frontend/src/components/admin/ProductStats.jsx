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

  // Product IDs and their names
  const PRODUCTS = {
    1: 'Phone',
    3: 'Laptop',
    5: 'Funda',
    7: 'Charger',
    9: 'Figura',
    11: 'Custom'
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await API.get('/api/sales');
        const sales = response.data.data;

        // Calculate stats for each product
        const stats = Object.entries(PRODUCTS).map(([id, name]) => {
          // Filter sales for this product
          const productSales = sales.filter(sale => sale.product === parseInt(id));
          
          // Calculate total revenue
          const totalRevenue = productSales.reduce((sum, sale) => sum + parseFloat(sale.Price), 0);

          return {
            id: parseInt(id),
            name,
            count: productSales.length,
            totalRevenue
          };
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