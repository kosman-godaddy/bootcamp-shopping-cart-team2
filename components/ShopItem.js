import React from 'react';
import { Card, CardContent, CardActions, Typography, Button } from '@mui/material'

function ShopItem({product, onAddToCart}) {

  const addToCart = () => {
    onAddToCart(product);
  }

  return (
    <Card style={{height: "400px"}}>
      {product.image_url && <img src={product.image_url} alt={product.name} width="100%" />}
    <CardContent>
      <Typography variant="h6">{product.name}</Typography>
      <Typography>{product.description}</Typography>
      <Typography>${product.price}</Typography>
    </CardContent>
      <CardActions>
        <Button onClick={addToCart}>Add to Cart</Button>
      </CardActions>
    </Card>
  );
}

export default ShopItem;