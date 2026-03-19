import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { usePendingApprovals } from '@/hooks/useDashboardData';

export const PendingApprovals = () => {
  const { data: approvals = [], isLoading } = usePendingApprovals();

  return (
    <div className="brutal-card p-5">
      <h3 className="font-heading font-bold text-foreground mb-4">Pending Driver Approvals</h3>
      <div className="space-y-3">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : approvals.length === 0 ? (
          <p className="text-sm text-muted-foreground">No pending approvals</p>
        ) : approvals.map((item: any) => (
          <div key={item.id || item.name} className="flex items-center justify-between p-3 brutal-border rounded-sm bg-secondary/30">
            <div>
              <p className="font-heading font-bold text-sm text-foreground">{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.docType} · {item.city}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="success" size="sm"><Check className="h-4 w-4" strokeWidth={3} /></Button>
              <Button variant="destructive" size="sm"><X className="h-4 w-4" strokeWidth={3} /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
