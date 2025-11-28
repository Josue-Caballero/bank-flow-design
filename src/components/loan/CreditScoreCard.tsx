import { CreditScore } from "@/types/loan";
import { TrendingUp, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreditScoreCardProps {
  creditScore: CreditScore;
}

export const CreditScoreCard = ({ creditScore }: CreditScoreCardProps) => {
  const getRatingColor = (rating: CreditScore["rating"]) => {
    switch (rating) {
      case "excelente":
        return "text-success";
      case "bueno":
        return "text-primary";
      case "regular":
        return "text-warning";
      case "bajo":
        return "text-error";
    }
  };

  const getRatingIcon = () => {
    if (creditScore.approved) {
      return <CheckCircle className="h-12 w-12 text-success" />;
    }
    return <AlertCircle className="h-12 w-12 text-warning" />;
  };

  return (
    <div className="bg-accent rounded-2xl p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-accent-foreground">
          Evaluación Crediticia
        </h3>
        {getRatingIcon()}
      </div>

      {/* Score Display */}
      <div className="text-center mb-6 pb-6 border-b border-border">
        <p className="text-5xl font-bold text-primary mb-2">
          {creditScore.score}
        </p>
        <p className={cn("text-lg font-semibold capitalize", getRatingColor(creditScore.rating))}>
          {creditScore.rating}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Puntaje sobre 850
        </p>
      </div>

      {/* Approval Status */}
      <div
        className={cn(
          "rounded-xl p-4 mb-6",
          creditScore.approved ? "bg-success/10" : "bg-warning/10"
        )}
      >
        <div className="flex items-start gap-3">
          {creditScore.approved ? (
            <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
          ) : (
            <XCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
          )}
          <div>
            <p
              className={cn(
                "text-sm font-semibold mb-1",
                creditScore.approved ? "text-success" : "text-warning"
              )}
            >
              {creditScore.approved ? "Pre-aprobado" : "Requiere Evaluación"}
            </p>
            <p className="text-xs text-muted-foreground">
              {creditScore.approved
                ? `Monto máximo aprobado: $${creditScore.maxApprovedAmount.toLocaleString()}`
                : "Su solicitud será evaluada por nuestro equipo especializado"}
            </p>
          </div>
        </div>
      </div>

      {/* Factors Breakdown */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-muted-foreground mb-3">
          Factores de evaluación:
        </p>

        <div className="space-y-2">
          <FactorBar
            label="Ingresos"
            value={creditScore.factors.income}
            max={250}
          />
          <FactorBar
            label="Ratio de endeudamiento"
            value={creditScore.factors.debtRatio}
            max={200}
          />
          <FactorBar
            label="Estabilidad laboral"
            value={creditScore.factors.employment}
            max={200}
          />
          <FactorBar
            label="Historial bancario"
            value={creditScore.factors.history}
            max={150}
          />
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-6 leading-relaxed">
        * Esta evaluación es preliminar y está sujeta a verificación de documentos y aprobación final.
      </p>
    </div>
  );
};

interface FactorBarProps {
  label: string;
  value: number;
  max: number;
}

const FactorBar = ({ label, value, max }: FactorBarProps) => {
  const percentage = (value / max) * 100;

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-xs font-medium text-foreground">
          {Math.round(value)}/{max}
        </span>
      </div>
      <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};
