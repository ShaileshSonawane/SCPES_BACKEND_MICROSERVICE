export interface User {
  id: string;
  userCode: string;
  scpeId?: string;
  email: string;
  role: string;
  permissions?: string[];
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresInSec?: number;
  expiresIn?: number;
  role?: string;
  userId?: string;
  email?: string;
  userCode?: string;
  scpeId?: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  email?: string;
  scpeId?: string;
  simulatedOtp?: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
  email?: string;
  scpeId?: string;
}

export interface RecruiterRegisterData {
  companyName: string;
  recruiterName: string;
  email: string;
  password: string;
  phone?: string;
  sector?: string;
  website?: string;
}

export interface DriveRound {
  id?: string;
  scpeId?: string;
  roundNumber: number;
  name: string;
  scheduledAt?: string;
}

export interface Drive {
  id: string;
  scpeId?: string;
  companyId?: string;
  companyName: string;
  role: string;
  ctc: number;
  driveDate?: string;
  lastApplyDate?: string;
  status: 'DRAFT' | 'OPEN' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  category?: string;
  rounds: DriveRound[];
  rulesConfigured?: boolean;
}

export interface EligibilityRule {
  id?: string;
  scpeId?: string;
  ruleType: string;
  paramKey: string;
  operator: 'GTE' | 'LTE' | 'EQ' | 'IN' | 'BETWEEN';
  expectedValue: string;
  errorMessage?: string;
}

export interface EligibilityRow {
  studentId: string;
  scpeId?: string;
  eligible: boolean;
  reasons: string[];
}

export interface StudentProfile {
  id: string;
  userId: string;
  scpeId?: string;
  rollNo: string;
  name: string;
  branch: string;
  batch: string;
  passoutYear: number;
  phone?: string;
  skills: string[];
  academicRecord?: {
    scpeId?: string;
    tenthPct: number;
    twelfthPct: number;
    cgpa: number;
    activeBacklogs: number;
    backlogHistory: number;
    gapYears: number;
    verificationStatus: 'DRAFT' | 'SUBMITTED' | 'VERIFIED' | 'REJECTED';
  };
}

export interface Application {
  id: string;
  scpeId?: string;
  driveId: string;
  studentId: string;
  status: 'APPLIED' | 'SHORTLISTED' | 'INTERVIEW_SCHEDULED' | 'SELECTED' | 'REJECTED';
  appliedAt: string;
  driveRole?: string;
  companyName?: string;
}

export interface NotificationItem {
  id: string;
  scpeId?: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationSummary {
  unreadCount: number;
  notifications: NotificationItem[];
}
