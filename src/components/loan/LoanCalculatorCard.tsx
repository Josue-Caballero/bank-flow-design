import { formatCurrency, formatPercentage } from "@/utils/loanCalculator";
import { TrendingUp, DollarSign, Percent } from "lucide-react";

interface LoanCalculatorCardProps {
  monthlyPayment: number;
  interestRate: number;
  totalCost: number;
  totalInterest: number;
}

export const LoanCalculatorCard = ({
  monthlyPayment,
  interestRate,
  totalCost,
  totalInterest,
}: LoanCalculatorCardProps) => {
  return (
    <div className="bg-accent rounded-2xl p-6 border border-border">
      <h3 className="text-sm font-semibold text-accent-foreground mb-4">
        Simulación de Préstamo
      </h3>

      <div className="space-y-4">
        {/* Monthly Payment - Main Focus */}
        <div className="bg-background rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <DollarSign className="h-4 w-4" />
            <p className="text-xs font-medium">Cuota mensual estimada</p>
          </div>
          <p className="text-3xl font-bold text-primary">
            {formatCurrency(monthlyPayment)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">por mes</p>
        </div>

        {/* Interest Rate */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Percent className="h-4 w-4" />
            <span className="text-sm">Tasa referencial (TEA)</span>
          </div>
          <span className="text-sm font-semibold text-foreground">
            {formatPercentage(interestRate)}
          </span>
        </div>

        {/* Total Cost */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm">Costo total del crédito</span>
          </div>
          <span className="text-sm font-semibold text-foreground">
            {formatCurrency(totalCost)}
          </span>
        </div>

        {/* Total Interest */}
        <div className="flex items-center justify-between py-2 pt-3 border-t border-border">
          <span className="text-xs text-muted-foreground">Interés total a pagar</span>
          <span className="text-xs font-medium text-muted-foreground">
            {formatCurrency(totalInterest)}
          </span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
        * Esta es una simulación referencial. Los valores finales pueden variar según la evaluación crediticia y condiciones del mercado.
      </p>
    </div>
  );
};
