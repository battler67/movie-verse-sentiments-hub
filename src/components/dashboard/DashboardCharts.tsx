
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, Legend, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardChartsProps {
  stats: any;
}

export const DashboardCharts = ({ stats }: DashboardChartsProps) => {
  const ratingColors = ['#ef4444', '#f97316', '#facc15', '#84cc16', '#22c55e'];

  const getRatingDistributionData = () => {
    if (!stats?.ratingDistribution) return [];
    
    return stats.ratingDistribution.map((count: number, index: number) => ({
      name: `${index + 1} Star${index === 0 ? '' : 's'}`,
      value: count,
      color: ratingColors[index]
    }));
  };

  const getReviewsOverTimeData = () => {
    if (!stats?.reviewsByDay || stats.reviewsByDay.length === 0) {
      // Fallback if no day data
      if (!stats?.reviewsByMonth || stats.reviewsByMonth.length === 0) return [];
      
      return stats.reviewsByMonth.map((item: any) => ({
        name: item.month,
        reviews: item.count
      }));
    }
    
    // Format dates nicely for display
    return stats.reviewsByDay.map((item: any) => {
      const date = new Date(item.day);
      // Format as Apr 21 (short month name + day)
      const formattedDate = date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      
      return {
        name: formattedDate,
        fullDate: item.day, // Keep original for sorting/tooltip
        reviews: item.count
      };
    });
  };

  // Sort the data by date for the timeline chart
  const sortedTimelineData = getReviewsOverTimeData().sort((a: any, b: any) => {
    if (a.fullDate) {
      return new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime();
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="bg-movie-dark/70 border-white/10">
        <CardContent className="p-6">
          <h3 className="text-xl font-medium mb-4">Rating Distribution</h3>
          {stats?.totalReviews > 0 ? (
            <ChartContainer config={{
              rating1: { color: '#ef4444' },
              rating2: { color: '#f97316' },
              rating3: { color: '#facc15' },
              rating4: { color: '#84cc16' },
              rating5: { color: '#22c55e' },
            }}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getRatingDistributionData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
                  >
                    {getRatingDistributionData().map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-white/60">
              <p>No rating data available yet</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="bg-movie-dark/70 border-white/10">
        <CardContent className="p-6">
          <h3 className="text-xl font-medium mb-4">Reviews Over Time</h3>
          {sortedTimelineData.length > 0 ? (
            <ChartContainer config={{
              reviews: { color: '#8884d8' }
            }}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sortedTimelineData}>
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }} 
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: any) => [`${value} review${value !== 1 ? 's' : ''}`, 'Reviews']}
                    labelFormatter={(label: any) => `Date: ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="reviews" fill="#8884d8" name="Reviews" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-white/60">
              <p>No timeline data available yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
