"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowLeft, ChevronsRight, RotateCcw } from "lucide-react";
import { AuthCard } from "@/components/auth/auth-card";
import { CustomButton } from "@/components/ui/custom-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { userService } from "@/lib/services/user.service";
import { toast } from "@/lib/stores/toast-store";
import { useAuthStore } from "@/lib/stores/auth.store";

type VerifyConfirmFormData = {
  token: string;
};

export default function VerifyConfirmPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { recoveryEmail, setRecoveryEmail, loginData } = useAuthStore();

  // Debug: mostrar el estado actual
  console.log("Verify confirm state:", { recoveryEmail, loginData });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyConfirmFormData>();

  const onSubmit = async (data: VerifyConfirmFormData) => {
    setIsLoading(true);

    try {
      await userService.verifyEmailConfirm(data.token);
      toast.success("Email verificado", "Tu email ha sido verificado exitosamente");
      setRecoveryEmail(null);
      router.push("/auth/login");
    } catch (error: unknown) {
      console.error("Verify confirm error:", error);
      toast.error(
        "Error",
        (error as Error).message === "Invalid or expired token"
          ? "Token inválido o expirado"
          : (error as Error).message || "Error al verificar el código"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    // Usar recoveryEmail si está disponible, sino usar el email del login
    const emailToUse =
      recoveryEmail ||
      (loginData?.identifier && loginData.identifier.includes("@") ? loginData.identifier : null);

    if (!emailToUse) {
      toast.error(
        "Error",
        "No hay email disponible para reenviar. Por favor, regresa a la página anterior."
      );
      return;
    }

    setIsResending(true);
    try {
      await userService.verifyEmailRequest(emailToUse);
      // Asegurar que el email esté guardado para futuros reenvíos
      if (!recoveryEmail) {
        setRecoveryEmail(emailToUse);
      }
      toast.success("Código reenviado", "Revisa tu correo electrónico nuevamente");
    } catch (error: unknown) {
      console.error("Resend email error:", error);
      toast.error("Error", (error as Error).message || "Error al reenviar el código");
    } finally {
      setIsResending(false);
    }
  };

  const handleBack = () => {
    router.push("/auth/verify");
  };

  return (
    <AuthCard
      title={
        <>
          Confirmar <span className="text-orange-500">verificación</span>
        </>
      }
      subtitle="Ingresa el código de verificación que recibiste por email"
    >
      {recoveryEmail && (
        <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 p-3">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Código enviado a:</span> {recoveryEmail}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="token">Código de Verificación</Label>
          <Input
            id="token"
            type="text"
            {...register("token", {
              required: "El código de verificación es requerido",
              minLength: {
                value: 6,
                message: "El código debe tener al menos 6 caracteres",
              },
            })}
            disabled={isLoading}
            placeholder="Ingresa el código de verificación"
            className={errors.token ? "border-red-500" : ""}
          />
          {errors.token && <p className="mt-1 text-sm text-red-500">{errors.token.message}</p>}
        </div>

        <CustomButton
          type="submit"
          name="Verificar Código"
          iconPosition="right"
          icon={<ChevronsRight className="h-4 w-4" />}
          disabled={isLoading}
          loading={isLoading}
          className="w-full"
        />
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={handleResend}
          disabled={isResending}
          className="text-primary-positiva mx-auto flex items-center justify-center space-x-2 font-medium hover:underline disabled:opacity-50"
        >
          <RotateCcw className={`h-4 w-4 ${isResending ? "animate-spin" : ""}`} />
          <span>{isResending ? "Reenviando..." : "Reenviar código"}</span>
        </button>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={handleBack}
          className="text-primary-positiva mx-auto flex items-center justify-center space-x-2 font-medium hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver</span>
        </button>
      </div>
    </AuthCard>
  );
}
