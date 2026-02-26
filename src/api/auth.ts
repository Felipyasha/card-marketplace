import client from './client'
import type { LoginPayload, LoginResponse, RegisterPayload, RegisterResponse, User } from '@/types'

export const authApi = {
  register: (data: RegisterPayload) =>
    client.post<RegisterResponse>('/register', data).then((r) => r.data),

  login: (data: LoginPayload) =>
    client.post<LoginResponse>('/login', data).then((r) => r.data),

  me: () =>
    client.get<User & { cards: import('@/types').Card[] }>('/me').then((r) => r.data),
}
