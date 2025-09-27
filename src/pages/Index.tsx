import { DashboardHeader } from '@/components/DashboardHeader';
import { DashboardCard } from '@/components/DashboardCard';
import { TouristMap } from '@/components/TouristMap';
import { IncidentFeed } from '@/components/IncidentFeed';
import { AnalyticsCharts } from '@/components/AnalyticsCharts';
import { SearchAndFilters } from '@/components/SearchAndFilters';
import { Users, UserCheck, UserX, Globe, UserPlus, TrendingUp } from 'lucide-react';
import { mockDashboardStats } from '@/lib/mockData';

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
            <TouristMap />
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
