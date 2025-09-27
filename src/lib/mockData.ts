// Mock data for TOURXHUB dashboard

export interface Tourist {
  id: string;
  name: string;
  nationality: string;
  phone: string;
  blockchainId: string;
  status: 'active' | 'inactive';
  lastCheckIn: Date;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  registrationDate: Date;
}

export interface Incident {
  id: string;
  touristId: string;
  touristName: string;
  timestamp: Date;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  severity: 'low' | 'medium' | 'high';
  status: 'open' | 'acknowledged' | 'resolved';
  description: string;
}

export interface DashboardStats {
  totalTourists: number;
  activeTourists: number;
  inactiveTourists: number;
  domesticCount: number;
  internationalCount: number;
  newRegistrations: number;
}

export const mockTourists: Tourist[] = [
  {
    id: 'T001',
    name: 'John Smith',
    nationality: 'USA',
    phone: '+1-555-0123',
    blockchainId: '0x1a2b3c4d5e6f',
    status: 'active',
    lastCheckIn: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    location: {
      lat: 28.6139,
      lng: 77.2090,
      address: 'New Delhi, India'
    },
    registrationDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'T002',
    name: 'Marie Dubois',
    nationality: 'France',
    phone: '+33-1-23-45-67-89',
    blockchainId: '0x2b3c4d5e6f7a',
    status: 'active',
    lastCheckIn: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    location: {
      lat: 19.0760,
      lng: 72.8777,
      address: 'Mumbai, India'
    },
    registrationDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'T003',
    name: 'Hiroshi Tanaka',
    nationality: 'Japan',
    phone: '+81-3-1234-5678',
    blockchainId: '0x3c4d5e6f7a8b',
    status: 'inactive',
    lastCheckIn: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    location: {
      lat: 26.9124,
      lng: 75.7873,
      address: 'Jaipur, India'
    },
    registrationDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'T004',
    name: 'Sarah Johnson',
    nationality: 'Canada',
    phone: '+1-416-555-0198',
    blockchainId: '0x4d5e6f7a8b9c',
    status: 'active',
    lastCheckIn: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    location: {
      lat: 12.9716,
      lng: 77.5946,
      address: 'Bangalore, India'
    },
    registrationDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'T005',
    name: 'Raj Patel',
    nationality: 'India',
    phone: '+91-98765-43210',
    blockchainId: '0x5e6f7a8b9c0d',
    status: 'active',
    lastCheckIn: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    location: {
      lat: 22.5726,
      lng: 88.3639,
      address: 'Kolkata, India'
    },
    registrationDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  }
];

export const mockIncidents: Incident[] = [
  {
    id: 'INC001',
    touristId: 'T001',
    touristName: 'John Smith',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    location: {
      lat: 28.6139,
      lng: 77.2090,
      address: 'New Delhi, India'
    },
    severity: 'high',
    status: 'open',
    description: 'Emergency SOS activated - Medical assistance required'
  },
  {
    id: 'INC002',
    touristId: 'T002',
    touristName: 'Marie Dubois',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    location: {
      lat: 19.0760,
      lng: 72.8777,
      address: 'Mumbai, India'
    },
    severity: 'medium',
    status: 'acknowledged',
    description: 'Lost belongings reported'
  },
  {
    id: 'INC003',
    touristId: 'T004',
    touristName: 'Sarah Johnson',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    location: {
      lat: 12.9716,
      lng: 77.5946,
      address: 'Bangalore, India'
    },
    severity: 'low',
    status: 'resolved',
    description: 'Minor transportation delay'
  }
];

export const mockDashboardStats: DashboardStats = {
  totalTourists: 1247,
  activeTourists: 892,
  inactiveTourists: 355,
  domesticCount: 423,
  internationalCount: 824,
  newRegistrations: 47
};

export const mockAnalyticsData = {
  dailyFlow: [
    { date: '2024-09-20', tourists: 45 },
    { date: '2024-09-21', tourists: 52 },
    { date: '2024-09-22', tourists: 38 },
    { date: '2024-09-23', tourists: 67 },
    { date: '2024-09-24', tourists: 71 },
    { date: '2024-09-25', tourists: 59 },
    { date: '2024-09-26', tourists: 83 },
    { date: '2024-09-27', tourists: 47 }
  ],
  topNationalities: [
    { country: 'USA', count: 245 },
    { country: 'France', count: 189 },
    { country: 'Japan', count: 156 },
    { country: 'Germany', count: 134 },
    { country: 'Canada', count: 100 }
  ],
  regionDistribution: [
    { region: 'North India', count: 487, percentage: 39 },
    { region: 'West India', count: 312, percentage: 25 },
    { region: 'South India', count: 298, percentage: 24 },
    { region: 'East India', count: 150, percentage: 12 }
  ]
};