import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';
import CoffeeIcon from '@mui/icons-material/Coffee';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { googleSignIn, sessionSignIn, signIn } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { Tokens, User } from '../types';

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID ||
  '981712131667-8s0mnkr2m78mf023noq3p81t2a5b8da5.apps.googleusercontent.com';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loginWithApiKey, loginWithSession } = useAuth();

  const [tab, setTab] = useState(0); // 0=JWT, 1=Session, 2=API Key
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tfaCode, setTfaCode] = useState('');
  const [showTfa, setShowTfa] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const clearError = () => setError('');

  const handleJwtLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLoading(true);
    try {
      const { data } = await signIn(email, password, showTfa ? tfaCode : undefined);
      login(data as Tokens, { email });
      navigate('/coffees');
    } catch (err: any) {
      const msg = err.response?.data?.message;
      const msgStr: string = Array.isArray(msg) ? msg.join(' ') : String(msg ?? '');
      if (msgStr.includes('2FA') || msgStr.includes('tfa') || err.response?.status === 401) {
        setShowTfa(true);
        setError('2FA code required — enter the code from your authenticator app.');
      } else {
        setError(msgStr || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSessionLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLoading(true);
    try {
      await sessionSignIn(email, password);
      loginWithSession({ email });
      navigate('/coffees');
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(', ') : msg || 'Session login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleApiKeyLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return setError('API key is required');
    loginWithApiKey(apiKey.trim());
    navigate('/coffees');
  };

  const handleGoogleSuccess = async (response: CredentialResponse) => {
    clearError();
    try {
      const { data } = await googleSignIn(response.credential!);
      login(data as Tokens, { email: 'google-user' } as Partial<User>);
      navigate('/coffees');
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(', ') : msg || 'Google login failed');
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', p: 2 }}>
      <Card sx={{ width: '100%', maxWidth: 440 }} elevation={3}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <CoffeeIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h5" fontWeight={700}>Sign In</Typography>
          </Box>

          <Tabs value={tab} onChange={(_, v: number) => { setTab(v); clearError(); setShowTfa(false); }} variant="fullWidth" sx={{ mb: 3 }}>
            <Tab label="JWT" />
            <Tab label="Session" />
            <Tab label="API Key" />
          </Tabs>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {/* JWT Tab */}
          {tab === 0 && (
            <>
              <Box component="form" onSubmit={handleJwtLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required fullWidth size="small" />
                <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required fullWidth size="small" inputProps={{ minLength: 10 }} />
                {showTfa && (
                  <TextField label="2FA Code" value={tfaCode} onChange={e => setTfaCode(e.target.value)} fullWidth size="small" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} placeholder="6-digit code" />
                )}
                <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ mt: 1 }}>
                  {loading ? <CircularProgress size={20} color="inherit" /> : 'Sign In'}
                </Button>
              </Box>

              <Divider sx={{ my: 2 }}>or</Divider>

              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                  <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError('Google login error')} />
                </GoogleOAuthProvider>
              </Box>
            </>
          )}

          {/* Session Tab */}
          {tab === 1 && (
            <Box component="form" onSubmit={handleSessionLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required fullWidth size="small" />
              <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required fullWidth size="small" inputProps={{ minLength: 10 }} />
              <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ mt: 1 }}>
                {loading ? <CircularProgress size={20} color="inherit" /> : 'Sign In with Session'}
              </Button>
            </Box>
          )}

          {/* API Key Tab */}
          {tab === 2 && (
            <Box component="form" onSubmit={handleApiKeyLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField label="API Key" value={apiKey} onChange={e => setApiKey(e.target.value)} required fullWidth size="small" placeholder="Your API key" />
              <Button type="submit" variant="contained" fullWidth sx={{ mt: 1 }}>Use API Key</Button>
            </Box>
          )}

          <Typography variant="body2" sx={{ textAlign: 'center', mt: 3, color: 'text.secondary' }}>
            No account?{' '}
            <Typography component={Link} to="/register" variant="body2" fontWeight={600} sx={{ color: 'text.primary' }}>
              Sign Up
            </Typography>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
