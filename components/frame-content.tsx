'use client'

import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

interface FrameContentProps {
  url: string
  title: string
}

export function FrameContent({ url, title }: FrameContentProps) {
  const handleOpenInNewTab = () => {
    window.open(url, '_blank')
  }

  return (
    <div className="relative w-full h-full">
      <iframe
        src={url}
        className="w-full h-full border-none"
        title={title}
        onError={(e) => {
          // Force a re-render to show the fallback
          e.currentTarget.style.display = 'none'
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center bg-background p-6" 
           style={{ display: 'none' }}
           onError={() => {
             // Show this div when iframe fails
             (event.target as HTMLDivElement).style.display = 'flex'
           }}>
        <div className="max-w-md space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Unable to display content</AlertTitle>
            <AlertDescription>
              This website cannot be displayed in the browser frame due to security restrictions.
            </AlertDescription>
          </Alert>
          <div className="flex flex-col items-center gap-4">
            <Button onClick={handleOpenInNewTab}>
              Open in New Tab
            </Button>
            {url.includes('google.com') && (
              <div className="w-full max-w-2xl bg-muted rounded-lg p-4">
                <div className="flex items-center justify-center h-32 bg-background rounded border">
                  <p className="text-muted-foreground">Google Search Preview</p>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-4 w-3/4 bg-muted-foreground/20 rounded" />
                  <div className="h-4 w-1/2 bg-muted-foreground/20 rounded" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

