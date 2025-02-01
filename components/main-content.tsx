import { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, RotateCcw, Star } from 'lucide-react'
import { Tab } from '../types'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FrameContent } from './frame-content'
import {marked} from 'marked'
import styled from 'styled-components';
interface MainContentProps {
  activeTab: Tab
  onUrlChange: (url: string) => void
  onSearch: (query: string) => void
  onAISearch: (query: string) => void
  onToggleBookmark: () => void
}

export function MainContent({ activeTab, onUrlChange, onSearch, onAISearch, onToggleBookmark }: MainContentProps) {
  const [inputValue, setInputValue] = useState(activeTab.url)
  const [searchResults, setSearchResults] = useState<any>(null)
  const [aiResult, setAiResult] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<string[]>([activeTab.url])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (activeTab.url !== history[currentIndex]) {
      const newHistory = [...history.slice(0, currentIndex + 1), activeTab.url]
      setHistory(newHistory)
      setCurrentIndex(newHistory.length - 1)
    }
    setInputValue(activeTab.url)
    
    if (activeTab.splitView) {
      if (activeTab.lastSearchType === 'ai') {
        fetchAIResults(`/api/search/ai?q=${encodeURIComponent(activeTab.aiSearchQuery || '')}`)
        fetchSearchResults(`/api/search/google?q=${encodeURIComponent(activeTab.googleSearchQuery || '')}`)
      } else {
        fetchSearchResults(`/api/search/google?q=${encodeURIComponent(activeTab.googleSearchQuery || '')}`)
        fetchAIResults(`/api/search/ai?q=${encodeURIComponent(activeTab.aiSearchQuery || '')}`)
      }
    } else if (activeTab.url.startsWith('/api/search/google')) {
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

  const handleGoBack = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1
      setCurrentIndex(newIndex)
      onUrlChange(history[newIndex])
    }
  }

  const handleGoForward = () => {
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1
      setCurrentIndex(newIndex)
      onUrlChange(history[newIndex])
    }
  }

  const handleRefresh = () => {
    onUrlChange(activeTab.url)
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
      const html=marked.parse(data.result)
      setAiResult(html)
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

  const ContentView = ({ url, isAIView = false }: { url: string, isAIView?: boolean }) => (
    <div className="flex-1 bg-white overflow-y-auto">
      {loading ? (
        <div className="p-4 h-screen bg-white overflow-y-auto flex items-center justify-center">
          <StyledWrapper>
      <div className="🤚">
        <div className="👉" />
        <div className="👉" />
        <div className="👉" />
        <div className="👉" />
        <div className="🌴" />		
        <div className="👍" />
      </div>
    </StyledWrapper>
        </div>
      ) : error ? (
        <div className="p-4 text-red-500">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p>{error}</p>
          <p className="mt-4">Please check your internet connection and try again. If the problem persists, there might be an issue with the search service.</p>
        </div>
      ) : isAIView && aiResult ? (
        <div className="p-4 prose max-w-none" dangerouslySetInnerHTML={{__html:aiResult}}>
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
      ) : (
        <FrameContent url={url} title={activeTab.title} />
      )}
    </div>
  )

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <div className="h-12 bg-white border-b flex items-center px-4">
        <div className="flex space-x-2 mr-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleGoBack}
            disabled={currentIndex <= 0}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleGoForward}
            disabled={currentIndex >= history.length - 1}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleRefresh}
          >
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
          <Button type="submit" className="ml-2">Go</Button>
        </form>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleBookmark}
          className="ml-2"
        >
          <Star className={`h-4 w-4 ${activeTab.isBookmarked ? 'fill-yellow-400' : ''}`} />
        </Button>
      </div>
      <div className="flex-1 flex overflow-hidden">
        {activeTab.splitView ? (
          <>
            <div className="flex-1 overflow-y-auto">
              <ContentView 
                url={`/api/search/ai?q=${encodeURIComponent(activeTab.aiSearchQuery || '')}`} 
                isAIView={true} 
              />
            </div>
            <div className="flex-1 overflow-y-auto">
              <ContentView 
                url={`/api/search/google?q=${encodeURIComponent(activeTab.googleSearchQuery || '')}`} 
              />
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <ContentView 
              url={activeTab.url} 
              isAIView={activeTab.isAISearch || activeTab.lastSearchType === 'ai'}
            />
          </div>
        )}
      </div>
    </div>
  )
}
const StyledWrapper = styled.div`
  .🤚 {
    --skin-color: #E4C560;
    --tap-speed: 0.6s;
    --tap-stagger: 0.1s;
    position: relative;
    width: 80px;
    height: 60px;
    margin-left: 80px;
  }

  .🤚:before {
    content: '';
    display: block;
    width: 180%;
    height: 75%;
    position: absolute;
    top: 70%;
    right: 20%;
    background-color: black;
    border-radius: 40px 10px;
    filter: blur(10px);
    opacity: 0.3;
  }

  .🌴 {
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: var(--skin-color);
    border-radius: 10px 40px;
  }

  .👍 {
    position: absolute;
    width: 120%;
    height: 38px;
    background-color: var(--skin-color);
    bottom: -18%;
    right: 1%;
    transform-origin: calc(100% - 20px) 20px;
    transform: rotate(-20deg);
    border-radius: 30px 20px 20px 10px;
    border-bottom: 2px solid rgba(0, 0, 0, 0.1);
    border-left: 2px solid rgba(0, 0, 0, 0.1);
  }

  .👍:after {
    width: 20%;
    height: 60%;
    content: '';
    background-color: rgba(255, 255, 255, 0.3);
    position: absolute;
    bottom: -8%;
    left: 5px;
    border-radius: 60% 10% 10% 30%;
    border-right: 2px solid rgba(0, 0, 0, 0.05);
  }

  .👉 {
    position: absolute;
    width: 80%;
    height: 35px;
    background-color: var(--skin-color);
    bottom: 32%;
    right: 64%;
    transform-origin: 100% 20px;
    animation-duration: calc(var(--tap-speed) * 2);
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
    transform: rotate(10deg);
  }

  .👉:before {
    content: '';
    position: absolute;
    width: 140%;
    height: 30px;
    background-color: var(--skin-color);
    bottom: 8%;
    right: 65%;
    transform-origin: calc(100% - 20px) 20px;
    transform: rotate(-60deg);
    border-radius: 20px;
  }

  .👉:nth-child(1) {
    animation-delay: 0;
    filter: brightness(70%);
    animation-name: tap-upper-1;
  }

  .👉:nth-child(2) {
    animation-delay: var(--tap-stagger);
    filter: brightness(80%);
    animation-name: tap-upper-2;
  }

  .👉:nth-child(3) {
    animation-delay: calc(var(--tap-stagger) * 2);
    filter: brightness(90%);
    animation-name: tap-upper-3;
  }

  .👉:nth-child(4) {
    animation-delay: calc(var(--tap-stagger) * 3);
    filter: brightness(100%);
    animation-name: tap-upper-4;
  }

  @keyframes tap-upper-1 {
    0%, 50%, 100% {
      transform: rotate(10deg) scale(0.4);
    }

    40% {
      transform: rotate(50deg) scale(0.4);
    }
  }

  @keyframes tap-upper-2 {
    0%, 50%, 100% {
      transform: rotate(10deg) scale(0.6);
    }

    40% {
      transform: rotate(50deg) scale(0.6);
    }
  }

  @keyframes tap-upper-3 {
    0%, 50%, 100% {
      transform: rotate(10deg) scale(0.8);
    }

    40% {
      transform: rotate(50deg) scale(0.8);
    }
  }

  @keyframes tap-upper-4 {
    0%, 50%, 100% {
      transform: rotate(10deg) scale(1);
    }

    40% {
      transform: rotate(50deg) scale(1);
    }
  }`;