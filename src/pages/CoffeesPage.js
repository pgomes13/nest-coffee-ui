import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import React, { useCallback, useEffect, useState } from 'react';
import { createCoffee, deleteCoffee, getCoffee, getCoffees, updateCoffee } from '../api/coffees';

const EMPTY_FORM = { name: '', brand: '', flavors: '' };

export default function CoffeesPage() {
  const [coffees, setCoffees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [snack, setSnack] = useState('');

  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const [fetchId, setFetchId] = useState('');
  const [detail, setDetail] = useState(null);
  const [detailError, setDetailError] = useState('');

  const fetchCoffees = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await getCoffees(limit, offset);
      setCoffees(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load coffees');
    } finally {
      setLoading(false);
    }
  }, [limit, offset]);

  useEffect(() => { fetchCoffees(); }, [fetchCoffees]);

  const openCreate = () => { setEditId(null); setForm(EMPTY_FORM); setFormError(''); setDialogOpen(true); };
  const openEdit = (c) => {
    setEditId(c.id);
    setForm({ name: c.name, brand: c.brand, flavors: (c.flavors || []).map(f => f.name || f).join(', ') });
    setFormError('');
    setDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);
    const payload = { name: form.name, brand: form.brand, flavors: form.flavors.split(',').map(s => s.trim()).filter(Boolean) };
    try {
      if (editId) { await updateCoffee(editId, payload); setSnack('Coffee updated.'); }
      else { await createCoffee(payload); setSnack('Coffee created.'); }
      setDialogOpen(false);
      fetchCoffees();
    } catch (err) {
      const msg = err.response?.data?.message;
      setFormError(Array.isArray(msg) ? msg.join(', ') : msg || 'Operation failed');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coffee?')) return;
    try {
      await deleteCoffee(id);
      setSnack('Coffee deleted.');
      fetchCoffees();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleFetchOne = async (e) => {
    e.preventDefault();
    if (!fetchId) return;
    setDetailError('');
    setDetail(null);
    try {
      const { data } = await getCoffee(fetchId);
      setDetail(data);
    } catch (err) {
      setDetailError(err.response?.data?.message || 'Not found');
    }
  };

  return (
    <Stack spacing={3}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5" fontWeight={700}>Coffees</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>New Coffee</Button>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      {/* Fetch by ID */}
      <Paper sx={{ p: 2.5 }}>
        <Typography variant="subtitle1" fontWeight={600} mb={1.5}>Fetch by ID</Typography>
        <Box component="form" onSubmit={handleFetchOne} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
          <TextField
            size="small"
            type="number"
            placeholder="Coffee ID"
            value={fetchId}
            onChange={e => setFetchId(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
          />
          <Button type="submit" variant="outlined">Fetch</Button>
        </Box>
        {detailError && <Alert severity="error" sx={{ mt: 1 }}>{detailError}</Alert>}
        {detail && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
            <Typography fontWeight={600}>{detail.name}</Typography>
            <Typography variant="body2" color="text.secondary">Brand: {detail.brand}</Typography>
            <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              {(detail.flavors || []).map((f, i) => <Chip key={i} label={f.name || f} size="small" />)}
            </Box>
            <Typography variant="body2" color="text.secondary" mt={0.5}>Recommendations: {detail.recommendations}</Typography>
          </Box>
        )}
      </Paper>

      {/* List */}
      <Paper sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField label="Limit" type="number" size="small" value={limit} onChange={e => setLimit(Number(e.target.value))} sx={{ width: 90 }} inputProps={{ min: 1, max: 100 }} />
          <TextField label="Offset" type="number" size="small" value={offset} onChange={e => setOffset(Number(e.target.value))} sx={{ width: 90 }} inputProps={{ min: 0 }} />
          <Button variant="outlined" onClick={fetchCoffees}>Refresh</Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ '& th': { fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem' } }}>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Brand</TableCell>
                  <TableCell>Flavors</TableCell>
                  <TableCell>Recs</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {coffees.length === 0 ? (
                  <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>No coffees found</TableCell></TableRow>
                ) : coffees.map(c => (
                  <TableRow key={c.id} hover>
                    <TableCell>{c.id}</TableCell>
                    <TableCell><Typography fontWeight={500}>{c.name}</Typography></TableCell>
                    <TableCell>{c.brand}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {(c.flavors || []).map((f, i) => <Chip key={i} label={f.name || f} size="small" variant="outlined" />)}
                      </Box>
                    </TableCell>
                    <TableCell>{c.recommendations}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit"><IconButton size="small" onClick={() => openEdit(c)}><EditIcon fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => handleDelete(c.id)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>{editId ? 'Edit Coffee' : 'New Coffee'}</DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            {formError && <Alert severity="error">{formError}</Alert>}
            <TextField label="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required fullWidth size="small" />
            <TextField label="Brand" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} required fullWidth size="small" />
            <TextField label="Flavors" value={form.flavors} onChange={e => setForm({ ...form, flavors: e.target.value })} fullWidth size="small" helperText="Comma-separated (e.g. nutty, caramel)" placeholder="nutty, caramel, fruity" />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={formLoading}>
              {formLoading ? <CircularProgress size={18} color="inherit" /> : editId ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Snackbar open={!!snack} autoHideDuration={3000} onClose={() => setSnack('')} message={snack} />
    </Stack>
  );
}
