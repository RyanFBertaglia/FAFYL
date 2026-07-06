import { USE_MOCKS } from '@/config/env';
import { UserDTO } from '@/types';
import { API_BASE, request } from './api';

const MOCK_USER: UserDTO = {
  id: 1,
  name: 'Usuário Teste',
  email: 'teste@email.com',
  locale: { lat: -23.5505, lon: -46.6333 },
  capelinho: 1,
};

export async function updateCapelinho(capelinhoId: number): Promise<UserDTO> {
  if (USE_MOCKS) return { ...MOCK_USER, capelinho: capelinhoId };
  const response = await fetch(`${API_BASE}/auth/capelinho/${capelinhoId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

export async function getUserCapelinho(): Promise<number | null> {
  if (USE_MOCKS) return MOCK_USER.capelinho ?? null;
  try {
    const user: UserDTO = await request('/auth/me');
    return user.capelinho ?? null;
  } catch {
    return null;
  }
}

export { CAPELINHO_IMAGES, getCapelinhoImage } from '@/utils/capelinhoImages';
