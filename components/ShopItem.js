import React from 'react';
import { Card, CardContent, CardActions, CardMedia, Snackbar, Alert, Typography, Button, Chip, Box, IconButton, Collapse, Divider, Rating } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import InventoryIcon from '@mui/icons-material/Inventory';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useFavorites } from '../context/FavoritesContext';

// Fallback images keyed by product ID — only used when the product has no image_url in the DB -Ian
const productImages = {
  1: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400&h=200&fit=crop', // padlock close-up
  2: 'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=400&h=200&fit=crop', // network nodes / multiple connections
  3: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400&h=200&fit=crop', // globe with glowing web
  4: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=200&fit=crop', // handshake / org
  5: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400&h=200&fit=crop', // modern startup office
};

// Long-form descriptions shown in the collapsible details section; falls back to product.description for any ID not listed here -Ian
const productDetails = {
  1: 'A Domain Validation (DV) SSL certificate that encrypts data between your visitors and your website. Once installed, browsers display a padlock in the address bar and serve your site over HTTPS — signaling to visitors that their connection is secure. Ideal for blogs, small business sites, and personal projects that handle logins or contact forms. Covers a single domain (e.g. example.com) and is typically issued within minutes.',
  2: 'A Wildcard SSL certificate secures your primary domain and an unlimited number of its subdomains (e.g. shop.example.com, mail.example.com, api.example.com) with a single certificate. This eliminates the cost and hassle of buying separate certificates for each subdomain. Perfect for growing businesses with multiple services or staging environments. Uses the same strong encryption as a standard certificate, just with broader coverage.',
  3: 'Register a .com domain — the world\'s most recognized top-level domain (TLD). A .com address is trusted by consumers worldwide and is ideal for businesses, e-commerce, and professional brands. Includes a full year of registration, free WHOIS privacy protection to keep your personal contact info hidden, and DNS management through GoDaddy\'s control panel. Renews annually at the standard rate.',
  4: 'Register a .org domain, widely recognized as the TLD of choice for nonprofits, charities, open-source projects, and community organizations. A .org address signals credibility and public purpose to your audience. Includes a full year of registration, WHOIS privacy, and full DNS control. Renews annually.',
  5: 'Register a .co domain — the rising alternative to .com favored by startups, tech companies, and entrepreneurs worldwide. Short, memorable, and globally understood as a business extension. A .co domain is a strong choice when your preferred .com is taken. Includes a full year of registration, WHOIS privacy protection, and complete DNS management. Currently on sale — a great time to lock in your brand.',
  14: "Warning: may cause overwhelming joy. Glazed to perfection, these Donuts will make your Do'main experience all the better.",
  15: "I know your sick of Ubering from the Hotel to the Office, why not just skip the wait!",
  16: "FREE In-N-Out, Courtesy of Austin & Suzeth",
};

