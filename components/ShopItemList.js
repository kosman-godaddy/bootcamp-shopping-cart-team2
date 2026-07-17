import React, { useState, useEffect } from 'react';
import { Grid } from '@mui/material'
import ShopItem from './ShopItem';

function ShoppingItemList({ searchQuery = '' }) { // searchQuery comes from the search bar on the shop page - Ahmed

  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  const fetchData = async () => {
    const [productRes, cartRes] = await Promise.all([
      fetch('http://localhost:8000/v1/products'),
      fetch('http://localhost:8000/v1/cartitems'),
    ]);
    const productData = await productRes.json();
    const cartData = await cartRes.json();
    setProducts(Array.isArray(productData) ? productData : productData.products ?? []);
    setCartItems(Array.isArray(cartData) ? cartData : []);
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddToCart = async (product) => {
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
    await fetchData();
  };

  const handleDecrement = async (product) => {
    const existing = cartItems.find((item) => item.name === product.name);
    if (!existing) return;
    if (existing.quantity > 1) {
      await fetch(`http://localhost:8000/v1/cartitems/${existing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: existing.quantity - 1 }),
      });
    } else {
      await fetch(`http://localhost:8000/v1/cartitems/${existing.id}`, { method: 'DELETE' });
    }
    await fetchData();
  };

  const getCartQuantity = (productName) => {
    const item = cartItems.find((ci) => ci.name === productName);
    return item ? item.quantity : 0;
  };

  // only show products whose name contains the search text - Ahmed
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Grid container direction="row" spacing={1} alignItems="flex-start">
      {filteredProducts.map((product) => (
        <ShopItem
          key={product.id}
          product={product}
          onAddToCart={handleAddToCart}
          onDecrement={handleDecrement}
          cartQuantity={getCartQuantity(product.name)}
        />
      ))}
    </Grid>
  );
}
export default ShoppingItemList;
