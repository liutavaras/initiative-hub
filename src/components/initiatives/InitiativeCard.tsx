import { Initiative } from '@/types/initiative';
import { StatusBadge } from '@/components/ui/status-badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Calendar, User, DollarSign, Building2 } from 'lucide-react';
import { format } from 'date-fns';

interface InitiativeCardProps {
  initiative: Initiative;
  onClick?: () => void;
}

export function InitiativeCard({ initiative, onClick }: InitiativeCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  };

  return (
    <Card 
      className="executive-card cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-primary/20"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-mono text-primary mb-1">{initiative.initiativeId}</p>
            <h3 className="font-display text-lg font-semibold text-foreground truncate">
              {initiative.title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {initiative.businessCase}
            </p>
          </div>
          <StatusBadge status={initiative.status} size="sm" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="h-4 w-4" />
            <span className="truncate">{initiative.ownerName}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            <span>{formatCurrency(initiative.scopeSizing)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <span className="truncate">{initiative.category}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(initiative.submittedAt), 'MMM d, yyyy')}</span>
          </div>
        </div>
        
        <div className="mt-4 flex flex-col gap-2 pt-4 border-t">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Submitted by</span>
            <span className="text-xs font-medium text-foreground">{initiative.submittedBy}</span>
          </div>
          {initiative.assessorName && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Assessed by</span>
              <span className="text-xs font-medium text-foreground">{initiative.assessorName}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
