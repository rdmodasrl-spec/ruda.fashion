export interface StructuredAction {
  intent: string;
  action:
    | 'expire_listings'
    | 'quarantine_listings'
    | 'approve_listings'
    | 'update_listing_status'
    | 'adjust_listing_prices'
    | 'verify_business'
    | 'update_business_hours'
    | 'delete_flagged'
    | 'archive_stale';
  entity: 'listings' | 'businesses' | 'moderation_audits';
  filters: {
    cityId?: string;
    category?: string;
    status?: string;
    riskLevel?: string;
    ageDaysGte?: number;
    keyword?: string;
  };
  mutation: Record<string, any>;
  riskAssessment: 'LOW' | 'MEDIUM' | 'HIGH';
  requiresConfirmation: boolean;
  explanation: string;
}

export interface CapabilityDefinition {
  name: string;
  action: StructuredAction['action'];
  entity: StructuredAction['entity'];
  description: string;
  riskAssessment: 'LOW' | 'MEDIUM' | 'HIGH';
  allowedFields: string[];
}

export interface BrainPreviewResult {
  action: StructuredAction;
  previewSql: string;
  matchedCount: number;
  matchedRecordsSample: any[];
  riskAssessment: 'LOW' | 'MEDIUM' | 'HIGH';
  requiresConfirmation: boolean;
  confirmationToken?: string;
  policyNotes: string[];
}

export interface BrainExecutionReceipt {
  executionId: string;
  timestamp: string;
  command: string;
  structuredAction: StructuredAction;
  deterministicSql: string;
  affectedCount: number;
  operator: string;
  status: 'COMMITTED' | 'REJECTED';
  verification: {
    sampleUpdatedRecords: any[];
    durationMs: number;
  };
}

export interface BusinessKnowledgeItem {
  id: string;
  businessId: string;
  category: string;
  keywords: string[];
  question: string;
  answer: string;
  officialCitation: string;
  lastVerified: string;
}

export interface DocumentAuditRecord {
  auditId: string;
  timestamp: string;
  filename?: string;
  docType: string;
  issuingAuthority: string;
  recipientName: string;
  summary: string;
  deadlineDate: string;
  amountDueEur: number | null;
  obligations: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  riskWarnings: string[];
  nextSteps: string[];
  formalReplyDraft: string;
}

export interface ScheduledJobRecord {
  jobId: string;
  jobName: string;
  description: string;
  intervalSec: number;
  status: 'IDLE' | 'RUNNING' | 'SUCCESS' | 'FAILED';
  lastRunTime: string;
  nextRunTime: string;
  itemsScanned: number;
  itemsAffected: number;
  runCount: number;
  logs: string[];
}
