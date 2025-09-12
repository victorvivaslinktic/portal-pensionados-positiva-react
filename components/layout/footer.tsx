"use client";

import Link from "next/link";
import Image from "next/image";
// import { Hammer, Building, UserRound, MapPin, Facebook, Instagram, X, Youtube } from "lucide-react";
// import { redirections } from "@/lib/utils/redirections";
import PuntosDeAtencion from "@/public/puntos-de-atencion-positiva.svg";
import LogoBlancoPositiva from "@/public/positiva-logo-footer.svg";
import IconContact from "@/public/contactanos-footer-positiva.svg";
import LinkFooter from "../ui/linkFooter";
import TitleFooter from "../ui/titleFooter";
import FacebookIcon from "@/public/facebook.svg";
import XIcon from "@/public/X-icon.svg";
import InstagramIcon from "@/public/instagram.svg";
import YoutubeIcon from "@/public/Youtube-icon.svg";
import LogoMovil from "@/public/logo-movil-positiva.svg";

export function Footer() {
  // const { footer } = redirections;

  // const renderIcon = (iconName: string) => {
  //   const icons = {
  //     Building: <Building className="h-6 w-6 text-orange-500" />,
  //     Hammer: <Hammer className="h-6 w-6 text-orange-500" />,
  //     UserRound: <UserRound className="h-6 w-6 text-orange-500" />,
  //     MapPin: <MapPin className="h-6 w-6 text-orange-500" />,
  //   };
  //   return icons[iconName as keyof typeof icons];
  // };

  return (
    <footer className="text-white">
      <div className="bg-[var(--navy-primary)] pt-[50px] pb-[30px]">
        <div className="containerMaxWidth flex flex-col items-start gap-[40px] md:flex-row md:gap-[143px]">
          <div className="w-fit">
            <Image
              src={LogoMovil}
              width={403}
              height={60}
              alt="Logo positiva móvil"
              className="block sm:hidden"
            />

            {/* Logo desktop */}
            <Image
              src={LogoBlancoPositiva}
              width={208}
              height={40}
              alt="Logo positiva blanco"
              className="hidden sm:block"
            />
          </div>

          <div className="flex w-full flex-row gap-7">
            <div className="col-span-1 flex w-[36%] flex-col gap-2.5">
              <TitleFooter
                text="Contáctanos"
                iconAlt="Icono de contacto"
                iconSrc={IconContact.src}
              />

              <LinkFooter
                description="Líneas gratuitas de atención nacional"
                href="tel:+57018000111170"
                linkText="01-8000-111-170"
              />
              <LinkFooter
                description="Líneas de atención en Bogotá"
                href="tel:+576013307000"
                linkText=" +57 (601) 330 -7000"
              />
              <LinkFooter
                description="Correo electrónico"
                href="mailto:servicioalcliente@positiva.gov.co"
                linkText="servicioalcliente@positiva.gov.co"
              />
            </div>

            <div className="col-span-1 flex w-full flex-col gap-7 md:w-[60%] md:flex-row md:justify-between">
              <div className="flex flex-col gap-2.5 md:w-[43%]">
                <TitleFooter
                  text="Puntos de atención"
                  iconAlt="Puntos de atencion"
                  iconSrc={PuntosDeAtencion.src}
                />

                <LinkFooter
                  description="Conoce todos nuestros puntos de atención y elige el más cercano a ti."
                  addBreak={false}
                  href="https://positiva.gov.co/canales-de-atencion/puntos-de-atencion/"
                  linkText="¡Haz clic aquí!"
                />
              </div>

              <div className="flex flex-col gap-2.5 md:w-[147px]">
                <TitleFooter text="Redes sociales" />

                <div className="flex flex-nowrap gap-2">
                  <Link
                    href="http://facebook.com/PositivaCompaniaDeSeguros/?locale=es_LA"
                    target="_blank"
                  >
                    {" "}
                    <Image src={FacebookIcon} width={31} height={30} alt="Facebook icono" />{" "}
                  </Link>

                  <Link
                    href="https://www.instagram.com/positivacol/?hl=es"
                    target="_blank"
                  >
                    <Image src={InstagramIcon} width={31} height={30} alt="Instagram icono" />
                  </Link>
                  <Link
                    href="https://x.com/PositivaCol"
                    target="_blank"
                  >
                    <Image src={XIcon} width={31} height={30} alt="X icono" />
                  </Link>
                  <Link
                    href="https://www.youtube.com/@PositivaColombia"
                    target="_blank"
                  >
                    <Image src={YoutubeIcon} width={31} height={30} alt="Youtube icono" />
                  </Link>
                </div>
                <a
                  href="https://www.positiva.gov.co"
                  className="mt-[-5px] text-sm font-semibold text-[var(--primary-positiva)] underline"
                >
                  www.positiva.gov.co
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer bottom */}
      <div className="flex justify-center bg-[#0D2333] px-[10px] py-[15px] text-[12px] md:text-[14px]">
        <h4>© 2025 Positiva Compañía de Seguros. Todos los derechos reservados.</h4>
      </div>
    </footer>
  );
}
