"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronsRight, AlertCircle } from "lucide-react";
import { AuthCard } from "@/components/auth/auth-card";
import { CustomButton } from "@/components/ui/custom-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { PasswordRequirements } from "@/components/ui/password-requirements";
import { usePasswordValidation } from "@/lib/hooks/use-password-validation";
import { toast } from "@/lib/stores/toast-store";
import { useAuthStore } from "@/lib/stores/auth.store";
import { passwordService } from "@/lib/services/password.service";
import { authService } from "@/lib/services/auth.service";
import { generateSecurePassword } from "@/lib/utils/generate-password";
import Image from "next/image";
import IconReload from "@/public/icon-reload.svg";
import IconArrowLeft from "@/public/icon-arrow-left.svg";

interface TokenClaims {
  email_verified?: boolean;
  data_update?: boolean;
  force_password_change?: boolean;
  doc?: {
    type: string;
    number: string;
  };
  email?: string;
  [key: string]: unknown;
}

export default function ChangePasswordPage() {
  const router = useRouter();
  const { tokens, setCurrentStep, updateTokens, user, updateUser } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [tokenRequested, setTokenRequested] = useState(false);
  const [touched, setTouched] = useState({
    token: false,
    newPassword: false,
    confirmPassword: false,
  });

  const passwordValidation = usePasswordValidation(newPassword);
  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;
  const tokenValid = token.trim().length > 0;

  useEffect(() => {
    const requestToken = async () => {
      if (tokenRequested || !tokens?.access) {
        if (!tokens?.access) {
          toast.error("Error", "No hay sesión activa");
          router.push("/auth/login");
        } else if (tokenRequested) {
          toast.info(
            "Solicitud de código en curso",
            "Ya se ha solicitado un código de cambio de contraseña. Por favor, revisa tu correo electrónico o intenta reenviar el código si no lo has recibido."
          );
        }
        return;
      }

      try {
        const payload = JSON.parse(atob(tokens.access.split(".")[1])) as TokenClaims;

        if (!payload.doc?.type || !payload.doc?.number) {
          toast.error("Error", "Información de documento no disponible");
          router.push("/auth/login");
          return;
        }

        setUserEmail(payload.email || null);
        setTokenRequested(true);

        await passwordService.requestPasswordChange({
          document_type: payload.doc.type,
          document_number: payload.doc.number,
        });

        toast.success(
          "Código enviado",
          "Revisa tu correo electrónico para el código de cambio de contraseña"
        );
      } catch (error: unknown) {
        console.error("Error requesting password change token:", error);
        toast.error(
          "Error",
          (error as Error).message || "Error al solicitar el código de cambio de contraseña"
        );
        setTokenRequested(false);
      }
    };

    requestToken();
  }, [tokens, router, tokenRequested]);

  const handleTokenChange = (value: string) => {
    setToken(value);
    if (tokenError) {
      setTokenError(null);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      token: true,
      newPassword: true,
      confirmPassword: true,
    });

    setTokenError(null);

    if (!tokenValid) {
      toast.error("Código requerido", "Por favor ingresa el código de verificación.");
      return;
    }

    if (!passwordValidation.isValid) {
      toast.error("Contraseña inválida", "La contraseña no cumple con todos los requisitos.");
      return;
    }

    if (!passwordsMatch) {
      toast.error("Contraseñas no coinciden", "Las contraseñas ingresadas no son iguales.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await passwordService.confirmPasswordChange({
        token: token.trim(),
        new_password: newPassword,
      });

      // Actualizar tokens si vienen en la respuesta
      let requiresDataUpdate = user?.data_update ?? false;
      if (response.access_token) {
        const nextAccess = response.access_token;
        const nextRefresh = response.refresh_token ?? tokens?.refresh ?? "";
        updateTokens(nextAccess, nextRefresh);
        try {
          const payload = JSON.parse(atob(nextAccess.split(".")[1])) as TokenClaims;
          if (payload && typeof payload === "object") {
            requiresDataUpdate = payload.data_update ?? requiresDataUpdate;
            if (user) {
              updateUser({
                ...user,
                email_verified: payload.email_verified ?? user.email_verified,
                data_update: requiresDataUpdate,
              });
            }
          }
        } catch (e) {
          console.warn("No se pudo decodificar el token actualizado tras cambio de contraseña", e);
        }
      } else if (tokens?.refresh) {
        // Intentar refrescar para obtener claims actualizados
        try {
          const refreshed = await authService.refreshToken(tokens.refresh);
          updateTokens(refreshed.access_token, refreshed.refresh_token || tokens.refresh);
          try {
            const payload = JSON.parse(atob(refreshed.access_token.split(".")[1])) as TokenClaims;
            if (payload && typeof payload === "object") {
              requiresDataUpdate = payload.data_update ?? requiresDataUpdate;
              if (user) {
                updateUser({
                  ...user,
                  email_verified: payload.email_verified ?? user.email_verified,
                  data_update: requiresDataUpdate,
                });
              }
            }
          } catch (e) {
            console.warn(
              "No se pudo decodificar el token tras refresh luego de cambio de contraseña",
              e
            );
          }
        } catch (e) {
          console.warn("Refresh de token falló tras cambio de contraseña", e);
        }
      }

      toast.success("Contraseña cambiada", "Tu contraseña ha sido actualizada exitosamente.");

      // Limpiar localStorage y redirigir a login
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      }

      setCurrentStep("login");
      router.push("/auth/login");
    } catch (error: unknown) {
      if (
        (error as Error).message?.toLowerCase().includes("invalid") ||
        (error as Error).message?.toLowerCase().includes("expired")
      ) {
        setTokenError("Token inválido o expirado. Verifica el código enviado a tu correo.");
        toast.error(
          "Token inválido",
          "El código de verificación es inválido o ha expirado. Por favor verifica e intenta nuevamente."
        );
      } else {
        toast.error(
          "Error",
          (error as Error).message === "Password appears in known breaches"
            ? "Esta contraseña ha sido comprometida en brechas de seguridad conocidas. Por favor, elige una contraseña diferente."
            : (error as Error).message || "Error al cambiar la contraseña"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!tokens?.access) {
      toast.error("Error", "No hay sesión activa");
      return;
    }

    setIsResending(true);
    try {
      const payload = JSON.parse(atob(tokens.access.split(".")[1])) as TokenClaims;

      if (!payload.doc?.type || !payload.doc?.number) {
        toast.error("Error", "Información de documento no disponible");
        return;
      }

      await passwordService.requestPasswordChange({
        document_type: payload.doc.type,
        document_number: payload.doc.number,
      });

      toast.success("Código reenviado", "Revisa tu correo electrónico nuevamente");
    } catch (error: unknown) {
      console.error("Resend password change error:", error);
      toast.error("Error", (error as Error).message || "Error al reenviar el código");
    } finally {
      setIsResending(false);
    }
  };

  const handleGeneratePassword = async () => {
    const newPwd = generateSecurePassword(16);
    setNewPassword(newPwd);
    setConfirmPassword(newPwd);
  };

  const handleBack = () => {
    router.push("/auth/login");
  };

  const getTokenFieldState = () => {
    if (tokenError) return "error";
    if (touched.token && !tokenValid) return "invalid";
    if (touched.token && tokenValid) return "valid";
    return "default";
  };

  const tokenFieldState = getTokenFieldState();

  return (
    <AuthCard
      title={
        <>
          Cambiar <span className="text-primary-positiva">contraseña</span>
        </>
      }
      subtitle="Por seguridad, ingresa el código recibido y establece tu nueva contraseña o genera una"
    >
      {userEmail && (
        <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 p-3">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Código enviado a:</span> {userEmail}
          </p>
        </div>
      )}

      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <div>
          <Label htmlFor="token">Código de verificación</Label>
          <div className="relative">
            <Input
              id="token"
              type="text"
              value={token}
              onChange={(e) => handleTokenChange(e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, token: true }))}
              disabled={isLoading}
              className={`mt-2 w-full ${
                tokenFieldState === "error"
                  ? "border-red-500 focus:ring-red-500"
                  : tokenFieldState === "invalid"
                    ? "border-red-500 focus:ring-red-500"
                    : tokenFieldState === "valid"
                      ? "border-green-500 focus:ring-green-500"
                      : ""
              }`}
              placeholder="Ingresa el código de verificación"
              maxLength={200}
              required
            />
            {(touched.token || tokenError) && (
              <div className="absolute top-1/2 right-3 -translate-y-1/2 transform">
                {tokenError ? (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                ) : (
                  <div className="h-4 w-4">
                    {tokenValid ? (
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500">
                        <div className="h-2 w-2 rounded-full bg-white"></div>
                      </div>
                    ) : (
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500">
                        <div className="h-2 w-2 rounded-full bg-white"></div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {tokenError && (
            <div className="mt-2 rounded-md border border-red-200 bg-red-50 p-3">
              <div className="flex items-start space-x-2">
                <AlertCircle className="text-red-positiva mt-0.5 h-4 w-4 flex-shrink-0" />
                <p className="text-red-positiva text-sm">{tokenError}</p>
              </div>
            </div>
          )}

          {!tokenError && touched.token && !tokenValid && (
            <p className="text-red-positiva mt-1 text-sm">El código de verificación es requerido</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <PasswordInput
            id="newPassword"
            label="Nueva Contraseña"
            className="px-11.75"
            value={newPassword}
            onChange={setNewPassword}
            onBlur={() => setTouched((prev) => ({ ...prev, newPassword: true }))}
            disabled={isLoading}
            placeholder="Mínimo 12 caracteres"
            validation={passwordValidation}
            touched={touched.newPassword}
            required
          />

          <PasswordRequirements
            validation={passwordValidation}
            show={touched.newPassword || newPassword.length > 0}
          />
        </div>

        <div className="flex flex-col gap-1">
          <PasswordInput
            id="confirmPassword"
            label="Confirmar Nueva Contraseña"
            value={confirmPassword}
            onChange={setConfirmPassword}
            onBlur={() => setTouched((prev) => ({ ...prev, confirmPassword: true }))}
            disabled={isLoading}
            placeholder="Repite tu nueva contraseña"
            touched={touched.confirmPassword}
            required
          />

          {touched.confirmPassword && confirmPassword && !passwordsMatch && (
            <p className="mt-1 text-sm text-red-500">Las contraseñas no coinciden</p>
          )}
        </div>

        <div className="flex w-full justify-center">
          <div className="max-w-[480px]">
            <p className="text-custom-gray text-center text-sm">
              *La contraseña debe ser al menos doce caracteres. Para ser más segura alterna
              mayúsculas y minúsculas números y símbolos como !"?$_y).
            </p>
          </div>
        </div>

        <div className="flex w-full justify-evenly gap-5">
          <CustomButton
            type="button"
            onClick={handleGeneratePassword}
            name="Generar una contraseña"
            iconPosition="right"
            disabled={isLoading}
            loading={isLoading}
            className="bg-navy-primary px-7.5 py-3"
          />
          <CustomButton
            type="submit"
            name={isLoading ? "Guardando..." : "Guardar la contraseña"}
            iconPosition="right"
            icon={<ChevronsRight className="h-4 w-4" />}
            disabled={isLoading || !tokenValid || !passwordValidation.isValid || !passwordsMatch}
            loading={isLoading}
            className="px-7.5 py-3"
          />
        </div>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={handleResend}
          disabled={isResending}
          className="text-primary-positiva mx-auto flex items-center justify-center space-x-2 font-bold hover:underline"
        >
          <Image
            src={IconReload.src}
            alt="icon"
            width={18}
            height={18}
            className={`h-4 w-4 ${isResending ? "animate-spin" : ""}`}
          />
          <span>{isResending ? "Reenviando..." : "Reenviar código"}</span>
        </button>
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={handleBack}
          className="text-primary-positiva mx-auto flex items-center justify-center space-x-2 font-bold hover:underline"
        >
          <Image
            src={IconArrowLeft.src}
            alt=""
            className="h-3.5 w-4.5"
            width={14}
            height={14}
            loading="lazy"
          />
          <span>Volver al inicio de sesión</span>
        </button>
      </div>
    </AuthCard>
  );
}
