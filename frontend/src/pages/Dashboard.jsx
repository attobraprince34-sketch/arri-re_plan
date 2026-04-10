import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ImagePlus, Images, Activity } from 'lucide-react'

import api from '../services/axios'

// Mock card UI component since we don't have full shadcn library generated
const StatCard = ({ title, value, icon: Icon, description }) => (
  <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm">
    <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
      <h3 className="tracking-tight text-sm font-medium">{title}</h3>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </div>
    <div className="p-6 pt-0">
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  </div>
)

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 })
  const [chartData, setChartData] = useState([])
  
  useEffect(() => {
    // We fetch history to derive basic stats
    const fetchStats = async () => {
      try {
        const response = await api.get('/images/')
        const results = response.data.results || response.data
        
        let completed = 0;
        let pending = 0;
        
        // Group by date for chart
        const dateMap = {};

        results.forEach(item => {
          if (item.status === 'COMPLETED') completed++;
          if (item.status === 'PENDING' || item.status === 'PROCESSING') pending++;
          
          const dateStr = new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          dateMap[dateStr] = (dateMap[dateStr] || 0) + 1;
        });

        // Format for recharts
        const data = Object.keys(dateMap).map(k => ({ name: k, processed: dateMap[k] })).reverse();
        
        setStats({ total: results.length, completed, pending })
        setChartData(data.length > 0 ? data : [
          { name: 'Mon', processed: 0 }, { name: 'Tue', processed: 0 }, { name: 'Wed', processed: 0 }
        ])
      } catch (err) {
        console.error("Failed to load dashboard stats", err)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground">Welcome to your dashboard. Here's a summary of your activity.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard 
          title="Total Images Processed" 
          value={stats.completed} 
          icon={Images} 
          description="Total successful background removals" 
        />
        <StatCard 
          title="In Queue" 
          value={stats.pending} 
          icon={Activity} 
          description="Tasks currently processing" 
        />
        <StatCard 
          title="Credits Remaining" 
          value="Unlimited" 
          icon={ImagePlus} 
          description="Free tier plan" 
        />
      </div>

      <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="font-semibold leading-none tracking-tight">Processing History</h3>
          <p className="text-sm text-muted-foreground">Total images processed over time</p>
        </div>
        <div className="p-6 pt-0">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorProcessed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: 'hsl(var(--primary))', fontWeight: 600 }}
                  cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area type="monotone" dataKey="processed" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorProcessed)" activeDot={{ r: 6, strokeWidth: 0, fill: 'hsl(var(--primary))' }} animationDuration={1500} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
