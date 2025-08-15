import { Component, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import type { Table } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { OrderDialogComponent, OrderFormValue } from '../dialog/order-dialog/order-dialog.component';
import { InvoicePreviewDialogComponent, Invoice } from '../dialog/invoice-preview-dialog/invoice-preview-dialog.component';
import type { InvoiceItem } from '../dialog/invoice-preview-dialog/invoice-preview-dialog.component';

@Component({
  standalone: true,
  selector: 'app-orders-list',
  imports: [CommonModule, FormsModule, TableModule, TagModule, ButtonModule, InputTextModule, OrderDialogComponent, InvoicePreviewDialogComponent],
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss']
})
export class OrdersListComponent {
  @ViewChild('dt') table?: Table;

  showCreateDialog = false;
  showInvoiceDialog = false;
  invoicePreview: Invoice | null = null;

  protected readonly orders = signal<Array<OrderRow>>([
    { id: 'ORD-2024-001', customer: 'Acme Corporation', date: new Date('2024-01-15'), status: 'Shipped', priority: 'High', items: 12, total: 2450 },
    { id: 'ORD-2024-002', customer: 'Tech Solutions Inc', date: new Date('2024-01-15'), status: 'Processing', priority: 'Medium', items: 8, total: 1850 },
    { id: 'ORD-2024-003', customer: 'Global Imports Ltd', date: new Date('2024-01-14'), status: 'Delivered', priority: 'Low', items: 15, total: 3200 },
    { id: 'ORD-2024-004', customer: 'Metro Supplies', date: new Date('2024-01-14'), status: 'Pending', priority: 'High', items: 5, total: 1125 },
    { id: 'ORD-2024-005', customer: 'Industrial Partners', date: new Date('2024-01-13'), status: 'Shipped', priority: 'Medium', items: 22, total: 4750 },
    { id: 'ORD-2024-006', customer: 'Bright Retailers', date: new Date('2024-01-12'), status: 'Delivered', priority: 'Low', items: 9, total: 1620 },
  ]);

  statusOptions = [
    { label: 'All Status', value: null },
    { label: 'Shipped', value: 'Shipped' },
    { label: 'Processing', value: 'Processing' },
    { label: 'Delivered', value: 'Delivered' },
    { label: 'Pending', value: 'Pending' },
  ];

  statusFilter: string | null = null;

  onGlobalFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.table?.filterGlobal(value, 'contains');
  }

  onStatusFilter(status: string | null) {
    if (!status) {
      this.table?.clear();
      return;
    }
    this.table?.filter(status, 'status', 'equals');
  }

  protected statusToSeverity(status: OrderRow['status']): 'success' | 'info' | 'warning' | 'danger' | 'secondary' {
    switch (status) {
      case 'Shipped':
        return 'info';
      case 'Delivered':
        return 'success';
      case 'Processing':
        return 'warning';
      case 'Pending':
      default:
        return 'secondary';
    }
  }

  protected priorityToSeverity(priority: OrderRow['priority']): 'danger' | 'warning' | 'success' {
    switch (priority) {
      case 'High':
        return 'danger';
      case 'Medium':
        return 'warning';
      default:
        return 'success';
    }
  }

  onNewOrderClick() {
    this.showCreateDialog = true;
  }

  handleCreateCancel() {
    this.showCreateDialog = false;
  }

  handleCreateSave(value: OrderFormValue) {
    const newId = `ORD-${new Date().getFullYear()}-${(this.orders().length + 1)
      .toString()
      .padStart(3, '0')}`;
    const totalItems = value.items.reduce((sum, i) => sum + Number(i.quantity || 0), 0);
    const newOrder: OrderRow = {
      id: newId,
      customer: value.customerName,
      date: value.orderDate,
      status: 'Pending',
      priority: 'Medium',
      items: totalItems,
      total: value.totalAmount,
    };
    this.orders.update(list => [newOrder, ...list]);
    this.showCreateDialog = false;

    // Build invoice preview based on order data
    const invId = `INV-${new Date().getFullYear()}-${(Math.floor(Math.random() * 9000) + 1000).toString()}`;
    const items = value.items.map(i => ({
      description: i.productId ?? 'Product',
      quantity: i.quantity,
      unitPrice: i.price,
      total: i.quantity * i.price,
    }));
    const subtotal = items.reduce((s, it) => s + it.total, 0);
    const tax = Math.round(subtotal * 0.08 * 100) / 100; // 8% tax example
    const total = Math.round((subtotal + tax) * 100) / 100;

    this.invoicePreview = {
      id: invId,
      customerName: value.customerName,
      customerEmail: null,
      amount: total,
      deliveryAddress: value.deliveryAddress,
      issueDate: new Date(),
      dueDate: new Date(value.orderDate.getTime() + 30 * 24 * 60 * 60 * 1000),
      status: 'Unpaid',
      items,
      subtotal,
      tax,
      total,
    };
    this.showInvoiceDialog = true;
  }

  onPreview(order: OrderRow) {
    const invId = `INV-${new Date().getFullYear()}-${(Math.floor(Math.random() * 9000) + 1000).toString()}`;
    const items = this.generateRandomInvoiceItems(order);
    const subtotal = Math.round(items.reduce((s, it) => s + it.total, 0) * 100) / 100;
    const tax = Math.round(subtotal * 0.08 * 100) / 100; // SST 8%
    const total = Math.round((subtotal + tax) * 100) / 100;

    this.invoicePreview = {
      id: invId,
      customerName: order.customer,
      customerEmail: null,
      amount: total,
      deliveryAddress: 'N/A',
      issueDate: new Date(order.date),
      dueDate: new Date(order.date.getTime() + 30 * 24 * 60 * 60 * 1000),
      status: order.status === 'Delivered' ? 'Paid' : 'Unpaid',
      items,
      subtotal,
      tax,
      total,
    };
    this.showInvoiceDialog = true;
  }

  private generateRandomInvoiceItems(order: OrderRow): Array<InvoiceItem> {
    // Randomized product names pool
    const productNames = [
      'Industrial Bolt (M8)',
      'Heavy-Duty Pallet',
      'Protective Gloves (Pack of 10)',
      'Safety Helmet',
      'LED Work Light',
      'Steel Shelving Unit',
      'Shipping Labels (Roll)',
      'Barcode Scanner',
      'Packing Tape (6 Pack)',
      'Warehouse Trolley',
      'Shrink Wrap Film',
      'Forklift Seat Cover',
    ];

    const k = Math.min(5, Math.max(3, Math.min(order.items, 5)));
    const subtotalCentsTarget = Math.round(order.total * 100);

    // Split subtotal exactly into k lines (by cents) so totals add up precisely
    const base = Math.floor(subtotalCentsTarget / k);
    let remainder = subtotalCentsTarget % k;
    const lineTotalsCents: number[] = new Array(k).fill(0).map(() => base);
    for (let i = 0; i < k; i++) {
      if (remainder <= 0) break;
      lineTotalsCents[i] += 1;
      remainder -= 1;
    }

    // Distribute quantities to roughly match order.items; reserve 1 for last line
    const quantities: number[] = new Array(k).fill(1);
    const totalQtyTarget = Math.max(order.items, k);
    let remainingQty = Math.max(totalQtyTarget - k, 0);
    while (remainingQty > 0 && k > 1) {
      const idx = Math.floor(Math.random() * (k - 1)); // avoid last so it stays 1
      quantities[idx] += 1;
      remainingQty -= 1;
    }

    // Build items, keep last item quantity = 1 to ensure exact grand total
    const items: Array<InvoiceItem> = [];
    const usedNames = new Set<number>();
    const pickName = () => {
      let idx = Math.floor(Math.random() * productNames.length);
      let guard = 0;
      while (usedNames.has(idx) && guard++ < 10) idx = Math.floor(Math.random() * productNames.length);
      usedNames.add(idx);
      return productNames[idx];
    };

    for (let i = 0; i < k; i++) {
      const qty = i === k - 1 ? 1 : quantities[i];
      const totalCents = lineTotalsCents[i];
      const unitPriceCents = Math.max(1, Math.round(totalCents / qty));
      const item: InvoiceItem = {
        description: pickName(),
        quantity: qty,
        unitPrice: Math.round(unitPriceCents) / 100,
        total: Math.round((unitPriceCents * qty)) / 100,
      };
      items.push(item);
    }

    // Adjust last line to absorb any rounding drift and match target subtotal exactly
    const currentSubtotalCents = Math.round(items.reduce((s, it) => s + Math.round(it.total * 100), 0));
    const diff = subtotalCentsTarget - currentSubtotalCents;
    if (diff !== 0) {
      const last = items[items.length - 1];
      const adjustedTotalCents = Math.max(1, Math.round(last.total * 100) + diff);
      last.unitPrice = Math.round(adjustedTotalCents / last.quantity) / 100;
      last.total = Math.round(last.unitPrice * last.quantity * 100) / 100;
    }

    return items;
  }
}

type OrderRow = {
  id: string;
  customer: string;
  date: Date;
  status: 'Shipped' | 'Processing' | 'Delivered' | 'Pending';
  priority: 'High' | 'Medium' | 'Low';
  items: number;
  total: number;
};


