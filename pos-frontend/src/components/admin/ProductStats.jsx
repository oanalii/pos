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
        console.log('API URL:', API.defaults.baseURL); // Debug API URL
        
        const response = await API.get('/api/sales?populate=*');
        console.log('Raw sales data:', response.data);
        
        // Check data structure
        if (!response.data?.data?.length) {
          console.error('No sales data received');
          setLoading(false);
          return;
        }

        // Log first sale for debugging
        console.log('First sale:', response.data.data[0]);
        
        const sales = response.data.data;

        // Create stats object
        const stats = {};
        
        sales.forEach(sale => {
          // Handle the correct data structure
          if (!sale.attributes?.product?.data) return;

          const productId = sale.attributes.product.data.id;
          const productName = sale.attributes.product.data.attributes.Product;
          const price = parseFloat(sale.attributes.Price);

          if (!stats[productId]) {
            stats[productId] = {
              name: productName,
              count: 0,
              totalRevenue: 0
            };
          }

          stats[productId].count += 1;
          stats[productId].totalRevenue += price;
        });

        // Convert to array and sort by product name
        const statsArray = Object.entries(stats)
          .map(([id, data]) => ({
            id,
            ...data
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        console.log('Processed stats:', statsArray);
        setProductStats(statsArray);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        console.error('Full error:', error.response?.data || error);
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