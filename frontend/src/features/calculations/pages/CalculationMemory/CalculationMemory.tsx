import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './CalculationMemory.module.css';
import { Button } from '../../../../shared/components/ui/Button/Button';
import { Download, ArrowLeft, Printer, Share2 } from 'lucide-react';

export const CalculationMemory: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mocked evolution data
  const EVOLUTION_DATA = [
    { month: '01/2023', principal: '1.000,00', index: '1,0050', updated: '1.005,00', interest: '10,05', total: '1.015,05' },
    { month: '02/2023', principal: '1.015,05', index: '1,0062', updated: '1.021,34', interest: '10,21', total: '1.031,55' },
    { month: '03/2023', principal: '1.031,55', index: '1,0045', updated: '1.036,19', interest: '10,36', total: '1.046,55' },
    { month: '04/2023', principal: '1.046,55', index: '1,0080', updated: '1.054,92', interest: '10,54', total: '1.065,46' },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <button className={styles.backBtn} onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className={styles.title}>Memória de Cálculo #{id || '9482'}</h1>
            <p className={styles.subtitle}>Processo: 0012345-67.2023.5.02.0001 | João da Silva</p>
          </div>
        </div>
        <div className={styles.actions}>
          <Button variant="outline" leftIcon={<Share2 size={18} />}>Compartilhar</Button>
          <Button variant="outline" leftIcon={<Printer size={18} />}>Imprimir</Button>
          <Button variant="primary" leftIcon={<Download size={18} />}>Exportar PDF</Button>
        </div>
      </header>

      <div className={styles.summaryCards}>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Valor Principal</span>
          <strong className={styles.summaryValue}>R$ 1.000,00</strong>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Juros Acumulados</span>
          <strong className={styles.summaryValue}>R$ 65,46</strong>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Honorários (20%)</span>
          <strong className={styles.summaryValue}>R$ 213,09</strong>
        </div>
        <div className={`${styles.summaryCard} ${styles.summaryCardHighlight}`}>
          <span className={styles.summaryLabel}>Total Devido</span>
          <strong className={styles.summaryValue}>R$ 1.278,55</strong>
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h3>Evolução Mês a Mês</h3>
          <span className={styles.tableMeta}>Índice: INPC | Juros: 1% a.m</span>
        </div>
        
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Competência</th>
                <th>Principal Base (R$)</th>
                <th>Fator de Correção</th>
                <th>Principal Atualizado (R$)</th>
                <th>Juros Mora (R$)</th>
                <th className={styles.highlightCol}>Subtotal Mês (R$)</th>
              </tr>
            </thead>
            <tbody>
              {EVOLUTION_DATA.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.month}</td>
                  <td>{row.principal}</td>
                  <td className={styles.monoCell}>{row.index}</td>
                  <td>{row.updated}</td>
                  <td>{row.interest}</td>
                  <td className={styles.highlightCol}>{row.total}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={5} className={styles.footerLabel}>Total Acumulado antes dos Honorários:</td>
                <td className={styles.footerValue}>R$ 1.065,46</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
