import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Role } from '../../../shared/types/roles';
import { IconFieldModule } from 'primeng/iconfield';
import { NgClass } from '@angular/common';

interface NavItem {
  name: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, NgClass],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @Input() isOpen = true;
  @Input() userRole: Role = 'Admin';
  @Output() closeSidebar = new EventEmitter<void>();

  private allNav: NavItem[] = [
    { name: 'Dashboard', path: '/dashboard', icon: 'pi pi-chart-bar' },
    { name: 'Orders', path: '/orders', icon: 'pi pi-shopping-cart' },
    { name: 'Inventory', path: '/inventory', icon: 'pi pi-box' },
    { name: 'Customers', path: '/customers', icon: 'pi pi-users' },
    { name: 'Users', path: '/users', icon: 'pi pi-user' },
    { name: 'Settings', path: '/settings', icon: 'pi pi-cog' },
  ];

  private customerNav: NavItem[] = [
    { name: 'Dashboard', path: '/customer/dashboard', icon: 'pi pi-chart-bar' },
    { name: 'Invoices', path: '/customer/invoices', icon: 'pi pi-file' },
    { name: 'Profile', path: '/customer/profile', icon: 'pi pi-user' },
  ];

  get navItems(): NavItem[] {
    if (this.userRole === 'Customer') return this.customerNav;
    switch (this.userRole) {
      case 'Staff':
        return this.allNav.filter(x => x.name === 'Orders');
      case 'Manager':
        return this.allNav.filter(x => ['Dashboard','Orders','Inventory'].includes(x.name));
      default:
        return this.allNav;
    }
  }

  isActive(path: string) {
    return location.pathname === path;
  }
}
