export interface Settings {
  // Approvals
  requireApproval: boolean;
  maxAutoApproveAmount: number; // in MYR
  maxDiscountPercent: number;   // 0-100
  allowPriceOverride: boolean;

  // Company profile
  companyName: string;
  companyRegistrationNo: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyWebsite: string;
  companyLogoUrl: string;

  // Currency & locale
  currencyCode: string; // e.g., MYR
  locale: string;       // e.g., ms-MY
  dateFormat: string;   // e.g., DD/MM/YYYY

  // Document numbering
  orderPrefix: string;
  orderNextNumber: number;
  invoicePrefix: string;
  invoiceNextNumber: number;
  resetNumbersAnnually: boolean;

  // Invoicing text
  invoiceNotes: string;
  invoiceFooter: string;
  showCompanyLogoOnDocs: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  // Approvals
  requireApproval: false,
  maxAutoApproveAmount: 10000,
  maxDiscountPercent: 20,
  allowPriceOverride: false,

  // Company profile
  companyName: 'IXA Sdn Bhd',
  companyRegistrationNo: '',
  companyAddress: '',
  companyPhone: '',
  companyEmail: '',
  companyWebsite: '',
  companyLogoUrl: '',

  // Currency & locale
  currencyCode: 'MYR',
  locale: 'ms-MY',
  dateFormat: 'DD/MM/YYYY',

  // Document numbering
  orderPrefix: 'SO-',
  orderNextNumber: 1001,
  invoicePrefix: 'INV-',
  invoiceNextNumber: 1001,
  resetNumbersAnnually: true,

  // Invoicing text
  invoiceNotes: '',
  invoiceFooter: 'Thank you for your business.',
  showCompanyLogoOnDocs: true,
};


