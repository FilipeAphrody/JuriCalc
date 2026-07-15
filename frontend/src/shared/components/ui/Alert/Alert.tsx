import React from 'react';
import styles from './Alert.module.css';
import { Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

export interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  children,
  onClose,
  className = '',
}) => {
  const Icon = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: XCircle,
  }[type];

  return (
    <div className={`${styles.alert} ${styles[type]} ${className}`} role="alert">
      <div className={styles.iconWrapper}>
        <Icon size={20} />
      </div>
      <div className={styles.content}>
        {title && <h4 className={styles.title}>{title}</h4>}
        <div className={styles.body}>{children}</div>
      </div>
      {onClose && (
        <button onClick={onClose} className={styles.closeButton} aria-label="Fechar">
          <XCircle size={16} />
        </button>
      )}
    </div>
  );
};
