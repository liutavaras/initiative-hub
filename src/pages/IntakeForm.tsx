import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, Check, FileText, DollarSign, Users, AlertTriangle, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required').max(150, 'Title must be under 150 characters'),
  businessCase: z.string().min(1, 'Business case is required').max(2000, 'Business case must be under 2000 characters'),
  ownerName: z.string().min(1, 'Owner name is required').max(100, 'Name must be under 100 characters'),
  overview: z.string().min(1, 'Overview is required').max(5000, 'Overview must be under 5000 characters'),
  isGTSIG: z.boolean(),
  category: z.enum(['Mandatory', 'Discretionary', 'Regulatory']),
  workType: z.enum(['New', 'Expansion', 'Change to Existing']),
  requesterStakeholders: z.string().min(1, 'At least one stakeholder required').max(500, 'Stakeholders must be under 500 characters'),
  sealIds: z.string().max(200, 'SEAL IDs must be under 200 characters').optional(),
  scopeSizing: z.number().min(0, 'ROM must be positive'),
  timeframe: z.enum(['Multi-Year', 'One Year', '6 Months', 'Quarter', 'Immediate']),
  existingHeadsCommitted: z.number().min(0),
  deferredIncremental: z.number().min(0),
  totalNewAsk: z.number().min(0),
  nextPhaseAsk: z.number().min(0),
  cfpExisting: z.number().min(0),
  cfpDeferred: z.number().min(0),
  cfpNewAsk: z.number().min(0),
  cfpNextPhase: z.number().min(0),
  cpnsExisting: z.number().min(0),
  cpnsDeferred: z.number().min(0),
  cpnsNewAsk: z.number().min(0),
  cpnsNextPhase: z.number().min(0),
  nonLaborAsk: z.string().max(1500, 'Non-labor ask must be under 1500 characters'),
  workInScope: z.string().min(1, 'Work in scope is required').max(3000, 'Work in scope must be under 3000 characters'),
  valueROI: z.string().min(1, 'Value/ROI measure is required').max(2000, 'Value/ROI must be under 2000 characters'),
  risksIfNotImplemented: z.string().min(1, 'Risks are required').max(2000, 'Risks must be under 2000 characters'),
  dependencies: z.string().max(1500, 'Dependencies must be under 1500 characters'),
  resourceAvailability: z.string().max(1000, 'Resource availability must be under 1000 characters'),
});


type FormData = z.infer<typeof formSchema>;

// Mock SEAL IDs that "exist" in the system for demo purposes
const MOCK_VALID_SEAL_IDS = ['SEAL-001', 'SEAL-002', 'SEAL-003', 'SEAL-100', 'SEAL-200', 'SEAL-500'];

interface SealValidation {
  id: string;
  status: 'pending' | 'valid' | 'invalid';
}

const steps = [
  { id: 1, title: 'Basic Info', icon: FileText },
  { id: 2, title: 'Investment', icon: DollarSign },
  { id: 3, title: 'Scope & Value', icon: Users },
  { id: 4, title: 'Risks & Deps', icon: AlertTriangle },
];

