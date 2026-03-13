import axios from 'axios';
import client from './client';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const signUp = (email: string, password: string) =>
  client.post('/authentication/sign-up', { email, password });

export const signIn = (email: string, password: string, tfaCode?: string) =>
  client.post('/authentication/sign-in', {
    email,
    password,
    ...(tfaCode ? { tfaCode } : {}),
  });

export const refreshTokens = (refreshToken: string) =>
  axios.post(`${BASE_URL}/authentication/refresh-tokens`, { refreshToken });

export const googleSignIn = (token: string) =>
  client.post('/authentication/google', { token });

export const generate2FA = () =>
  client.post('/authentication/2fa/generate');

export const sessionSignIn = (email: string, password: string) =>
  client.post('/session-authentication/sign-in', { email, password });

export const getSession = () =>
  client.get('/session-authentication');
