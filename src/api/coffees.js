import client from './client';

export const getCoffees = (limit, offset) =>
  client.get('/coffeesss', { params: { limit, offset } });

export const getCoffee = (id) =>
  client.get(`/coffeesss/${id}`);

export const createCoffee = (data) =>
  client.post('/coffeesss', data);

export const updateCoffee = (id, data) =>
  client.patch(`/coffeesss/${id}`, data);

export const deleteCoffee = (id) =>
  client.delete(`/coffeesss/${id}`);
