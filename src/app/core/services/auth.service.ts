import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { Role } from '../../shared/types/roles';

const STORAGE_KEY = 'ixa_auth_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
  private _user = signal<User | null>(this.readFromStorage());
  user = computed(() => this._user());
  isAuthenticated = computed(() => !!this._user());
  role = computed<Role | null>(() => this._user()?.role ?? null);

  login(email: string, _password: string, role: Role) {
    // mock: accept any password
    const user: User = {
      id: crypto.randomUUID(),
      email,
      role,
      token: 'mock-' + Math.random().toString(36).slice(2),
    };
    this._user.set(user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }

  logout() {
    this._user.set(null);
    localStorage.removeItem(STORAGE_KEY);
    this.router.navigateByUrl('/login');
  }

  private readFromStorage(): User | null {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch { return null; }
  }
}
