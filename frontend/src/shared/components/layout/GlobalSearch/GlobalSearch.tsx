import React, { useState, useEffect, useRef } from 'react';
import { Search, FileText, Users, Scale, Calculator } from 'lucide-react';
import { Modal } from '../../ui/Modal/Modal';
import styles from './GlobalSearch.module.css';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Mock results
  const results = query.length > 1 ? [
    { type: 'Client', title: 'Empresa Tech Ltda', icon: Users, path: '/clients/1' },
    { type: 'Lawsuit', title: 'Processo Trabalhista 000123-24.2023', icon: Scale, path: '/lawsuits/12' },
    { type: 'Calculation', title: 'Rescisão - João Silva', icon: Calculator, path: '/calculations/45' },
    { type: 'Document', title: 'Sentença_Final.pdf', icon: FileText, path: '/documents/99' },
  ] : [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" closeOnOverlayClick={true}>
      <div className={styles.container}>
        <div className={styles.searchHeader}>
          <Search size={20} className={styles.searchIcon} />
          <input
            ref={inputRef}
            className={styles.searchInput}
            placeholder="O que você está procurando? (Processos, clientes, cálculos...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className={styles.escHint}>ESC</div>
        </div>

        {query.length > 1 && (
          <div className={styles.resultsContainer}>
            <span className={styles.resultsTitle}>Resultados Encontrados</span>
            <div className={styles.resultsList}>
              {results.map((result, idx) => {
                const Icon = result.icon;
                return (
                  <button key={idx} className={styles.resultItem} onClick={onClose}>
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
