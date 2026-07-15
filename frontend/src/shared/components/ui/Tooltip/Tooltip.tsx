import React, { useState, useRef } from 'react';
import styles from './Tooltip.module.css';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 200,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showTooltip = () => {
    const id = setTimeout(() => setIsVisible(true), delay);
    timeoutRef.current = id;
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }setIsVisible(false);
  };

  return (
    <div
      className={styles.container}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {isVisible && (
        <div className={`${styles.tooltip} ${styles[position]}`} role="tooltip">
          {content}
          <div className={`${styles.arrow} ${styles[`arrow-${position}`]}`} />
        </div>
      )}
    </div>
  );
};
