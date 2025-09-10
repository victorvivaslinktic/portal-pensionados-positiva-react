"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ChevronsRight } from "lucide-react";
import { AuthCard } from "@/components/auth/auth-card";
import { CustomButton } from "@/components/ui/custom-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { passwordService } from "@/lib/services/password.service";
import { toast } from "@/lib/stores/toast-store";
import { useAuthStore } from "@/lib/stores/auth.store";
import { DOCUMENT_TYPES } from "@/lib/types/auth.types";
import Image from "next/image";
import IconArrowLeft from "@/public/icon-arrow-left.svg";

type RecoverFormData = {
  document_type: string;
  document_number: string;
};

export default function RecoverPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { setRecoveryEmail, setRecoveryData } = useAuthStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RecoverFormData>({
    defaultValues: {
      document_type: "CC",
    },
  });

  const documentType = watch("document_type");

  const onSubmit = async (data: RecoverFormData) => {
    setIsLoading(true);

    try {
      const response = await passwordService.requestPasswordReset({
        document_type: data.document_type,
        document_number: data.document_number,
      });

      if (response.email) {
        setRecoveryEmail(response.email);
      }

      setRecoveryData(data);
      toast.success(
        "Código enviado",
        "Revisa tu correo electrónico para el código de recuperación"
      );
      router.push("/auth/recover/reset");
    } catch (error: unknown) {
      console.error("Password reset request error:", error);
      toast.error(
        "Error",
        (error as Error).message || "Error al solicitar recuperación de contraseña"
      );
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
          Recuperar <span className="text-orange-500">contraseña</span>
        </>
      }
      subtitle="Ingresa tu tipo y número de documento para recibir el código de recuperación"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div>
          <Label
            htmlFor="document_type"
            className="font-poppins text-label-inputs pl-2 text-sm font-semibold"
          >
            Tipo de Documento*
          </Label>

          <Select
            value={documentType}
            onValueChange={(value) => setValue("document_type", value)}
            disabled={isLoading}
          >
            <SelectTrigger className="data-[state=open]:border-primary-positiva focus:border-primary-positiva w-full">
              <SelectValue placeholder="Selecciona tipo de documento" />
            </SelectTrigger>
            <SelectContent>
              {DOCUMENT_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label2 ? type.label2 : type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="document_number">Número de Documento*</Label>
          <div className="relative">
            <Input
              id="document_number"
              type="text"
              {...register("document_number", {
                required: "El número de documento es requerido",
                minLength: {
                  value: 6,
                  message: "El número de documento debe tener al menos 6 caracteres",
                },
              })}
              disabled={isLoading}
              placeholder="Número de documento"
              className={`${errors.document_number ? "border-red-500" : ""}`}
            />
          </div>
          {errors.document_number && (
            <p className="mt-1 text-sm text-red-500">{errors.document_number.message}</p>
          )}
        </div>

        <div className="flex w-full justify-center">
          <CustomButton
            type="submit"
            name="Enviar Código"
            iconPosition="right"
            icon={<ChevronsRight className="h-4 w-4" />}
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
          <Image
            src={IconArrowLeft.src}
            alt=""
            className="h-3.5 w-4.5"
            width={18}
            height={18}
            loading="lazy"
          />
          <span>Volver al inicio de sesión</span>
        </button>
      </div>
    </AuthCard>
  );
}
