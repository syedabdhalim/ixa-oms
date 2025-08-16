import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { Role } from '../../../shared/types/roles';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, HeaderComponent],
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss']
})
export class DashboardLayoutComponent {
  auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  sidebarOpen = false;

  // Derive page title from the current primary child route path
  pageTitle = signal('Dashboard');

  constructor() {
    // Set initial title
    this.pageTitle.set(this.computeTitleFromUrl());
    // Update title on every navigation end
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.pageTitle.set(this.computeTitleFromUrl());
      }
    });
  }

  private computeTitleFromUrl(): string {
    const cleanUrl = this.router.url.split('?')[0].split('#')[0];
    const trimmed = cleanUrl.replace(/^\/+/, '');
    const path = (trimmed.split('/')[0] || '').toLowerCase();
    const map: Record<string, string> = {
      'dashboard': 'Dashboard',
      'orders': 'Orders',
      'inventory': 'Inventory Management',
      'customers': 'Customers',
      'users': 'Users',
      'settings': 'Settings',
      '': 'Dashboard',
    };
    return map[path] ?? this.toTitleCase(path || 'Dashboard');
  }

  private toTitleCase(text: string): string {
    return text.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  get userRole(): Role {
    return this.auth.role() ?? 'Admin';
  }

  handleLogout() {
    this.auth.logout();
  }
}
