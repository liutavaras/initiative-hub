import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockInitiatives } from '@/data/mockData';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  ExternalLink, 
  Calendar,
  User,
  Building2,
  DollarSign,
  Clock,
  Users,
  AlertTriangle,
  Link as LinkIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { Initiative, InitiativeStatus } from '@/types/initiative';

export default function ImpactAssessment() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Find initiative - in real app this would be from API
  const [initiative, setInitiative] = useState<Initiative | undefined>(
    mockInitiatives.find(i => i.id === id) || mockInitiatives[0]
  );

  const [isAnimating, setIsAnimating] = useState(false);

  if (!initiative) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-muted-foreground">Initiative not found</p>
        <Button variant="link" onClick={() => navigate('/')}>
          Return to Dashboard
        </Button>
      </div>
    );
  }

  const handleDecision = (decision: 'approved' | 'denied') => {
    setIsAnimating(true);
    
    setTimeout(() => {
      setInitiative({ 
        ...initiative, 
        status: decision,
        assessorName: 'Admin User', // Would come from auth context in real app
        assessedAt: new Date().toISOString(),
      });
      setIsAnimating(false);
      
      if (decision === 'approved') {
        toast.success('Initiative Approved', {
          description: 'The initiative has been approved and is ready for routing.',
        });
      } else {
        toast.error('Initiative Denied', {
          description: 'The initiative has been denied.',
        });
      }
    }, 500);
  };

  const handleConnector = (target: string) => {
    toast.success(`Routing to ${target}`, {
      description: `Initiative "${initiative.title}" has been sent to ${target}.`,
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4 -ml-4 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-4">
            <h1 className="font-display text-3xl font-bold text-foreground">
              Impact Assessment
            </h1>
            <StatusBadge status={initiative.status} size="lg" />
          </div>
          <p className="mt-1 text-muted-foreground">
            Review and assess this initiative for approval
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className={cn(
        "transition-all duration-500",
        isAnimating && initiative.status === 'denied' && "animate-shake",
        isAnimating && initiative.status === 'approved' && "scale-[1.02]"
      )}>
        {/* Title Card */}
        <Card className="executive-card overflow-hidden">
          <div className="executive-header px-6 py-8 text-primary-foreground">
            <p className="text-sm font-mono text-primary-foreground/70 mb-2">{initiative.initiativeId}</p>
            <h2 className="font-display text-2xl font-bold">{initiative.title}</h2>
            <p className="mt-2 text-primary-foreground/80">{initiative.businessCase}</p>
          </div>
          <CardContent className="p-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <User className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Owner</p>
                  <p className="font-medium text-foreground">{initiative.ownerName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <Building2 className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Category</p>
                  <p className="font-medium text-foreground">{initiative.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <DollarSign className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">ROM</p>
                  <p className="font-medium text-foreground">{formatCurrency(initiative.scopeSizing)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <Clock className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Timeframe</p>
                  <p className="font-medium text-foreground">{initiative.timeframe}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details Grid */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Overview */}
          <Card className="executive-card">
            <CardHeader>
              <CardTitle className="text-lg">Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {initiative.overview}
              </p>
              <Separator className="my-4" />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Work Type</p>
                  <p className="font-medium">{initiative.workType}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">GT SIG</p>
                  <p className="font-medium">{initiative.isGTSIG ? 'Yes' : 'No'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Stakeholders</p>
                  <p className="font-medium">{initiative.requesterStakeholders}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Labor Investment */}
          <Card className="executive-card">
            <CardHeader>
              <CardTitle className="text-lg">Labor Investment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Existing Heads</p>
                    <p className="text-xl font-bold text-foreground">
                      {initiative.laborInvestment.existingHeadsCommitted}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Deferred Inc.</p>
                    <p className="text-xl font-bold text-foreground">
                      {initiative.laborInvestment.deferredIncremental}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total New Ask</p>
                    <p className="text-xl font-bold text-accent">
                      {initiative.laborInvestment.totalNewAsk}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Next Phase Ask</p>
                    <p className="text-xl font-bold text-foreground">
                      {initiative.laborInvestment.nextPhaseAsk}
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-secondary p-3">
                    <p className="text-xs font-medium text-secondary-foreground">CFP Domain</p>
                    <p className="mt-1 text-sm">
                      {initiative.laborInvestment.domains.CFP.totalNewAsk} new ask
                    </p>
                  </div>
                  <div className="rounded-lg bg-secondary p-3">
                    <p className="text-xs font-medium text-secondary-foreground">CPNS Domain</p>
                    <p className="mt-1 text-sm">
                      {initiative.laborInvestment.domains.CPNS.totalNewAsk} new ask
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Value & ROI */}
          <Card className="executive-card">
            <CardHeader>
              <CardTitle className="text-lg">Value & ROI</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Expected Value</p>
                <p className="text-sm leading-relaxed">{initiative.valueROI}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-2">Work in Scope</p>
                <p className="text-sm leading-relaxed">{initiative.workInScope}</p>
              </div>
            </CardContent>
          </Card>

          {/* Risks & Dependencies */}
          <Card className="executive-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="h-5 w-5 text-accent" />
                Risks & Dependencies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Risks if Not Implemented</p>
                <p className="text-sm leading-relaxed text-destructive/80">
                  {initiative.risksIfNotImplemented}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-2">Dependencies</p>
                <p className="text-sm leading-relaxed">{initiative.dependencies}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Resource Availability</p>
                <p className="text-sm leading-relaxed">{initiative.resourceAvailability}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submission Info */}
        <Card className="executive-card mt-6">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 py-4">
            <div className="flex items-center gap-4">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Submitted by</p>
                <p className="font-medium">{initiative.submittedBy}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Submitted on</p>
                <p className="font-medium">
                  {format(new Date(initiative.submittedAt), 'MMMM d, yyyy')}
                </p>
              </div>
            </div>
            {initiative.assessorName && (
              <div className="flex items-center gap-4">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Assessed by</p>
                  <p className="font-medium">{initiative.assessorName}</p>
                </div>
              </div>
            )}
            {initiative.assessedAt && (
              <div className="flex items-center gap-4">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Assessed on</p>
                  <p className="font-medium">
                    {format(new Date(initiative.assessedAt), 'MMMM d, yyyy')}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {initiative.status === 'pending' ? (
            <div className="flex gap-4">
              <Button
                size="lg"
                className="gap-2 bg-success hover:bg-success/90"
                onClick={() => handleDecision('approved')}
              >
                <CheckCircle className="h-5 w-5" />
                Approve Initiative
              </Button>
              <Button
                size="lg"
                variant="destructive"
                className="gap-2"
                onClick={() => handleDecision('denied')}
              >
                <XCircle className="h-5 w-5" />
                Deny Initiative
              </Button>
            </div>
          ) : initiative.status === 'approved' ? (
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => handleConnector('JIRA IPCS')}
              >
                <ExternalLink className="h-4 w-4" />
                Send to JIRA IPCS
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => handleConnector('PI for ROM')}
              >
                <LinkIcon className="h-4 w-4" />
                Send to PI for ROM
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => handleConnector('Azure DevOps')}
              >
                <ExternalLink className="h-4 w-4" />
                Send to Azure DevOps
              </Button>
            </div>
          ) : null}

          <Button variant="ghost" onClick={() => navigate('/')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
