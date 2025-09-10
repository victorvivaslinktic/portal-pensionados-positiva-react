// Tipos de autenticación
export interface LoginCredentials {
  identifier: string;
  password: string;
  document_type?: string;
}

export interface LoginResponse {
  success?: boolean;
  message?: string;
  two_factor_required?: boolean;
  transaction_id?: string;
  expires_in?: number;
  access_token?: string;
  refresh_token?: string;
}

export interface Verify2FAPayload {
  transaction_id: string;
  code: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
}

// Tipos de usuario
export interface User {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
  doc: {
    type: string;
    number: string;
  };
  first_name: string;
  last_name: string;
  phone_number: string;
  status: "ACTIVE" | "INACTIVE";
  email_verified: boolean;
  data_update: boolean;
}

export interface UserInfo {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
  doc: {
    type: string;
    number: string;
  };
}

// Tipos de verificación de email
export interface VerifyEmailRequest {
  identifier: string;
}

export interface VerifyEmailConfirm {
  token: string;
}

// Tipos de actualización de usuario
export interface UpdateUserData {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
}

export interface UpdateUserResponse {
  updated: string[];
  data_update: boolean;
}

// Tipos de recuperación de contraseña
export interface PasswordResetRequest {
  document_type: string;
  document_number: string;
}

export interface PasswordResetResponse {
  message: string;
  email?: string;
}

export interface EmailVerificationResponse {
  message: string;
  email?: string;
}

export interface PasswordResetConfirm {
  token: string;
  new_password: string;
}

// Tipos de documentos
export interface SendDocumentRequest {
  type: "CIR" | "CVP" | "DPP";
  month: string;
}

export interface SendDocumentAttributes {
  found: boolean;
  queued: boolean;
  email?: string;
}

export interface SendDocumentResponse {
  data: {
    type: string;
    id: string;
    attributes: SendDocumentAttributes;
  };
}

// Tipos de errores
export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

// Estados de autenticación
export type AuthStep = "login" | "verify" | "2fa" | "update" | "recover" | "reset";

export interface AuthState {
  // Estados de autenticación
  isAuthenticated: boolean;
  user: User | null;
  tokens: {
    access: string;
    refresh: string;
  } | null;

  // Estados de flujo
  currentStep: AuthStep;
  transactionId: string | null;
  expiresIn: number | null;

  // Datos temporales
  loginData: LoginCredentials | null;
  userData: UpdateUserData | null;
  recoveryEmail: string | null;
  recoveryData: { document_type: string; document_number: string } | null;
}

// Tipos de documento
export interface DocumentType {
  value: string;
  label: string;
  label2?: string;
}

export const DOCUMENT_TYPES: DocumentType[] = [
  { value: "CC", label: "Cédula de ciudadanía", label2: "C.C." },
  { value: "CE", label: "Cédula de extranjería", label2: "C.E." },
  { value: "PT", label: "Permiso por protección temporal", label2: "P.T." },
  { value: "TI", label: "Tarjeta de identidad", label2: "T.I." },
  { value: "RC", label: "Registro civil", label2: "R.C." },
  // { value: "PA", label: "Pasaporte", label2: "P.A." },
  // { value: "NIT", label: "NIT" },
];
