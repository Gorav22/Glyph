import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlusCircle, Layers, X, Bookmark } from 'lucide-react'
import { Tab } from "../types"
import { AddShortcutDialog } from './add-shortcut-dialog'

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
  const shortcuts = tabs.filter(tab => tab.isShortcut)

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-4">
        <Button onClick={onAddTab} className="w-full mb-2">
          <PlusCircle className="mr-2 h-4 w-4" /> New Tab
        </Button>
        <AddShortcutDialog onAddShortcut={onAddShortcut} />
      </div>
      <ScrollArea className="flex-1">
        <div className="mb-4">
          <h3 className="px-4 py-2 text-sm font-semibold">Tabs</h3>
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
        <div>
          <h3 className="px-4 py-2 text-sm font-semibold">Shortcuts</h3>
          {shortcuts.map(shortcut => (
            <div
              key={shortcut.id}
              className="flex items-center p-2 cursor-pointer hover:bg-gray-700"
              onClick={() => onTabChange(shortcut.id)}
            >
              <Bookmark className="mr-2 h-4 w-4" />
              <div className="flex-1 truncate">{shortcut.title}</div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onRemoveShortcut(shortcut.id)
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

