"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Mail } from "lucide-react";
import { AuthCard } from "@/components/auth/auth-card";
import { CustomButton } from "@/components/ui/custom-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { userService } from "@/lib/services/user.service";
import { useAuthStore } from "@/lib/stores/auth.store";
import { toast } from "@/lib/stores/toast-store";

type VerifyFormData = {
  identifier: string;
};

export default function VerifyPage() {
  const router = useRouter();
  const { loginData, setRecoveryEmail } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  // Solo usar el identifier si es un email (contiene @)
  const getDefaultEmail = () => {
    if (loginData?.identifier && loginData.identifier.includes("@")) {
      return loginData.identifier;
    }
    return "";
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyFormData>({
    defaultValues: {
      identifier: getDefaultEmail(),
    },
  });

  const onSubmit = async (data: VerifyFormData) => {
    setIsLoading(true);

    try {
      await userService.verifyEmailRequest(data.identifier);

      setRecoveryEmail(data.identifier);

      toast.success(
        "Código enviado",
        "Revisa tu correo electrónico para el código de verificación"
      );

      router.push("/auth/verify/confirm");
    } catch (error: unknown) {
      console.error("Verify email error:", error);
      toast.error("Error", (error as Error).message || "Error al enviar el código de verificación");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/auth/login");
  };

  return (
    <AuthCard
      title={
        <>
          Código de <span className="text-orange-500">verificación</span>
        </>
      }
      subtitle="Ingresa tu correo electrónico para enviar el código de verificación"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="identifier">Correo Electrónico</Label>
          <div className="relative">
            <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              id="identifier"
              type="email"
              {...register("identifier", {
                required: "El email es requerido",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Email inválido",
                },
              })}
              disabled={isLoading}
              placeholder="tu@email.com"
              className={`pl-10 ${errors.identifier ? "border-red-500" : ""}`}
            />
          </div>
          {errors.identifier && (
            <p className="mt-1 text-sm text-red-500">{errors.identifier.message}</p>
          )}
        </div>

        <div className="flex w-full justify-center">
          <CustomButton
            type="submit"
            name="Enviar Código"
            icon={<Mail className="h-4 w-4" />}
            disabled={isLoading}
            loading={isLoading}
            className="font-poppins border-primary-positiva h-11 w-52.5 gap-2 border py-3 font-semibold text-white"
          />
        </div>
      </form>

      <div className="mt-5 flex w-full flex-col items-center justify-center gap-5 text-center">
        <button
          onClick={handleBack}
          className="text-primary-positiva font-poppins flex items-center justify-center gap-2 text-lg font-bold hover:underline"
        >
          {/* <ArrowLeft className="h-4 w-4" /> */}
          <img src="/icon-arrow-left.svg" alt="" className="h-3.5 w-4.5" />
          <span>Volver al inicio de sesión</span>
        </button>
      </div>
    </AuthCard>
  );
}
