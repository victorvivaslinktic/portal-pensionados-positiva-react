import {
  PasswordResetRequest,
  PasswordResetConfirm,
  PasswordResetResponse,
} from "@/lib/types/auth.types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://bdggw7se0m.execute-api.us-east-1.amazonaws.com/prod";

export class PasswordService {
  private static instance: PasswordService;

  private constructor() {}

  public static getInstance(): PasswordService {
    if (!PasswordService.instance) {
      PasswordService.instance = new PasswordService();
    }
    return PasswordService.instance;
  }

  async requestPasswordReset(request: PasswordResetRequest): Promise<PasswordResetResponse> {
    try {
      const response = await fetch(`${API_URL}/api/password/reset/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al solicitar el restablecimiento de contraseña");
      }

      return data;
    } catch (error) {
      console.error("Error requesting password reset:", error);
      throw error;
    }
  }

  async confirmPasswordReset(confirm: PasswordResetConfirm): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_URL}/api/password/reset/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(confirm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al confirmar el restablecimiento de contraseña");
      }

      return data;
    } catch (error) {
      console.error("Error confirming password reset:", error);
      throw error;
    }
  }
}

export const passwordService = PasswordService.getInstance();
