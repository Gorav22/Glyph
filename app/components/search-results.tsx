'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import showdown from 'showdown'

interface SearchResult {
  title: string
  link: string
  snippet: string
}

interface SearchResultsProps {
  query: string
  onClose: () => void
}

export function SearchResults({ query, onClose }: SearchResultsProps) {
  const [googleResults, setGoogleResults] = useState<SearchResult[]>([])
  const [aiResult, setAiResult] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true)
      try {
        // Fetch Google search results
        const googleResponse = await fetch(`/api/search/google?q=${encodeURIComponent(query)}`)
        const googleData = await googleResponse.json()
        setGoogleResults(googleData.items || [])

        // Fetch AI (Gemini) results
        const aiResponse = await fetch(`/api/search/ai?q=${encodeURIComponent(query)}`)
        const aiData = await aiResponse.json()
        const converter=new showdown.Converter();
        setAiResult(converter.makeHtml(aiData.result))
      } catch (error) {
        console.error('Error fetching search results:', error)
      }
      setLoading(false)
    }

    fetchResults()
  }, [query])

  if (loading) {
    return <div className="p-4">Loading search results...</div>
  }

  return (
    <div className="fixed inset-y-0 right-0 w-1/3 bg-white shadow-lg overflow-y-auto">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-bold">Search Results</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">AI Response</h3>
        <div className="mb-4" dangerouslySetInnerHTML={{ __html: aiResult }} />
        <h3 className="text-lg font-semibold mb-2">Referal links</h3>
        {googleResults.map((result, index) => (
          <div key={index} className="mb-4">
            <a href={result.link} className="text-blue-600 hover:underline">{result.title}</a>
            <p className="text-sm">{result.snippet}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

