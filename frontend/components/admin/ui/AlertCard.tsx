import React from 'react';
import styles from './AlertCard.module.css';

export interface AlertCardProps {
  type?: 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export const AlertCard: React.FC<AlertCardProps> = ({ type = 'warning', title, children, action }) => {
  return (
    <div className={`${styles.alertCard} ${styles[type]}`}>
      <div className={styles.content}>
        {title && <div className={styles.title}>{title}</div>}
        <div className={styles.body}>{children}</div>
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
};
