import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', calculos: 40 },
  { name: 'Fev', calculos: 30 },
  { name: 'Mar', calculos: 20 },
  { name: 'Abr', calculos: 27 },
  { name: 'Mai', calculos: 18 },
  { name: 'Jun', calculos: 23 },
  { name: 'Jul', calculos: 34 },
];

export const RevenueChart: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorCalculos" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-tertiary)', fontSize: 12 }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-tertiary)', fontSize: 12 }} />
          <RechartsTooltip 
            contentStyle={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border)', borderRadius: '8px', color: 'var(--color-text-primary)' }}
            itemStyle={{ color: 'var(--color-primary)' }}
          />
          <Area type="monotone" dataKey="calculos" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorCalculos)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
