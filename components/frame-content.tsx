import { ExternalLink } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useState } from 'react'
interface FrameContentProps {
  url: string
  title: string
}

export function FrameContent({ url, title }: FrameContentProps) {
  const [iframeError, setIframeError] = useState(false)

  const handleIframeError = () => {
    setIframeError(true)
  }

  if (iframeError) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="max-w-md p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">Unable to display content</h2>
          <p className="text-muted-foreground mb-6">
            This website cannot be displayed in the browser frame due to security settings.
          </p>
          <Button onClick={() => window.open(url, '_blank')}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Open in New Tab
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <iframe
      src={url}
      title={title}
      className="w-full h-[700px] border-none"
      sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      referrerPolicy="no-referrer"
      onError={handleIframeError}
    />
  )
}

