export type LoanType = "personal" | "vehicular" | "hipotecario" | "negocio";

export type EmploymentType = "dependiente" | "independiente";

export type MaritalStatus = "soltero" | "casado" | "divorciado" | "viudo";

export interface LoanTypeOption {
  id: LoanType;
  title: string;
  description: string;
  icon: string;
  minAmount: number;
  maxAmount: number;
  terms: number[];
}

export interface PersonalData {
  fullName: string;
  documentId: string;
  birthDate: Date | undefined;
  maritalStatus: MaritalStatus;
  phone: string;
  email: string;
  address: string;
  isExistingClient: boolean;
}

export interface WorkInfo {
  employmentType: EmploymentType;
  position: string;
  companyName: string;
  monthlyIncome: number;
  workYears: number;
  companyPhone: string;
}

export interface LoanDetails {
  amount: number;
  term: number;
  purpose: string;
  guaranteeType?: string;
}

export interface DocumentUpload {
  type: string;
  name: string;
  uploaded: boolean;
  file?: File;
}

export interface LoanCalculation {
  monthlyPayment: number;
  interestRate: number;
  totalCost: number;
  totalInterest: number;
}

export interface CreditScore {
  score: number;
  rating: "excelente" | "bueno" | "regular" | "bajo";
  factors: {
    income: number;
    debtRatio: number;
    employment: number;
    history: number;
  };
  approved: boolean;
  maxApprovedAmount: number;
}

export interface LoanApplication {
  id?: string;
  loanType: LoanType;
  personalData: PersonalData;
  workInfo: WorkInfo;
  loanDetails: LoanDetails;
  documents: DocumentUpload[];
  calculation: LoanCalculation;
  creditScore?: CreditScore;
  status: "draft" | "submitted" | "evaluating" | "approved" | "rejected";
  createdAt: Date;
}
