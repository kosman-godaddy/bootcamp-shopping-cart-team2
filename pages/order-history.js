import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Box, Container, Typography, Button, Card, CardContent,
  Divider, Chip, Stack
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import DarkModeToggle from '../components/DarkModeToggle';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/v1/orders')
      .then((res) => res.json())
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Box sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', py: 2 }}>
        <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/shop" passHref>
            <Button startIcon={<ArrowBackIcon />} variant="text" size="small">
              Back to Shop
            </Button>
          </Link>
          <Typography variant="h6" fontWeight={700} color="text.primary">
            Order History
          </Typography>
          <DarkModeToggle />
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: 4 }}>
        {loading ? null : orders.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <ReceiptLongIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No orders yet
            </Typography>
            <Link href="/shop" passHref>
              <Button variant="contained" disableElevation sx={{ mt: 1 }}>
                Start Shopping
              </Button>
            </Link>
          </Box>
        ) : (
          <Stack spacing={3}>
            {orders.map((order) => (
              <Card key={order.id} variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={700}>
                        Order #{order.id}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {order.created_at}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h6" fontWeight={700}>
                        ${Number(order.total).toFixed(2)}
                      </Typography>
                      <Chip
                        label={order.payment === 'card' ? 'Credit / Debit Card' : 'PayPal'}
                        size="small"
                        variant="outlined"
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  </Box>

                  <Divider sx={{ my: 1.5 }} />

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    {order.name} · {order.email} · {order.phone}
                  </Typography>

                  {order.items && order.items.length > 0 && (
                    <>
                      <Divider sx={{ my: 1.5 }} />
                      <Stack spacing={0.5}>
                        {order.items.map((item, i) => (
                          <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2">
                              {item.name} × {item.quantity}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              ${(item.price * item.quantity).toFixed(2)}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  );
}
