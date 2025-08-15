import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard';
import { DashboardLayoutComponent } from '../layout/dashboard-layout/dashboard-layout.component';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'orders', loadChildren: () => import('../orders/orders.routes').then(m => m.ORDERS_ROUTES) },
      { path: 'inventory', loadChildren: () => import('../inventory/inventory.routes').then(m => m.INVENTORY_ROUTES) },
      { path: 'customers', loadChildren: () => import('../customers/customers.routes').then(m => m.CUSTOMERS_ROUTES) },
      { path: 'users', loadChildren: () => import('../users/users.routes').then(m => m.USERS_ROUTES) },
      { path: 'settings', loadChildren: () => import('../settings/settings.routes').then(m => m.SETTINGS_ROUTES) },
      // nanti tambah route Orders, Inventory, etc kat sini
    ]
  }
];
