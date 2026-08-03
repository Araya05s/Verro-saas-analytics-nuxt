export type CustomerPlan = 'Enterprise' | 'Professional' | 'Starter' | 'Trial'
export type CustomerStatus = 'Active' | 'Pending' | 'Overdue' | 'Cancelled'

export interface Invoice {
  id: string
  amount: number
  date: string
  status: 'Paid' | 'Unpaid'
}

// For compute tables get the plan and amount from nested items
export interface InvoiceDisplay extends Invoice {
  plan: string
  formattedAmount: string
}

export interface ActivityLog {
  id: string
  action: string
  timestamp: string
  icon: string
}

export interface Customer {
  id: string
  name: string
  email: string
  avatar: string
  plan: CustomerPlan
  status: CustomerStatus
  arr: number
  joinedDate: string
  usagePercent: number
  invoices: Invoice[]
  activities: ActivityLog[]
}