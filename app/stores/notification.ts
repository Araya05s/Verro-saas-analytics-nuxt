import { defineStore } from 'pinia'

export interface NotificationItem {
  id: string
  title: string
  message: string
  timestamp: string
  type?: 'info' | 'success' | 'warning'
  read: boolean
}

export const useNotificationStore = defineStore('notification', () => {
  // Mockup notifications array
  const notifications = ref<NotificationItem[]>([
    {
      id: '1',
      title: 'Database Sync Complete',
      message: 'All analytics metrics were updated 2m ago.',
      timestamp: '2m ago',
      type: 'success',
      read: false
    },
    {
      id: '2',
      title: 'New Enterprise Signup',
      message: 'Acme Corp subscribed to Scale Tier.',
      timestamp: '1h ago',
      type: 'info',
      read: false
    }
  ])

  const isOpen = ref(false)

  const hasUnread = computed(() => notifications.value.some((n) => !n.read))

  const toggleNotifications = () => {
    isOpen.value = !isOpen.value
  }

  const closeNotifications = () => {
    isOpen.value = false
  }

  const markAllAsRead = () => {
    notifications.value.forEach((n) => (n.read = true))
  }

  const addNotification = (item: Omit<NotificationItem, 'id' | 'read'>) => {
    notifications.value.unshift({
      ...item,
      id: crypto.randomUUID(),
      read: false
    })
  }

  return {
    notifications,
    isOpen,
    hasUnread,
    toggleNotifications,
    closeNotifications,
    markAllAsRead,
    addNotification
  }
})