import { defineStore } from 'pinia'

export type SubscriptionTier = 'Starter' | 'Professional' | 'Enterprise'

export interface Invoice {
  id: string
  client: string
  amount: number
  date: string
  dueDate: string
  status: 'Paid' | 'Pending' | 'Overdue'
  items: { description: string; qty: number; unitPrice: number }[]
}

export interface PaymentMethod {
  id: string
  brand: 'Visa' | 'Mastercard' | 'PayPal'
  last4?: string
  email?: string
  isDefault: boolean
  expiry?: string
}

export const useBillingStore = defineStore('billing', () => {
  // Current active plan managed by admin
  const currentTier = ref<SubscriptionTier>('Professional')

  const invoices = ref<Invoice[]>([
    {
      id: 'INV-2026-001',
      client: 'Acme Corporation',
      amount: 1200,
      date: '2026-07-01',
      dueDate: '2026-07-15',
      status: 'Paid',
      items: [{ description: 'Professional Plan - Monthly', qty: 1, unitPrice: 1200 }]
    },
    {
      id: 'INV-2026-002',
      client: 'Starlight Media',
      amount: 450,
      date: '2026-07-10',
      dueDate: '2026-07-24',
      status: 'Paid',
      items: [{ description: 'Starter Plan - Annual Addon', qty: 1, unitPrice: 450 }]
    },
    {
      id: 'INV-2026-003',
      client: 'Nexus Tech Solutions',
      amount: 3500,
      date: '2026-07-15',
      dueDate: '2026-07-29',
      status: 'Pending',
      items: [{ description: 'Enterprise Custom Seats', qty: 10, unitPrice: 350 }]
    },
    {
      id: 'INV-2026-004',
      client: 'Cyberdyne Systems',
      amount: 800,
      date: '2026-06-01',
      dueDate: '2026-06-15',
      status: 'Overdue',
      items: [{ description: 'API Overrage Volume', qty: 1, unitPrice: 800 }]
    },
    {
      id: 'INV-2026-005',
      client: 'Solarpunk Industries',
      amount: 1200,
      date: '2026-08-01',
      dueDate: '2026-08-15',
      status: 'Paid',
      items: [{ description: 'Professional Plan - Monthly', qty: 1, unitPrice: 1200 }]
    }
  ])

  // Payment Methods
  const paymentMethods = ref<PaymentMethod[]>([
    { id: 'pm_1', brand: 'Visa', last4: '4242', isDefault: true, expiry: '12/28' },
    { id: 'pm_2', brand: 'Mastercard', last4: '8819', isDefault: false, expiry: '09/27' },
    { id: 'pm_3', brand: 'PayPal', email: 'billing@company.io', isDefault: false }
  ])

  // Actions
  const setSubscriptionTier = (tier: SubscriptionTier) => {
    currentTier.value = tier
  }

  const setDefaultPaymentMethod = (id: string) => {
    paymentMethods.value = paymentMethods.value.map((pm) => ({
      ...pm,
      isDefault: pm.id === id
    }))
  }

  return {
    currentTier,
    invoices,
    paymentMethods,
    setSubscriptionTier,
    setDefaultPaymentMethod
  }
})