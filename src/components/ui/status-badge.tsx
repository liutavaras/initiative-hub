import { cn } from '@/lib/utils';
import { InitiativeStatus } from '@/types/initiative';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: InitiativeStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const statusConfig = {
  pending: {
    label: 'Pending Review',
    className: 'status-pending border',
    icon: Clock,
  },
  approved: {
    label: 'Approved',
    className: 'status-approved border',
    icon: CheckCircle,
  },
  denied: {
    label: 'Denied',
    className: 'status-denied border',
    icon: XCircle,
  },
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-sm',
};

export function StatusBadge({ status, size = 'md', showIcon = true }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        config.className,
        sizeClasses[size]
      )}
    >
      {showIcon && <Icon className="h-3.5 w-3.5" />}
      {config.label}
    </span>
  );
}
