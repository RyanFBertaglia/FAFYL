import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({}),
  useSearchParams: () => [new URLSearchParams(), jest.fn()],
}));

jest.mock('@/context/AuthContext', () => ({
  AuthProvider: ({ children }: any) => <>{children}</>,
  useAuth: () => ({
    token: 'test-token',
    user: { id: 1, name: 'Teste', email: 'teste@fafyl.dev', locale: null },
    isLoading: false,
    signIn: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn().mockResolvedValue(undefined),
    refreshUser: jest.fn(),
  }),
}));

import ProfileScreen from '@/pages/profile/Profile';

describe('ProfileScreen', () => {
  it('renderiza dados do usuário logado', () => {
    render(<ProfileScreen />);
    expect(screen.getByDisplayValue('Teste')).toBeTruthy();
    expect(screen.getByDisplayValue('teste@fafyl.dev')).toBeTruthy();
    expect(screen.getByPlaceholderText('CEP')).toBeTruthy();
  });

  it('renderiza botão "Alterar foto"', () => {
    render(<ProfileScreen />);
    expect(screen.getByText('Alterar foto')).toBeTruthy();
  });

  it('renderiza histórico e botão de sair', () => {
    render(<ProfileScreen />);
    expect(screen.getByText('Histórico de resultados')).toBeTruthy();
    expect(screen.getByText('Sair da conta')).toBeTruthy();
  });

  it('navega para capelinhos ao pressionar "Alterar foto"', () => {
    render(<ProfileScreen />);
    fireEvent.click(screen.getByText('Alterar foto'));
    expect(mockNavigate).toHaveBeenCalledWith('/profile/capelinhos');
  });

  it('faz logout e volta para a home', async () => {
    render(<ProfileScreen />);
    fireEvent.click(screen.getByText('Sair da conta'));
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});
