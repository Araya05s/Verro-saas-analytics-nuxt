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

// Reset pagination when data or search length changes
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
  <div class="w-full rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs">
        <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold tracking-wider">
          <tr>
            <th
              v-for="col in columns"
              :key="String(col.key)"
              @click="handleSort(String(col.key), col.sortable)"
              class="p-4 transition-colors select-none"
              :class="[col.sortable ? 'hover:bg-slate-100 hover:text-slate-900' : '']"
            >
              <div class="flex items-center gap-1.5">
                <span>{{ col.label }}</span>
                <template v-if="col.sortable">
                  <Icon
                    v-if="sortKey !== col.key"
                    name="heroicons:chevron-up-down"
                    class="size-4 text-slate-400"
                  />
                  <Icon
                    v-else
                    :name="sortOrder === 'asc' ? 'heroicons:chevron-up' : 'heroicons:chevron-down'"
                    class="size-4 text-blue-600"
                  />
                </template>
              </div>
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-slate-100">
          <tr
            v-for="row in paginatedData"
            :key="row.id || JSON.stringify(row)"
            @click="emit('row-click', row)"
            class="group transition-colors duration-150 hover:bg-slate-50/80"
          >
            <td
              v-for="col in columns"
              :key="String(col.key)"
              class="p-4 align-middle text-slate-700"
            >
              <slot :name="`cell-${String(col.key)}`" :row="row" :value="row[col.key]">
                {{ col.formatter ? col.formatter(row[col.key], row) : row[col.key] }}
              </slot>
            </td>
          </tr>
          <tr v-if="paginatedData.length === 0">
            <td :colspan="columns.length" class="p-8 text-center text-slate-400">
              No matching records found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 px-4 py-3 bg-slate-50/50 text-xs">
      <div class="flex items-center gap-2 text-slate-500">
        <span>Rows per page:</span>
        <select
          v-model="itemsPerPage"
          class="rounded-lg border border-slate-200 bg-white px-2 py-1 font-bold text-slate-800 outline-hidden focus:border-blue-500"
        >
          <option v-for="opt in pageSizeOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
        <span class="text-slate-400">
          (Showing {{ Math.min((currentPage - 1) * itemsPerPage + 1, sortedData.length) }} - {{ Math.min(currentPage * itemsPerPage, sortedData.length) }} of {{ sortedData.length }})
        </span>
      </div>

      <!-- Page Controls -->
      <div class="flex items-center gap-1">
        <button
          @click="currentPage = 1"
          :disabled="currentPage === 1"
          class="rounded-lg border border-slate-200 bg-white px-2 py-1 text-slate-600 shadow-xs hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white"
          title="First Page"
        >
          &lt;&lt;
        </button>

        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-slate-600 shadow-xs hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white"
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
              ? 'border-2 border-blue-600 bg-blue-50/50 text-blue-600 shadow-xs'
              : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
          ]"
        >
          {{ page }}
        </button>

        <button
          @click="currentPage++"
          :disabled="currentPage >= totalPages"
          class="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-slate-600 shadow-xs hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white"
          title="Next Page"
        >
          &gt;
        </button>

        <button
          @click="currentPage = totalPages"
          :disabled="currentPage >= totalPages"
          class="rounded-lg border border-slate-200 bg-white px-2 py-1 text-slate-600 shadow-xs hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white"
          title="Last Page"
        >
          &gt;&gt;
        </button>
      </div>
    </div>
  </div>
</template>