import { Navigation, Car, DollarSign, Zap } from 'lucide-react';
import { useKPIs } from '@/hooks/useDashboardData';

export const KPICards = () => {
  const { data, isLoading } = useKPIs();

  const kpis = [
    { label: 'Total Trips', value: data?.totalTrips?.toLocaleString() ?? '—', change: '+12.5%', icon: Navigation, color: 'bg-primary' },
    { label: 'Active Drivers', value: data?.activeDrivers?.toLocaleString() ?? '—', change: '+8.2%', icon: Car, color: 'bg-success' },
    { label: 'Revenue Today', value: data ? `₹${data.revenueToday.toLocaleString()}` : '—', change: '+15.3%', icon: DollarSign, color: 'bg-accent' },
    { label: 'Ongoing Rides', value: data?.ongoingRides?.toLocaleString() ?? '—', change: 'Live', icon: Zap, color: 'bg-warning' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <div key={kpi.label} className={`brutal-card brutal-card-press p-5 ${isLoading ? 'animate-pulse' : ''}`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-heading font-bold text-muted-foreground uppercase tracking-wider">{kpi.label}</p>
              <p className="text-3xl font-heading font-bold text-foreground mt-1">{kpi.value}</p>
              <span className={`inline-block mt-2 text-xs font-bold px-2 py-0.5 rounded-sm brutal-border ${
                kpi.change === 'Live' ? 'bg-primary text-primary-foreground' : 'bg-success/10 text-success'
              }`}>{kpi.change}</span>
            </div>
            <div className={`${kpi.color} h-10 w-10 rounded-sm flex items-center justify-center brutal-border`}>
              <kpi.icon className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
