import React from 'react';
import styles from './KPICard.module.css';

export interface KPICardProps {
  label: string;
  metric: string | number;
  changeIndicator?: {
    value: string;
    isPositive?: boolean;
    isNegative?: boolean;
  };
  secondaryInfo?: string;
  icon?: React.ReactNode;
  iconColor?: 'orange' | 'green' | 'blue' | 'default';
}

export const KPICard: React.FC<KPICardProps> = ({
  label,
  metric,
  changeIndicator,
  secondaryInfo,
  icon,
  iconColor = 'default'
}) => {
  return (
    <div className={styles.kpiCard}>
      <div className={styles.topSection}>
        {icon && <div className={`${styles.iconContainer} ${styles[iconColor]}`}>{icon}</div>}
        <div className={styles.infoSection}>
           <span className={styles.label}>{label}</span>
           <div className={styles.metricRow}>
              <span className={styles.metric}>{metric}</span>
              {changeIndicator && (
                <span className={`${styles.changeIndicator} ${changeIndicator.isPositive ? styles.positive : ''} ${changeIndicator.isNegative ? styles.negative : ''}`}>
                  {changeIndicator.isPositive && '↑'}
                  {changeIndicator.isNegative && '↓'}
                  {changeIndicator.value}
                </span>
              )}
           </div>
        </div>
      </div>
      {secondaryInfo && (
        <div className={styles.footer}>
          {secondaryInfo}
        </div>
      )}
    </div>
  );
};
