<script setup lang="ts" generic="T extends Record<string, any>">
export interface Column<T> {
  key: keyof T | string
  label: string
  sortable?: boolean
  formatter?: (value: any, row: T) => string | number
}

const props = withDefaults(
  defineProps<{
    columns: Column<T>[]
    data: T[]
    pageSizeOptions?: number[]
  }>(),
  {
    pageSizeOptions: () => [5, 10, 20, 50]
  }
)

const emit = defineEmits<{
  (e: 'row-click', row: T): void
}>()

const sortKey = ref<string>('')
const sortOrder = ref<'asc' | 'desc'>('asc')

const currentPage = ref(1)
const itemsPerPage = ref(props.pageSizeOptions[0] || 5)

// Helper: Safely converts any key string to a valid, sanitized identifier for slots/keys
const sanitizeKey = (key: keyof T | string): string => {
  return String(key)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '_')
}

// Helper to safely extract row values without throwing on undefined
const getCellValue = (row: T, key: keyof T | string) => {
  if (!row) return ''
  return row[key as string]
}

// Reset pagination when data length changes
watch(
  () => props.data.length,
  () => {
    currentPage.value = 1
  }
)

const handleSort = (key: string, sortable?: boolean) => {
  if (!sortable) return
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

const sortedData = computed(() => {
  if (!sortKey.value) return props.data

  return [...props.data].sort((a, b) => {
    const valA = a[sortKey.value]
    const valB = b[sortKey.value]

    if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1
    if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })
})

// Data pagination
const totalPages = computed(() => Math.ceil(sortedData.value.length / itemsPerPage.value) || 1)

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return sortedData.value.slice(start, start + itemsPerPage.value)
})

const displayedPages = computed(() => {
  const pages: number[] = []
  const maxButtons = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxButtons / 2))
  let end = Math.min(totalPages.value, start + maxButtons - 1)

  if (end - start + 1 < maxButtons) {
    start = Math.max(1, end - maxButtons + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})
</script>

