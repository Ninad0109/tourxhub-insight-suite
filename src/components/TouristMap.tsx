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

  // Simple fallback map using a canvas-like approach
  const renderFallbackMap = () => {
    return (
      <div className="w-full h-96 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg relative overflow-hidden">
        {/* India outline simulation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-64 h-80 bg-primary/10 rounded-lg border-2 border-primary/20">
            <div className="absolute top-4 left-4 text-xs text-primary font-medium">INDIA</div>
            
            {/* Tourist markers */}
            {mockTourists.map((tourist, index) => (
              <div
                key={tourist.id}
                className={`absolute w-3 h-3 rounded-full cursor-pointer transition-all hover:scale-150 ${
                  tourist.status === 'active' ? 'bg-success' : 'bg-destructive'
                }`}
                style={{
                  left: `${20 + (index * 15) % 60}%`,
                  top: `${20 + (index * 20) % 50}%`,
                }}
                title={`${tourist.name} - ${tourist.location.address}`}
                onClick={() => {
                  setSelectedTourists([tourist]);
                  setShowTouristList(true);
                }}
              />
            ))}
            
            {/* Incident markers */}
            {mockIncidents.map((incident, index) => (
              <div
                key={incident.id}
                className="absolute w-4 h-4 cursor-pointer"
                style={{
                  left: `${30 + (index * 20) % 40}%`,
                  top: `${30 + (index * 15) % 40}%`,
                }}
                title={`Incident: ${incident.description}`}
              >
                <AlertTriangle 
                  className={`w-4 h-4 ${
                    incident.severity === 'high' ? 'text-destructive' :
                    incident.severity === 'medium' ? 'text-warning' : 'text-success'
                  }`}
                />
              </div>
            ))}
            
            {/* Heatmap simulation */}
            <div className="absolute inset-4 opacity-30">
              <div className="w-8 h-8 bg-primary rounded-full absolute top-1/4 left-1/4 blur-sm"></div>
              <div className="w-6 h-6 bg-accent rounded-full absolute top-1/2 left-1/2 blur-sm"></div>
              <div className="w-10 h-10 bg-primary rounded-full absolute bottom-1/4 right-1/4 blur-sm"></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const loadGoogleMaps = () => {
      // Check if Google Maps is already loaded
      if (window.google && window.google.maps) {
        setIsLoaded(true);
        return;
      }

      // Create script element
      const script = document.createElement('script');
      const apiKey = 'AIzaSyAECt2XvC04i7IDJMybN7OtKllUjhxHYa4';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=visualization&callback=initMap`;
      script.async = true;
      script.defer = true;

      // Set up callback
      window.initMap = () => {
        setIsLoaded(true);
        setMapError(null);
      };

      // Handle script load error
      script.onerror = () => {
        setMapError('Failed to load Google Maps. Please check your API key and network connection.');
        setIsLoaded(false);
      };

      // Handle script load timeout
      const timeout = setTimeout(() => {
        if (!window.google || !window.google.maps) {
          setMapError('Google Maps loading timeout. Using fallback map.');
          setIsLoaded(false);
        }
      }, 10000);

      script.onload = () => {
        clearTimeout(timeout);
      };

      document.head.appendChild(script);

      return () => {
        clearTimeout(timeout);
        // Cleanup
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    };

    loadGoogleMaps();
  }, []);

  useEffect(() => {
    if (isLoaded && mapRef.current && !map && window.google) {
      try {
        initializeMap();
      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError('Failed to initialize map. Using fallback visualization.');
      }
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

    // Add heatmap if visualization library is available
    if (window.google.maps.visualization) {
      const heatmapData = mockTourists.map(tourist => 
        new window.google.maps.LatLng(tourist.location.lat, tourist.location.lng)
      );

      const heatmap = new window.google.maps.visualization.HeatmapLayer({
        data: heatmapData,
        opacity: 0.6,
        radius: 50
      });

      heatmap.setMap(mapInstance);
    }
  };

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
            {mapError ? (
              <div className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="flex items-center justify-between">
                    <span>{mapError}</span>
                    <button 
                      onClick={retryMapLoad}
                      className="ml-2 flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Retry
                    </button>
                  </AlertDescription>
                </Alert>
                {renderFallbackMap()}
              </div>
            ) : (
              <>
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
              </>
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