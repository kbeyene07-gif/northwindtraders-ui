import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

import { CustomersService, CreateCustomerDto, PagedResult } from '../../../core/services/customers.service';
import { Customer } from '../../../core/models/customer.model';

type ModalMode = 'create' | 'edit' | null;

@Component({
  selector: 'app-customers-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customers-page.component.html',
  styleUrls: ['./customers-page.component.scss']
})
export class CustomersPageComponent implements OnInit {
  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];

  searchText = '';
  loading = false;
  saving = false;
  errorMessage = '';

  // paging (API supports it)
  pageNumber = 1;
  pageSize = 10;
  totalCount = 0;

  // create/edit modal
  modalMode: ModalMode = null;
  showModal = false;
  formModel: (CreateCustomerDto & { id?: number }) = this.emptyForm();

  // delete confirm modal
  showDelete = false;
  deleting = false;
  toDelete: Customer | null = null;

  constructor(private customersService: CustomersService) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.loading = true;
    this.errorMessage = '';

    this.customersService.getPaged(this.pageNumber, this.pageSize).subscribe({
      next: (result: PagedResult<Customer> | any) => {
        // Be defensive about backend casing: Items/items
        const items = Array.isArray(result?.items)
          ? result.items
          : Array.isArray(result?.Items)
            ? result.Items
            : [];

        const total = typeof result?.totalCount === 'number'
          ? result.totalCount
          : typeof result?.TotalCount === 'number'
            ? result.TotalCount
            : items.length;

        this.customers = items;
        this.filteredCustomers = [...items];
        this.totalCount = total;

        if (this.searchText.trim()) this.applyFilter();

        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load customers.';
        this.customers = [];
        this.filteredCustomers = [];
        this.totalCount = 0;
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    const source = Array.isArray(this.customers) ? this.customers : [];
    const q = (this.searchText ?? '').toLowerCase().trim();

    if (!q) {
      this.filteredCustomers = [...source];
      return;
    }

    this.filteredCustomers = source.filter(c => {
      const fullName = `${c.firstName ?? ''} ${c.lastName ?? ''}`.toLowerCase();
      return (
        fullName.includes(q) ||
        (c.phone ?? '').toLowerCase().includes(q) ||
        (c.city ?? '').toLowerCase().includes(q) ||
        (c.state ?? '').toLowerCase().includes(q) ||
        (c.country ?? '').toLowerCase().includes(q) ||
        (c.zipCode ?? '').toLowerCase().includes(q)
      );
    });
  }

  clearSearch(): void {
    this.searchText = '';
    this.filteredCustomers = [...this.customers];
  }

  // ---------- CREATE / EDIT ----------

  openCreate(): void {
    this.modalMode = 'create';
    this.formModel = this.emptyForm();
    this.showModal = true;
  }

  openEdit(c: Customer): void {
    this.modalMode = 'edit';
    this.formModel = {
      id: c.id,
      firstName: c.firstName,
      lastName: c.lastName,
      phone: c.phone ?? '',
      city: c.city ?? '',
      state: c.state ?? '',
      country: c.country ?? '',
      zipCode: c.zipCode ?? '',
      address1: c.address1 ?? '',
      address2: c.address2 ?? ''
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.modalMode = null;
    this.saving = false;
  }

  save(form: NgForm): void {
    if (form.invalid || !this.modalMode) return;

    this.saving = true;
    this.errorMessage = '';

    const payload: CreateCustomerDto = this.stripId(this.formModel);

    if (this.modalMode === 'create') {
      this.customersService.create(payload).subscribe({
        next: () => {
          this.closeModal();
          this.loadCustomers();
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Failed to create customer.';
          this.saving = false;
        }
      });
      return;
    }

    // edit
    const id = this.formModel.id!;
    this.customersService.update(id, payload).subscribe({
      next: () => {
        this.closeModal();
        this.loadCustomers();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to update customer.';
        this.saving = false;
      }
    });
  }

  // ---------- DELETE ----------

  openDelete(c: Customer): void {
    this.toDelete = c;
    this.showDelete = true;
  }

  closeDelete(): void {
    this.showDelete = false;
    this.deleting = false;
    this.toDelete = null;
  }

  confirmDelete(): void {
    if (!this.toDelete) return;

    this.deleting = true;
    this.errorMessage = '';

    this.customersService.delete(this.toDelete.id).subscribe({
      next: () => {
        this.closeDelete();
        this.loadCustomers();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to delete customer.';
        this.deleting = false;
      }
    });
  }

  trackById(_: number, c: Customer): number {
    return c.id;
  }

  private emptyForm(): CreateCustomerDto & { id?: number } {
    return {
      firstName: '',
      lastName: '',
      phone: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
      address1: '',
      address2: ''
    };
  }

  private stripId(m: CreateCustomerDto & { id?: number }): CreateCustomerDto {
    const { id, ...rest } = m;
    return rest;
  }
  prevPage(): void {
  if (this.pageNumber <= 1) return;
  this.pageNumber--;
  this.loadCustomers();
}

nextPage(): void {
  if ((this.pageNumber * this.pageSize) >= this.totalCount) return;
  this.pageNumber++;
  this.loadCustomers();
}
}
