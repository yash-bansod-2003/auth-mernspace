import { Request } from "express";

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;
}

interface TenantData {
  name: string;
  address: string;
}

export interface AuthenticatedRequest extends Request {
  auth: {
    sub: string;
    role: string;
    jti: string;
  };
}
