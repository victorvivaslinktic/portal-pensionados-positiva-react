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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authService } from "@/lib/services/auth.service";
import { useAuthStore } from "@/lib/stores/auth.store";
import { toast } from "@/lib/stores/toast-store";
import { DOCUMENT_TYPES } from "@/lib/types/auth.types";

type DocumentLoginFormData = {
  document_number: string;
  password: string;
  document_type: string;
};

type EmailLoginFormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const { setCurrentStep, setTransactionId, setExpiresIn, setLoginData } = useAuthStore();
  const [activeTab, setActiveTab] = useState("document");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const documentForm = useForm<DocumentLoginFormData>({
    defaultValues: {
      document_type: "CC",
    },
  });

  const emailForm = useForm<EmailLoginFormData>();

  const documentType = documentForm.watch("document_type");

  const onSubmit = async (data: DocumentLoginFormData | EmailLoginFormData) => {
    setIsLoading(true);

    let loginDataAdapted;
    if (activeTab === "email") {
      loginDataAdapted = {
        identifier: (data as EmailLoginFormData).email,
        password: data.password,
      };
    } else {
      loginDataAdapted = {
        identifier: (data as DocumentLoginFormData).document_number,
        document_type: (data as DocumentLoginFormData).document_type,
        password: data.password,
      };
    }

    setLoginData(loginDataAdapted);

    try {
      const credentials =
        activeTab === "email"
          ? { identifier: (data as EmailLoginFormData).email, password: data.password }
          : {
              identifier: (data as DocumentLoginFormData).document_number,
              document_type: (data as DocumentLoginFormData).document_type,
              password: data.password,
            };

      const response = await authService.login(credentials);

      if (response.two_factor_required && response.transaction_id) {
        setTransactionId(response.transaction_id);
        setExpiresIn(response.expires_in || 300);
        setCurrentStep("2fa");
        router.push("/auth/2fa");
        return;
      }

      if (response.access_token) {
        toast.success("Login exitoso", "Bienvenido al portal");
        router.push("/");
      }
    } catch (error: unknown) {
      console.error("Login error:", error);

      if ((error as Error).message === "Email not verified") {
        toast.info("Verificación requerida", "Debes verificar tu email antes de continuar");
        setCurrentStep("verify");
        router.push("/auth/verify");
      } else {
        toast.error(
          "Error de login",
          (error as Error).message === "Invalid credentials"
            ? "Credenciales incorrectas"
            : (error as Error).message || "Error en el inicio de sesión"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = () => {
    router.push("/auth/recover");
  };

  return (
    <AuthCard
      title={
        <>
          <span>
            Bienvenido al <span className="font-bold text-orange-500">Portal Pensionados</span>
          </span>
        </>
      }
      subtitle="Ingresa tu usuario y contraseña para continuar"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-7.5 grid w-full grid-cols-2">
          <TabsTrigger value="document" className="flex items-center space-x-2">
            <img src="/icon-document.svg" alt="icon-mail" />
            <span className="font-poppins text-[16px] leading-[24px] font-semibold">Documento</span>
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center space-x-2">
            <img src="/icon-mail.svg" alt="icon-mail" />
            <span className="font-poppins text-[16px] leading-[24px] font-semibold">Correo</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="document">
          <form onSubmit={documentForm.handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div className="flex w-full gap-5">
              <div className="w-1/3">
                <Label
                  htmlFor="document_type"
                  className="font-poppins text-label-inputs pl-2 text-sm font-semibold"
                >
                  Tipo de Documento*
                </Label>
                <Select
                  value={documentType}
                  onValueChange={(value) => documentForm.setValue("document_type", value)}
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

              <div className="w-2/3">
                <Label
                  htmlFor="identifier"
                  className="font-poppins text-label-inputs pl-2 text-sm font-semibold"
                >
                  Número de Documento*
                </Label>
                <Input
                  id="identifier"
                  type="text"
                  {...documentForm.register("document_number", {
                    required: "El número de documento es requerido",
                  })}
                  disabled={isLoading}
                  placeholder="Número de documento"
                  className={documentForm.formState.errors.document_number ? "border-red-500" : ""}
                />
                {documentForm.formState.errors.document_number && (
                  <p className="mt-1 text-sm text-red-500">
                    {documentForm.formState.errors.document_number.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label
                htmlFor="password"
                className="font-poppins text-label-inputs pl-2 text-sm font-semibold"
              >
                Contraseña*
              </Label>
              <div className="relative">
                <img
                  src="/icon-padlock.svg"
                  alt="icon-padlock"
                  className="absolute top-1/2 left-4.75 -translate-y-1/2 transform"
                />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...documentForm.register("password", { required: "La contraseña es requerida" })}
                  disabled={isLoading}
                  placeholder="Tu contraseña"
                  className={`px-11.75 ${documentForm.formState.errors.password ? "border-red-positiva" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
                >
                  <img
                    src={showPassword ? "/icon-eye-hide.svg" : "/icon-eye-show.svg"}
                    alt="icon-mail"
                    className=""
                  />
                </button>
              </div>
              {documentForm.formState.errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {documentForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="flex w-full justify-center">
              <CustomButton
                type="submit"
                name="Ingresar"
                iconPosition="right"
                icon={<ChevronsRight className="h-4 w-4" />}
                disabled={isLoading}
                loading={isLoading}
                className="font-poppins border-primary-positiva h-11 w-52.5 gap-2 border py-3 font-semibold text-white"
              />
            </div>
          </form>
        </TabsContent>

        <TabsContent value="email">
          <form onSubmit={emailForm.handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div>
              <Label htmlFor="email">Correo Electrónico *</Label>
              <Input
                id="email"
                type="email"
                {...emailForm.register("email", {
                  required: "El email es requerido",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email inválido",
                  },
                })}
                disabled={isLoading}
                placeholder="tu@email.com"
                className={emailForm.formState.errors.email ? "border-red-500" : ""}
              />
              {emailForm.formState.errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {emailForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="password"
                className="font-poppins text-label-inputs pl-2 text-sm font-semibold"
              >
                Contraseña*
              </Label>
              <div className="relative">
                <img
                  src="/icon-padlock.svg"
                  alt="icon-padlock"
                  className="absolute top-1/2 left-4.75 -translate-y-1/2 transform"
                />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...documentForm.register("password", { required: "La contraseña es requerida" })}
                  disabled={isLoading}
                  placeholder="Tu contraseña"
                  className={`px-11.75 ${documentForm.formState.errors.password ? "border-red-positiva" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
                >
                  <img
                    src={showPassword ? "/icon-eye-hide.svg" : "/icon-eye-show.svg"}
                    alt="icon-mail"
                    className=""
                  />
                </button>
              </div>
              {documentForm.formState.errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {documentForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="flex w-full justify-center">
              <CustomButton
                type="submit"
                name="Ingresar"
                iconPosition="right"
                icon={<ChevronsRight className="h-4 w-4" />}
                disabled={isLoading}
                loading={isLoading}
                className="font-poppins border-primary-positiva h-11 w-52.5 gap-2 border py-3 font-semibold text-white"
              />
            </div>
          </form>
        </TabsContent>
      </Tabs>

      <div className="mt-5 flex flex-col items-center justify-center gap-5 text-center">
        <button
          onClick={handlePasswordReset}
          className="text-primary-positiva font-poppins text-lg font-bold hover:underline"
        >
          ¿Olvidaste tu contraseña?
        </button>

        <p className="font-poppins text-navy-primary text-lg font-bold">
          ¿No tienes cuenta?{" "}
          <button onClick={handlePasswordReset} className="text-primary-positiva hover:underline">
            Consulta aquí
          </button>
        </p>
      </div>
    </AuthCard>
  );
}
