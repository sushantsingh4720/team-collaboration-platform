import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { CompleteRegistration } from "./components/auth/CompleteRegistration";
import { AuthProvider, useAuth } from "./services/context/auth";
import { LoginForm } from "./components/auth/Login";
import { RegisterForm } from "./components/auth/Register";
import { Dashboard } from "./components/Dashboard";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return !user ? <>{children}</> : <Navigate to="/dashboard" />;
};

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <div className="min-h-screen flex items-center justify-center p-4">
                <LoginForm />
              </div>
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <div className="min-h-screen flex items-center justify-center p-4">
                <RegisterForm />
              </div>
            </PublicRoute>
          }
        />
        <Route
          path="/complete-registration"
          element={
            <div className="min-h-screen flex items-center justify-center p-4">
              <CompleteRegistration />
            </div>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
