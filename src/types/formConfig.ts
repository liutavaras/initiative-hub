export type FieldType = 
  | 'text' 
  | 'textarea' 
  | 'number' 
  | 'select' 
  | 'switch' 
  | 'date' 
  | 'multiselect'
  | 'currency';

export interface FieldOption {
  label: string;
  value: string;
}

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  description?: string;
  options?: FieldOption[]; // For select/multiselect
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
