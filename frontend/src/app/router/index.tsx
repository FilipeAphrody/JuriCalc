import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Login } from '../../features/auth/pages/Login/Login';
import { Register } from '../../features/auth/pages/Register/Register';
import { AuthGuard } from '../../features/auth/components/AuthGuard';
import { MainLayout } from '../../shared/components/layout/MainLayout';

// Temporary dummy components for routing setup
const Dashboard = () => <div><h2>Dashboard Protegida</h2><p>Conteúdo da Dashboard será aqui.</p></div>;

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/dashboard',
    element: (
      <AuthGuard>
        <MainLayout>
          <Dashboard />
        </MainLayout>
      </AuthGuard>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);
