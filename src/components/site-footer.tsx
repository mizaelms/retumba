import { Facebook } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="py-6 md:px-8 md:py-0 border-t border-border/40">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built by <a href="#" className="font-medium underline underline-offset-4">Retumba Team</a>.
          The source code is available on <a href="#" className="font-medium underline underline-offset-4">GitHub</a>.
        </p>
        <div className="flex items-center gap-4">
          <a href="https://www.facebook.com/RTMBpage/?locale=es_LA" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
            <Facebook className="h-5 w-5" />
            <span className="sr-only">Facebook</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
