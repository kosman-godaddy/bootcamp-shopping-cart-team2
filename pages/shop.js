import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import ShopItemList from '../components/ShopItemList';
import { Container, Typography, Button, Box, Divider } from '@mui/material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DarkModeToggle from '../components/DarkModeToggle';

function ShopPage  () { // main shop page, displays hearts for favorited items -Nyla
  return <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
    <Box sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', py: 2 }}>
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight={700} color="text.primary">
          My Shop
        </Typography> 
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Link href="/favorites" passHref>
            <Button variant="outlined" startIcon={<FavoriteBorderIcon />} size="small">
              Favorites
            </Button>
          </Link>
          <Link href="/cart" passHref>
            <Button variant="outlined" startIcon={<ShoppingCartOutlinedIcon />} size="small">
              View Cart
            </Button>
          </Link>
          <DarkModeToggle />
        </Box>
      </Container>
    </Box>
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Head title="Shop" />
      <ShopItemList />
    </Container>
  </Box>
};

export default ShopPage;