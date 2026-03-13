import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const client = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // for session cookies
});

// Attach access token to every request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401, try refreshing the token once
client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryableConfig;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const { data } = await axios.post<{ accessToken: string; refreshToken: string }>(
            `${BASE_URL}/authentication/refresh-tokens`,
            { refreshToken }
          );
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          original.headers.Authorization = `Bearer ${data.accessToken}`;
          return client(original);
        } catch {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export const apiKeyClient = axios.create({ baseURL: BASE_URL });
apiKeyClient.interceptors.request.use((config) => {
  const key = localStorage.getItem('apiKey');
  if (key) config.headers.Authorization = `ApiKey ${key}`;
  return config;
});

export default client;
