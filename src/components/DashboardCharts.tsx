"use client";

import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export function DashboardStaggerWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.1 } },
        hidden: {}
      }}
    >
      {children}
    </motion.div>
  );
}

export function FadeInCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FinancialExpenseChart({ maintenance, expenses }: { maintenance: number, expenses: number }) {
  const data = [
    { name: 'Mon', maint: maintenance * 0.1, exp: expenses * 0.2 },
    { name: 'Tue', maint: maintenance * 0.2, exp: expenses * 0.1 },
    { name: 'Wed', maint: maintenance * 0.15, exp: expenses * 0.3 },
    { name: 'Thu', maint: maintenance * 0.3, exp: expenses * 0.1 },
    { name: 'Fri', maint: maintenance * 0.1, exp: expenses * 0.15 },
    { name: 'Sat', maint: maintenance * 0.05, exp: expenses * 0.05 },
    { name: 'Sun', maint: maintenance * 0.1, exp: expenses * 0.1 },
  ];

  return (
    <div className="h-72 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorMaint" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#5B5FEF" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#5B5FEF" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3DD68C" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3DD68C" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            itemStyle={{ color: 'hsl(var(--foreground))' }}
          />
          <Area type="monotone" dataKey="maint" name="Maintenance" stroke="#5B5FEF" strokeWidth={3} fillOpacity={1} fill="url(#colorMaint)" />
          <Area type="monotone" dataKey="exp" name="Expenses" stroke="#3DD68C" strokeWidth={3} fillOpacity={1} fill="url(#colorExp)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function FleetUtilizationChart({ active, total }: { active: number, total: number }) {
  const inactive = total - active;
  const data = [
    { name: 'Active', value: active, fill: '#3DD68C' },
    { name: 'Inactive/Maintenance', value: inactive, fill: '#F04949' },
  ];

  return (
    <div className="h-64 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
          <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip 
            cursor={{ fill: 'hsl(var(--muted))' }}
            contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
