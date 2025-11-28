import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BankButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const BankButton = React.forwardRef<HTMLButtonElement, BankButtonProps>(
  ({ variant = "primary", loading, fullWidth, children, className, disabled, ...props }, ref) => {
    const variants = {
      primary: "bg-primary text-primary-foreground hover:bg-bank-blue-dark shadow-md",
      secondary: "bg-secondary text-secondary-foreground hover:bg-neutral-300",
      ghost: "bg-transparent text-neutral-700 hover:bg-neutral-100",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "h-12 px-6 rounded-xl font-semibold text-base",
          "transition-all duration-200",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "flex items-center justify-center gap-2",
          fullWidth && "w-full",
          variants[variant],
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

BankButton.displayName = "BankButton";
