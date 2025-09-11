import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth.store";
import { authService } from "@/lib/services/auth.service";

export function useAuthCheck() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, tokens, logout } = useAuthStore();
  const isCheckingRef = useRef(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (isCheckingRef.current) return;
      isCheckingRef.current = true;

      try {
        // Dar tiempo a que se complete la hidratación
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Obtener el estado más reciente del store
        const currentState = useAuthStore.getState();

        // Verificar autenticación con el estado más reciente
        if (!currentState.isAuthenticated || !currentState.tokens?.access) {
          console.log("No authentication or tokens, redirecting to login");
          logout();
          router.push("/auth/login");
          return;
        }

        const accessToken = currentState.tokens.access;

        try {
          const payload = JSON.parse(atob(accessToken.split(".")[1])) as Record<string, unknown>;
          const requiresPasswordChange = Boolean(
            (payload as Record<string, unknown>).force_password_change
          );
          const requiresDataUpdate = Boolean((payload as Record<string, unknown>).data_update);

          if (requiresPasswordChange && pathname !== "/auth/change-password") {
            useAuthStore.getState().setCurrentStep("reset");
            router.push("/auth/change-password");
            return;
          }

          if (
            requiresDataUpdate &&
            pathname !== "/auth/update" &&
            !pathname?.startsWith("/auth/")
          ) {
            useAuthStore.getState().setCurrentStep("update");
            router.push("/auth/update");
            return;
          }
        } catch {
          console.log("Error decoding access token");
        }

        if (authService.isTokenExpired(accessToken)) {
          console.log("Access token expired, attempting refresh...");
          const refreshToken = currentState.tokens.refresh;
          if (!refreshToken || authService.isTokenExpired(refreshToken)) {
            console.log("Refresh token also expired or missing, logging out");
            logout();
            router.push("/auth/login");
            return;
          }

          try {
            const response = await authService.refreshToken(refreshToken);
            console.log("Token refreshed successfully");
            useAuthStore
              .getState()
              .updateTokens(response.access_token, response.refresh_token as string);

            if (typeof window !== "undefined") {
              localStorage.setItem("access_token", response.access_token);
              if (response.refresh_token) {
                localStorage.setItem("refresh_token", response.refresh_token);
              }
            }
          } catch (error) {
            console.error("Failed to refresh token:", error);
            logout();
            router.push("/auth/login");
          }
        }
      } finally {
        isCheckingRef.current = false;
      }
    };

    checkAuth();
  }, [isAuthenticated, tokens?.access, tokens?.refresh, logout, router]);
}
