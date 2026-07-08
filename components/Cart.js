import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  Typography, Button, Box, Divider, Stack, Snackbar, Alert,
  TextField, RadioGroup, FormControlLabel, Radio, FormLabel, FormControl, Paper,
  LinearProgress,
} from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer'; // tag icon shown inside the progress bar banner
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CartItem from './CartItem';

const DISCOUNT_THRESHOLD = 200; // the cart subtotal (in $) the user must reach to unlock 50% off
const DISCOUNT_RATE = 0.5;      // the fraction taken off the subtotal once the threshold is met

function Cart() {
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackOpen, setSnackOpen] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', payment: 'card' });  // Personal information form state

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

  const fireConfetti = () => { // Function to fire confetti animation - Ian
    const duration = 3000;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0 } });
      confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 } });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  };

  const handlePlaceOrder = async () => {
    await Promise.all(items.map((item) =>
      fetch(`http://localhost:8000/v1/cartitems/${item.id}`, { method: 'DELETE' })
    ));
    setItems([]);
    setCheckingOut(false);
    setSnackOpen(true); //Stay on shop page and show snackbar notification after order is placed - Ian
    fireConfetti(); //confetti animation after order is placed - Ian
  };

  const subtotal = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0); // sum of all item prices × their quantities before any discount
  const discountUnlocked = subtotal >= DISCOUNT_THRESHOLD; // true once the cart hits $200 — flips the bar green and halves the total
  const total = discountUnlocked ? subtotal * (1 - DISCOUNT_RATE) : subtotal; // final price shown to the user: half the subtotal if discount is active, otherwise unchanged
  const progressPct = Math.min((subtotal / DISCOUNT_THRESHOLD) * 100, 100); // 0–100 value that drives the LinearProgress bar fill; capped at 100 so it never overflows
  const amountToGo = Math.max(DISCOUNT_THRESHOLD - subtotal, 0); // how many more dollars the user needs to spend; floors at 0 so it never goes negative

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
            Order total:{' '}
            {/* strikethrough original price shown on the checkout form only when discount is active */}
            {discountUnlocked && (
              <span style={{ textDecoration: 'line-through', marginRight: 6 }}>${subtotal.toFixed(2)}</span>
            )}
            {/* discounted (or regular) total carried through from the cart page */}
            <strong>${total.toFixed(2)}</strong>
            {/* confirmation label so the user knows the 50% was actually applied at checkout */}
            {discountUnlocked && <span style={{ color: 'green', marginLeft: 6 }}>(50% off applied)</span>}
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

          {/* 50% off progress bar — whole banner turns green when the discount is unlocked */}
          <Box sx={{ mb: 3, p: 2, borderRadius: 2, bgcolor: discountUnlocked ? 'success.light' : 'action.hover' }}>

            {/* header row: tag icon + dynamic label that switches between "X more to go" and "unlocked!" */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <LocalOfferIcon sx={{ fontSize: 18, color: discountUnlocked ? 'success.dark' : 'text.secondary' }} />
              <Typography variant="body2" fontWeight={600} color={discountUnlocked ? 'success.dark' : 'text.primary'}>
                {discountUnlocked
                  ? '50% off unlocked!'
                  : `Spend $${amountToGo.toFixed(2)} more to get 50% off your order`}
              </Typography>
            </Box>

            {/* the actual progress bar — "determinate" means we control the fill with the value prop */}
            {/* bar color switches from primary (blue) to success (green) once the threshold is hit */}
            <LinearProgress
              variant="determinate"
              value={progressPct}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: 'action.disabledBackground',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  bgcolor: discountUnlocked ? 'success.main' : 'primary.main',
                },
              }}
            />

            {/* small labels below the bar showing current subtotal on the left and the $200 goal on the right */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
              <Typography variant="caption" color="text.secondary">${subtotal.toFixed(2)}</Typography>
              <Typography variant="caption" color="text.secondary">$200.00</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 3 }}>
            <Typography variant="h6" color="text.secondary">
              Total
            </Typography>
            <Box sx={{ textAlign: 'right' }}>
              {/* strikethrough of the original subtotal — only visible after the discount is unlocked */}
              {discountUnlocked && (
                <Typography variant="body2" color="text.disabled" sx={{ textDecoration: 'line-through' }}>
                  ${subtotal.toFixed(2)}
                </Typography>
              )}
              {/* final total — turns green and appends "(50% off)" label when discount is active */}
              <Typography variant="h5" fontWeight={700} color={discountUnlocked ? 'success.dark' : 'text.primary'}>
                ${total.toFixed(2)}
                {discountUnlocked && (
                  <Typography component="span" variant="body2" fontWeight={600} color="success.dark" sx={{ ml: 1 }}>
                    (50% off)
                  </Typography>
                )}
              </Typography>
            </Box>
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
