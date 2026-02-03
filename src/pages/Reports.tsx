import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockInitiatives } from '@/data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/ui/status-badge';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import { 
  TrendingUp, 
  PieChart as PieChartIcon, 
  BarChart3,
  Calendar,
  Building2,
  ArrowRight,
  Download
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const COLORS = {
  approved: 'hsl(145 60% 40%)',
  denied: 'hsl(0 70% 55%)',
  pending: 'hsl(43 90% 50%)',
};

export default function Reports() {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState('all');
  const [originFilter, setOriginFilter] = useState('all');

  const filteredInitiatives = useMemo(() => {
    return mockInitiatives.filter(initiative => {
      const matchesOrigin = originFilter === 'all' || initiative.lineOfBusiness === originFilter;
      return matchesOrigin;
    });
  }, [originFilter]);

  // Chart data
  const statusData = useMemo(() => {
    const approved = filteredInitiatives.filter(i => i.status === 'approved').length;
    const denied = filteredInitiatives.filter(i => i.status === 'denied').length;
    const pending = filteredInitiatives.filter(i => i.status === 'pending').length;
    
    return [
      { name: 'Approved', value: approved, color: COLORS.approved },
      { name: 'Denied', value: denied, color: COLORS.denied },
      { name: 'Pending', value: pending, color: COLORS.pending },
    ];
  }, [filteredInitiatives]);

  const categoryData = useMemo(() => {
    const mandatory = filteredInitiatives.filter(i => i.category === 'Mandatory').length;
    const discretionary = filteredInitiatives.filter(i => i.category === 'Discretionary').length;
    const regulatory = filteredInitiatives.filter(i => i.category === 'Regulatory').length;
    
    return [
      { name: 'Mandatory', count: mandatory },
      { name: 'Discretionary', count: discretionary },
      { name: 'Regulatory', count: regulatory },
    ];
  }, [filteredInitiatives]);

  const trendData = useMemo(() => {
    return [
      { month: 'Sep', approved: 2, denied: 1, total: 3 },
      { month: 'Oct', approved: 4, denied: 2, total: 6 },
      { month: 'Nov', approved: 3, denied: 1, total: 4 },
      { month: 'Dec', approved: 5, denied: 2, total: 7 },
      { month: 'Jan', approved: 1, denied: 1, total: 3 },
    ];
  }, []);

  const originData = useMemo(() => {
    const byOrigin: Record<string, { approved: number; denied: number; pending: number }> = {};
    
    filteredInitiatives.forEach(initiative => {
      const origin = initiative.lineOfBusiness || 'Unknown';
      if (!byOrigin[origin]) {
        byOrigin[origin] = { approved: 0, denied: 0, pending: 0 };
      }
      byOrigin[origin][initiative.status]++;
    });
    
    return Object.entries(byOrigin).map(([name, data]) => ({
      name,
      ...data,
      total: data.approved + data.denied + data.pending,
    }));
  }, [filteredInitiatives]);

  const uniqueOrigins = useMemo(() => {
    return [...new Set(mockInitiatives.map(i => i.lineOfBusiness).filter(Boolean))];
  }, []);

  const exportToCSV = () => {
    const headers = [
      'Initiative ID',
      'Title',
      'Status',
      'Category',
      'Owner',
      'Submitted By',
      'Submitted At',
      'ROM',
      'Timeframe',
      'Work Type',
      'Line of Business',
      'Assessor Name',
      'Assessed At'
    ];

    const csvData = filteredInitiatives.map(i => [
      i.initiativeId,
      `"${i.title.replace(/"/g, '""')}"`,
      i.status,
      i.category,
      i.ownerName,
      i.submittedBy,
      format(new Date(i.submittedAt), 'yyyy-MM-dd'),
      i.scopeSizing,
      i.timeframe,
      i.workType,
      i.lineOfBusiness || '',
      i.assessorName || '',
      i.assessedAt ? format(new Date(i.assessedAt), 'yyyy-MM-dd') : ''
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `initiatives_export_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Export successful', {
      description: `${filteredInitiatives.length} initiatives exported to CSV`
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Initiative Reports
          </h1>
          <p className="mt-1 text-muted-foreground">
            Analytics and insights on submitted initiatives
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>
          <Select value={originFilter} onValueChange={setOriginFilter}>
            <SelectTrigger className="w-[160px]">
              <Building2 className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Origin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Origins</SelectItem>
              {uniqueOrigins.map(origin => (
                <SelectItem key={origin} value={origin!}>{origin}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="executive-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Submitted</p>
                <p className="text-3xl font-bold text-foreground">{filteredInitiatives.length}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="executive-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-3xl font-bold text-success">
                  {filteredInitiatives.filter(i => i.status === 'approved').length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-success/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="executive-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Denied</p>
                <p className="text-3xl font-bold text-destructive">
                  {filteredInitiatives.filter(i => i.status === 'denied').length}
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center">
                <span className="text-destructive font-bold">−</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="executive-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approval Rate</p>
                <p className="text-3xl font-bold text-accent">
                  {filteredInitiatives.length > 0 
                    ? Math.round((filteredInitiatives.filter(i => i.status === 'approved').length / filteredInitiatives.filter(i => i.status !== 'pending').length) * 100) || 0
                    : 0}%
                </p>
              </div>
              <PieChartIcon className="h-8 w-8 text-accent/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Status Distribution */}
        <Card className="executive-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Status Distribution
            </CardTitle>
            <CardDescription>
              Breakdown of initiative outcomes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card className="executive-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              By Category
            </CardTitle>
            <CardDescription>
              Initiatives grouped by category type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trend Chart */}
      <Card className="executive-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Monthly Trend
          </CardTitle>
          <CardDescription>
            Approved vs denied initiatives over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <YAxis 
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="approved" 
                  stroke={COLORS.approved}
                  strokeWidth={2}
                  dot={{ fill: COLORS.approved }}
                />
                <Line 
                  type="monotone" 
                  dataKey="denied" 
                  stroke={COLORS.denied}
                  strokeWidth={2}
                  dot={{ fill: COLORS.denied }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* By Origin */}
      <Card className="executive-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            By Line of Business
          </CardTitle>
          <CardDescription>
            Initiative outcomes grouped by origin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {originData.map((origin) => (
              <div key={origin.name} className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-foreground">{origin.name}</h4>
                  <span className="text-sm text-muted-foreground">{origin.total} total</span>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1 rounded bg-success/10 p-2 text-center">
                    <p className="text-lg font-bold text-success">{origin.approved}</p>
                    <p className="text-xs text-muted-foreground">Approved</p>
                  </div>
                  <div className="flex-1 rounded bg-destructive/10 p-2 text-center">
                    <p className="text-lg font-bold text-destructive">{origin.denied}</p>
                    <p className="text-xs text-muted-foreground">Denied</p>
                  </div>
                  <div className="flex-1 rounded bg-accent/10 p-2 text-center">
                    <p className="text-lg font-bold text-accent">{origin.pending}</p>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Initiatives */}
      <Card className="executive-card">
        <CardHeader>
          <CardTitle>Recent Submissions</CardTitle>
          <CardDescription>
            Click any initiative to view full details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredInitiatives.slice(0, 5).map((initiative) => (
              <div
                key={initiative.id}
                onClick={() => navigate(`/assessment/${initiative.id}`)}
                className="flex items-center justify-between rounded-lg border p-4 cursor-pointer transition-colors hover:bg-secondary/50"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{initiative.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {initiative.submittedBy} • {format(new Date(initiative.submittedAt), 'MMM d, yyyy')}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={initiative.status} size="sm" />
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Section */}
      <Card className="executive-card">
        <CardContent className="flex items-center justify-between py-6">
          <div>
            <h3 className="font-medium text-foreground">Export Data</h3>
            <p className="text-sm text-muted-foreground">
              Download all {filteredInitiatives.length} initiatives as a CSV file
            </p>
          </div>
          <Button onClick={exportToCSV} className="gap-2">
            <Download className="h-4 w-4" />
            Export to CSV
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
