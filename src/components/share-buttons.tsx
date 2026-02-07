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
      <span className="text-sm text-muted-foreground mr-2 dark:text-muted-foreground text-stone-800 font-bold tracking-tight">Share:</span>
      <Button variant="outline" size="icon" className="bg-transparent dark:bg-background dark:border-border border-2 border-stone-800 text-stone-900 hover:bg-stone-200 hover:text-black dark:hover:bg-accent dark:text-foreground" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank')}>
        <Facebook className="h-4 w-4" />
        <span className="sr-only">Share on Facebook</span>
      </Button>
      <Button variant="outline" size="icon" className="bg-transparent dark:bg-background dark:border-border border-2 border-stone-800 text-stone-900 hover:bg-stone-200 hover:text-black dark:hover:bg-accent dark:text-foreground" onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}`, '_blank')}>
        <Twitter className="h-4 w-4" />
        <span className="sr-only">Share on Twitter</span>
      </Button>
      <Button variant="outline" size="icon" className="bg-transparent dark:bg-background dark:border-border border-2 border-stone-800 text-stone-900 hover:bg-stone-200 hover:text-black dark:hover:bg-accent dark:text-foreground" onClick={handleCopy}>
        {copied ? <Check className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
        <span className="sr-only">Copy Link</span>
      </Button>
    </div>
  )
}
