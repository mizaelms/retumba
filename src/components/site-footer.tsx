import { Facebook, Instagram, Youtube, Mail, Music } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="py-6 md:px-8 md:py-0 border-t border-border/40">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-24 px-4">
        <div className="flex flex-col items-center md:items-start gap-2">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by <a href="#" className="font-medium underline underline-offset-4">Retumba Team</a>.
          </p>
          <a href="mailto:promo@rtmbmusic.com" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Mail className="h-4 w-4" />
            promo@rtmbmusic.com
          </a>
        </div>

        <div className="flex items-center gap-4">
          <a href="https://www.instagram.com/rtmbmusic" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
            <Instagram className="h-5 w-5" />
            <span className="sr-only">Instagram</span>
          </a>
          <a href="https://www.youtube.com/@RETUMBA" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
            <Youtube className="h-5 w-5" />
            <span className="sr-only">YouTube</span>
          </a>
          <a href="https://tiktok.com/@retumbamusic" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
            <Music className="h-5 w-5" />
            <span className="sr-only">TikTok</span>
          </a>
          <a href="https://www.facebook.com/RTMBpage/?locale=es_LA" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
            <Facebook className="h-5 w-5" />
            <span className="sr-only">Facebook</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
