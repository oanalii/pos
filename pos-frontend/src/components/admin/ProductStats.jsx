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
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';

function ProductStats() {
  const [productStats, setProductStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [yesterdayRevenue, setYesterdayRevenue] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [timeFilter, setTimeFilter] = useState('daily');

  // Function to calculate date ranges based on time filter
  const getDateRange = (filter) => {
    const today = new Date();
    const startDate = new Date();
    
    switch (filter) {
      case 'daily':
        // Today
        return {
          start: today.toISOString().split('T')[0],
          end: new Date(today.getTime() + 86400000).toISOString().split('T')[0] // Tomorrow
        };
      case 'weekly':
        // Last 7 days
        startDate.setDate(today.getDate() - 7);
        return {
          start: startDate.toISOString().split('T')[0],
          end: new Date(today.getTime() + 86400000).toISOString().split('T')[0] // Tomorrow
        };
      case 'monthly':
        // Last 30 days
        startDate.setDate(today.getDate() - 30);
        return {
          start: startDate.toISOString().split('T')[0],
          end: new Date(today.getTime() + 86400000).toISOString().split('T')[0] // Tomorrow
        };
      case 'yearly':
        // Last 365 days
        startDate.setDate(today.getDate() - 365);
        return {
          start: startDate.toISOString().split('T')[0],
          end: new Date(today.getTime() + 86400000).toISOString().split('T')[0] // Tomorrow
        };
      default:
        return {
          start: today.toISOString().split('T')[0],
          end: new Date(today.getTime() + 86400000).toISOString().split('T')[0] // Tomorrow
        };
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Get date range based on selected time filter
        const dateRange = getDateRange(timeFilter);
        
        // Get filtered sales
        const filteredSalesResponse = await API.get('/api/sales', {
          params: {
            'filters[Time][$gte]': dateRange.start,
            'filters[Time][$lt]': dateRange.end,
            'populate': ['product', 'store']
          }
        });
        const filteredSales = filteredSalesResponse.data.data;

        // Calculate total revenue from filtered sales
        const total = filteredSales.reduce((sum, sale) => 
          sum + parseFloat(sale.Price || 0), 0
        );
        setTotalRevenue(total);

        // Get today's sales
        const todayResponse = await API.get('/api/sales', {
          params: {
            'filters[Time][$gte]': new Date().toISOString().split('T')[0],
            'populate': '*'
          }
        });
        
        const todayTotal = todayResponse.data.data.reduce((sum, sale) => 
          sum + parseFloat(sale.Price || 0), 0
        );
        setTodayRevenue(todayTotal);

        // Get yesterday's sales
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStart = yesterday.toISOString().split('T')[0];
        const yesterdayEnd = new Date().toISOString().split('T')[0];

        const yesterdayResponse = await API.get('/api/sales', {
          params: {
            'filters[Time][$gte]': yesterdayStart,
            'filters[Time][$lt]': yesterdayEnd,
            'populate': '*'
          }
        });

        const yesterdayTotal = yesterdayResponse.data.data.reduce((sum, sale) =>
          sum + parseFloat(sale.Price || 0), 0
        );
        setYesterdayRevenue(yesterdayTotal);

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
          { id: 85, name: "Selfie Stick", count: 0, totalRevenue: 0 }
        ];

        // Process each sale from the filtered sales
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
        <Box sx={{ mb: 5 }}>
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
            <Typography sx={{ color: '#6B7280', fontSize: '1.1rem' }}>
              Track your product performance and revenue metrics
            </Typography>
            <ToggleButtonGroup
              value={timeFilter}
              exclusive
              onChange={(e, newTimeFilter) => {
                if (newTimeFilter !== null) {
                  setTimeFilter(newTimeFilter);
                }
              }}
              aria-label="time filter"
              sx={{ 
                '& .MuiToggleButton-root': {
                  textTransform: 'none',
                  px: 3,
                  py: 1,
                  borderColor: '#e2e8f0',
                  color: '#64748b',
                  '&.Mui-selected': {
                    bgcolor: '#f8fafc',
                    color: '#0f172a',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: '#f1f5f9',
                    }
                  }
                }
              }}
            >
              <ToggleButton value="daily" aria-label="daily">
                Daily
              </ToggleButton>
              <ToggleButton value="weekly" aria-label="weekly">
                Weekly
              </ToggleButton>
              <ToggleButton value="monthly" aria-label="monthly">
                Monthly
              </ToggleButton>
              <ToggleButton value="yearly" aria-label="yearly">
                Yearly
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
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
              {timeFilter === 'daily' ? 'Daily' : 
               timeFilter === 'weekly' ? 'Weekly' : 
               timeFilter === 'monthly' ? 'Monthly' : 'Yearly'} Revenue
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
                    {timeFilter === 'daily' ? 'Daily' : 
                     timeFilter === 'weekly' ? 'Weekly' : 
                     timeFilter === 'monthly' ? 'Monthly' : 'Yearly'} Sales
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
                    {timeFilter === 'daily' ? 'Daily' : 
                     timeFilter === 'weekly' ? 'Weekly' : 
                     timeFilter === 'monthly' ? 'Monthly' : 'Yearly'} Revenue
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
