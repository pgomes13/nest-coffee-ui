import client from './client';

export const createUser = (data) =>
  client.post('/userssxx', data);

export const getUsers = () =>
  client.get('/userssxx');

export const getUser = (id) =>
  client.get(`/userssxx/${id}`);

export const updateUser = (id, data) =>
  client.patch(`/userssxx/${id}`, data);

export const deleteUser = (id) =>
  client.delete(`/userssxx/${id}`);
