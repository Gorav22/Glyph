import { Globe, Plus } from 'lucide-react'
import { Tab } from '../types'

interface SidebarProps {
  tabs: Tab[]
  activeTab: Tab | null
  onTabChange: (tab: Tab) => void
  onAddTab: () => void
}

export function Sidebar({ tabs, activeTab, onTabChange, onAddTab }: SidebarProps) {
  return (
    <div className="w-16 bg-gray-900 text-white flex flex-col items-center py-4">
      {tabs.map((tab) => (
        <button
          key={tab._id}
          className={`w-12 h-12 mb-2 rounded-full flex items-center justify-center ${
            activeTab?._id === tab._id ? 'bg-blue-500' : 'bg-gray-700 hover:bg-gray-600'
          }`}
          onClick={() => onTabChange(tab)}
        >
          <Globe size={24} />
        </button>
      ))}
      <button
        className="w-12 h-12 mt-2 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center"
        onClick={onAddTab}
      >
        <Plus size={24} />
      </button>
    </div>
  )
}

