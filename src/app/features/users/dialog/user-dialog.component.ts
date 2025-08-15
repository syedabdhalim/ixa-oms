import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { ROLE_OPTIONS, Role } from '../../../shared/types/roles';

export type UserFormValue = {
  name: string;
  email: string;
  role: Role;
  status: 'Active' | 'Inactive';
};

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
    SelectModule,
    ButtonModule,
  ],
  templateUrl: './user-dialog.component.html',
  styleUrl: './user-dialog.component.scss'
})
export class UserDialogComponent {
  private readonly fb = inject(FormBuilder);

  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<UserFormValue>();
  @Output() cancel = new EventEmitter<void>();

  roleOptions = ROLE_OPTIONS.map(r => ({ label: r.label, value: r.value }));
  statusOptions = [
    { label: 'Active', value: 'Active' as const },
    { label: 'Inactive', value: 'Inactive' as const },
  ];

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role: this.fb.nonNullable.control<Role>('Staff', { validators: [Validators.required] }),
    status: this.fb.nonNullable.control<'Active' | 'Inactive'>('Active', { validators: [Validators.required] }),
  });

  onCancel() {
    this.cancel.emit();
    this.visibleChange.emit(false);
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.save.emit(this.form.getRawValue());
    this.visibleChange.emit(false);
  }
}


