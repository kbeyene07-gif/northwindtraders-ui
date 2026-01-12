export interface Customer {
  id: number;
  firstName: string;
  lastName: string;

  city?: string;
  country?: string;

  address1?: string;
  address2?: string;
  state?: string;
  zipCode?: string;

  phone?: string;

  createdAtUtc: string;   // API returns DateTime -> JSON string
  updatedAtUtc?: string;  // nullable in API
}
