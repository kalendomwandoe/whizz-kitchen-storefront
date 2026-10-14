export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerAuthResult {
  customer: Customer;
  token: string;
}

export interface RegisterCustomerInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginCustomerInput {
  email: string;
  password: string;
}

export interface UpdateCustomerProfileInput {
  name?: string;
  email?: string;
  phone?: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}