"use client";

import type React from "react";
import Image, { type StaticImageData } from "next/image";

type Props = {
  title: string;
  imageSrc: StaticImageData | string;
  isLoading: boolean;
  handleDocumentAction: () => void;
  description?: string;
  extra?: React.ReactNode;
};

export const CardCertificado = ({
  title,
  imageSrc,
  isLoading,
  handleDocumentAction,
  description,
  extra,
}: Props) => {
  return (
    <div className="flex flex-col justify-between rounded-[20px] bg-[#F4F4F4] px-[30px] py-[40px]">
      <div>
        <div className="relative mb-4">
          <Image
            src={imageSrc}
            loading="lazy"
            alt={title}
            width={48}
            height={48}
            className="h-10 w-10 object-contain sm:h-12 sm:w-12"
          />
        </div>
        <h3 className="text-lg font-semibold text-[#173748]">
          {title}
          <div className="bg-primary-positiva mt-2 h-0.75 w-9.25 rounded-full py-[2px]"></div>
        </h3>
        {description && <p className="font-roboto mt-3 text-xs text-gray-600">{description}</p>}
        {extra && <div className="mt-3">{extra}</div>}
      </div>

      <div className="mt-6 w-full">
        <button
          className="bg-primary-positiva hover:bg-navy-primary w-full cursor-pointer rounded-sm py-2 text-base font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          onClick={handleDocumentAction}
          disabled={isLoading}
          aria-label="Enviar al correo"
        >
          {isLoading ? "Enviando..." : "Enviar al correo"}
        </button>
      </div>
    </div>
  );
};
