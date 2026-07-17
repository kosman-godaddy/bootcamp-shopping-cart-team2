import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Container, Typography, Box, Button, TextField, Switch, FormControlLabel,
  Paper, Stack, Divider, Snackbar, Alert, CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function AdminPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
  const [edits, setEdits] = useState({});

  const fetchProducts = async () => {
    const res = await fetch('http://localhost:8000/v1/products');
    const data = await res.json();
    const list = Array.isArray(data) ? data : data.products ?? [];
    setProducts(list);
    const initial = {};
    list.forEach((p) => {
      initial[p.id] = {
        name: p.name,
        description: p.description ?? '',
        price: p.price,
        sale_price: p.sale_price ?? '',
        is_on_sale: p.is_on_sale,
        image_url: p.image_url ?? '',
      };
    });
    setEdits(initial);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleChange = (id, field, value) => {
    setEdits((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const handleSave = async (id) => {
    setSaving(id);
    const data = { ...edits[id] };
    data.price = parseFloat(data.price);
    data.sale_price = data.sale_price !== '' ? parseFloat(data.sale_price) : null;
    const res = await fetch(`http://localhost:8000/v1/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setSaving(null);
    if (res.ok) {
      setSnack({ open: true, message: 'Product saved!', severity: 'success' });
      fetchProducts();
    } else {
      setSnack({ open: true, message: 'Save failed.', severity: 'error' });
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Head><title>Admin — Edit Products</title></Head>
      <Box sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', py: 2 }}>
        <Container maxWidth="md" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Link href="/shop" passHref>
            <Button variant="text" startIcon={<ArrowBackIcon />} size="small">Back to Shop</Button>
          </Link>
          <Typography variant="h6" fontWeight={700}>Admin — Edit Products</Typography>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Stack spacing={3}>
          {products.map((product) => {
            const e = edits[product.id] ?? {};
            return (
              <Paper key={product.id} elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                  #{product.id} — {product.name}
                </Typography>
                <Stack spacing={2}>
                  <TextField
                    label="Name"
                    size="small"
                    fullWidth
                    value={e.name ?? ''}
                    onChange={(ev) => handleChange(product.id, 'name', ev.target.value)}
                  />
                  <TextField
                    label="Description"
                    size="small"
                    fullWidth
                    multiline
                    rows={2}
                    value={e.description ?? ''}
                    onChange={(ev) => handleChange(product.id, 'description', ev.target.value)}
                  />
                  <Stack direction="row" spacing={2}>
                    <TextField
                      label="Price ($)"
                      size="small"
                      type="number"
                      inputProps={{ step: '0.01' }}
                      value={e.price ?? ''}
                      onChange={(ev) => handleChange(product.id, 'price', ev.target.value)}
                      sx={{ flex: 1 }}
                    />
                    <TextField
                      label="Sale Price ($)"
                      size="small"
                      type="number"
                      inputProps={{ step: '0.01' }}
                      value={e.sale_price ?? ''}
                      onChange={(ev) => handleChange(product.id, 'sale_price', ev.target.value)}
                      sx={{ flex: 1 }}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={e.is_on_sale ?? false}
                          onChange={(ev) => handleChange(product.id, 'is_on_sale', ev.target.checked)}
                        />
                      }
                      label="On Sale"
                    />
                  </Stack>
                  <TextField
                    label="Image URL"
                    size="small"
                    fullWidth
                    value={e.image_url ?? ''}
                    onChange={(ev) => handleChange(product.id, 'image_url', ev.target.value)}
                  />
                </Stack>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    disableElevation
                    size="small"
                    onClick={() => handleSave(product.id)}
                    disabled={saving === product.id}
                  >
                    {saving === product.id ? 'Saving...' : 'Save'}
                  </Button>
                </Box>
              </Paper>
            );
          })}
        </Stack>
      </Container>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snack.severity} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AdminPage;
