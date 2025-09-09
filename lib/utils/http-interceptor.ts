import { authService } from "@/lib/services/auth.service";

interface RequestConfig {
  method: string;
  headers: HeadersInit;
  body?: string;
}

interface ResponseData {
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
}

class HttpInterceptor {
  private static instance: HttpInterceptor;
  private isRefreshing = false;
  private refreshPromise: Promise<string | null> | null = null;

  private constructor() {}

  public static getInstance(): HttpInterceptor {
    if (!HttpInterceptor.instance) {
      HttpInterceptor.instance = new HttpInterceptor();
    }
    return HttpInterceptor.instance;
  }

  private async refreshTokenIfNeeded(): Promise<string | null> {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = this.performTokenRefresh();

    try {
      const newToken = await this.refreshPromise;
      return newToken;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  private async performTokenRefresh(): Promise<string | null> {
    try {
      const refreshToken = authService.getRefreshToken();
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await authService.refreshToken(refreshToken);

      // Actualizar tokens en localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", response.access_token);
        if (response.refresh_token) {
          localStorage.setItem("refresh_token", response.refresh_token);
        }
      }

      return response.access_token;
    } catch (error) {
      console.error("Token refresh failed:", error);
      // Limpiar tokens y redirigir al login
      authService.clearTokens();
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
      return null;
    }
  }

  private getAuthHeaders(): HeadersInit {
    const token = authService.getAccessToken();
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async fetch(url: string, config: RequestConfig): Promise<ResponseData> {
    let response = await fetch(url, config);

    // Si recibimos 401, intentar renovar el token
    if (response.status === 401) {
      console.log("Token expired, attempting refresh...");

      const newToken = await this.refreshTokenIfNeeded();

      if (newToken) {
        // Reintentar la petición con el nuevo token
        const newHeaders = {
          ...config.headers,
          Authorization: `Bearer ${newToken}`,
        };

        response = await fetch(url, {
          ...config,
          headers: newHeaders,
        });
      } else {
        // Si no se pudo renovar el token, lanzar error
        throw new Error("Authentication failed: Unable to refresh token");
      }
    }

    return response;
  }
}

export const httpInterceptor = HttpInterceptor.getInstance();
