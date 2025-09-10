/* eslint-disable prettier/prettier */
"use client";

import { AuthCard } from "@/components/auth/auth-card";
import { CustomButton } from "@/components/ui/custom-button";
import { ChevronsRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ThankYouPage() {
  const router = useRouter();

  const goToLogin = () => {
    router.push("/auth/login");
  };
  return (
    <AuthCard
          title={
            <>
              Cambio de <span className="text-orange-500">contraseña exitoso</span>
            </>
          }
        >
          <div className="flex flex-col items-center justify-center gap-7.5">
              <img src="/image-thankyou.svg" alt="" className="h-24.25 w-24.5" />
              <CustomButton
                onClick={goToLogin}
                iconPosition="right"
                icon={<ChevronsRight className="h-4 w-4" />}
                name="Ingresa al portal"
                className="bg-primary-positiva px-7.5 py-3"
              />
          </div>
    </AuthCard>
  )
}
