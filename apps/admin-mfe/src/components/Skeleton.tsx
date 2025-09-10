import React from 'react';
import { semanticColors } from '../styles/colors';
import { borderRadius, spacing } from '../styles/spacing';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
  style?: React.CSSProperties;
  animation?: 'pulse' | 'wave' | 'none';
}

const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  borderRadius: radius = borderRadius.base,
  className,
  style,
  animation = 'pulse',
}) => {
  const skeletonStyle: React.CSSProperties = {
    width,
    height,
    borderRadius: radius,
    backgroundColor: semanticColors.background.secondary,
    ...style,
  };

  const animationClass = animation !== 'none' ? `skeleton-${animation}` : '';

  return (
    <div
      className={`skeleton ${animationClass} ${className || ''}`.trim()}
      style={skeletonStyle}
    />
  );
};

// Predefined skeleton components
export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({ 
  lines = 1, 
  className 
}) => (
  <div className={className}>
    {Array.from({ length: lines }).map((_, index) => (
      <Skeleton
        key={index}
        height="1rem"
        width={index === lines - 1 ? '75%' : '100%'}
        style={{ marginBottom: index < lines - 1 ? spacing[2] : 0 }}
      />
    ))}
  </div>
);

export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={className} style={{ padding: spacing[4] }}>
    <Skeleton height="1.5rem" width="60%" style={{ marginBottom: spacing[3] }} />
    <SkeletonText lines={3} />
    <div style={{ display: 'flex', gap: spacing[2], marginTop: spacing[4] }}>
      <Skeleton height="2rem" width="4rem" />
      <Skeleton height="2rem" width="4rem" />
    </div>
  </div>
);

export const SkeletonTable: React.FC<{ 
  rows?: number; 
  columns?: number; 
  className?: string 
}> = ({ rows = 5, columns = 4, className }) => (
  <div className={className}>
    <div style={{ display: 'flex', gap: spacing[4], marginBottom: spacing[3] }}>
      {Array.from({ length: columns }).map((_, index) => (
        <Skeleton key={index} height="1.5rem" width="100%" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} style={{ display: 'flex', gap: spacing[4], marginBottom: spacing[2] }}>
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton key={colIndex} height="1rem" width="100%" />
        ))}
      </div>
    ))}
  </div>
);

export const SkeletonAvatar: React.FC<{ 
  size?: number; 
  className?: string 
}> = ({ size = 40, className }) => (
  <Skeleton
    width={size}
    height={size}
    borderRadius="50%"
    className={className}
  />
);

export const SkeletonButton: React.FC<{ 
  width?: string | number; 
  height?: string | number;
  className?: string 
}> = ({ width = '6rem', height = '2.5rem', className }) => (
  <Skeleton
    width={width}
    height={height}
    borderRadius={borderRadius.lg}
    className={className}
  />
);

// Loading states for specific components
export const UserTableSkeleton: React.FC = () => (
  <div style={{ padding: spacing[4] }}>
    <div style={{ display: 'flex', gap: spacing[4], marginBottom: spacing[6] }}>
      <Skeleton height="2.5rem" width="20rem" />
      <Skeleton height="2.5rem" width="8rem" />
      <Skeleton height="2.5rem" width="8rem" />
      <Skeleton height="2.5rem" width="8rem" />
    </div>
    
    <div style={{ background: semanticColors.surface.primary, borderRadius: borderRadius.lg, overflow: 'hidden' }}>
      <div style={{ padding: spacing[4], borderBottom: `1px solid ${semanticColors.border.primary}` }}>
        <div style={{ display: 'flex', gap: spacing[4] }}>
          <Skeleton height="1.5rem" width="3rem" />
          <Skeleton height="1.5rem" width="8rem" />
          <Skeleton height="1.5rem" width="12rem" />
          <Skeleton height="1.5rem" width="6rem" />
          <Skeleton height="1.5rem" width="6rem" />
          <Skeleton height="1.5rem" width="8rem" />
          <Skeleton height="1.5rem" width="8rem" />
          <Skeleton height="1.5rem" width="6rem" />
        </div>
      </div>
      
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} style={{ padding: spacing[4], borderBottom: `1px solid ${semanticColors.border.primary}` }}>
          <div style={{ display: 'flex', gap: spacing[4], alignItems: 'center' }}>
            <Skeleton height="1rem" width="3rem" />
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
              <SkeletonAvatar size={32} />
              <Skeleton height="1rem" width="8rem" />
            </div>
            <Skeleton height="1rem" width="12rem" />
            <Skeleton height="1.5rem" width="4rem" borderRadius={borderRadius.full} />
            <Skeleton height="1.5rem" width="4rem" borderRadius={borderRadius.full} />
            <Skeleton height="1rem" width="6rem" />
            <Skeleton height="1rem" width="6rem" />
            <div style={{ display: 'flex', gap: spacing[1] }}>
              <Skeleton height="2rem" width="2rem" borderRadius={borderRadius.md} />
              <Skeleton height="2rem" width="2rem" borderRadius={borderRadius.md} />
              <Skeleton height="2rem" width="2rem" borderRadius={borderRadius.md} />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const DashboardSkeleton: React.FC = () => (
  <div style={{ padding: spacing[6] }}>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: spacing[6], marginBottom: spacing[8] }}>
      {Array.from({ length: 4 }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
    
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[6] }}>
      <SkeletonCard />
      <SkeletonCard />
    </div>
  </div>
);

export default Skeleton;
