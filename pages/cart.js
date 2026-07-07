import React from 'react';
import Head from '../components/head';
import Link from 'next/link';
import { Container, Typography, Button, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Cart from '../components/Cart';

export const CartPage = () => (
  <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
    <Box sx={{ backgroundColor: '#fff', borderBottom: '1px solid #e0e0e0', py: 2 }}>
      <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight={700} color="text.primary">
          Your Cart
        </Typography>
        <Link href="/shop" passHref>
          <Button variant="text" startIcon={<ArrowBackIcon />} size="small">
            Back to Shop
          </Button>
        </Link>
      </Container>
    </Box>
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Head title="Cart" />
      <Cart />
    </Container>
  </Box>
);

export default CartPage;
