import client from './client'
import type { AddCardsPayload, Card, PaginatedCards } from '@/types'

export const cardsApi = {
  getAll: (page = 1, rpp = 12) =>
    client.get<PaginatedCards>('/cards', { params: { page, rpp } }).then((r) => r.data),

  getMyCards: () =>
    client.get<Card[]>('/me/cards').then((r) => r.data),

  addToMyCards: (data: AddCardsPayload) =>
    client.post<void>('/me/cards', data).then((r) => r.data),
}
