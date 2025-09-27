import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Globe, Download } from 'lucide-react';
import { mockAnalyticsData } from '@/lib/mockData';

export function AnalyticsCharts() {
  const COLORS = ['hsl(184 81% 29%)', 'hsl(207 90% 54%)', 'hsl(142 72% 29%)', 'hsl(38 92% 50%)', 'hsl(0 84% 60%)'];

  const handleExport = (type: 'csv' | 'pdf') => {
    // Mock export functionality
    console.log(`Exporting data as ${type.toUpperCase()}`);
    // In a real app, this would trigger actual file download
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Daily Tourist Flow */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-dashboard-accent" />
            Daily Tourist Flow (Last 30 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockAnalyticsData.dailyFlow}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="tourists" 
                stroke="hsl(184 81% 29%)" 
                strokeWidth={3}
                dot={{ fill: 'hsl(184 81% 29%)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'hsl(184 81% 29%)', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Nationalities */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-dashboard-accent" />
            Top 5 Nationalities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockAnalyticsData.topNationalities} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="country" type="category" tick={{ fontSize: 12 }} width={60} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar 
                dataKey="count" 
                fill="hsl(207 90% 54%)"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Regional Distribution */}
      <Card className="bg-gradient-card shadow-card lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-dashboard-accent" />
              Tourist Distribution by Region
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleExport('csv')}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                CSV
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleExport('pdf')}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockAnalyticsData.regionDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ region, percentage }) => `${region}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {mockAnalyticsData.regionDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="space-y-4">
              {mockAnalyticsData.regionDistribution.map((region, index) => (
                <div key={region.region} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="font-medium">{region.region}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{region.count.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">{region.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}