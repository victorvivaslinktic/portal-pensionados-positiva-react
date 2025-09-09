"use client";

import { useState } from "react";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordValidation } from "@/lib/hooks/use-password-validation";

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

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder}
          required={required}
          className={`mt-2 w-full pr-16 ${
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
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
