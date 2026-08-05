import type {NavItem} from '~/types/navigation'

export const sidebarNavigation: NavItem[] = [
  {
    title: 'Dashboard',
    to: '/',
    icon: 'heroicons:squares-2x2-solid',
  },
  {
    title: 'Analytics',
    icon: 'heroicons:chart-bar-square-solid',
    children: [
      {
        title: 'Overview',
        to: '/analytics',
      },
      {
        title: 'Revenue',
        to: '/analytics/revenue',
      },
      {
        title: 'Users',
        to: '/analytics/users',
      },
    ],
  },
  {
    title: 'Customers',
    to: '/customers',
    icon: 'heroicons:users-solid',
  },
  {
    title: 'Billing',
    icon: 'heroicons:credit-card-solid',
    children: [
      {
        title: 'Plans',
        to: '/billing',
      },
      {
        title: 'Invoice',
        to: '/billing/invoices',
      },
    ],
  },
  {
    title: 'Reports',
    icon: 'heroicons:document-chart-bar-solid',
    to: '/reports',
  },
  {
    title: 'Settings',
    icon: 'heroicons:cog-6-tooth-solid',
    children: [
      {
        title: 'Profile',
        to: '/settings/profile',
      },
      // WIP: The dark mode is still in progress. Not all pages have been implemented with dark mode yet.
      {
        title: 'Appearances',
        to: '/settings/appearances',
      },
    ],
  },
]