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
  CircularProgress,
} from '@mui/material';

function ProductStats() {
  const [productStats, setProductStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [yesterdayRevenue, setYesterdayRevenue] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [timeFilter, setTimeFilter] = useState('daily');
  const storeId = Number(localStorage.getItem('storeId'));

  // Function to calculate date ranges based on time filter
  const getDateRange = (filter) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(today);
    const endDate = new Date(today);
    endDate.setHours(23, 59, 59, 999);
    
    switch (filter) {
      case 'daily':
        // Today
        return {
          start: today.toISOString(),
          end: endDate.toISOString()
        };
      case 'weekly':
        // Last 7 days
        startDate.setDate(today.getDate() - 6); // Include today, so 6 days back
        return {
          start: startDate.toISOString(),
          end: endDate.toISOString()
        };
      case 'monthly':
        // Last 30 days
        startDate.setDate(today.getDate() - 29); // Include today, so 29 days back
        return {
          start: startDate.toISOString(),
          end: endDate.toISOString()
        };
      case 'yearly':
        // Last 365 days
        startDate.setDate(today.getDate() - 364); // Include today, so 364 days back
        return {
          start: startDate.toISOString(),
          end: endDate.toISOString()
        };
      default:
        return {
          start: today.toISOString(),
          end: endDate.toISOString()
        };
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Get date range based on selected time filter
        const dateRange = getDateRange(timeFilter);
        
        console.log('Fetching sales with date range:', dateRange);
        console.log('Store ID:', storeId);
        
        // Get filtered sales for the selected store
        const filteredSalesResponse = await API.get('/api/sales', {
          params: {
            'filters[Time][$gte]': dateRange.start,
            'filters[Time][$lt]': dateRange.end,
            'filters[store][id][$eq]': storeId,
            'populate': '*', // Use deep population to get all related data
            'pagination[pageSize]': 500 // Ensure we get all sales
          }
        });
        
        console.log('API call params:', {
          'filters[Time][$gte]': dateRange.start,
          'filters[Time][$lt]': dateRange.end,
          'filters[store][id][$eq]': storeId
        });
        
        console.log('Filtered sales response:', filteredSalesResponse);
        const filteredSales = filteredSalesResponse.data.data;
        console.log('Filtered sales:', filteredSales);

        // Calculate total revenue from filtered sales
        const total = filteredSales.reduce((sum, sale) => {
          let price = 0;
          if (sale.attributes) {
            price = parseFloat(sale.attributes.Price || 0);
          } else {
            price = parseFloat(sale.Price || 0);
          }
          console.log(`Sale ${sale.id}: price = ${price}`);
          return sum + price;
        }, 0);
        console.log('Total revenue calculated:', total);
        setTotalRevenue(total);

        // Get today's sales
        const todayRange = getDateRange('daily');
        const todayResponse = await API.get('/api/sales', {
          params: {
            'filters[Time][$gte]': todayRange.start,
            'filters[Time][$lt]': todayRange.end,
            'filters[store][id][$eq]': storeId,
            'populate': '*'
          }
        });
        
        const todaySales = todayResponse.data.data;
        console.log('Today sales count:', todaySales.length);
        
        const todayTotal = todaySales.reduce((sum, sale) => {
          let price = 0;
          if (sale.attributes) {
            price = parseFloat(sale.attributes.Price || 0);
          } else {
            price = parseFloat(sale.Price || 0);
          }
          return sum + price;
        }, 0);
        console.log('Today revenue calculated:', todayTotal);
        setTodayRevenue(todayTotal);

        // Get yesterday's sales
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        const yesterdayEnd = new Date(yesterday);
        yesterdayEnd.setHours(23, 59, 59, 999);

        const yesterdayResponse = await API.get('/api/sales', {
          params: {
            'filters[Time][$gte]': yesterday.toISOString(),
            'filters[Time][$lt]': yesterdayEnd.toISOString(),
            'filters[store][id][$eq]': storeId,
            'populate': '*'
          }
        });

        const yesterdaySales = yesterdayResponse.data.data;
        console.log('Yesterday sales count:', yesterdaySales.length);
        
        const yesterdayTotal = yesterdaySales.reduce((sum, sale) => {
          let price = 0;
          if (sale.attributes) {
            price = parseFloat(sale.attributes.Price || 0);
          } else {
            price = parseFloat(sale.Price || 0);
          }
          return sum + price;
        }, 0);
        console.log('Yesterday revenue calculated:', yesterdayTotal);
        setYesterdayRevenue(yesterdayTotal);

        // Map products to their stats using the ID_MAP from ProductList
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
          { id: 47, name: "Orange SIM", count: 0, totalRevenue: 0 }, // Updated from Lyca SIM to Orange SIM
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
          { id: 105, name: "Perfumería", count: 0, totalRevenue: 0 },
          { id: 107, name: "Maleta", count: 0, totalRevenue: 0 }
        ];

        console.log('Full filtered sales data:', JSON.stringify(filteredSales, null, 2));
        
        // Process each sale from the filtered sales
        filteredSales.forEach(sale => {
          console.log('Raw sale object:', sale);
          
          // Get product ID and price from the Strapi response structure
          let productId = null, price = 0;
          
          // Direct check for product_id in case it's returned directly
          if (sale.product_id) {
            productId = sale.product_id;
          }
          
          if (sale.attributes) {
            // Strapi v4 structure
            const productData = sale.attributes.product?.data;
            
            // Try to get the product ID from the relationship
            if (productData && productData.id) {
              productId = productData.id;
            } 
            // If we can't get the ID from the relationship, try to get it from attributes
            else if (sale.attributes.product && typeof sale.attributes.product === 'number') {
              productId = sale.attributes.product;
            }
            
            price = parseFloat(sale.attributes.Price || 0);
            
            console.log('Strapi v4 structure detected:', { 
              productData, 
              productId, 
              price,
              rawPrice: sale.attributes.Price
            });
          } else {
            // Direct structure (possibly from custom endpoint)
            if (sale.product && typeof sale.product === 'number') {
              productId = sale.product;
            } else if (sale.product && sale.product.id) {
              productId = sale.product.id;
            }
            
            price = parseFloat(sale.Price || 0);
            
            console.log('Direct structure detected:', { 
              productObj: sale.product, 
              productId, 
              price,
              rawPrice: sale.Price
            });
          }
          
          if (!productId) {
            console.error('Could not extract product ID from sale:', sale);
            return;
          }
          
          // Find the product in our stats array
          const productStat = stats.find(s => s.id === productId);
          if (productStat) {
            productStat.count += 1;
            productStat.totalRevenue += price;
            console.log(`Added sale to ${productStat.name}: count=${productStat.count}, revenue=${productStat.totalRevenue}`);
          } else {
            console.warn('Product not found in stats for ID:', productId);
          }
        });

        // Filter out products with no sales
        const activeStats = stats.filter(stat => stat.count > 0);
        
        // Sort stats by revenue
        activeStats.sort((a, b) => b.totalRevenue - a.totalRevenue);

        console.log('Final stats:', activeStats);
        setProductStats(activeStats);
      } catch (error) {
        console.error('Error fetching stats:', error);
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
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh'
        }}>
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="h6" sx={{ color: '#64748b' }}>
            Loading {timeFilter} statistics...
          </Typography>
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
                  console.log('Time filter changed from', timeFilter, 'to', newTimeFilter);
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
