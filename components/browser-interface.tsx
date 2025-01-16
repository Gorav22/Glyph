'use client'

import { useState } from 'react'
import { Sidebar } from './components/sidebar'
import { MainContent } from './components/main-content'
import { Tab } from './types'

export default function BrowserInterface() {
  const [activeTab, setActiveTab] = useState<Tab>({
    id: '1',
    title: 'New Tab',
    url: 'https://www.example.com'
  })

  const [tabs, setTabs] = useState<Tab[]>([
    { id: '1', title: 'New Tab', url: 'https://www.example.com' },
    { id: '2', title: 'React', url: 'https://reactjs.org' },
    { id: '3', title: 'Vercel', url: 'https://vercel.com' }
  ])

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab)
  }

  const handleAddTab = () => {
    const newTab: Tab = {
      id: (tabs.length + 1).toString(),
      title: 'New Tab',
      url: 'https://www.example.com'
    }
    setTabs([...tabs, newTab])
    setActiveTab(newTab)
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} onAddTab={handleAddTab} />
      <MainContent activeTab={activeTab} />
    </div>
  )
}

