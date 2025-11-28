import React from "react";
import { cn } from "@/lib/utils";

interface BankInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const BankInput = React.forwardRef<HTMLInputElement, BankInputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="w-full">
        <label className="block text-xs font-medium text-neutral-700 mb-1.5">
          {label}
        </label>
        <input
          ref={ref}
          className={cn(
            "w-full h-[52px] px-4 text-base text-neutral-900",
            "bg-background border border-border rounded-xl",
            "placeholder:text-sm placeholder:text-muted-foreground",
            "transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-error focus:ring-error",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs text-error font-medium">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-xs text-muted-foreground">{helperText}</p>
        )}
      </div>
    );
  }
);

BankInput.displayName = "BankInput";
