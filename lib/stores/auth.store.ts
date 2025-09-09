import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  User,
  AuthState,
  AuthStep,
  LoginCredentials,
  UpdateUserData,
} from "@/lib/types/auth.types";

interface AuthStore extends AuthState {
  login: (accessToken: string, refreshToken: string, user: User) => void;
  logout: () => void;
  updateTokens: (accessToken: string, refreshToken: string) => void;
  updateUser: (user: User) => void;

  setCurrentStep: (step: AuthStep) => void;
  setTransactionId: (transactionId: string | null) => void;
  setExpiresIn: (expiresIn: number | null) => void;

  setLoginData: (data: LoginCredentials | null) => void;
  setUserData: (data: UpdateUserData | null) => void;
  setRecoveryEmail: (email: string | null) => void;
  setRecoveryData: (data: { document_type: string; document_number: string } | null) => void;

  clearAuth: () => void;
  isTokenExpired: () => boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  tokens: null,
  currentStep: "login",
  transactionId: null,
  expiresIn: null,
  loginData: null,
  userData: null,
  recoveryEmail: null,
  recoveryData: null,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      login: (accessToken: string, refreshToken: string, user: User) => {
        set({
          isAuthenticated: true,
          user,
          tokens: {
            access: accessToken,
            refresh: refreshToken,
          },
          currentStep: "login",
        });

        if (typeof window !== "undefined") {
          localStorage.setItem("access_token", accessToken);
          localStorage.setItem("refresh_token", refreshToken);
        }
      },

      logout: () => {
        set(initialState);

        // Limpiar localStorage
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        }
      },

      updateTokens: (accessToken: string, refreshToken: string) => {
        set(() => ({
          tokens: {
            access: accessToken,
            refresh: refreshToken,
          },
        }));

        if (typeof window !== "undefined") {
          localStorage.setItem("access_token", accessToken);
          if (refreshToken) {
            localStorage.setItem("refresh_token", refreshToken);
          }
        }
      },

      updateUser: (user: User) => {
        set({ user });
      },

      setCurrentStep: (step: AuthStep) => {
        set({ currentStep: step });
      },

      setTransactionId: (transactionId: string | null) => {
        set({ transactionId });
      },

      setExpiresIn: (expiresIn: number | null) => {
        set({ expiresIn });
      },

      setLoginData: (data: LoginCredentials | null) => {
        set({ loginData: data });
      },

      setUserData: (data: UpdateUserData | null) => {
        set({ userData: data });
      },

      setRecoveryEmail: (email: string | null) => {
        set({ recoveryEmail: email });
      },

      setRecoveryData: (data: { document_type: string; document_number: string } | null) => {
        set({ recoveryData: data });
      },

      clearAuth: () => {
        set(initialState);
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        }
      },

      isTokenExpired: () => {
        const { tokens } = get();
        if (!tokens?.access) return true;

        try {
          const payload = JSON.parse(atob(tokens.access.split(".")[1]));
          const now = Math.floor(Date.now() / 1000);
          return payload.exp < now;
        } catch {
          return true;
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        tokens: state.tokens,
      }),
      onRehydrateStorage: () => (state) => {
        console.log("Auth store rehydrated:", state);
      },
    }
  )
);
