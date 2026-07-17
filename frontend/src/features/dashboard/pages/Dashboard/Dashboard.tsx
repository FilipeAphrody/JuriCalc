import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';
import { KpiCard } from '../../components/KpiCard/KpiCard';
import { RevenueChart } from '../../components/Charts/RevenueChart';
import { Users, Scale, Calculator, DollarSign } from 'lucide-react';
import { Button } from '../../../../shared/components/ui/Button/Button';
import { api } from '../../../../shared/api/axios';

export const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState({
    active_clients: 0,
    active_lawsuits: 0,
    total_calculations: 0,
    estimated_fees: 'R$ 0,00',
    recent_activities: 0,
    chart_data: []
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get('/dashboard/summary/');
        setSummary(res.data);
      } catch (err) {
        console.error('Erro ao carregar summary do dashboard', err);
      }
    };
    fetchSummary();
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>Visão geral do seu escritório jurídico.</p>
        </div>
        <div className={styles.actions}>
          <Button 
            variant="primary" 
            leftIcon={<Calculator size={18}/>}
            onClick={() => navigate('/calculations')}
          >
            Novo Cálculo
          </Button>
        </div>
      </header>

      <div className={styles.kpiGrid}>
        <KpiCard 
          title="Processos Ativos" 
          value={String(summary.active_lawsuits)} 
          icon={Scale} 
          color="primary"
          trend={{ value: 0, isPositive: true }} 
        />
        <KpiCard 
          title="Clientes" 
          value={String(summary.active_clients)} 
          icon={Users} 
          color="success"
          trend={{ value: 0, isPositive: true }} 
        />
        <KpiCard 
          title="Cálculos Realizados" 
          value={String(summary.total_calculations)} 
          icon={Calculator} 
          color="info"
          trend={{ value: 0, isPositive: true }} 
        />
        <KpiCard 
          title="Honorários Estimados" 
          value={summary.estimated_fees} 
          icon={DollarSign} 
          color="warning"
          trend={{ value: 0, isPositive: true }} 
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
            {summary.chart_data.length > 0 ? (
              <RevenueChart data={summary.chart_data} />
            ) : (
              <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--color-text-tertiary)'}}>
                Carregando dados...
              </div>
            )}
          </div>
        </div>

        <div className={styles.sideCard}>
          <div className={styles.cardHeader}>
            <h3>Atividades Recentes</h3>
          </div>
          <div className={styles.activityList}>
            <div className={styles.emptyState}>
              <p>Nenhuma atividade recente registrada.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
