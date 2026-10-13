export type AgentRoleKey = 'strategy' | 'finance' | 'operations' | 'customer' | 'decider' | 'calculator';

export type StanceType = 'agree' | 'disagree' | 'proposal';

export type TargetFieldKey = 'budget' | 'channels' | 'timeline' | 'operations' | 'pricing';

export interface PlanFieldItem {
  key: TargetFieldKey;
  label: string;
  currentValue: string;
  previousValue?: string;
  unit?: string;
  isAgreed: boolean;
  activeTurnId?: string;
}

export interface FinancialSnapshot {
  revenue: number;
  expense: number;
  budgetLimit: number;
  balance: number;
  status: 'idle' | 'checking' | 'exceeded' | 'matched';
  diffAmount?: number;
  verificationMessage: string;
  isAudited: boolean;
}

export interface DecisionRecord {
  id: string;
  title: string;
  detail: string;
  turnIndex: number;
  agentRole: string;
  timestamp: string;
}

export interface DebateTurn {
  id: string;
  round: number;
  totalRounds: number;
  speaker: AgentRoleKey;
  speakerName: string;
  speakerTitle: string; // e.g. "Trợ lý chiến lược"
  stance: StanceType; // "Đồng ý" | "Phản đối" | "Đề xuất khác"
  message: string;
  targetField: TargetFieldKey;
  targetFieldLabel: string;
  oldValue?: string;
  newValue?: string;
  consensusLevel: number; // 0 to 100
  financialCheck: FinancialSnapshot;
  decisionSaved?: DecisionRecord;
  durationSeconds?: number;
}

export interface IndustryScenario {
  id: string;
  name: string;
  businessName: string;
  industryLabel: string;
  tagline: string;
  initialPlan: {
    budget: string;
    channels: string;
    timeline: string;
    operations: string;
    pricing: string;
  };
  finalPlan: {
    budget: string;
    channels: string;
    timeline: string;
    operations: string;
    pricing: string;
    highlights: string[];
  };
  turns: DebateTurn[];
}
