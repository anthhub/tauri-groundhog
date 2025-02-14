import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h2 className="error-title">游戏出错了</h2>
          <p className="error-message">{this.state.error?.message}</p>
          <button
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            重试
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
