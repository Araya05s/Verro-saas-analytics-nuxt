<script setup lang="ts">
import { useBillingStore, type Invoice } from '~/stores/billing'
import TableData, { type Column } from '~/components/tableData.vue'
import AppModal from '~/components/appModal.vue'

const billingStore = useBillingStore()

const searchQuery = ref('')
const selectedInvoice = ref<Invoice | null>(null)
const isModalOpen = ref(false)

const columns: Column<Invoice>[] = [
  { key: 'id', label: 'Invoice ID', sortable: true },
  { key: 'client', label: 'Client', sortable: true },
  { key: 'date', label: 'Date', sortable: true },
  { key: 'amount', label: 'Amount', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'action', label: 'Action' }
]

const filteredInvoices = computed(() => {
  return billingStore.invoices.filter(
    (inv) =>
      inv.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      inv.client.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      inv.status.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const openInvoiceModal = (inv: Invoice) => {
  selectedInvoice.value = inv
  isModalOpen.value = true
}

const formatCurrency = (val: unknown): string => {
  return typeof val === 'number' ? val.toLocaleString() : String(val ?? '')
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-50">Invoice Management</h1>
        <p class="text-sm text-slate-500 dark:text-slate-300">Track, search, and review historical customer statements.</p>
      </div>
    </div>

    <div class="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-200 dark:border-accent-border bg-white dark:bg-slate-900 p-4 shadow-xs">
      <!-- Instant Reactive Search Field -->
      <div class="relative w-full sm:w-80">
        <Icon name="heroicons:magnifying-glass" class="absolute left-3 top-2.5 size-4 text-slate-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search name, Invoice ID, or amount..."
          class="w-full rounded-xl border border-slate-200 dark:border-accent-border bg-slate-50/50 dark:bg-accent/20 pl-9 pr-4 py-2 text-xs font-medium text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder:text-slate-300 outline-hidden transition-all focus:border-accent focus:bg-white dark:focus:bg-accent/20 focus:ring-2 focus:ring-accent"
        />
      </div>
    </div>
    <div class="grid grid-cols-1 gap-8">
      <TableData
        :columns="columns"
        :data="filteredInvoices"
        :page-size-options="[5, 10, 20, 50]"
      >
        <template #cell-id="{ value }">
          <span class="font-mono font-bold text-slate-900 dark:text-slate-50 group-hover:text-accent dark:group-hover:text-slate-50 transition-colors">
            {{ value }}
          </span>
        </template>
  
        <template #cell-amount="{ value }">
          <span class="font-extrabold text-slate-900 dark:text-slate-50">${{ formatCurrency(value) }}</span>
        </template>
  
        <template #cell-status="{ value }">
          <span
            class="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold"
            :class="{
              'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 border border-transparent dark:border-emerald-300': value === 'Paid',
              'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-transparent dark:border-amber-300': value === 'Pending',
              'bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-300 border border-transparent dark:border-red-300': value === 'Overdue'
            }"
          >
            {{ value }}
          </span>
        </template>
  
        <template #cell-action="{ row }">
          <button
            @click.stop="openInvoiceModal(row)"
            class="inline-flex items-center gap-1.5 rounded-lg bg-accent dark:bg-accent/20 px-3 py-1.5 text-xs font-bold text-slate-50 shadow-xs transition-all hover:bg-accent dark:hover:bg-accent/40 border border-transparent dark:border-accent-border active:scale-95"
          >
            <Icon name="heroicons:eye-20-solid" class="size-3.5" />
            View
          </button>
        </template>
      </TableData>
    </div>

    <AppModal v-model="isModalOpen" max-width="lg">
      <template #header>
        <div v-if="selectedInvoice" class="flex items-center gap-2">
          <div class="flex size-8 rounded-lg bg-accent-light dark:bg-accent/20 items-center justify-center text-accent">
            <Icon name="heroicons:document-text-20-solid" class="size-5" />
          </div>
          <div>
            <h3 class="text-base font-bold text-slate-900 dark:text-slate-50">{{ selectedInvoice.id }}</h3>
            <p class="text-[11px] text-slate-400 dark:text-slate-300">Statement breakdown</p>
          </div>
        </div>
      </template>

      <div v-if="selectedInvoice" class="space-y-4">
        <div class="grid grid-cols-2 gap-4 rounded-xl bg-accent-light dark:bg-accent/5 border border-transparent dark:border-accent-border p-3 text-xs">
          <div>
            <span class="text-[10px] font-bold text-slate-400 dark:text-slate-300 uppercase">Client</span>
            <p class="font-bold text-slate-800 dark:text-slate-200">{{ selectedInvoice.client }}</p>
          </div>
          <div>
            <span class="text-[10px] font-bold text-slate-400 dark:text-slate-300 uppercase">Status</span>
            <div>
              <span
                class="inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold"
                :class="{
                  'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 border border-transparent dark:border-emerald-300': selectedInvoice.status === 'Paid',
                  'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-transparent dark:border-amber-300': selectedInvoice.status === 'Pending',
                  'bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-300 border border-transparent dark:border-red-300': selectedInvoice.status === 'Overdue'
                }"
              >
                {{ selectedInvoice.status }}
              </span>
            </div>
          </div>
          <div>
            <span class="text-[10px] font-bold text-slate-400 dark:text-slate-300 uppercase">Issue Date</span>
            <p class="font-medium text-slate-700 dark:text-slate-200">{{ selectedInvoice.date }}</p>
          </div>
          <div>
            <span class="text-[10px] font-bold text-slate-400 dark:text-slate-300 uppercase">Due Date</span>
            <p class="font-medium text-slate-700 dark:text-slate-200">{{ selectedInvoice.dueDate }}</p>
          </div>
        </div>

        <div>
          <span class="text-xs font-bold text-slate-900 dark:text-slate-50 mb-2 block">Line Items</span>
          <div class="rounded-xl border border-slate-100 dark:border-accent-border overflow-hidden">
            <table class="w-full text-left text-xs">
              <thead class="bg-accent-light dark:bg-accent/10 text-slate-400 dark:text-slate-300 uppercase font-semibold">
                <tr>
                  <th class="p-2.5">Item</th>
                  <th class="p-2.5 text-center">Qty</th>
                  <th class="p-2.5 text-right">Price</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-slate-700 dark:text-slate-300">
                <tr v-for="(item, idx) in selectedInvoice.items" :key="idx">
                  <td class="p-2.5 font-medium">{{ item.description }}</td>
                  <td class="p-2.5 text-center">{{ item.qty }}</td>
                  <td class="p-2.5 text-right font-bold">${{ item.unitPrice }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Total -->
        <div class="flex items-center justify-between rounded-xl bg-blue-50/50 dark:bg-accent/10 p-4 border border-blue-100 dark:border-accent-border">
          <span class="text-xs font-bold text-accent-dark">Total Billed</span>
          <span class="text-xl font-extrabold text-accent">${{ selectedInvoice.amount.toLocaleString() }}</span>
        </div>
      </div>

      <!-- Footer Slot -->
      <template #footer="{ close }">
        <button
          @click="close"
          class="rounded-xl border border-slate-200 dark:border-accent-border px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-accent/20 transition-colors"
        >
          Close
        </button>
      </template>
    </AppModal>
  </div>
</template>