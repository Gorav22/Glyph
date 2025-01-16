'use client'

import { useState } from 'react'
import { Sidebar } from './components/sidebar'
import { MainContent } from '../components/main-content'
import { SearchResults } from './components/search-results'
import { Tab } from './types'

export default function BrowserInterface() {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: '1', title: 'New Tab', url: 'about:blank', splitView: false }
  ])
  const [activeTabId, setActiveTabId] = useState('1')
  const [showAISearch, setShowAISearch] = useState(false)
  const [aiSearchQuery, setAISearchQuery] = useState('')

  const activeTab = tabs.find(tab => tab.id === activeTabId) || tabs[0]

  const handleAddTab = () => {
    const newTab = {
      id: Date.now().toString(),
      title: 'New Tab',
      url: 'about:blank',
      splitView: false
    }
    setTabs([...tabs, newTab])
    setActiveTabId(newTab.id)
  }

  const handleCloseTab = (id: string) => {
    const newTabs = tabs.filter(tab => tab.id !== id)
    setTabs(newTabs)
    if (id === activeTabId && newTabs.length > 0) {
      setActiveTabId(newTabs[newTabs.length - 1].id)
    }
  }

  const handleTabChange = (id: string) => {
    setActiveTabId(id)
  }

  const handleUrlChange = (url: string) => {
    setTabs(tabs.map(tab => 
      tab.id === activeTabId ? { ...tab, url, title: url } : tab
    ))
  }

  const handleSearch = (query: string) => {
    const searchUrl = `/api/search/google?q=${encodeURIComponent(query)}`
    handleUrlChange(searchUrl)
  }

  const handleAISearch = (query: string) => {
    setShowAISearch(true)
    setAISearchQuery(query)
  }

  const toggleSplitView = () => {
    setTabs(tabs.map(tab =>
      tab.id === activeTabId ? { ...tab, splitView: !tab.splitView } : tab
    ))
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        tabs={tabs}
        activeTabId={activeTabId}
        onAddTab={handleAddTab}
        onCloseTab={handleCloseTab}
        onTabChange={handleTabChange}
        onToggleSplitView={toggleSplitView}
      />
      <MainContent 
        activeTab={activeTab}
        onUrlChange={handleUrlChange}
        onSearch={handleSearch}
        onAISearch={handleAISearch}
      />
      {showAISearch && (
        <SearchResults 
          query={aiSearchQuery} 
          onClose={() => setShowAISearch(false)} 
        />
      )}
    </div>
  )
}

