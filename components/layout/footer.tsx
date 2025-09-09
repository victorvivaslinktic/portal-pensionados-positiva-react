"use client";

import Link from "next/link";
import Image from "next/image";
import { Hammer, Building, UserRound, MapPin, Facebook, Instagram, X, Youtube } from "lucide-react";
import { redirections } from "@/lib/utils/redirections";
import LogoFooter1 from "@/public/logo-co.svg";
import LogoFooter2 from "@/public/Logotipo Gob-com.svg";
import LogoBlancoPositiva from "@/public/positiva-header-logo.svg";

export function Footer() {
  const { footer } = redirections;

  const renderIcon = (iconName: string) => {
    const icons = {
      Building: <Building className="h-6 w-6 text-orange-500" />,
      Hammer: <Hammer className="h-6 w-6 text-orange-500" />,
      UserRound: <UserRound className="h-6 w-6 text-orange-500" />,
      MapPin: <MapPin className="h-6 w-6 text-orange-500" />,
    };
    return icons[iconName as keyof typeof icons];
  };

  return (
    <footer className="bg-[#0D2333] px-4 py-6 text-white sm:px-6 sm:py-8 md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 grid grid-cols-1 gap-6 border-b border-gray-700 pb-6 md:mb-8 md:gap-8 md:pb-8 lg:grid-cols-3">
          <div>
            <div className="mb-4 flex items-center space-x-2">
              {renderIcon(footer.contact.icon)}
              <h3 className="text-lg font-bold text-white">{footer.contact.title}</h3>
            </div>
            {footer.contact.items.map((item) => (
              <div key={item.label} className="mb-2">
                <p className="mb-2 text-sm">{item.label}</p>
                {item.type === "email" ? (
                  <Link
                    href={item.href || "#"}
                    className="mb-4 block text-sm text-orange-500 hover:underline"
                  >
                    {item.value}
                  </Link>
                ) : (
                  <p className="mb-1 text-sm text-white">{item.value}</p>
                )}
              </div>
            ))}
          </div>

          <div>
            <div className="mb-4 flex items-center space-x-2">
              {renderIcon(footer.complaints.icon)}
              <h3 className="text-lg font-bold text-white">{footer.complaints.title}</h3>
            </div>
            {footer.complaints.items.map((item, index) => (
              <div key={index} className="mb-2">
                <p className="mb-2 text-sm">{item.label}</p>
                {item.type === "email" ? (
                  <Link
                    href={item.href || "#"}
                    className="mb-2 block text-sm text-orange-500 hover:underline"
                  >
                    {item.value}
                  </Link>
                ) : item.type === "link" ? (
                  <Link href={item.href || "#"} className="text-sm text-orange-500 hover:underline">
                    {item.value}{" "}
                    {item.emphasis && <span className="font-bold">{item.emphasis}</span>}
                  </Link>
                ) : (
                  <p className="mb-1 text-sm text-white">{item.value}</p>
                )}
              </div>
            ))}
          </div>

          <div>
            <div className="mb-4 flex items-center space-x-2">
              {renderIcon(footer.normative.icon)}
              <h3 className="text-lg font-bold text-white">{footer.normative.title}</h3>
            </div>
            {footer.normative.items.map((item, index) => (
              <div key={index} className="mb-2">
                <p className="mb-2 text-sm">{item.label}</p>
                <Link
                  href={item.href}
                  className="mb-2 block text-sm text-orange-500 hover:underline"
                >
                  {item.value}
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-6 border-b border-gray-700 pb-6 md:mb-8 md:gap-8 md:pb-8 lg:grid-cols-2">
          <div>
            <div className="mb-4 flex items-center space-x-2">
              {renderIcon(footer.administrative.icon)}
              <h3 className="text-lg font-bold text-white">{footer.administrative.title}</h3>
            </div>
            <p className="mb-2 text-sm text-white">{footer.administrative.address}</p>
            <p className="mb-4 text-sm text-white">
              {footer.administrative.note}{" "}
              <Link
                href={footer.administrative.pointsOfAttentionLink}
                className="text-orange-500 hover:underline"
              >
                puntos de atención
              </Link>
            </p>

            <h3 className="mb-4 text-lg font-bold text-white">Redes sociales</h3>
            <div className="flex space-x-3 sm:space-x-4">
              {footer.social.networks.map((network) => (
                <Link
                  key={network.name}
                  href={network.href}
                  className="text-white hover:text-white"
                >
                  {network.icon === "Facebook" && <Facebook className="h-5 w-5 sm:h-6 sm:w-6" />}
                  {network.icon === "Instagram" && <Instagram className="h-5 w-5 sm:h-6 sm:w-6" />}
                  {network.icon === "X" && <X className="h-5 w-5 sm:h-6 sm:w-6" />}
                  {network.icon === "Youtube" && <Youtube className="h-5 w-5 sm:h-6 sm:w-6" />}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center lg:items-end">
            <Image
              src={LogoBlancoPositiva}
              alt="Positiva Compañía de Seguros"
              width={200}
              height={50}
              className="mb-2 h-auto w-32 sm:w-40 md:w-48 lg:w-[200px]"
            />
          </div>
        </div>

        <nav className="mb-4 flex flex-col items-center justify-between space-y-4 border-b border-gray-700 pb-4 text-sm text-white lg:flex-row lg:space-y-0">
          <div className="flex flex-wrap justify-center space-x-2 text-center text-xs sm:space-x-4 sm:text-sm">
            {footer.legal.map((link, index) => (
              <div key={link.name + index}>
                <Link href={link.href} className="hover:underline">
                  {link.name}
                </Link>
                {index < footer.legal.length - 1 && <span className="h-4 bg-gray-700"></span>}
              </div>
            ))}
            <span className="h-4 w-px bg-gray-700"></span>
            <p className="text-white">Ultima actualización: {footer.lastUpdate}</p>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Image
              src={LogoFooter1}
              alt="Colombia Logo"
              width={50}
              height={28}
              className="h-auto"
            />
            <span className="text-xs text-white">
              {" "}
              <Image
                src={LogoFooter2}
                alt="Logo de Gobierno de Colombia"
                width={210}
                height={48}
                className="h-auto"
              />
            </span>
          </div>
        </nav>

        <div className="text-center text-xs text-white sm:text-sm">
          © 2025 Positiva Compañía de Seguros. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
