export interface User {
  id?: number;
  email: string;
  role?: string;
  isTfaEnabled?: boolean;
}

export type AuthMode = 'bearer' | 'apikey' | 'session';

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface Flavor {
  name: string;
}

export interface Coffee {
  id: number;
  name: string;
  brand: string;
  flavors: (string | Flavor)[];
  recommendations?: number;
}
