import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Globe, Download } from 'lucide-react';
import { mockAnalyticsData } from '@/lib/mockData';

export function AnalyticsCharts() {
  const COLORS = ['hsl(184 81% 29%)', 'hsl(207 90% 54%)', 'hsl(142 72% 29%)', 'hsl(38 92% 50%)', 'hsl(0 84% 60%)'];

  const handleExport = (type: 'csv' | 'pdf') => {
    console.log(`Exporting data as ${type.toUpperCase()}`);
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
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockAnalyticsData.dailyFlow} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
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
          </div>
        </CardContent>
      </Card>

      {/* Top Nationalities - Fixed Bar Chart */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-dashboard-accent" />
            Top 5 Nationalities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={mockAnalyticsData.topNationalities} 
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="country" 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  formatter={(value: number, name: string) => [
                    `${value} tourists`,
                    'Count'
                  ]}
                />
                <Bar 
                  dataKey="count" 
                  fill="hsl(207 90% 54%)"
                  radius={[4, 4, 0, 0]}
                  name="Tourist Count"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
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
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <Pie
                    data={mockAnalyticsData.regionDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ region, percentage }) => `${region}: ${percentage}%`}
                    outerRadius={100}
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
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground mb-4">Regional Breakdown</h3>
              {mockAnalyticsData.regionDistribution.map((region, index) => (
                <div key={region.region} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border/50 hover:bg-muted/70 transition-colors">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="font-medium text-foreground">{region.region}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-foreground">{region.count.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">{region.percentage}% of total</div>
                  </div>
                </div>
              ))}
              <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                <div className="text-sm text-primary font-medium">
                  Total: {mockAnalyticsData.regionDistribution.reduce((sum, region) => sum + region.count, 0).toLocaleString()} tourists
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}