import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  BarChart3,
  Menu,
  Briefcase,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface AppLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Admin', href: '/admin', icon: Users },
];

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 transform bg-sidebar transition-transform duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex h-20 items-center gap-3 border-b border-sidebar-border px-6 hover:bg-sidebar-accent/50 transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary">
              <Briefcase className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-sidebar-foreground">
                ExecHub
              </h1>
              <p className="text-xs text-sidebar-foreground/60">Initiative Portal</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-4 py-6">
            {/* Highlighted New Initiative Button */}
            <Link
              to="/intake"
              onClick={() => setSidebarOpen(false)}
              className="group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-all duration-200 bg-primary text-primary-foreground hover:bg-primary/90 mb-4"
            >
              <Plus className="h-5 w-5" />
              New Initiative
            </Link>
            
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground border border-sidebar-border"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className={cn(
                    "h-5 w-5 transition-colors",
                    isActive ? "text-primary" : "text-sidebar-foreground/70 group-hover:text-sidebar-accent-foreground"
                  )} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-sidebar-border p-4">
            <div className="rounded-lg bg-sidebar-accent p-4">
              <p className="text-xs font-medium text-sidebar-accent-foreground">
                Need Help?
              </p>
              <p className="mt-1 text-xs text-sidebar-foreground/60 mb-3">
                Contact IT Support for assistance with the portal.
              </p>
              <a 
                href="mailto:ip_demand_management@email.com"
                className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors w-full"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-card px-4 lg:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex-1" />
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">Admin User</p>
              <p className="text-xs text-muted-foreground">SID12345</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center">
              <span className="text-sm font-medium text-primary-foreground">AU</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="min-h-[calc(100vh-4rem)] p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
