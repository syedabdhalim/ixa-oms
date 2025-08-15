import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';

export type CustomerFormValue = {
  name: string;
  email: string | null;
  phone: string | null;
  website: string | null;
  customerType: 'Business' | 'Enterprise';
  status: 'Active' | 'Inactive' | 'Suspended';
  contactName: string | null;
  jobTitle: string | null;
  street: string;
  city: string;
  state: string;
  zip: string | null;
  country: string;
  taxId: string | null;
  paymentTermsDays: number;
  creditLimit: number | null;
  notes: string | null;
};

@Component({
  selector: 'app-customer-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
  ],
  templateUrl: './customer-dialog.component.html',
  styleUrl: './customer-dialog.component.scss'
})
export class CustomerDialogComponent {
  private readonly fb = inject(FormBuilder);

  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<CustomerFormValue>();
  @Output() cancel = new EventEmitter<void>();

  customerTypeOptions = [
    { label: 'Business', value: 'Business' as const },
    { label: 'Enterprise', value: 'Enterprise' as const },
  ];

  statusOptions = [
    { label: 'Active', value: 'Active' as const },
    { label: 'Inactive', value: 'Inactive' as const },
    { label: 'Suspended', value: 'Suspended' as const },
  ];

  countryOptions = [
    { label: 'United States', value: 'United States' },
    { label: 'Canada', value: 'Canada' },
    { label: 'United Kingdom', value: 'United Kingdom' },
    { label: 'Australia', value: 'Australia' },
  ];

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: this.fb.control<string | null>(null),
    phone: this.fb.control<string | null>(null),
    website: this.fb.control<string | null>(null),
    customerType: this.fb.nonNullable.control<'Business' | 'Enterprise'>('Business', { validators: [Validators.required] }),
    status: this.fb.nonNullable.control<'Active' | 'Inactive' | 'Suspended'>('Active', { validators: [Validators.required] }),
    contactName: this.fb.control<string | null>(null),
    jobTitle: this.fb.control<string | null>(null),
    street: this.fb.nonNullable.control<string>('', { validators: [Validators.required] }),
    city: this.fb.nonNullable.control<string>('', { validators: [Validators.required] }),
    state: this.fb.nonNullable.control<string>('', { validators: [Validators.required] }),
    zip: this.fb.control<string | null>(null),
    country: this.fb.nonNullable.control<string>('United States', { validators: [Validators.required] }),
    taxId: this.fb.control<string | null>(null),
    paymentTermsDays: this.fb.nonNullable.control<number>(30),
    creditLimit: this.fb.control<number | null>(null),
    notes: this.fb.control<string | null>(null),
  });

  onSubmit() {
    if (this.form.invalid) return;
    this.save.emit(this.form.getRawValue());
    this.visibleChange.emit(false);
  }
}


