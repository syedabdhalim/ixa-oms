import { Role } from '../../shared/types/roles';

export interface User {
  id: string;
  email: string;
  role: Role;
  token: string; // mock token for now
}
