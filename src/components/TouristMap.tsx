import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin, Users, AlertTriangle, RefreshCw } from 'lucide-react';
import { mockTourists, mockIncidents, Tourist, Incident } from '@/lib/mockData';

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

interface TouristMapProps {
  selectedRegion?: string;
  onRegionSelect?: (region: string) => void;
}

export function TouristMap({ selectedRegion, onRegionSelect }: TouristMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [selectedTourists, setSelectedTourists] = useState<Tourist[]>([]);
  const [showTouristList, setShowTouristList] = useState(false);

  // Interactive Pune map with tourist markers
  const renderPuneMap = () => {
    return (
      <div className="w-full h-96 bg-white rounded-xl relative overflow-hidden border border-slate-200 shadow-lg">
        {/* Modern header */}
        <div className="absolute top-3 left-3 z-20 bg-white/95 backdrop-blur-md px-3 py-2 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-slate-700">Pune Tourist Tracking</span>
          </div>
        </div>
        
        {/* Pune map image with overlay markers */}
        <div className="relative w-full h-full">
          {/* Pune map background */}
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('data:image/svg+xml;base64,${btoa(`
                <svg width="100%" height="100%" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
                  <!-- Pune city background -->
                  <rect width="100%" height="100%" fill="#f8fafc"/>
                  
                  <!-- Main roads -->
                  <path d="M 100 200 L 700 200" stroke="#3b82f6" stroke-width="4" fill="none"/>
                  <path d="M 100 300 L 700 300" stroke="#3b82f6" stroke-width="4" fill="none"/>
                  <path d="M 200 100 L 200 500" stroke="#3b82f6" stroke-width="4" fill="none"/>
                  <path d="M 400 100 L 400 500" stroke="#3b82f6" stroke-width="4" fill="none"/>
                  <path d="M 600 100 L 600 500" stroke="#3b82f6" stroke-width="4" fill="none"/>
                  
                  <!-- Secondary roads -->
                  <path d="M 150 150 L 650 150" stroke="#64748b" stroke-width="2" fill="none"/>
                  <path d="M 150 250 L 650 250" stroke="#64748b" stroke-width="2" fill="none"/>
                  <path d="M 150 350 L 650 350" stroke="#64748b" stroke-width="2" fill="none"/>
                  <path d="M 150 450 L 650 450" stroke="#64748b" stroke-width="2" fill="none"/>
                  
                  <!-- Parks and green areas -->
                  <rect x="250" y="120" width="100" height="60" fill="#10b981" opacity="0.3" rx="10"/>
                  <rect x="450" y="220" width="80" height="50" fill="#10b981" opacity="0.3" rx="10"/>
                  <rect x="350" y="320" width="120" height="80" fill="#10b981" opacity="0.3" rx="10"/>
                  
                  <!-- Water body -->
                  <path d="M 50 100 Q 200 150 350 120 Q 500 100 650 130 Q 750 150 750 200" stroke="#0ea5e9" stroke-width="8" fill="#0ea5e9" opacity="0.4"/>
                  
                  <!-- City center -->
                  <circle cx="400" cy="300" r="8" fill="#ef4444"/>
                  
                  <!-- Landmarks */}
                  <text x="200" y="180" font-family="Arial" font-size="12" fill="#374151">Shaniwar Wada</text>
                  <text x="500" y="180" font-family="Arial" font-size="12" fill="#374151">Aga Khan Palace</text>
                  <text x="300" y="280" font-family="Arial" font-size="12" fill="#374151">Koregaon Park</text>
                  <text x="500" y="380" font-family="Arial" font-size="12" fill="#374151">Magarpatta City</text>
                  
                  <!-- City name -->
                  <text x="400" y="50" font-family="Arial" font-size="24" font-weight="bold" fill="#1f2937" text-anchor="middle">Pune (पुणे)</text>
                </svg>
              `)}')`
            }}
          />
          
          {/* Tourist markers positioned on Pune map */}
          {mockTourists.map((tourist, index) => {
            // Pune-specific positions based on actual locations
            const punePositions = [
              { left: '25%', top: '35%' }, // Koregaon Park area
              { left: '60%', top: '30%' }, // Aga Khan Palace area
              { left: '20%', top: '50%' }, // Shaniwar Wada area
              { left: '70%', top: '60%' }, // Magarpatta City area
              { left: '45%', top: '45%' }  // Central Pune
            ];
            const pos = punePositions[index] || { left: '50%', top: '50%' };
            
            return (
              <div
                key={tourist.id}
                className={`absolute w-6 h-6 rounded-full cursor-pointer transition-all duration-300 hover:scale-150 hover:z-20 shadow-lg border-3 border-white ${
                  tourist.status === 'active' 
                    ? 'bg-emerald-500 hover:bg-emerald-600' 
                    : 'bg-red-500 hover:bg-red-600'
                }`}
                style={{
                  left: pos.left,
                  top: pos.top,
                }}
                title={`${tourist.name} - ${tourist.location.address}`}
                onClick={() => {
                  setSelectedTourists([tourist]);
                  setShowTouristList(true);
                }}
              >
                {/* Pulse animation for active tourists */}
                {tourist.status === 'active' && (
                  <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75"></div>
                )}
              </div>
            );
          })}
          
          {/* Incident markers positioned on Pune map */}
          {mockIncidents.map((incident, index) => {
            const puneIncidentPositions = [
              { left: '30%', top: '40%' },
              { left: '55%', top: '35%' },
              { left: '65%', top: '55%' }
            ];
            const pos = puneIncidentPositions[index] || { left: '50%', top: '50%' };
            
            return (
              <div
                key={incident.id}
                className="absolute w-7 h-7 cursor-pointer hover:scale-125 transition-all duration-300 hover:z-20"
                style={{
                  left: pos.left,
                  top: pos.top,
                }}
                title={`Incident: ${incident.description}`}
                onClick={() => {
                  setSelectedTourists(mockTourists.filter(t => t.id === incident.touristId));
                  setShowTouristList(true);
                }}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shadow-lg border-3 border-white ${
                  incident.severity === 'high' ? 'bg-red-500' :
                  incident.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`}>
                  <AlertTriangle className="w-4 h-4 text-white" />
                </div>
              </div>
            );
          })}
          
          {/* Activity zones for Pune areas */}
          <div className="absolute inset-0 opacity-20">
            {/* Koregaon Park area */}
            <div className="absolute top-1/3 left-1/4 w-24 h-16 bg-blue-400 rounded-xl border-2 border-blue-500 animate-pulse shadow-lg"></div>
            {/* Aga Khan Palace area */}
            <div className="absolute top-1/4 left-1/2 w-20 h-12 bg-emerald-400 rounded-xl border-2 border-emerald-500 animate-pulse delay-500 shadow-lg"></div>
            {/* Magarpatta City area */}
            <div className="absolute bottom-1/3 left-2/3 w-22 h-14 bg-amber-400 rounded-xl border-2 border-amber-500 animate-pulse delay-1000 shadow-lg"></div>
          </div>
        </div>
        
        {/* Status indicator */}
        <div className="absolute bottom-3 right-3 z-20 bg-white/95 backdrop-blur-md px-3 py-2 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>{mockTourists.filter(t => t.status === 'active').length} Active</span>
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>{mockTourists.filter(t => t.status === 'inactive').length} Inactive</span>
          </div>
        </div>
      </div>
    );
  };

  // No Google Maps loading needed - using static Pune map

  // Google Maps functions removed - using static Pune map

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#22c55e';
      default: return '#6b7280';
    }
  };

  const retryMapLoad = () => {
    setMapError(null);
    setIsLoaded(false);
    setMap(null);
    // Trigger reload
    window.location.reload();
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-dashboard-accent" />
            Tourist Distribution Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Pune Tourist Map */}
            <div className="space-y-4">
              <Alert className="border-emerald-200 bg-emerald-50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <AlertDescription className="flex items-center justify-between">
                    <span className="text-emerald-800 font-medium">Pune Tourist Tracking Map</span>
                    <span className="text-xs text-emerald-600">Real-time monitoring</span>
                  </AlertDescription>
                </div>
              </Alert>
              {renderPuneMap()}
            </div>
            
            {/* Pune map is now the primary map */}
          </div>
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success"></div>
              <span className="text-sm">Active Tourists</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive"></div>
              <span className="text-sm">Inactive Tourists</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-3 h-3 text-warning" />
              <span className="text-sm">Incidents</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {showTouristList && selectedTourists.length > 0 && (
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Users className="h-5 w-5 text-dashboard-accent" />
                Selected Area Details
              </span>
              <button 
                onClick={() => setShowTouristList(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedTourists.map((tourist) => (
                <div key={tourist.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <h4 className="font-medium">{tourist.name}</h4>
                    <p className="text-sm text-muted-foreground">{tourist.nationality} • {tourist.location.address}</p>
                    <p className="text-xs text-muted-foreground">Last check-in: {tourist.lastCheckIn.toLocaleString()}</p>
                  </div>
                  <Badge variant={tourist.status === 'active' ? 'default' : 'destructive'}>
                    {tourist.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}