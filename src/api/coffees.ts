import client from './client';

export interface CoffeePayload {
  name: string;
  brand: string;
  flavors: string[];
}

export const getCoffees = (limit: number, offset: number) =>
  client.get('/coffees', { params: { limit, offset } });

export const getCoffee = (id: number | string) =>
  client.get(`/coffees/${id}`);

export const createCoffee = (data: CoffeePayload) =>
  client.post('/coffees', data);

export const updateCoffee = (id: number | string, data: Partial<CoffeePayload>) =>
  client.patch(`/coffees/${id}`, data);

export const deleteCoffee = (id: number | string) =>
  client.delete(`/coffees/${id}`);
