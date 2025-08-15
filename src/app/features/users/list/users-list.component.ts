import { Component, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import type { Table } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { AvatarModule } from 'primeng/avatar';
import { ROLE_OPTIONS, Role } from '../../../shared/types/roles';
import { UserDialogComponent, UserFormValue } from '../dialog/user-dialog.component';
import { CardModule } from 'primeng/card';

@Component({
  standalone: true,
  selector: 'app-users-list',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    TagModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    AvatarModule,
    UserDialogComponent,
    CardModule
  ],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent {
  @ViewChild('dt') table?: Table;

  showAddDialog = false;

  protected readonly users = signal<Array<UserRow>>([
    {
      id: 'USR-001',
      name: 'John Smith',
      email: 'john.smith@warehouseos.com',
      role: 'Admin',
      status: 'Active',
      lastLogin: new Date('2024-01-15T09:30:00'),
    },
    {
      id: 'USR-002',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@warehouseos.com',
      role: 'Manager',
      status: 'Active',
      lastLogin: new Date('2024-01-15T08:45:00'),
    },
    {
      id: 'USR-003',
      name: 'Mike Chen',
      email: 'mike.chen@warehouseos.com',
      role: 'Staff',
      status: 'Active',
      lastLogin: new Date('2024-01-14T16:20:00'),
    },
    {
      id: 'USR-004',
      name: 'Emily Davis',
      email: 'emily.davis@warehouseos.com',
      role: 'Staff',
      status: 'Active',
      lastLogin: new Date('2024-01-14T15:15:00'),
    },
    {
      id: 'USR-005',
      name: 'Robert Brown',
      email: 'robert.brown@warehouseos.com',
      role: 'Manager',
      status: 'Inactive',
      lastLogin: new Date('2024-01-10T11:10:00'),
    },
    {
      id: 'USR-006',
      name: 'Priya Patel',
      email: 'priya.patel@warehouseos.com',
      role: 'Staff',
      status: 'Active',
      lastLogin: new Date('2024-01-13T12:00:00'),
    },
    {
      id: 'USR-007',
      name: 'Carlos Martinez',
      email: 'carlos.martinez@warehouseos.com',
      role: 'Admin',
      status: 'Active',
      lastLogin: new Date('2024-01-12T10:05:00'),
    },
    {
      id: 'USR-008',
      name: 'Olivia Wilson',
      email: 'olivia.wilson@warehouseos.com',
      role: 'Staff',
      status: 'Inactive',
      lastLogin: new Date('2024-01-08T09:00:00'),
    },
  ]);

  roleOptions = [{ label: 'All Roles', value: null as Role | null }, ...ROLE_OPTIONS.map(r => ({ label: r.label, value: r.value }))];

  statusOptions = [
    { label: 'All Status', value: null as UserRow['status'] | null },
    { label: 'Active', value: 'Active' as const },
    { label: 'Inactive', value: 'Inactive' as const },
  ];

  roleFilter: Role | null = null;
  statusFilter: UserRow['status'] | null = null;

  get totalUsers(): number {
    return this.users().length;
  }

  get activeUsers(): number {
    return this.users().filter(u => u.status === 'Active').length;
  }

  get inactiveUsers(): number {
    return this.users().filter(u => u.status === 'Inactive').length;
  }

  get roleBreakdown(): Array<{ role: Role; count: number }> {
    const roles: Record<Role, number> = { Admin: 0, Manager: 0, Staff: 0, Customer: 0 };
    for (const u of this.users()) roles[u.role]++;
    return (Object.keys(roles) as Role[])
      .filter(r => roles[r] > 0)
      .map(r => ({ role: r, count: roles[r] }));
  }

  onGlobalFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.table?.filterGlobal(value, 'contains');
  }

  onRoleFilter(role: Role | null) {
    if (!role) {
      this.table?.clear();
      if (this.statusFilter) this.table?.filter(this.statusFilter, 'status', 'equals');
      return;
    }
    this.table?.filter(role, 'role', 'equals');
  }

  onStatusFilter(status: UserRow['status'] | null) {
    if (!status) {
      this.table?.clear();
      if (this.roleFilter) this.table?.filter(this.roleFilter, 'role', 'equals');
      return;
    }
    this.table?.filter(status, 'status', 'equals');
  }

  protected statusToSeverity(status: UserRow['status']): 'success' | 'danger' | 'secondary' {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Inactive':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  protected roleToSeverity(role: Role): 'info' | 'success' | 'warning' | 'secondary' {
    switch (role) {
      case 'Admin':
        return 'info';
      case 'Manager':
        return 'warning';
      case 'Staff':
        return 'success';
      default:
        return 'secondary';
    }
  }

  onAddUserClick() {
    this.showAddDialog = true;
  }

  handleDialogCancel() {
    this.showAddDialog = false;
  }

  handleDialogSave(value: UserFormValue) {
    const newUser: UserRow = {
      id: `USR-${(this.users().length + 1).toString().padStart(3, '0')}`,
      name: value.name,
      email: value.email,
      role: value.role,
      status: value.status,
      lastLogin: new Date(),
    };
    this.users.update(list => [newUser, ...list]);
    this.showAddDialog = false;
  }

  getInitials(fullName: string): string {
    return fullName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0]!.toUpperCase())
      .join('');
  }
}

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: 'Active' | 'Inactive';
  lastLogin: Date;
};


