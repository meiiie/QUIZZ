import { type FC, type ReactNode } from 'react';

export interface CardProps {
  /** Card content */
  children: ReactNode;
  /** Card title */
  title?: string;
  /** Additional CSS classes */
  className?: string;
  /** Card variant */
  variant?: 'default' | 'outlined' | 'elevated';
  /** Padding size */
  padding?: 'sm' | 'md' | 'lg';
}

const Card: FC<CardProps> = ({
  children,
  title,
  className = '',
  variant = 'default',
  padding = 'md'
}) => {
  const baseClasses = 'rounded-lg';
  
  const variantClasses = {
    default: 'bg-white border border-gray-200',
    outlined: 'bg-white border-2 border-gray-300',
    elevated: 'bg-white shadow-lg border border-gray-100'
  };
  
  const paddingClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };
  
  const classes = [
    baseClasses,
    variantClasses[variant],
    paddingClasses[padding],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

export default Card;
