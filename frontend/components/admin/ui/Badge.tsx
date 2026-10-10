import React from 'react';
import styles from './Badge.module.css';

export type BadgeVariant = 'new' | 'contacted' | 'quote' | 'converted' | 'failed' | 'pending' | 'unassigned' | 'default';

export interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  size?: 'regular' | 'large';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', children, size = 'regular', icon }) => {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${styles[size]}`}>
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </span>
  );
};
