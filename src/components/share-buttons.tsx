"use client"

import { useEffect, useState } from "react"
import { Facebook, Twitter, Link as LinkIcon, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ShareButtons() {
  const [url, setUrl] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setUrl(window.location.href)
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!url) return null

  const encodedUrl = encodeURIComponent(url)

  return (
    <div className="flex items-center gap-2 mt-8 justify-center">
      <span className="text-sm text-muted-foreground mr-2">Share:</span>
      <Button variant="outline" size="icon" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank')}>
        <Facebook className="h-4 w-4" />
        <span className="sr-only">Share on Facebook</span>
      </Button>
      <Button variant="outline" size="icon" onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}`, '_blank')}>
        <Twitter className="h-4 w-4" />
        <span className="sr-only">Share on Twitter</span>
      </Button>
      <Button variant="outline" size="icon" onClick={handleCopy}>
        {copied ? <Check className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
        <span className="sr-only">Copy Link</span>
      </Button>
    </div>
  )
}
