import React from 'react';
import { Card, CardContent, CardActions, CardMedia, Snackbar, Alert, Typography, Button, Chip, Box, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useFavorites } from '../context/FavoritesContext';

const productImages = {
  1: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400&h=200&fit=crop', // padlock close-up
  2: 'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=400&h=200&fit=crop', // network nodes / multiple connections
  3: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400&h=200&fit=crop', // globe with glowing web
  4: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=200&fit=crop', // handshake / org
  5: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400&h=200&fit=crop', // modern startup office
};

function ShopItem({ product, onAddToCart }) {
  const image = product.image_url || productImages[product.id];
  const onSale = product.is_on_sale && product.sale_price != null;

  const [toastOpen, setToastOpen] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState('');
  const { toggleFavorite, isFavorited: checkFavorited } = useFavorites();
  const isFavorited = checkFavorited(product.id);

  const handleFavoriteClick = () => {
    toggleFavorite(product);
  };

  const handleAddToCartClick =  async() => {
    console.log('Button clicked!');
    onAddToCart(product);
    setToastMessage(`${product.name} has been added to your cart.`);
    setToastOpen(true);

    setTimeout(() => {
      setToastOpen(false);
    }, 3000);
  };


  return (
    <>
    <Card sx={{
      width: 220,
      m: '12px',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
      transition: 'box-shadow 0.2s, transform 0.2s',
      '&:hover': {
        boxShadow: '0 4px 16px rgba(0,0,0,0.14)',
        transform: 'translateY(-2px)',
      },
    }}>
    <Box sx={{ position: 'relative' }}>
   <CardMedia
    component="img"
    height="160"
    image={image}
    alt={product.name}
    sx={{ objectFit: 'cover', backgroundColor: '#f5f5f5' }}
  />
  {onSale && (
    <Chip
      label="Sale"
      color="error"
      size="small"
      sx={{ position: 'absolute', top: 8, right: 8, fontWeight: 700 }}
    />
  )}
  <IconButton
    onClick={handleFavoriteClick}
    size="small"
    sx={{
      position: 'absolute',
      top: 8,
      left: 8,
      backgroundColor: 'rgba(255,255,255,0.85)',
      '&:hover': { backgroundColor: 'rgba(255,255,255,1)' },
    }}
  >
    {isFavorited ? (
      <FavoriteIcon fontSize="small" sx={{ color: '#e53935' }} />
    ) : (
      <FavoriteBorderIcon fontSize="small" sx={{ color: '#666' }} />
    )}
  </IconButton>
  </Box>

      <CardContent sx={{ flexGrow: 1, pb: 0 }}>
        <Typography variant="subtitle1" fontWeight={600} noWrap gutterBottom>
          {product.name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: 40,
            mb: 1,
          }}
        >
          {product.description}
        </Typography>

        {onSale ? (
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
            <Typography variant="h6" fontWeight={700} color="text.primary">
              ${Number(product.sale_price).toFixed(2)}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
              ${Number(product.price).toFixed(2)}
            </Typography>
          </Box>
        ) : (
          <Typography variant="h6" fontWeight={700} color="text.primary">
            ${Number(product.price).toFixed(2)}
          </Typography>
        )}
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2, pt: 1 }}>
        <Button
          onClick={handleAddToCartClick}
          variant="contained"
          fullWidth
          size="small"
          disableElevation
        >
          Add to Cart
        </Button>
      </CardActions>
    </Card>

    
    <Snackbar
      open={toastOpen}
      autoHideDuration={3000}
      onClose={() => setToastOpen(false)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={() => setToastOpen(false)} severity="success" sx={{ width: '100%' }}>
        {toastMessage}
      </Alert>
    </Snackbar>
  </>
);
}


export default ShopItem;