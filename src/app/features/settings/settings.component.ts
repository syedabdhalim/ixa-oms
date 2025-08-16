import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../../core/services/settings.service';
import { DEFAULT_SETTINGS, Settings } from '../../shared/types/settings';

@Component({
  standalone: true,
  selector: 'app-settings-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsPageComponent {
  settingsService = inject(SettingsService);
  draft = signal<Settings>({ ...this.settingsService.settings() });

  currencyOptions = [
    { label: 'MYR - Malaysian Ringgit', value: 'MYR' },
    { label: 'SGD - Singapore Dollar', value: 'SGD' },
    { label: 'USD - US Dollar', value: 'USD' },
    { label: 'EUR - Euro', value: 'EUR' },
  ];

  localeOptions = [
    { label: 'Malay (Malaysia) - ms-MY', value: 'ms-MY' },
    { label: 'English (Malaysia) - en-MY', value: 'en-MY' },
    { label: 'English (US) - en-US', value: 'en-US' },
    { label: 'English (Singapore) - en-SG', value: 'en-SG' },
  ];

  dateFormatOptions = [
    { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
    { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' },
    { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' },
  ];

  toNumber(value: unknown, fallback: number): number {
    const n = typeof value === 'number' ? value : parseFloat(String(value));
    return Number.isFinite(n) ? n : fallback;
  }

  clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  reset() {
    this.draft.set(DEFAULT_SETTINGS);
  }

  updateDraft(partial: Partial<Settings>) {
    this.draft.update(current => ({ ...current, ...partial }));
  }

  save() {
    this.settingsService.update(this.draft());
  }
}


