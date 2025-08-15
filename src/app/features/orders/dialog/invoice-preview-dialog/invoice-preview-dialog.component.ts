import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';

export type InvoiceItem = {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

export type Invoice = {
  id: string;
  customerName: string;
  customerEmail?: string | null;
  deliveryAddress: string;
  amount: number;
  issueDate: Date;
  dueDate: Date;
  status: 'Unpaid' | 'Paid' | 'Overdue';
  items: Array<InvoiceItem>;
  subtotal: number;
  tax: number;
  total: number;
  paidDate?: Date;
  paymentMethod?: string;
};

@Component({
  selector: 'app-invoice-preview-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, TableModule, TagModule, CardModule, DatePipe, CurrencyPipe],
  templateUrl: './invoice-preview-dialog.component.html',
  styleUrl: './invoice-preview-dialog.component.scss',
})
export class InvoicePreviewDialogComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() close = new EventEmitter<void>();

  @Input() invoice: Invoice | null = null;

  onHide() {
    this.close.emit();
    this.visibleChange.emit(false);
  }

  print() {
    window.print();
  }

  download() {
    // Placeholder hook where real PDF generation can be integrated later
    // For now, invoke print dialog which users can save as PDF
    window.print();
  }
}



