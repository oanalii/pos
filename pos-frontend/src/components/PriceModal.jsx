import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box
} from '@mui/material';

function PriceModal({ open, onClose, onSubmit, product }) {
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    onSubmit({
      price,
      description,
      product
    });
    setPrice('');
    setDescription('');
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Set Price and Details for {product?.Product}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            autoFocus
            label="Price (€)"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            inputProps={{ step: "0.01" }}
          />
          <TextField
            label="Description (model, details, etc.)"
            multiline
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., iPhone 14 Pro Max 256GB"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          disabled={!price || !description}
          variant="contained"
        >
          Add to Cart
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PriceModal; 