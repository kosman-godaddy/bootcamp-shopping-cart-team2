//actual favorites page, displays all items that have been hearted. Allows you to go back to shop and remove items -Nyla
import React from 'react';
import Head from '../components/head';
import Link from 'next/link';
import { Container, Typography, Box, Button, Grid } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import ShopItem from '../components/ShopItem';
import { useFavorites } from '../context/FavoritesContext';
import DarkModeToggle from '../components/DarkModeToggle';

export const FavoritePage = () => {
  const { favorites } = useFavorites();

  const handleAddToCart = async (product) => {
    const response = await fetch('http://localhost:8000/v1/cartitems');
    const cartItems = await response.json();

    const existing = cartItems.find((item) => item.name === product.name);

    if (existing) {
      await fetch(`http://localhost:8000/v1/cartitems/${existing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: existing.quantity + 1 }),
      });
    } else {
      await fetch('http://localhost:8000/v1/cartitems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: product.name,
          price: product.is_on_sale && product.sale_price != null ? product.sale_price : product.price,
          original_price: product.is_on_sale && product.sale_price != null ? product.price : null,
          quantity: 1,
        }),
      });
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Box sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', py: 2 }}>
        <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" fontWeight={700} color="text.primary">
            My Favorites
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Link href="/shop" passHref>
              <Button variant="outlined" startIcon={<ArrowBackIcon />} size="small">
                Back to Shop
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
        <Head title="Favorites" />
        {favorites.length === 0 ? (
          <Typography color="text.secondary">No favorites yet — go heart something!</Typography>
        ) : (
          <Grid container>
            {favorites.map((product) => (
              <ShopItem key={product.id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default FavoritePage;