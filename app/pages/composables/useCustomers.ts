import type { Customer } from '~/types/customer'

// Dummy customers data
export const useCustomers = () => {
  const customers = useState<Customer[]>('customers_data', () => [
    {
      id: 'CUST-8021',
      name: 'Sarah Connor',
      email: 's.connor@cyberdyne.io',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      plan: 'Enterprise',
      status: 'Active',
      arr: 24000,
      joinedDate: '2024-01-15',
      usagePercent: 88,
      invoices: [
        { id: 'INV-2026-001', amount: 2000, date: '2026-07-01', status: 'Paid' },
        { id: 'INV-2026-002', amount: 2000, date: '2026-06-01', status: 'Paid' }
      ],
      activities: [
        { id: 'act-1', action: 'Upgraded seats from 20 to 50', timestamp: '2 hours ago', icon: 'heroicons:user-plus' },
        { id: 'act-2', action: 'API key generated', timestamp: '1 day ago', icon: 'heroicons:key' }
      ]
    },
    {
      id: 'CUST-4019',
      name: 'Marcus Vance',
      email: 'marcus@vance-analytics.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      plan: 'Professional',
      status: 'Active',
      arr: 4800,
      joinedDate: '2025-03-22',
      usagePercent: 62,
      invoices: [
        { id: 'INV-2026-003', amount: 400, date: '2026-07-10', status: 'Paid' }
      ],
      activities: [
        { id: 'act-3', action: 'Logged into dashboard', timestamp: '3 hours ago', icon: 'heroicons:arrow-right-end-on-rectangle' }
      ]
    },
    {
      id: 'CUST-1033',
      name: 'Elena Rostova',
      email: 'elena@solarpunk.tech',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      plan: 'Starter',
      status: 'Pending',
      arr: 1200,
      joinedDate: '2026-05-10',
      usagePercent: 34,
      invoices: [
        { id: 'INV-2026-004', amount: 100, date: '2026-07-15', status: 'Unpaid' }
      ],
      activities: [
        { id: 'act-4', action: 'Invoice payment overdue warning', timestamp: '2 days ago', icon: 'heroicons:exclamation-triangle' }
      ]
    },
    {
      id: 'CUST-0092',
      name: 'David Kim',
      email: 'dkim@startup.co',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      plan: 'Trial',
      status: 'Active',
      arr: 0,
      joinedDate: '2026-07-28',
      usagePercent: 12,
      invoices: [],
      activities: [
        { id: 'act-5', action: 'Account created (Trial)', timestamp: '4 days ago', icon: 'heroicons:sparkles' }
      ]
    }
  ])

  return { customers }
}