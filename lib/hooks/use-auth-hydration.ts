import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/stores/auth.store";

export function useAuthHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window === "undefined") return;

    const hydrateAuth = () => {
      try {
        // Verificar si hay tokens en localStorage
        const accessToken = localStorage.getItem("access_token");
        const refreshToken = localStorage.getItem("refresh_token");
        const { isAuthenticated, tokens } = useAuthStore.getState();

        // Si hay tokens en localStorage pero no en el store, restaurarlos
        if (accessToken && refreshToken && (!isAuthenticated || !tokens)) {
          console.log("Restoring tokens from localStorage...");

          // Decodificar el JWT para obtener la información del usuario
          const payload = JSON.parse(atob(accessToken.split(".")[1]));

          const user = {
            id: payload.sub,
            email: payload.email,
            role: payload.role,
            doc: payload.doc,
            first_name: payload.first_name,
            last_name: payload.last_name,
            phone_number: payload.phone_number,
            status: payload.status,
            email_verified: payload.email_verified,
            data_update: payload.data_update,
          };

          // Restaurar el estado de autenticación SIN limpiar localStorage
          useAuthStore.setState({
            isAuthenticated: true,
            user,
            tokens: {
              access: accessToken,
              refresh: refreshToken,
            },
            currentStep: "login",
          });

          console.log("Tokens restored successfully");
        }
      } catch (error) {
        console.error("Error during hydration:", error);
        // Solo limpiar si hay un error real de parsing
        if (error instanceof SyntaxError) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        }
      } finally {
        setIsHydrated(true);
      }
    };

    // Ejecutar hidratación inmediatamente
    hydrateAuth();
  }, []);

  return isHydrated;
}
