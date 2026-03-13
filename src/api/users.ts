import client from './client';

export type UserPayload = Record<string, unknown>;

export const createUser = (data: UserPayload) =>
  client.post('/users', data);

export const getUsers = () =>
  client.get('/users');

export const getUser = (id: number | string) =>
  client.get(`/users/${id}`);

export const updateUser = (id: number | string, data: UserPayload) =>
  client.patch(`/users/${id}`, data);

export const deleteUser = (id: number | string) =>
  client.delete(`/users/${id}`);
