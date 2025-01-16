import { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react'
import { Tab } from '../types'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface MainContentProps {
  activeTab: Tab
  onUrlChange: (url: string) => void
  onSearch: (query: string) => void
  onAISearch: (query: string) => void
}

export function MainContent({ activeTab, onUrlChange, onSearch, onAISearch }: MainContentProps) {
  const [inputValue, setInputValue] = useState(activeTab.url)
  const [searchResults, setSearchResults] = useState<any>(null)
  const [aiResult, setAiResult] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setInputValue(activeTab.url)
    if (activeTab.url.startsWith('/api/search/google')) {
      fetchSearchResults(activeTab.url)
    } else if (activeTab.url.startsWith('/api/search/ai')) {
      fetchAIResults(activeTab.url)
    } else {
      setSearchResults(null)
      setAiResult('')
    }
  }, [activeTab])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      if (inputValue.startsWith('ai:')) {
        onAISearch(inputValue.slice(3).trim())
      } else if (inputValue.includes('.') && !inputValue.includes(' ')) {
        onUrlChange(inputValue.startsWith('http') ? inputValue : `https://${inputValue}`)
      } else {
        onSearch(inputValue.trim())
      }
    }
  }

  const fetchSearchResults = async (url: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(url)
      const data = await response.json()
      if (data.error) {
        throw new Error(data.error)
      }
      setSearchResults(data)
    } catch (error) {
      console.error('Error fetching search results:', error)
      setError(error instanceof Error ? error.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  const fetchAIResults = async (url: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      if (data.error) {
        throw new Error(data.error)
      }
      setAiResult(data.result)
    } catch (error) {
      console.error('Error fetching AI results:', error)
      setError('An error occurred while fetching AI results. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSearchResultClick = (url: string) => {
    onUrlChange(url)
  }

  const ContentView = ({ url }: { url: string }) => (
    <div className="flex-1 bg-white overflow-y-auto">
      {loading ? (
        <div className="p-4">Loading...</div>
      ) : error ? (
        <div className="p-4 text-red-500">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p>{error}</p>
          <p className="mt-4">Please check your internet connection and try again. If the problem persists, there might be an issue with the search service.</p>
        </div>
      ) : searchResults ? (
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Search Results</h2>
          {searchResults.items?.map((item: any, index: number) => (
            <div key={index} className="mb-4">
              <a 
                href={item.link} 
                className="text-blue-600 hover:underline text-lg"
                onClick={(e) => {
                  e.preventDefault()
                  handleSearchResultClick(item.link)
                }}
              >
                {item.title}
              </a>
              <p className="text-sm text-green-700">{item.displayLink}</p>
              <p className="text-sm mt-1">{item.snippet}</p>
            </div>
          ))}
        </div>
      ) : aiResult ? (
        <div className="p-4 prose max-w-none">
          <h2 className="text-2xl font-bold mb-4">AI Search Results</h2>
          {aiResult}
        </div>
      ) : (
        <iframe
          src={url}
          title={activeTab.title}
          className="w-full h-full border-none"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          referrerPolicy="no-referrer"
        />
      )}
    </div>
  )

  return (
    <div className="flex-1 flex flex-col">
      <div className="h-12 bg-white border-b flex items-center px-4">
        <div className="flex space-x-2 mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
        <form onSubmit={handleInputSubmit} className="flex-1 flex">
          <Input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Search or type a URL (prefix with 'ai:' for AI search)"
            className="flex-1"
          />
        </form>
      </div>
      <div className={`flex-1 flex ${activeTab.splitView ? 'flex-row' : 'flex-col'}`}>
        <ContentView url={activeTab.url} />
        {activeTab.splitView && <ContentView url={activeTab.url} />}
      </div>
    </div>
  )
}

