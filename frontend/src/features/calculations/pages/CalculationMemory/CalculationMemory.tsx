import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styles from './CalculationMemory.module.css';
import { Button } from '../../../../shared/components/ui/Button/Button';
import { Download, ArrowLeft, Printer, Share2 } from 'lucide-react';

export const CalculationMemory: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const result = location.state?.result;

  if (!result) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.titleGroup}>
            <button className={styles.backBtn} onClick={() => navigate('/dashboard')}>
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className={styles.title}>Cálculo não encontrado</h1>
            </div>
          </div>
        </header>
        <p>Dados do cálculo não estão disponíveis na sessão. Por favor, gere um novo cálculo.</p>
      </div>
    );
  }

  const evolution = result.evolution || [];
  const summary = result.summary || {};

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <button className={styles.backBtn} onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className={styles.title}>Memória de Cálculo #{id || '9482'}</h1>
            <p className={styles.subtitle}>Gerado a partir do Assistente</p>
          </div>
        </div>
        <div className={styles.actions}>
          <Button variant="outline" leftIcon={<Share2 size={18} />}>Compartilhar</Button>
          <Button variant="outline" leftIcon={<Printer size={18} />} onClick={() => window.print()}>Imprimir</Button>
          <Button variant="primary" leftIcon={<Download size={18} />}>Exportar PDF</Button>
        </div>
      </header>

      <div className={styles.summaryCards}>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Valor Principal</span>
          <strong className={styles.summaryValue}>R$ {summary.principal?.toFixed(2)}</strong>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Juros Acumulados</span>
          <strong className={styles.summaryValue}>R$ {summary.interest_amount?.toFixed(2)}</strong>
        </div>
        {summary.fees_amount !== undefined && (
          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Honorários</span>
            <strong className={styles.summaryValue}>R$ {summary.fees_amount?.toFixed(2)}</strong>
          </div>
        )}
        <div className={`${styles.summaryCard} ${styles.summaryCardHighlight}`}>
          <span className={styles.summaryLabel}>Total Devido</span>
          <strong className={styles.summaryValue}>R$ {summary.total?.toFixed(2)}</strong>
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h3>Evolução Mês a Mês</h3>
        </div>
        
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Competência</th>
                <th>Fator de Correção</th>
                <th>Principal Atualizado (R$)</th>
                <th>Juros Mora (R$)</th>
                <th className={styles.highlightCol}>Subtotal Mês (R$)</th>
              </tr>
            </thead>
            <tbody>
              {evolution.map((row: any, idx: number) => (
                <tr key={idx}>
                  <td>{row.month}</td>
                  <td className={styles.monoCell}>{row.index_value?.toFixed(4) || '1.0000'}</td>
                  <td>{row.updated_principal?.toFixed(2)}</td>
                  <td>{row.interest_amount?.toFixed(2)}</td>
                  <td className={styles.highlightCol}>{row.total_month?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4} className={styles.footerLabel}>Total Acumulado:</td>
                <td className={styles.footerValue}>R$ {summary.total?.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
