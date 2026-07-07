import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Grid, Typography, Button } from '@mui/material';
import CartItem from './CartItem';

function Cart() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    const response = await fetch('http://localhost:8000/v1/cartitems');
    const data = await response.json();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleRemove = async (id) => {
    await fetch(`http://localhost:8000/v1/cartitems/${id}`, {
      method: 'DELETE',
    });
    fetchItems();
  };

  const handleUpdateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;
    await fetch(`http://localhost:8000/v1/cartitems/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: newQuantity }),
    });
    fetchItems();
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading) {
    return null;
  }

  if (items.length === 0) {
    return (
      <div style={{ marginTop: '48px', textAlign: 'center' }}>
        <Typography variant="h5" style={{ color: 'white', marginBottom: '16px' }}>
          Your cart is empty
        </Typography>
        <Link href="/shop" passHref>
          <Button variant="contained">Browse the Shop</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <Grid container direction="column" spacing={2}>
        {items.map((item) => (
          <Grid item key={item.id}>
            <CartItem
              item={item}
              onRemove={handleRemove}
              onUpdateQuantity={handleUpdateQuantity}
            />
          </Grid>
        ))}
      </Grid>
      <div style={{ marginTop: '24px', textAlign: 'right' }}>
        <Typography variant="h4" style={{ color: 'white' }}>
          Total: ${total.toFixed(2)}
        </Typography>
      </div>
    </>
  );
}

export default Cart;