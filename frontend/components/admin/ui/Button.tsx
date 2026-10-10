import React from 'react';
import styles from './Button.module.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'icon';
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', icon, children, className = '', ...props }, ref) => {
    const classNames = [
      styles.button,
      styles[variant],
      className
    ].filter(Boolean).join(' ');

    return (
      <button ref={ref} className={classNames} {...props}>
        {icon && <span className={styles.iconWrapper}>{icon}</span>}
        {children && <span className={styles.text}>{children}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
