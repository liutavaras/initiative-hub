import { useState } from 'react';
import { mockUsers } from '@/data/mockData';
import { User } from '@/types/initiative';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  Search, 
  Plus, 
  Trash2, 
  UserCheck, 
  UserPlus, 
  Shield,
  Users as UsersIcon
} from 'lucide-react';

export default function Admin() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserSid, setNewUserSid] = useState('');
  const [newUserRole, setNewUserRole] = useState<'approver' | 'requester'>('requester');
  const [newUserCategory, setNewUserCategory] = useState('LOB');

  const approvers = users.filter(u => u.role === 'approver');
  const requesters = users.filter(u => u.role === 'requester');

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.sid.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddUser = () => {
    if (!newUserName || !newUserSid) {
      toast.error('Please fill in all fields');
      return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      name: newUserName,
      sid: newUserSid,
      role: newUserRole,
      category: newUserCategory,
    };

    setUsers([...users, newUser]);
    setNewUserName('');
    setNewUserSid('');
    toast.success('User added successfully');
  };

  const handleRemoveUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
    toast.success('User removed');
  };

  const handleToggleRole = (userId: string) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        const newRole = u.role === 'approver' ? 'requester' : 'approver';
        toast.success(`${u.name} is now a${newRole === 'approver' ? 'n' : ''} ${newRole}`);
        return { ...u, role: newRole as 'approver' | 'requester' };
      }
      return u;
    }));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          User Administration
        </h1>
        <p className="mt-1 text-muted-foreground">
          Manage user permissions for initiative approvals and submissions
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="executive-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{users.length}</div>
          </CardContent>
        </Card>
        
        <Card className="executive-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Approvers
            </CardTitle>
            <UserCheck className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{approvers.length}</div>
          </CardContent>
        </Card>
        
        <Card className="executive-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Requesters
            </CardTitle>
            <UserPlus className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{requesters.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Add User */}
        <Card className="executive-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New User
            </CardTitle>
            <CardDescription>
              Grant permission to submit or approve initiatives
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="userName">User Name</Label>
                <Input
                  id="userName"
                  placeholder="Full name"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userSid">SID</Label>
                <Input
                  id="userSid"
                  placeholder="SID123"
                  value={newUserSid}
                  onChange={(e) => setNewUserSid(e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={newUserRole} onValueChange={(v) => setNewUserRole(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="requester">Requester</SelectItem>
                    <SelectItem value="approver">Approver</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={newUserCategory} onValueChange={setNewUserCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOB">LOB</SelectItem>
                    <SelectItem value="GTLT">GTLT</SelectItem>
                    <SelectItem value="Product">Product</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleAddUser} className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Add User
            </Button>
          </CardContent>
        </Card>

        {/* Search Users */}
        <Card className="executive-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Users
            </CardTitle>
            <CardDescription>
              Find and manage existing user permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or SID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="max-h-[300px] space-y-2 overflow-y-auto">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-secondary/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
                      <span className="text-xs font-medium text-primary-foreground">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.sid}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={user.role === 'approver' ? 'default' : 'secondary'}
                      className="capitalize"
                    >
                      {user.role}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {user.category}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Lists */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Approvers List */}
        <Card className="executive-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-success">
              <Shield className="h-5 w-5" />
              Approvers ({approvers.length})
            </CardTitle>
            <CardDescription>
              Users who can approve or deny initiatives
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {approvers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-lg border border-success/20 bg-success/5 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-success">
                      <span className="text-xs font-medium text-success-foreground">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.sid} • {user.category}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleRole(user.id)}
                    >
                      Demote
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleRemoveUser(user.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {approvers.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-4">
                  No approvers configured
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Requesters List */}
        <Card className="executive-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-accent">
              <UserPlus className="h-5 w-5" />
              Requesters ({requesters.length})
            </CardTitle>
            <CardDescription>
              Users who can submit new initiatives
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {requesters.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-lg border border-accent/20 bg-accent/5 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
                      <span className="text-xs font-medium text-accent-foreground">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.sid} • {user.category}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleRole(user.id)}
                    >
                      Promote
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleRemoveUser(user.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {requesters.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-4">
                  No requesters configured
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
