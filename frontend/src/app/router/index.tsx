import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Login } from '../../features/auth/pages/Login/Login';
import { Register } from '../../features/auth/pages/Register/Register';
import { AuthGuard } from '../../features/auth/components/AuthGuard';
import { MainLayout } from '../../shared/components/layout/MainLayout';
import { Dashboard } from '../../features/dashboard/pages/Dashboard/Dashboard';
import { ClientList } from '../../features/clients/pages/ClientList/ClientList';
import { LawsuitList } from '../../features/lawsuits/pages/LawsuitList/LawsuitList';
import { LawsuitDetail } from '../../features/lawsuits/pages/LawsuitDetail/LawsuitDetail';
import { DocumentManager } from '../../features/documents/pages/DocumentManager/DocumentManager';
import { CalculationWizard } from '../../features/calculations/pages/CalculationWizard/CalculationWizard';
import { CalculationMemory } from '../../features/calculations/pages/CalculationMemory/CalculationMemory';
import { LandingPage } from '../../features/marketing/pages/LandingPage/LandingPage';
import { SettingsPage } from '../../features/settings/pages/SettingsPage/SettingsPage';

// O Dashboard real já foi importado, então podemos remover o dummy component

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
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
    path: '/clients',
    element: (
      <AuthGuard>
        <MainLayout>
          <ClientList />
        </MainLayout>
      </AuthGuard>
    ),
  },
  {
    path: '/lawsuits',
    element: (
      <AuthGuard>
        <MainLayout>
          <LawsuitList />
        </MainLayout>
      </AuthGuard>
    ),
  },
  {
    path: '/lawsuits/:id',
    element: (
      <AuthGuard>
        <MainLayout>
          <LawsuitDetail />
        </MainLayout>
      </AuthGuard>
    ),
  },
  {
    path: '/documents',
    element: (
      <AuthGuard>
        <MainLayout>
          <DocumentManager />
        </MainLayout>
      </AuthGuard>
    ),
  },
  {
    path: '/calculations',
    element: (
      <AuthGuard>
        <MainLayout>
          <CalculationWizard />
        </MainLayout>
      </AuthGuard>
    ),
  },
  {
    path: '/calculations/:id',
    element: (
      <AuthGuard>
        <MainLayout>
          <CalculationMemory />
        </MainLayout>
      </AuthGuard>
    ),
  },
  {
    path: '/settings',
    element: (
      <AuthGuard>
        <MainLayout>
          <SettingsPage />
        </MainLayout>
      </AuthGuard>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);
