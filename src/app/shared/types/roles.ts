export type Role = 'Admin' | 'Manager' | 'Staff' | 'Customer';

export const ROLE_OPTIONS: { value: Role; label: string; description: string }[] = [
  { value: 'Admin',   label: 'Admin',   description: 'Full system access' },
  { value: 'Manager', label: 'Manager', description: 'Inventory & Orders access' },
  { value: 'Staff',   label: 'Staff',   description: 'Orders access only' },
  { value: 'Customer',label: 'Customer',description: 'Invoice & profile access' },
];
