import type { OverviewMetrics, TimeFilter } from '~/types/analytics'

export function useAnalyticsApi() {
  
  // Simulated API fetcher method
  async function OverviewMetrics(filter: TimeFilter): Promise<OverviewMetrics> {
    // Simulate API network latency (200ms delay)
    await new Promise((resolve) => setTimeout(resolve, 200))

    const multiplier = filter === '24h' ? 0.1 : filter === '7d' ? 0.3 : filter === '30d' ? 1 : 3.5

    
    return {
      mrr: Math.round(48250 * multiplier),
      userGrowth: (14.2 * (filter === '24h' ? 0.2 : 1)).toFixed(1),
      churnRate: filter === '12m' ? '1.8%' : '2.1%',
      momGrowth: 1.24,  // in percent
      monthlyDiff: '+$5,370 vs previous period',
      chartData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Revenue Trend ($)',
            data: [12000, 19000, 27000, 34000, 41000, 48250].map((v) => Math.round(v * multiplier)),
          },
          {
            label: 'User Growth',
            data: [1100, 1450, 1900, 2400, 2850, 3420].map((v) => Math.round(v * multiplier)),
            borderDash: [5, 5],
          }
        ]
      }
    }
  }

  return {
    OverviewMetrics
  }
}