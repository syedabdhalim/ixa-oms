import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-settings-page',
  imports: [CommonModule],
  template: `
    <div class="p-4">
      <h2 class="text-900" style="font-size:1.5rem; font-weight:600; margin:0">Settings</h2>
      <div class="text-700" style="margin-top:.25rem">Coming soon...</div>
    </div>
  `
})
export class SettingsPageComponent {}


