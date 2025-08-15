import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Role } from '../../../shared/types/roles';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() userRole: Role = 'Admin';
  @Output() menuClick = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  get roleDisplayName() {
    return this.userRole === 'Customer' ? 'Customer Portal' : `IXA OMS ${this.userRole}`;
  }

  pageTitle = 'Dashboard'; // Nanti kita boleh kira ikut route
}
