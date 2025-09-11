"use client";

// import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
// import { Menu, X } from "lucide-react"; // ChevronDown,
// import { redirections } from "@/lib/utils/redirections";
// import LogoHeader from "@/public/positiva-header-logo.svg";
import LogoHeader from "@/public/positiva-logo-pensionados.svg";
// import { Icon } from "@/components/ui/icon";
// import IconMenu from "@/public/sprite-icons-menu.svg";

export function Header() {
  // const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // const toggleMobileMenu = () => {
  //   setIsMobileMenuOpen(!isMobileMenuOpen);
  // };

  // const getIcon = (iconName: string) => {
  //   return <Icon name={iconName} className="h-8 w-8.75" spritePath={IconMenu.src} />;
  // };

  return (
    <header>
      <div className="flex min-h-[90px] w-full flex-col items-center justify-center bg-white py-2.5 md:py-3.75">
        <div className="flex w-full max-w-[1440px] justify-between px-5 lg:pl-22.5">
          <div className="mr-auto flex items-center space-x-2 sm:space-x-4">
            <Link href="/">
              <Image
                src={LogoHeader}
                alt="Positiva Compañía de Seguros"
                width={462.86}
                height={60}
                loading="eager"
                className="h-auto"
              />
            </Link>
          </div>

          {/* <nav className="mx-auto hidden max-w-[795.32px] items-center lg:flex">
            {redirections.topNav.map((item) => (
              <div
                key={item.name}
                className="flex items-center border-r border-white px-8.75 last:border-0"
              >
                <Link
                  href={item.href}
                  className="font-poppins text-4 flex items-center gap-1.25 font-extrabold whitespace-nowrap hover:underline"
                >
                  {getIcon(item.name)}
                  <span>{item.name}</span>
                </Link>
              </div>
            ))}
          </nav> */}

          {/* <button
            onClick={toggleMobileMenu}
            className="hover:bg-primary-positiva flex items-center justify-center rounded-md p-2 transition-colors lg:hidden"
            aria-label="Abrir menú"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button> */}
        </div>
      </div>
      <div className="flex h-2.5 w-full">
        <div className="bg-navy-primary h-full w-full"></div>
        <div className="bg-primary-positiva h-full w-full"></div>
      </div>

      {/* Mobile Menu */}
      {/* {isMobileMenuOpen && (
        <div className="border-t border-orange-400 text-white lg:hidden">
          <div className="border-primary-positiva bg-primary-positiva border-b px-5 py-4">
            <h3 className="mb-3 text-sm font-semibold text-orange-100">Servicios</h3>
            <nav className="space-y-2">
              {redirections.topNav.map((item, index) => (
                <Link
                  key={item.name + index}
                  href={item.href}
                  className="flex items-center space-x-2 rounded-md px-3 py-2 transition-colors hover:bg-orange-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {getIcon(item.name)}
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="bg-navy-primary px-5 py-4">
            <h3 className="mb-3 text-sm font-semibold text-orange-100">Navegación</h3>
            <nav className="space-y-2">
              {redirections.header.map((item, index) => (
                <Link
                  key={item.href + index}
                  href={item.href}
                  className="flex items-center justify-between rounded-md px-3 py-2 transition-colors hover:bg-orange-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-sm">{item.name}</span>
                  {item.hasSubmenu && <ChevronDown className="h-4 w-4" />}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      <div className="bg-navy-primary hidden text-white lg:block">
        <div className="font-poppins mx-auto flex max-w-[1440px] items-center justify-center px-4 py-4">
          <nav className="flex items-center gap-[37.5px]">
            {redirections.header.map((item, index) => (
              <Link
                key={index + item.name}
                href={item.href}
                className="flex items-center space-x-1 text-center text-sm transition-colors hover:text-white/80 lg:text-nowrap"
              >
                <span>{item.name}</span>
                {item.hasSubmenu && <ChevronDown className="h-4 w-4" />}
              </Link>
            ))}
          </nav>
        </div>
      </div> */}
    </header>
  );
}
