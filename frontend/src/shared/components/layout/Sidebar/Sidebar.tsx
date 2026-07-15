import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Scale, Calculator, FileText, Settings, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../../../../app/store/authStore';
import styles from './Sidebar.module.css';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const location = useLocation();
  const logout = useAuthStore(state => state.logout);

  const navItems = [
    { label: 'Dashboard', icon: Home, path: '/dashboard' },
    { label: 'Clientes', icon: Users, path: '/clients' },
    { label: 'Processos', icon: Scale, path: '/lawsuits' },
    { label: 'Cálculos', icon: Calculator, path: '/calculations' },
    { label: 'Documentos', icon: FileText, path: '/documents' },
  ];

  const adminItems = [
    { label: 'Configurações', icon: Settings, path: '/settings' },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.header}>
        <div className={styles.brand}>
          <Scale className={styles.brandIcon} size={28} />
          {!isCollapsed && <h2>LexCalc <span>Pro</span></h2>}
        </div>
        <button onClick={onToggle} className={styles.toggleButton} aria-label="Toggle Sidebar">
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <div className={styles.navContainer}>
        <div className={styles.navSection}>
          <span className={styles.sectionTitle}>{!isCollapsed ? 'MÓDULOS' : '•••'}</span>
          <nav className={styles.nav}>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`${styles.navItem} ${isActive(item.path) ? styles.active : ''}`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon size={20} />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className={styles.navSection}>
          <span className={styles.sectionTitle}>{!isCollapsed ? 'SISTEMA' : '•••'}</span>
          <nav className={styles.nav}>
            {adminItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`${styles.navItem} ${isActive(item.path) ? styles.active : ''}`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon size={20} />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
            <button
              onClick={() => logout()}
              className={`${styles.navItem} ${styles.logoutItem}`}
              title={isCollapsed ? "Sair" : undefined}
            >
              <LogOut size={20} />
              {!isCollapsed && <span>Sair</span>}
            </button>
          </nav>
        </div>
      </div>
    </aside>
  );
};
