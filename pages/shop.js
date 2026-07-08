import React from 'react';
import Head from '../components/head';
import Link from 'next/link';
import ShoppingItemList from '../components/ShopItemList';
import { Container, Typography, Button, Box, Divider } from '@mui/material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import ShopItem from '../components/ShopItem';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DarkModeToggle from '../components/DarkModeToggle';

export const ShopPage = () => (
  <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
    <Box sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', py: 2 }}>
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight={700} color="text.primary">
          My Shop
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Link href="/favorites" passHref>
            <Button variant="outlined" startIcon={<FavoriteBorderIcon />} size="small">
              Favorites
            </Button>
          </Link>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DarkModeToggle />
          <Link href="/cart" passHref>
            <Button variant="outlined" startIcon={<ShoppingCartOutlinedIcon />} size="small">
              View Cart
            </Button>
          </Link>
        </Box>
      </Container>
    </Box>
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Head title="Shop" />
      <ShoppingItemList />
    </Container>
  </Box>
);

export default ShopPage;