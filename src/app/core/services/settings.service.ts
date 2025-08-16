import { Injectable, computed, signal } from '@angular/core';
import { DEFAULT_SETTINGS, Settings } from '../../shared/types/settings';

const STORAGE_KEY = 'ixa_settings';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private _settings = signal<Settings>(this.readFromStorage());
  settings = computed(() => this._settings());

  update(partial: Partial<Settings>) {
    const next: Settings = { ...this._settings(), ...partial };
    this._settings.set(next);
    this.persist(next);
  }

  reset() {
    this._settings.set(DEFAULT_SETTINGS);
    this.persist(DEFAULT_SETTINGS);
  }

  private readFromStorage(): Settings {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_SETTINGS;
      const parsed = JSON.parse(raw) as Partial<Settings>;
      return { ...DEFAULT_SETTINGS, ...parsed } as Settings;
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  private persist(value: Settings) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  }
}


