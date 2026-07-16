import React, { useState, useEffect } from 'react';
import styles from './ClientList.module.css';
import { Button } from '../../../../shared/components/ui/Button/Button';
import { Input } from '../../../../shared/components/ui/Input/Input';
import { Dropdown } from '../../../../shared/components/ui/Dropdown/Dropdown';
import { ClientFormModal } from '../../components/ClientFormModal/ClientFormModal';
import { Search, Plus, MoreVertical, Edit2, Trash2, Eye } from 'lucide-react';
import { api } from '../../../../shared/api/axios';

interface Client {
  id: number;
  name: string;
  document_number: string;
  client_type: 'individual' | 'corporate';
}

export const ClientList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/clients/');
      // Django rest framework returns { count, next, previous, results: [] } if paginated
      const data = response.data.results ? response.data.results : response.data;
      setClients(data);
    } catch (err) {
      console.error('Erro ao buscar clientes', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.document_number.includes(search)
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
                <th className={styles.actionsCol}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className={styles.emptyState}>Carregando clientes...</td>
                </tr>
              ) : filteredClients.length > 0 ? (
                filteredClients.map(client => (
                  <tr key={client.id}>
                    <td className={styles.boldCell}>{client.name}</td>
                    <td>{client.document_number}</td>
                    <td>
                      <span className={`${styles.badge} ${client.client_type === 'individual' ? styles.badgeFisica : styles.badgeJuridica}`}>
                        {client.client_type === 'individual' ? 'Física' : 'Jurídica'}
                      </span>
                    </td>
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
                  <td colSpan={4} className={styles.emptyState}>
                    Nenhum cliente encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className={styles.pagination}>
          <span className={styles.pageInfo}>Mostrando {filteredClients.length} de {clients.length} resultados</span>
          <div className={styles.pageControls}>
            <Button variant="outline" size="sm" disabled>Anterior</Button>
            <Button variant="outline" size="sm" disabled>Próxima</Button>
          </div>
        </div>
      </div>

      <ClientFormModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          fetchClients(); // Atualiza a lista apos fechar o modal
        }} 
      />
    </div>
  );
};
