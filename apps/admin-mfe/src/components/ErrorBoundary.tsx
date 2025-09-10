import { Component, ErrorInfo, ReactNode } from 'react';
import { colors, semanticColors } from '../styles/colors';
import { typography } from '../styles/typography';
import { spacing, borderRadius, shadows } from '../styles/spacing';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={styles.container}>
          <div style={styles.content}>
            <div style={styles.icon}>⚠️</div>
            <h1 style={styles.title}>Đã xảy ra lỗi</h1>
            <p style={styles.message}>
              Xin lỗi, đã có lỗi xảy ra trong ứng dụng. Vui lòng thử lại sau.
            </p>
            
            {import.meta.env.DEV && this.state.error && (
              <details style={styles.errorDetails}>
                <summary style={styles.errorSummary}>Chi tiết lỗi (Development)</summary>
                <pre style={styles.errorStack}>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            
            <div style={styles.actions}>
              <button 
                onClick={this.handleRetry}
                style={styles.retryButton}
              >
                Thử lại
              </button>
              <button 
                onClick={() => window.location.reload()}
                style={styles.reloadButton}
              >
                Tải lại trang
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: `linear-gradient(135deg, ${colors.primary[50]} 0%, ${colors.secondary[50]} 100%)`,
    padding: spacing[4],
  },
  
  content: {
    background: semanticColors.surface.primary,
    borderRadius: borderRadius.xl,
    padding: spacing[8],
    boxShadow: shadows.xl,
    textAlign: 'center' as const,
    maxWidth: '500px',
    width: '100%',
  },
  
  icon: {
    fontSize: '4rem',
    marginBottom: spacing[4],
  },
  
  title: {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: semanticColors.text.primary,
    marginBottom: spacing[4],
  },
  
  message: {
    fontSize: '1rem',
    fontWeight: 400,
    color: semanticColors.text.secondary,
    marginBottom: spacing[6],
    lineHeight: 1.625,
  },
  
  errorDetails: {
    marginBottom: spacing[6],
    textAlign: 'left' as const,
  },
  
  errorSummary: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: semanticColors.text.primary,
    cursor: 'pointer',
    marginBottom: spacing[2],
  },
  
  errorStack: {
    background: semanticColors.background.secondary,
    padding: spacing[4],
    borderRadius: borderRadius.md,
    fontSize: typography.fontSize.sm,
    color: colors.error[700],
    overflow: 'auto',
    whiteSpace: 'pre-wrap' as const,
    fontFamily: typography.fontFamily.mono.join(', '),
  },
  
  actions: {
    display: 'flex',
    gap: spacing[3],
    justifyContent: 'center',
    flexWrap: 'wrap' as const,
  },
  
  retryButton: {
    background: colors.primary[500],
    color: semanticColors.text.inverse,
    border: 'none',
    borderRadius: borderRadius.lg,
    padding: `${spacing[3]} ${spacing[6]}`,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: shadows.sm,
  },
  
  reloadButton: {
    background: semanticColors.surface.primary,
    color: colors.primary[600],
    border: `1px solid ${colors.primary[300]}`,
    borderRadius: borderRadius.lg,
    padding: `${spacing[3]} ${spacing[6]}`,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
} as const;

export default ErrorBoundary;
