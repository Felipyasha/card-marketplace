import client from './client'
import type { CreateTradePayload, PaginatedTrades } from '@/types'

export const tradesApi = {
  getAll: (page = 1, rpp = 10) =>
    client.get<PaginatedTrades>('/trades', { params: { page, rpp } }).then((r) => r.data),

  create: (data: CreateTradePayload) =>
    client.post<{ tradeId: string }>('/trades', data).then((r) => r.data),

  delete: (id: string) =>
    client.delete<void>(`/trades/${id}`).then((r) => r.data),
}
