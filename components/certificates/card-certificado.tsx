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
    <div className="flex min-h-[300px] w-[270px] flex-col justify-between rounded-lg bg-[#F4F4F4] p-6">
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
        <h3 className="text-xl font-bold text-[#173748]">
          {title}
          <div className="mt-2 w-12 rounded-full bg-orange-500 py-[2px]"></div>
        </h3>
        {description && <p className="mt-3 text-sm text-gray-600">{description}</p>}
        {extra && <div className="mt-3">{extra}</div>}
      </div>

      <div className="mt-6 w-full">
        <button
          className="w-full cursor-pointer rounded-sm bg-[#FF7500] py-2 text-base font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
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
