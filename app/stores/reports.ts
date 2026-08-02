import { defineStore } from 'pinia'

export interface ExportedReport {
  id: string
  filename: string
  date: string
  type: 'Revenue' | 'User Growth' | 'Billing Summary' | 'Growth KPIs'
  size: string
  downloadUrl?: string
}

export const useReportsStore = defineStore('reports', () => {
  const exportsHistory = ref<ExportedReport[]>([
    {
      id: 'EXP-101',
      filename: 'Revenue_Report_Q2_2026.xlsx',
      date: '2026-06-30 14:22',
      type: 'Revenue',
      size: '24.5 KB'
    },
    {
      id: 'EXP-102',
      filename: 'User_Acquisition_May_2026.xlsx',
      date: '2026-05-31 09:15',
      type: 'User Growth',
      size: '18.2 KB'
    },
    {
      id: 'EXP-103',
      filename: 'Annual_Billing_Audit_2025.xlsx',
      date: '2026-01-10 16:45',
      type: 'Billing Summary',
      size: '42.1 KB'
    }
  ])

  const addExportRecord = (record: Omit<ExportedReport, 'id'>) => {
    const newRecord: ExportedReport = {
      ...record,
      id: `EXP-${Math.floor(100 + Math.random() * 900)}`
    }
    exportsHistory.value.unshift(newRecord)
  }

  return {
    exportsHistory,
    addExportRecord
  }
})