import { FormConfig } from '@/types/formConfig';

export const mockFormConfig: FormConfig = {
  id: 'initiative-form',
  name: 'Initiative Intake Form',
  description: 'Form configuration for new initiative submissions',
  updatedAt: '2024-01-20T10:00:00Z',
  updatedBy: 'Admin User',
  steps: [
    {
      id: 'step-1',
      title: 'Basic Info',
      description: 'Core initiative details',
      icon: 'FileText',
      order: 1,
      fields: [
        { id: 'title', name: 'title', label: 'Title of Initiative', type: 'text', required: true, placeholder: 'Enter initiative title', order: 1 },
        { id: 'businessCase', name: 'businessCase', label: 'Business Case', type: 'textarea', required: true, placeholder: 'Describe the business case', order: 2 },
        { id: 'ownerName', name: 'ownerName', label: 'Owner Name', type: 'text', required: true, placeholder: 'Initiative owner', order: 3 },
        { id: 'overview', name: 'overview', label: 'Overview', type: 'textarea', required: true, placeholder: 'Detailed overview', order: 4 },
        { id: 'isGTSIG', name: 'isGTSIG', label: 'Is GT SIG?', type: 'switch', required: false, order: 5 },
        { id: 'category', name: 'category', label: 'Category', type: 'select', required: true, order: 6, options: [
          { label: 'Mandatory', value: 'Mandatory' },
          { label: 'Discretionary', value: 'Discretionary' },
          { label: 'Regulatory', value: 'Regulatory' },
        ]},
        { id: 'workType', name: 'workType', label: 'Now vs Existing Work', type: 'select', required: true, order: 7, options: [
          { label: 'New', value: 'New' },
          { label: 'Expansion', value: 'Expansion' },
          { label: 'Change to Existing', value: 'Change to Existing' },
        ]},
        { id: 'requesterStakeholders', name: 'requesterStakeholders', label: 'Requester Stakeholders', type: 'text', required: true, placeholder: 'SID1, SID2, SID3', order: 8 },
        { id: 'timeframe', name: 'timeframe', label: 'Timeframe', type: 'select', required: true, order: 9, options: [
          { label: 'Multi-Year', value: 'Multi-Year' },
          { label: 'One Year', value: 'One Year' },
          { label: '6 Months', value: '6 Months' },
          { label: 'Quarter', value: 'Quarter' },
          { label: 'Immediate', value: 'Immediate' },
        ]},
      ],
    },
    {
      id: 'step-2',
      title: 'Investment',
      description: 'Labor and non-labor investment details',
      icon: 'DollarSign',
      order: 2,
      fields: [
        { id: 'scopeSizing', name: 'scopeSizing', label: 'Scope & Sizing (ROM)', type: 'currency', required: true, order: 1 },
        { id: 'existingHeadsCommitted', name: 'existingHeadsCommitted', label: 'Existing Heads Committed', type: 'number', required: true, min: 0, order: 2 },
        { id: 'deferredIncremental', name: 'deferredIncremental', label: 'Deferred Incremental', type: 'number', required: true, min: 0, order: 3 },
        { id: 'totalNewAsk', name: 'totalNewAsk', label: 'Total New Ask', type: 'number', required: true, min: 0, order: 4 },
        { id: 'nextPhaseAsk', name: 'nextPhaseAsk', label: 'Next Phase Ask', type: 'number', required: true, min: 0, order: 5 },
        { id: 'nonLaborAsk', name: 'nonLaborAsk', label: 'Non-labor Ask', type: 'textarea', required: false, placeholder: 'Describe non-labor requirements', order: 6 },
      ],
    },
    {
      id: 'step-3',
      title: 'Scope & Value',
      description: 'Work scope and expected ROI',
      icon: 'Users',
      order: 3,
      fields: [
        { id: 'workInScope', name: 'workInScope', label: 'Work in Scope', type: 'textarea', required: true, placeholder: 'Define work in scope', order: 1 },
        { id: 'valueROI', name: 'valueROI', label: 'Value/ROI Measure', type: 'textarea', required: true, placeholder: 'Expected value and ROI', order: 2 },
      ],
    },
    {
      id: 'step-4',
      title: 'Risks & Dependencies',
      description: 'Risk assessment and dependencies',
      icon: 'AlertTriangle',
      order: 4,
      fields: [
        { id: 'risksIfNotImplemented', name: 'risksIfNotImplemented', label: 'Risks if Not Implemented', type: 'textarea', required: true, placeholder: 'Describe risks', order: 1 },
        { id: 'dependencies', name: 'dependencies', label: 'Dependencies', type: 'textarea', required: false, placeholder: 'List dependencies', order: 2 },
        { id: 'resourceAvailability', name: 'resourceAvailability', label: 'Resource Availability', type: 'textarea', required: false, placeholder: 'Describe resource availability', order: 3 },
      ],
    },
  ],
};
