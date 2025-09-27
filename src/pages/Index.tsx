import { DashboardHeader } from '@/components/DashboardHeader';
import { DashboardCard } from '@/components/DashboardCard';
import { TouristMap } from '@/components/TouristMap';
import { IncidentFeed } from '@/components/IncidentFeed';
import { AnalyticsCharts } from '@/components/AnalyticsCharts';
import { SearchAndFilters } from '@/components/SearchAndFilters';
import { Users, UserCheck, UserX, Globe, UserPlus, TrendingUp, AlertTriangle } from 'lucide-react';
import { mockDashboardStats, mockTourists, mockIncidents } from '@/lib/mockData';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-dashboard">
      <DashboardHeader />
      
      <main className="container mx-auto px-6 py-6 space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <DashboardCard
            title="Total Tourists"
            value={mockDashboardStats.totalTourists}
            change="+12% from last month"
            changeType="positive"
            icon={<Users />}
            className="lg:col-span-1"
          />
          <DashboardCard
            title="Active Tourists"
            value={mockDashboardStats.activeTourists}
            change="Last 24h activity"
            changeType="neutral"
            icon={<UserCheck />}
            className="lg:col-span-1"
          />
          <DashboardCard
            title="Inactive Tourists"
            value={mockDashboardStats.inactiveTourists}
            change=">72h no check-in"
            changeType="negative"
            icon={<UserX />}
            className="lg:col-span-1"
          />
          <DashboardCard
            title="International"
            value={mockDashboardStats.internationalCount}
            change={`${Math.round((mockDashboardStats.internationalCount / mockDashboardStats.totalTourists) * 100)}% of total`}
            changeType="neutral"
            icon={<Globe />}
            className="lg:col-span-1"
          />
          <DashboardCard
            title="Domestic"
            value={mockDashboardStats.domesticCount}
            change={`${Math.round((mockDashboardStats.domesticCount / mockDashboardStats.totalTourists) * 100)}% of total`}
            changeType="neutral"
            icon={<Users />}
            className="lg:col-span-1"
          />
          <DashboardCard
            title="New Registrations"
            value={mockDashboardStats.newRegistrations}
            change="Last 7 days"
            changeType="positive"
            icon={<UserPlus />}
            className="lg:col-span-1"
          />
        </div>

        {/* Search and Filters */}
        <SearchAndFilters />

        {/* Map and Incident Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Tourist Distribution Map</h3>
              <div className="w-full h-96 bg-gray-100 rounded-lg relative overflow-hidden">
                <img 
                  src="/src/map.png" 
                  alt="Tourist Map" 
                  className="w-full h-full object-cover"
                />
                
                {/* Tourist markers overlay */}
                {mockTourists.map((tourist, index) => {
                  const positions = [
                    { left: '25%', top: '30%' }, // Delhi
                    { left: '15%', top: '60%' }, // Mumbai  
                    { left: '40%', top: '50%' }, // Jaipur
                    { left: '20%', top: '75%' }, // Bangalore
                    { left: '45%', top: '70%' }  // Kolkata
                  ];
                  const pos = positions[index] || { left: '30%', top: '50%' };
                  
                  return (
                    <div
                      key={tourist.id}
                      className={`absolute w-4 h-4 rounded-full cursor-pointer transition-all duration-300 hover:scale-150 hover:z-20 shadow-lg border-2 border-white ${
                        tourist.status === 'active' 
                          ? 'bg-emerald-500 hover:bg-emerald-600' 
                          : 'bg-red-500 hover:bg-red-600'
                      }`}
                      style={{
                        left: pos.left,
                        top: pos.top,
                      }}
                      title={`${tourist.name} - ${tourist.location.address}`}
                    >
                      {/* Pulse animation for active tourists */}
                      {tourist.status === 'active' && (
                        <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75"></div>
                      )}
                    </div>
                  );
                })}
                
                {/* Incident markers overlay */}
                {mockIncidents.map((incident, index) => {
                  const positions = [
                    { left: '30%', top: '35%' },
                    { left: '20%', top: '65%' },
                    { left: '25%', top: '80%' }
                  ];
                  const pos = positions[index] || { left: '35%', top: '55%' };
                  
                  return (
                    <div
                      key={incident.id}
                      className="absolute w-5 h-5 cursor-pointer hover:scale-125 transition-all duration-300 hover:z-20"
                      style={{
                        left: pos.left,
                        top: pos.top,
                      }}
                      title={`Incident: ${incident.description}`}
                    >
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shadow-lg border-2 border-white ${
                        incident.severity === 'high' ? 'bg-red-500' :
                        incident.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}>
                        <AlertTriangle className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <IncidentFeed />
          </div>
        </div>

        {/* Analytics Charts */}
        <AnalyticsCharts />
      </main>
    </div>
  );
};

export default Index;
