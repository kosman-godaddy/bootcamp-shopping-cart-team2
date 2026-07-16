import React, { useState, useEffect } from 'react';
import { Grid } from '@mui/material'
import ShopItem from './ShopItem';

function ShoppingItemList({ searchQuery = '' }) {

  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('http://localhost:8000/v1/products');
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : data.products ?? []);
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
      body: JSON.stringify({
          name: product.name,
          price: product.is_on_sale && product.sale_price != null ? product.sale_price : product.price,
          original_price: product.is_on_sale && product.sale_price != null ? product.price : null,
          quantity: 1,
        }),
    });
  }

};

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Grid container direction="row" spacing={1}>
      {filteredProducts.map((product) => (
        <ShopItem key={product.id} product={product} onAddToCart={handleAddToCart} />
      ))}
    </Grid>
  )
}
export default ShoppingItemList;