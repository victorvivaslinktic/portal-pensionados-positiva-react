import React from 'react';
import Image from 'next/image';
import { StaticImageData } from 'next/image';

interface TitleFooterProps {
  text: string;
  iconSrc?: StaticImageData; 
  iconAlt?: string; 
}

const TitleFooter: React.FC<TitleFooterProps> = ({ text, iconSrc, iconAlt = ""}) => {
  return (
    <div className="flex items-center gap-2 mb-[2px] "> 
      {iconSrc && (
        <Image 
          src={iconSrc} 
          width={20} 
          height={20} 
          alt={iconAlt} 
        />
      )}
      <h3 className="font-semibold text-[16px]">{text}</h3>
    </div>
  );
};

export default TitleFooter;