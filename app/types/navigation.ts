export interface NavItem {
    title: string
    to?: string
    icon?: string
    roles?: string
    children?: NavItem[]
}