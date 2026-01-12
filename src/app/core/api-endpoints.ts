import { environment } from '../../environments/environment';

export const API_ROOT =
  `${environment.apiBaseUrl}${environment.apiVersionPrefix}`.replace(/\/+$/, '');

export const API_ENDPOINTS = {
  customers: `${API_ROOT}/customers`,
  products: `${API_ROOT}/products`,
  orders: `${API_ROOT}/orders`
};
