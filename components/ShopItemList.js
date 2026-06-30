import React, { useState, useEffect } from 'react';
import { Grid } from '@mui/material'
import { useRouter } from 'next/router'
import ShopItem from './ShopItem';

function ShoppingItemList() {

  // this is the state we will use to hold the response from the api
  const [products, setProducts] = useState([]);
  const router = useRouter()

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('http://localhost:8000/v1/products');
      const data = await response.json();
      setProducts(data);
    };
    fetchProducts();
  }, [])

  const handleAddToCart = async (product) => {
    await fetch('http://localhost:8000/v1/cartitems', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: product.name, price: product.price, quantity: 1 })
    });
    router.push('/cart');
  }

  return (
    <Grid container direction="row" spacing={1}>
      {products.map((product) => (
        <ShopItem key={product.id} product={product} onAddToCart={handleAddToCart} />
      ))}
    </Grid>
  )
}
export default ShoppingItemList;