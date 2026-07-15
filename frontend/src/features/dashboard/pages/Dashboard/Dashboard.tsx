import React from 'react';
import styles from './Dashboard.module.css';
import { KpiCard } from '../../components/KpiCard/KpiCard';
import { RevenueChart } from '../../components/Charts/RevenueChart';
import { Users, Scale, Calculator, DollarSign } from 'lucide-react';
import { Button } from '../../../../shared/components/ui/Button/Button';

export const Dashboard: React.FC = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>Visão geral do seu escritório jurídico.</p>
        </div>
        <div className={styles.actions}>
          <Button variant="primary" leftIcon={<Calculator size={18}/>}>Novo Cálculo</Button>
        </div>
      </header>

      <div className={styles.kpiGrid}>
        <KpiCard 
          title="Processos Ativos" 
          value="142" 
          icon={Scale} 
          color="primary"
          trend={{ value: 12, isPositive: true }} 
        />
        <KpiCard 
          title="Novos Clientes" 
          value="28" 
          icon={Users} 
          color="success"
          trend={{ value: 4, isPositive: true }} 
        />
        <KpiCard 
          title="Cálculos Realizados" 
          value="356" 
          icon={Calculator} 
          color="info"
          trend={{ value: 2, isPositive: false }} 
        />
        <KpiCard 
          title="Honorários Estimados" 
          value="R$ 84.5K" 
          icon={DollarSign} 
          color="warning"
          trend={{ value: 18, isPositive: true }} 
        />
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.mainChartCard}>
          <div className={styles.cardHeader}>
            <h3>Evolução de Cálculos</h3>
            <select className={styles.filterSelect}>
              <option>Últimos 7 meses</option>
              <option>Este Ano</option>
            </select>
          </div>
          <div className={styles.chartWrapper}>
            <RevenueChart />
          </div>
        </div>

        <div className={styles.sideCard}>
          <div className={styles.cardHeader}>
            <h3>Atividades Recentes</h3>
          </div>
          <div className={styles.activityList}>
            {/* Mocked activities */}
            <div className={styles.activityItem}>
              <div className={styles.activityDot} />
              <div className={styles.activityContent}>
                <p><strong>Cálculo Trabalhista</strong> atualizado por João.</p>
                <span>Há 15 min</span>
              </div>
            </div>
            <div className={styles.activityItem}>
              <div className={styles.activityDot} />
              <div className={styles.activityContent}>
                <p>Novo cliente <strong>Tech Ltda</strong> cadastrado.</p>
                <span>Há 2 horas</span>
              </div>
            </div>
            <div className={styles.activityItem}>
              <div className={styles.activityDot} />
              <div className={styles.activityContent}>
                <p>Processo <strong>00012-34</strong> arquivado.</p>
                <span>Ontem</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" className={styles.viewAllBtn}>Ver todo o histórico</Button>
        </div>
      </div>
    </div>
  );
};
