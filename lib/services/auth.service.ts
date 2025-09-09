import {
  LoginCredentials,
  LoginResponse,
  Verify2FAPayload,
  RefreshTokenResponse,
  UserInfo,
} from "@/lib/types/auth.types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://bdggw7se0m.execute-api.us-east-1.amazonaws.com/prod";

export class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public decodeJWT(token: string): Record<string, unknown> | null {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload;
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return null;
    }
  }

  private extractUserFromToken(accessToken: string): UserInfo | null {
    const payload = this.decodeJWT(accessToken);
    if (!payload) return null;

    return {
      id: (payload.sub as string) || "",
      email: (payload.email as string) || "",
      role: (payload.role as "USER" | "ADMIN") || "USER",
      doc: (payload.doc as { type: string; number: string }) || { type: "", number: "" },
    };
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error en el inicio de sesión");
      }

      return data;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  }

  async verify2FA(payload: Verify2FAPayload): Promise<LoginResponse> {
    try {
      // Validar payload
      if (!payload.transaction_id || !payload.code) {
        throw new Error("Transaction ID y código son requeridos");
      }

      // Validar formato del código (6 dígitos)
      if (!/^\d{6}$/.test(payload.code)) {
        throw new Error("Formato de código inválido. Debe ser de 6 dígitos");
      }

      const response = await fetch(`${API_URL}/api/2fa/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error en la verificación 2FA");
      }

      const user = this.extractUserFromToken(data.access_token);
      if (!user) {
        throw new Error("Error al procesar la información del usuario");
      }

      return {
        success: true,
        message: data.message || "Verificación 2FA exitosa",
        expires_in: data.expires_in,
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      };
    } catch (error) {
      console.error("Error during 2FA verification:", error);
      throw error instanceof Error ? error : new Error("Error en la verificación 2FA");
    }
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    try {
      const response = await fetch(`${API_URL}/api/token/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al refrescar el token");
      }

      return {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in,
      };
    } catch (error) {
      console.error("Error during token refresh:", error);
      throw error instanceof Error ? error : new Error("Error al refrescar el token");
    }
  }

  async logout(refreshToken?: string): Promise<void> {
    try {
      if (refreshToken) {
        const response = await fetch(`${API_URL}/api/token/revoke`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (!response.ok) {
          const data = await response.json();
          console.warn("Error al revocar token:", data.message);
        }
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }

  // Utilidades
  getAccessToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("access_token");
    }
    return null;
  }

  getRefreshToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("refresh_token");
    }
    return null;
  }

  clearTokens(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = this.decodeJWT(token);
      if (!payload || !payload.exp) return true;

      const now = Math.floor(Date.now() / 1000);
      return (payload.exp as number) < now;
    } catch {
      return true;
    }
  }
}

export const authService = AuthService.getInstance();
