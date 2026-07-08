import React from 'react';
import Head from '../components/head';
import Link from 'next/link';
import { Container, Typography, Box, Button, Grid } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShopItem from '../components/ShopItem';
import { useFavorites } from '../context/FavoritesContext';

export const FavoritePage = () => {
  const { favorites } = useFavorites();

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Box sx={{ backgroundColor: '#fff', borderBottom: '1px solid #e0e0e0', py: 2 }}>
        <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" fontWeight={700} color="text.primary">
            My Favorites
          </Typography>
          <Link href="/shop" passHref>
            <Button variant="outlined" startIcon={<ArrowBackIcon />} size="small">
              Back to Shop
            </Button>
          </Link>
        </Container>
      </Box>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Head title="Favorites" />
        {favorites.length === 0 ? (
          <Typography color="text.secondary">No favorites yet — go heart something!</Typography>
        ) : (
          <Grid container>
            {favorites.map((product) => (
              <ShopItem key={product.id} product={product} onAddToCart={() => {}} />
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default FavoritePage;