export default function IntakeForm() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [sealIdInput, setSealIdInput] = useState('');
  const [validatedSealIds, setValidatedSealIds] = useState<SealValidation[]>([]);
  const [isValidatingSeal, setIsValidatingSeal] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isGTSIG: false,
      category: 'Discretionary',
      workType: 'New',
      timeframe: 'One Year',
      sealIds: '',
      scopeSizing: 0,
      existingHeadsCommitted: 0,
      deferredIncremental: 0,
      totalNewAsk: 0,
      nextPhaseAsk: 0,
      cfpExisting: 0,
      cfpDeferred: 0,
      cfpNewAsk: 0,
      cfpNextPhase: 0,
      cpnsExisting: 0,
      cpnsDeferred: 0,
      cpnsNewAsk: 0,
      cpnsNextPhase: 0,
      nonLaborAsk: '',
      dependencies: '',
      resourceAvailability: '',
    },
  });

  // Mock API call to validate SEAL ID
  const validateSealId = async (sealId: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    // Mock validation - check if ID exists in our mock list
    return MOCK_VALID_SEAL_IDS.includes(sealId.toUpperCase());
  };

  const handleAddSealId = async () => {
    const trimmedId = sealIdInput.trim().toUpperCase();
    if (!trimmedId) return;
    
    // Check if already added
    if (validatedSealIds.some(s => s.id === trimmedId)) {
      toast.error('Seal ID already added');
      return;
    }

    setIsValidatingSeal(true);
    setValidatedSealIds(prev => [...prev, { id: trimmedId, status: 'pending' }]);
    
    try {
      const isValid = await validateSealId(trimmedId);
      
      setValidatedSealIds(prev => 
        prev.map(s => 
          s.id === trimmedId 
            ? { ...s, status: isValid ? 'valid' : 'invalid' } 
            : s
        )
      );
      
      if (isValid) {
        // Update form value with valid seal IDs
        const validIds = [...validatedSealIds.filter(s => s.status === 'valid').map(s => s.id), trimmedId];
        form.setValue('sealIds', validIds.join(', '));
        toast.success(`SEAL ID ${trimmedId} validated successfully`);
      } else {
        toast.error(`SEAL ID ${trimmedId} not found in SEAL server`);
      }
    } catch (error) {
      setValidatedSealIds(prev => 
        prev.map(s => s.id === trimmedId ? { ...s, status: 'invalid' } : s)
      );
      toast.error('Failed to validate SEAL ID');
    }
    
    setIsValidatingSeal(false);
    setSealIdInput('');
  };

  const handleRemoveSealId = (idToRemove: string) => {
    setValidatedSealIds(prev => prev.filter(s => s.id !== idToRemove));
    const validIds = validatedSealIds
      .filter(s => s.status === 'valid' && s.id !== idToRemove)
      .map(s => s.id);
    form.setValue('sealIds', validIds.join(', '));
  };

  const generateInitiativeId = () => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 900) + 100;
    return `INI-${year}-${randomNum}`;
  };

  const onSubmit = (data: FormData) => {
    const initiativeId = generateInitiativeId();
    console.log('Form submitted:', { ...data, initiativeId });
    toast.success('Initiative submitted successfully!', {
      description: `Initiative ${initiativeId} has been sent for review.`,
    });
    navigate('/');
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-4 -ml-4 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        <h1 className="font-display text-3xl font-bold text-foreground">
          Submit New Initiative
        </h1>
        <p className="mt-1 text-muted-foreground">
          Complete the form below to submit a major initiative for executive review
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                currentStep >= step.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground"
              )}
            >
              {currentStep > step.id ? (
                <Check className="h-5 w-5" />
              ) : (
                <step.icon className="h-5 w-5" />
              )}
            </div>
            <span
              className={cn(
                "ml-2 hidden text-sm font-medium sm:block",
                currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {step.title}
            </span>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "mx-4 h-0.5 w-12 lg:w-24",
                  currentStep > step.id ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <Card className="executive-card animate-slide-up">
            <CardHeader>
              <CardTitle className="font-display">Basic Information</CardTitle>
              <CardDescription>
                Provide the core details about your initiative
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Initiative Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter a clear, descriptive title"
                  {...form.register('title')}
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessCase">Business Case *</Label>
                <Textarea
                  id="businessCase"
                  placeholder="Describe the business justification for this initiative"
                  rows={4}
                  {...form.register('businessCase')}
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="ownerName">Owner Name *</Label>
                  <Input
                    id="ownerName"
                    placeholder="Initiative owner"
                    {...form.register('ownerName')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="requesterStakeholders">Requester Stakeholders (SIDs) *</Label>
                  <Input
                    id="requesterStakeholders"
                    placeholder="SID001, SID002, SID003"
                    {...form.register('requesterStakeholders')}
                  />
                </div>
              </div>

              {/* SEAL ID Field */}
              <div className="space-y-2">
                <Label htmlFor="sealIds">SEAL ID(s) <span className="text-muted-foreground text-xs">(Optional)</span></Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Enter SEAL IDs this initiative is associated with. Each ID will be validated against the SEAL server.
                </p>
                <div className="flex gap-2">
                  <Input
                    id="sealIdInput"
                    placeholder="e.g., SEAL-001"
                    value={sealIdInput}
                    onChange={(e) => setSealIdInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSealId();
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={handleAddSealId}
                    disabled={isValidatingSeal || !sealIdInput.trim()}
                  >
                    {isValidatingSeal ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Validate & Add'
                    )}
                  </Button>
                </div>
                {validatedSealIds.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {validatedSealIds.map((seal) => (
                      <Badge
                        key={seal.id}
                        variant={seal.status === 'valid' ? 'default' : seal.status === 'invalid' ? 'destructive' : 'secondary'}
                        className="flex items-center gap-1.5 px-3 py-1"
                      >
                        {seal.status === 'pending' && <Loader2 className="h-3 w-3 animate-spin" />}
                        {seal.status === 'valid' && <CheckCircle className="h-3 w-3" />}
                        {seal.status === 'invalid' && <XCircle className="h-3 w-3" />}
                        {seal.id}
                        <button
                          type="button"
                          onClick={() => handleRemoveSealId(seal.id)}
                          className="ml-1 hover:text-destructive-foreground"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Valid mock IDs for testing: SEAL-001, SEAL-002, SEAL-003, SEAL-100, SEAL-200, SEAL-500
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="overview">Overview *</Label>
                <Textarea
                  id="overview"
                  placeholder="Provide a comprehensive overview of the initiative"
                  rows={6}
                  {...form.register('overview')}
                />
              </div>

              <Separator />

              <div className="grid gap-6 sm:grid-cols-3">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="isGTSIG">Is GT SIG?</Label>
                    <p className="text-xs text-muted-foreground">Mark if GT SIG initiative</p>
                  </div>
                  <Switch
                    id="isGTSIG"
                    checked={form.watch('isGTSIG')}
                    onCheckedChange={(checked) => form.setValue('isGTSIG', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select
                    value={form.watch('category')}
                    onValueChange={(v) => form.setValue('category', v as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mandatory">Mandatory</SelectItem>
                      <SelectItem value="Discretionary">Discretionary</SelectItem>
                      <SelectItem value="Regulatory">Regulatory</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Work Type *</Label>
                  <Select
                    value={form.watch('workType')}
                    onValueChange={(v) => form.setValue('workType', v as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="Expansion">Expansion</SelectItem>
                      <SelectItem value="Change to Existing">Change to Existing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Investment */}
        {currentStep === 2 && (
          <Card className="executive-card animate-slide-up">
            <CardHeader>
              <CardTitle className="font-display">Investment Details</CardTitle>
              <CardDescription>
                Specify the ROM, timeframe, and labor investment required
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="scopeSizing">Scope & Sizing (ROM) *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="scopeSizing"
                      type="number"
                      className="pl-8"
                      placeholder="0"
                      {...form.register('scopeSizing', { valueAsNumber: true })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Timeframe *</Label>
                  <Select
                    value={form.watch('timeframe')}
                    onValueChange={(v) => form.setValue('timeframe', v as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Multi-Year">Multi-Year</SelectItem>
                      <SelectItem value="One Year">One Year</SelectItem>
                      <SelectItem value="6 Months">6 Months</SelectItem>
                      <SelectItem value="Quarter">Quarter</SelectItem>
                      <SelectItem value="Immediate">Immediate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="mb-4 font-medium text-foreground">Labor Investment - Overall</h4>
                <div className="grid gap-4 sm:grid-cols-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Existing Heads Committed</Label>
                    <Input
                      type="number"
                      {...form.register('existingHeadsCommitted', { valueAsNumber: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Deferred Incremental</Label>
                    <Input
                      type="number"
                      {...form.register('deferredIncremental', { valueAsNumber: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Total New Ask</Label>
                    <Input
                      type="number"
                      {...form.register('totalNewAsk', { valueAsNumber: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Next Phase Ask</Label>
                    <Input
                      type="number"
                      {...form.register('nextPhaseAsk', { valueAsNumber: true })}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="mb-4 font-medium text-foreground">Domain: CFP</h4>
                <div className="grid gap-4 sm:grid-cols-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Existing Heads</Label>
                    <Input
                      type="number"
                      {...form.register('cfpExisting', { valueAsNumber: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Deferred Inc.</Label>
                    <Input
                      type="number"
                      {...form.register('cfpDeferred', { valueAsNumber: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">New Ask</Label>
                    <Input
                      type="number"
                      {...form.register('cfpNewAsk', { valueAsNumber: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Next Phase</Label>
                    <Input
                      type="number"
                      {...form.register('cfpNextPhase', { valueAsNumber: true })}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="mb-4 font-medium text-foreground">Domain: CPNS</h4>
                <div className="grid gap-4 sm:grid-cols-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Existing Heads</Label>
                    <Input
                      type="number"
                      {...form.register('cpnsExisting', { valueAsNumber: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Deferred Inc.</Label>
                    <Input
                      type="number"
                      {...form.register('cpnsDeferred', { valueAsNumber: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">New Ask</Label>
                    <Input
                      type="number"
                      {...form.register('cpnsNewAsk', { valueAsNumber: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Next Phase</Label>
                    <Input
                      type="number"
                      {...form.register('cpnsNextPhase', { valueAsNumber: true })}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="nonLaborAsk">Non-Labor Ask</Label>
                <Textarea
                  id="nonLaborAsk"
                  placeholder="Describe any non-labor costs (software, licenses, hardware, etc.)"
                  rows={3}
                  {...form.register('nonLaborAsk')}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Scope & Value */}
        {currentStep === 3 && (
          <Card className="executive-card animate-slide-up">
            <CardHeader>
              <CardTitle className="font-display">Scope & Value</CardTitle>
              <CardDescription>
                Define the scope of work and expected ROI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="workInScope">Work in Scope for Phased Investment *</Label>
                <Textarea
                  id="workInScope"
                  placeholder="Describe what work is included in each phase of investment"
                  rows={5}
                  {...form.register('workInScope')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="valueROI">Value / ROI Measure *</Label>
                <Textarea
                  id="valueROI"
                  placeholder="Quantify the expected return on investment (include specific numbers and metrics)"
                  rows={5}
                  {...form.register('valueROI')}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Risks & Dependencies */}
        {currentStep === 4 && (
          <Card className="executive-card animate-slide-up">
            <CardHeader>
              <CardTitle className="font-display">Risks & Dependencies</CardTitle>
              <CardDescription>
                Identify risks and resource requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="risksIfNotImplemented">Risks if Not Implemented/Deferred *</Label>
                <Textarea
                  id="risksIfNotImplemented"
                  placeholder="What are the consequences of not proceeding with this initiative?"
                  rows={4}
                  {...form.register('risksIfNotImplemented')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dependencies">Dependencies</Label>
                <Textarea
                  id="dependencies"
                  placeholder="List any dependencies on other teams, projects, or external factors"
                  rows={4}
                  {...form.register('dependencies')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="resourceAvailability">Resource Availability</Label>
                <Textarea
                  id="resourceAvailability"
                  placeholder="Describe the availability of required resources and any constraints"
                  rows={4}
                  {...form.register('resourceAvailability')}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>

          {currentStep < 4 ? (
            <Button type="button" onClick={nextStep} className="gap-2">
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" className="gap-2 bg-success hover:bg-success/90">
              <Check className="h-4 w-4" />
              Submit Initiative
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
