"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Save } from "lucide-react";
import { AuthCard } from "@/components/auth/auth-card";
import { CustomButton } from "@/components/ui/custom-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { userService } from "@/lib/services/user.service";
import { useAuthStore } from "@/lib/stores/auth.store";
import { toast } from "@/lib/stores/toast-store";

type UpdateFormData = {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
};

export default function UpdatePage() {
  const router = useRouter();
  const { user, updateUser, setCurrentStep } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateFormData>({
    defaultValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      phone_number: user?.phone_number || "",
      email: user?.email || "",
    },
  });

  useEffect(() => {
    if (!user || !user.data_update) {
      router.push("/private/dashboard");
    }
  }, [user, router]);

  const onSubmit = async (data: UpdateFormData) => {
    setIsLoading(true);

    try {
      await userService.updateProfile(data);

      updateUser({
        ...user!,
        first_name: data.first_name,
        last_name: data.last_name,
        phone_number: data.phone_number,
        email: data.email,
        data_update: false,
      });

      toast.success("Datos actualizados", "Tu información ha sido actualizada exitosamente");
      setCurrentStep("login");
      router.push("/private/dashboard");
    } catch (error: unknown) {
      console.error("Update profile error:", error);
      toast.error(
        "Error",
        (error as Error).message === "Password appears in known breaches"
          ? "Esta contraseña ha sido comprometida en brechas de seguridad conocidas. Por favor, elige una contraseña diferente."
          : (error as Error).message || "Error al actualizar los datos"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary-positiva mx-auto h-8 w-8 animate-spin rounded-full border-b-2"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthCard
      title={
        <>
          Actualizar <span className="text-primary-positiva">información</span>
        </>
      }
      subtitle="Por favor actualiza tu información personal para continuar"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="first_name">Nombre</Label>
            <Input
              id="first_name"
              type="text"
              {...register("first_name", {
                required: "El nombre es requerido",
                minLength: {
                  value: 2,
                  message: "El nombre debe tener al menos 2 caracteres",
                },
              })}
              disabled={isLoading}
              placeholder="Tu nombre"
              className={errors.first_name ? "border-red-500" : ""}
            />
            {errors.first_name && (
              <p className="mt-1 text-sm text-red-500">{errors.first_name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="last_name">Apellido</Label>
            <Input
              id="last_name"
              type="text"
              {...register("last_name", {
                required: "El apellido es requerido",
                minLength: {
                  value: 2,
                  message: "El apellido debe tener al menos 2 caracteres",
                },
              })}
              disabled={isLoading}
              placeholder="Tu apellido"
              className={errors.last_name ? "border-red-500" : ""}
            />
            {errors.last_name && (
              <p className="mt-1 text-sm text-red-500">{errors.last_name.message}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="phone_number">Número de Teléfono</Label>
          <Input
            id="phone_number"
            type="tel"
            {...register("phone_number", {
              required: "El número de teléfono es requerido",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "El número de teléfono debe tener 10 dígitos",
              },
            })}
            disabled={isLoading}
            placeholder="3001234567"
            className={errors.phone_number ? "border-red-500" : ""}
          />
          {errors.phone_number && (
            <p className="mt-1 text-sm text-red-500">{errors.phone_number.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Correo Electrónico</Label>
          <Input
            id="email"
            type="email"
            {...register("email", {
              required: "El email es requerido",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Email inválido",
              },
            })}
            disabled={true}
            placeholder="tu@email.com"
            className="cursor-not-allowed bg-gray-100"
          />
          <p className="mt-1 text-sm text-gray-500">El email no se puede modificar por seguridad</p>
        </div>

        <CustomButton
          type="submit"
          name="Guardar Cambios"
          icon={<Save className="h-4 w-4" />}
          disabled={isLoading}
          loading={isLoading}
          className="w-full"
        />
      </form>
    </AuthCard>
  );
}
