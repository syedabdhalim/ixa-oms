import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, TagModule, TableModule, ProgressBarModule, ButtonModule],
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
                    <button pButton type="button" icon="pi pi-eye" label="View" class="p-button-text p-button-sm"></button>
                  </td>
                </tr>
              </ng-template>
            </p-table>
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
}
