import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlusCircle, Layers, X } from 'lucide-react'
import { Tab } from "../types"

interface SidebarProps {
  tabs: Tab[]
  activeTabId: string
  onAddTab: () => void
  onCloseTab: (id: string) => void
  onTabChange: (id: string) => void
  onToggleSplitView: () => void
}

export function Sidebar({ 
  tabs, 
  activeTabId, 
  onAddTab, 
  onCloseTab, 
  onTabChange, 
  onToggleSplitView 
}: SidebarProps) {
  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-4">
        <Button onClick={onAddTab} className="w-full">
          <PlusCircle className="mr-2 h-4 w-4" /> New Tab
        </Button>
      </div>
      <ScrollArea className="flex-1">
        {tabs.map(tab => (
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
      </ScrollArea>
      <div className="p-4">
        <Button onClick={onToggleSplitView} className="w-full">
          <Layers className="mr-2 h-4 w-4" /> Toggle Split View
        </Button>
      </div>
    </div>
  )
}

