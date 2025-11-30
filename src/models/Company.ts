export interface Company {
  uid: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  industry: string;
  description: string;
  website?: string;
  consent: boolean;
  createdAt: number;
}
