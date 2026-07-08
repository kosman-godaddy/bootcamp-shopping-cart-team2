import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Typography, Button, Box, Divider, Stack, Snackbar, Alert,
  TextField, RadioGroup, FormControlLabel, Radio, FormLabel, FormControl, Paper,
} from '@mui/material';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CartItem from './CartItem';

function Cart() {
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackOpen, setSnackOpen] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', payment: 'card' });

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

  const handleCheckout = () => {
    setCheckingOut(true);
  };

  const handlePlaceOrder = async () => {
    await Promise.all(items.map((item) =>
      fetch(`http://localhost:8000/v1/cartitems/${item.id}`, { method: 'DELETE' })
    ));
    setItems([]);
    setCheckingOut(false);
    setSnackOpen(true);
  };

  const total = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  if (loading) return null;

  if (checkingOut) {
    return (
      <Box>
        <Snackbar
          open={snackOpen}
          autoHideDuration={4000}
          onClose={() => setSnackOpen(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="success" onClose={() => setSnackOpen(false)} sx={{ width: '100%' }}>
            Order placed — Thank you, have a good day!
          </Alert>
        </Snackbar>

        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #e0e0e0' }}>
          <Button
            variant="text"
            startIcon={<ArrowBackIcon />}
            size="small"
            onClick={() => setCheckingOut(false)}
            sx={{ mb: 3, pl: 0 }}
          >
            Back to Cart
          </Button>

          <Typography variant="h5" fontWeight={700} gutterBottom>
            Place Order
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Order total: <strong>${total.toFixed(2)}</strong>
          </Typography>

          <Stack spacing={3}>
            <TextField
              label="Full Name"
              variant="outlined"
              fullWidth
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <TextField
              label="Email Address"
              variant="outlined"
              fullWidth
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <TextField
              label="Phone Number"
              variant="outlined"
              fullWidth
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

            <FormControl>
              <FormLabel sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}>
                Payment Method
              </FormLabel>
              <RadioGroup
                value={form.payment}
                onChange={(e) => setForm({ ...form, payment: e.target.value })}
              >
                <FormControlLabel value="card" control={<Radio />} label="Credit / Debit Card" />
                <FormControlLabel value="paypal" control={<Radio />} label="PayPal" />
              </RadioGroup>
            </FormControl>
          </Stack>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              size="large"
              disableElevation
              onClick={handlePlaceOrder}
              sx={{ px: 6 }}
            >
              Place Order
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

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
