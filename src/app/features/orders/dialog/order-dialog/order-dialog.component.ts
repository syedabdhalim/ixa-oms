import { Component, EventEmitter, Input, Output, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';

export type OrderItemFormValue = {
  productId: string | null;
  quantity: number;
  price: number;
};

export type OrderFormValue = {
  customerName: string;
  phoneNumber: string;
  orderDate: Date;
  deliveryAddress: string;
  items: Array<OrderItemFormValue>;
  paymentMethod: 'Bank Transfer' | 'Credit Card' | 'Cash';
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  totalAmount: number;
};

type ProductOption = { id: string; name: string; price: number };

@Component({
  selector: 'app-order-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    DatePickerModule,
    ButtonModule,
    SelectModule,
  ],
  templateUrl: './order-dialog.component.html',
  styleUrl: './order-dialog.component.scss',
})
export class OrderDialogComponent {
  private readonly fb = inject(FormBuilder);

  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<OrderFormValue>();
  @Output() cancel = new EventEmitter<void>();

  // Mock product options for selection; in real app this can be injected from a service
  protected readonly productOptions: Array<ProductOption> = [
    { id: 'P-100', name: 'Widget A', price: 25 },
    { id: 'P-200', name: 'Widget B', price: 45 },
    { id: 'P-300', name: 'Widget C', price: 70 },
  ];

  paymentMethodOptions = [
    { label: 'Bank Transfer', value: 'Bank Transfer' as const },
    { label: 'Credit Card', value: 'Credit Card' as const },
    { label: 'Cash', value: 'Cash' as const },
  ];

  paymentStatusOptions = [
    { label: 'Pending', value: 'Pending' as const },
    { label: 'Paid', value: 'Paid' as const },
    { label: 'Failed', value: 'Failed' as const },
  ];

  form = this.fb.nonNullable.group({
    customerName: ['', Validators.required],
    phoneNumber: ['', Validators.required],
    orderDate: this.fb.nonNullable.control<Date>(new Date(), { validators: [Validators.required] }),
    deliveryAddress: ['', Validators.required],
    items: this.fb.nonNullable.array([] as Array<ReturnType<typeof this.createItemGroup>>),
    paymentMethod: this.fb.nonNullable.control<'Bank Transfer' | 'Credit Card' | 'Cash'>('Bank Transfer', { validators: [Validators.required] }),
    paymentStatus: this.fb.nonNullable.control<'Pending' | 'Paid' | 'Failed'>('Pending', { validators: [Validators.required] }),
    totalAmount: this.fb.nonNullable.control<number>(0),
  });

  constructor() {
    // initialize with one blank item row
    this.addItem();

    // Recalculate totals when items change
    this.items.valueChanges.subscribe(() => this.recalculateTotals());
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  createItemGroup() {
    return this.fb.nonNullable.group({
      productId: this.fb.control<string | null>(null, { validators: [Validators.required] }),
      quantity: this.fb.nonNullable.control<number>(1, { validators: [Validators.required, Validators.min(1)] }),
      price: this.fb.nonNullable.control<number>(0, { validators: [Validators.required, Validators.min(0)] }),
    });
  }

  addItem() {
    this.items.push(this.createItemGroup());
  }

  removeItem(index: number) {
    this.items.removeAt(index);
    this.recalculateTotals();
  }

  onSelectProduct(index: number) {
    const ctrl = this.items.at(index);
    const productId = ctrl.get('productId')?.value as string | null;
    const product = this.productOptions.find(p => p.id === productId);
    if (product) {
      ctrl.get('price')?.setValue(product.price);
      this.recalculateTotals();
    }
  }

  protected getItemSubtotal(index: number): number {
    const ctrl = this.items.at(index);
    const quantity = Number(ctrl.get('quantity')?.value ?? 0);
    const price = Number(ctrl.get('price')?.value ?? 0);
    return quantity * price;
  }

  protected recalculateTotals() {
    const total = this.items.controls.reduce((sum, _, idx) => sum + this.getItemSubtotal(idx), 0);
    this.form.get('totalAmount')?.setValue(total);
  }

  onCancel() {
    this.cancel.emit();
    this.visibleChange.emit(false);
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.recalculateTotals();
    const value: OrderFormValue = this.form.getRawValue();
    this.save.emit(value);

    console.log(value)
    this.visibleChange.emit(false);
  }
}



