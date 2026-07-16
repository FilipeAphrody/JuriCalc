import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './LawsuitDetail.module.css';
import { Button } from '../../../../shared/components/ui/Button/Button';
import { LawsuitTimeline, type TimelineEvent } from '../../components/LawsuitTimeline/LawsuitTimeline';
import { ArrowLeft, Scale, User, Calendar, DollarSign, Calculator } from 'lucide-react';
import { api } from '../../../../shared/api/axios';

export const LawsuitDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lawsuit, setLawsuit] = useState<any>(null);
  const [client, setClient] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/lawsuits/${id}/`);
        const data = res.data;
        setLawsuit(data);
        
        // Fetch client details
        if (data.client) {
          const clientRes = await api.get(`/clients/${data.client}/`);
          setClient(clientRes.data);
        }
      } catch (err) {
        console.error('Erro ao carregar processo', err);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  if (isLoading) {
    return <div className={styles.container}><p>Carregando processo...</p></div>;
  }

  if (!lawsuit) {
    return <div className={styles.container}><p>Processo não encontrado.</p></div>;
  }

  const events: TimelineEvent[] = [
    { 
      id: '1', 
      date: new Date(lawsuit.created_at).toLocaleDateString('pt-BR'), 
      title: 'Processo Cadastrado', 
      description: 'O processo foi registrado no sistema.', 
      type: 'info' 
    }
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <button className={styles.backBtn} onClick={() => navigate('/lawsuits')}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className={styles.title}>Processo {lawsuit.cnj_number}</h1>
            <p className={styles.subtitle}>ID: {id} | {lawsuit.status}</p>
          </div>
        </div>
        <div className={styles.actions}>
          <Button variant="primary" leftIcon={<Calculator size={18} />} onClick={() => navigate('/wizard')}>Novo Cálculo</Button>
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
                  <span className={styles.label}>Cliente</span>
                  <span className={styles.value}>{client ? client.name : `ID: ${lawsuit.client}`}</span>
                </div>
              </div>
              <div className={styles.detailItem}>
                <Scale size={16} className={styles.detailIcon} />
                <div className={styles.detailContent}>
                  <span className={styles.label}>Classe Judicial</span>
                  <span className={styles.value}>{lawsuit.metadata?.action_type || 'N/A'}</span>
                </div>
              </div>
              <div className={styles.detailItem}>
                <Calendar size={16} className={styles.detailIcon} />
                <div className={styles.detailContent}>
                  <span className={styles.label}>Criado em</span>
                  <span className={styles.value}>{new Date(lawsuit.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
              <div className={styles.detailItem}>
                <DollarSign size={16} className={styles.detailIcon} />
                <div className={styles.detailContent}>
                  <span className={styles.label}>Valor da Causa</span>
                  <span className={styles.value}>{lawsuit.metadata?.value ? `R$ ${lawsuit.metadata.value}` : 'N/A'}</span>
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
            <LawsuitTimeline events={events} />
          </div>
        </div>
      </div>
    </div>
  );
};
