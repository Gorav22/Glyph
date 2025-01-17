'use client'

import { useState } from 'react'
import { Sidebar } from './components/sidebar'
import { MainContent } from '../components/main-content'
import { AuthForm } from '../components/auth-form'
import { Tab } from './types'

export default function BrowserInterface() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
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

  const handleAddShortcut = (title: string, url: string) => {
    const newShortcut = {
      id: Date.now().toString(),
      title,
      url,
      splitView: false,
      isAISearch: false,
      isShortcut: true
    }
    setTabs([...tabs, newShortcut])
  }

  const handleRemoveShortcut = (id: string) => {
    setTabs(tabs.filter(tab => tab.id !== id))
  }

  const handleReload = () => {
    // Re-fetch the current URL
    handleUrlChange(activeTab.url)
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <AuthForm onAuthenticated={() => setIsAuthenticated(true)} />
      </div>
    )
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
        onAddShortcut={handleAddShortcut}
        onRemoveShortcut={handleRemoveShortcut}
      />
      <MainContent 
        activeTab={activeTab}
        onUrlChange={handleUrlChange}
        onSearch={handleSearch}
        onAISearch={handleAISearch}
        onReload={handleReload}
      />
    </div>
  )
}

