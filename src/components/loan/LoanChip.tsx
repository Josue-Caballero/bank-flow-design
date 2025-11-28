import { cn } from "@/lib/utils";

interface LoanChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export const LoanChip = ({ label, selected, onClick }: LoanChipProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-10 px-4 rounded-full font-medium text-sm",
        "transition-all duration-200",
        "border",
        selected
          ? "bg-primary text-primary-foreground border-primary shadow-sm"
          : "bg-neutral-100 text-neutral-700 border-neutral-200 hover:bg-neutral-200"
      )}
    >
      {label}
    </button>
  );
};
