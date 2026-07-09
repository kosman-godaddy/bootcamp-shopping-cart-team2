import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Typography,
  Button,
  Box,
  Divider,
  Stack,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Paper,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
} from '@mui/material';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import CartItem from './CartItem';

const promoCodes = [
  {
    code: 'SAVE10',
    label: 'SAVE10 — 10% off',
    type: 'percent',
    value: 0.1,
  },
  {
    code: 'WELCOME5',
    label: 'WELCOME5 — $5 off',
    type: 'fixed',
    value: 5,
  },
  {
    code: 'DEAL15',
    label: 'DEAL15 — 15% off',
    type: 'percent',
    value: 0.15,
  },
];

function Cart() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackOpen, setSnackOpen] = useState(false);
 
  const [selectedPromo, setSelectedPromo] = useState(''); // stores current promo code
  const [checkoutTotal, setCheckoutTotal] = useState(null); // // stores final checkout total so success message shows when cart items cleared 

  const fetchItems = async () => {
    const response = await fetch('http://localhost:8000/v1/cartitems');
    const data = await response.json();
    setItems(Array.isArray(data) ? data : data.cartItems ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

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
  const finalTotal = total;

  await Promise.all(
    items.map((item) =>
      fetch(`http://localhost:8000/v1/cartitems/${item.id}`, {
        method: 'DELETE',
      })
    )
  );

  setItems([]);
  setSelectedPromo('');
  setCheckoutTotal(finalTotal);
  setSnackOpen(true);
};
// calculates cart subtotal before discount 
  const subtotal = items.reduce(
  (sum, item) => sum + Number(item.price) * item.quantity,
  0
);

// finds the active promo code object based on the selected promo code
const activePromo = promoCodes.find((promo) => promo.code === selectedPromo);

const discount = activePromo
  ? activePromo.type === 'percent'
    ? subtotal * activePromo.value
    : Math.min(activePromo.value, subtotal)
  : 0;
// calculates total after discount, ensuring it doesn't go below zero
const total = Math.max(subtotal - discount, 0);

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
          Order placed for ${(checkoutTotal ?? total).toFixed(2)} — Thank you, have a good day!
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
          <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 2,
        mb: 3,
      }}
    >
      <Typography variant="h6" fontWeight={700}>
        Cart Items
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: 2,
          minWidth: 280,
          border: '1px solid #e0e0e0',
          borderRadius: 2,
          backgroundColor: '#fff',
        }}
      >
        <FormControl fullWidth size="small">
          <InputLabel id="promo-code-label">Promo Code</InputLabel>

          <Select
            labelId="promo-code-label"
            value={selectedPromo}
            label="Promo Code"
            onChange={(event) => setSelectedPromo(event.target.value)}
          >
            <MenuItem value="">No promo code</MenuItem>

            {promoCodes.map((promo) => (
              <MenuItem key={promo.code} value={promo.code}>
                {promo.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        // 
        {activePromo && (
          <Typography variant="body2" color="success.main" sx={{ mt: 1.5 }}>
            {activePromo.code} applied — You saved ${discount.toFixed(2)}
          </Typography>
        )}
      </Paper>
    </Box>

          <Stack spacing={2}>
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={handleRemove}
                onUpdateQuantity={handleUpdateQuantity}
              />
            ))}
          </Stack>
          <Divider sx={{ my: 3 }} />
          <Box
  sx={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 1,
  }}
>
  <Box sx={{ display: 'flex', gap: 3 }}>
    <Typography variant="body1" color="text.secondary">
      Subtotal
    </Typography>

    <Typography variant="body1" color="text.primary">
      ${subtotal.toFixed(2)}
    </Typography>
  </Box>

  {activePromo && (
    <Box sx={{ display: 'flex', gap: 3 }}>
      <Typography variant="body1" color="success.main">
        Discount ({activePromo.code})
      </Typography>

      <Typography variant="body1" color="success.main">
        -${discount.toFixed(2)}
      </Typography>
    </Box>
  )}

  <Box sx={{ display: 'flex', gap: 3 }}>
    <Typography variant="h6" color="text.secondary">
      Total
    </Typography>

    <Typography variant="h5" fontWeight={700} color="text.primary">
      ${total.toFixed(2)}
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
