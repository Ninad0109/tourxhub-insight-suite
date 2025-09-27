import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Clock, MapPin, CheckCircle, Eye } from 'lucide-react';
import { mockIncidents, Incident } from '@/lib/mockData';

export function IncidentFeed() {
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  const filteredIncidents = incidents.filter(incident => 
    severityFilter === 'all' || incident.severity === severityFilter
  );

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'default';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'destructive';
      case 'acknowledged': return 'warning';
      case 'resolved': return 'success';
      default: return 'secondary';
    }
  };

  const handleStatusChange = (incidentId: string, newStatus: 'acknowledged' | 'resolved') => {
    setIncidents(prevIncidents =>
      prevIncidents.map(incident =>
        incident.id === incidentId
          ? { ...incident, status: newStatus }
          : incident
      )
    );
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else {
      return `${diffMinutes}m ago`;
    }
  };

  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-dashboard-accent" />
            Incident Feed
            <Badge variant="destructive" className="ml-2">
              {incidents.filter(i => i.status === 'open').length} Active
            </Badge>
          </CardTitle>
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredIncidents.map((incident) => (
            <div 
              key={incident.id} 
              className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-1">
                    <Badge variant={getSeverityColor(incident.severity) as any} className="w-fit">
                      {incident.severity.toUpperCase()}
                    </Badge>
                    <Badge variant={getStatusColor(incident.status) as any} className="w-fit">
                      {incident.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{incident.touristName}</h4>
                    <p className="text-sm text-muted-foreground">ID: {incident.touristId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {getRelativeTime(incident.timestamp)}
                </div>
              </div>

              <p className="text-sm text-foreground mb-3">{incident.description}</p>

              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-4 w-4 text-dashboard-accent" />
                <span className="text-sm text-muted-foreground">{incident.location.address}</span>
              </div>

              {incident.status !== 'resolved' && (
                <div className="flex gap-2">
                  {incident.status === 'open' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(incident.id, 'acknowledged')}
                      className="flex items-center gap-1"
                    >
                      <Eye className="h-3 w-3" />
                      Acknowledge
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusChange(incident.id, 'resolved')}
                    className="flex items-center gap-1"
                  >
                    <CheckCircle className="h-3 w-3" />
                    Resolve
                  </Button>
                </div>
              )}
            </div>
          ))}
          
          {filteredIncidents.length === 0 && (
            <div className="text-center py-8">
              <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No incidents found for the selected filter.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}