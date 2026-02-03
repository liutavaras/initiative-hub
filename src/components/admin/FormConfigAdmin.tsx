import { useState } from 'react';
import { mockFormConfig } from '@/data/mockFormConfig';
import { FormConfig, FormStep, FormField, FieldType, SubField, DEFAULT_DOMAIN_OPTIONS, DEFAULT_DOMAIN_SUBFIELDS } from '@/types/formConfig';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  ChevronDown, 
  ChevronRight,
  Settings2,
  FileText,
  Type,
  Hash,
  List,
  ToggleLeft,
  Calendar,
  DollarSign,
  AlignLeft,
  Pencil,
  Save,
  Copy,
  Users,
  AlertTriangle,
  Briefcase,
  Target,
  Layers,
  Shield,
  Zap,
  Clock,
  CheckCircle,
  TrendingUp,
  Building,
  Lightbulb,
  LucideIcon,
  LayoutGrid,
  Repeat
} from 'lucide-react';
import { format } from 'date-fns';

// Available icons for step selection
const stepIcons: { name: string; icon: LucideIcon }[] = [
  { name: 'FileText', icon: FileText },
  { name: 'DollarSign', icon: DollarSign },
  { name: 'Users', icon: Users },
  { name: 'AlertTriangle', icon: AlertTriangle },
  { name: 'Briefcase', icon: Briefcase },
  { name: 'Target', icon: Target },
  { name: 'Layers', icon: Layers },
  { name: 'Shield', icon: Shield },
  { name: 'Zap', icon: Zap },
  { name: 'Clock', icon: Clock },
  { name: 'CheckCircle', icon: CheckCircle },
  { name: 'TrendingUp', icon: TrendingUp },
  { name: 'Building', icon: Building },
  { name: 'Lightbulb', icon: Lightbulb },
  { name: 'Settings2', icon: Settings2 },
];

const fieldTypeIcons: Record<FieldType, React.ReactNode> = {
  text: <Type className="h-4 w-4" />,
  textarea: <AlignLeft className="h-4 w-4" />,
  number: <Hash className="h-4 w-4" />,
  select: <List className="h-4 w-4" />,
  switch: <ToggleLeft className="h-4 w-4" />,
  date: <Calendar className="h-4 w-4" />,
  multiselect: <List className="h-4 w-4" />,
  currency: <DollarSign className="h-4 w-4" />,
  'domain-investment': <LayoutGrid className="h-4 w-4" />,
  'repeatable-group': <Repeat className="h-4 w-4" />,
};

const fieldTypeLabels: Record<FieldType, string> = {
  text: 'Text',
  textarea: 'Text Area',
  number: 'Number',
  select: 'Dropdown',
  switch: 'Yes/No Toggle',
  date: 'Date',
  multiselect: 'Multi-Select',
  currency: 'Currency',
  'domain-investment': 'Domain Investment',
  'repeatable-group': 'Repeatable Group',
};

