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
    setTabs(tabs.map(tab => 
      tab.id === activeTabId ? { ...tab, url: searchUrl, title: `Google: ${query}`, googleSearchQuery: query, lastSearchType: 'google' } : tab
    ))
  }

  const handleAISearch = (query: string) => {
    const aiSearchUrl = `/api/search/ai?q=${encodeURIComponent(query)}`
    setTabs(tabs.map(tab => 
      tab.id === activeTabId ? { ...tab, url: aiSearchUrl, title: `AI: ${query}`, isAISearch: true, aiSearchQuery: query, lastSearchType: 'ai' } : tab
    ))
  }

  const toggleSplitView = () => {
    setTabs(tabs.map(tab => {
      if (tab.id === activeTabId) {
        if (!tab.splitView) {
          // If not in split view, enable it and set up AI and Google searches
          return { 
            ...tab, 
            splitView: true, 
            aiSearchQuery: tab.aiSearchQuery || tab.title,
            googleSearchQuery: tab.googleSearchQuery || tab.title,
            lastSearchType: tab.lastSearchType || 'google'
          }
        } else {
          // If already in split view, disable it
          return { ...tab, splitView: false }
        }
      }
      return tab
    }))
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
    if (tabs.find(tab => tab.id === id)?.isBookmarked) {
      setShortcuts(shortcuts.map(shortcut =>
        shortcut.id === id ? { ...shortcut, title: newTitle } : shortcut
      ))
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
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

