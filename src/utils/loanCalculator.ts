import { LoanType, LoanCalculation, WorkInfo, LoanDetails, CreditScore, EmploymentType } from "@/types/loan";

// Interest rates by loan type (annual percentage)
const INTEREST_RATES: Record<LoanType, number> = {
  personal: 15.5,
  vehicular: 12.8,
  hipotecario: 8.5,
  negocio: 14.2,
};

/**
 * Calculate monthly payment using the amortization formula
 */
export function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  months: number
): number {
  const monthlyRate = annualRate / 100 / 12;
  
  if (monthlyRate === 0) {
    return principal / months;
  }
  
  const payment =
    principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);
  
  return Math.round(payment * 100) / 100;
}

/**
 * Calculate complete loan details
 */
export function calculateLoan(
  loanType: LoanType,
  amount: number,
  term: number
): LoanCalculation {
  const interestRate = INTEREST_RATES[loanType];
  const monthlyPayment = calculateMonthlyPayment(amount, interestRate, term);
  const totalCost = monthlyPayment * term;
  const totalInterest = totalCost - amount;
  
  return {
    monthlyPayment,
    interestRate,
    totalCost,
    totalInterest,
  };
}

/**
 * Calculate credit score based on multiple factors
 */
export function calculateCreditScore(
  workInfo: WorkInfo,
  loanDetails: LoanDetails,
  isExistingClient: boolean
): CreditScore {
  let score = 0;
  const factors = {
    income: 0,
    debtRatio: 0,
    employment: 0,
    history: 0,
  };
  
  // Income factor (0-250 points)
  const incomeScore = Math.min(250, (workInfo.monthlyIncome / 1000) * 25);
  factors.income = incomeScore;
  score += incomeScore;
  
  // Debt-to-income ratio (0-200 points)
  const monthlyPayment = calculateMonthlyPayment(
    loanDetails.amount,
    INTEREST_RATES["personal"],
    loanDetails.term
  );
  const debtRatio = (monthlyPayment / workInfo.monthlyIncome) * 100;
  let debtScore = 0;
  if (debtRatio < 30) debtScore = 200;
  else if (debtRatio < 40) debtScore = 150;
  else if (debtRatio < 50) debtScore = 100;
  else debtScore = 50;
  factors.debtRatio = debtScore;
  score += debtScore;
  
  // Employment stability (0-200 points)
  const employmentScore = workInfo.employmentType === "dependiente" ? 150 : 100;
  const yearsScore = Math.min(50, workInfo.workYears * 15);
  factors.employment = employmentScore + yearsScore;
  score += factors.employment;
  
  // Banking history (0-150 points)
  const historyScore = isExistingClient ? 150 : 75;
  factors.history = historyScore;
  score += historyScore;
  
  // Normalize to 850 (like FICO)
  score = Math.min(850, Math.max(300, score));
  
  // Determine rating
  let rating: CreditScore["rating"];
  if (score >= 750) rating = "excelente";
  else if (score >= 650) rating = "bueno";
  else if (score >= 550) rating = "regular";
  else rating = "bajo";
  
  // Approval decision
  const approved = score >= 550 && debtRatio < 50;
  
  // Max approved amount (based on income and score)
  const maxApprovedAmount = Math.floor(
    workInfo.monthlyIncome * (score / 200) * 0.4 * loanDetails.term
  );
  
  return {
    score,
    rating,
    factors,
    approved,
    maxApprovedAmount,
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format percentage for display
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}
