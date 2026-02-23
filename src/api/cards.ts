import { api } from './client'
import type { AddCardsPayload, Card, PaginatedCards } from '@/types'

export const cardsApi = {
  getAll: (page = 1, rpp = 12) =>
    api.get<PaginatedCards>('/cards', { params: { page, rpp } }).then((r) => r.data),

  getMyCards: () =>
    api.get<Card[]>('/me/cards').then((r) => r.data),

  addToMyCards: (data: AddCardsPayload) =>
    api.post<void>('/me/cards', data).then((r) => r.data),
}
