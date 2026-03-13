import QrCode2Icon from '@mui/icons-material/QrCode2';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import { generate2FA, getSession } from '../api/auth';

function TokenRow({ label, value }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing={0.5}>
        {label}
      </Typography>
      <Box sx={{ mt: 0.5, p: 1.5, bgcolor: 'grey.50', borderRadius: 1, border: '1px solid', borderColor: 'divider', fontFamily: 'monospace', fontSize: '0.75rem', wordBreak: 'break-all', color: value === 'none' ? 'text.disabled' : 'text.primary' }}>
        {value}
      </Box>
    </Box>
  );
}

export default function SettingsPage() {
  const [qrCode, setQrCode] = useState('');
  const [tfaLoading, setTfaLoading] = useState(false);
  const [tfaError, setTfaError] = useState('');
  const [tfaSuccess, setTfaSuccess] = useState('');

  const [sessionData, setSessionData] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [sessionError, setSessionError] = useState('');

  const handleGenerate2FA = async () => {
    setTfaError('');
    setTfaSuccess('');
    setQrCode('');
    setTfaLoading(true);
    try {
      const { data } = await generate2FA();
      if (typeof data === 'string') setQrCode(data);
      else if (data?.qrCode) setQrCode(data.qrCode);
      else if (data?.otpauthUrl) setQrCode(data.otpauthUrl);
      else setQrCode(JSON.stringify(data, null, 2));
      setTfaSuccess('QR code generated. Scan with your authenticator app.');
    } catch (err) {
      setTfaError(err.response?.data?.message || 'Failed to generate 2FA. Make sure you are signed in with Bearer token.');
    } finally {
      setTfaLoading(false);
    }
  };

  const handleCheckSession = async () => {
    setSessionError('');
    setSessionData(null);
    setSessionLoading(true);
    try {
      const { data } = await getSession();
      setSessionData(data);
    } catch (err) {
      setSessionError(err.response?.data?.message || 'No active session. Sign in via the Session tab first.');
    } finally {
      setSessionLoading(false);
    }
  };

  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const apiKey = localStorage.getItem('apiKey');

  return (
    <Stack spacing={3}>
      <Typography variant="h5" fontWeight={700}>Settings</Typography>

      {/* 2FA Section */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <QrCode2Icon color="action" />
          <Typography variant="subtitle1" fontWeight={600}>Two-Factor Authentication (TOTP)</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Link your account with Google Authenticator, Authy, or any TOTP app. Requires a valid Bearer access token.
        </Typography>

        {tfaError && <Alert severity="error" sx={{ mb: 2 }}>{tfaError}</Alert>}
        {tfaSuccess && <Alert severity="success" sx={{ mb: 2 }}>{tfaSuccess}</Alert>}

        <Button variant="contained" startIcon={tfaLoading ? <CircularProgress size={16} color="inherit" /> : <QrCode2Icon />} onClick={handleGenerate2FA} disabled={tfaLoading}>
          Generate QR Code
        </Button>

        {qrCode && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            {qrCode.startsWith('data:image') ? (
              <Box component="img" src={qrCode} alt="2FA QR Code" sx={{ width: 200, height: 200, border: '1px solid', borderColor: 'divider', borderRadius: 1 }} />
            ) : qrCode.startsWith('<svg') ? (
              <Box dangerouslySetInnerHTML={{ __html: qrCode }} />
            ) : (
              <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, fontFamily: 'monospace', fontSize: '0.75rem', wordBreak: 'break-all', maxWidth: 400 }}>
                {qrCode}
              </Box>
            )}
          </Box>
        )}
      </Paper>

      {/* Session Check */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <VpnKeyIcon color="action" />
          <Typography variant="subtitle1" fontWeight={600}>Session Authentication</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Verify your active session (GET /session-authentication). Sign in via the <strong>Session</strong> tab on the login page first.
        </Typography>

        {sessionError && <Alert severity="error" sx={{ mb: 2 }}>{sessionError}</Alert>}

        <Button variant="outlined" startIcon={sessionLoading ? <CircularProgress size={16} /> : <VpnKeyIcon />} onClick={handleCheckSession} disabled={sessionLoading}>
          Check Session
        </Button>

        {sessionData && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" fontWeight={600} color="text.secondary">Session Data</Typography>
            <Box component="pre" sx={{ m: 0, mt: 0.5, fontFamily: 'monospace', fontSize: '0.8rem', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {JSON.stringify(sessionData, null, 2)}
            </Box>
          </Box>
        )}
      </Paper>

      {/* Token Info */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="subtitle1" fontWeight={600} mb={2}>Current Tokens</Typography>
        <Stack spacing={2} divider={<Divider />}>
          <TokenRow label="Access Token" value={accessToken ? accessToken.slice(0, 60) + '…' : 'none'} />
          <TokenRow label="Refresh Token" value={refreshToken ? refreshToken.slice(0, 60) + '…' : 'none'} />
          <TokenRow label="API Key" value={apiKey || 'none'} />
        </Stack>
      </Paper>
    </Stack>
  );
}
