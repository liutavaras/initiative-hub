import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockInitiatives } from '@/data/mockData';
import { InitiativeCard } from '@/components/initiatives/InitiativeCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import { InitiativeStatus } from '@/types/initiative';

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<InitiativeStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredInitiatives = useMemo(() => {
    return mockInitiatives.filter((initiative) => {
      const matchesSearch = 
        initiative.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        initiative.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        initiative.submittedBy.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || initiative.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || initiative.category === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [searchQuery, statusFilter, categoryFilter]);

  const stats = useMemo(() => ({
    total: mockInitiatives.length,
    pending: mockInitiatives.filter(i => i.status === 'pending').length,
    approved: mockInitiatives.filter(i => i.status === 'approved').length,
    denied: mockInitiatives.filter(i => i.status === 'denied').length,
  }), []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Initiative Dashboard
          </h1>
          <p className="mt-1 text-muted-foreground">
            Track and manage all major initiatives across the organization
          </p>
        </div>
        <Button 
          onClick={() => navigate('/intake')}
          className="gap-2 bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          New Initiative
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card 
          className={`executive-card cursor-pointer transition-all hover:scale-[1.02] ${statusFilter === 'all' ? 'ring-2 ring-primary' : ''}`}
          onClick={() => setStatusFilter('all')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold text-muted-foreground">
              Total Initiatives
            </CardTitle>
            <FileText className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">Click to view all</p>
          </CardContent>
        </Card>
        
        <Card 
          className={`executive-card cursor-pointer transition-all hover:scale-[1.02] ${statusFilter === 'pending' ? 'ring-2 ring-primary' : ''}`}
          onClick={() => setStatusFilter('pending')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold text-muted-foreground">
              Pending Review
            </CardTitle>
            <Clock className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.pending}</div>
            <p className="text-xs text-muted-foreground mt-1">Click to filter</p>
          </CardContent>
        </Card>
        
        <Card 
          className={`executive-card cursor-pointer transition-all hover:scale-[1.02] ${statusFilter === 'approved' ? 'ring-2 ring-primary' : ''}`}
          onClick={() => setStatusFilter('approved')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold text-muted-foreground">
              Approved
            </CardTitle>
            <CheckCircle className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">{stats.approved}</div>
            <p className="text-xs text-muted-foreground mt-1">Click to filter</p>
          </CardContent>
        </Card>
        
        <Card 
          className={`executive-card cursor-pointer transition-all hover:scale-[1.02] ${statusFilter === 'denied' ? 'ring-2 ring-primary' : ''}`}
          onClick={() => setStatusFilter('denied')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold text-muted-foreground">
              Denied
            </CardTitle>
            <XCircle className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{stats.denied}</div>
            <p className="text-xs text-muted-foreground mt-1">Click to filter</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title, owner, or submitter..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as InitiativeStatus | 'all')}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="denied">Denied</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Mandatory">Mandatory</SelectItem>
            <SelectItem value="Discretionary">Discretionary</SelectItem>
            <SelectItem value="Regulatory">Regulatory</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Initiative Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredInitiatives.map((initiative) => (
          <InitiativeCard
            key={initiative.id}
            initiative={initiative}
            onClick={() => navigate(`/assessment/${initiative.id}`)}
          />
        ))}
      </div>

      {filteredInitiatives.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FileText className="h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium text-foreground">No initiatives found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
}