export function FormConfigAdmin() {
  const [config, setConfig] = useState<FormConfig>(mockFormConfig);
  const [expandedSteps, setExpandedSteps] = useState<string[]>([config.steps[0]?.id || '']);
  const [isAddStepOpen, setIsAddStepOpen] = useState(false);
  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false);
  const [activeStepId, setActiveStepId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<{ stepId: string; field: FormField } | null>(null);
  const [editingStep, setEditingStep] = useState<FormStep | null>(null);
  
  // New step form state
  const [newStepTitle, setNewStepTitle] = useState('');
  const [newStepDescription, setNewStepDescription] = useState('');
  const [newStepIcon, setNewStepIcon] = useState('FileText');
  
  // New field form state
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState<FieldType>('text');
  const [newFieldRequired, setNewFieldRequired] = useState(false);
  const [newFieldPlaceholder, setNewFieldPlaceholder] = useState('');
  const [newFieldOptions, setNewFieldOptions] = useState('');
  const [useDefaultDomainConfig, setUseDefaultDomainConfig] = useState(true);
  const [customDomainOptions, setCustomDomainOptions] = useState('');
  const [customSubFields, setCustomSubFields] = useState<SubField[]>([]);
  
  // Edit field form state
  const [editFieldLabel, setEditFieldLabel] = useState('');
  const [editFieldRequired, setEditFieldRequired] = useState(false);
  const [editFieldPlaceholder, setEditFieldPlaceholder] = useState('');
  const [editFieldOptions, setEditFieldOptions] = useState('');
  
  // Edit step form state
  const [editStepTitle, setEditStepTitle] = useState('');
  const [editStepDescription, setEditStepDescription] = useState('');
  const [editStepIcon, setEditStepIcon] = useState('FileText');

  const toggleStep = (stepId: string) => {
    setExpandedSteps(prev => 
      prev.includes(stepId) 
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  const generateFieldName = (label: string) => {
    return label
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 30);
  };

  const handleAddStep = () => {
    if (!newStepTitle) {
      toast.error('Step title is required');
      return;
    }

    const newStep: FormStep = {
      id: `step-${Date.now()}`,
      title: newStepTitle,
      description: newStepDescription,
      icon: newStepIcon,
      order: config.steps.length + 1,
      fields: [],
    };

    setConfig({
      ...config,
      steps: [...config.steps, newStep],
      updatedAt: new Date().toISOString(),
    });

    setNewStepTitle('');
    setNewStepDescription('');
    setNewStepIcon('FileText');
    setIsAddStepOpen(false);
    toast.success('Step added successfully');
  };

  const handleRemoveStep = (stepId: string) => {
    if (config.steps.length <= 1) {
      toast.error('Cannot remove the last step');
      return;
    }
    
    setConfig({
      ...config,
      steps: config.steps.filter(s => s.id !== stepId).map((s, i) => ({ ...s, order: i + 1 })),
      updatedAt: new Date().toISOString(),
    });
    toast.success('Step removed');
  };

  const handleAddField = () => {
    if (!newFieldLabel || !activeStepId) {
      toast.error('Field label is required');
      return;
    }

    const fieldName = newFieldName || generateFieldName(newFieldLabel);
    
    // Determine options and subFields based on field type
    let options = newFieldOptions 
      ? newFieldOptions.split(',').map(opt => ({ label: opt.trim(), value: opt.trim() }))
      : undefined;
    
    let subFields: SubField[] | undefined = undefined;
    
    // For domain-investment type, set up domain options and sub-fields
    if (newFieldType === 'domain-investment') {
      if (useDefaultDomainConfig) {
        options = DEFAULT_DOMAIN_OPTIONS;
        subFields = DEFAULT_DOMAIN_SUBFIELDS;
      } else {
        options = customDomainOptions
          ? customDomainOptions.split(',').map(opt => ({ label: opt.trim(), value: opt.trim() }))
          : DEFAULT_DOMAIN_OPTIONS;
        subFields = customSubFields.length > 0 ? customSubFields : DEFAULT_DOMAIN_SUBFIELDS;
      }
    }
    
    const newField: FormField = {
      id: `field-${Date.now()}`,
      name: fieldName,
      label: newFieldLabel,
      type: newFieldType,
      required: newFieldRequired,
      placeholder: newFieldPlaceholder,
      order: (config.steps.find(s => s.id === activeStepId)?.fields.length || 0) + 1,
      options,
      subFields,
    };

    setConfig({
      ...config,
      steps: config.steps.map(step => 
        step.id === activeStepId
          ? { ...step, fields: [...step.fields, newField] }
          : step
      ),
      updatedAt: new Date().toISOString(),
    });

    // Reset form
    setNewFieldLabel('');
    setNewFieldName('');
    setNewFieldType('text');
    setNewFieldRequired(false);
    setNewFieldPlaceholder('');
    setNewFieldOptions('');
    setUseDefaultDomainConfig(true);
    setCustomDomainOptions('');
    setCustomSubFields([]);
    setIsAddFieldOpen(false);
    toast.success('Field added successfully', {
      description: newFieldType === 'domain-investment' 
        ? `Domain investment field "${newFieldLabel}" added.`
        : `Column "${fieldName}" will be created in the backend.`,
    });
  };

  const handleRemoveField = (stepId: string, fieldId: string) => {
    setConfig({
      ...config,
      steps: config.steps.map(step => 
        step.id === stepId
          ? { ...step, fields: step.fields.filter(f => f.id !== fieldId).map((f, i) => ({ ...f, order: i + 1 })) }
          : step
      ),
      updatedAt: new Date().toISOString(),
    });
    toast.success('Field removed');
  };

  const handleSaveConfig = () => {
    // In a real app, this would save to the backend
    toast.success('Form configuration saved', {
      description: 'Changes will be reflected in the New Initiative form.',
    });
  };

  const openAddFieldDialog = (stepId: string) => {
    setActiveStepId(stepId);
    setIsAddFieldOpen(true);
  };

  const openEditFieldDialog = (stepId: string, field: FormField) => {
    setEditingField({ stepId, field });
    setEditFieldLabel(field.label);
    setEditFieldRequired(field.required);
    setEditFieldPlaceholder(field.placeholder || '');
    setEditFieldOptions(field.options?.map(o => o.label).join(', ') || '');
  };

  const handleUpdateField = () => {
    if (!editingField || !editFieldLabel) {
      toast.error('Field label is required');
      return;
    }

    setConfig({
      ...config,
      steps: config.steps.map(step => 
        step.id === editingField.stepId
          ? { 
              ...step, 
              fields: step.fields.map(f => 
                f.id === editingField.field.id
                  ? { 
                      ...f, 
                      label: editFieldLabel,
                      required: editFieldRequired,
                      placeholder: editFieldPlaceholder || undefined,
                      options: (f.type === 'select' || f.type === 'multiselect') && editFieldOptions
                        ? editFieldOptions.split(',').map(opt => ({ label: opt.trim(), value: opt.trim() }))
                        : f.options,
                    }
                  : f
              )
            }
          : step
      ),
      updatedAt: new Date().toISOString(),
    });

    setEditingField(null);
    toast.success('Field updated successfully');
  };

  const openEditStepDialog = (step: FormStep) => {
    setEditingStep(step);
    setEditStepTitle(step.title);
    setEditStepDescription(step.description || '');
    setEditStepIcon(step.icon);
  };

  const handleUpdateStep = () => {
    if (!editingStep || !editStepTitle) {
      toast.error('Step title is required');
      return;
    }

    setConfig({
      ...config,
      steps: config.steps.map(step => 
        step.id === editingStep.id
          ? { 
              ...step, 
              title: editStepTitle,
              description: editStepDescription || undefined,
              icon: editStepIcon,
            }
          : step
      ),
      updatedAt: new Date().toISOString(),
    });

    setEditingStep(null);
    toast.success('Step updated successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Form Configuration</h2>
          <p className="text-sm text-muted-foreground">
            Configure steps and fields for the Initiative Intake Form
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Last updated: {format(new Date(config.updatedAt), 'MMM d, yyyy h:mm a')} by {config.updatedBy}
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddStepOpen} onOpenChange={setIsAddStepOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Step
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Step</DialogTitle>
                <DialogDescription>
                  Create a new step in the initiative form
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Step Title</Label>
                  <Input 
                    placeholder="e.g., Technical Requirements"
                    value={newStepTitle}
                    onChange={(e) => setNewStepTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description (Optional)</Label>
                  <Input 
                    placeholder="Brief description of this step"
                    value={newStepDescription}
                    onChange={(e) => setNewStepDescription(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Step Icon</Label>
                  <div className="grid grid-cols-5 gap-2 p-2 border rounded-lg bg-secondary/20">
                    {stepIcons.map(({ name, icon: Icon }) => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setNewStepIcon(name)}
                        className={`flex items-center justify-center p-2 rounded-md transition-colors ${
                          newStepIcon === name 
                            ? 'bg-primary text-primary-foreground' 
                            : 'hover:bg-secondary'
                        }`}
                        title={name}
                      >
                        <Icon className="h-5 w-5" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddStepOpen(false)}>Cancel</Button>
                <Button onClick={handleAddStep}>Add Step</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button onClick={handleSaveConfig} className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-4">
        {config.steps.map((step, stepIndex) => (
          <Card key={step.id} className="executive-card overflow-hidden">
            <Collapsible open={expandedSteps.includes(step.id)} onOpenChange={() => toggleStep(step.id)}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-secondary/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-semibold">
                        {stepIndex + 1}
                      </div>
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          {step.title}
                          <Badge variant="secondary" className="text-xs">
                            {step.fields.length} fields
                          </Badge>
                        </CardTitle>
                        {step.description && (
                          <CardDescription className="text-xs mt-0.5">{step.description}</CardDescription>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => { e.stopPropagation(); openEditStepDialog(step); }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={(e) => { e.stopPropagation(); handleRemoveStep(step.id); }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      {expandedSteps.includes(step.id) ? (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <CardContent className="border-t">
                  <div className="space-y-3 pt-4">
                    {step.fields.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No fields in this step yet
                      </p>
                    ) : (
                      step.fields.map((field) => (
                        <div
                          key={field.id}
                          className={cn(
                            "flex items-center justify-between rounded-lg border bg-secondary/20 p-3",
                            field.type === 'domain-investment' && "border-primary/30 bg-primary/5"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "flex h-8 w-8 items-center justify-center rounded",
                              field.type === 'domain-investment' ? "bg-primary/20" : "bg-muted"
                            )}>
                              {fieldTypeIcons[field.type]}
                            </div>
                            <div>
                              <p className="font-medium text-sm text-foreground flex items-center gap-2">
                                {field.label}
                                {field.required && (
                                  <Badge variant="destructive" className="text-[10px] px-1 py-0">
                                    Required
                                  </Badge>
                                )}
                                {field.type === 'domain-investment' && (
                                  <Badge variant="default" className="text-[10px] px-1.5 py-0">
                                    Dynamic
                                  </Badge>
                                )}
                              </p>
                              <p className="text-xs text-muted-foreground font-mono">
                                {field.name} • {fieldTypeLabels[field.type]}
                                {field.type === 'domain-investment' && field.options && (
                                  <span className="ml-1">• {field.options.length} domains</span>
                                )}
                                {field.type === 'domain-investment' && field.subFields && (
                                  <span className="ml-1">• {field.subFields.length} fields each</span>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => openEditFieldDialog(step.id, field)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive hover:text-destructive"
                              onClick={() => handleRemoveField(step.id, field.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                    
                    <Button 
                      variant="outline" 
                      className="w-full gap-2 mt-2"
                      onClick={() => openAddFieldDialog(step.id)}
                    >
                      <Plus className="h-4 w-4" />
                      Add Field to {step.title}
                    </Button>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>

      {/* Add Field Dialog */}
      <Dialog open={isAddFieldOpen} onOpenChange={setIsAddFieldOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Field</DialogTitle>
            <DialogDescription>
              Add a new field to the form. This will create a new column in the backend.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Field Label *</Label>
              <Input 
                placeholder="e.g., Priority Level"
                value={newFieldLabel}
                onChange={(e) => {
                  setNewFieldLabel(e.target.value);
                  if (!newFieldName) {
                    // Auto-generate field name from label
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Field Name (Database Column)</Label>
              <Input 
                placeholder="Auto-generated from label"
                value={newFieldName || generateFieldName(newFieldLabel)}
                onChange={(e) => setNewFieldName(e.target.value)}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                This will be the column name in the database
              </p>
            </div>
            <div className="space-y-2">
              <Label>Field Type</Label>
              <Select value={newFieldType} onValueChange={(v) => setNewFieldType(v as FieldType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(fieldTypeLabels).map(([type, label]) => (
                    <SelectItem key={type} value={type}>
                      <div className="flex items-center gap-2">
                        {fieldTypeIcons[type as FieldType]}
                        {label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {(newFieldType === 'select' || newFieldType === 'multiselect') && (
              <div className="space-y-2">
                <Label>Options (comma-separated)</Label>
                <Input 
                  placeholder="Option 1, Option 2, Option 3"
                  value={newFieldOptions}
                  onChange={(e) => setNewFieldOptions(e.target.value)}
                />
              </div>
            )}
            
            {/* Domain Investment Configuration */}
            {newFieldType === 'domain-investment' && (
              <div className="space-y-4 rounded-lg border bg-secondary/20 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Use Default Configuration</Label>
                    <p className="text-xs text-muted-foreground">
                      Default includes 8 domains and 4 investment fields
                    </p>
                  </div>
                  <Switch 
                    checked={useDefaultDomainConfig}
                    onCheckedChange={setUseDefaultDomainConfig}
                  />
                </div>
                
                {!useDefaultDomainConfig && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <Label className="text-sm">Domain Options (comma-separated)</Label>
                      <Input 
                        placeholder="CFP, CPNS, GTI, GTO..."
                        value={customDomainOptions}
                        onChange={(e) => setCustomDomainOptions(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Leave empty to use defaults: CFP, CPNS, GTI, GTO, Enterprise, Infrastructure, Security, Data
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Sub-Fields</Label>
                      <p className="text-xs text-muted-foreground">
                        Default sub-fields: Existing Heads, Deferred Inc., New Ask, Next Phase Ask
                      </p>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {DEFAULT_DOMAIN_SUBFIELDS.map(sf => (
                          <Badge key={sf.id} variant="secondary" className="justify-center py-1">
                            {sf.label}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                
                {useDefaultDomainConfig && (
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Preview</Label>
                    <div className="flex flex-wrap gap-1">
                      {DEFAULT_DOMAIN_OPTIONS.slice(0, 4).map(opt => (
                        <Badge key={opt.value} variant="outline" className="text-xs">
                          {opt.label}
                        </Badge>
                      ))}
                      <Badge variant="outline" className="text-xs">+4 more</Badge>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {DEFAULT_DOMAIN_SUBFIELDS.map(sf => (
                        <Badge key={sf.id} variant="secondary" className="text-xs">
                          {sf.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="space-y-2">
              <Label>Placeholder</Label>
              <Input 
                placeholder="Enter placeholder text"
                value={newFieldPlaceholder}
                onChange={(e) => setNewFieldPlaceholder(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="required">Required Field</Label>
              <Switch 
                id="required"
                checked={newFieldRequired}
                onCheckedChange={setNewFieldRequired}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddFieldOpen(false)}>Cancel</Button>
            <Button onClick={handleAddField}>Add Field</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Field Dialog */}
      <Dialog open={!!editingField} onOpenChange={(open) => !open && setEditingField(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Field</DialogTitle>
            <DialogDescription>
              Update the field configuration
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Field Label *</Label>
              <Input 
                placeholder="e.g., Priority Level"
                value={editFieldLabel}
                onChange={(e) => setEditFieldLabel(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Field Name (Database Column)</Label>
              <Input 
                value={editingField?.field.name || ''}
                disabled
                className="font-mono text-sm bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Field name cannot be changed after creation
              </p>
            </div>
            <div className="space-y-2">
              <Label>Field Type</Label>
              <Input 
                value={editingField ? fieldTypeLabels[editingField.field.type] : ''}
                disabled
                className="bg-muted"
              />
            </div>
            {editingField && (editingField.field.type === 'select' || editingField.field.type === 'multiselect') && (
              <div className="space-y-2">
                <Label>Options (comma-separated)</Label>
                <Input 
                  placeholder="Option 1, Option 2, Option 3"
                  value={editFieldOptions}
                  onChange={(e) => setEditFieldOptions(e.target.value)}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label>Placeholder</Label>
              <Input 
                placeholder="Enter placeholder text"
                value={editFieldPlaceholder}
                onChange={(e) => setEditFieldPlaceholder(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="editRequired">Required Field</Label>
              <Switch 
                id="editRequired"
                checked={editFieldRequired}
                onCheckedChange={setEditFieldRequired}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingField(null)}>Cancel</Button>
            <Button onClick={handleUpdateField}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Step Dialog */}
      <Dialog open={!!editingStep} onOpenChange={(open) => !open && setEditingStep(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Step</DialogTitle>
            <DialogDescription>
              Update the step title, description, and icon
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Step Title *</Label>
              <Input 
                placeholder="e.g., Technical Requirements"
                value={editStepTitle}
                onChange={(e) => setEditStepTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Description (Optional)</Label>
              <Input 
                placeholder="Brief description of this step"
                value={editStepDescription}
                onChange={(e) => setEditStepDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Step Icon</Label>
              <div className="grid grid-cols-5 gap-2 p-2 border rounded-lg bg-secondary/20">
                {stepIcons.map(({ name, icon: Icon }) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setEditStepIcon(name)}
                    className={`flex items-center justify-center p-2 rounded-md transition-colors ${
                      editStepIcon === name 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-secondary'
                    }`}
                    title={name}
                  >
                    <Icon className="h-5 w-5" />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingStep(null)}>Cancel</Button>
            <Button onClick={handleUpdateStep}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
