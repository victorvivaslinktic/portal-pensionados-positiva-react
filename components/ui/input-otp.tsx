"use client";

import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { MinusIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function InputOTP({
  className,
  containerClassName,
  onChange,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string;
}) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn("flex items-center gap-2 has-disabled:opacity-50", containerClassName)}
      className={cn("font-poppins disabled:cursor-not-allowed", className)}
      inputMode="numeric"
      pattern="[0-9]*"
      onChange={(value) => {
        const numericValue = value.replace(/\D/g, "");
        if (onChange) {
          onChange(numericValue);
        }
      }}
      {...props}
    />
  );
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="input-otp-group" className={cn("flex items-center", className)} {...props} />
  );
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number;
}) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      data-filled={!!char}
      className={cn(
        "font-poppins relative flex h-[3em] w-[3em] items-center justify-center rounded-md border-2 text-sm shadow-xs transition-all outline-none md:h-[56px] md:w-[55px]",

        "data-[active=true]:border-[var(--primary-positiva)] data-[active=true]:ring-1 data-[active=true]:ring-orange-500",

        "aria-invalid:border-destructive data-[active=true]:aria-invalid:border-destructive data-[active=true]:aria-invalid:ring-destructive/20 dark:data-[active=true]:aria-invalid:ring-destructive/40",
        "dark:bg-input/30 border-input font-roboto text-[#313131;] text-center text-sm font-semibold md:text-lg",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="font-poppins pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink bg-foreground font-poppins h-4 w-px duration-1000" />
        </div>
      )}
    </div>
  );
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="input-otp-separator" role="separator" {...props}>
      <MinusIcon />
    </div>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
