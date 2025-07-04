import React from 'react';
import { motion } from 'framer-motion';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.warn('Error caught by boundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full text-center border border-purple-500/30"
          >
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-300 mb-6">
              Don't worry, your progress is safe! This is just a temporary glitch.
            </p>
            <motion.button
              onClick={() => window.location.reload()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all"
            >
              🔄 Reload App
            </motion.button>
            
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-6 text-left">
                <summary className="text-gray-400 cursor-pointer hover:text-white">
                  🔧 Debug Info (Dev Mode)
                </summary>
                <div className="mt-2 p-3 bg-gray-900 rounded text-xs text-red-300 overflow-auto max-h-32">
                  <div className="font-bold">Error:</div>
                  <div>{this.state.error && this.state.error.toString()}</div>
                  <div className="font-bold mt-2">Stack:</div>
                  <div>{this.state.errorInfo.componentStack}</div>
                </div>
              </details>
            )}
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
