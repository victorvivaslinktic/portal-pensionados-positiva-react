"use client";

import { ReactNode } from "react";
import PositivaLogo from "@/public/logo-positiva.svg";
import Image from "next/image";

interface AuthCardProps {
  children: ReactNode;
  title?: string | ReactNode;
  subtitle?: string;
}

export function AuthCard({ children, title, subtitle }: AuthCardProps) {
  return (
    <div className="mx-auto w-full max-w-[644px] rounded-[30px] bg-white px-6 py-8 shadow-lg sm:px-10">
      <div className="mb-7.5 flex justify-center">
        <div className="relative h-20 w-20 sm:h-30 sm:w-30">
          <Image
            src={PositivaLogo.src}
            width={120}
            height={120}
            alt="Positiva Logo"
            className="h-full w-full object-contain"
          />
        </div>
      </div>

      {title && (
        <div className="mb-3.75 text-center">
          <h1 className="text-navy-primary text-2xl font-bold sm:text-[32px]">{title}</h1>
        </div>
      )}

      {subtitle && (
        <div className="mb-7.5 text-center">
          <p className="text-sm text-gray-600 sm:text-base">{subtitle}</p>
        </div>
      )}

      <div className="space-y-6">{children}</div>
    </div>
  );
}
