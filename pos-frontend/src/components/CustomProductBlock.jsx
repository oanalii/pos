import React, { useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Typography
} from '@mui/material';

function CustomProductBlock({ onAddToCart }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const handleAdd = () => {
    if (!name || !price) return;

    const customProduct = {
      id: 11,  // Custom product ID
      Product: name,
      price: parseFloat(price)
    };

    onAddToCart({
      product: customProduct,
      price: parseFloat(price)
    });

    // Clear fields after adding
    setName('');
    setPrice('');
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#f8fafc',
        border: '2px dashed #94a3b8',
        '&:hover': {
          borderColor: '#64748b'
        }
      }}
    >
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h6" gutterBottom>
          Custom Product
        </Typography>

        <TextField
          fullWidth
          label="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          size="small"
        />

        <TextField
          fullWidth
          label="Price (€)"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          size="small"
          inputProps={{ step: "0.01" }}
        />

        <Box sx={{ mt: 'auto' }}>
          <Button 
            fullWidth 
            variant="contained" 
            onClick={handleAdd}
            disabled={!name || !price}
          >
            Add to Cart
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default CustomProductBlock; 