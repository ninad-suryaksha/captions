"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import {
  ArrowUp,
  Loader2,
  Search,
  Brain,
  ChevronDown,
  ChevronUp,
  Check,
  Copy,
  Sparkles,
  ArrowLeft,
  TrendingUp,
  Zap,
  ImageIcon,
  FileText,
  Link,
  Video,
  FileSpreadsheet,
  List,
  BarChart,
  Sliders,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Montserrat, Inter, Space_Grotesk } from "next/font/google"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

const inter = Inter({ weight: ["400", "500", "600"], subsets: ["latin"] })
const montserrat = Montserrat({ weight: ["400", "500", "600", "700", "800"], subsets: ["latin"] })
const spaceGrotesk = Space_Grotesk({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})

// Type definitions for content
type DetailedIdea = {
  title: string
  visual?: string
  caption?: string
  content?: string
  callToAction?: string
  format?: string
  productionNotes?: string
  outline?: string
  dataPoints?: string
  trendAnalysis?: string
  conclusion?: string
  contentType?: string
  musicOptions?: string[]
  duration?: string
  designDetails?: {
    visualElements?: string[]
    technicalSpecs?: string[]
    shotList?: string[]
    designerNotes?: string
  }
  [key: string]: any // Allow for different properties based on platform
}

type DetailedContent = {
  focus: string
  ideas: DetailedIdea[]
  stats?: {
    engagementRate?: string
    bestContentType?: string
    optimalPosting?: string
    averageViewDuration?: string
    bestVideoType?: string
    clickThroughRate?: string
    bestArticleType?: string
    [key: string]: any
  }
  contentMix?: {
    categories?: string[]
    formats?: string[]
    [key: string]: any
  }
}

type ContentItem = {
  brief: string
  detailed: DetailedContent
}

type BrandAnalysis = {
  name: string
  domain: string
  personality: string
  tone: string
  focus: string
}

type ApiResponse = {
  brandAnalysis: BrandAnalysis
  content: {
    instagram: ContentItem
    facebook: ContentItem
    youtube: ContentItem
    linkedin: ContentItem
  }
}

// Thinking steps for the AI
const thinkingSteps = [
  "Analyzing website structure and content...",
  "Identifying brand voice, tone, and key offerings...",
  "Crafting platform-specific content strategies...",
  "Generating tailored content ideas for each platform...",
  "Finalizing content and preparing results...",
]

const trendThinkingSteps = [
  "Analyzing website structure and content...",
  "Identifying industry and company focus...",
  "Researching relevant AI trends in this industry...",
  "Connecting company offerings with industry AI trends...",
  "Creating platform-specific AI trend content...",
]

// Custom platform icons
const PlatformIcon = ({
  platform,
  size = "md",
  className = "",
}: { platform: string; size?: "sm" | "md" | "lg"; className?: string }) => {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  }

  switch (platform.toLowerCase()) {
    case "instagram":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`${sizeClasses[size]} ${className}`}
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      )
    case "facebook":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`${sizeClasses[size]} ${className}`}
        >
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
        </svg>
      )
    case "youtube":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`${sizeClasses[size]} ${className}`}
        >
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
        </svg>
      )
    case "linkedin":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`${sizeClasses[size]} ${className}`}
        >
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
          <rect x="2" y="9" width="4" height="12"></rect>
          <circle cx="4" cy="4" r="2"></circle>
        </svg>
      )
    default:
      return null
  }
}

// Chart icon for the stats tab
const ChartIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  )
}

// Platform utility functions
const getPlatformDisplayName = (platform: string | null): string => {
  if (!platform) return ""

  switch (platform.toLowerCase()) {
    case "instagram":
      return "Instagram"
    case "facebook":
      return "Facebook"
    case "youtube":
      return "YouTube"
    case "linkedin":
      return "LinkedIn"
    default:
      return platform
  }
}

// Platform colors
const getPlatformColor = (platform: string): string => {
  switch (platform.toLowerCase()) {
    case "instagram":
      return "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400"
    case "facebook":
      return "bg-blue-600"
    case "youtube":
      return "bg-red-600"
    case "linkedin":
      return "bg-blue-700"
    default:
      return "bg-gray-700"
  }
}

const getPlatformLightColor = (platform: string): string => {
  switch (platform.toLowerCase()) {
    case "instagram":
      return "bg-pink-50"
    case "facebook":
      return "bg-blue-50"
    case "youtube":
      return "bg-red-50"
    case "linkedin":
      return "bg-blue-50"
    default:
      return "bg-gray-50"
  }
}

const getPlatformTextColor = (platform: string): string => {
  switch (platform.toLowerCase()) {
    case "instagram":
      return "text-pink-500"
    case "facebook":
      return "text-blue-500"
    case "youtube":
      return "text-red-500"
    case "linkedin":
      return "text-blue-600"
    default:
      return "text-gray-700"
  }
}

const getPlatformBorderColor = (platform: string): string => {
  switch (platform.toLowerCase()) {
    case "instagram":
      return "border-pink-200"
    case "facebook":
      return "border-blue-200"
    case "youtube":
      return "border-red-200"
    case "linkedin":
      return "border-blue-300"
    default:
      return "border-gray-200"
  }
}

const getPlatformBgGradient = (platform: string): string => {
  switch (platform.toLowerCase()) {
    case "instagram":
      return "bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500"
    case "facebook":
      return "bg-gradient-to-br from-blue-700 to-blue-500"
    case "youtube":
      return "bg-gradient-to-br from-red-700 to-red-500"
    case "linkedin":
      return "bg-gradient-to-br from-blue-800 to-blue-600"
    default:
      return "bg-gradient-to-br from-gray-700 to-gray-500"
  }
}

// Function to get platform-specific content fields
const getPlatformFields = (platform: string, idea: DetailedIdea) => {
  const fields = []

  switch (platform.toLowerCase()) {
    case "instagram":
      if (idea.visual) fields.push({ label: "Visual Concept", value: idea.visual, icon: "image" })
      if (idea.caption) fields.push({ label: "Caption", value: idea.caption, icon: "text" })
      break
    case "facebook":
      if (idea.content) fields.push({ label: "Post Content", value: idea.content, icon: "text" })
      if (idea.callToAction) fields.push({ label: "Call to Action", value: idea.callToAction, icon: "link" })
      break
    case "youtube":
      if (idea.format) fields.push({ label: "Video Format", value: idea.format, icon: "video" })
      if (idea.productionNotes) fields.push({ label: "Production Notes", value: idea.productionNotes, icon: "notes" })
      if (idea.outline) fields.push({ label: "Video Outline", value: idea.outline, icon: "list" })
      break
    case "linkedin":
      if (idea.content) fields.push({ label: "Post Content", value: idea.content, icon: "text" })
      if (idea.trendAnalysis) fields.push({ label: "Trend Analysis", value: idea.trendAnalysis, icon: "data" })
      if (idea.conclusion) fields.push({ label: "Conclusion", value: idea.conclusion, icon: "link" })
      if (idea.dataPoints) fields.push({ label: "Key Data Points", value: idea.dataPoints, icon: "data" })
      if (idea.callToAction) fields.push({ label: "Call to Action", value: idea.callToAction, icon: "link" })
      break
    default:
      // Fallback for unknown platforms
      Object.entries(idea).forEach(([key, value]) => {
        if (typeof value === "string" && key !== "title" && !key.includes("Details")) {
          fields.push({ label: key.charAt(0).toUpperCase() + key.slice(1), value, icon: "text" })
        }
      })
  }

  return fields
}

