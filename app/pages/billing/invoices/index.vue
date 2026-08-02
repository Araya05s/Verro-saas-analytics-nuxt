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
        <h1 class="text-2xl font-bold text-slate-900">Invoice Management</h1>
        <p class="text-sm text-slate-500">Track, search, and review historical customer statements.</p>
      </div>
    </div>

    <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
      <div class="relative w-full sm:w-80">
        <Icon name="heroicons:magnifying-glass" class="absolute left-3 top-2.5 size-4 text-slate-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by ID, client, or status..."
          class="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-4 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 outline-hidden focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
        />
      </div>
    </div>

    <TableData
      :columns="columns"
      :data="filteredInvoices"
      :page-size-options="[5, 10, 20, 50]"
    >
      <template #cell-id="{ value }">
        <span class="font-mono font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
          {{ value }}
        </span>
      </template>

      <template #cell-amount="{ value }">
        <span class="font-extrabold text-slate-900">${{ formatCurrency(value) }} }}</span>
      </template>

      <template #cell-status="{ value }">
        <span
          class="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold"
          :class="{
            'bg-emerald-50 text-emerald-600': value === 'Paid',
            'bg-amber-50 text-amber-700': value === 'Pending',
            'bg-red-50 text-red-600': value === 'Overdue'
          }"
        >
          {{ value }}
        </span>
      </template>

      <template #cell-action="{ row }">
        <button
          @click.stop="openInvoiceModal(row)"
          class="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
        >
          <Icon name="heroicons:eye-20-solid" class="size-3.5" />
          View
        </button>
      </template>
    </TableData>

    <AppModal v-model="isModalOpen" max-width="lg">
      <template #header>
        <div v-if="selectedInvoice" class="flex items-center gap-2">
          <div class="flex size-8 rounded-lg bg-blue-50 items-center justify-center text-blue-600">
            <Icon name="heroicons:document-text-20-solid" class="size-5" />
          </div>
          <div>
            <h3 class="text-base font-bold text-slate-900">{{ selectedInvoice.id }}</h3>
            <p class="text-[11px] text-slate-400">Statement breakdown</p>
          </div>
        </div>
      </template>

      <div v-if="selectedInvoice" class="space-y-4">
        <div class="grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-3 text-xs">
          <div>
            <span class="text-[10px] font-bold text-slate-400 uppercase">Client</span>
            <p class="font-bold text-slate-800">{{ selectedInvoice.client }}</p>
          </div>
          <div>
            <span class="text-[10px] font-bold text-slate-400 uppercase">Status</span>
            <div>
              <span
                class="inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold"
                :class="{
                  'bg-emerald-50 text-emerald-600': selectedInvoice.status === 'Paid',
                  'bg-amber-50 text-amber-700': selectedInvoice.status === 'Pending',
                  'bg-red-50 text-red-600': selectedInvoice.status === 'Overdue'
                }"
              >
                {{ selectedInvoice.status }}
              </span>
            </div>
          </div>
          <div>
            <span class="text-[10px] font-bold text-slate-400 uppercase">Issue Date</span>
            <p class="font-medium text-slate-700">{{ selectedInvoice.date }}</p>
          </div>
          <div>
            <span class="text-[10px] font-bold text-slate-400 uppercase">Due Date</span>
            <p class="font-medium text-slate-700">{{ selectedInvoice.dueDate }}</p>
          </div>
        </div>

        <div>
          <span class="text-xs font-bold text-slate-900 mb-2 block">Line Items</span>
          <div class="rounded-xl border border-slate-100 overflow-hidden">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-slate-400 uppercase font-semibold">
                <tr>
                  <th class="p-2.5">Item</th>
                  <th class="p-2.5 text-center">Qty</th>
                  <th class="p-2.5 text-right">Price</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-slate-700">
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
        <div class="flex items-center justify-between rounded-xl bg-blue-50/50 p-4 border border-blue-100">
          <span class="text-xs font-bold text-blue-900">Total Billed</span>
          <span class="text-xl font-extrabold text-blue-600">${{ selectedInvoice.amount.toLocaleString() }}</span>
        </div>
      </div>

      <!-- Footer Slot -->
      <template #footer="{ close }">
        <button
          @click="close"
          class="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Close
        </button>
      </template>
    </AppModal>
  </div>
</template>