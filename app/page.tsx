'use client'

import { useState } from 'react'
import { Sidebar } from './components/sidebar'
import { MainContent } from '../components/main-content'
import { Tab, Shortcut } from './types'

export default function BrowserInterface() {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: '1', title: 'New Tab', url: 'about:blank', splitView: false, isAISearch: false, isBookmarked: false }
  ])
  const [activeTabId, setActiveTabId] = useState('1')
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([])

  const activeTab = tabs.find(tab => tab.id === activeTabId) || tabs[0]

  const handleAddTab = () => {
    const newTab = {
      id: Date.now().toString(),
      title: 'New Tab',
      url: 'about:blank',
      splitView: false,
      isAISearch: false,
      isBookmarked: false
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
      isAISearch: true,
      isBookmarked: false
    }
    setTabs([...tabs, newTab])
    setActiveTabId(newTab.id)
  }

  const toggleSplitView = () => {
    setTabs(tabs.map(tab =>
      tab.id === activeTabId ? { ...tab, splitView: !tab.splitView } : tab
    ))
  }

  const toggleBookmark = () => {
    const updatedTabs = tabs.map(tab =>
      tab.id === activeTabId ? { ...tab, isBookmarked: !tab.isBookmarked } : tab
    )
    setTabs(updatedTabs)

    const activeTabUpdated = updatedTabs.find(tab => tab.id === activeTabId)!
    if (activeTabUpdated.isBookmarked) {
      setShortcuts([...shortcuts, { id: activeTabId, title: activeTabUpdated.title, url: activeTabUpdated.url }])
    } else {
      setShortcuts(shortcuts.filter(shortcut => shortcut.id !== activeTabId))
    }
  }

  const handleShortcutClick = (url: string) => {
    handleUrlChange(url)
  }

  const handleRenameTab = (id: string, newTitle: string) => {
    setTabs(tabs.map(tab =>
      tab.id === id ? { ...tab, title: newTitle } : tab
    ))
    // Update shortcut if the renamed tab is bookmarked
    if (tabs.find(tab => tab.id === id)?.isBookmarked) {
      setShortcuts(shortcuts.map(shortcut =>
        shortcut.id === id ? { ...shortcut, title: newTitle } : shortcut
      ))
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        tabs={tabs}
        activeTabId={activeTabId}
        shortcuts={shortcuts}
        onAddTab={handleAddTab}
        onCloseTab={handleCloseTab}
        onTabChange={handleTabChange}
        onToggleSplitView={toggleSplitView}
        onShortcutClick={handleShortcutClick}
        onRenameTab={handleRenameTab}
      />
      <MainContent 
        activeTab={activeTab}
        onUrlChange={handleUrlChange}
        onSearch={handleSearch}
        onAISearch={handleAISearch}
        onToggleBookmark={toggleBookmark}
      />
    </div>
  )
}

