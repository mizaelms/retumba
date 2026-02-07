"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/mode-toggle"

export function MainNav() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center px-4">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <img src="/images/logo.jpg" alt="Retumba" className="h-10 w-auto rounded-full" />
          </Link>
          <nav className="flex items-center gap-2 text-sm font-medium">
            <Link
              href="/"
              className={cn(
                "transition-colors hover:text-foreground/80 flex items-center gap-2",
                pathname === "/" ? "text-foreground" : "text-foreground/60"
              )}
            >
              <Home className="h-4 w-4" />
            </Link>

            {pathname.split('/').filter(Boolean).map((segment, index) => (
              <div key={index} className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground/60 max-w-[150px] truncate">{segment}</span>
              </div>
            ))}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center gap-2">
            <Link
              href="/admin/posts"
              className={cn(
                "text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
              )}
            >
              Admin
            </Link>
            <Link
              href="/login"
              className={cn(
                "text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
              )}
            >
              Login
            </Link>
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
