import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogActions, 
  Button, 
  Box, 
  Typography 
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const colors = {
  textPrimary: 'hsl(222.2 47.4% 11.2%)',
  textSecondary: 'hsl(215.4 16.3% 46.9%)',
  border: 'hsl(240 5.9% 90%)',
  success: 'hsl(142.1 76.2% 36.3%)',
  successBg: 'hsl(142.1 76.2% 95%)',
  primaryButtonBg: 'hsl(221.2 83.2% 53.3%)',
  primaryButtonHoverBg: 'hsl(221.2 83.2% 48%)',
  secondaryButtonBorder: 'hsl(240 5.9% 90%)',
  secondaryButtonHoverBg: 'hsl(210 40% 98%)',
};

function SuccessModal({ open, onClose, onPrintInvoice }) {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: '8px',
          border: `1px solid ${colors.border}`,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        }
      }}
    >
      <DialogContent sx={{ 
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minWidth: '350px',
        textAlign: 'center',
      }}>
        <Box sx={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: colors.successBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2.5,
        }}>
          <CheckCircleOutlineIcon sx={{ fontSize: 32, color: colors.success }} />
        </Box>
        
        <Typography 
          variant="h6" 
          component="h3" 
          sx={{
            mb: 1,
            fontWeight: '600',
            color: colors.textPrimary,
            fontFamily: 'system-ui',
            letterSpacing: '-0.01em',
          }}
        >
          Sale Completed
        </Typography>
        
        <Typography 
          variant="body2" 
          sx={{
            color: colors.textSecondary,
            fontFamily: 'system-ui',
          }}
        >
          The sale has been successfully processed.
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ 
        p: 3,
        pt: 0,
        display: 'flex',
        gap: 1.5,
      }}>
        <Button 
          onClick={onClose}
          fullWidth
          variant="outlined"
          sx={{
            textTransform: 'none',
            fontWeight: '500',
            color: colors.textSecondary,
            borderColor: colors.secondaryButtonBorder,
            fontFamily: 'system-ui',
            padding: '8px 16px',
            borderRadius: '6px',
            '&:hover': {
              backgroundColor: colors.secondaryButtonHoverBg,
              borderColor: colors.textSecondary,
            }
          }}
        >
          Continue Selling
        </Button>
        
        <Button 
          onClick={onPrintInvoice}
          fullWidth
          variant="contained"
          disableElevation
          sx={{
            textTransform: 'none',
            fontWeight: '500',
            backgroundColor: colors.primaryButtonBg,
            fontFamily: 'system-ui',
            padding: '8px 16px',
            borderRadius: '6px',
            '&:hover': {
              backgroundColor: colors.primaryButtonHoverBg,
            }
          }}
        >
          Print Invoice
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SuccessModal; 