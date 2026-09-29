import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({}),
  useSearchParams: () => [new URLSearchParams(), jest.fn()],
}));

import RegisterScreen from '@/pages/Register';
import { AuthProvider } from '@/context/AuthContext';

function renderScreen() {
  return render(
    <AuthProvider>
      <RegisterScreen />
    </AuthProvider>
  );
}

describe('RegisterScreen', () => {
  it('renderiza descrição "Crie sua conta"', () => {
    renderScreen();
    expect(screen.getByText('Crie sua conta')).toBeTruthy();
  });

  it('renderiza campos de formulário', () => {
    renderScreen();
    expect(screen.getByText('Nome')).toBeTruthy();
    expect(screen.getByText('E-mail')).toBeTruthy();
    expect(screen.getByText('Senha')).toBeTruthy();
    expect(screen.getByText('CEP')).toBeTruthy();
  });

  it('renderiza botão "Cadastrar"', () => {
    renderScreen();
    expect(screen.getByText('Cadastrar')).toBeTruthy();
  });

  it('navega para /login ao pressionar "Fazer login"', () => {
    renderScreen();
    fireEvent.click(screen.getByText('Fazer login'));
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
