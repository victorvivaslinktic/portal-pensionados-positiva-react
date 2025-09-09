import {
  UpdateUserData,
  UpdateUserResponse,
  User,
  EmailVerificationResponse,
} from "@/lib/types/auth.types";
import { httpInterceptor } from "@/lib/utils/http-interceptor";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://bdggw7se0m.execute-api.us-east-1.amazonaws.com/prod";

export class UserService {
  private static instance: UserService;

  private constructor() {}

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  private getAuthHeaders(): HeadersInit {
    const token = this.getAccessToken();
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private getAccessToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("access_token");
    }
    return null;
  }

  async getProfile(): Promise<User> {
    try {
      const response = await httpInterceptor.fetch(`${API_URL}/api/me`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error((data as { message: string })?.message || "Error al obtener el perfil");
      }

      return data as User;
    } catch (error) {
      console.error("Error getting profile:", error);
      throw error;
    }
  }

  async updateProfile(userData: UpdateUserData): Promise<UpdateUserResponse> {
    try {
      const response = await httpInterceptor.fetch(`${API_URL}/api/users/me`, {
        method: "PATCH",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error((data as { message: string })?.message || "Error al obtener el perfil");
      }

      return data as UpdateUserResponse;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  }

  async verifyEmailRequest(identifier: string): Promise<EmailVerificationResponse> {
    try {
      const response = await fetch(`${API_URL}/api/users/verify/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al solicitar verificación de email");
      }

      return data;
    } catch (error) {
      console.error("Error requesting email verification:", error);
      throw error;
    }
  }

  async verifyEmailConfirm(token: string): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_URL}/api/users/verify/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al confirmar verificación de email");
      }

      return data;
    } catch (error) {
      console.error("Error confirming email verification:", error);
      throw error;
    }
  }
}

export const userService = UserService.getInstance();
