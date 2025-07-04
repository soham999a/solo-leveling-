import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import KnowledgeHub from './pages/KnowledgeHub';
import Analytics from './pages/Analytics';
import Social from './pages/Social';

function App() {
  const { initializeAuth, handleRedirectResult, isLoading, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Initialize Firebase auth listener
    const unsubscribe = initializeAuth();

    // Handle any pending redirect results
    handleRedirectResult().catch(error => {
      console.warn('Redirect result handling failed:', error);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [initializeAuth, handleRedirectResult]);

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-gaming font-bold text-gradient">LEVELUP LIFE</h2>
          <p className="text-gray-400 mt-2">Loading your journey...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
            />
            <Route
              path="/signup"
              element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signup />}
            />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/knowledge"
              element={isAuthenticated ? <KnowledgeHub /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/analytics"
              element={isAuthenticated ? <Analytics /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/social"
              element={isAuthenticated ? <Social /> : <Navigate to="/login" replace />}
            />

            {/* Default Route */}
            <Route
              path="/"
              element={
                isAuthenticated ?
                  <Navigate to="/dashboard" replace /> :
                  <Navigate to="/login" replace />
              }
            />

            {/* Catch all route */}
            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
