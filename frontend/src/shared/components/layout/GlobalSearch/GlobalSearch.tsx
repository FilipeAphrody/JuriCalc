import React, { useState, useEffect, useRef } from 'react';
import { Search, FileText, Users, Scale, Calculator } from 'lucide-react';
import { Modal } from '../../ui/Modal/Modal';
import styles from './GlobalSearch.module.css';
import { api } from '../../../../api/axios';
import { useNavigate } from 'react-router-dom';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchSearch = async () => {
      if (query.length <= 1) {
        setResults([]);
        return;
      }
      try {
        const [clientsRes, lawsuitsRes] = await Promise.all([
          api.get('/clients/'),
          api.get('/lawsuits/')
        ]);
        
        const clientsData = clientsRes.data.results || clientsRes.data;
        const lawsuitsData = lawsuitsRes.data.results || lawsuitsRes.data;
        
        const q = query.toLowerCase();
        
        const filteredClients = clientsData.filter((c: any) => c.name.toLowerCase().includes(q) || c.document_number.includes(q))
          .map((c: any) => ({ type: 'Cliente', title: c.name, icon: Users, path: '/clients' }));
          
        const filteredLawsuits = lawsuitsData.filter((l: any) => l.cnj_number.includes(q))
          .map((l: any) => ({ type: 'Processo', title: l.cnj_number, icon: Scale, path: `/lawsuits/${l.id}` }));
        
        setResults([...filteredClients, ...filteredLawsuits]);
      } catch (err) {
        console.error('Error searching', err);
      }
    };
    
    const timeoutId = setTimeout(fetchSearch, 300); // debounce
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" closeOnOverlayClick={true}>
      <div className={styles.container}>
        <div className={styles.searchHeader}>
          <Search size={20} className={styles.searchIcon} />
          <input
            ref={inputRef}
            className={styles.searchInput}
            placeholder="O que você está procurando? (Processos, clientes...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className={styles.escHint}>ESC</div>
        </div>

        {query.length > 1 && (
          <div className={styles.resultsContainer}>
            <span className={styles.resultsTitle}>Resultados Encontrados ({results.length})</span>
            <div className={styles.resultsList}>
              {results.map((result, idx) => {
                const Icon = result.icon;
                return (
                  <button key={idx} className={styles.resultItem} onClick={() => handleNavigate(result.path)}>
                    <div className={styles.resultIconWrapper}>
                      <Icon size={18} />
                    </div>
                    <div className={styles.resultInfo}>
                      <span className={styles.resultTitle}>{result.title}</span>
                      <span className={styles.resultType}>{result.type}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {query.length <= 1 && (
          <div className={styles.emptyState}>
            <p>Comece a digitar para pesquisar em todo o sistema.</p>
          </div>
        )}
      </div>
    </Modal>
  );
};
