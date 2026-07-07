import React from 'react';
import { Card, Typography, Button, Box, IconButton } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

function CartItem({ item, onRemove, onUpdateQuantity }) {
  return (
    <Card sx={{
      p: 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      gap: 2,
    }}>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="subtitle1" fontWeight={600} noWrap>
          {item.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ${Number(item.price).toFixed(2)} each
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <IconButton size="small" onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>
          <RemoveIcon fontSize="small" />
        </IconButton>
        <Typography variant="body1" sx={{ minWidth: 24, textAlign: 'center' }}>
          {item.quantity}
        </Typography>
        <IconButton size="small" onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>

      <Typography variant="subtitle1" fontWeight={600} sx={{ minWidth: 64, textAlign: 'right' }}>
        ${(Number(item.price) * item.quantity).toFixed(2)}
      </Typography>

      <IconButton onClick={() => onRemove(item.id)} color="error" size="small">
        <DeleteOutlineIcon fontSize="small" />
      </IconButton>
    </Card>
  );
}

export default CartItem;
