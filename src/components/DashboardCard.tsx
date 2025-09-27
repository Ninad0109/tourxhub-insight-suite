import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: ReactNode;
  sparkline?: ReactNode;
  className?: string;
}

export function DashboardCard({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon, 
  sparkline,
  className = ''
}: DashboardCardProps) {
  const changeColor = {
    positive: 'text-success',
    negative: 'text-destructive',
    neutral: 'text-muted-foreground'
  };

  return (
    <Card className={`bg-gradient-card shadow-card hover:shadow-elevated transition-all duration-300 ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className="h-4 w-4 text-dashboard-accent">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-foreground">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </div>
            {change && (
              <p className={`text-xs ${changeColor[changeType]} mt-1`}>
                {change}
              </p>
            )}
          </div>
          {sparkline && (
            <div className="h-8 w-16 opacity-60">
              {sparkline}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}