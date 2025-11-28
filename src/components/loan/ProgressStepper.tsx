import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: number;
  title: string;
  description?: string;
}

interface ProgressStepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export const ProgressStepper = ({ steps, currentStep, onStepClick }: ProgressStepperProps) => {
  return (
    <nav className="w-full">
      <ol className="space-y-2">
        {steps.map((step, index) => {
          const isComplete = index < currentStep;
          const isCurrent = index === currentStep;
          const isClickable = index < currentStep && onStepClick;

          return (
            <li key={step.id}>
              <button
                type="button"
                onClick={() => isClickable && onStepClick(index)}
                disabled={!isClickable}
                className={cn(
                  "w-full flex items-start gap-4 p-4 rounded-xl transition-all duration-200 text-left",
                  isCurrent && "bg-accent border border-primary",
                  isComplete && isClickable && "hover:bg-accent/50 cursor-pointer",
                  !isCurrent && !isClickable && "cursor-default"
                )}
              >
                {/* Step indicator */}
                <div
                  className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all",
                    isComplete && "bg-primary text-primary-foreground",
                    isCurrent && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                    !isComplete && !isCurrent && "bg-neutral-200 text-neutral-500"
                  )}
                >
                  {isComplete ? <Check className="h-4 w-4" /> : index + 1}
                </div>

                {/* Step content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <p
                    className={cn(
                      "text-sm font-semibold leading-tight",
                      isCurrent && "text-primary",
                      isComplete && "text-foreground",
                      !isComplete && !isCurrent && "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </p>
                  {step.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {step.description}
                    </p>
                  )}
                </div>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
