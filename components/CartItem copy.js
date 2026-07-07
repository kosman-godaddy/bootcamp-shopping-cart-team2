import React from 'react';
import { Card, Typography, Button } from '@mui/material';

function CartItem({ item, onRemove, onUpdateQuantity }) {
  return (
    <Card style={{
      width: "100%",
      padding: "16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }}>
      <div style={{ minWidth: "150px" }}>
        <Typography variant="h6">{item.name}</Typography>
        <Typography variant="body2">${item.price}</Typography>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Button size="small" variant="outlined" onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>−</Button>
        <Typography variant="body2">Qty: {item.quantity}</Typography>
        <Button size="small" variant="outlined" onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>+</Button>
      </div>

      <Button onClick={() => onRemove(item.id)} color="error" variant="outlined">Remove</Button>
    </Card>
  );
}

export default CartItem;