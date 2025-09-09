"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button as ShadcnButton } from "@/components/ui/button";

export interface CustomButtonProps
  extends Omit<React.ComponentPropsWithoutRef<typeof ShadcnButton>, "children"> {
  children?: React.ReactNode;
  name?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  color?: "primary" | "secondary" | "destructive" | "outline" | "ghost" | "link";
  onClick?: () => void | Promise<void>;
}

export const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  (
    {
      children,
      name,
      icon,
      iconPosition = "left",
      loading = false,
      disabled = false,
      className,
      color = "primary",
      onClick,
      ...props
    },
    ref
  ) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [isDisabled, setIsDisabled] = React.useState(disabled);

    React.useEffect(() => {
      setIsLoading(loading);
    }, [loading]);

    React.useEffect(() => {
      setIsDisabled(disabled);
    }, [disabled]);

    const handleClick = async () => {
      if (isLoading || isDisabled || !onClick) return;

      setIsLoading(true);
      setIsDisabled(true);

      try {
        await onClick();
      } catch (error) {
        console.error("Error en botón:", error);
      } finally {
        setIsLoading(false);
        setIsDisabled(false);
      }
    };

    const getVariant = () => {
      switch (color) {
        case "primary":
          return "default";
        case "secondary":
          return "secondary";
        case "destructive":
          return "destructive";
        case "outline":
          return "outline";
        case "ghost":
          return "ghost";
        case "link":
          return "link";
        default:
          return "default";
      }
    };

    const getClassName = () => {
      const baseClasses = "relative";

      if (color === "primary") {
        return cn(
          baseClasses,
          "bg-primary-positiva hover:bg-accent-positiva text-white",
          className
        );
      }

      return cn(baseClasses, className);
    };

    const renderContent = () => {
      if (isLoading) {
        return (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {name && <span className="ml-2">{name}</span>}
          </>
        );
      }

      const iconElement = icon && <span className="ml-2">{icon}</span>;

      if (children) {
        return children;
      }

      if (name) {
        return (
          <>
            {iconPosition === "left" && iconElement}
            {name}
            {iconPosition === "right" && iconElement}
          </>
        );
      }

      return icon;
    };

    return (
      <ShadcnButton
        ref={ref}
        variant={getVariant()}
        className={cn(
          "inline-flex w-auto items-center rounded-[7px] px-[62px] py-[12px]",
          getClassName(),
          className
        )}
        disabled={isDisabled || isLoading}
        onClick={handleClick}
        {...props}
      >
        {renderContent()}
      </ShadcnButton>
    );
  }
);

CustomButton.displayName = "CustomButton";
