import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './LawsuitDetail.module.css';
import { Button } from '../../../../shared/components/ui/Button/Button';
import { LawsuitTimeline, type TimelineEvent } from '../../components/LawsuitTimeline/LawsuitTimeline';
import { ArrowLeft, Scale, User, Calendar, DollarSign, Calculator } from 'lucide-react';

const MOCK_EVENTS: TimelineEvent[] = [
  { id: '1', date: '15/07/2026', title: 'Cálculo de Liquidação Gerado', description: 'O sistema processou a atualização monetária com sucesso.', type: 'success' },
  { id: '2', date: '10/07/2026', title: 'Aviso de Prazo', description: 'Prazo para manifestação sobre laudo pericial.', type: 'warning' },
  { id: '3', date: '01/07/2026', title: 'Sentença Anexada', description: 'Sentença de 1º grau publicada no diário oficial.', type: 'document' },
  { id: '4', date: '15/06/2026', title: 'Processo Distribuído', description: 'Ação protocolada na 1ª Vara do Trabalho.', type: 'info' },
];

export const LawsuitDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <button className={styles.backBtn} onClick={() => navigate('/lawsuits')}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className={styles.title}>Processo 0012345-67.2023.5.02.0001</h1>
            <p className={styles.subtitle}>ID: {id} | Comarca de São Paulo - SP</p>
          </div>
        </div>
        <div className={styles.actions}>
          <Button variant="primary" leftIcon={<Calculator size={18} />}>Novo Cálculo</Button>
        </div>
      </header>

      <div className={styles.grid}>
        <div className={styles.leftCol}>
          <div className={styles.card}>
            <h3>Detalhes da Ação</h3>
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <User size={16} className={styles.detailIcon} />
                <div className={styles.detailContent}>
                  <span className={styles.label}>Cliente (Reclamante)</span>
                  <span className={styles.value}>João da Silva</span>
                </div>
              </div>
              <div className={styles.detailItem}>
                <Scale size={16} className={styles.detailIcon} />
                <div className={styles.detailContent}>
                  <span className={styles.label}>Classe Judicial</span>
                  <span className={styles.value}>Reclamação Trabalhista</span>
                </div>
              </div>
              <div className={styles.detailItem}>
                <Calendar size={16} className={styles.detailIcon} />
                <div className={styles.detailContent}>
                  <span className={styles.label}>Data de Distribuição</span>
                  <span className={styles.value}>15/06/2023</span>
                </div>
              </div>
              <div className={styles.detailItem}>
                <DollarSign size={16} className={styles.detailIcon} />
                <div className={styles.detailContent}>
                  <span className={styles.label}>Valor da Causa</span>
                  <span className={styles.value}>R$ 45.000,00</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <h3>Arquivos e Documentos</h3>
            <div className={styles.emptyState}>
              <p>Nenhum documento anexado ainda.</p>
              <Button variant="outline" size="sm">Fazer Upload</Button>
            </div>
          </div>
        </div>

        <div className={styles.rightCol}>
          <div className={styles.card}>
            <h3>Timeline (Histórico)</h3>
            <LawsuitTimeline events={MOCK_EVENTS} />
          </div>
        </div>
      </div>
    </div>
  );
};
