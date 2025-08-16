import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../core/services/auth.service';
import { InvoicePreviewDialogComponent, type Invoice } from '../orders/dialog/invoice-preview-dialog/invoice-preview-dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, TagModule, TableModule, ProgressBarModule, ButtonModule, InvoicePreviewDialogComponent],
  template: `
    <div class="p-4 lg:p-5">
      <!-- Top KPI cards -->
      <div class="grid">
        <div class="col-12 md:col-6 xl:col-4">
          <p-card class="h-full">
            <div class="flex align-items-center justify-content-between">
              <div>
                <div class="text-900 text-xl font-semibold">Orders Today</div>
                <div class="text-4xl font-bold mt-2">{{ stats().ordersToday }}</div>
                <div class="text-green-600 mt-1 text-sm">+{{ stats().ordersChange }}% from yesterday</div>
              </div>
              <span class="pi pi-shopping-cart text-3xl text-primary"></span>
            </div>
          </p-card>
        </div>

        <div class="col-12 md:col-6 xl:col-4">
          <p-card class="h-full">
            <div class="flex align-items-center justify-content-between">
              <div>
                <div class="text-900 text-xl font-semibold">Revenue Today</div>
                <div class="text-4xl font-bold mt-2">{{ stats().revenueToday | currency:'MYR':'RM' }}</div>
                <div class="text-green-600 mt-1 text-sm">+{{ stats().revenueChange }}% from yesterday</div>
              </div>
              <span class="pi pi-dollar text-3xl text-primary"></span>
            </div>
          </p-card>
        </div>

        <div class="col-12 md:col-6 xl:col-4">
          <p-card class="h-full">
            <div class="flex align-items-center justify-content-between">
              <div>
                <div class="text-900 text-xl font-semibold">Low Stock Items</div>
                <div class="text-4xl font-bold mt-2">{{ stats().lowStock }}</div>
                <div class="text-red-500 mt-1 text-sm">+{{ stats().lowStockChange }} from yesterday</div>
              </div>
              <span class="pi pi-exclamation-triangle text-3xl text-yellow-500"></span>
            </div>
          </p-card>
        </div>
      </div>

      <!-- Middle section: Recent orders + Categories -->
      <div class="grid">
        <div class="col-12 xl:col-8">
          <p-card header="Recent Orders" class="h-full">
            <p-table [value]="recentOrders()" [tableStyle]="{ 'min-width': '48rem' }" class="w-full">
              <ng-template pTemplate="header">
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th class="text-right">Total</th>
                  <th>Action</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-order>
                <tr>
                  <td>{{ order.id }}</td>
                  <td>{{ order.customer }}</td>
                  <td>{{ order.date | date:'dd/MM/yyyy' }}</td>
                  <td>
                    <p-tag [value]="order.status" [severity]="statusToSeverity(order.status)"></p-tag>
                  </td>
                  <td class="text-right">{{ order.total | currency:'MYR':'RM' }}</td>
                  <td>
                    <button pButton type="button" icon="pi pi-eye" label="View" class="p-button-text p-button-sm" (click)="onPreview(order)"></button>
                  </td>
                </tr>
              </ng-template>
            </p-table>
            <app-invoice-preview-dialog [(visible)]="showInvoiceDialog" [invoice]="invoicePreview" (close)="showInvoiceDialog=false"></app-invoice-preview-dialog>
          </p-card>
        </div>

        <div class="col-12 xl:col-4">
          <p-card header="Top Product Categories" class="h-full">
            <div class="text-500 mb-3">Orders by category this month</div>
            <div class="flex flex-column gap-3">
              <div *ngFor="let c of categories()" class="">
                <div class="flex align-items-center justify-content-between mb-1">
                  <span class="text-900 font-medium">{{ c.name }}</span>
                  <span class="text-700">{{ c.percent }}%</span>
                </div>
                <p-progressBar [value]="c.percent"></p-progressBar>
              </div>
            </div>
            <div class="mt-4 text-900">Total orders this month: <b>{{ totalOrdersThisMonth() | number }}</b></div>
          </p-card>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {
  auth = inject(AuthService);

  // Mock signals (replace with real HTTP later)
  protected readonly stats = signal({
    ordersToday: 247,
    ordersChange: 12,
    revenueToday: 84250,
    revenueChange: 8.5,
    lowStock: 23,
    lowStockChange: 3,
  });

  protected readonly recentOrders = signal<Array<{
    id: string;
    customer: string;
    date: Date;
    status: 'Shipped' | 'Processing' | 'Delivered' | 'Pending';
    total: number;
  }>>([
    { id: 'ORD-2024-001', customer: 'Acme Corporation', date: new Date('2024-01-15'), status: 'Shipped', total: 2450 },
    { id: 'ORD-2024-002', customer: 'Tech Solutions Inc', date: new Date('2024-01-15'), status: 'Processing', total: 1850 },
    { id: 'ORD-2024-003', customer: 'Global Imports Ltd', date: new Date('2024-01-14'), status: 'Delivered', total: 3200 },
    { id: 'ORD-2024-004', customer: 'Metro Supplies', date: new Date('2024-01-14'), status: 'Pending', total: 1125 },
    { id: 'ORD-2024-005', customer: 'Industrial Partners', date: new Date('2024-01-13'), status: 'Shipped', total: 4750 },
  ]);

  protected readonly categories = signal([
    { name: 'Electronics', percent: 42 },
    { name: 'Furniture', percent: 28 },
    { name: 'Clothing', percent: 18 },
    { name: 'Home & Garden', percent: 12 },
  ]);

  protected readonly totalOrdersThisMonth = computed(() => 1247);

  protected statusToSeverity(status: string): 'success' | 'info' | 'warning' | 'danger' | 'secondary' {
    switch (status) {
      case 'Shipped':
        return 'info';
      case 'Delivered':
        return 'success';
      case 'Processing':
        return 'warning';
      case 'Pending':
        return 'secondary';
      default:
        return 'info';
    }
  }

  // Dialog state for invoice preview
  showInvoiceDialog = false;
  invoicePreview: Invoice | null = null;

  onPreview(order: { id: string; customer: string; date: Date; status: 'Shipped' | 'Processing' | 'Delivered' | 'Pending'; total: number; }) {
    // Aim to have invoice grand total ≈ order.total by back-calculating subtotal (before 8% tax)
    const subtotalTargetCents = Math.max(1, Math.round((order.total / 1.08) * 100));
    const items = this.generateInvoiceItemsFromSubtotal(subtotalTargetCents);
    const subtotal = Math.round(items.reduce((s, it) => s + Math.round(it.total * 100), 0)) / 100;
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const total = Math.round((subtotal + tax) * 100) / 100;

    this.invoicePreview = {
      id: `INV-${new Date().getFullYear()}-${(Math.floor(Math.random() * 9000) + 1000).toString()}`,
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

  private generateInvoiceItemsFromSubtotal(subtotalTargetCents: number) {
    type InvoiceItem = { description: string; quantity: number; unitPrice: number; total: number };
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

    const k = 3 + Math.floor(Math.random() * 3); // 3..5 lines
    const base = Math.floor(subtotalTargetCents / k);
    let remainder = subtotalTargetCents % k;
    const lineTotalsCents: number[] = new Array(k).fill(base).map(v => v);
    for (let i = 0; i < k && remainder > 0; i++, remainder--) lineTotalsCents[i] += 1;

    const usedNames = new Set<number>();
    const pickName = () => {
      let idx = Math.floor(Math.random() * productNames.length);
      let guard = 0;
      while (usedNames.has(idx) && guard++ < 10) idx = Math.floor(Math.random() * productNames.length);
      usedNames.add(idx);
      return productNames[idx];
    };

    const quantities: number[] = new Array(k).fill(1);
    // randomly add a few extra quantities to first k-1
    const extraQty = Math.floor(Math.random() * 4);
    for (let i = 0; i < extraQty && k > 1; i++) quantities[Math.floor(Math.random() * (k - 1))] += 1;

    const items: InvoiceItem[] = [];
    for (let i = 0; i < k; i++) {
      const qty = i === k - 1 ? 1 : quantities[i];
      const totalCents = lineTotalsCents[i];
      const unitPriceCents = Math.max(1, Math.round(totalCents / qty));
      items.push({
        description: pickName(),
        quantity: qty,
        unitPrice: Math.round(unitPriceCents) / 100,
        total: Math.round(unitPriceCents * qty) / 100,
      });
    }

    // Adjust last line for any rounding drift to match target exactly
    const currentSubtotalCents = Math.round(items.reduce((s, it) => s + Math.round(it.total * 100), 0));
    const diff = subtotalTargetCents - currentSubtotalCents;
    if (diff !== 0) {
      const last = items[items.length - 1];
      const adjustedTotalCents = Math.max(1, Math.round(last.total * 100) + diff);
      last.unitPrice = Math.round(adjustedTotalCents / last.quantity) / 100;
      last.total = Math.round(last.unitPrice * last.quantity * 100) / 100;
    }

    return items;
  }
}
