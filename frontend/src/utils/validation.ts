import { ContactFormData, FormErrors } from "@/types/contact";

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // Allow digits, spaces, dashes, parentheses, and plus sign
  const phoneRegex = /^[\d\s\-\(\)\+]+$/;
  return phone.length >= 7 && phoneRegex.test(phone);
};

export const validateForm = (data: ContactFormData): FormErrors => {
  const errors: FormErrors = {};

  if (!data.name.trim()) {
    errors.name = "Name is required";
  } else if (data.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  } else if (data.name.trim().length > 100) {
    errors.name = "Name must be less than 100 characters";
  }

  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!validateEmail(data.email.trim())) {
    errors.email = "Please enter a valid email address";
  } else if (data.email.trim().length > 255) {
    errors.email = "Email must be less than 255 characters";
  }

  if (!data.phone.trim()) {
    errors.phone = "Phone number is required";
  } else if (!validatePhone(data.phone.trim())) {
    errors.phone = "Please enter a valid phone number";
  }

  return errors;
};

export const isFormValid = (errors: FormErrors): boolean => {
  return Object.keys(errors).length === 0;
};
