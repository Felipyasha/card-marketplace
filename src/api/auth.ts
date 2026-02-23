import { api } from './client'
import type { LoginPayload, LoginResponse, RegisterPayload, RegisterResponse, User } from '@/types'

export const authApi = {
  register: (data: RegisterPayload) =>
    api.post<RegisterResponse>('/register', data).then((r) => r.data),

  login: (data: LoginPayload) =>
    api.post<LoginResponse>('/login', data).then((r) => r.data),

  me: () =>
    api.get<User & { cards: import('@/types').Card[] }>('/me').then((r) => r.data),
}
