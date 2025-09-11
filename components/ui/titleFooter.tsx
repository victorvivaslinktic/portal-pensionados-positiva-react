import React from "react";
import Image from "next/image";
import { StaticImageData } from "next/image";

interface TitleFooterProps {
  text: string;
  iconSrc?: StaticImageData;
  iconAlt?: string;
}

const TitleFooter: React.FC<TitleFooterProps> = ({ text, iconSrc, iconAlt = "" }) => {
  return (
    <div className="mb-[2px] flex items-center gap-2">
      {iconSrc && <Image src={iconSrc} width={20} height={20} alt={iconAlt} />}
      <h3 className="text-[16px] font-semibold">{text}</h3>
    </div>
  );
};

export default TitleFooter;
