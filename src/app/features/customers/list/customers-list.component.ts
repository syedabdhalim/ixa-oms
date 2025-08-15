import { Component, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import type { Table } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CustomerDialogComponent, CustomerFormValue } from '../dialog/customer-dialog.component';
import { CardModule } from 'primeng/card';

@Component({
  standalone: true,
  selector: 'app-customers-list',
  imports: [CommonModule, FormsModule, TableModule, TagModule, ButtonModule, InputTextModule, CustomerDialogComponent, CardModule],
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss']
})
export class CustomersListComponent {
  @ViewChild('dt') table?: Table;

  showAddDialog = false;

  protected readonly customers = signal<Array<CustomerRow>>([
    {
      id: 'CUST-001',
      name: 'Acme Corporation',
      email: 'orders@acmecorp.com',
      phone: '+1 (555) 123-4567',
      address: '123 Business Ave, New York, NY 10001',
      type: 'Enterprise',
      orders: 45,
      totalSpent: 125450,
      lastOrder: new Date('2024-01-15'),
      status: 'Active',
    },
    {
      id: 'CUST-002',
      name: 'Tech Solutions Inc',
      email: 'procurement@techsolutions.com',
      phone: '+1 (555) 234-5678',
      address: '456 Tech Park, San Francisco, CA 94105',
      type: 'Business',
      orders: 32,
      totalSpent: 89200,
      lastOrder: new Date('2024-01-14'),
      status: 'Active',
    },
    {
      id: 'CUST-003',
      name: 'Global Imports Ltd',
      email: 'orders@globalimports.com',
      phone: '+1 (555) 345-6789',
      address: '789 Import Blvd, Los Angeles, CA 90210',
      type: 'Enterprise',
      orders: 67,
      totalSpent: 234800,
      lastOrder: new Date('2024-01-13'),
      status: 'Active',
    },
    {
      id: 'CUST-004',
      name: 'Metro Supplies',
      email: 'purchasing@metrosupplies.com',
      phone: '+1 (555) 987-6543',
      address: '88 Central Ave, Chicago, IL 60601',
      type: 'Business',
      orders: 12,
      totalSpent: 35600,
      lastOrder: new Date('2024-01-12'),
      status: 'Inactive',
    },
    {
      id: 'CUST-005',
      name: 'Industrial Partners',
      email: 'ops@industrialpartners.com',
      phone: '+1 (555) 765-4321',
      address: '22 Foundry Rd, Detroit, MI 48201',
      type: 'Business',
      orders: 25,
      totalSpent: 178900,
      lastOrder: new Date('2024-01-11'),
      status: 'Active',
    },
    {
      id: 'CUST-006',
      name: 'Bright Retailers',
      email: 'buyers@brightretailers.com',
      phone: '+1 (555) 321-6789',
      address: '600 Market St, Seattle, WA 98101',
      type: 'Enterprise',
      orders: 9,
      totalSpent: 61200,
      lastOrder: new Date('2024-01-10'),
      status: 'Active',
    },
  ]);

  typeOptions = [
    { label: 'All Types', value: null },
    { label: 'Enterprise', value: 'Enterprise' },
    { label: 'Business', value: 'Business' },
  ];

  statusOptions = [
    { label: 'All Status', value: null },
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' },
  ];

  typeFilter: string | null = null;
  statusFilter: string | null = null;

  get totalCustomers(): number {
    return this.customers().length;
  }

  get activeCustomers(): number {
    return this.customers().filter(c => c.status === 'Active').length;
  }

  get totalRevenue(): number {
    return this.customers().reduce((sum, c) => sum + c.totalSpent, 0);
  }

  onGlobalFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.table?.filterGlobal(value, 'contains');
  }

  onTypeFilter(type: string | null) {
    if (!type) {
      this.table?.clear();
      if (this.statusFilter) {
        this.table?.filter(this.statusFilter, 'status', 'equals');
      }
      return;
    }
    this.table?.filter(type, 'type', 'equals');
  }

  onStatusFilter(status: string | null) {
    if (!status) {
      this.table?.clear();
      if (this.typeFilter) {
        this.table?.filter(this.typeFilter, 'type', 'equals');
      }
      return;
    }
    this.table?.filter(status, 'status', 'equals');
  }

  protected statusToSeverity(status: CustomerRow['status']): 'success' | 'danger' | 'secondary' {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Inactive':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  onAddCustomerClick() {
    this.showAddDialog = true;
  }

  handleDialogCancel() {
    this.showAddDialog = false;
  }

  handleDialogSave(value: CustomerFormValue) {
    const newCustomer: CustomerRow = {
      id: `CUST-${(this.customers().length + 1).toString().padStart(3, '0')}`,
      name: value.name,
      email: value.email ?? '',
      phone: value.phone ?? '',
      address: `${value.street}, ${value.city}, ${value.state}${value.zip ? ' ' + value.zip : ''}`,
      type: value.customerType,
      orders: 0,
      totalSpent: 0,
      lastOrder: new Date(),
      status: value.status === 'Active' ? 'Active' : 'Inactive',
    };
    this.customers.update(list => [newCustomer, ...list]);
    this.showAddDialog = false;
  }
}

type CustomerRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  type: 'Enterprise' | 'Business';
  orders: number;
  totalSpent: number;
  lastOrder: Date;
  status: 'Active' | 'Inactive';
};


