import React from 'react';
import { Card, CardContent, CardActions, Typography, Button } from '@mui/material'

function ShopItem({product, onAddToCart}) {

  const addToCart = () => {
    onAddToCart(product);
  }

  const images = {
    1: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Ohio_State_Buckeyes_logo.svg',
    2: 'https://example.com/wildcard.png',
    3: 'https://example.com/dotcom.png',
    4: 'https://example.com/dotorg.png',
    5: 'https://example.com/dotco.png',
};

  return (
    <Card style={{height: "300px", width: "200px", margin: "20px"}}>
      <img src={product.image_url || images[product.id]} alt={product.name} width="50%" />
    <CardContent>
      <Typography variant="h6">{product.name}</Typography>
      <Typography variant="body2">{product.description}</Typography>
      <Typography variant="h6">${product.price.toFixed(2)}</Typography>
    </CardContent>
      <CardActions>
        <Button onClick={addToCart} variant="contained" color="primary">
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  );
}

export default ShopItem;