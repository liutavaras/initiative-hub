export type FieldType = 
  | 'text' 
  | 'textarea' 
  | 'number' 
  | 'select' 
  | 'switch' 
  | 'date' 
  | 'multiselect'
  | 'currency'
  | 'domain-investment'
  | 'repeatable-group';

export interface FieldOption {
  label: string;
  value: string;
}

// Sub-field definition for repeatable groups / domain investments
export interface SubField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'currency' | 'select';
  required?: boolean;
  placeholder?: string;
  options?: FieldOption[];
}

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  description?: string;
  options?: FieldOption[]; // For select/multiselect/domain-investment (domain options)
  subFields?: SubField[]; // For domain-investment/repeatable-group
  min?: number; // For number fields
  max?: number;
  order: number;
}

export interface FormStep {
  id: string;
  title: string;
  description?: string;
  icon: string;
  order: number;
  fields: FormField[];
}

export interface FormConfig {
  id: string;
  name: string;
  description: string;
  steps: FormStep[];
  updatedAt: string;
  updatedBy: string;
}

// Default domain options
export const DEFAULT_DOMAIN_OPTIONS: FieldOption[] = [
  { label: 'CFP', value: 'CFP' },
  { label: 'CPNS', value: 'CPNS' },
  { label: 'GTI', value: 'GTI' },
  { label: 'GTO', value: 'GTO' },
  { label: 'Enterprise', value: 'Enterprise' },
  { label: 'Infrastructure', value: 'Infrastructure' },
  { label: 'Security', value: 'Security' },
  { label: 'Data & Analytics', value: 'Data' },
];

// Default sub-fields for domain investment
export const DEFAULT_DOMAIN_SUBFIELDS: SubField[] = [
  { id: 'existingHeads', name: 'existingHeads', label: 'Existing Heads', type: 'number' },
  { id: 'deferredIncremental', name: 'deferredIncremental', label: 'Deferred Inc.', type: 'number' },
  { id: 'newAsk', name: 'newAsk', label: 'New Ask', type: 'number' },
  { id: 'nextPhaseAsk', name: 'nextPhaseAsk', label: 'Next Phase Ask', type: 'number' },
];
