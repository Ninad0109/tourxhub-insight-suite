import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Settings, User, LogOut, Shield } from 'lucide-react';

export function DashboardHeader() {
  const currentTime = new Date().toLocaleString();

  return (
    <header className="bg-gradient-card shadow-card border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">TOURXHUB</h1>
              <p className="text-sm text-muted-foreground">Tourist Management Dashboard</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
            System Online
          </Badge>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-foreground">Authority Center</p>
            <p className="text-xs text-muted-foreground">{currentTime}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">3</Badge>
            </Button>
            
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4" />
            </Button>
            
            <Button variant="ghost" size="sm">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}