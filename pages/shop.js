import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import ShopItemList from '../components/ShopItemList';
import { Container, Typography, Button, Box, TextField, InputAdornment } from '@mui/material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import SearchIcon from '@mui/icons-material/Search';
import DarkModeToggle from '../components/DarkModeToggle';

function ShopPage() { // main shop page, displays hearts for favorited items -Nyla
  const [searchQuery, setSearchQuery] = useState(''); // tracks what the user types in the search bar - Ahmed

  return <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
    <Box sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', py: 2 }}>
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" color="text.primary" sx={{ display: 'flex', alignItems: 'center', fontSize: '2rem', fontFamily: "'Fredoka One', cursive" }}>
          D<span style={{ fontSize: '1.4em', lineHeight: 1 }}>🍩</span>mains
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Link href="/favorites" passHref>
            <Button variant="outlined" startIcon={<FavoriteBorderIcon />} size="small">
              Favorites
            </Button>
          </Link>
          <Link href="/order-history" passHref>
            <Button variant="outlined" startIcon={<ReceiptLongIcon />} size="small">
              Order History
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
      {/* search bar row — flex so a filter button can be added next to it later - Ahmed */}
      <Container maxWidth="lg" sx={{ mt: 2, display: 'flex', gap: 1 }}>
        {/* search input field - Ahmed */}
        <TextField
          size="small"
          sx={{ flex: 1, maxWidth: '95.3%', bgcolor: 'background.default', borderRadius: 1 }}
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </Container>
    </Box>
    <Container maxWidth="lg" sx={{ py: 4, flex: 1, display: 'flex', alignItems: 'center' }}>
      <Head title="Shop" />
      <ShopItemList searchQuery={searchQuery} />
    </Container>
  </Box>
};

export default ShopPage;