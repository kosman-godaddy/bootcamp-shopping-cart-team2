import React, { useState, useEffect } from 'react';
import { Grid } from '@mui/material'
import { useRouter } from 'next/router'
import ShopItem from './ShopItem';

function ShoppingItemList() {

  
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
  // fetch current cart items
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
      body: JSON.stringify({ name: product.name, price: product.price, quantity: 1 }),
    });
  }

  router.push('/cart');
};

  return (
    <Grid container direction="row" spacing={1}>
      {products.map((product) => (
        <ShopItem key={product.id} product={product} onAddToCart={handleAddToCart} />
      ))}
    </Grid>
  )
}
export default ShoppingItemList;