import React from 'react';
import Head from '../components/head';
import Link from 'next/link';
import ShoppingItemList from '../components/ShopItemList';
import { Container, Typography, Button, Box, Divider } from '@mui/material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

export const ShopPage = () => (
  <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
    <Box sx={{ backgroundColor: '#fff', borderBottom: '1px solid #e0e0e0', py: 2 }}>
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight={700} color="text.primary">
          My Shop
        </Typography>
        <Link href="/cart" passHref>
          <Button variant="outlined" startIcon={<ShoppingCartOutlinedIcon />} size="small">
            View Cart
          </Button>
        </Link>
      </Container>
    </Box>
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Head title="Shop" />
      <ShoppingItemList />
    </Container>
  </Box>
);

export default ShopPage;
