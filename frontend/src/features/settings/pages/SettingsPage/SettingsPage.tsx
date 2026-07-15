import React, { useState } from 'react';
import styles from './SettingsPage.module.css';
import { Button } from '../../../../shared/components/ui/Button/Button';
import { Input } from '../../../../shared/components/ui/Input/Input';
import { Users, Shield, CreditCard, Save } from 'lucide-react';

const TEAM_MEMBERS = [
  { id: 1, name: 'Dr. Roberto Souza', role: 'Sócio-Diretor', email: 'roberto@escritorio.com' },
  { id: 2, name: 'Dra. Amanda Lima', role: 'Advogada Sênior', email: 'amanda@escritorio.com' },
  { id: 3, name: 'Lucas Pereira', role: 'Estagiário', email: 'lucas@escritorio.com' },
];

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'rbac' | 'billing'>('rbac');

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Configurações do Escritório</h1>
          <p className={styles.subtitle}>Gerencie sua equipe, permissões e dados de faturamento.</p>
        </div>
        <Button variant="primary" leftIcon={<Save size={18} />}>Salvar Alterações</Button>
      </header>

      <div className={styles.layout}>
        {/* Sidebar Nav */}
        <aside className={styles.sidebar}>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'profile' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <Shield size={18} /> Dados Gerais
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'rbac' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('rbac')}
          >
            <Users size={18} /> Controle de Acesso (RBAC)
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'billing' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('billing')}
          >
            <CreditCard size={18} /> Faturamento e Planos
          </button>
        </aside>

        {/* Content Area */}
        <div className={styles.content}>
          {activeTab === 'profile' && (
            <div className={styles.card}>
              <h3>Perfil do Escritório</h3>
              <div className={styles.formGrid}>
                <Input label="Nome do Escritório" defaultValue="Souza & Lima Advogados" />
                <Input label="CNPJ" defaultValue="12.345.678/0001-99" />
                <Input label="E-mail de Contato" defaultValue="contato@escritorio.com" />
                <Input label="Telefone" defaultValue="(11) 3333-4444" />
              </div>
            </div>
          )}

          {activeTab === 'rbac' && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>Membros e Permissões</h3>
                <Button variant="outline" size="sm">Convidar Membro</Button>
              </div>
              
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Usuário</th>
                      <th>Cargo / Papel</th>
                      <th className={styles.centerCol}>Visualizar</th>
                      <th className={styles.centerCol}>Criar/Editar</th>
                      <th className={styles.centerCol}>Excluir</th>
                      <th className={styles.centerCol}>Financeiro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TEAM_MEMBERS.map(member => (
                      <tr key={member.id}>
                        <td>
                          <div className={styles.userInfo}>
                            <strong>{member.name}</strong>
                            <span>{member.email}</span>
                          </div>
                        </td>
                        <td>
                          <span className={styles.roleBadge}>{member.role}</span>
                        </td>
                        <td className={styles.centerCol}>
                          <input type="checkbox" defaultChecked />
                        </td>
                        <td className={styles.centerCol}>
                          <input type="checkbox" defaultChecked={member.role !== 'Estagiário'} />
                        </td>
                        <td className={styles.centerCol}>
                          <input type="checkbox" defaultChecked={member.role === 'Sócio-Diretor'} />
                        </td>
                        <td className={styles.centerCol}>
                          <input type="checkbox" defaultChecked={member.role === 'Sócio-Diretor'} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className={styles.helpText}>
                * Permissões granulares aplicam-se automaticamente a todo o módulo Cível e Trabalhista.
              </p>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className={styles.card}>
              <h3>Assinatura Atual</h3>
              <div className={styles.billingBanner}>
                <div className={styles.billingInfo}>
                  <strong>Escritório Pro</strong>
                  <span>R$ 249,00 / mês</span>
                </div>
                <span className={styles.billingStatus}>Ativo</span>
              </div>
              <div className={styles.cardActions}>
                <Button variant="outline">Mudar Plano</Button>
                <Button variant="ghost">Cancelar Assinatura</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