function ShopItem({ product, onAddToCart, onDecrement, cartQuantity = 0 }) {
  // Track whether the "added to cart" toast notification is visible and what message it shows
  const [toastOpen, setToastOpen] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState('');
  const [expanded, setExpanded] = React.useState(false); // Expandable dropdown for product details - Ian

  const { toggleFavorite, isFavorited: checkFavorited } = useFavorites(); //Check if product is favorited - Nyla

  // If no product data was passed in, render nothing to avoid crashes
  if (!product) return null;

  // Use the product's own image URL if it has one, or use productImages above
  const image = product.image_url || productImages[Number(product.id)];

  const onSale = product.is_on_sale && product.sale_price != null;
  const isFavorited = checkFavorited(product.id);

  const rating = product.rating != null ? Number(product.rating) : null;
  // Three-tier color: green ≥4, orange ≥3, red below — grey when no rating exists -Ian
  const ratingColor = rating == null ? '#9e9e9e'
    : rating >= 4   ? '#2e7d32'
    : rating >= 3   ? '#f57c00'
    : '#c62828';

  
  const handleFavoriteClick = () => { // Add/Remove product froom favrites when heart is clicked - Nyla
    toggleFavorite(product);
  };

  const handleAddToCartClick =  async() => { // Notification for adding to cart - Ian
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
      width: 235,
      m: '10px',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
      borderRadius: 2,
      transition: 'box-shadow 0.2s, transform 0.2s',
      '&:hover': {
        boxShadow: '0 6px 20px rgba(0,0,0,0.13)',
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

      <CardContent sx={{ flexGrow: 1, pb: 0, px: 1.75, pt: 1.5 }}>
        <Typography variant="subtitle2" fontWeight={700} noWrap sx={{ mb: 0.5, fontSize: '0.85rem' }}>
          {product.name}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.55,
            mb: rating != null ? 1 : 1.25,
          }}
        >
          {product.description}
        </Typography>

        {/* Color-coded star strip: left-border accent + gradient fade, green ≥4 / orange ≥3 / red below -Ian */}
        {rating != null && (
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            px: 1,
            py: 0.45,
            mb: 1,
            borderRadius: 1.5,
            background: `linear-gradient(90deg, ${ratingColor}18 0%, transparent 100%)`,
            borderLeft: `3px solid ${ratingColor}`,
          }}>
            {/* Filled stars up to rounded rating, faded for the remainder -Ian */}
            <Box sx={{ display: 'flex', gap: 0.2 }}>
              {[1, 2, 3, 4, 5].map(i => (
                <StarRoundedIcon key={i} sx={{ fontSize: 13, color: i <= Math.round(rating) ? ratingColor : ratingColor + '30' }} />
              ))}
            </Box>
            <Typography variant="caption" fontWeight={800} sx={{ color: ratingColor, fontSize: '0.72rem', ml: 0.3, lineHeight: 1 }}>
              {rating.toFixed(1)}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {onSale ? (
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
              <Typography variant="subtitle1" fontWeight={800} color="error.main" sx={{ fontSize: '1rem' }}>
                ${Number(product.sale_price).toFixed(2)}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                ${Number(product.price).toFixed(2)}
              </Typography>
            </Box>
          ) : (
            <Typography variant="subtitle1" fontWeight={800} color="text.primary" sx={{ fontSize: '1rem' }}>
              ${Number(product.price).toFixed(2)}
            </Typography>
          )}
        </Box>
      </CardContent>

      <Divider sx={{ mx: 1.75, mt: 1.25, opacity: 0.5 }} />

      {/* Dropdown toggle button - Ian */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, pt: 0.25, pb: 0.25 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11, userSelect: 'none' }}>Details</Typography>
        <IconButton
          size="small"
          onClick={() => setExpanded(prev => !prev)}
          aria-expanded={expanded}
          aria-label="show more"
          sx={{
            transition: 'transform 0.2s',
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            color: 'text.secondary',
          }}
        >
          <ExpandMoreIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Collapsible details section - Ian */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent sx={{ pt: 1, pb: 1.5 }}>

          {/* Detailed product description - distinct from the brief card summary above */}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1, lineHeight: 1.6, fontSize: 12 }}>
            {productDetails[product.id] || product.description}
          </Typography>

          {/* Category chip - Ian */}
          {product.category && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
              <LocalOfferIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Chip label={product.category} size="small" variant="outlined" sx={{ height: 20, fontSize: 11 }} />
            </Box>
          )}

          {/* Color-coded stock status - Ian */}
          {product.stock != null && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
              <InventoryIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" fontWeight={600} sx={{
                color: product.stock === 0 ? 'error.main' : product.stock <= 5 ? 'warning.main' : 'success.main',
              }}>
                {product.stock === 0 ? 'Out of stock' : product.stock <= 5 ? `Low stock — only ${product.stock} left` : `In stock (${product.stock})`}
              </Typography>
            </Box>
          )}

          {/* Sale savings banner - Ian */}
          {onSale && (
            <Box sx={{ mb: 0.75, p: '4px 8px', backgroundColor: 'rgba(211,47,47,0.08)', borderRadius: 1, border: '1px solid', borderColor: 'error.light' }}>
              <Typography variant="caption" color="error.main" fontWeight={700}>
                Save ${(Number(product.price) - Number(product.sale_price)).toFixed(2)} ({Math.round(((Number(product.price) - Number(product.sale_price)) / Number(product.price)) * 100)}% off)
              </Typography>
            </Box>
          )}

        </CardContent>
      </Collapse>

      <CardActions sx={{ px: 1.75, pb: 1.75, pt: 0.75 }}>
        {cartQuantity === 0 ? (
          <Button
            onClick={handleAddToCartClick}
            variant="contained"
            fullWidth
            size="small"
            disableElevation
          >
            Add to Cart
          </Button>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <IconButton
              size="small"
              onClick={() => onDecrement(product)}
              sx={{ border: '1px solid', borderColor: 'divider' }}
            >
              <RemoveIcon fontSize="small" />
            </IconButton>
            <Typography variant="body2" fontWeight={700}>{cartQuantity}</Typography>
            <IconButton
              size="small"
              onClick={() => onAddToCart(product)}
              sx={{ border: '1px solid', borderColor: 'divider' }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </CardActions>
    </Card>

    
    <Snackbar //Notification for adding to cart - Ian
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