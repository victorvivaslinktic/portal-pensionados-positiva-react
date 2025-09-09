"use client";

import { Check, X } from "lucide-react";
import { PasswordValidation } from "@/lib/hooks/use-password-validation";

interface PasswordRequirementsProps {
  validation: PasswordValidation;
  show?: boolean;
}

const ValidationIcon = ({ isValid }: { isValid: boolean }) =>
  isValid ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />;

export function PasswordRequirements({ validation, show = true }: PasswordRequirementsProps) {
  if (!show) return null;

  return (
    <div className="mt-2 space-y-1">
      <div
        className={`flex items-center space-x-2 text-sm ${validation.minLength ? "text-green-600" : "text-red-600"}`}
      >
        <ValidationIcon isValid={validation.minLength} />
        <span>Mínimo 12 caracteres</span>
      </div>
      <div
        className={`flex items-center space-x-2 text-sm ${validation.hasUppercase ? "text-green-600" : "text-red-600"}`}
      >
        <ValidationIcon isValid={validation.hasUppercase} />
        <span>Al menos una letra mayúscula</span>
      </div>
      <div
        className={`flex items-center space-x-2 text-sm ${validation.hasLowercase ? "text-green-600" : "text-red-600"}`}
      >
        <ValidationIcon isValid={validation.hasLowercase} />
        <span>Al menos una letra minúscula</span>
      </div>
      <div
        className={`flex items-center space-x-2 text-sm ${validation.hasNumber ? "text-green-600" : "text-red-600"}`}
      >
        <ValidationIcon isValid={validation.hasNumber} />
        <span>Al menos un número</span>
      </div>
      <div
        className={`flex items-center space-x-2 text-sm ${validation.hasSpecialChar ? "text-green-600" : "text-red-600"}`}
      >
        <ValidationIcon isValid={validation.hasSpecialChar} />
        <span>Al menos un carácter especial</span>
      </div>
    </div>
  );
}
