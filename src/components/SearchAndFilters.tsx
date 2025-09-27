import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, Users, MapPin, Calendar } from 'lucide-react';
import { mockTourists, Tourist } from '@/lib/mockData';

interface SearchAndFiltersProps {
  onFiltersChange?: (filters: FilterState) => void;
  onSearchResults?: (results: Tourist[]) => void;
}

interface FilterState {
  searchQuery: string;
  nationality: string;
  status: string;
  dateRange: string;
}

export function SearchAndFilters({ onFiltersChange, onSearchResults }: SearchAndFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    nationality: 'all',
    status: 'all',
    dateRange: 'all'
  });
  
  const [searchResults, setSearchResults] = useState<Tourist[]>([]);
  const [showResults, setShowResults] = useState(false);

  const nationalities = ['all', ...Array.from(new Set(mockTourists.map(t => t.nationality)))];

  const handleSearch = () => {
    let results = mockTourists;

    // Apply search query
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      results = results.filter(tourist =>
        tourist.name.toLowerCase().includes(query) ||
        tourist.phone.includes(query) ||
        tourist.blockchainId.toLowerCase().includes(query) ||
        tourist.nationality.toLowerCase().includes(query)
      );
    }

    // Apply nationality filter
    if (filters.nationality !== 'all') {
      results = results.filter(tourist => tourist.nationality === filters.nationality);
    }

    // Apply status filter
    if (filters.status !== 'all') {
      results = results.filter(tourist => tourist.status === filters.status);
    }

    // Apply date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      let cutoffDate = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          cutoffDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      results = results.filter(tourist => tourist.lastCheckIn >= cutoffDate);
    }

    setSearchResults(results);
    setShowResults(true);
    onSearchResults?.(results);
    onFiltersChange?.(filters);
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      searchQuery: '',
      nationality: 'all',
      status: 'all',
      dateRange: 'all'
    };
    setFilters(clearedFilters);
    setSearchResults([]);
    setShowResults(false);
    onFiltersChange?.(clearedFilters);
    onSearchResults?.([]);
  };

  const hasActiveFilters = filters.searchQuery || 
    filters.nationality !== 'all' || 
    filters.status !== 'all' || 
    filters.dateRange !== 'all';

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-dashboard-accent" />
            Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search Input */}
            <div className="lg:col-span-2">
              <Input
                placeholder="Search by name, phone, blockchain ID..."
                value={filters.searchQuery}
                onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                className="w-full"
              />
            </div>

            {/* Nationality Filter */}
            <Select value={filters.nationality} onValueChange={(value) => handleFilterChange('nationality', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Nationality" />
              </SelectTrigger>
              <SelectContent>
                {nationalities.map((nationality) => (
                  <SelectItem key={nationality} value={nationality}>
                    {nationality === 'all' ? 'All Nationalities' : nationality}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Range Filter */}
            <Select value={filters.dateRange} onValueChange={(value) => handleFilterChange('dateRange', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <Button onClick={handleSearch} className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search
            </Button>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
            )}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 ml-4">
                {filters.searchQuery && (
                  <Badge variant="secondary">Search: {filters.searchQuery}</Badge>
                )}
                {filters.nationality !== 'all' && (
                  <Badge variant="secondary">Country: {filters.nationality}</Badge>
                )}
                {filters.status !== 'all' && (
                  <Badge variant="secondary">Status: {filters.status}</Badge>
                )}
                {filters.dateRange !== 'all' && (
                  <Badge variant="secondary">Date: {filters.dateRange}</Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {showResults && (
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-dashboard-accent" />
                Search Results ({searchResults.length} found)
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowResults(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {searchResults.map((tourist) => (
                <div key={tourist.id} className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${tourist.status === 'active' ? 'bg-success' : 'bg-destructive'}`} />
                    <div>
                      <h4 className="font-medium">{tourist.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{tourist.nationality}</span>
                        <span>{tourist.phone}</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {tourist.location.address}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={tourist.status === 'active' ? 'default' : 'destructive'}>
                      {tourist.status}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <Calendar className="h-3 w-3" />
                      {tourist.lastCheckIn.toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
              
              {searchResults.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No tourists found matching your criteria.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}