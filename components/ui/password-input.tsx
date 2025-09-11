"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordValidation } from "@/lib/hooks/use-password-validation";
import IconEyeShow from "@/public/icon-eye-show.svg";
import IconEyehide from "@/public/icon-eye-hide.svg";
import IconPadLock from "@/public/icon-padlock.svg";
import Image from "next/image";

interface PasswordInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  placeholder?: string;
  validation?: PasswordValidation;
  touched?: boolean;
  required?: boolean;
  className?: string;
}

const ValidationIcon = ({ isValid }: { isValid: boolean }) =>
  isValid ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />;

export function PasswordInput({
  id,
  label,
  value,
  onChange,
  onBlur,
  disabled = false,
  placeholder = "Tu contraseña",
  validation,
  touched = false,
  required = false,
  className = "",
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const getFieldState = () => {
    if (!validation) return "default";
    if (touched && !validation.isValid) return "invalid";
    if (touched && validation.isValid) return "valid";
    return "default";
  };

  const fieldState = getFieldState();

  // Cuenta criterios cumplidos (5 en total)
  const met = validation
    ? [
        validation.minLength,
        validation.hasUppercase,
        validation.hasLowercase,
        validation.hasNumber,
        validation.hasSpecialChar,
      ].filter(Boolean).length
    : 0;

  // Reglas: <2 => Baja, 2-4 => Media, 5 => Fuerte
  const strengthLabel = met === 5 ? "Fuerte" : met >= 2 ? "Media" : "Baja";

  const percent = Math.round((met / 5) * 100); // 0,20,40,60,80,100

  const palette =
    strengthLabel === "Fuerte"
      ? { fill: "bg-custom-color-green-state" }
      : strengthLabel === "Media"
        ? { fill: "bg-custom-color-yellow-state" }
        : { fill: "bg-custom-color-red-state" };

  // Mostrar barra solo si hay algo escrito (o usa `touched` si prefieres)
  const showStrength = Boolean(value?.length) && Boolean(validation);

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Image
          src={IconPadLock.src}
          alt="icon-padlock"
          className="absolute top-1/2 left-4.75 -translate-y-1/2 transform"
          height={19.25}
          width={14.67}
          loading="lazy"
        />
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder}
          required={required}
          className={`mt-2 w-full px-11.75 ${
            fieldState === "invalid"
              ? "border-red-500 focus:ring-red-500"
              : fieldState === "valid"
                ? "border-green-500 focus:ring-green-500"
                : ""
          } ${className}`}
        />
        <div className="absolute top-1/2 right-3 flex -translate-y-1/2 transform items-center space-x-2">
          {validation && touched && <ValidationIcon isValid={validation.isValid} />}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-400 hover:text-gray-600"
          >
            <Image
              src={showPassword ? IconEyehide.src : IconEyeShow.src}
              alt="icon-mail"
              className=""
              height={13.75}
              width={20.17}
              loading="lazy"
            />
          </button>
        </div>
      </div>
      {showStrength && (
        <div className="flex w-full justify-center px-2">
          <div className="border-custom-gray-border-inputs w-full rounded-b-lg border border-t-0 p-0.75">
            <div className={`relative h-6 rounded-md bg-white`}>
              {/* Relleno de progreso */}
              <div
                className={`absolute top-0 left-0 h-full rounded-md transition-[width] duration-300 ease-out ${palette.fill}`}
                style={{ width: `${percent}%` }}
              >
                {/* Etiqueta a la derecha */}
                <span
                  className={`text-label-inputs absolute inset-y-0 right-2 flex items-center text-sm font-semibold`}
                  aria-live="polite"
                >
                  {strengthLabel}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
