export type PageType = 'home' | 'about' | 'blog' | 'profile' | 'etc'

export interface IconItem {
  id: PageType
  label: string
  description: string
  icon: React.ReactNode
}
