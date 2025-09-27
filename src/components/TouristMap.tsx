import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, AlertTriangle } from 'lucide-react';
import { mockTourists, mockIncidents, Tourist, Incident } from '@/lib/mockData';

interface TouristMapProps {
  selectedRegion?: string;
  onRegionSelect?: (region: string) => void;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export function TouristMap({ selectedRegion, onRegionSelect }: TouristMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedTourists, setSelectedTourists] = useState<Tourist[]>([]);
  const [showTouristList, setShowTouristList] = useState(false);

  useEffect(() => {
    // Load Google Maps script
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAECt2XvC04i7IDJMybN7OtKllUjhxHYa4&libraries=visualization`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsLoaded(true);
      };
      document.head.appendChild(script);
    } else {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && mapRef.current && !map) {
      initializeMap();
    }
  }, [isLoaded, map]);

  const initializeMap = () => {
    if (!window.google || !mapRef.current) return;

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: { lat: 20.5937, lng: 78.9629 }, // Center of India
      zoom: 5,
      styles: [
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#e9e9e9' }, { lightness: 17 }]
        },
        {
          featureType: 'landscape',
          elementType: 'geometry',
          stylers: [{ color: '#f5f5f5' }, { lightness: 20 }]
        }
      ]
    });

    setMap(mapInstance);

    // Add tourist markers
    mockTourists.forEach((tourist) => {
      const marker = new window.google.maps.Marker({
        position: { lat: tourist.location.lat, lng: tourist.location.lng },
        map: mapInstance,
        title: tourist.name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: tourist.status === 'active' ? '#16a34a' : '#ef4444',
          fillOpacity: 0.8,
          strokeColor: '#ffffff',
          strokeWeight: 2
        }
      });

      marker.addListener('click', () => {
        setSelectedTourists([tourist]);
        setShowTouristList(true);
      });
    });

    // Add incident markers
    mockIncidents.forEach((incident) => {
      const marker = new window.google.maps.Marker({
        position: { lat: incident.location.lat, lng: incident.location.lng },
        map: mapInstance,
        title: `Incident: ${incident.description}`,
        icon: {
          path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          scale: 6,
          fillColor: getSeverityColor(incident.severity),
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2
        }
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <h3 class="font-semibold">${incident.touristName}</h3>
            <p class="text-sm">${incident.description}</p>
            <span class="text-xs text-gray-500">${incident.timestamp.toLocaleString()}</span>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(mapInstance, marker);
      });
    });

    // Add heatmap
    const heatmapData = mockTourists.map(tourist => 
      new window.google.maps.LatLng(tourist.location.lat, tourist.location.lng)
    );

    const heatmap = new window.google.maps.visualization.HeatmapLayer({
      data: heatmapData,
      opacity: 0.6,
      radius: 50
    });

    heatmap.setMap(mapInstance);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#22c55e';
      default: return '#6b7280';
    }
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
            <div 
              ref={mapRef} 
              className="w-full h-96 rounded-lg bg-muted"
            />
            {!isLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-lg">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dashboard-accent mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Loading map...</p>
                </div>
              </div>
            )}
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