import React from 'react';
import styles from './Badge.module.css';

interface BadgeProps {
  variant?: 'bestseller' | 'discount' | 'verified' | 'popular' | 'amber' | 'neutral';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'bestseller',
  children,
  className = '',
}) => {
  return <span className={`${styles.badge} ${styles[variant]} ${className}`}>{children}</span>;
};
