import React, { useState, useEffect } from 'react';
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';

function ProductStats() {
  const [productStats, setProductStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [yesterdayRevenue, setYesterdayRevenue] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [timeFilter, setTimeFilter] = useState('all');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Calculate date filters based on selection
        const now = new Date();
        const todayStart = new Date(now);
        todayStart.setHours(0, 0, 0, 0);
        
        let dateParams = {};
        
        switch (timeFilter) {
          case 'today':
            dateParams = { 'filters[Time][$gte]': todayStart.toISOString() };
            break;
          case 'yesterday':
            const yesterdayStart = new Date(todayStart);
            yesterdayStart.setDate(yesterdayStart.getDate() - 1);
            const yesterdayEnd = new Date(todayStart);
            dateParams = {
              'filters[Time][$gte]': yesterdayStart.toISOString(),
              'filters[Time][$lt]': yesterdayEnd.toISOString()
            };
            break;
          case 'week':
            const weekStart = new Date(todayStart);
            weekStart.setDate(weekStart.getDate() - 7);
            dateParams = { 'filters[Time][$gte]': weekStart.toISOString() };
            break;
          case 'month':
            const monthStart = new Date(todayStart);
            monthStart.setMonth(monthStart.getMonth() - 1);
            dateParams = { 'filters[Time][$gte]': monthStart.toISOString() };
            break;
          default:
            dateParams = {}; // All time
        }

        // Get sales based on filter
        const salesResponse = await API.get('/api/sales', {
          params: {
            'populate': ['product', 'store'],
            'pagination[limit]': -1, // Get all records
            ...dateParams
          }
        });
        const filteredSales = salesResponse.data.data;

        // Get Today's total (for the card, always fixed)
        const todayResponse = await API.get('/api/sales', {
          params: {
            'filters[Time][$gte]': todayStart.toISOString(),
            'populate': '*'
          }
        });
        
        const todayTotal = todayResponse.data.data.reduce((sum, sale) => 
          sum + parseFloat(sale.Price || 0), 0
        );
        setTodayRevenue(todayTotal);

        // Get Yesterday's total (for the card, always fixed)
        const yStart = new Date(todayStart);
        yStart.setDate(yStart.getDate() - 1);
        const yEnd = new Date(todayStart);

        const yesterdayResponse = await API.get('/api/sales', {
          params: {
            'filters[Time][$gte]': yStart.toISOString(),
            'filters[Time][$lt]': yEnd.toISOString(),
            'populate': '*'
          }
        });

        const yesterdayTotal = yesterdayResponse.data.data.reduce((sum, sale) =>
          sum + parseFloat(sale.Price || 0), 0
        );
        setYesterdayRevenue(yesterdayTotal);

        // Get All Time Total (for the card, always fixed)
        // We can't reuse filteredSales here if a filter is active
        let allTimeTotal = 0;
        if (timeFilter === 'all') {
           allTimeTotal = filteredSales.reduce((sum, sale) => sum + parseFloat(sale.Price || 0), 0);
        } else {
           // Fetch all time total separately if needed, or just keep the old logic
           // To save bandwidth, we can do a separate lightweight call or just accept we need it.
           // For now, let's keep the original logic for the total card to be accurate regardless of filter
           const allTimeResponse = await API.get('/api/sales', {
              params: { 'pagination[limit]': -1 }
           });
           allTimeTotal = allTimeResponse.data.data.reduce((sum, sale) => sum + parseFloat(sale.Price || 0), 0);
        }
        setTotalRevenue(allTimeTotal);

        // Map products to their stats (expanded list)
        const stats = [
          { id: 1, name: "Phone", count: 0, totalRevenue: 0 },
          { id: 3, name: "Laptop", count: 0, totalRevenue: 0 },
          { id: 5, name: "Funda", count: 0, totalRevenue: 0 },
          { id: 7, name: "Charger", count: 0, totalRevenue: 0 },
          { id: 9, name: "Figura", count: 0, totalRevenue: 0 },
          { id: 11, name: "Voda SIM", count: 0, totalRevenue: 0 },
          { id: 13, name: "Protector", count: 0, totalRevenue: 0 },
          { id: 15, name: "Hydrogel Protector", count: 0, totalRevenue: 0 },
          { id: 17, name: "Cordón", count: 0, totalRevenue: 0 },
          { id: 19, name: "BT Headphones", count: 0, totalRevenue: 0 },
          { id: 21, name: "BT Speaker", count: 0, totalRevenue: 0 },
          { id: 23, name: "Souvenir", count: 0, totalRevenue: 0 },
          { id: 25, name: "Headphones", count: 0, totalRevenue: 0 },
          { id: 27, name: "Cable", count: 0, totalRevenue: 0 },
          { id: 29, name: "Cargador Set", count: 0, totalRevenue: 0 },
          { id: 31, name: "Power Bank", count: 0, totalRevenue: 0 },
          { id: 33, name: "Recarga", count: 0, totalRevenue: 0 },
          { id: 35, name: "Print", count: 0, totalRevenue: 0 },
          { id: 37, name: "Adapter", count: 0, totalRevenue: 0 },
          { id: 39, name: "Gafas", count: 0, totalRevenue: 0 },
          { id: 41, name: "Repair", count: 0, totalRevenue: 0 },
          { id: 43, name: "Data transfer", count: 0, totalRevenue: 0 },
          { id: 45, name: "Smartwatch", count: 0, totalRevenue: 0 },
          { id: 47, name: "Lyca SIM", count: 0, totalRevenue: 0 },
          { id: 49, name: "Raton", count: 0, totalRevenue: 0 },
          { id: 51, name: "Watch Strap", count: 0, totalRevenue: 0 },
          { id: 53, name: "USB Drive", count: 0, totalRevenue: 0 },
          { id: 55, name: "Drink", count: 0, totalRevenue: 0 },
          { id: 57, name: "Umbrella", count: 0, totalRevenue: 0 },
          { id: 59, name: "Car Phone Mount", count: 0, totalRevenue: 0 },
          { id: 61, name: "Shave Machine", count: 0, totalRevenue: 0 },
          { id: 63, name: "Funda headphone", count: 0, totalRevenue: 0 },
          { id: 65, name: "iPad", count: 0, totalRevenue: 0 },
          { id: 67, name: "iPad funda", count: 0, totalRevenue: 0 },
          { id: 69, name: "Macbook protector", count: 0, totalRevenue: 0 },
          { id: 71, name: "Anime shirt", count: 0, totalRevenue: 0 },
          { id: 73, name: "PC", count: 0, totalRevenue: 0 },
          { id: 75, name: "Keyboard", count: 0, totalRevenue: 0 },
          { id: 77, name: "Laptop (not MacBook)", count: 0, totalRevenue: 0 },
          { id: 79, name: "iMac", count: 0, totalRevenue: 0 },
          { id: 82, name: "Lyca SIM", count: 0, totalRevenue: 0 },
          { id: 85, name: "Selfie Stick", count: 0, totalRevenue: 0 },
          { id: 87, name: "OTG", count: 0, totalRevenue: 0 },
          { id: 89, name: "Pilas", count: 0, totalRevenue: 0 },
          { id: 91, name: "Soporte", count: 0, totalRevenue: 0 },
          { id: 93, name: "SD Card", count: 0, totalRevenue: 0 },
          { id: 95, name: "Dryer", count: 0, totalRevenue: 0 },
          { id: 97, name: "Plancha", count: 0, totalRevenue: 0 },
          { id: 99, name: "Mando", count: 0, totalRevenue: 0 },
          { id: 101, name: "Trimmer", count: 0, totalRevenue: 0 },
          { id: 103, name: "Cannabis", count: 0, totalRevenue: 0 },
          { id: 105, name: "Perfumería", count: 0, totalRevenue: 0 }
        ];

        // Process each sale from the filtered list
        filteredSales.forEach(sale => {
          // Get product ID and price, handling both data structures
          const productId = sale.product?.id || sale.attributes?.product?.data?.id;
          const price = parseFloat(sale.Price || sale.attributes?.Price || 0);

          const productStat = stats.find(s => s.id === productId);
          if (productStat) {
            productStat.count += 1;
            productStat.totalRevenue += price;
          }
        });

        // Sort stats by revenue (optional)
        stats.sort((a, b) => b.totalRevenue - a.totalRevenue);

        setProductStats(stats);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [timeFilter]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex' }}>
        <Sidebar />
        <Box sx={{ 
          flexGrow: 1,
          p: 3,
        }}>
          <Typography>Loading stats...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', bgcolor: '#fafafa' }}>
      <Sidebar />
      <Box sx={{ 
        flexGrow: 1,
        p: 4,
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header Section */}
        <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography 
              variant="h4" 
              sx={{ 
                fontSize: '2rem',
                fontWeight: 700,
                color: '#111827',
                letterSpacing: '-0.025em',
                mb: 1,
              }}
            >
              Product Statistics
            </Typography>
            <Typography sx={{ color: '#6B7280', fontSize: '1.1rem' }}>
              Track your product performance and revenue metrics
            </Typography>
          </Box>
          <FormControl sx={{ minWidth: 200 }}>
            <Select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              sx={{
                bgcolor: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#e2e8f0',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#cbd5e1',
                },
              }}
            >
              <MenuItem value="all">All Time</MenuItem>
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="yesterday">Yesterday</MenuItem>
              <MenuItem value="week">Last 7 Days</MenuItem>
              <MenuItem value="month">Last 30 Days</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Revenue Cards */}
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 3,
          mb: 4,
        }}>
          <Box sx={{ 
            p: 4,
            bgcolor: '#fff',
            borderRadius: '16px',
            border: '1px solid #f1f5f9',
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 20px -5px rgba(0,0,0,0.05)',
            }
          }}>
            <Typography sx={{ color: '#64748b', fontSize: '0.875rem', mb: 1 }}>
              Today's Revenue
            </Typography>
            <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a' }}>
              €{todayRevenue.toFixed(2)}
            </Typography>
          </Box>

          <Box sx={{ 
            p: 4,
            bgcolor: '#fff',
            borderRadius: '16px',
            border: '1px solid #f1f5f9',
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 20px -5px rgba(0,0,0,0.05)',
            }
          }}>
            <Typography sx={{ color: '#64748b', fontSize: '0.875rem', mb: 1 }}>
              Yesterday's Revenue
            </Typography>
            <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a' }}>
              €{yesterdayRevenue.toFixed(2)}
            </Typography>
          </Box>

          <Box sx={{ 
            p: 4,
            bgcolor: '#fff',
            borderRadius: '16px',
            border: '1px solid #f1f5f9',
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 20px -5px rgba(0,0,0,0.05)',
            }
          }}>
            <Typography sx={{ color: '#64748b', fontSize: '0.875rem', mb: 1 }}>
              Total Revenue
            </Typography>
            <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a' }}>
              €{totalRevenue.toFixed(2)}
            </Typography>
          </Box>
        </Box>

        {/* Products Table */}
        <Box sx={{ 
          bgcolor: '#fff',
          borderRadius: '16px',
          border: '1px solid #f1f5f9',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <TableContainer sx={{ flexGrow: 1, overflow: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ 
                    bgcolor: '#fff',
                    borderBottom: '2px solid #f1f5f9',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#64748b',
                    py: 3,
                  }}>
                    Product Name
                  </TableCell>
                  <TableCell 
                    align="right"
                    sx={{ 
                      bgcolor: '#fff',
                      borderBottom: '2px solid #f1f5f9',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#64748b',
                      py: 3,
                    }}
                  >
                    Total Sales
                  </TableCell>
                  <TableCell 
                    align="right"
                    sx={{ 
                      bgcolor: '#fff',
                      borderBottom: '2px solid #f1f5f9',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#64748b',
                      py: 3,
                    }}
                  >
                    Total Rev.
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productStats.map((stat) => (
                  <TableRow 
                    key={stat.id}
                    sx={{ 
                      '&:hover': { bgcolor: '#fafafa' },
                      transition: 'background-color 0.2s ease',
                    }}
                  >
                    <TableCell sx={{ py: 3, fontSize: '0.9375rem', color: '#334155' }}>
                      {stat.name}
                    </TableCell>
                    <TableCell 
                      align="right"
                      sx={{ py: 3, fontSize: '0.9375rem', color: '#334155' }}
                    >
                      {stat.count}
                    </TableCell>
                    <TableCell 
                      align="right"
                      sx={{ py: 3, fontSize: '0.9375rem', fontWeight: 600, color: '#334155' }}
                    >
                      €{stat.totalRevenue.toFixed(2)}
                    </TableCell>
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