// Function to get icon for field type
const getFieldIcon = (type: string) => {
  switch (type) {
    case "image":
      return <ImageIcon className="h-4 w-4 text-gray-500" />
    case "text":
      return <FileText className="h-4 w-4 text-gray-500" />
    case "link":
      return <Link className="h-4 w-4 text-gray-500" />
    case "video":
      return <Video className="h-4 w-4 text-gray-500" />
    case "notes":
      return <FileSpreadsheet className="h-4 w-4 text-gray-500" />
    case "list":
      return <List className="h-4 w-4 text-gray-500" />
    case "data":
      return <BarChart className="h-4 w-4 text-gray-500" />
    default:
      return <FileText className="h-4 w-4 text-gray-500" />
  }
}

export default function Home() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<null | {
    instagram: ContentItem
    facebook: ContentItem
    youtube: ContentItem
    linkedin: ContentItem
  }>(null)
  const [brandAnalysis, setBrandAnalysis] = useState<BrandAnalysis | null>(null)
  const [loadingPlatform, setLoadingPlatform] = useState<string | null>(null)
  const [detailedContent, setDetailedContent] = useState<{
    platform: string | null
    content: DetailedContent | null
    isRegenerating?: boolean
  }>({
    platform: null,
    content: null,
    isRegenerating: false,
  })
  const [apiStatus, setApiStatus] = useState<"unknown" | "ok" | "error">("unknown")
  const [thinkingStep, setThinkingStep] = useState(0)
  const [thinkingCollapsed, setThinkingCollapsed] = useState(false)
  const [processingTime, setProcessingTime] = useState(0)
  const [showProcessingSummary, setShowProcessingSummary] = useState(false)
  const processingStartTime = useRef<number | null>(null)
  const processingInterval = useRef<NodeJS.Timeout | null>(null)
  const contentSectionRef = useRef<HTMLDivElement>(null)
  const [isStopped, setIsStopped] = useState(false)
  const [brandDetailsExpanded, setBrandDetailsExpanded] = useState(false)
  const [expandedDesigns, setExpandedDesigns] = useState<number[]>([])
  const [searchComplete, setSearchComplete] = useState(false)
  const [aiTrendsMode, setAiTrendsMode] = useState(false)
  const [selectedIdea, setSelectedIdea] = useState<DetailedIdea | null>(null)
  const [activeTab, setActiveTab] = useState("ideas")
  const [copiedContent, setCopiedContent] = useState<string | null>(null)
  const [briefing, setBriefing] = useState("")
  const [targetAudienceAge, setTargetAudienceAge] = useState("")
  const [targetAudienceInterests, setTargetAudienceInterests] = useState("")
  const [targetAudienceNeeds, setTargetAudienceNeeds] = useState("")
  const [communicationTone, setCommunicationTone] = useState("")
  const [showAdditionalFields, setShowAdditionalFields] = useState(false)

  // Check API status on component mount
  useEffect(() => {
    checkApiStatus()
  }, [])

  // Simulate thinking process during loading
  useEffect(() => {
    if (isLoading) {
      // Start the processing timer
      processingStartTime.current = Date.now()
      processingInterval.current = setInterval(() => {
        if (processingStartTime.current) {
          setProcessingTime(Math.floor((Date.now() - processingStartTime.current) / 1000))
        }
      }, 1000)

      // Advance through thinking steps
      const stepsInterval = setInterval(() => {
        setThinkingStep((prev) => {
          const stepsArray = aiTrendsMode ? trendThinkingSteps : thinkingSteps
          const newStep = prev < stepsArray.length - 1 ? prev + 1 : prev
          return newStep
        })
      }, 2500)

      return () => {
        clearInterval(stepsInterval)
        if (processingInterval.current) {
          clearInterval(processingInterval.current)
        }
      }
    } else {
      if (processingInterval.current) {
        clearInterval(processingInterval.current)
      }

      if (processingStartTime.current && processingTime > 0) {
        setShowProcessingSummary(true)
      }

      setThinkingStep(0)
      setThinkingCollapsed(false)
    }
  }, [isLoading, aiTrendsMode])

  // Scroll to content section when brand analysis is generated
  useEffect(() => {
    if (brandAnalysis && !isLoading && contentSectionRef.current) {
      setTimeout(() => {
        contentSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }, 300) // Small delay to ensure UI has updated
    }
  }, [brandAnalysis, isLoading])

  // Function to check API status
  const checkApiStatus = async () => {
    try {
      const response = await fetch("/api/check-api-status")
      if (response.ok) {
        setApiStatus("ok")
      } else {
        setApiStatus("error")
      }
    } catch (err) {
      console.error("Error checking API status:", err)
      setApiStatus("error")
    }
  }

  // Function to validate and format URL
  const formatUrl = (inputUrl: string): string => {
    let formattedUrl = inputUrl.trim()

    // Check if URL has a protocol
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = "https://" + formattedUrl
    }

    return formattedUrl
  }

  const handleStopProcessing = (e: React.MouseEvent) => {
    if (e) e.preventDefault()
    setIsLoading(false)
    setIsStopped(true)

    // Clear any intervals
    if (processingInterval.current) {
      clearInterval(processingInterval.current)
    }

    // Show the processing summary with stopped message
    setShowProcessingSummary(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return

    setIsLoading(true)
    setResults(null)
    setError(null)
    setBrandAnalysis(null)
    setThinkingStep(0)
    setProcessingTime(0)
    setShowProcessingSummary(false)
    setIsStopped(false) // Reset the stopped state
    processingStartTime.current = null
    setSearchComplete(false)

    try {
      // Format the URL
      const formattedUrl = formatUrl(url)

      // Basic URL validation
      try {
        new URL(formattedUrl)
      } catch (err) {
        throw new Error("Please enter a valid URL (e.g., nike.com)")
      }

      // Call the appropriate API endpoint based on mode
      const endpoint = aiTrendsMode ? "/api/generate-trends" : "/api/generate-content"

      // Create the request payload with additional fields
      const payload = {
        url: formattedUrl,
        briefing,
        targetAudienceAge,
        targetAudienceInterests,
        targetAudienceNeeds,
        communicationTone,
      }

      console.log("Submitting request to:", endpoint)

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage = `HTTP error ${response.status}`

        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.error || errorMessage
        } catch (e) {
          // If we can't parse the error as JSON, use the raw text
          if (errorText) {
            errorMessage = errorText.substring(0, 200) // Limit length
          }
        }

        throw new Error(errorMessage)
      }

      let data: ApiResponse
      try {
        data = await response.json()

        // Validate the response structure
        if (!data.brandAnalysis || !data.content) {
          throw new Error("Invalid response structure")
        }

        // Ensure all required platforms exist
        const requiredPlatforms = ["instagram", "facebook", "youtube", "linkedin"]
        for (const platform of requiredPlatforms) {
          if (!data.content[platform as keyof typeof data.content]) {
            throw new Error(`Missing platform data: ${platform}`)
          }
        }

        // Set the results
        setResults(data.content)
        setBrandAnalysis(data.brandAnalysis)
        setSearchComplete(true)
      } catch (parseError) {
        console.error("Error parsing API response:", parseError)
        throw new Error("Failed to parse the response. The API returned invalid data.")
      }
    } catch (err) {
      console.error(`Error generating ${aiTrendsMode ? "AI trends" : "content"}:`, err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetry = async (platform: string) => {
    if (!url) return

    setLoadingPlatform(platform)

    try {
      // Format the URL
      const formattedUrl = formatUrl(url)

      // Call our API endpoint for just this platform
      const endpoint = aiTrendsMode ? "/api/generate-trends" : "/api/generate-content"

      const payload = {
        url: formattedUrl,
        platform,
        briefing,
        targetAudienceAge,
        targetAudienceInterests,
        targetAudienceNeeds,
        communicationTone,
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to regenerate content")
      }

      const data: ApiResponse = await response.json()

      // Update just this platform's content
      if (results) {
        setResults({
          ...results,
          [platform]: data.content[platform as keyof typeof data.content],
        })
      }
    } catch (err) {
      console.error("Error regenerating content:", err)
    } finally {
      setLoadingPlatform(null)
    }
  }

  const handleShowDetails = (platform: string) => {
    if (!results) return

    setDetailedContent({
      platform,
      content: results[platform as keyof typeof results].detailed,
      isRegenerating: false,
    })
    setSelectedIdea(null)
    setActiveTab("ideas")
  }

  const handleCloseDetails = () => {
    setDetailedContent({
      platform: null,
      content: null,
      isRegenerating: false,
    })
    setSelectedIdea(null)
  }

  const handleRegenerateIdeas = async (platform: string) => {
    if (!url) return

    setDetailedContent({
      ...detailedContent,
      isRegenerating: true,
    })
    setSelectedIdea(null)

    try {
      // Format the URL
      const formattedUrl = formatUrl(url)

      // Call our API endpoint for just this platform
      const endpoint = aiTrendsMode ? "/api/generate-trends" : "/api/generate-content"

      const payload = {
        url: formattedUrl,
        platform,
        briefing,
        targetAudienceAge,
        targetAudienceInterests,
        targetAudienceNeeds,
        communicationTone,
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to regenerate content")
      }

      const data: ApiResponse = await response.json()

      // Update just the detailed content ideas
      if (results) {
        const updatedResults = {
          ...results,
          [platform]: data.content[platform as keyof typeof data.content],
        }

        setResults(updatedResults)

        // Update the detailed content view
        setDetailedContent({
          platform,
          content: data.content[platform as keyof typeof data.content].detailed,
          isRegenerating: false,
        })
      }
    } catch (err) {
      console.error("Error regenerating content:", err)
      setDetailedContent({
        ...detailedContent,
        isRegenerating: false,
      })
    }
  }

  const toggleAiTrendsMode = () => {
    setAiTrendsMode(!aiTrendsMode)
    // Reset results when switching modes
    if (searchComplete) {
      setResults(null)
      setBrandAnalysis(null)
      setDetailedContent({
        platform: null,
        content: null,
      })
      setSelectedIdea(null)
      setSearchComplete(false)
    }
  }

  const handleSelectIdea = (idea: DetailedIdea) => {
    setSelectedIdea(idea)
  }

  const handleBackFromIdea = () => {
    setSelectedIdea(null)
  }

  // Function to toggle design details
  const handleToggleDesignDetails = (index: number) => {
    setExpandedDesigns((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  const copyToClipboard = (text: string, contentType: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedContent(contentType)
      setTimeout(() => {
        setCopiedContent(null)
      }, 2000)
    })
  }

  return (
    <main className={`min-h-screen bg-gray-50 text-gray-900 overflow-x-hidden ${spaceGrotesk.variable}`}>
      {/* Header with ShopOS logo */}
      <header className="fixed top-0 left-0 p-4 z-50 w-full bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto flex items-center justify-center">
          <button
            onClick={() => setSearchComplete(false)}
            className={`text-gray-900 font-extrabold text-xl tracking-tight ${montserrat.className} cursor-pointer hover:opacity-80 transition-opacity`}
          >
            ShopOS
          </button>
        </div>
      </header>

      {!searchComplete ? (
        <div className="max-w-6xl mx-auto px-4 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] py-20 relative z-10">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1
              className={`text-4xl md:text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 ${montserrat.className}`}
            >
              Better Captions
            </h1>
            <p className="text-gray-600 max-w-xl mx-auto text-lg font-light tracking-wide">
              Generate tailored content for your brand across all platforms
            </p>
          </motion.div>

          {apiStatus === "error" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <div className="mb-8 max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                <div className="font-medium mb-1">API Connection Issue</div>
                <div className="text-sm">
                  There seems to be an issue connecting to the OpenAI API. Please check your API key or try again later.
                </div>
              </div>
            </motion.div>
          )}

          {/* AI Trends toggle */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-4 w-full max-w-4xl mx-auto flex justify-center"
          >
            <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm border border-gray-200">
              <Label htmlFor="ai-trends-mode" className="text-sm font-medium cursor-pointer select-none">
                <span className="flex items-center gap-2">
                  <TrendingUp className={`h-4 w-4 ${aiTrendsMode ? "text-blue-500" : "text-gray-500"}`} />
                  AI Trends
                </span>
              </Label>
              <Switch
                id="ai-trends-mode"
                checked={aiTrendsMode}
                onCheckedChange={toggleAiTrendsMode}
                className={`${aiTrendsMode ? "bg-blue-500" : "bg-gray-200"} transition-colors duration-200`}
              />
            </div>
          </motion.div>

          {/* URL Input and Additional Fields */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`w-full max-w-4xl mx-auto mb-8 ${showAdditionalFields ? 'pb-96' : 'pb-0'} transition-all duration-300`}
          >
            <form onSubmit={handleSubmit} className="relative">
              <motion.div
                layoutId="search-container"
                layout
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 30,
                  duration: 0.6,
                }}
                className="flex flex-col bg-white rounded-full overflow-hidden transition-all border border-gray-200 hover:border-gray-300 focus-within:border-gray-400 focus-within:ring-2 focus-within:ring-gray-200 shadow-sm"
              >
                {/* URL Input */}
                <div className="flex items-center pl-2">
                  <div className="pl-4 pr-2 text-gray-400">
                    <Search size={18} />
                  </div>
                  <Input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder={
                      aiTrendsMode
                        ? "Enter company URL to analyze AI trends..."
                        : "Enter any website URL (e.g., nike.com)"
                    }
                    className="flex-1 border-0 shadow-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-900 py-8 px-0 text-base placeholder:text-gray-400"
                  />
                  <Button
                    type="button"
                    onClick={() => setShowAdditionalFields(!showAdditionalFields)}
                    className={`mr-2 flex items-center gap-2 text-sm font-medium bg-white border border-gray-200 ${
                      showAdditionalFields ? "text-blue-600 border-blue-200 bg-blue-50" : "text-gray-800"
                    } hover:bg-gray-50 rounded-lg px-4 py-1.5 h-9`}
                  >
                    <Sliders className="h-4 w-4" />
                    <span>Customize</span>
                  </Button>
                  <Button
                    type={isLoading ? "button" : "submit"}
                    onClick={isLoading ? handleStopProcessing : undefined}
                    className={`m-2 rounded-full ${aiTrendsMode ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-900 hover:bg-black"} text-white h-12 w-12 flex items-center justify-center shadow-md`}
                    disabled={apiStatus === "error" || (url === "" && !isLoading)}
                  >
                    {isLoading ? <div className="h-4 w-4 bg-white rounded-sm" /> : <ArrowUp className="h-5 w-5" />}
                  </Button>
                </div>

                {/* Additional Fields - Now as a separate dropdown box */}
                <AnimatePresence>
                  {showAdditionalFields && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.98 }}
                      transition={{ 
                        duration: 0.5,
                        type: "spring", 
                        stiffness: 70, 
                        damping: 15,
                        opacity: { duration: 0.3 }
                      }}
                      className="absolute top-full left-0 right-0 w-full mt-3 px-8 py-7 bg-white rounded-xl border border-gray-200 shadow-lg z-50 backdrop-blur-sm bg-white/95"
                    >
                      <h3 className="text-md font-semibold text-gray-800 mb-5 flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-gray-600" />
                        Content Strategy Parameters
                      </h3>
                      <div className="grid grid-cols-1 gap-6">
                        <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors shadow-sm">
                          <label htmlFor="briefing" className="text-sm font-medium text-gray-700 mb-2 block">
                            Briefing
                          </label>
                          <textarea
                            id="briefing"
                            value={briefing}
                            onChange={(e) => setBriefing(e.target.value)}
                            placeholder="Describe your content needs or campaign details..."
                            className="w-full rounded-md border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 min-h-[80px]"
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors shadow-sm">
                            <label htmlFor="targetAudienceAge" className="text-sm font-medium text-gray-700 mb-2 block">
                              Target Audience Age
                            </label>
                            <input
                              id="targetAudienceAge"
                              type="text"
                              value={targetAudienceAge}
                              onChange={(e) => setTargetAudienceAge(e.target.value)}
                              placeholder="e.g., 25-45"
                              className="w-full rounded-md border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                            />
                          </div>
                          <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors shadow-sm">
                            <label htmlFor="communicationTone" className="text-sm font-medium text-gray-700 mb-2 block">
                              Communication Tone
                            </label>
                            <input
                              id="communicationTone"
                              type="text"
                              value={communicationTone}
                              onChange={(e) => setCommunicationTone(e.target.value)}
                              placeholder="e.g., Enthusiastic, informative, professional"
                              className="w-full rounded-md border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors shadow-sm">
                            <label htmlFor="targetAudienceInterests" className="text-sm font-medium text-gray-700 mb-2 block">
                              Target Audience Interests
                            </label>
                            <input
                              id="targetAudienceInterests"
                              type="text"
                              value={targetAudienceInterests}
                              onChange={(e) => setTargetAudienceInterests(e.target.value)}
                              placeholder="e.g., Eco-tourism, adventure travel, sustainability"
                              className="w-full rounded-md border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                            />
                          </div>
                          <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors shadow-sm">
                            <label htmlFor="targetAudienceNeeds" className="text-sm font-medium text-gray-700 mb-2 block">
                              Target Audience Needs
                            </label>
                            <input
                              id="targetAudienceNeeds"
                              type="text"
                              value={targetAudienceNeeds}
                              onChange={(e) => setTargetAudienceNeeds(e.target.value)}
                              placeholder="e.g., Unique experiences, authentic cultural immersion"
                              className="w-full rounded-md border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </form>
          </motion.div>

          {error && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <div className="mb-8 max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                <div className="font-medium mb-1">Error</div>
                <div className="text-sm">
                  {error}
                  {error.includes("API") && (
                    <div className="mt-2">
                      <p>This might be due to an issue with the OpenAI API. Please try:</p>
                      <ul className="list-disc pl-5 mt-1">
                        <li>Checking if the URL is valid and accessible</li>
                        <li>Trying again in a few minutes</li>
                        <li>Using a different URL</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* AI Thinking Animation - Expanded */}
          <AnimatePresence>
            {isLoading && !thinkingCollapsed && (
              <motion.div
                key="thinking-expanded"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full mb-8"
              >
                <div className="max-w-2xl mx-auto bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-full ${aiTrendsMode ? "bg-blue-600" : "bg-gray-900"} flex items-center justify-center shadow-md`}
                        >
                          {aiTrendsMode ? (
                            <Zap className="h-6 w-6 text-white" />
                          ) : (
                            <Brain className="h-6 w-6 text-white" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">AI Agent is thinking...</h3>
                          <p className="text-xs text-gray-500">
                            {aiTrendsMode
                              ? "Analyzing industry AI trends and generating insights"
                              : "Analyzing content and generating ideas"}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-full"
                        onClick={() => setThinkingCollapsed(true)}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Thinking steps with animation */}
                    <div className="space-y-3">
                      {(aiTrendsMode ? trendThinkingSteps : thinkingSteps).map((step, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{
                            opacity: index <= thinkingStep ? 1 : 0.3,
                            x: 0,
                          }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="flex items-start"
                        >
                          <div
                            className={`w-6 h-6 rounded-full mr-3 flex-shrink-0 flex items-center justify-center shadow-sm ${
                              index < thinkingStep
                                ? aiTrendsMode
                                  ? "bg-blue-500"
                                  : "bg-green-500"
                                : index === thinkingStep
                                  ? aiTrendsMode
                                    ? "bg-blue-600"
                                    : "bg-gray-900"
                                  : "bg-gray-200"
                            }`}
                          >
                            {index < thinkingStep && <Check className="w-3 h-3 text-white" />}
                            {index === thinkingStep && <Loader2 className="w-3 h-3 text-white animate-spin" />}
                          </div>
                          <p className="text-gray-700 text-sm">{step}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI Thinking Animation - Collapsed */}
          <AnimatePresence>
            {isLoading && thinkingCollapsed && (
              <motion.div
                key="thinking-collapsed"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full mb-8"
              >
                <div className="max-w-2xl mx-auto bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full ${aiTrendsMode ? "bg-blue-600" : "bg-gray-900"} flex items-center justify-center shadow-sm`}
                        >
                          <Loader2 className="h-5 w-5 text-white animate-spin" />
                        </div>
                        <div className="flex flex-col">
                          <p className="text-sm font-medium text-gray-900">Processing {url}</p>
                          <span className="text-xs text-gray-500">{processingTime}s elapsed</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-full"
                        onClick={() => setThinkingCollapsed(false)}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Processing Summary */}
          <AnimatePresence>
            {showProcessingSummary && !isLoading && (
              <motion.div
                key="processing-summary"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full mb-8"
                ref={contentSectionRef}
              >
                <div className="max-w-2xl mx-auto bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full ${
                            isStopped ? "bg-amber-50" : aiTrendsMode ? "bg-blue-50" : "bg-emerald-50"
                          } flex items-center justify-center shadow-sm`}
                        >
                          {isStopped ? (
                            <div className="h-3 w-3 bg-amber-500 rounded-sm" />
                          ) : (
                            <Check className={`h-5 w-5 ${aiTrendsMode ? "text-blue-500" : "text-emerald-500"}`} />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900">
                            {isStopped
                              ? "You stopped the response"
                              : `${aiTrendsMode ? "AI trends" : "Content"} generated for ${url}`}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`${
                          isStopped
                            ? "text-amber-500 bg-amber-50"
                            : aiTrendsMode
                              ? "text-blue-500 bg-blue-50"
                              : "text-emerald-500 bg-emerald-50"
                        } font-medium text-sm px-3 py-1 rounded-full`}
                      >
                        {processingTime}s
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="pt-20 pb-10">
          {/* Centered layout for results */}
          <div className="max-w-6xl mx-auto px-4">
            {/* Main content area */}
            <motion.div className="w-full" layout transition={{ duration: 0.5 }}>
              {/* AI Trends toggle - in results view */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6 w-full max-w-5xl mx-auto flex justify-center"
              >
                <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm border border-gray-200">
                  <Label htmlFor="ai-trends-mode-results" className="text-sm font-medium cursor-pointer select-none">
                    <span className="flex items-center gap-2">
                      <TrendingUp className={`h-4 w-4 ${aiTrendsMode ? "text-blue-500" : "text-gray-500"}`} />
                      AI Trends
                    </span>
                  </Label>
                  <Switch
                    id="ai-trends-mode-results"
                    checked={aiTrendsMode}
                    onCheckedChange={toggleAiTrendsMode}
                    className={`${aiTrendsMode ? "bg-blue-500" : "bg-gray-200"} transition-colors duration-200`}
                  />
                </div>
              </motion.div>

              {/* URL input for search results page - wider version */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className={`w-full max-w-5xl mx-auto mb-12 ${showAdditionalFields ? 'pb-96' : 'pb-0'} transition-all duration-300`}
              >
                <form onSubmit={handleSubmit} className="relative">
                  <motion.div
                    layoutId="search-container"
                    layout
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 30,
                      duration: 0.6,
                    }}
                    className="flex flex-col bg-white rounded-full overflow-hidden transition-all border border-gray-200 hover:border-gray-300 focus-within:border-gray-400 focus-within:ring-2 focus-within:ring-gray-200 shadow-sm"
                  >
                    {/* URL Input */}
                    <div className="flex items-center pl-2">
                      <div className="pl-4 pr-2 text-gray-400">
                        <Search size={18} />
                      </div>
                      <Input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder={
                          aiTrendsMode
                            ? "Enter company URL to analyze AI trends..."
                            : "Enter any website URL (e.g., nike.com)"
                        }
                        className="flex-1 border-0 shadow-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-900 py-8 px-0 text-base placeholder:text-gray-400"
                      />
                      <Button
                        type="button"
                        onClick={() => setShowAdditionalFields(!showAdditionalFields)}
                        className={`mr-2 flex items-center gap-2 text-sm font-medium bg-white border border-gray-200 ${
                          showAdditionalFields ? "text-blue-600 border-blue-200 bg-blue-50" : "text-gray-800"
                        } hover:bg-gray-50 rounded-lg px-4 py-1.5 h-9`}
                      >
                        <Sliders className="h-4 w-4" />
                        <span>Customize</span>
                      </Button>
                      <Button
                        type="submit"
                        className={`m-2 rounded-full ${aiTrendsMode ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-900 hover:bg-black"} text-white h-12 w-12 flex items-center justify-center shadow-md`}
                        disabled={apiStatus === "error" || url === ""}
                      >
                        <ArrowUp className="h-5 w-5" />
                      </Button>
                    </div>

                    {/* Additional Fields - Now as a separate dropdown box */}
                    <AnimatePresence>
                      {showAdditionalFields && (
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.98 }}
                          transition={{ 
                            duration: 0.5,
                            type: "spring", 
                            stiffness: 70, 
                            damping: 15,
                            opacity: { duration: 0.3 }
                          }}
                          className="absolute top-full left-0 right-0 w-full mt-3 px-8 py-7 bg-white rounded-xl border border-gray-200 shadow-lg z-50 backdrop-blur-sm bg-white/95"
                        >
                          <h3 className="text-md font-semibold text-gray-800 mb-5 flex items-center gap-2">
                            <Sliders className="w-4 h-4 text-gray-600" />
                            Content Strategy Parameters
                          </h3>
                          <div className="grid grid-cols-1 gap-6">
                            <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors shadow-sm">
                              <label htmlFor="briefing" className="text-sm font-medium text-gray-700 mb-2 block">
                                Briefing
                              </label>
                              <textarea
                                id="briefing"
                                value={briefing}
                                onChange={(e) => setBriefing(e.target.value)}
                                placeholder="Describe your content needs or campaign details..."
                                className="w-full rounded-md border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 min-h-[80px]"
                              />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors shadow-sm">
                                <label htmlFor="targetAudienceAge" className="text-sm font-medium text-gray-700 mb-2 block">
                                  Target Audience Age
                                </label>
                                <input
                                  id="targetAudienceAge"
                                  type="text"
                                  value={targetAudienceAge}
                                  onChange={(e) => setTargetAudienceAge(e.target.value)}
                                  placeholder="e.g., 25-45"
                                  className="w-full rounded-md border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                                />
                              </div>
                              <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors shadow-sm">
                                <label htmlFor="communicationTone" className="text-sm font-medium text-gray-700 mb-2 block">
                                  Communication Tone
                                </label>
                                <input
                                  id="communicationTone"
                                  type="text"
                                  value={communicationTone}
                                  onChange={(e) => setCommunicationTone(e.target.value)}
                                  placeholder="e.g., Enthusiastic, informative, professional"
                                  className="w-full rounded-md border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                                />
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors shadow-sm">
                                <label htmlFor="targetAudienceInterests" className="text-sm font-medium text-gray-700 mb-2 block">
                                  Target Audience Interests
                                </label>
                                <input
                                  id="targetAudienceInterests"
                                  type="text"
                                  value={targetAudienceInterests}
                                  onChange={(e) => setTargetAudienceInterests(e.target.value)}
                                  placeholder="e.g., Eco-tourism, adventure travel, sustainability"
                                  className="w-full rounded-md border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                                />
                              </div>
                              <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors shadow-sm">
                                <label htmlFor="targetAudienceNeeds" className="text-sm font-medium text-gray-700 mb-2 block">
                                  Target Audience Needs
                                </label>
                                <input
                                  id="targetAudienceNeeds"
                                  type="text"
                                  value={targetAudienceNeeds}
                                  onChange={(e) => setTargetAudienceNeeds(e.target.value)}
                                  placeholder="e.g., Unique experiences, authentic cultural immersion"
                                  className="w-full rounded-md border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                                />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </form>
              </motion.div>

              {/* Platform Content Cards */}
              {results && !detailedContent.platform && (
                <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {["instagram", "facebook", "youtube", "linkedin"].map((platform, index) => (
                    <motion.div
                      key={platform}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.5 + index * 0.15,
                      }}
                      onClick={() => handleShowDetails(platform)}
                      className="cursor-pointer transform transition-all duration-300 hover:-translate-y-1 hover:shadow-md rounded-xl overflow-hidden bg-white border border-gray-200"
                    >
                      <div className="p-8 flex items-center justify-between">
                        <h2
                          className={`text-4xl md:text-5xl font-bold ${getPlatformTextColor(platform)} ${montserrat.className}`}
                        >
                          {getPlatformDisplayName(platform)}
                        </h2>
                        <div className={`${getPlatformLightColor(platform)} p-4 rounded-full`}>
                          <PlatformIcon platform={platform} size="lg" className={getPlatformTextColor(platform)} />
                        </div>
                      </div>
                      {aiTrendsMode && (
                        <div className="px-8 pb-4">
                          <div className="bg-gray-100 rounded-lg px-3 py-1.5 inline-flex items-center gap-1.5">
                            <Zap className="h-3.5 w-3.5 text-gray-600" />
                            <span className="text-xs font-medium text-gray-600">AI Trends</span>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Detailed Platform Content */}
              <AnimatePresence>
                {detailedContent.platform && detailedContent.content && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Platform Header */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                      <div className="p-4 flex items-center justify-between border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full h-9 text-gray-600 hover:bg-gray-100 border-gray-200 flex items-center gap-2"
                            onClick={handleCloseDetails}
                          >
                            <ArrowLeft className="h-4 w-4" />
                            <span>Back to platforms</span>
                          </Button>
                          <div className="flex items-center gap-2">
                            <div className={`${getPlatformLightColor(detailedContent.platform)} p-2 rounded-full`}>
                              <PlatformIcon
                                platform={detailedContent.platform}
                                size="sm"
                                className={getPlatformTextColor(detailedContent.platform)}
                              />
                            </div>
                            <div className="flex flex-col">
                              <h2 className={`text-xl font-semibold ${getPlatformTextColor(detailedContent.platform)}`}>
                                {getPlatformDisplayName(detailedContent.platform)}
                              </h2>
                              {aiTrendsMode && (
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Zap className="h-3 w-3" />
                                  <span>AI Trends</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full h-9 gap-1 text-sm font-medium text-gray-600 border-gray-200"
                            onClick={() => handleRegenerateIdeas(detailedContent.platform!)}
                            disabled={detailedContent.isRegenerating || false}
                          >
                            {detailedContent.isRegenerating ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Sparkles className="h-3.5 w-3.5" />
                            )}
                            Regenerate
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                      {detailedContent.isRegenerating ? (
                        <div className="flex flex-col items-center justify-center py-24">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 via-purple-100/30 to-pink-100/30 rounded-full blur-xl"></div>
                            <Loader2 className="h-14 w-14 animate-spin text-gray-400 relative z-10" />
                          </div>
                          <p className="text-gray-500 mt-6 font-medium text-lg">Generating fresh content ideas...</p>
                          <p className="text-gray-400 text-sm mt-2">This may take a moment</p>
                        </div>
                      ) : selectedIdea ? (
                        <div className="p-0">
                          {/* Idea detail view - Cleaner, more minimal design */}
                          <div className="border-b border-gray-200 bg-white p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full h-9 text-gray-600 hover:bg-gray-100 border-gray-200 flex items-center gap-2"
                                onClick={handleBackFromIdea}
                              >
                                <ArrowLeft className="h-4 w-4" />
                                <span>Back to ideas</span>
                              </Button>
                              <h3 className="font-medium text-gray-900">{selectedIdea.title}</h3>
                            </div>
                            <div className="flex items-center gap-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-9 w-9 p-0 rounded-full border-gray-200"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        const content = getPlatformFields(detailedContent.platform!, selectedIdea)
                                          .map((field) => `${field.label}: ${field.value}`)
                                          .join("\n\n")
                                        copyToClipboard(content, "all")
                                      }}
                                    >
                                      {copiedContent === "all" ? (
                                        <Check className="h-4 w-4 text-blue-500" />
                                      ) : (
                                        <Copy className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{copiedContent === "all" ? "Copied!" : "Copy all content"}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>

                          <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {getPlatformFields(detailedContent.platform!, selectedIdea).map((field, index) => (
                                <div
                                  key={index}
                                  className={`${field.label === "Video Outline" ? "md:col-span-2" : ""}`}
                                >
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        {getFieldIcon(field.icon)}
                                        {field.label}
                                      </h4>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 w-7 p-0 rounded-full"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          copyToClipboard(field.value, `field-${index}`)
                                        }}
                                      >
                                        {copiedContent === `field-${index}` ? (
                                          <Check className="h-3.5 w-3.5 text-blue-500" />
                                        ) : (
                                          <Copy className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600" />
                                        )}
                                      </Button>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 min-h-[100px] max-h-[300px] overflow-auto">
                                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                        {field.value}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Action buttons */}
                            <div className="mt-6 flex flex-wrap justify-between items-center gap-4">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant={expandedDesigns.includes(0) ? "default" : "outline"}
                                  size="sm"
                                  className={`rounded-full px-4 py-1 h-9 ${
                                    expandedDesigns.includes(0)
                                      ? "bg-gray-800 hover:bg-gray-700 text-white"
                                      : "text-gray-600 border-gray-200"
                                  } font-medium`}
                                  onClick={() => handleToggleDesignDetails(0)}
                                >
                                  {expandedDesigns.includes(0) ? "Hide Design Details" : "Show Design Details"}
                                </Button>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full px-4 py-1 h-9 text-gray-600 hover:text-gray-900 font-medium border-gray-200"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  const content = getPlatformFields(detailedContent.platform!, selectedIdea)
                                    .map((field) => `${field.label}: ${field.value}`)
                                    .join("\n\n")
                                  copyToClipboard(content, "content")
                                }}
                              >
                                {copiedContent === "content" ? (
                                  <>
                                    <Check className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
                                    Copied!
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3.5 w-3.5 mr-1.5" />
                                    Copy Caption
                                  </>
                                )}
                              </Button>
                            </div>

                            {/* Design Details Section - Cleaner, more minimal design */}
                            <AnimatePresence>
                              {expandedDesigns.includes(0) && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <div className="mt-6 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                                    <h4 className="text-base font-medium text-gray-800 mb-4 flex items-center gap-2">
                                      <Sparkles className="h-4 w-4" />
                                      Design Direction
                                    </h4>

                                    {/* Content Type Indicator */}
                                    {detailedContent.platform === "instagram" && (
                                      <div className="mb-4">
                                        <Badge
                                          className={`${
                                            selectedIdea.contentType === "reel"
                                              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                                              : "bg-gradient-to-r from-amber-400 to-orange-500 text-white"
                                          } px-3 py-1`}
                                        >
                                          {selectedIdea.contentType === "reel" ? "Instagram Reel" : "Instagram Post"}
                                        </Badge>

                                        {selectedIdea.contentType === "reel" && (
                                          <div className="mt-3 bg-purple-50 rounded-lg p-3 border border-purple-100">
                                            <h5 className="text-sm font-medium text-purple-700 mb-2 flex items-center gap-2">
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="lucide lucide-music"
                                              >
                                                <path d="M9 18V5l12-2v13" />
                                                <circle cx="6" cy="18" r="3" />
                                                <circle cx="18" cy="16" r="3" />
                                              </svg>
                                              Trending Music Options
                                            </h5>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                              <div className="bg-white rounded-lg p-2 border border-purple-100 shadow-sm">
                                                <p className="text-xs font-medium text-purple-800">Option 1</p>
                                                <p className="text-sm text-gray-700">
                                                  {selectedIdea.musicOptions?.[0] || "In The Stars - Benson Boone"}
                                                </p>
                                              </div>
                                              <div className="bg-white rounded-lg p-2 border border-purple-100 shadow-sm">
                                                <p className="text-xs font-medium text-purple-800">Option 2</p>
                                                <p className="text-sm text-gray-700">
                                                  {selectedIdea.musicOptions?.[1] ||
                                                    "Birds of a Feather - Billie Eilish"}
                                                </p>
                                              </div>
                                            </div>
                                            <div className="mt-2 text-xs text-purple-600">
                                              <p>
                                                Optimal duration:{" "}
                                                <span className="font-medium">
                                                  {selectedIdea.duration || "15-30 seconds"}
                                                </span>
                                              </p>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    {detailedContent.platform === "youtube" && (
                                      <div className="mb-4">
                                        <Badge
                                          className={`${
                                            selectedIdea.contentType === "shorts"
                                              ? "bg-gradient-to-r from-red-500 to-rose-500 text-white"
                                              : "bg-gradient-to-r from-red-700 to-red-900 text-white"
                                          } px-3 py-1`}
                                        >
                                          {selectedIdea.contentType === "shorts"
                                            ? "YouTube Shorts"
                                            : "YouTube Long-form"}
                                        </Badge>

                                        <div className="mt-3 bg-red-50 rounded-lg p-3 border border-red-100">
                                          <div className="text-xs text-red-700">
                                            <p>
                                              Optimal duration:{" "}
                                              <span className="font-medium">
                                                {selectedIdea.contentType === "shorts"
                                                  ? selectedIdea.duration || "30-60 seconds"
                                                  : selectedIdea.duration || "8-15 minutes"}
                                              </span>
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    {/* Visual Elements as Shot Cards */}
                                    <div className="space-y-4">
                                      <h5 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="16"
                                          height="16"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          className="lucide lucide-camera"
                                        >
                                          <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                                          <circle cx="12" cy="13" r="3" />
                                        </svg>
                                        Shot Sequence
                                      </h5>

                                      {selectedIdea.designDetails?.shotList &&
                                      selectedIdea.designDetails.shotList.length > 0 ? (
                                        <div className="grid grid-cols-1 gap-4">
                                          {selectedIdea.designDetails.shotList.map((shot: string, i: number) => (
                                            <div
                                              key={i}
                                              className="bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
                                            >
                                              <div className="p-3 flex items-start gap-3">
                                                <div className="flex-shrink-0 bg-gray-100 rounded-full h-8 w-8 flex items-center justify-center text-sm font-bold text-gray-700">
                                                  {i + 1}
                                                </div>
                                                <div className="flex-1">
                                                  <div className="text-sm text-gray-700">{shot}</div>

                                                  {detailedContent.platform === "instagram" &&
                                                    selectedIdea.contentType === "reel" && (
                                                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                                                        <svg
                                                          xmlns="http://www.w3.org/2000/svg"
                                                          width="12"
                                                          height="12"
                                                          viewBox="0 0 24 24"
                                                          fill="none"
                                                          stroke="currentColor"
                                                          strokeWidth="2"
                                                          strokeLinecap="round"
                                                          strokeLinejoin="round"
                                                          className="lucide lucide-clock"
                                                        >
                                                          <circle cx="12" cy="12" r="10" />
                                                          <polyline points="12 6 12 12 16 14" />
                                                        </svg>
                                                        <span>
                                                          {i === 0
                                                            ? "0:00 - 0:05"
                                                            : i === 1
                                                              ? "0:05 - 0:12"
                                                              : i === 2
                                                                ? "0:12 - 0:20"
                                                                : `0:${20 + (i - 2) * 5} - 0:${25 + (i - 2) * 5}`}
                                                        </span>
                                                      </div>
                                                    )}

                                                  {detailedContent.platform === "youtube" &&
                                                    selectedIdea.contentType === "shorts" && (
                                                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                                                        <svg
                                                          xmlns="http://www.w3.org/2000/svg"
                                                          width="12"
                                                          height="12"
                                                          viewBox="0 0 24 24"
                                                          fill="none"
                                                          stroke="currentColor"
                                                          strokeWidth="2"
                                                          strokeLinecap="round"
                                                          strokeLinejoin="round"
                                                          className="lucide lucide-clock"
                                                        >
                                                          <circle cx="12" cy="12" r="10" />
                                                          <polyline points="12 6 12 12 16 14" />
                                                        </svg>
                                                        <span>
                                                          {i === 0
                                                            ? "0:00 - 0:10"
                                                            : i === 1
                                                              ? "0:10 - 0:20"
                                                              : i === 2
                                                                ? "0:20 - 0:35"
                                                                : `0:${35 + (i - 2) * 8} - 0:${43 + (i - 2) * 8}`}
                                                        </span>
                                                      </div>
                                                    )}
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <p className="text-sm text-gray-500 italic">
                                          No shot sequence available for this content idea.
                                        </p>
                                      )}
                                    </div>

                                    {/* Technical Specifications */}
                                    <div className="mt-5">
                                      <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="16"
                                          height="16"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          className="lucide lucide-settings"
                                        >
                                          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                                          <circle cx="12" cy="12" r="3" />
                                        </svg>
                                        Technical Specifications
                                      </h5>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {selectedIdea.designDetails?.technicalSpecs &&
                                        selectedIdea.designDetails.technicalSpecs.length > 0 ? (
                                          selectedIdea.designDetails.technicalSpecs.map((spec: string, i: number) => (
                                            <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                              <p className="text-sm text-gray-700">{spec}</p>
                                            </div>
                                          ))
                                        ) : (
                                          <p className="text-sm text-gray-500 italic md:col-span-2">
                                            No technical specifications available for this content idea.
                                          </p>
                                        )}
                                      </div>
                                    </div>

                                    {/* Designer Notes */}
                                    <div className="mt-5 bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                                      <h5 className="text-sm font-medium text-amber-700 mb-2 flex items-center gap-2">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="16"
                                          height="16"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          className="lucide lucide-lightbulb"
                                        >
                                          <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                                          <path d="M9 18h6" />
                                          <path d="M10 22h4" />
                                        </svg>
                                        Designer Notes
                                      </h5>
                                      {selectedIdea.designDetails?.designerNotes ? (
                                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                          {selectedIdea.designDetails.designerNotes}
                                        </p>
                                      ) : (
                                        <p className="text-sm text-gray-500 italic">
                                          No designer notes available for this content idea.
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      ) : (
                        <div>
                          {/* Tabs for Content Ideas and Strategy & Stats */}
                          <Tabs defaultValue="ideas" value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <div className="border-b border-gray-200">
                              <div className="px-4 py-4">
                                <TabsList className="bg-gray-100 h-9 p-1 w-auto inline-flex gap-1 rounded-lg">
                                  <TabsTrigger
                                    value="ideas"
                                    className="rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-200"
                                  >
                                    Content Ideas
                                  </TabsTrigger>
                                  <TabsTrigger
                                    value="stats"
                                    className="rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-200"
                                  >
                                    Strategy & Stats
                                  </TabsTrigger>
                                </TabsList>
                              </div>
                            </div>

                            {/* Tab Content */}
                            <TabsContent value="ideas" className="m-0 outline-none">
                              <div className="p-4 flex items-center justify-between border-b border-gray-100">
                                <h3 className="text-lg font-medium text-gray-800">
                                  {aiTrendsMode ? "AI Trend Content Ideas" : "Content Ideas"}
                                </h3>
                                <Badge variant="outline" className="text-gray-600 border-gray-200">
                                  {detailedContent.content.ideas.length} ideas
                                </Badge>
                              </div>

                              <div className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {detailedContent.content.ideas.map((idea, index) => {
                                    // Get the first field to display as preview
                                    const previewFields = getPlatformFields(detailedContent.platform!, idea)
                                    const previewText =
                                      previewFields.length > 0
                                        ? previewFields[0].value.substring(0, 80) + "..."
                                        : "No preview available"

                                    return (
                                      <div
                                        key={index}
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleSelectIdea(idea)
                                        }}
                                        className="bg-white border border-gray-200 shadow-sm rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                                      >
                                        <div className="flex items-start">
                                          <div className="flex-1">
                                            <h4 className="font-medium text-gray-900 mb-2">{idea.title}</h4>
                                            <p className="text-sm text-gray-500 line-clamp-2">{previewText}</p>
                                            {aiTrendsMode && (
                                              <div className="mt-3 flex items-center gap-1.5">
                                                <div className="bg-gray-100 rounded-full p-1">
                                                  <Zap className="h-3 w-3 text-gray-600" />
                                                </div>
                                                <span className="text-xs font-medium text-gray-600">AI Trend</span>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            </TabsContent>

                            <TabsContent value="stats" className="m-0 outline-none">
                              <div className="p-4">
                                <h3 className="text-lg font-medium text-gray-800 mb-4">Strategy & Stats</h3>
                                <p className="text-sm text-gray-600">
                                  Here you can find detailed insights and statistics about your content strategy on{" "}
                                  {getPlatformDisplayName(detailedContent.platform)}.
                                </p>
                                {/* Display stats and content mix data here */}
                                {detailedContent.content.stats && (
                                  <div className="mt-6">
                                    <h4 className="text-md font-medium text-gray-700 mb-2">Engagement Stats</h4>
                                    <ul className="list-disc pl-5 text-sm text-gray-600">
                                      {detailedContent.content.stats.engagementRate && (
                                        <li>Engagement Rate: {detailedContent.content.stats.engagementRate}</li>
                                      )}
                                      {detailedContent.content.stats.averageViewDuration && (
                                        <li>
                                          Average View Duration: {detailedContent.content.stats.averageViewDuration}
                                        </li>
                                      )}
                                      {detailedContent.content.stats.clickThroughRate && (
                                        <li>Click Through Rate: {detailedContent.content.stats.clickThroughRate}</li>
                                      )}
                                    </ul>
                                  </div>
                                )}

                                {detailedContent.content.contentMix && (
                                  <div className="mt-6">
                                    <h4 className="text-md font-medium text-gray-700 mb-2">Content Mix</h4>
                                    <p className="text-sm text-gray-600">Recommended content categories and formats:</p>
                                    {detailedContent.content.contentMix.categories && (
                                      <div className="mt-2">
                                        <h5 className="text-sm font-medium text-gray-700">Categories:</h5>
                                        <ul className="list-disc pl-5 text-sm text-gray-600">
                                          {detailedContent.content.contentMix.categories.map((category, index) => (
                                            <li key={index}>{category}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                    {detailedContent.content.contentMix.formats && (
                                      <div className="mt-2">
                                        <h5 className="text-sm font-medium text-gray-700">Formats:</h5>
                                        <ul className="list-disc pl-5 text-sm text-gray-600">
                                          {detailedContent.content.contentMix.formats.map((format, index) => (
                                            <li key={index}>{format}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </TabsContent>
                          </Tabs>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      )}
    </main>
  )
}
