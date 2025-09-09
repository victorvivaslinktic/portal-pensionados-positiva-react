"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth.store";
import { documentsService } from "@/lib/services/documents.service";
import { authService } from "@/lib/services/auth.service";
import { CardCertificado } from "@/components/certificates/card-certificado";
import { SuccessDialog } from "@/components/ui/success-dialog";
import { toast } from "@/lib/stores/toast-store";
import { normalizeNameForDisplay } from "@/lib/utils/name-display";
import { ChevronsRight } from "lucide-react";
import Card1 from "@/public/card1.png";
import Card2 from "@/public/card2.png";
import Card3 from "@/public/card3.png";

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [selectedMonthYear, setSelectedMonthYear] = useState<string>("");
  const monthInputBounds = useMemo(() => {
    const format = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const now = new Date();
    const minDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    return {
      min: format(minDate),
      max: format(now),
    };
  }, []);

  const [successOpen, setSuccessOpen] = useState(false);
  const [successTitle, setSuccessTitle] = useState<string>("");
  const [successDescription, setSuccessDescription] = useState<string>("");
  const [successVariant, setSuccessVariant] = useState<"success" | "error">("success");

  const handleDocumentAction = async (type: string) => {
    if (!user) {
      toast.error("Sesión Expirada", "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
      setTimeout(() => {
        logout();
        router.push("/auth/login");
      }, 2000);
      return;
    }

    try {
      setIsLoading(type);
      let finalMonth = "";
      let documentType = type;

      if (type === "pension_payment") {
        if (!selectedMonthYear) {
          toast.warning(
            "Selección requerida",
            "Por favor selecciona un mes (últimos 3) para el certificado de pago de pensión."
          );
          return;
        }
        // DPP: enviar solo el mes (MM) a partir de YYYY-MM seleccionado
        const monthPart = selectedMonthYear.includes("-")
          ? selectedMonthYear.split("-")[1]
          : selectedMonthYear;
        finalMonth = monthPart.padStart(2, "0");
        documentType = "DPP";
      } else if (type === "income_retention") {
        // CIR: siempre enviar mes "03"
        documentType = "CIR";
        finalMonth = "03";
      } else if (type === "pension_certificate") {
        // CVP: enviar mes vacío para que la funcion de envio use el mes actual
        documentType = "CVP";
        finalMonth = "";
      }

      const response = await documentsService.sendDocument({
        type: documentType as "CIR" | "CVP" | "DPP",
        month: finalMonth,
      });

      const responseData = response?.data || response;
      const isFound = Boolean(responseData?.attributes?.found);

      if (isFound) {
        setSuccessVariant("success");
        setSuccessTitle("Se ha enviado el certificado a su correo electrónico");
        setSuccessDescription("");
      } else {
        setSuccessVariant("error");
        setSuccessTitle("El certificado no fue encontrado");
        setSuccessDescription(
          "Escribe a este correo servicioalcliente@positiva.com \nComunicante a la línea"
        );
      }
      setSuccessOpen(true);
    } catch (error: unknown) {
      let errorMessage = "Error al enviar el documento.";

      if (
        (error as Error).message?.includes("401") ||
        (error as Error).message?.includes("unauthorized")
      ) {
        errorMessage = "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.";
        setTimeout(() => {
          logout();
          router.push("/auth/login");
        }, 2000);
      } else if (
        (error as Error).message?.includes("network") ||
        (error as Error).message?.includes("fetch")
      ) {
        errorMessage = "Error de conexión. Verifica tu conexión a internet e intenta nuevamente.";
      }

      toast.error("Error", (error as Error).message || errorMessage);
    } finally {
      setIsLoading(null);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);

    toast.info("Cerrando sesión...", "Te estamos desconectando del portal.");

    try {
      await authService.logout();
    } catch (error) {
      console.error("Error during logout:", error);
    }

    setTimeout(() => {
      logout();
      router.push("/auth/login");
      setIsLoggingOut(false);
    }, 800);
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
    <div className="w-full">
      <SuccessDialog
        open={successOpen}
        onOpenChange={setSuccessOpen}
        title={successTitle}
        description={successDescription}
        variant={successVariant}
      />

      <div className="mb-6 flex flex-col space-y-4 px-10 sm:mb-8 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 lg:mb-10">
        <div className="flex-1">
          <h1 className="mb-2 text-xl font-bold text-balance text-gray-800 sm:text-2xl lg:text-3xl">
            Hola, bienvenido a tu portal
          </h1>
          <p className="text-2xl font-bold text-balance text-orange-500 sm:text-3xl lg:text-4xl">
            {normalizeNameForDisplay(user.first_name)} {normalizeNameForDisplay(user.last_name)}
          </p>
        </div>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut || isLoading !== null}
          className="flex w-full cursor-pointer items-center justify-center space-x-2 rounded-md bg-orange-500 px-8 py-2.5 text-base font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-6"
          aria-label="Cerrar sesión y volver al login"
        >
          {isLoggingOut ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
              <span>Cerrando...</span>
            </>
          ) : (
            <>
              <span>Cerrar sesión</span>
              <ChevronsRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </>
          )}
        </button>
      </div>

      <section className="w-full bg-white px-10 py-20">
        <div className="mx-auto flex w-full max-w-screen-2xl flex-col justify-between gap-4 lg:flex-row">
          <h2 className="mb-10 max-w-xs text-2xl font-bold text-balance text-gray-800 sm:mb-6">
            Certificados de pensionados
            <div className="mt-2 w-20 rounded-full bg-orange-500 py-[3px]"></div>
          </h2>

          <div className="flex w-full flex-row flex-wrap justify-center gap-6 lg:justify-end">
            <CardCertificado
              title="Certificado de ingresos y retenciones de pensión"
              imageSrc={Card1}
              isLoading={isLoading === "income_retention"}
              handleDocumentAction={() => handleDocumentAction("income_retention")}
            />

            <CardCertificado
              title="Certificado de pensión"
              imageSrc={Card2}
              isLoading={isLoading === "pension_certificate"}
              handleDocumentAction={() => handleDocumentAction("pension_certificate")}
            />

            <CardCertificado
              title="Certificado de pago de pensión"
              imageSrc={Card3}
              isLoading={isLoading === "pension_payment"}
              handleDocumentAction={() => handleDocumentAction("pension_payment")}
              description="Selecciona el mes que quieres consultar"
              extra={
                <div>
                  <input
                    type="month"
                    className="portal-input w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm sm:py-3 sm:text-base"
                    min={monthInputBounds.min}
                    max={monthInputBounds.max}
                    value={selectedMonthYear}
                    onChange={(e) => setSelectedMonthYear(e.target.value)}
                    aria-label="Seleccionar mes/año (últimos 3 meses)"
                  />
                </div>
              }
            />
          </div>
        </div>
      </section>
    </div>
  );
}
