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
        const response = await API.get('/api/sales?populate=*');
        const sales = response.data.data;

        // Create stats object
        const stats = {};
        
        sales.forEach(sale => {
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

        // Convert to array for easier rendering
        const statsArray = Object.entries(stats).map(([id, data]) => ({
          id,
          ...data
        }));

        setProductStats(statsArray);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
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
                {productStats.map((stat) => (
                  <TableRow key={stat.id}>
                    <TableCell>{stat.name}</TableCell>
                    <TableCell align="right">{stat.count}</TableCell>
                    <TableCell align="right">€{stat.totalRevenue.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
}

export default ProductStats; 