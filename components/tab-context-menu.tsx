import * as React from "react"
import { Edit2, X } from 'lucide-react'

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Input } from "@/components/ui/input"

interface TabContextMenuProps {
  children: React.ReactNode
  onRename: (newTitle: string) => void
  onClose: () => void
}

export function TabContextMenu({ children, onRename, onClose }: TabContextMenuProps) {
  const [isRenaming, setIsRenaming] = React.useState(false)
  const [newTitle, setNewTitle] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleRenameClick = (event: Event) => {
    event.preventDefault()
    setIsRenaming(true)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  const handleRenameSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (newTitle.trim()) {
      onRename(newTitle.trim())
      setIsRenaming(false)
      setNewTitle("")
    }
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        {isRenaming ? (
          <form onSubmit={handleRenameSubmit} className="p-1">
            <Input
              ref={inputRef}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Enter new title"
              className="w-full"
            />
          </form>
        ) : (
          <>
            <ContextMenuItem onSelect={handleRenameClick}>
              <Edit2 className="mr-2 h-4 w-4" />
              Rename
            </ContextMenuItem>
            <ContextMenuItem onSelect={onClose}>
              <X className="mr-2 h-4 w-4" />
              Close
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  )
}

