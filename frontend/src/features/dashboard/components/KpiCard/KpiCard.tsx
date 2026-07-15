import React from 'react';
import styles from './KpiCard.module.css';
import { type LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string | number;
    isPositive: boolean;
  };
  color?: 'primary' | 'success' | 'warning' | 'info';
}

export const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon: Icon, trend, color = 'primary' }) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        <div className={`${styles.iconWrapper} ${styles[color]}`}>
          <Icon size={20} />
        </div>
      </div>
      <div className={styles.content}>
        <span className={styles.value}>{value}</span>
        {trend && (
          <span className={`${styles.trend} ${trend.isPositive ? styles.positive : styles.negative}`}>
            {trend.isPositive ? '↑' : '↓'} {trend.value}% vs mês passado
          </span>
        )}
      </div>
    </div>
  );
};
