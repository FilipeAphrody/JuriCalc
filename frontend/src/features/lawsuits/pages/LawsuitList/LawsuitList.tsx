import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../../shared/components/ui/Button/Button';
import { Input } from '../../../../shared/components/ui/Input/Input';
import { Search, Plus, Scale } from 'lucide-react';
import styles from './LawsuitList.module.css';
import { api } from '../../../../shared/api/axios';

interface Lawsuit {
  id: number;
  cnj_number: string;
  status: string;
  client: number;
  metadata?: any;
}

export const LawsuitList: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [lawsuits, setLawsuits] = useState<Lawsuit[]>([]);
  const [clients, setClients] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [lawsuitsRes, clientsRes] = await Promise.all([
        api.get('/lawsuits/'),
        api.get('/clients/')
      ]);
      
      const lawsuitsData = lawsuitsRes.data.results ? lawsuitsRes.data.results : lawsuitsRes.data;
      const clientsData = clientsRes.data.results ? clientsRes.data.results : clientsRes.data;
      
      setLawsuits(lawsuitsData);
      
      const clientMap: Record<number, string> = {};
      clientsData.forEach((c: any) => {
        clientMap[c.id] = c.name;
      });
      setClients(clientMap);
      
    } catch (err) {
      console.error('Erro ao buscar processos', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredLawsuits = lawsuits.filter(lawsuit => 
    lawsuit.cnj_number.includes(search) || 
    (clients[lawsuit.client] || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Processos</h1>
          <p className={styles.subtitle}>Acompanhe o andamento e os cálculos judiciais.</p>
        </div>
        <Button variant="primary" leftIcon={<Plus size={18} />}>Novo Processo</Button>
      </header>

      <div className={styles.card}>
        <div className={styles.toolbar}>
          <div className={styles.searchWrapper}>
            <Input 
              placeholder="Buscar por CNJ ou Cliente..." 
              leftIcon={<Search size={18} />}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.grid}>
          {isLoading ? (
            <p>Carregando processos...</p>
          ) : filteredLawsuits.length > 0 ? (
            filteredLawsuits.map(lawsuit => (
              <div 
                key={lawsuit.id} 
                className={styles.gridItem} 
                onClick={() => navigate(`/lawsuits/${lawsuit.id}`)}
              >
                <div className={styles.itemHeader}>
                  <div className={styles.cnjWrapper}>
                    <Scale size={16} className={styles.icon} />
                    <span className={styles.cnj}>{lawsuit.cnj_number}</span>
                  </div>
                  <span className={`${styles.status} ${lawsuit.status === 'ACTIVE' ? styles.statusActive : styles.statusWarning}`}>
                    {lawsuit.status}
                  </span>
                </div>
                <div className={styles.itemBody}>
                  <div className={styles.infoGroup}>
                    <span className={styles.label}>Cliente</span>
                    <span className={styles.value}>{clients[lawsuit.client] || `ID: ${lawsuit.client}`}</span>
                  </div>
                  <div className={styles.infoGroup}>
                    <span className={styles.label}>Tipo de Ação</span>
                    <span className={styles.value}>{lawsuit.metadata?.action_type || 'Geral'}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Nenhum processo encontrado.</p>
          )}
        </div>
      </div>
    </div>
  );
};
