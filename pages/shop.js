import React from 'react';
import Head from '../components/head';
import Link from 'next/link';
import ShoppingItemList from '../components/ShopItemList';

import { Container, Typography } from '@mui/material'

export const ShopPage = () => (
  <Container>
    <Head title='Home'/>
    <div>
      <Typography variant="h3">My Shop</Typography>
    </div>
    <ShoppingItemList/>
    <div>
      <Link href="/cart">View cart</Link>
    </div>
  </Container>
);

export default ShopPage;