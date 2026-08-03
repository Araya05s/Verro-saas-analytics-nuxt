export const TIME_FILTERS = ['24h', '7d', '30d', '12m'] as const
export type TimeFilter = (typeof TIME_FILTERS)[number]
export type TrendType = 'positive' | 'negative' | 'neutral'

export interface SalesTransaction {
  id: string
  client: string
  plan: string
  amount: number
  date: string
  status: 'completed' | 'pending'
}

export interface RawChartDataset {
  label: string
  data: number[]
  borderDash?: number[]
}

export interface RawChartData {
  labels: string[]
  datasets: RawChartDataset[]
}

export interface OverviewMetrics {
  mrr: number
  userGrowth: string
  churnRate: string
  momGrowth: number
  monthlyDiff: string
  chartData: RawChartData
}