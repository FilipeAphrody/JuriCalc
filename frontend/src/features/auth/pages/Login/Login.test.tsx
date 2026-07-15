import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Login } from './Login';
import { useAuthStore } from '../../../../app/store/authStore';

// Mock do Zustand store
vi.mock('../../../../app/store/authStore', () => ({
  useAuthStore: vi.fn(),
}));

describe('Login Component', () => {
  it('renders login form correctly', () => {
    (useAuthStore as any).mockImplementation((selector: any) => selector ? selector({ login: vi.fn() }) : { login: vi.fn() });
    (useAuthStore as any).getState = vi.fn(() => ({ token: null, user: null, logout: vi.fn() }));

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByText('Bem-vindo de volta')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite seu usuário')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
  });

  it('shows validation errors if fields are empty', async () => {
    (useAuthStore as any).mockImplementation((selector: any) => selector ? selector({ login: vi.fn() }) : { login: vi.fn() });
    (useAuthStore as any).getState = vi.fn(() => ({ token: null, user: null, logout: vi.fn() }));

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const submitBtn = screen.getByRole('button', { name: 'Entrar' });
    fireEvent.click(submitBtn);

    // O Zod deve disparar erros
    await waitFor(() => {
      expect(screen.getByText('O nome de usuário é obrigatório')).toBeInTheDocument();
      expect(screen.getByText('A senha deve ter pelo menos 6 caracteres')).toBeInTheDocument();
    });
  });

  it('handles unhappy path (401 Unauthorized from MSW)', async () => {
    (useAuthStore as any).mockImplementation((selector: any) => selector ? selector({ login: vi.fn() }) : { login: vi.fn() });
    (useAuthStore as any).getState = vi.fn(() => ({ token: null, user: null, logout: vi.fn() }));

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Preenche com usuário mockado no MSW para retornar 401 ('invalido')
    fireEvent.change(screen.getByPlaceholderText('Digite seu usuário'), { target: { value: 'invalido' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'senha_qualquer123' } });

    const submitBtn = screen.getByRole('button', { name: 'Entrar' });
    fireEvent.click(submitBtn);

    // Aguarda o alerta de erro vindo do bloco catch
    await waitFor(() => {
      expect(screen.getByText('Credenciais inválidas. Tente novamente.')).toBeInTheDocument();
    });
  });

  it('handles successful login and redirects', async () => {
    const mockLogin = vi.fn();
    (useAuthStore as any).mockImplementation((selector: any) => selector ? selector({ login: mockLogin }) : { login: mockLogin });
    (useAuthStore as any).getState = vi.fn(() => ({ token: null, user: null, logout: vi.fn() }));

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Preenche com usuário válido (MSW retorna 200)
    fireEvent.change(screen.getByPlaceholderText('Digite seu usuário'), { target: { value: 'dr.roberto' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'senha_segura123' } });

    const submitBtn = screen.getByRole('button', { name: 'Entrar' });
    fireEvent.click(submitBtn);

    // Verifica se a função login() global do store foi chamada
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledTimes(1);
    });
  });
});
