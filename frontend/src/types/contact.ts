export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  createdAt: Date;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
}
