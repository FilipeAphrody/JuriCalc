import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../../app/store/authStore';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, token, logout, user } = useAuthStore();
  const location = useLocation();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const verifyToken = () => {
      if (!token || !isAuthenticated) {
        setIsValid(false);
        setIsVerifying(false);
        return;
      }

      try {
        // Here we could decode the JWT to check expiration
        // const decoded = jwtDecode(token);
        // if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        //   throw new Error("Token expired");
        // }
        
        // Simulação de verificação
        setIsValid(true);
      } catch (error) {
        logout();
        setIsValid(false);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [token, isAuthenticated, logout]);

  if (isVerifying) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <p>Verificando sessão segura...</p>
      </div>
    );
  }

  if (!isValid) {
    // Redireciona para login e guarda a rota que o usuário tentou acessar
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Futura validação de RBAC
  if (requireAdmin && user?.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
