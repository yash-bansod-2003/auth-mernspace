import { Request } from "express";

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;
  tenantId?: number;
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

export interface UserCreateRequest extends AuthenticatedRequest {
  body: UserData;
}

export interface UserRequestWithParama extends UserCreateRequest {
  params: {
    id: string;
  };
}
