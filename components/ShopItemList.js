import React, { useState, useEffect } from 'react';
import { Grid } from '@mui/material'
import ShopItem from './ShopItem';

function ShoppingItemList({ searchQuery = '', sortBy = 'default', priceRange = 'all', statusFilter = 'all', filterCategory = 'all', onCategoriesLoaded }) {

  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  const fetchData = async () => {
    const [productRes, cartRes] = await Promise.all([
      fetch('http://localhost:8000/v1/products'),
      fetch('http://localhost:8000/v1/cartitems'),
    ]);
    const productData = await productRes.json();
    const cartData = await cartRes.json();
    const list = Array.isArray(productData) ? productData : productData.products ?? [];
    setProducts(list);
    setCartItems(Array.isArray(cartData) ? cartData : []);
    const cats = [...new Set(list.map((p) => p.category).filter(Boolean))].sort();
    onCategoriesLoaded?.(cats);
  };

  useEffect(() => { fetchData(); }, []);

  // Upserts the product into the cart: increments quantity if already present, otherwise creates a new cart item -Ian
  const handleAddToCart = async (product) => {
    const existing = cartItems.find((item) => item.name === product.name);
    const currentQty = existing ? existing.quantity : 0;
    if (product.stock != null && currentQty >= product.stock) return;
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
          // Store the active price (sale or regular) so the cart total reflects the discount at the time of add -Ian
          price: product.is_on_sale && product.sale_price != null ? product.sale_price : product.price,
          original_price: product.is_on_sale && product.sale_price != null ? product.price : null,
          quantity: 1,
        }),
      });
    }
    await fetchData();
  };

  // Decrements by one; removes the cart item entirely when quantity would drop to zero -Ian
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

  // Orphaned "Cool Test Item" cart entries (IDs 39–48) cleared via DELETE — those were leftover test data -Ian
  const getCartQuantity = (productName) => {
    const item = cartItems.find((ci) => ci.name === productName);
    return item ? item.quantity : 0;
  };

  const filteredProducts = products
    .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((p) => {
      if (filterCategory === 'all') return true;
      // Everyday Thingz: non-serious/non-domain items matched by name -Ian
      if (filterCategory === 'everyday_things') {
        const name = p.name.toLowerCase();
        return name.includes('lambo') || name.includes('donut') || name.includes('burger') || name.includes('in-n-out');
      }
      return p.category === filterCategory;
    })
    .filter((p) => {
      if (statusFilter === 'in_stock') return p.stock > 0;
      if (statusFilter === 'on_sale')  return p.is_on_sale;
      return true;
    })
    .filter((p) => {
      const price = p.is_on_sale && p.sale_price != null ? p.sale_price : p.price;
      if (priceRange === 'under_25') return price < 25;
      if (priceRange === '25_50')    return price >= 25 && price <= 50;
      if (priceRange === '50_100')   return price >= 50 && price <= 100;
      if (priceRange === 'over_100') return price > 100;
      return true;
    })
    .sort((a, b) => {
      const priceA = a.is_on_sale && a.sale_price != null ? a.sale_price : a.price;
      const priceB = b.is_on_sale && b.sale_price != null ? b.sale_price : b.price;
      if (sortBy === 'price_asc')   return priceA - priceB;
      if (sortBy === 'price_desc')  return priceB - priceA;
      if (sortBy === 'name_asc')    return a.name.localeCompare(b.name);
      if (sortBy === 'name_desc')   return b.name.localeCompare(a.name);
      if (sortBy === 'rating_desc') return (b.rating ?? 0) - (a.rating ?? 0);
      return 0;
    });

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
