export type InitiativeStatus = 'pending' | 'approved' | 'denied';

export type Category = 'Mandatory' | 'Discretionary' | 'Regulatory';

export type WorkType = 'New' | 'Expansion' | 'Change to Existing';

export type Timeframe = 'Multi-Year' | 'One Year' | '6 Months' | 'Quarter' | 'Immediate';

export interface DomainInvestment {
  existingHeadsCommitted: number;
  deferredIncremental: number;
  totalNewAsk: number;
  nextPhaseAsk: number;
}

export interface LaborInvestment {
  existingHeadsCommitted: number;
  deferredIncremental: number;
  totalNewAsk: number;
  nextPhaseAsk: number;
  domains: {
    CFP: DomainInvestment;
    CPNS: DomainInvestment;
  };
}

export interface Initiative {
  id: string;
  title: string;
  businessCase: string;
  ownerName: string;
  overview: string;
  isGTSIG: boolean;
  category: Category;
  workType: WorkType;
  requesterStakeholders: string;
  scopeSizing: number;
  timeframe: Timeframe;
  laborInvestment: LaborInvestment;
  nonLaborAsk: string;
  workInScope: string;
  valueROI: string;
  risksIfNotImplemented: string;
  dependencies: string;
  resourceAvailability: string;
  status: InitiativeStatus;
  submittedBy: string;
  submittedAt: string;
  lineOfBusiness?: string;
  gtlt?: string;
  product?: string;
}

export interface User {
  id: string;
  name: string;
  sid: string;
  role: 'approver' | 'requester' | 'admin';
  category?: string;
}
