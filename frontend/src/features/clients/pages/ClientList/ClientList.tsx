import React, { useState } from 'react';
import styles from './ClientList.module.css';
import { Button } from '../../../../shared/components/ui/Button/Button';
import { Input } from '../../../../shared/components/ui/Input/Input';
import { Dropdown } from '../../../../shared/components/ui/Dropdown/Dropdown';
import { ClientFormModal } from '../../components/ClientFormModal/ClientFormModal';
import { Search, Plus, MoreVertical, Edit2, Trash2, Eye } from 'lucide-react';

const MOCK_CLIENTS = [
  { id: 1, name: 'João da Silva', document: '123.456.789-00', type: 'Física', processes: 2 },
  { id: 2, name: 'Empresa Tech Ltda', document: '00.111.222/0001-33', type: 'Jurídica', processes: 5 },
  { id: 3, name: 'Maria de Souza', document: '987.654.321-11', type: 'Física', processes: 1 },
];

export const ClientList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredClients = MOCK_CLIENTS.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.document.includes(search)
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Clientes</h1>
          <p className={styles.subtitle}>Gerencie a base de clientes do seu escritório.</p>
        </div>
        <Button 
          variant="primary" 
          leftIcon={<Plus size={18} />} 
          onClick={() => setIsModalOpen(true)}
        >
          Novo Cliente
        </Button>
      </header>

      <div className={styles.tableCard}>
        <div className={styles.tableToolbar}>
          <div className={styles.searchWrapper}>
            <Input 
              placeholder="Buscar por nome ou CPF/CNPJ..." 
              leftIcon={<Search size={18} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome / Razão Social</th>
                <th>Documento</th>
                <th>Tipo</th>
                <th>Qtd. Processos</th>
                <th className={styles.actionsCol}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.length > 0 ? (
                filteredClients.map(client => (
                  <tr key={client.id}>
                    <td className={styles.boldCell}>{client.name}</td>
                    <td>{client.document}</td>
                    <td>
                      <span className={`${styles.badge} ${client.type === 'Física' ? styles.badgeFisica : styles.badgeJuridica}`}>
                        {client.type}
                      </span>
                    </td>
                    <td>{client.processes}</td>
                    <td className={styles.actionsCol}>
                      <Dropdown 
                        align="right"
                        trigger={<button className={styles.actionTrigger}><MoreVertical size={18} /></button>}
                        items={[
                          { label: 'Ver Detalhes', icon: <Eye size={16} />, onClick: () => console.log('Ver', client.id) },
                          { label: 'Editar', icon: <Edit2 size={16} />, onClick: () => console.log('Editar', client.id) },
                          { label: 'Excluir', icon: <Trash2 size={16} />, onClick: () => console.log('Excluir', client.id), danger: true },
                        ]}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className={styles.emptyState}>
                    Nenhum cliente encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className={styles.pagination}>
          <span className={styles.pageInfo}>Mostrando {filteredClients.length} de {MOCK_CLIENTS.length} resultados</span>
          <div className={styles.pageControls}>
            <Button variant="outline" size="sm" disabled>Anterior</Button>
            <Button variant="outline" size="sm" disabled>Próxima</Button>
          </div>
        </div>
      </div>

      <ClientFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};
