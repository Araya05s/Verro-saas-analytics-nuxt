export const TIME_FILTERS = ['24h', '7d', '30d', '12m'] as const
export type TimeFilter = (typeof TIME_FILTERS)[number]

export interface SalesTransaction {
  id: string
  client: string
  plan: string
  amount: number
  date: string
  status: 'completed' | 'pending'
}