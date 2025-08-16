import { Component, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import type { Table } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { InventoryItemDialogComponent, type InventoryItemFormValue } from '../dialog/item-dialog/inventory-item-dialog.component';

@Component({
  standalone: true,
  selector: 'app-inventory-list',
  imports: [CommonModule, FormsModule, TableModule, TagModule, ButtonModule, InputTextModule, CardModule, InventoryItemDialogComponent],
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss']
})
export class InventoryListComponent {
  @ViewChild('dt') table?: Table;

  showCreateDialog = false;

  protected readonly items = signal<Array<InventoryRow>>([
    {
      id: 'INV-001',
      name: 'Wireless Bluetooth Headphones',
      sku: 'WBH-2024-001',
      category: 'Electronics',
      stock: 45,
      min: 20,
      max: 100,
      status: 'In Stock',
      unitPrice: 89.99,
      location: 'A-1-15',
    },
    {
      id: 'INV-002',
      name: 'Office Desk Chair',
      sku: 'ODC-2024-002',
      category: 'Furniture',
      stock: 8,
      min: 15,
      max: 50,
      status: 'Low Stock',
      unitPrice: 299.99,
      location: 'B-2-08',
    },
    {
      id: 'INV-003',
      name: 'Laptop Stand Aluminum',
      sku: 'LSA-2024-003',
      category: 'Electronics',
      stock: 0,
      min: 10,
      max: 30,
      status: 'Out of Stock',
      unitPrice: 49.99,
      location: 'A-3-22',
    },
    {
      id: 'INV-004',
      name: 'Cotton T-Shirt Pack',
      sku: 'CTP-2024-004',
      category: 'Clothing',
      stock: 120,
      min: 50,
      max: 200,
      status: 'In Stock',
      unitPrice: 24.99,
      location: 'C-1-05',
    },
    {
      id: 'INV-005',
      name: 'USB-C Charging Cable',
      sku: 'UCC-2024-005',
      category: 'Electronics',
      stock: 25,
      min: 20,
      max: 150,
      status: 'In Stock',
      unitPrice: 12.49,
      location: 'A-2-10',
    },
    {
      id: 'INV-006',
      name: 'Stainless Steel Water Bottle',
      sku: 'SSW-2024-006',
      category: 'Outdoors',
      stock: 14,
      min: 15,
      max: 90,
      status: 'Low Stock',
      unitPrice: 18.9,
      location: 'D-4-03',
    },
  ]);

  categoryOptions = [
    { label: 'All Categories', value: null },
    { label: 'Electronics', value: 'Electronics' },
    { label: 'Furniture', value: 'Furniture' },
    { label: 'Clothing', value: 'Clothing' },
    { label: 'Outdoors', value: 'Outdoors' },
  ];

  statusOptions = [
    { label: 'All Status', value: null },
    { label: 'In Stock', value: 'In Stock' },
    { label: 'Low Stock', value: 'Low Stock' },
    { label: 'Out of Stock', value: 'Out of Stock' },
  ];

  categoryFilter: string | null = null;
  statusFilter: string | null = null;

  get totalItems(): number {
    return this.items().length;
  }

  get lowStockCount(): number {
    return this.items().filter(i => i.status === 'Low Stock').length;
  }

  get outOfStockCount(): number {
    return this.items().filter(i => i.status === 'Out of Stock').length;
  }

  get totalValue(): number {
    return this.items().reduce((sum, i) => sum + i.unitPrice * i.stock, 0);
  }

  onGlobalFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.table?.filterGlobal(value, 'contains');
  }

  onCategoryFilter(category: string | null) {
    if (!category) {
      this.table?.clear();
      if (this.statusFilter) {
        this.table?.filter(this.statusFilter, 'status', 'equals');
      }
      return;
    }
    this.table?.filter(category, 'category', 'equals');
  }

  onStatusFilter(status: string | null) {
    if (!status) {
      this.table?.clear();
      if (this.categoryFilter) {
        this.table?.filter(this.categoryFilter, 'category', 'equals');
      }
      return;
    }
    this.table?.filter(status, 'status', 'equals');
  }

  protected statusToSeverity(status: InventoryRow['status']): 'success' | 'warning' | 'danger' | 'secondary' {
    switch (status) {
      case 'In Stock':
        return 'success';
      case 'Low Stock':
        return 'warning';
      case 'Out of Stock':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  onAddItemClick() {
    this.showCreateDialog = true;
  }

  handleCreateCancel() {
    this.showCreateDialog = false;
  }

  handleCreateSave(value: InventoryItemFormValue) {
    const newId = `INV-${(this.items().length + 1).toString().padStart(3, '0')}`;
    const status: InventoryRow['status'] = value.stock === 0 ? 'Out of Stock' : value.stock <= value.min ? 'Low Stock' : 'In Stock';
    const newRow: InventoryRow = {
      id: newId,
      name: value.name,
      sku: value.sku,
      category: value.category,
      stock: value.stock,
      min: value.min,
      max: value.max,
      status,
      unitPrice: value.unitPrice,
      location: value.location,
    };
    this.items.update(list => [newRow, ...list]);
    this.showCreateDialog = false;
  }
}

type InventoryRow = {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  min: number;
  max: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  unitPrice: number;
  location: string;
};