<template>
  <div class="w-full rounded-2xl border border-slate-200 dark:border-accent-border bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs">
        <thead class="bg-slate-50 dark:bg-accent/10 border-b border-slate-200 dark:border-accent-border text-slate-500 dark:text-slate-200 uppercase font-bold tracking-wider">
          <tr>
            <th
              v-for="(col, colIndex) in columns"
              :key="`th-${sanitizeKey(col.key)}-${colIndex}`"
              @click="handleSort(String(col.key), col.sortable)"
              class="p-4 transition-colors select-none"
              :class="[col.sortable ? 'hover:bg-slate-100 dark:hover:bg-accent/20 hover:text-slate-900 dark:hover:text-slate-50' : '']"
            >
              <div class="flex items-center gap-1.5">
                <span>{{ col.label }}</span>
                <template v-if="col.sortable">
                  <Icon
                    v-if="sortKey !== col.key"
                    name="heroicons:chevron-up-down"
                    class="size-4 text-slate-400 dark:text-slate-100"
                  />
                  <Icon
                    v-else
                    :name="sortOrder === 'asc' ? 'heroicons:chevron-up' : 'heroicons:chevron-down'"
                    class="size-4 text-accent dark:text-accent/20"
                  />
                </template>
              </div>
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-slate-100 dark:divide-accent">
          <tr
            v-for="(row, rowIndex) in paginatedData"
            :key="`row-${rowIndex}`"
            @click="emit('row-click', row)"
            class="group transition-colors duration-150 hover:bg-slate-50/80 dark:hover:bg-accent/30 text-slate-900 dark:text-slate-50"
          >
            <td
              v-for="(col, colIndex) in columns"
              :key="`td-${sanitizeKey(col.key)}-${colIndex}`"
              class="p-4 align-middle text-slate-700 dark:text-slate-200"
            >
              <slot :name="`cell-${sanitizeKey(col.key)}`" :row="row" :value="getCellValue(row, col.key)">
                {{ col.formatter ? col.formatter(getCellValue(row, col.key), row) : getCellValue(row, col.key) }}
              </slot>
            </td>
          </tr>
          <tr v-if="paginatedData.length === 0">
            <td :colspan="columns.length" class="p-8 text-center text-slate-400 dark:text-slate-200">
              No matching records found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 dark:border-accent-border/80 px-4 py-3 bg-slate-50/50 dark:bg-accent/10 text-xs">
      <div class="flex items-center gap-2 text-slate-500 dark:text-slate-300">
        <span>Rows per page:</span>
        <select
          v-model="itemsPerPage"
          class="rounded-lg border border-slate-200 dark:border-accent-border/50 bg-white dark:bg-accent/10 px-2 py-1 font-bold text-slate-800 dark:text-slate-200 outline-hidden focus:border-accent-border"
        >
          <option v-for="opt in pageSizeOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
        <span class="text-slate-400 dark:text-slate-200">
          (Showing {{ Math.min((currentPage - 1) * itemsPerPage + 1, sortedData.length) }} - {{ Math.min(currentPage * itemsPerPage, sortedData.length) }} of {{ sortedData.length }})
        </span>
      </div>

      <!-- Page Controls -->
      <div class="flex items-center gap-1">
        <button
          @click="currentPage = 1"
          :disabled="currentPage === 1"
          class="rounded-lg border border-slate-200 dark:border-accent-border bg-white dark:bg-accent/10 px-2 py-1 text-slate-600 dark:text-slate-400 shadow-xs hover:bg-slate-50 dark:hover:bg-accent/20 disabled:opacity-30 disabled:hover:bg-white dark:disabled:hover:bg-accent/10"
          title="First Page"
        >
          &lt;&lt;
        </button>

        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="rounded-lg border border-slate-200 dark:border-accent-border bg-white dark:bg-accent/5 px-2.5 py-1 text-slate-600 dark:text-slate-200 shadow-xs hover:bg-slate-50 dark:hover:bg-accent disabled:opacity-30 disabled:hover:bg-white dark:disabled:hover:bg-accent-20"
          title="Previous Page"
        >
          &lt;
        </button>

        <button
          v-for="page in displayedPages"
          :key="page"
          @click="currentPage = page"
          class="min-w-8 rounded-lg py-1 px-2.5 text-xs font-bold transition-all"
          :class="[
            currentPage === page
              ? 'border-2 border-accent-border dark:border-accent-border bg-blue-50/50 dark:bg-accent/10 text-accent shadow-xs'
              : 'border border-slate-200 dark:border-accent-border bg-white dark:bg-accent/10 text-slate-700 dark:text-accent hover:bg-slate-50 dark:hover:bg-accent/20'
          ]"
        >
          {{ page }}
        </button>

        <button
          @click="currentPage++"
          :disabled="currentPage >= totalPages"
          class="rounded-lg border border-slate-200 dark:border-accent-border bg-white dark:bg-accent/5 px-2.5 py-1 text-slate-600 dark:text-slate-200 shadow-xs hover:bg-slate-50 dark:hover:bg-accent disabled:opacity-30 disabled:hover:bg-white dark:disabled:hover:bg-accent-20"
          title="Next Page"
        >
          &gt;
        </button>

        <button
          @click="currentPage = totalPages"
          :disabled="currentPage >= totalPages"
          class="rounded-lg border border-slate-200 dark:border-accent-border bg-white dark:bg-accent/10 px-2 py-1 text-slate-600 dark:text-slate-400 shadow-xs hover:bg-slate-50 dark:hover:bg-accent/20 disabled:opacity-30 disabled:hover:bg-white dark:disabled:hover:bg-accent/10"
          title="Last Page"
        >
          &gt;&gt;
        </button>
      </div>
    </div>
  </div>
</template>