import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, ValidationErrors, AbstractControl } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';

export type InventoryItemFormValue = {
  name: string;
  sku: string;
  category: string;
  stock: number;
  min: number;
  max: number;
  unitPrice: number;
  location: string;
};

@Component({
  selector: 'app-inventory-item-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DialogModule, InputTextModule, InputNumberModule, ButtonModule, SelectModule, TooltipModule, TagModule],
  templateUrl: './inventory-item-dialog.component.html',
  styleUrl: './inventory-item-dialog.component.scss',
})
export class InventoryItemDialogComponent {
  private readonly fb = inject(FormBuilder);

  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<InventoryItemFormValue>();
  @Output() cancel = new EventEmitter<void>();

  categoryOptions = [
    { label: 'Electronics', value: 'Electronics' },
    { label: 'Furniture', value: 'Furniture' },
    { label: 'Clothing', value: 'Clothing' },
    { label: 'Outdoors', value: 'Outdoors' },
  ];

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    sku: ['', Validators.required],
    category: this.fb.nonNullable.control<string>('Electronics', { validators: [Validators.required] }),
    stock: this.fb.nonNullable.control<number>(0, { validators: [Validators.required, Validators.min(0)] }),
    min: this.fb.nonNullable.control<number>(0, { validators: [Validators.required, Validators.min(0)] }),
    max: this.fb.nonNullable.control<number>(0, { validators: [Validators.required, Validators.min(0)] }),
    unitPrice: this.fb.nonNullable.control<number>(0, { validators: [Validators.required, Validators.min(0)] }),
    location: ['', Validators.required],
  }, { validators: [InventoryItemDialogComponent.minMaxValidator] });

  static minMaxValidator(group: AbstractControl): ValidationErrors | null {
    const min = group.get('min')?.value as number | null;
    const max = group.get('max')?.value as number | null;
    if (min == null || max == null) return null;
    return min > max ? { minMax: true } : null;
  }

  get statusPreview(): 'In Stock' | 'Low Stock' | 'Out of Stock' {
    const stock = Number(this.form.get('stock')?.value ?? 0);
    const min = Number(this.form.get('min')?.value ?? 0);
    if (stock === 0) return 'Out of Stock';
    if (stock <= min) return 'Low Stock';
    return 'In Stock';
  }

  onCancel() {
    this.cancel.emit();
    this.visibleChange.emit(false);
  }

  onSubmit() {
    if (this.form.invalid) return;
    const value: InventoryItemFormValue = this.form.getRawValue();
    this.save.emit(value);
    this.visibleChange.emit(false);
  }
}


