"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { AuthCard } from "@/components/auth/auth-card";
import { CustomButton } from "@/components/ui/custom-button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { authService } from "@/lib/services/auth.service";
import { useAuthStore } from "@/lib/stores/auth.store";
import { toast } from "@/lib/stores/toast-store";
import Image from "next/image";
import IconReload from "@/public/icon-reload.svg";
import IconBoton from "@/public/botton-icon.svg";
import IconArrow from "@/public/arrow-positiva.svg";

type TwoFAFormData = {
  code: string;
};

export default function TwoFAPage() {
  const router = useRouter();
  const { transactionId, expiresIn, setCurrentStep, login, loginData } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(expiresIn || 300);

  const { setValue, watch, handleSubmit } = useForm<TwoFAFormData>();

  const code = watch("code");

  const [status, setStatus] = useState("normal"); // "normal" | "expired" | "invalid" | "success" = "normal";

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  useEffect(() => {
    if (code && code.length === 6) {
      handleSubmit(onSubmit)();
    }
  }, [code]);

  const onSubmit = async (data: TwoFAFormData) => {
    if (!transactionId) {
      setStatus("error");
      toast.error("Error", "No hay una sesión activa");
      router.push("/auth/login");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.verify2FA({
        transaction_id: transactionId,
        code: data.code,
      });

      if (response.access_token && response.refresh_token) {
        setStatus("success");
        const payload = JSON.parse(atob(response.access_token.split(".")[1]));

        login(response.access_token, response.refresh_token, {
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
        });

        if (payload.data_update) {
          setCurrentStep("update");
          router.push("/auth/update");
        } else {
          toast.success("Bienvenido", "Has iniciado sesión exitosamente");
          router.push("/");
        }
      }
    } catch (error: unknown) {
      setStatus("error");
      console.error("2FA verification error:", error);

      const errorMessage = (error as Error).message;
      let translatedMessage = "Código inválido o expirado";

      if (errorMessage === "Invalid code") {
        translatedMessage = "Código inválido";
      } else if (errorMessage === "Too many attempts") {
        translatedMessage =
          "Demasiados intentos. Por favor, intenta más tarde o inicia sesión nuevamente";
      }

      toast.error("Error", translatedMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setStatus("normal");
    if (!loginData) {
      toast.error("Error", "No hay datos de login disponibles");
      return;
    }

    setIsResending(true);
    try {
      const response = await authService.login(loginData);

      if (response.two_factor_required && response.transaction_id) {
        setCurrentStep("2fa");
        setTimeLeft(response.expires_in || 300);
        toast.success("Código reenviado", "Revisa tu correo electrónico nuevamente");
      } else {
        toast.error("Error", "No se pudo reenviar el código");
      }
    } catch (error: unknown) {
      console.error("Resend 2FA error:", error);

      const errorMessage = (error as Error).message;
      let translatedMessage = "Error al reenviar el código";

      if (errorMessage === "Too many attempts") {
        translatedMessage =
          "Demasiados intentos. Por favor, intenta más tarde o inicia sesión nuevamente";
      }

      toast.error("Error", translatedMessage);
    } finally {
      setIsResending(false);
    }
  };

  const handleBack = () => {
    router.push("/auth/login");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <AuthCard
      title={
        <>
          Código de <span className="text-primary-positiva">verificación</span>
        </>
      }
      subtitle="Por favor ingresa el código de verificación enviado a tu correo electrónico"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center space-y-6">
        <div className="space-y-4">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={code}
              onChange={(value) => {
                setValue("code", value);
                setStatus("normal");
              }}
              disabled={isLoading || timeLeft === 0}
              className="gap-[30px]"
            >
              <InputOTPGroup className="gap-2 md:gap-[30px]">
                <InputOTPSlot
                  index={0}
                  data-status={status}
                  className="data-[status=error]:border-red-positiva data-[status=success]:border-green-positiva"
                />
                <InputOTPSlot
                  index={1}
                  data-status={status}
                  className="data-[status=error]:border-red-positiva data-[status=success]:border-green-positiva"
                />
                <InputOTPSlot
                  index={2}
                  data-status={status}
                  className="data-[status=error]:border-red-positiva data-[status=success]:border-green-positiva"
                />
                <InputOTPSlot
                  index={3}
                  data-status={status}
                  className="data-[status=error]:border-red-positiva data-[status=success]:border-green-positiva"
                />
                <InputOTPSlot
                  index={4}
                  data-status={status}
                  className="data-[status=error]:border-red-positiva data-[status=success]:border-green-positiva"
                />
                <InputOTPSlot
                  index={5}
                  data-status={status}
                  className="data-[status=error]:border-red-positiva data-[status=success]:border-green-positiva"
                />
              </InputOTPGroup>
            </InputOTP>
          </div>
          {timeLeft > 0 ? (
            <p className="text-center text-sm text-gray-600">
              Tiempo restante: <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
            </p>
          ) : (
            <p className="text-red-positiva text-center text-sm">
              El código ha expirado. Por favor, da clic en la opción reenviar código.
            </p>
          )}
        </div>

        <CustomButton
          type="submit"
          name="Validar Código"
          icon={<Image src={IconBoton.src} alt="icon" width={18} height={18} />}
          disabled={isLoading || !code || code.length !== 6 || timeLeft === 0}
          loading={isLoading}
          iconPosition="right"
        />
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={handleResend}
          disabled={isResending}
          className="text-primary-positiva font-roboto mx-auto flex items-center justify-center space-x-2 font-bold hover:underline disabled:opacity-50"
        >
          <Image src={IconReload.src} alt="icon" width={18} height={18} />
          <span>{isResending ? "Reenviando..." : "Reenviar código"}</span>
        </button>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={handleBack}
          className="text-primary-positiva font-roboto mx-auto flex items-center justify-center space-x-2 font-bold hover:underline"
        >
          <Image src={IconArrow.src} alt="icon" width={18} height={18} />
          <span>Volver al inicio de sesión</span>
        </button>
      </div>
    </AuthCard>
  );
}
