import client from './client';

export const getCoffees = (limit, offset) =>
  client.get('/coffees', { params: { limit, offset } });

export const getCoffee = (id) =>
  client.get(`/coffees/${id}`);

export const createCoffee = (data) =>
  client.post('/coffees', data);

export const updateCoffee = (id, data) =>
  client.patch(`/coffees/${id}`, data);

export const deleteCoffee = (id) =>
  client.delete(`/coffees/${id}`);
