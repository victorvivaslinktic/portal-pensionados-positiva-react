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
import { SuccessDialog } from "@/components/ui/success-dialog";
import IconDocument from "@/public/icon-document.svg";
import IconMail from "@/public/icon-mail.svg";
import IconPadLock from "@/public/icon-padlock.svg";
import IconEyeHide from "@/public/icon-eye-hide.svg";
import IconEyeShow from "@/public/icon-eye-show.svg";
import Image from "next/image";

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

  const [successOpen, setSuccessOpen] = useState(false);
  const [successTitle, setSuccessTitle] = useState<string>("");
  const [successDescription, setSuccessDescription] = useState<string>("");
  const [successVariant, setSuccessVariant] = useState<"success" | "error" | "login">("success");
  const [successGridContent, setSuccessGridContent] = useState<React.ReactNode | null>(null);

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
    console.log(data);
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

  const handleModal = (e?: React.MouseEvent) => {
    e?.preventDefault();

    setSuccessVariant("login");
    setSuccessTitle("¿No tienes cuenta?");
    setSuccessDescription(
      `Si ya eres afiliado y aún no tienes una cuenta en nuestro Portal de Positiva Pensionados, puedes solicitar la creación de tu cuenta enviando un correo a <a href="mailto:servicioalcliente@positiva.gov.co" class="underline text-[var(--primary-positiva)]" target="_blank">servicioalcliente@positiva.gov.co</a> con el asunto: <b>Creación de Cuenta Portal Positiva Pensionados”,</b> indicando los siguientes datos:
      <br><br> 
      <ul class="ulModalLogin">
      <li class="liModalLogin">Nombre completo.</li>
      <li class="liModalLogin">Tipo y número de documento.</li>
      <li class="liModalLogin">Teléfono de contacto.</li>
      <li class="liModalLogin">Correo electrónico.</li>
      </ul>
       <br> <br> Uno de nuestros asesores verificará tu información y se encargará de realizar tu registro en el portal. 1`
    );
    setSuccessGridContent(
      <>
        <div className="z-2 rounded-br-2xl rounded-bl-2xl bg-[var(--navy-primary)] py-[20px] pr-[16px] pl-[16px] sm:pr-12 sm:pl-12">
          <p className="text-center text-base text-white">
            Si lo prefieres, también puedes comunicarte a nuestras líneas de atención gratuitas para
            recibir asistencia en el proceso:
          </p>
          <div className="grid grid-cols-2">
            <p className="font-roboto mt-4 text-center text-base leading-6 font-semibold text-white">
              Línea de atención nacional: <br />
              <span className="cursor-pointer font-semibold text-[var(--primary-positiva)] underline">
                01 8000 11 1170
              </span>
            </p>

            <p className="font-roboto mt-4 text-center text-base leading-6 font-semibold text-white">
              Línea de atención en Bogotá: <br />
              <span className="cursor-pointer text-[var(--primary-positiva)] underline">
                (+57) 601 3307000
              </span>
            </p>
          </div>
        </div>
      </>
    );
    setSuccessOpen(true);
  };

  return (
    <AuthCard
      title={
        <>
          <span>
            Bienvenido al{" "}
            <span className="text-primary-positiva font-bold">Portal Pensionados</span>
          </span>
        </>
      }
      subtitle="Ingresa tu usuario y contraseña para continuar"
    >
      <SuccessDialog
        open={successOpen}
        onOpenChange={setSuccessOpen}
        title={successTitle}
        description={successDescription}
        gridContent={successGridContent}
        isHtmlDescription={true}
        variant={successVariant}
      />
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-7.5 grid w-full grid-cols-2">
          <TabsTrigger value="document" className="flex items-center space-x-2">
            <Image src={IconDocument.src} alt="icon-mail" width={28} height={20} loading="lazy" />
            <span className="font-poppins text-[16px] leading-[24px] font-semibold">Documento</span>
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center space-x-2">
            <Image src={IconMail.src} alt="icon-mail" width={23} height={20} loading="lazy" />
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
                <Image
                  src={IconPadLock.src}
                  alt="icon-padlock"
                  className="absolute top-1/2 left-4.75 -translate-y-1/2 transform"
                  width={14.97}
                  height={19.25}
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
                  <Image
                    src={showPassword ? IconEyeHide.src : IconEyeShow.src}
                    alt="icon-mail"
                    className=""
                    width={20}
                    height={18}
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
                <Image
                  src={IconPadLock.src}
                  alt="icon-padlock"
                  className="absolute top-1/2 left-4.75 -translate-y-1/2 transform"
                  width={14.97}
                  height={19.25}
                />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...emailForm.register("password", { required: "La contraseña es requerida" })}
                  disabled={isLoading}
                  placeholder="Tu contraseña"
                  className={`px-11.75 ${emailForm.formState.errors.password ? "border-red-positiva" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
                >
                  <Image
                    src={showPassword ? IconEyeHide.src : IconEyeShow.src}
                    alt="icon-mail"
                    className=""
                    width={20}
                    height={18}
                  />
                </button>
              </div>
              {emailForm.formState.errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {emailForm.formState.errors.password.message}
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
          className="text-primary-positiva font-roboto text-lg font-bold hover:underline"
        >
          ¿Olvidaste tu contraseña?
        </button>

        <p className="font-roboto text-navy-primary text-lg font-bold">
          ¿No tienes cuenta?{" "}
          <button onClick={handleModal} className="text-primary-positiva hover:underline">
            Consulta aquí
          </button>
        </p>
      </div>
    </AuthCard>
  );
}
