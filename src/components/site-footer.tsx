export function SiteFooter() {
  return (
    <footer className="py-6 md:px-8 md:py-0 border-t border-border/40">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built by <a href="#" className="font-medium underline underline-offset-4">Retumba Team</a>.
          The source code is available on <a href="#" className="font-medium underline underline-offset-4">GitHub</a>.
        </p>
      </div>
    </footer>
  )
}
