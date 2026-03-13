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
import { createUser, deleteUser, getUser, getUsers, updateUser } from '../api/users';
import { User } from '../types';

type ChipColor = 'warning' | 'secondary';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [snack, setSnack] = useState('');

  const [fetchId, setFetchId] = useState('');
  const [detail, setDetail] = useState<User | null>(null);
  const [detailError, setDetailError] = useState('');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await getUsers();
      setUsers(Array.isArray(data) ? data : (data as any).data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const openCreate = () => { setEditId(null); setFormError(''); setDialogOpen(true); };
  const openEdit = (u: User) => { setEditId(u.id ?? null); setFormError(''); setDialogOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);
    try {
      if (editId) { await updateUser(editId, {}); setSnack('User updated.'); }
      else { await createUser({}); setSnack('User created.'); }
      setDialogOpen(false);
      fetchUsers();
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setFormError(Array.isArray(msg) ? msg.join(', ') : msg || 'Operation failed');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await deleteUser(id);
      setSnack('User deleted.');
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleFetchOne = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fetchId) return;
    setDetailError('');
    setDetail(null);
    try {
      const { data } = await getUser(fetchId);
      setDetail(data as User);
    } catch (err: any) {
      setDetailError(err.response?.data?.message || 'Not found');
    }
  };

  const roleColor = (role?: string): ChipColor => role === 'Admin' ? 'warning' : 'secondary';

  return (
    <Stack spacing={3}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5" fontWeight={700}>Users</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>New User</Button>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      {/* Fetch by ID */}
      <Paper sx={{ p: 2.5 }}>
        <Typography variant="subtitle1" fontWeight={600} mb={1.5}>Fetch by ID</Typography>
        <Box component="form" onSubmit={handleFetchOne} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
          <TextField
            size="small"
            type="number"
            placeholder="User ID"
            value={fetchId}
            onChange={e => setFetchId(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
          />
          <Button type="submit" variant="outlined">Fetch</Button>
        </Box>
        {detailError && <Alert severity="error" sx={{ mt: 1 }}>{detailError}</Alert>}
        {detail && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
            <Typography fontWeight={600}>ID: {detail.id}</Typography>
            <Typography variant="body2">Email: {detail.email}</Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1, alignItems: 'center' }}>
              <Chip label={detail.role} size="small" color={roleColor(detail.role)} />
              {detail.isTfaEnabled && <Chip label="2FA enabled" size="small" color="success" />}
            </Box>
          </Box>
        )}
      </Paper>

      {/* Users table */}
      <Paper sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button variant="outlined" onClick={fetchUsers}>Refresh</Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ '& th': { fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem' } }}>
                  <TableCell>ID</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>2FA</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow><TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>No users found</TableCell></TableRow>
                ) : users.map(u => (
                  <TableRow key={u.id} hover>
                    <TableCell>{u.id}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell><Chip label={u.role || '—'} size="small" color={roleColor(u.role)} /></TableCell>
                    <TableCell>
                      {u.isTfaEnabled
                        ? <Chip label="Enabled" size="small" color="success" variant="outlined" />
                        : <Typography variant="body2" color="text.disabled">—</Typography>}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit"><IconButton size="small" onClick={() => openEdit(u)}><EditIcon fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => handleDelete(u.id!)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
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
        <DialogTitle>{editId ? `Edit User #${editId}` : 'New User'}</DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 1 }}>
            {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
            <Typography variant="body2" color="text.secondary">
              The User DTO has no editable fields in the current API schema.
              Submitting will call {editId ? `PATCH /users/${editId}` : 'POST /users'}.
            </Typography>
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
