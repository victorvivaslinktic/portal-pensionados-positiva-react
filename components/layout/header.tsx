"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
// import { Umbrella, DollarSign, Users, HardHat, Heart, ChevronDown, Menu, X } from "lucide-react";
import { ChevronDown, Menu, X } from "lucide-react";
import { redirections } from "@/lib/utils/redirections";
import LogoHeader from "@/public/positiva-header-logo.svg";
import { Icon } from "@/components/ui/icon";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const getIcon = (iconName: string) => {
    return <Icon name={iconName} className="h-8 w-8.75" spritePath="/sprite-icons-menu.svg" />;
    //   switch (iconName) {
    //     case "HardHat":
    //       return <HardHat className="h-4 w-4" />;
    //     case "Umbrella":
    //       return <Umbrella className="h-4 w-4" />;
    //     case "DollarSign":
    //       return <DollarSign className="h-4 w-4" />;
    //     case "Heart":
    //       return <Heart className="h-4 w-4" />;
    //     case "Users":
    //       return <Users className="h-4 w-4" />;
    //     default:
    //       return null;
    //   }
  };

  return (
    <header>
      <div className="bg-primary-positiva flex min-h-[70px] items-center justify-center py-3 text-white">
        <div className="flex w-full max-w-[1440px] justify-between px-5 lg:pr-70 lg:pl-30">
          <div className="mr-auto flex items-center space-x-2 sm:space-x-4">
            <Link href="/">
              <Image
                src={LogoHeader}
                alt="Positiva Compañía de Seguros"
                width={160}
                height={40}
                loading="eager"
                className="h-auto"
              />
            </Link>
          </div>

          <nav className="mx-auto hidden max-w-[795.32px] items-center lg:flex">
            {redirections.topNav.map((item) => (
              <div
                key={item.name}
                className="flex items-center border-r border-white px-8.75 last:border-0"
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-1.25 font-bold whitespace-nowrap hover:underline"
                >
                  {getIcon(item.name)}
                  <span>{item.name}</span>
                </Link>
                {/* {index < redirections.topNav.length - 1 && (
                    <span className="mx-4 h-6 w-px bg-white" />
                  )} */}
              </div>
            ))}
          </nav>

          <button
            onClick={toggleMobileMenu}
            className="flex items-center justify-center rounded-md p-2 transition-colors hover:bg-orange-600 lg:hidden"
            aria-label="Abrir menú"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
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
      </div>
    </header>
  );
}
