import CoffeeIcon from '@mui/icons-material/Coffee';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUp } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { Tokens } from '../types';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await signUp(email, password);
      login(data as Tokens, { email });
      navigate('/coffees');
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(', ') : msg || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', p: 2 }}>
      <Card sx={{ width: '100%', maxWidth: 440 }} elevation={3}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <CoffeeIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h5" fontWeight={700}>Create Account</Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required fullWidth size="small" />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              fullWidth
              size="small"
              helperText="Minimum 10 characters"
              inputProps={{ minLength: 10 }}
            />
            <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ mt: 1 }}>
              {loading ? <CircularProgress size={20} color="inherit" /> : 'Sign Up'}
            </Button>
          </Box>

          <Typography variant="body2" sx={{ textAlign: 'center', mt: 3, color: 'text.secondary' }}>
            Already have an account?{' '}
            <Typography component={Link} to="/login" variant="body2" fontWeight={600} sx={{ color: 'text.primary' }}>
              Sign In
            </Typography>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
