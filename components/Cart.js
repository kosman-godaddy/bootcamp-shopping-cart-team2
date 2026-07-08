import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Typography, Button, Box, Divider, Stack, Snackbar, Alert } from '@mui/material';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import CartItem from './CartItem';

function Cart() {
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackOpen, setSnackOpen] = useState(false);

  const fetchItems = async () => {
    const [cartRes, productRes] = await Promise.all([
      fetch('http://localhost:8000/v1/cartitems'),
      fetch('http://localhost:8000/v1/products'),
    ]);
    const cartData = await cartRes.json();
    const productData = await productRes.json();
    setItems(Array.isArray(cartData) ? cartData : cartData.cartItems ?? []);
    setProducts(Array.isArray(productData) ? productData : productData.products ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const getOriginalPrice = (item) => {
    const product = products.find((p) => p.name === item.name);
    if (product && product.is_on_sale && product.sale_price != null) {
      return product.price;
    }
    return null;
  };

  const handleRemove = async (id) => {
    await fetch(`http://localhost:8000/v1/cartitems/${id}`, { method: 'DELETE' });
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

  const handleCheckout = async () => {
    await Promise.all(items.map((item) =>
      fetch(`http://localhost:8000/v1/cartitems/${item.id}`, { method: 'DELETE' })
    ));
    setItems([]);
    setSnackOpen(true);
  };

  const total = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  if (loading) return null;

  return (
    <Box>
      <Snackbar
        open={snackOpen}
        autoHideDuration={4000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSnackOpen(false)} sx={{ width: '100%' }}>
          Order placed for ${total.toFixed(2)} — Thank you, have a good day!
        </Alert>
      </Snackbar>

      {items.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <ShoppingBagOutlinedIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Your cart is empty
          </Typography>
          <Link href="/shop" passHref>
            <Button variant="contained" disableElevation sx={{ mt: 1 }}>
              Browse the Shop
            </Button>
          </Link>
        </Box>
      ) : (
        <>
          <Stack spacing={2}>
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={{ ...item, original_price: getOriginalPrice(item) }}
                onRemove={handleRemove}
                onUpdateQuantity={handleUpdateQuantity}
              />
            ))}
          </Stack>
          <Divider sx={{ my: 3 }} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 3 }}>
            <Typography variant="h6" color="text.secondary">
              Total
            </Typography>
            <Typography variant="h5" fontWeight={700} color="text.primary">
              ${total.toFixed(2)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="contained"
              size="large"
              disableElevation
              onClick={handleCheckout}
              sx={{ px: 5 }}
            >
              Checkout
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}

export default Cart;
