import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlusCircle, Layers, X, Bookmark, ExternalLink } from 'lucide-react'
import { Tab } from "../types"
import { useState } from 'react'
import { Input } from "@/components/ui/input"

interface SidebarProps {
  tabs: Tab[]
  activeTabId: string
  onAddTab: () => void
  onCloseTab: (id: string) => void
  onTabChange: (id: string) => void
  onToggleSplitView: () => void
  onAddShortcut: (title: string, url: string) => void
  onRemoveShortcut: (id: string) => void
}

export function Sidebar({ 
  tabs, 
  activeTabId, 
  onAddTab, 
  onCloseTab, 
  onTabChange, 
  onToggleSplitView,
  onAddShortcut,
  onRemoveShortcut
}: SidebarProps) {
  const [showShortcutForm, setShowShortcutForm] = useState(false)
  const [shortcutTitle, setShortcutTitle] = useState('')
  const [shortcutUrl, setShortcutUrl] = useState('')

  const handleAddShortcut = (e: React.FormEvent) => {
    e.preventDefault()
    if (shortcutTitle && shortcutUrl) {
      onAddShortcut(shortcutTitle, shortcutUrl)
      setShortcutTitle('')
      setShortcutUrl('')
      setShowShortcutForm(false)
    }
  }

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-4">
        <Button onClick={onAddTab} className="w-full mb-2">
          <PlusCircle className="mr-2 h-4 w-4" /> New Tab
        </Button>
        <Button onClick={() => setShowShortcutForm(!showShortcutForm)} className="w-full">
          <Bookmark className="mr-2 h-4 w-4" /> {showShortcutForm ? 'Cancel' : 'Add Shortcut'}
        </Button>
      </div>
      {showShortcutForm && (
        <form onSubmit={handleAddShortcut} className="p-4 bg-gray-700">
          <Input
            type="text"
            placeholder="Shortcut Title"
            value={shortcutTitle}
            onChange={(e) => setShortcutTitle(e.target.value)}
            className="mb-2"
          />
          <Input
            type="url"
            placeholder="https://example.com"
            value={shortcutUrl}
            onChange={(e) => setShortcutUrl(e.target.value)}
            className="mb-2"
          />
          <Button type="submit" className="w-full">Add Shortcut</Button>
        </form>
      )}
      <ScrollArea className="flex-1">
        <div className="p-2">
          <h2 className="text-sm font-semibold mb-2">Tabs</h2>
          {tabs.filter(tab => !tab.isShortcut).map(tab => (
            <div
              key={tab.id}
              className={`flex items-center p-2 cursor-pointer hover:bg-gray-700 ${
                tab.id === activeTabId ? 'bg-gray-700' : ''
              }`}
              onClick={() => onTabChange(tab.id)}
            >
              <div className="flex-1 truncate">{tab.title}</div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onCloseTab(tab.id)
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <div className="p-2">
          <h2 className="text-sm font-semibold mb-2">Shortcuts</h2>
          {tabs.filter(tab => tab.isShortcut).map(tab => (
            <div
              key={tab.id}
              className="flex items-center p-2 cursor-pointer hover:bg-gray-700"
              onClick={() => onTabChange(tab.id)}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              <div className="flex-1 truncate">{tab.title}</div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onRemoveShortcut(tab.id)
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4">
        <Button onClick={onToggleSplitView} className="w-full">
          <Layers className="mr-2 h-4 w-4" /> Toggle Split View
        </Button>
      </div>
    </div>
  )
}

