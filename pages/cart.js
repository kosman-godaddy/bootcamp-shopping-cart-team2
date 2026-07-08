import React from 'react';
import Head from '../components/head';
import Link from 'next/link';
import { Container, Typography, Button, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Cart from '../components/Cart';
import CartItem from '../components/CartItem';
import DarkModeToggle from '../components/DarkModeToggle';

export const CartPage = () => (
  <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
    <Box sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', py: 2 }}>
      <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight={700} color="text.primary">
          Your Cart
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DarkModeToggle />
          <Link href="/shop" passHref>
            <Button variant="text" startIcon={<ArrowBackIcon />} size="small">
              Back to Shop
            </Button>
          </Link>
        </Box>
      </Container>
    </Box>
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Head title="Cart" />
      <Cart />
    </Container>
  </Box>
);

export default CartPage;
