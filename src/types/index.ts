export type Role = 'caregiver' | 'nurse' | 'doctor';

export type Slot = 'Morning' | 'Afternoon' | 'Night' | 'Bedtime' | 'SOS';

export type PlanItemStatus = 'draft' | 'flagged' | 'approved';

export type DoseStatus = 'pending' | 'taken' | 'skipped';

export interface Dose {
  id: string;
  planItemId: string;
  medicineName: string;
  strength: string;
  form: string;
  slot: Slot;
  scheduledTime: string; // e.g. "08:00 AM"
  instructions: string; // e.g. "After breakfast (PC)"
  status: DoseStatus;
  confirmedAt?: string;
  skipReason?: string;
  dateStr: string; // YYYY-MM-DD
}

export interface PlanItem {
  id: string;
  patientId: string;
  kind: 'medicine' | 'follow_up' | 'warning' | 'diet' | 'physio';
  name: string;
  strength?: string;
  form?: string; // Tablet, Capsule, Syrup, Injection
  frequencyCode?: string; // OD, BD, TDS, QID, HS, SOS
  frequencyDecoded?: string; // "Once daily", "Twice daily"
  slots?: Slot[];
  timingNotes?: string; // "After meals (PC)", "Empty stomach (AC)"
  duration?: string; // "x 14 days", "Ongoing"
  sourceText: string; // The exact line from discharge summary
  sourceLineNumber: number;
  confidence: number; // 0 to 100
  status: PlanItemStatus;
  flagReason?: string; // Clinical reason why item was flagged for nurse
  resolvedByNurse?: {
    nurseName: string;
    reviewedAt: string;
    clinicalNote: string;
  };
}

export interface WarningSign {
  id: string;
  sign: string;
  severity: 'emergency' | 'urgent';
  sourceText: string;
  sourceLine: number;
}

export interface DietRule {
  id: string;
  directive: string; // "Low salt (< 2g/day)"
  restrictions: string[]; // ["salt", "pickle", "papad", "sodium", "chips"]
  sourceText: string;
  sourceLine: number;
}

export interface MealLog {
  id: string;
  patientId: string;
  loggedAt: string;
  mealText: string;
  isCompliant: boolean;
  violationReason?: string;
  matchedRuleId?: string;
  sourceLineRef?: string;
}

export interface PhysioProvider {
  id: string;
  name: string;
  organization: string;
  rating: number;
  reviewCount: number;
  experienceYears: number;
  specialty: string;
  modes: ('Home Visit' | 'Clinic OPD')[];
  feePerSession: number;
  phone: string;
  availability: string;
}

export interface PhysioSession {
  id: string;
  patientId: string;
  providerId: string;
  providerName: string;
  mode: 'Home Visit' | 'Clinic OPD';
  date: string;
  timeSlot: string;
  status: 'Confirmed' | 'Completed' | 'Pending';
  clinicalNotes: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  phone: string;
  isPrimaryCaregiver: boolean;
  avatarBg: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  entity: string;
  details: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  admissionReason: string;
  admissionDate: string;
  dischargeDate: string;
  hospitalName: string;
  treatingDoctor: {
    name: string;
    specialty: string;
    phone: string;
    regNo: string;
  };
  emergencyHospitalPhone: string;
  nextCheckupDays: number;
  nextCheckupDate: string;
  nextCheckupDepartment: string;
  documentPath: string;
  documentTitle: string;
  planItems: PlanItem[];
  warningSigns: WarningSign[];
  dietRules: DietRule[];
  familyMembers: FamilyMember[];
}
