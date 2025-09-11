/* eslint-disable prettier/prettier */
"use client";

import { AuthCard } from "@/components/auth/auth-card";
import { CustomButton } from "@/components/ui/custom-button";
import { ChevronsRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ImagePage from "@/public/image-thankyou.svg";

export default function ThankYouPage() {
  const router = useRouter();

  const goToLogin = () => {
    router.push("/auth/login");
  };
  return (
    <AuthCard
          title={
            <>
              Cambio de <span className="text-primary-positiva">contraseña exitoso</span>
            </>
          }
        >
          <div className="flex flex-col items-center justify-center gap-7.5">
              <Image src={ImagePage.src} alt="" className="h-24.25 w-24.5" width={98} height={97} />
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
