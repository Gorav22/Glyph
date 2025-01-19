import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlusCircle, Layers, X, Star } from 'lucide-react'
import { Tab, Shortcut } from "../types"
import { TabContextMenu } from "./tab-context-menu"

interface SidebarProps {
  tabs: Tab[]
  activeTabId: string
  shortcuts: Shortcut[]
  onAddTab: () => void
  onCloseTab: (id: string) => void
  onTabChange: (id: string) => void
  onToggleSplitView: () => void
  onShortcutClick: (url: string) => void
  onRenameTab: (id: string, newTitle: string) => void
}

export function Sidebar({ 
  tabs, 
  activeTabId, 
  shortcuts,
  onAddTab, 
  onCloseTab, 
  onTabChange, 
  onToggleSplitView,
  onShortcutClick,
  onRenameTab
}: SidebarProps) {
  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col h-screen">
      <div className="p-4">
        <Button onClick={onAddTab} className="w-full">
          <PlusCircle className="mr-2 h-4 w-4" /> New Tab
        </Button>
      </div>
      <ScrollArea className="flex-grow overflow-y-auto">
        <div className="p-2">
          {tabs.map(tab => (
            <TabContextMenu
              key={tab.id}
              onRename={(newTitle) => onRenameTab(tab.id, newTitle)}
              onClose={() => onCloseTab(tab.id)}
            >
              <div
                className={`flex items-center p-2 cursor-pointer hover:bg-gray-700 rounded-md mb-1 ${
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
            </TabContextMenu>
          ))}
          {shortcuts.length > 0 && (
            <div className="mt-4">
              <h3 className="px-2 py-1 text-sm font-semibold">Shortcuts</h3>
              {shortcuts.map(shortcut => (
                <div
                  key={shortcut.id}
                  className="flex items-center p-2 cursor-pointer hover:bg-gray-700 rounded-md mb-1"
                  onClick={() => onShortcutClick(shortcut.url)}
                >
                  <Star className="mr-2 h-4 w-4" />
                  <div className="flex-1 truncate">{shortcut.title}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-gray-700">
        <Button onClick={onToggleSplitView} className="w-full">
          <Layers className="mr-2 h-4 w-4" /> Toggle Split View
        </Button>
      </div>
    </div>
  )
}

