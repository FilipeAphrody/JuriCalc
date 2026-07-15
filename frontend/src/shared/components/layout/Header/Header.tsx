import React, { useState, useEffect } from 'react';
import { Search, Bell, User, Moon, Sun } from 'lucide-react';
import { useAuthStore } from '../../../../app/store/authStore';
import { Dropdown } from '../../ui/Dropdown/Dropdown';
import { GlobalSearch } from '../GlobalSearch/GlobalSearch';
import styles from './Header.module.css';

export const Header: React.FC = () => {
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    // Detect system preference initially
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const userMenu = [
    { label: 'Meu Perfil', onClick: () => console.log('Perfil') },
    { label: 'Configurações', onClick: () => console.log('Settings') },
    { label: 'Sair', onClick: logout, danger: true },
  ];

  return (
    <>
      <header className={styles.header}>
        <div className={styles.left}>
          <div className={styles.breadcrumb}>
            {/* Breadcrumb simples por enquanto */}
            <span>Workspace</span>
            <span className={styles.separator}>/</span>
            <span className={styles.current}>Dashboard</span>
          </div>
        </div>

        <div className={styles.right}>
          <button 
            className={styles.searchBar} 
            onClick={() => setIsSearchOpen(true)}
            aria-label="Pesquisa Global"
          >
            <Search size={18} className={styles.searchIcon} />
            <span className={styles.searchText}>Pesquisar no JuriCalc...</span>
            <span className={styles.shortcut}>Ctrl K</span>
          </button>

          <div className={styles.actions}>
            <button className={styles.actionBtn} onClick={toggleTheme} aria-label="Toggle Theme">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button className={styles.actionBtn} aria-label="Notificações">
              <Bell size={20} />
              <span className={styles.badge}>3</span>
            </button>

            <div className={styles.divider} />

            <Dropdown
              align="right"
              trigger={
                <div className={styles.profileBtn}>
                  <div className={styles.avatar}>
                    <User size={18} />
                  </div>
                  <div className={styles.userInfo}>
                    <span className={styles.userName}>{user?.username || 'Usuário'}</span>
                    <span className={styles.userRole}>Advogado</span>
                  </div>
                </div>
              }
              items={userMenu}
            />
          </div>
        </div>
      </header>

      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
