export interface Tab {
  id: string
  title: string
  url: string
  splitView: boolean
  isAISearch: boolean
  isBookmarked: boolean
  googleSearchQuery?: string
  aiSearchQuery?: string
  lastSearchType?: 'google' | 'ai'
}

export interface Shortcut {
  id: string
  title: string
  url: string
}

