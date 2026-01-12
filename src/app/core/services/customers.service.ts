import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Customer } from '../models/customer.model';
import { API_ENDPOINTS } from  '../..//core/api-endpoints';

export interface PagedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages?: number;
}

export type CreateCustomerDto = {
  firstName: string;
  lastName: string;
  city?: string;
  country?: string;
  address1?: string;
  address2?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
};

export type UpdateCustomerDto = CreateCustomerDto;

@Injectable({ providedIn: 'root' })
export class CustomersService {
  constructor(private http: HttpClient) {}

  getPaged(pageNumber = 1, pageSize = 10) {
    const params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    return this.http.get<PagedResult<Customer>>(API_ENDPOINTS.customers, { params });
  }

  getById(id: number) {
    return this.http.get<Customer>(`${API_ENDPOINTS.customers}/${id}`);
  }

  create(payload: CreateCustomerDto) {
    return this.http.post<Customer>(API_ENDPOINTS.customers, payload);
  }

  update(id: number, payload: UpdateCustomerDto) {
    return this.http.put<void>(`${API_ENDPOINTS.customers}/${id}`, payload);
  }

  delete(id: number) {
    return this.http.delete<void>(`${API_ENDPOINTS.customers}/${id}`);
  }
}
