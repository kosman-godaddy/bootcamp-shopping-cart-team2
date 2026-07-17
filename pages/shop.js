import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import ShopItemList from '../components/ShopItemList';
import { Container, Typography, Button, Box, TextField, InputAdornment, Select, MenuItem, FormControl, InputLabel, Popover } from '@mui/material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DarkModeToggle from '../components/DarkModeToggle';

function ShopPage() { // main shop page, displays hearts for favorited items -Nyla
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [availableCategories, setAvailableCategories] = useState([]);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);

  const activeFilterCount = [
    sortBy !== 'default',
    priceRange !== 'all',
    statusFilter !== 'all',
    filterCategory !== 'all',
  ].filter(Boolean).length;

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
          <Link href="/admin" passHref>
            <Button variant="outlined" startIcon={<AdminPanelSettingsIcon />} size="small">
              Admin
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
      <Container maxWidth="lg" sx={{ mt: 2, display: 'flex', gap: 1 }}>
        <TextField
          size="small"
          sx={{ flex: 1, bgcolor: 'background.default', borderRadius: 1 }}
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
        <Button
          variant="outlined"
          startIcon={<TuneIcon />}
          size="small"
          onClick={(e) => setFilterAnchorEl(e.currentTarget)}
        >
          Filters{activeFilterCount > 0 ? ` · ${activeFilterCount}` : ''}
        </Button>
        <Popover
          open={Boolean(filterAnchorEl)}
          anchorEl={filterAnchorEl}
          onClose={() => setFilterAnchorEl(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 220 }}>
            <FormControl size="small" fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} label="Sort By">
                <MenuItem value="default">Default</MenuItem>
                <MenuItem value="price_asc">Price: Low → High</MenuItem>
                <MenuItem value="price_desc">Price: High → Low</MenuItem>
                <MenuItem value="name_asc">Name: A → Z</MenuItem>
                <MenuItem value="name_desc">Name: Z → A</MenuItem>
                <MenuItem value="rating_desc">Rating: High → Low</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" fullWidth>
              <InputLabel>Price Range</InputLabel>
              <Select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} label="Price Range">
                <MenuItem value="all">All Prices</MenuItem>
                <MenuItem value="under_25">Under $25</MenuItem>
                <MenuItem value="25_50">$25 – $50</MenuItem>
                <MenuItem value="50_100">$50 – $100</MenuItem>
                <MenuItem value="over_100">$100+</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" fullWidth>
              <InputLabel>Status</InputLabel>
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="in_stock">In Stock Only</MenuItem>
                <MenuItem value="on_sale">On Sale</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" fullWidth>
              <InputLabel>Category</InputLabel>
              {/* category filter: All first, then Everyday Thingz, then any API-driven categories -Ian */}
              <Select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} label="Category">
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="everyday_things">Everyday Thingz</MenuItem>
                {availableCategories.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
            {activeFilterCount > 0 && (
              <Button size="small" onClick={() => {
                setSortBy('default'); setPriceRange('all');
                setStatusFilter('all'); setFilterCategory('all');
              }}>
                Clear All
              </Button>
            )}
          </Box>
        </Popover>
      </Container>
    </Box>
    <Container maxWidth="lg" sx={{ py: 4, flex: 1, display: 'flex', alignItems: 'center' }}>
      <Head title="Shop" />
      <ShopItemList
        searchQuery={searchQuery}
        sortBy={sortBy}
        priceRange={priceRange}
        statusFilter={statusFilter}
        filterCategory={filterCategory}
        onCategoriesLoaded={setAvailableCategories}
      />
    </Container>
  </Box>
};

export default ShopPage;