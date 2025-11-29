import { LoanType, LoanApplication } from "./loan";

// Application statuses
export type ApplicationStatus = 
  | "draft"
  | "submitted" 
  | "in-review"
  | "pending-approval"
  | "approved"
  | "rejected"
  | "disbursed"
  | "cancelled";

// Approval types
export type ApprovalType = "automatic" | "manual";
export type ApprovalDecision = "approved" | "rejected" | "pending";
export type RiskLevel = "low" | "medium" | "high" | "critical";

// Extended application for admin
export interface AdminLoanApplication extends LoanApplication {
  id: string;
  submittedAt: Date;
  lastUpdatedAt: Date;
  assignedTo?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
  approvalType: ApprovalType;
  riskLevel: RiskLevel;
  notes: ApprovalNote[];
  history: ApplicationHistoryEntry[];
}

// Approval notes
export interface ApprovalNote {
  id: string;
  author: string;
  content: string;
  createdAt: Date;
  isInternal: boolean;
}

// Application history
export interface ApplicationHistoryEntry {
  id: string;
  action: string;
  performedBy: string;
  timestamp: Date;
  details?: string;
  previousStatus?: ApplicationStatus;
  newStatus?: ApplicationStatus;
}

// Approval rules
export interface ApprovalRule {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  priority: number;
  conditions: RuleCondition[];
  action: RuleAction;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface RuleCondition {
  field: string;
  operator: "equals" | "greater_than" | "less_than" | "between" | "in" | "not_in";
  value: any;
  label?: string;
}

export interface RuleAction {
  type: "auto_approve" | "auto_reject" | "require_manual_review" | "assign_to";
  parameters?: {
    maxAmount?: number;
    assignTo?: string;
    reason?: string;
  };
}

// Decision record
export interface ApprovalDecisionRecord {
  id: string;
  applicationId: string;
  decision: ApprovalDecision;
  decisionType: ApprovalType;
  decidedBy: string;
  decidedAt: Date;
  reason?: string;
  conditions?: string[];
  approvedAmount?: number;
  terms?: {
    interestRate?: number;
    termMonths?: number;
    conditions?: string[];
  };
}

// Admin user
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "analyst" | "supervisor" | "manager" | "admin";
  department: string;
  permissions: AdminPermission[];
  avatar?: string;
}

export type AdminPermission = 
  | "view_applications"
  | "approve_applications"
  | "reject_applications"
  | "edit_rules"
  | "view_reports"
  | "manage_users"
  | "configure_system";

// Statistics
export interface ApprovalStatistics {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  inReview: number;
  averageProcessingTime: number; // in hours
  autoApprovalRate: number; // percentage
  approvalRate: number; // percentage
  byLoanType: {
    [key in LoanType]: {
      total: number;
      approved: number;
      rejected: number;
    };
  };
}

// Filters for application list
export interface ApplicationFilters {
  status?: ApplicationStatus[];
  loanType?: LoanType[];
  riskLevel?: RiskLevel[];
  approvalType?: ApprovalType[];
  dateFrom?: Date;
  dateTo?: Date;
  assignedTo?: string;
  searchTerm?: string;
  minAmount?: number;
  maxAmount?: number;
}
