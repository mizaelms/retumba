import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { MainNav } from "@/components/main-nav";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Retumba Music Blog",
  description: "Dark rock, goth, industrial, post-punk, metal alternativo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased flex flex-col">
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <MainNav />
            <div className="flex-1">
              {children}
            </div>
            <SiteFooter />
          </ThemeProvider>
      </body>
    </html>
  );
}
