'use client'

import { useState } from 'react'
import { Sidebar } from './components/sidebar'
import { MainContent } from '../components/main-content'
import { Tab } from './types'

export default function BrowserInterface() {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: '1', title: 'New Tab', url: 'about:blank', splitView: false, isAISearch: false }
  ])
  const [activeTabId, setActiveTabId] = useState('1')

  const activeTab = tabs.find(tab => tab.id === activeTabId) || tabs[0]

  const handleAddTab = () => {
    const newTab = {
      id: Date.now().toString(),
      title: 'New Tab',
      url: 'about:blank',
      splitView: false,
      isAISearch: false
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
      tab.id === activeTabId ? { ...tab, url, title: url, isAISearch: false } : tab
    ))
  }

  const handleSearch = (query: string) => {
    const searchUrl = `/api/search/google?q=${encodeURIComponent(query)}`
    handleUrlChange(searchUrl)
  }

  const handleAISearch = (query: string) => {
    const newTab = {
      id: Date.now().toString(),
      title: `AI: ${query}`,
      url: `/api/search/ai?q=${encodeURIComponent(query)}`,
      splitView: false,
      isAISearch: true
    }
    setTabs([...tabs, newTab])
    setActiveTabId(newTab.id)
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
    </div>
  )
}

