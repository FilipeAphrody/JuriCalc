import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../../shared/components/ui/Button/Button';
import { Input } from '../../../../shared/components/ui/Input/Input';
import { Search, Plus, Scale } from 'lucide-react';
import styles from './LawsuitList.module.css';

const MOCK_LAWSUITS = [
  { id: 1, cnj: '0012345-67.2023.5.02.0001', client: 'João da Silva', type: 'Trabalhista', status: 'Ativo' },
  { id: 2, cnj: '0098765-43.2022.8.26.0100', client: 'Empresa Tech Ltda', type: 'Cível', status: 'Em Recurso' },
];

export const LawsuitList: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

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
          {MOCK_LAWSUITS.map(lawsuit => (
            <div 
              key={lawsuit.id} 
              className={styles.gridItem} 
              onClick={() => navigate(`/lawsuits/${lawsuit.id}`)}
            >
              <div className={styles.itemHeader}>
                <div className={styles.cnjWrapper}>
                  <Scale size={16} className={styles.icon} />
                  <span className={styles.cnj}>{lawsuit.cnj}</span>
                </div>
                <span className={`${styles.status} ${lawsuit.status === 'Ativo' ? styles.statusActive : styles.statusWarning}`}>
                  {lawsuit.status}
                </span>
              </div>
              <div className={styles.itemBody}>
                <div className={styles.infoGroup}>
                  <span className={styles.label}>Cliente</span>
                  <span className={styles.value}>{lawsuit.client}</span>
                </div>
                <div className={styles.infoGroup}>
                  <span className={styles.label}>Tipo de Ação</span>
                  <span className={styles.value}>{lawsuit.type}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
